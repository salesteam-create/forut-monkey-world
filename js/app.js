// Monki's World: clickable concept prototype.
// Single-page vanilla JS. Screens are rendered into #screen; state lives in memory and,
// when the browser allows it, in localStorage so a demo survives a reload.
(function () {
  const STORE_KEY = 'monkis-world-demo-v3';
  const GOAL = 24;
  const MYSTERY_AT = 20;
  const NATION_BASE = 412380; // example national total for the pitch
  const PLAY_DAY = new Date(2028, 5, 11);
  const DEMO_DATE = new Date(2027, 9, 22);
  // Demo "today": Friday 22 October 2027, first autumn of the Nepal campaign.
  const TODAY = 22;
  const MONTH_OFFSET = 4; // 1 October 2027 is a Friday (Monday-first grid)
  const DAYS_IN_MONTH = 31;

  const DEFAULT_STATE = {
    lang: 'no',
    sound: true,
    onboarded: false,
    bananas: 17,
    activeDays: [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 18, 19, 20, 21],
    missionsWeek: 3,
    feelingsWeek: 2,
    screenSeconds: 60,
    screenLimit: 10,
    nightOverride: false,
    lastStage: 2,
    reminder: true
  };

  let state = load();
  let screen = state.onboarded ? 'hub' : 'welcome';
  let lastUnlocked = null;
  let justAdded = false;
  let timers = [];
  let huntFound = {};
  let currentSong = null;
  let walkSeen = {};
  let currentDish = null;
  let dishDone = {};

  // ---------- storage ----------
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
    } catch (e) { /* storage blocked: run in memory */ }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) { /* storage blocked: progress lives in memory only */ }
  }

  // ---------- i18n ----------
  function t(key, vars) {
    const dict = window.I18N[state.lang];
    let v = key.split('.').reduce((o, k) => (o == null ? o : o[k]), dict);
    if (v == null) v = key;
    if (typeof v === 'string' && vars) {
      v = v.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));
    }
    return v;
  }
  function esc(str) {
    return String(str).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // ---------- voice ----------
  let voices = [];
  function loadVoices() { try { voices = speechSynthesis.getVoices(); } catch (e) {} }
  if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }
  // Recorded audio is used when a file exists for the line (see assets/voice/manifest.json);
  // otherwise the browser's own voice reads it.
  let manifest = { no: {}, en: {} };
  try {
    fetch('assets/voice/manifest.json', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(m => { if (m) { manifest = Object.assign(manifest, m); showCredit(); } })
      .catch(() => {});
  } catch (e) {}
  let clip = null;
  // The ElevenLabs free plan requires attribution wherever its voices are used.
  function showCredit() {
    document.querySelectorAll('.voice-credit').forEach(el => { el.hidden = !manifest.credit; });
  }
  function stopVoice() {
    if (clip) { try { clip.pause(); } catch (e) {} clip = null; }
    try { speechSynthesis.cancel(); } catch (e) {}
  }
  function say(key, vars) { speak(t(key, vars), key); }
  function speak(text, key) {
    const bubble = document.querySelector('.bubble');
    if (bubble) {
      bubble.textContent = text;
      bubble.classList.remove('talk'); void bubble.offsetWidth; bubble.classList.add('talk');
    }
    if (!state.sound) return;
    stopVoice();
    const file = key && (manifest[state.lang] || {})[window.voiceFile(key)];
    if (file) {
      clip = new Audio('assets/voice/' + file);
      clip.play().catch(() => tts(text));
      return;
    }
    tts(text);
  }
  // Prefer the higher-quality voices some devices ship ("Natural", "Enhanced", "Premium").
  const GOOD_VOICE = /natural|neural|enhanced|premium|online|siri/i;
  function tts(text) {
    if (!('speechSynthesis' in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      const want = state.lang === 'no' ? /^(nb|no|nn)/i : /^en/i;
      const matches = voices.filter(v => want.test(v.lang));
      const voice = matches.find(v => GOOD_VOICE.test(v.name)) || matches.find(v => v.localService === false) || matches[0];
      u.lang = state.lang === 'no' ? 'nb-NO' : 'en-GB';
      if (voice) u.voice = voice;
      // A small lift keeps Monki friendly; a big pitch shift is what makes TTS sound robotic.
      u.rate = 0.92;
      u.pitch = 1.08;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ---------- helpers ----------
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  function go(next) {
    screen = next;
    timers.forEach(clearTimeout);
    timers = [];
    if (typeof stopJingle === 'function') stopJingle();
    const fx = $('#fx');
    if (fx) fx.innerHTML = '';
    render();
    const el = $('#screen');
    if (el) el.scrollTop = 0;
  }
  function monki(extra) {
    return `<img class="monki ${extra || ''}" src="assets/characters/monki.png" alt="Monki">`;
  }
  function backBtn(target) {
    return `<button class="back" data-go="${target}" aria-label="${esc(t('back'))}">${ART.icons.back}<span>${esc(t('back'))}</span></button>`;
  }
  function confetti() {
    const host = $('#fx');
    const colors = ['#ffd23f', '#e8513f', '#3a7bd5', '#56b36a', '#ff8ac2'];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = Math.random() * 0.4 + 's';
      c.style.animationDuration = 1.6 + Math.random() * 1.2 + 's';
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      host.appendChild(c);
      setTimeout(() => c.remove(), 3400);
    }
  }
  // How far the hub jungle has grown this month.
  function stage(n) {
    return n >= 24 ? 4 : n >= 18 ? 3 : n >= 12 ? 2 : n >= 6 ? 1 : 0;
  }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function addBanana() {
    const before = state.bananas;
    state.bananas = Math.min(GOAL, state.bananas + 1);
    if (!state.activeDays.includes(TODAY)) state.activeDays.push(TODAY);
    const rewards = t('rewards');
    lastUnlocked = rewards.find(r => before < r.at && state.bananas >= r.at) || null;
    if (before < MYSTERY_AT && state.bananas >= MYSTERY_AT) {
      lastUnlocked = { title: t('mysteryName'), sub: t('mysteryUnlocked'), mystery: true };
    }
    justAdded = true;
    save();
  }

  // ---------- top bar ----------
  function renderTopbar() {
    $('#topbar').innerHTML = `
      <button class="brand" data-go="hub" aria-label="${esc(t('appName'))}">
        <img class="brand-logo" src="assets/brand/monkis-world-logo.png" alt="${esc(t('appName'))}">
      </button>
      <div class="top-actions">
        <button class="pill banana-pill" data-go="tree" aria-label="${esc(t('tileTree'))}">${ART.bananaIcon}<b>${state.bananas}</b></button>
        <button class="pill icon" id="toggle-sound" aria-label="${esc(t('sound'))}" aria-pressed="${state.sound}">${state.sound ? ART.icons.sound : ART.icons.mute}</button>
        <button class="pill" id="toggle-lang" aria-label="Language">${esc(t('switchTo'))}</button>
      </div>`;
  }

  // ---------- screens ----------
  const screens = {
    welcome() {
      return `
      <section class="welcome">
        <div class="scene-bg">${ART.jungle(stage(state.bananas))}</div>
        <div class="welcome-card card">
          <img class="welcome-brand" src="assets/brand/monkis-world-logo.png" alt="${esc(t('appName'))}">
          <p class="kicker">${esc(t('welcomeKicker'))}</p>
          <h1>${esc(t('welcomeTitle'))}</h1>
          <div class="welcome-hero">${monki('wave')}</div>
          <p>${esc(t('welcomeBody'))}</p>
          <ul class="promises">
            <li>${ART.icons.check}${esc(t('promiseAds'))}</li>
            <li>${ART.icons.check}${esc(t('promiseAlgo'))}</li>
            <li>${ART.icons.check}${esc(t('promiseTime'))}</li>
          </ul>
          <button class="btn primary big" id="start">${esc(t('start'))}</button>
          <p class="fine">${esc(t('scanned'))}</p>
          <img class="welcome-logo" src="assets/brand/forut-logo.png" alt="FORUT">
          <p class="fine voice-credit" hidden>${esc(t('voiceCredit'))}</p>
        </div>
      </section>`;
    },

    hub() {
      const friends = ['yanay', 'orbai', 'suala', 'palaiya'];
      const left = Math.max(0, MYSTERY_AT - state.bananas);
      const tile = (cls, go, art, title, sub) => `
          <button class="tile ${cls}" data-go="${go}">
            <span class="tile-art">${art}</span>
            <b>${esc(title)}</b><small>${esc(sub)}</small>
          </button>`;
      return `
      <section class="hub">
        <div class="scene-bg">${ART.jungle(stage(state.bananas))}</div>
        <div class="hub-hero">
          <div class="bubble">${esc(t('hubGreeting'))}</div>
          <button class="monki-btn" id="monki-talk" aria-label="Monki">${monki('bob')}</button>
        </div>
        <button class="tile tile-mission tile-wide" data-go="mission">
          <span class="tile-art">${ART.items.boots}</span>
          <span class="tile-text"><b>${esc(t('tileMission'))}</b><small>${esc(t('tileMissionSub'))}</small></span>
        </button>
        <p class="sec-label">${esc(t('secPlay'))}</p>
        <div class="tiles">
          ${tile('tile-hunt', 'hunt', ART.hunt.leaf, t('tileHunt'), t('tileHuntSub'))}
          ${tile('tile-walk', 'walk', ART.walk.bird, t('tileWalk'), t('tileWalkSub'))}
        </div>
        <p class="sec-label">${esc(t('secFeel'))}</p>
        <div class="tiles">
          ${tile('tile-feel', 'feelings', ART.face('happy'), t('tileFeelings'), t('tileFeelingsSub'))}
          ${tile('tile-breathe', 'breathe', `<img src="assets/characters/palaiya.png" alt="">`, t('tileBreathe'), t('tileBreatheSub'))}
        </div>
        <p class="sec-label">${esc(t('secTogether'))}</p>
        <div class="tiles">
          ${tile('tile-food', 'food', ART.dish('#ffb347', '#56b36a'), t('tileFood'), t('tileFoodSub'))}
          ${tile('tile-songs', 'songs', ART.media.note, t('tileSongs'), t('tileSongsSub'))}
        </div>
        <div class="tiles tiles-gap">
          ${tile('tile-tree', 'tree', ART.bananaIcon, t('tileTree'), t('tileTreeSub', { n: state.bananas, goal: GOAL }))}
          ${tile('tile-parents', 'gate', `<span class="lock">${ART.icons.lock}</span>`, t('tileParents'), t('tileParentsSub'))}
        </div>
        <div class="friends card">
          <p class="kicker">${esc(t('friendsTitle'))}</p>
          <div class="friend-row">
            ${friends.map(f => `<button class="friend" data-friend="${f}" aria-label="${f}"><img src="assets/characters/${f}.png" alt="${f}"></button>`).join('')}
            <button class="friend mystery ${left ? '' : 'open'}" id="mystery" aria-label="${esc(t('mysteryName'))}">
              ${ART.silhouette}
              <small>${esc(left ? t('mysteryLocked', { n: left }) : t('mysteryName'))}</small>
            </button>
          </div>
          <p class="fine stage-hint">${esc(t('stageHint'))}</p>
        </div>
      </section>`;
    },

    postcard() {
      return `
      <section class="postcard">
        ${backBtn('hub')}
        <div class="card center">
          <p class="kicker">${ART.icons.globe}${esc(t('postcardTitle'))}</p>
          <div class="postcard-art">${ART.nepal}<span class="postcard-friend">${ART.silhouette}</span></div>
          <div class="bubble">${esc(t('postcardSay'))}</div>
          <ul class="hints">${t('postcardHints').map(h => `<li>${ART.icons.star}<span>${esc(h)}</span></li>`).join('')}</ul>
          <p>${esc(t('postcardBody'))}</p>
          <p class="fine">${esc(t('postcardNote'))}</p>
          <button class="btn primary big" data-go="hub">${esc(t('toHub'))}</button>
        </div>
      </section>`;
    },

    hunt() {
      const keys = ['red', 'soft', 'round', 'leaf'];
      const all = keys.every(k => huntFound[k]);
      return `
      <section class="hunt">
        ${backBtn('hub')}
        <div class="card center">
          <h1>${esc(t('huntTitle'))}</h1>
          <div class="bubble">${esc(t('huntSay'))}</div>
          <div class="hunt-grid">
            ${keys.map(k => `<button class="hunt-card ${huntFound[k] ? 'found' : ''}" data-hunt="${k}" aria-pressed="${!!huntFound[k]}">
              ${ART.hunt[k]}<span>${esc(t('huntItems.' + k))}</span><i class="tick">${ART.icons.check}</i></button>`).join('')}
          </div>
          <p class="parent-note">${esc(t('huntParent'))}</p>
          <button class="btn primary big" id="hunt-done" ${all ? '' : 'disabled'}>${ART.icons.check}<span>${esc(t('huntDone'))}</span></button>
        </div>
      </section>`;
    },

    breathe() {
      return `
      <section class="breathe">
        ${backBtn('hub')}
        <div class="card center">
          <h1>${esc(t('breatheTitle'))}</h1>
          <div class="bubble">${esc(t('breatheSay'))}</div>
          <div class="breath-stage">
            <span class="breath-ring" id="ring"></span>
            <img class="breath-palaiya" id="palaiya" src="assets/characters/palaiya.png" alt="Palaiya">
          </div>
          <p class="breath-word" id="breath-word">&nbsp;</p>
          <p class="fine" id="breath-count">&nbsp;</p>
          <button class="btn primary big" id="breath-start">${esc(t('breatheStart'))}</button>
          <button class="btn primary big hidden" id="breath-done">${ART.icons.check}<span>${esc(t('breatheFinish'))}</span></button>
          <p class="parent-note">${esc(t('breatheParent'))}</p>
        </div>
      </section>`;
    },

    songs() {
      return `
      <section class="songs">
        ${backBtn('hub')}
        <div class="card center">
          <h1>${esc(t('songsTitle'))}</h1>
          <div class="bubble">${esc(t('songsSay'))}</div>
          <p class="promise-line">${ART.icons.check}${esc(t('songsPromise'))}</p>
        </div>
        <div class="song-list">
          ${t('songs').map(sg => `
          <button class="song-card" data-song="${sg.id}" style="--tint:${sg.color}">
            <span class="song-art"><img src="assets/characters/${sg.char}.png" alt=""><i>${sg.kind === 'film' ? ART.media.film : ART.media.note}</i></span>
            <span class="song-text"><b>${esc(sg.title)}</b><small>${esc(sg.sub)}</small>
              ${sg.real ? '' : `<em>${esc(t('songsExample'))}</em>`}</span>
            <span class="song-play">${ART.icons.play}</span>
          </button>`).join('')}
        </div>
      </section>`;
    },

    song() {
      const sg = t('songs').find(x => x.id === currentSong) || t('songs')[0];
      const url = sg.url || 'https://www.youtube.com/results?search_query=FORUT+Barneaksjonen';
      return `
      <section class="song">
        ${backBtn('songs')}
        <div class="card center">
          <div class="player" style="--tint:${sg.color}">
            <img src="assets/characters/${sg.char}.png" alt="">
            <a class="player-play" href="${url}" target="_blank" rel="noopener" aria-label="${esc(t('songPlay'))}">${ART.icons.play}</a>
          </div>
          <h1>${esc(sg.title)}</h1>
          <p class="fine">${esc(t('songNote'))}</p>
          <div class="after">
            <p class="kicker">${esc(t('songAfterTitle'))}</p>
            <div class="bubble">${esc(sg.after)}</div>
            <button class="btn primary big" id="song-done">${ART.icons.check}<span>${esc(t('songAfterDone'))}</span></button>
          </div>
        </div>
      </section>`;
    },

    night() {
      return `
      <section class="night">
        <div class="scene-bg">${ART.jungle(stage(state.bananas), true)}</div>
        <div class="card center night-card">
          <h1>${esc(t('nightTitle'))}</h1>
          <div class="bubble">${esc(t('nightSay'))}</div>
          <div class="sleeper">${monki('asleep')}<span class="zzz"><i>z</i><i>z</i><i>z</i></span></div>
          <p class="kicker">${ART.icons.moon}${esc(t('nightIdeas'))}</p>
          <ul class="ideas">${t('nightIdeaList').map(i => `<li>${esc(i)}</li>`).join('')}</ul>
          <p class="fine">${esc(t('nightBack'))}</p>
          <button class="hold" id="hold"><span class="hold-fill"></span><span class="hold-label">${esc(t('nightParent'))}</span></button>
        </div>
      </section>`;
    },

    walk() {
      const keys = Object.keys(ART.walk);
      const n = keys.filter(k => walkSeen[k]).length;
      return `
      <section class="walk">
        ${backBtn('hub')}
        <div class="card center">
          <h1>${esc(t('walkTitle'))}</h1>
          <div class="bubble">${esc(t('walkSay'))}</div>
          <div class="walk-grid">
            ${keys.map(k => `<button class="walk-card ${walkSeen[k] ? 'found' : ''}" data-walk="${k}" aria-pressed="${!!walkSeen[k]}">
              ${ART.walk[k]}<span>${esc(t('walkItems.' + k))}</span><i class="tick">${ART.icons.check}</i></button>`).join('')}
          </div>
          <p class="count" id="walk-count">${esc(t('walkCount', { n }))}</p>
          <p class="parent-note">${esc(t('walkParent'))}</p>
          <button class="btn primary big" id="walk-done" ${n >= 3 ? '' : 'disabled'}>${ART.media.note}<span>${esc(n >= 3 ? t('walkDone') : t('walkMin'))}</span></button>
        </div>
      </section>`;
    },

    jingle() {
      const lines = jingleLines();
      return `
      <section class="jingle">
        <div class="scene-bg">${ART.jungle(stage(state.bananas))}</div>
        <div class="card center">
          <p class="kicker">${ART.media.note}${esc(t('jingleTitle'))}</p>
          <div class="jingle-stage">${monki('dance')}<span class="notes"><i>&#9834;</i><i>&#9835;</i><i>&#9834;</i></span></div>
          <ol class="lyrics" id="lyrics">${lines.map(l => `<li>${esc(l)}</li>`).join('')}</ol>
          <button class="btn outline" id="jingle-play">${ART.icons.play}<span>${esc(t('jinglePlay'))}</span></button>
          <p class="fine">${esc(t('jingleConcept'))}</p>
          <button class="btn primary big" id="jingle-done">${ART.icons.check}<span>${esc(t('jingleDone'))}</span></button>
        </div>
      </section>`;
    },

    food() {
      return `
      <section class="food">
        ${backBtn('hub')}
        <div class="card center">
          <h1>${esc(t('foodTitle'))}</h1>
          <div class="bubble">${esc(t('foodSay'))}</div>
          <p class="fine"><span class="tag">${esc(t('foodNote'))}</span></p>
        </div>
        <div class="dish-grid">
          ${t('dishes').map(d => `<button class="dish-card" data-dish="${d.id}">${ART.dish(d.color, d.accent)}<b>${esc(d.name)}</b></button>`).join('')}
        </div>
      </section>`;
    },

    dish() {
      const d = t('dishes').find(x => x.id === currentDish) || t('dishes')[0];
      const all = d.tasks.every((_, i) => dishDone[i]);
      return `
      <section class="dish">
        ${backBtn('food')}
        <div class="card center">
          <div class="dish-hero">${ART.dish(d.color, d.accent)}</div>
          <h1>${esc(d.name)}</h1>
          <div class="bubble">${esc(t('dishSay'))}</div>
          <ul class="tasks">
            ${d.tasks.map((task, i) => `<li><button class="task ${dishDone[i] ? 'done' : ''}" data-task="${i}" aria-pressed="${!!dishDone[i]}">
              <i class="box">${ART.icons.check}</i><span>${esc(task)}</span></button></li>`).join('')}
          </ul>
          <p class="parent-note">${esc(t('dishSafety'))}</p>
          <button class="btn primary big" id="dish-done" ${all ? '' : 'disabled'}>${ART.icons.check}<span>${esc(t('dishDone'))}</span></button>
        </div>
      </section>`;
    },

    fridge() {
      return `
      <section class="fridge">
        ${backBtn('tree')}
        <div class="card center">
          <h1>${esc(t('fridgeTitle'))}</h1>
          <p>${esc(t('fridgeBody'))}</p>
          <img class="fridge-img" id="fridge-img" alt="${esc(t('fridgeSheetTitle'))}">
          <button class="btn primary big" id="fridge-print">${ART.icons.print}<span>${esc(t('fridgePrint'))}</span></button>
          <p class="fine">${esc(t('fridgeSave'))}</p>
        </div>
      </section>`;
    },

    mission() {
      return `
      <section class="mission">
        ${backBtn('hub')}
        <div class="card center">
          <h1>${esc(t('missionTitle'))}</h1>
          <div class="bubble">${esc(t('missionSay'))}</div>
          <div class="mission-preview">${monki('bob')}<span class="mess">${ART.items.boots}${ART.items.hat}${ART.items.jacket}</span></div>
          <p>${esc(t('missionBody'))}</p>
          <button class="btn primary big" data-go="game">${esc(t('letsGo'))}</button>
        </div>
      </section>`;
    },

    game() {
      // Positions are % of the hallway scene (400 x 520 viewBox).
      const spots = {
        hat: { tx: 36, ty: 11.5, sx: 66, sy: 90, w: 19 },
        jacket: { tx: 21.5, ty: 37, sx: 17, sy: 86, w: 24 },
        bag: { tx: 49, ty: 35, sx: 42, sy: 90, w: 20 },
        boots: { tx: 58.5, ty: 70.5, sx: 88, sy: 88, w: 25 }
      };
      window.__spots = spots;
      const order = ['jacket', 'bag', 'hat', 'boots'];
      return `
      <section class="game">
        ${backBtn('mission')}
        <div class="bubble">${esc(t('gameSay'))}</div>
        <div class="scene" id="scene">
          ${ART.hallway}
          ${order.map(k => {
            const p = spots[k];
            return `<div class="ghost" data-target="${k}" style="left:${p.tx}%;top:${p.ty}%;width:${p.w}%">${ART.items[k]}</div>`;
          }).join('')}
          <img class="scene-monki" src="assets/characters/monki.png" alt="Monki">
          ${order.map(k => {
            const p = spots[k];
            return `<div class="item" data-item="${k}" role="button" aria-label="${esc(t('item' + k[0].toUpperCase() + k.slice(1)))}" style="left:${p.sx}%;top:${p.sy}%;width:${p.w}%">${ART.items[k]}</div>`;
          }).join('')}
        </div>
        <div class="game-foot"><button class="btn primary big hidden" id="game-next" data-go="real">${esc(t('gameNext'))}</button></div>
      </section>`;
    },

    real() {
      return `
      <section class="real">
        ${backBtn('hub')}
        <div class="card center">
          <h1>${esc(t('realTitle'))}</h1>
          <div class="bubble">${esc(t('realSay'))}</div>
          ${monki('bob small')}
          <p class="parent-note">${esc(t('realParent'))}</p>
          <button class="btn primary big" id="real-done">${ART.icons.check}<span>${esc(t('realDone'))}</span></button>
        </div>
      </section>`;
    },

    celebrate() {
      const unlocked = lastUnlocked;
      return `
      <section class="celebrate">
        <div class="scene-bg">${ART.jungle(stage(state.bananas))}</div>
        <div class="card center">
          <h1>${esc(t('celebrateTitle'))}</h1>
          <div class="bubble">${esc(t('celebrateSay'))}</div>
          <div class="celebrate-row">${monki('jump')}<span class="big-banana">${ART.bananaIcon}</span></div>
          <p class="count">${esc(t('treeCount', { n: state.bananas, goal: GOAL }))}</p>
          ${unlocked ? `
          <div class="unlock">
            <span class="unlock-icon">${ART.icons.gift}</span>
            <div><p class="kicker">${esc(t('unlockTitle'))}</p><b>${esc(unlocked.title)}</b><small>${esc(unlocked.sub)}</small></div>
          </div>
          ${unlocked.mystery ? `<button class="btn outline" data-go="postcard">${ART.icons.globe}<span>${esc(t('postcardTitle'))}</span></button>` : ''}` : ''}
          <button class="btn primary big" data-go="tree">${esc(t('toTree'))}</button>
          <button class="btn link" data-go="hub">${esc(t('toHub'))}</button>
        </div>
      </section>`;
    },

    feelings() {
      const keys = ['happy', 'sad', 'angry', 'scared', 'excited'];
      return `
      <section class="feelings">
        ${backBtn('hub')}
        <div class="card center">
          <h1>${esc(t('feelTitle'))}</h1>
          <div class="bubble">${esc(t('feelSay'))}</div>
          ${monki('bob small')}
          <div class="faces">
            ${keys.map(k => `<button class="face" data-feel="${k}">${ART.face(k)}<span>${esc(t('feelings.' + k))}</span></button>`).join('')}
          </div>
          <div class="starter hidden" id="starter">
            <p class="kicker">${ART.icons.heart}${esc(t('feelStarterTitle'))}</p>
            <p class="starter-q" id="starter-q"></p>
            <p class="fine">${esc(t('feelNepal'))}</p>
            <button class="btn primary big" id="feel-done">${ART.icons.check}<span>${esc(t('feelDone'))}</span></button>
          </div>
        </div>
      </section>`;
    },

    tree() {
      const rewards = t('rewards');
      const days = [];
      for (let i = 0; i < MONTH_OFFSET; i++) days.push('<span class="day empty"></span>');
      for (let d = 1; d <= DAYS_IN_MONTH; d++) {
        const on = state.activeDays.includes(d);
        const cls = ['day', on ? 'on' : '', d === TODAY ? 'today' : '', d > TODAY ? 'future' : ''].join(' ');
        days.push(`<span class="${cls}">${d}</span>`);
      }
      const html = `
      <section class="tree">
        ${backBtn('hub')}
        <div class="card center">
          <p class="kicker">${esc(t('treeMonth'))}</p>
          <h1>${esc(t('treeTitle'))}</h1>
          <div class="tree-art">${ART.tree(state.bananas, GOAL, justAdded)}<img class="tree-monki" src="assets/characters/monki.png" alt=""></div>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${GOAL}" aria-valuenow="${state.bananas}">
            <span style="width:${(state.bananas / GOAL) * 100}%"></span>
          </div>
          <p class="count">${esc(t('treeCount', { n: state.bananas, goal: GOAL }))}</p>
          <p class="fine">${esc(t('treeNoStreak'))}</p>
          <button class="btn outline" data-go="fridge">${ART.icons.print}<span>${esc(t('fridgeOpen'))}</span></button>
        </div>
        <div class="card nation">
          <p class="kicker">${ART.icons.globe}${esc(t('nationTitle'))}<em>${esc(t('nationNote'))}</em></p>
          <p class="nation-total">${(NATION_BASE + state.bananas).toLocaleString(state.lang === 'no' ? 'nb-NO' : 'en-GB')}</p>
          <p>${esc(t('nationBody', { mine: state.bananas }))}</p>
          <div class="progress"><span style="width:${((NATION_BASE + state.bananas) / 1000000) * 100}%"></span></div>
          <div class="nation-row"><small>${esc(t('nationGoal'))}</small><small>${esc(t('nationDays', { d: Math.round((PLAY_DAY - DEMO_DATE) / 86400000) }))}</small></div>
          <p class="fine">${esc(t('nationPartner'))}</p>
        </div>
        <div class="card">
          <h2>${esc(t('rewardsTitle'))}</h2>
          <ul class="rewards">
            ${rewards.map(r => {
              const open = state.bananas >= r.at;
              return `<li class="${open ? 'open' : ''}">
                <span class="r-at">${ART.bananaIcon}<b>${r.at}</b></span>
                <div><b>${esc(r.title)}</b><small>${esc(r.sub)}</small></div>
                <span class="r-state">${open ? ART.icons.check : ART.icons.lock}<i>${esc(open ? t('unlocked') : t('locked'))}</i></span>
              </li>`;
            }).join('')}
          </ul>
        </div>
        <div class="card">
          <h2>${esc(t('treeDays'))}</h2>
          <div class="calendar">
            ${t('weekdays').map(w => `<span class="wd">${w}</span>`).join('')}
            ${days.join('')}
          </div>
        </div>
      </section>`;
      justAdded = false;
      return html;
    },

    gate() {
      return `
      <section class="gate">
        ${backBtn('hub')}
        <div class="card center">
          <span class="gate-lock">${ART.icons.lock}</span>
          <h1>${esc(t('gateTitle'))}</h1>
          <p>${esc(t('gateBody'))}</p>
          <button class="hold" id="hold"><span class="hold-fill"></span><span class="hold-label">${esc(t('gateHold'))}</span></button>
        </div>
      </section>`;
    },

    parents() {
      const minutes = Math.max(1, Math.round(state.screenSeconds / 60));
      const pct = Math.min(100, (minutes / state.screenLimit) * 100);
      return `
      <section class="parents">
        ${backBtn('hub')}
        <h1 class="page-title">${esc(t('parentsTitle'))}</h1>
        <div class="card">
          <h2>${esc(t('weekTitle'))}</h2>
          <div class="stats">
            <div><b>${state.missionsWeek}</b><small>${esc(t('statMissions'))}</small></div>
            <div><b>${state.feelingsWeek}</b><small>${esc(t('statFeelings'))}</small></div>
            <div><b>${minutes}</b><small>${esc(t('statMinutes'))}</small></div>
          </div>
        </div>
        <div class="card">
          <h2>${esc(t('screenTitle'))}</h2>
          <div class="progress soft"><span style="width:${pct}%"></span></div>
          <p class="fine">${esc(t('screenBody', { m: minutes, max: state.screenLimit }))}</p>
          <div class="limit-row">
            <span>${esc(t('screenLimit'))}</span>
            <div class="seg" role="group" aria-label="${esc(t('screenLimit'))}">
              ${[5, 10, 15].map(m => `<button class="${state.screenLimit === m ? 'on' : ''}" data-limit="${m}" aria-pressed="${state.screenLimit === m}">${esc(t('minutes', { m }))}</button>`).join('')}
            </div>
          </div>
          <button class="btn outline" id="night-demo">${ART.icons.moon}<span>${esc(t('nightDemo'))}</span></button>
        </div>
        <div class="card">
          <h2>${esc(t('posterTitle'))}</h2>
          <p class="fine">${esc(t('posterBody'))}</p>
          <button class="btn outline" disabled>${ART.icons.gift}<span>${esc(t('orderPrint'))}</span></button>
          <button class="btn outline" data-go="fridge">${ART.icons.print}<span>${esc(t('fridgeOpen'))}</span></button>
        </div>
        <div class="card">
          <h2>${esc(t('settingsTitle'))}</h2>
          <label class="switch"><span>${esc(t('setReminder'))}</span><input type="checkbox" id="set-reminder" ${state.reminder ? 'checked' : ''}><i></i></label>
          <label class="switch"><span>${esc(t('setSound'))}</span><input type="checkbox" id="set-sound" ${state.sound ? 'checked' : ''}><i></i></label>
        </div>
        <div class="card">
          <h2>${esc(t('whyTitle'))}</h2>
          <ul class="why">${t('why').map(w => `<li>${ART.icons.check}<span>${esc(w)}</span></li>`).join('')}</ul>
        </div>
        <img class="parents-logo" src="assets/brand/forut-logo.png" alt="FORUT">
        <p class="fine voice-credit center-text" hidden>${esc(t('voiceCredit'))}</p>
        <button class="btn link" id="reset">${esc(t('resetDemo'))}</button>
      </section>`;
    }
  };

  // ---------- behaviour per screen ----------
  const behaviours = {
    welcome() {
      $('#start').onclick = () => {
        state.onboarded = true; save();
        go('hub');
        setTimeout(() => say('hubGreeting'), 250);
      };
    },
    hub() {
      $('#monki-talk').onclick = () => {
        const m = $('.hub .monki'); m.classList.remove('jump'); void m.offsetWidth; m.classList.add('jump');
        say('hubGreeting');
      };
      $$('[data-friend]').forEach(b => {
        b.onclick = () => say('friends.' + b.dataset.friend);
      });
      $('#mystery').onclick = () => {
        const left = MYSTERY_AT - state.bananas;
        if (left > 0) say('mysterySay');
        else go('postcard');
      };
      const st = stage(state.bananas);
      if (st > state.lastStage) {
        state.lastStage = st; save();
        later(() => say('stageSay.' + st), 400);
      }
    },
    postcard() { later(() => say('postcardSay'), 200); },
    hunt() {
      later(() => say('huntSay'), 200);
      $$('[data-hunt]').forEach(b => {
        b.onclick = () => {
          const k = b.dataset.hunt;
          huntFound[k] = !huntFound[k];
          b.classList.toggle('found', huntFound[k]);
          b.setAttribute('aria-pressed', huntFound[k]);
          if (huntFound[k]) say('huntFound.' + k);
          $('#hunt-done').disabled = !['red', 'soft', 'round', 'leaf'].every(x => huntFound[x]);
        };
      });
      $('#hunt-done').onclick = () => {
        huntFound = {};
        state.missionsWeek += 1;
        addBanana();
        go('celebrate');
      };
    },
    breathe() {
      later(() => say('breatheSay'), 200);
      const TOTAL = 3, HALF = 4000;
      $('#breath-start').onclick = () => {
        $('#breath-start').classList.add('hidden');
        let n = 0;
        const circle = $('.breath-stage');
        const step = () => {
          n += 1;
          $('#breath-count').textContent = t('breatheCount', { n, total: TOTAL });
          $('#breath-word').textContent = t('breatheIn');
          circle.classList.remove('out'); circle.classList.add('in');
          say('breatheIn');
          later(() => {
            $('#breath-word').textContent = t('breatheOut');
            circle.classList.remove('in'); circle.classList.add('out');
            say('breatheOut');
            later(() => {
              if (n < TOTAL) return step();
              circle.classList.remove('out');
              $('#breath-word').textContent = '';
              $('#breath-count').textContent = '';
              say('breatheDone');
              $('#breath-done').classList.remove('hidden');
            }, HALF);
          }, HALF);
        };
        step();
      };
      $('#breath-done').onclick = () => {
        state.feelingsWeek += 1;
        addBanana();
        go('celebrate');
      };
    },
    songs() {
      later(() => say('songsSay'), 200);
      $$('[data-song]').forEach(b => { b.onclick = () => { currentSong = b.dataset.song; go('song'); }; });
    },
    song() {
      const idx = Math.max(0, t('songs').findIndex(x => x.id === currentSong));
      $('.player-play').addEventListener('click', () => later(() => say('songs.' + idx + '.after'), 600));
      $('#song-done').onclick = () => { addBanana(); go('celebrate'); };
    },
    night() {
      stopVoice();
      later(() => say('nightSay'), 300);
      holdToOpen(() => { state.nightOverride = true; save(); go('hub'); });
    },
    walk() {
      later(() => say('walkSay'), 200);
      $$('[data-walk]').forEach(b => {
        b.onclick = () => {
          const k = b.dataset.walk;
          walkSeen[k] = !walkSeen[k];
          b.classList.toggle('found', walkSeen[k]);
          b.setAttribute('aria-pressed', walkSeen[k]);
          if (walkSeen[k]) say('walkItems.' + k);
          const n = Object.values(walkSeen).filter(Boolean).length;
          $('#walk-count').textContent = t('walkCount', { n });
          const done = $('#walk-done');
          done.disabled = n < 3;
          done.querySelector('span').textContent = n >= 3 ? t('walkDone') : t('walkMin');
        };
      });
      $('#walk-done').onclick = () => go('jingle');
    },
    jingle() {
      later(() => say('walkSongSay'), 200);
      $('#jingle-play').onclick = () => playJingle();
      $('#jingle-done').onclick = () => {
        stopJingle();
        walkSeen = {};
        state.missionsWeek += 1;
        addBanana();
        go('celebrate');
      };
    },
    food() {
      later(() => say('foodSay'), 200);
      $$('[data-dish]').forEach(b => { b.onclick = () => { currentDish = b.dataset.dish; dishDone = {}; go('dish'); }; });
    },
    dish() {
      later(() => say('dishSay'), 200);
      const d = t('dishes').find(x => x.id === currentDish) || t('dishes')[0];
      $$('[data-task]').forEach(b => {
        b.onclick = () => {
          const i = b.dataset.task;
          dishDone[i] = !dishDone[i];
          b.classList.toggle('done', dishDone[i]);
          b.setAttribute('aria-pressed', dishDone[i]);
          if (dishDone[i]) say('gameGood.' + (Number(i) % 4));
          $('#dish-done').disabled = !d.tasks.every((_, j) => dishDone[j]);
        };
      });
      $('#dish-done').onclick = () => {
        dishDone = {};
        state.missionsWeek += 1;
        addBanana();
        go('celebrate');
      };
    },
    fridge() {
      drawFridge(url => { const img = $('#fridge-img'); if (img) img.src = url; });
      $('#fridge-print').onclick = () => { try { window.print(); } catch (e) {} };
    },
    mission() { setTimeout(() => say('missionSay'), 200); },
    game() { setupGame(); setTimeout(() => say('gameSay'), 200); },
    real() {
      setTimeout(() => say('realSay'), 200);
      $('#real-done').onclick = () => {
        state.missionsWeek += 1;
        addBanana();
        go('celebrate');
      };
    },
    celebrate() {
      confetti();
      setTimeout(() => say('celebrateSay'), 200);
    },
    feelings() {
      setTimeout(() => say('feelSay'), 200);
      $$('[data-feel]').forEach(b => {
        b.onclick = () => {
          const k = b.dataset.feel;
          $$('[data-feel]').forEach(x => x.classList.toggle('picked', x === b));
          say('feelReply.' + k);
          $('#starter-q').textContent = t('feelStarter.' + k);
          $('#starter').classList.remove('hidden');
          setTimeout(() => $('#starter').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        };
      });
      $('#feel-done').onclick = () => {
        state.feelingsWeek += 1;
        addBanana();
        go('celebrate');
      };
    },
    tree() { setTimeout(() => say('treeSay'), 200); },
    gate() { holdToOpen(() => go('parents')); },
    parents() {
      $('#set-reminder').onchange = e => { state.reminder = e.target.checked; save(); };
      $('#set-sound').onchange = e => { state.sound = e.target.checked; save(); renderTopbar(); bindGlobal(); };
      $$('[data-limit]').forEach(b => {
        b.onclick = () => { state.screenLimit = Number(b.dataset.limit); state.nightOverride = false; save(); render(); };
      });
      $('#night-demo').onclick = () => go('night');
      $('#reset').onclick = () => {
        huntFound = {};
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        save();
        go('welcome');
      };
    }
  };

  // ---------- the drag-and-drop mission ----------
  function setupGame() {
    const scene = $('#scene');
    const spots = window.__spots;
    const good = t('gameGood');
    let placed = 0;
    let idle;

    const hint = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        const next = scene.querySelector('.item:not(.placed)');
        if (next) { next.classList.remove('hint'); void next.offsetWidth; next.classList.add('hint'); }
        hint();
      }, 6000);
    };
    hint();

    scene.querySelectorAll('.item').forEach(el => {
      const key = el.dataset.item;
      let startX, startY, dragging = false;

      el.addEventListener('pointerdown', e => {
        if (el.classList.contains('placed')) return;
        e.preventDefault();
        el.setPointerCapture(e.pointerId);
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        el.classList.add('dragging');
        el.classList.remove('hint', 'return');
      });
      el.addEventListener('pointermove', e => {
        if (!dragging) return;
        el.style.setProperty('--dx', (e.clientX - startX) + 'px');
        el.style.setProperty('--dy', (e.clientY - startY) + 'px');
      });
      const end = e => {
        if (!dragging) return;
        dragging = false;
        el.classList.remove('dragging');
        const target = scene.querySelector(`.ghost[data-target="${key}"]`);
        const a = el.getBoundingClientRect(), b = target.getBoundingClientRect();
        const dist = Math.hypot((a.left + a.width / 2) - (b.left + b.width / 2), (a.top + a.height / 2) - (b.top + b.height / 2));
        if (dist < scene.clientWidth * 0.2) {
          const p = spots[key];
          el.style.left = p.tx + '%';
          el.style.top = p.ty + '%';
          el.style.setProperty('--dx', '0px');
          el.style.setProperty('--dy', '0px');
          el.classList.add('placed');
          target.classList.add('filled');
          placed += 1;
          cheer();
          if (placed === 4) finish(); else say('gameGood.' + ((placed - 1) % good.length));
        } else {
          el.classList.add('return');
          el.style.setProperty('--dx', '0px');
          el.style.setProperty('--dy', '0px');
          say('gameTry');
        }
        hint();
      };
      el.addEventListener('pointerup', end);
      el.addEventListener('pointercancel', end);
    });

    function cheer() {
      const m = scene.querySelector('.scene-monki');
      m.classList.remove('jump'); void m.offsetWidth; m.classList.add('jump');
    }
    function finish() {
      clearTimeout(idle);
      confetti();
      say('gameDone');
      $('#game-next').classList.remove('hidden');
    }
  }

  // ---------- walking song (concept for an AI-made jingle) ----------
  function jingleLines() {
    const seen = Object.keys(ART.walk).filter(k => walkSeen[k]).map(k => t('walkNouns.' + k));
    const lines = [t('jingleStart'), t('jingleIntro')];
    for (let i = 0; i < seen.length; i += 2) {
      if (i + 1 < seen.length) lines.push(t('jinglePair', { a: seen[i], b: seen[i + 1] }));
      else lines.push(t('jingleOne', { a: seen[i] }));
    }
    lines.push(t('jingleEnd'));
    return lines.map((l, i) => i === 0 ? l : l.charAt(0).toUpperCase() + l.slice(1));
  }

  let audioCtx = null;
  let jingleTimers = [];
  function stopJingle() {
    jingleTimers.forEach(clearTimeout);
    jingleTimers = [];
    $$('#lyrics li').forEach(li => li.classList.remove('on'));
    const st = $('.jingle-stage');
    if (st) st.classList.remove('playing');
  }
  // A cheerful tune on a plucked synth: one bar of melody per lyric line, with a bass note.
  function playJingle() {
    stopVoice();
    stopJingle();
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { audioCtx = null; }
    const lines = $$('#lyrics li');
    const beat = 0.3; // seconds per eighth note (about 100 bpm)
    const C = 261.63, scale = [0, 2, 4, 7, 9, 12, 14, 16];
    const hz = step => C * Math.pow(2, scale[step] / 12);
    const bars = [[0, 2, 4, 4, 5, 4, 2, 0], [2, 4, 5, 5, 6, 5, 4, 2], [4, 5, 6, 4, 5, 3, 2, 1], [0, 2, 4, 2, 3, 1, 0, 0]];
    const bass = [0, 3, 4, 0];
    const t0 = audioCtx ? audioCtx.currentTime + 0.1 : 0;
    const note = (f, at, len, type, vol) => {
      if (!audioCtx) return;
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(vol, at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, at + len);
      o.connect(g).connect(audioCtx.destination);
      o.start(at); o.stop(at + len + 0.05);
    };
    lines.forEach((li, i) => {
      const bar = i === lines.length - 1 ? bars[3] : bars[i % 3];
      const start = i * 8 * beat;
      bar.forEach((step, k) => note(hz(step), t0 + start + k * beat, beat * 0.9, 'triangle', 0.18));
      note(hz(bass[i % 4]) / 2, t0 + start, beat * 3.5, 'sine', 0.14);
      note(hz(bass[i % 4]) / 2, t0 + start + 4 * beat, beat * 3.5, 'sine', 0.12);
      jingleTimers.push(setTimeout(() => {
        lines.forEach(x => x.classList.toggle('on', x === li));
      }, (start + 0.1) * 1000));
    });
    const st = $('.jingle-stage');
    if (st) st.classList.add('playing');
    jingleTimers.push(setTimeout(() => {
      stopJingle();
      const b = $('#jingle-play span');
      if (b) b.textContent = t('jingleReplay');
    }, (lines.length * 8 * beat + 0.4) * 1000));
  }

  // Grown-up gate: press and hold for 3 seconds.
  function holdToOpen(onOpen) {
    const btn = $('#hold');
    let timer = null;
    const start = e => {
      e.preventDefault();
      btn.classList.add('holding');
      timer = setTimeout(onOpen, 3000);
    };
    const stop = () => { btn.classList.remove('holding'); clearTimeout(timer); };
    btn.addEventListener('pointerdown', start);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stop));
  }

  // Printable A4 banana calendar, drawn on a canvas so it can be printed or saved as an image.
  function drawFridge(cb) {
    const W = 1240, H = 1754, M = 90;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const g = c.getContext('2d');
    const display = "800 {s}px 'Baloo 2', Nunito, sans-serif";
    const body = "700 {s}px Nunito, system-ui, sans-serif";
    const font = (tpl, size) => tpl.replace('{s}', size);
    const img = new Image();
    const draw = () => {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
      g.strokeStyle = '#2b2b2b'; g.lineWidth = 8;
      g.beginPath(); g.roundRect(40, 40, W - 80, H - 80, 48); g.stroke();
      if (img.complete && img.naturalWidth) {
        const h = 330, w = img.naturalWidth * h / img.naturalHeight;
        g.drawImage(img, W - M - w, 90, w, h);
      }
      g.fillStyle = '#1b62b3';
      g.font = font(display, 92); g.fillText(t('fridgeSheetTitle'), M, 200);
      g.fillStyle = '#2c7a3b';
      g.font = font(body, 44); g.fillText(t('treeMonth') + ' 2027', M, 270);
      g.fillStyle = '#23303b';
      g.font = font(body, 36); g.fillText(t('fridgeSheetBody'), M, 490);

      const top = 600, cols = 7, cw = (W - 2 * M) / cols, ch = 190;
      g.font = font(body, 32); g.fillStyle = '#5d6b78'; g.textAlign = 'center';
      t('weekdays').forEach((w, i) => g.fillText(w, M + cw * i + cw / 2, top - 20));
      const banana = new Path2D('M4 6 Q8 30 34 34 Q42 34 44 30 Q22 28 12 4Z');
      for (let d = 1; d <= DAYS_IN_MONTH; d++) {
        const idx = d - 1 + MONTH_OFFSET, col = idx % cols, row = Math.floor(idx / cols);
        const x = M + col * cw, y = top + row * ch;
        g.fillStyle = '#f4f8f5'; g.strokeStyle = '#cfdcd2'; g.lineWidth = 3;
        g.beginPath(); g.roundRect(x + 8, y + 8, cw - 16, ch - 16, 22); g.fill(); g.stroke();
        g.fillStyle = '#23303b'; g.textAlign = 'left'; g.font = font(body, 30);
        g.fillText(String(d), x + 24, y + 50);
        g.save();
        g.translate(x + cw / 2 - 44, y + 74); g.scale(2, 2);
        g.lineWidth = 1.6; g.strokeStyle = '#2b2b2b'; g.setLineDash([3, 2.5]);
        g.stroke(banana);
        g.restore();
      }
      g.textAlign = 'center'; g.fillStyle = '#5d6b78'; g.font = font(body, 30);
      g.fillText(t('fridgeSheetFoot'), W / 2, H - 90);
      g.textAlign = 'left';
      cb(c.toDataURL('image/png'));
    };
    img.onload = draw;
    img.onerror = draw;
    img.src = 'assets/characters/monki.png';
    // Draw again once web fonts are ready so the sheet uses the brand faces.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (screen === 'fridge') draw(); });
  }

  // ---------- global wiring ----------
  function bindGlobal() {
    $$('[data-go]').forEach(b => { b.onclick = () => go(b.dataset.go); });
    const s = $('#toggle-sound');
    if (s) s.onclick = () => {
      state.sound = !state.sound; save();
      if (!state.sound) stopVoice();
      renderTopbar(); bindGlobal();
    };
    const l = $('#toggle-lang');
    if (l) l.onclick = () => {
      state.lang = state.lang === 'no' ? 'en' : 'no'; save();
      document.documentElement.lang = state.lang === 'no' ? 'nb' : 'en';
      stopVoice();
      render();
    };
  }

  function render() {
    document.documentElement.lang = state.lang === 'no' ? 'nb' : 'en';
    document.title = t('appName');
    renderTopbar();
    const el = $('#screen');
    el.className = 'screen screen-' + screen;
    el.innerHTML = screens[screen]();
    bindGlobal();
    if (behaviours[screen]) behaviours[screen]();
    showCredit();
  }

  // Count visible time as screen time for the parent overview.
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      state.screenSeconds += 1;
      if (state.screenSeconds % 10 === 0) save();
      const exempt = ['night', 'gate', 'parents', 'welcome'];
      if (!state.nightOverride && state.screenSeconds >= state.screenLimit * 60 && !exempt.includes(screen)) go('night');
    }
  }, 1000);

  render();
})();
