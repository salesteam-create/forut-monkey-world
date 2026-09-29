// Monki's World: clickable concept prototype.
// Single-page vanilla JS. Screens are rendered into #screen; state lives in memory and,
// when the browser allows it, in localStorage so a demo survives a reload.
(function () {
  const STORE_KEY = 'monkis-verden-demo-v1';
  const GOAL = 24;
  const SCREEN_MAX_MIN = 10;
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
    screenSeconds: 190,
    reminder: true,
    photos: []
  };

  let state = load();
  let screen = state.onboarded ? 'hub' : 'welcome';
  let lastUnlocked = null;
  let justAdded = false;

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
    } catch (e) {
      // Photos can exceed the quota; keep them in memory only and retry.
      try { localStorage.setItem(STORE_KEY, JSON.stringify(Object.assign({}, state, { photos: [] }))); } catch (e2) {}
    }
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
  function speak(text) {
    const bubble = document.querySelector('.bubble');
    if (bubble) {
      bubble.textContent = text;
      bubble.classList.remove('talk'); void bubble.offsetWidth; bubble.classList.add('talk');
    }
    if (!state.sound || !('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const want = state.lang === 'no' ? /^(nb|no|nn)/i : /^en/i;
      const voice = voices.find(v => want.test(v.lang));
      u.lang = state.lang === 'no' ? 'nb-NO' : 'en-GB';
      if (voice) u.voice = voice;
      u.rate = 0.95;
      u.pitch = 1.25;
      speechSynthesis.speak(u);
    } catch (e) {}
  }

  // ---------- helpers ----------
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));
  function go(next) {
    screen = next;
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
  function addBanana() {
    const before = state.bananas;
    state.bananas = Math.min(GOAL, state.bananas + 1);
    if (!state.activeDays.includes(TODAY)) state.activeDays.push(TODAY);
    const rewards = t('rewards');
    lastUnlocked = rewards.find(r => before < r.at && state.bananas >= r.at) || null;
    justAdded = true;
    save();
  }

  // ---------- top bar ----------
  function renderTopbar() {
    $('#topbar').innerHTML = `
      <button class="brand" data-go="hub" aria-label="${esc(t('appName'))}">
        <span>${esc(t('appName'))}</span>
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
        <div class="scene-bg">${ART.jungle}</div>
        <div class="welcome-card card">
          <img class="welcome-logo" src="assets/brand/forut-logo.png" alt="FORUT">
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
        </div>
      </section>`;
    },

    hub() {
      const friends = ['yanay', 'orbai', 'suala', 'palaiya'];
      return `
      <section class="hub">
        <div class="scene-bg">${ART.jungle}</div>
        <div class="hub-hero">
          <div class="bubble">${esc(t('hubGreeting'))}</div>
          <button class="monki-btn" id="monki-talk" aria-label="Monki">${monki('bob')}</button>
        </div>
        <div class="tiles">
          <button class="tile tile-mission" data-go="mission">
            <span class="tile-art">${ART.items.boots}</span>
            <b>${esc(t('tileMission'))}</b><small>${esc(t('tileMissionSub'))}</small>
          </button>
          <button class="tile tile-feel" data-go="feelings">
            <span class="tile-art">${ART.face('happy')}</span>
            <b>${esc(t('tileFeelings'))}</b><small>${esc(t('tileFeelingsSub'))}</small>
          </button>
          <button class="tile tile-tree" data-go="tree">
            <span class="tile-art">${ART.bananaIcon}</span>
            <b>${esc(t('tileTree'))}</b><small>${esc(t('tileTreeSub', { n: state.bananas, goal: GOAL }))}</small>
          </button>
          <button class="tile tile-parents" data-go="gate">
            <span class="tile-art lock">${ART.icons.lock}</span>
            <b>${esc(t('tileParents'))}</b><small>${esc(t('tileParentsSub'))}</small>
          </button>
        </div>
        <div class="friends card">
          <p class="kicker">${esc(t('friendsTitle'))}</p>
          <div class="friend-row">
            ${friends.map(f => `<button class="friend" data-friend="${f}" aria-label="${f}"><img src="assets/characters/${f}.png" alt="${f}"></button>`).join('')}
          </div>
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
      const photo = state.photos[state.photos.length - 1];
      return `
      <section class="real">
        ${backBtn('hub')}
        <div class="card center">
          <h1>${esc(t('realTitle'))}</h1>
          <div class="bubble">${esc(t('realSay'))}</div>
          ${monki('bob small')}
          <p class="parent-note">${esc(t('realParent'))}</p>
          <label class="btn outline">
            ${ART.icons.camera}<span>${esc(t('realPhoto'))}</span>
            <input type="file" accept="image/*" capture="environment" id="photo-input" hidden>
          </label>
          ${photo ? `<img class="photo-preview" src="${photo}" alt="">` : ''}
          <p class="fine">${esc(t('realPhotoNote'))}</p>
          <button class="btn primary big" id="real-done">${ART.icons.check}<span>${esc(t('realDone'))}</span></button>
        </div>
      </section>`;
    },

    celebrate() {
      const unlocked = lastUnlocked;
      return `
      <section class="celebrate">
        <div class="scene-bg">${ART.jungle}</div>
        <div class="card center">
          <h1>${esc(t('celebrateTitle'))}</h1>
          <div class="bubble">${esc(t('celebrateSay'))}</div>
          <div class="celebrate-row">${monki('jump')}<span class="big-banana">${ART.bananaIcon}</span></div>
          <p class="count">${esc(t('treeCount', { n: state.bananas, goal: GOAL }))}</p>
          ${unlocked ? `
          <div class="unlock">
            <span class="unlock-icon">${ART.icons.gift}</span>
            <div><p class="kicker">${esc(t('unlockTitle'))}</p><b>${esc(unlocked.title)}</b><small>${esc(unlocked.sub)}</small></div>
          </div>` : ''}
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
          <div class="tree-art">${ART.tree(state.bananas, GOAL, justAdded)}</div>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${GOAL}" aria-valuenow="${state.bananas}">
            <span style="width:${(state.bananas / GOAL) * 100}%"></span>
          </div>
          <p class="count">${esc(t('treeCount', { n: state.bananas, goal: GOAL }))}</p>
          <p class="fine">${esc(t('treeNoStreak'))}</p>
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
      const pct = Math.min(100, (minutes / SCREEN_MAX_MIN) * 100);
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
          <p class="fine">${esc(t('screenBody', { m: minutes, max: SCREEN_MAX_MIN }))}</p>
        </div>
        <div class="card">
          <h2>${esc(t('photosTitle'))}</h2>
          ${state.photos.length
            ? `<div class="photos">${state.photos.map(p => `<img src="${p}" alt="">`).join('')}</div>`
            : `<p class="fine">${esc(t('photosEmpty'))}</p>`}
          <button class="btn outline" disabled>${ART.icons.gift}<span>${esc(t('orderPrint'))}</span></button>
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
        setTimeout(() => speak(t('hubGreeting')), 250);
      };
    },
    hub() {
      $('#monki-talk').onclick = () => {
        const m = $('.hub .monki'); m.classList.remove('jump'); void m.offsetWidth; m.classList.add('jump');
        speak(t('hubGreeting'));
      };
      $$('[data-friend]').forEach(b => {
        b.onclick = () => speak(t('friends.' + b.dataset.friend));
      });
    },
    mission() { setTimeout(() => speak(t('missionSay')), 200); },
    game() { setupGame(); setTimeout(() => speak(t('gameSay')), 200); },
    real() {
      setTimeout(() => speak(t('realSay')), 200);
      $('#photo-input').onchange = e => {
        const file = e.target.files && e.target.files[0];
        if (file) readPhoto(file, url => { state.photos.push(url); save(); render(); });
      };
      $('#real-done').onclick = () => {
        state.missionsWeek += 1;
        addBanana();
        go('celebrate');
      };
    },
    celebrate() {
      confetti();
      setTimeout(() => speak(t('celebrateSay')), 200);
    },
    feelings() {
      setTimeout(() => speak(t('feelSay')), 200);
      $$('[data-feel]').forEach(b => {
        b.onclick = () => {
          const k = b.dataset.feel;
          $$('[data-feel]').forEach(x => x.classList.toggle('picked', x === b));
          speak(t('feelReply.' + k));
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
    tree() { setTimeout(() => speak(t('treeSay')), 200); },
    gate() {
      const btn = $('#hold');
      let timer = null;
      const start = e => {
        e.preventDefault();
        btn.classList.add('holding');
        timer = setTimeout(() => go('parents'), 3000);
      };
      const stop = () => { btn.classList.remove('holding'); clearTimeout(timer); };
      btn.addEventListener('pointerdown', start);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, stop));
    },
    parents() {
      $('#set-reminder').onchange = e => { state.reminder = e.target.checked; save(); };
      $('#set-sound').onchange = e => { state.sound = e.target.checked; save(); renderTopbar(); bindGlobal(); };
      $('#reset').onclick = () => {
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
          if (placed === 4) finish(); else speak(good[(placed - 1) % good.length]);
        } else {
          el.classList.add('return');
          el.style.setProperty('--dx', '0px');
          el.style.setProperty('--dy', '0px');
          speak(t('gameTry'));
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
      speak(t('gameDone'));
      $('#game-next').classList.remove('hidden');
    }
  }

  function readPhoto(file, cb) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 640;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', 0.75));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // ---------- global wiring ----------
  function bindGlobal() {
    $$('[data-go]').forEach(b => { b.onclick = () => go(b.dataset.go); });
    const s = $('#toggle-sound');
    if (s) s.onclick = () => {
      state.sound = !state.sound; save();
      if (!state.sound) try { speechSynthesis.cancel(); } catch (e) {}
      renderTopbar(); bindGlobal();
    };
    const l = $('#toggle-lang');
    if (l) l.onclick = () => {
      state.lang = state.lang === 'no' ? 'en' : 'no'; save();
      document.documentElement.lang = state.lang === 'no' ? 'nb' : 'en';
      try { speechSynthesis.cancel(); } catch (e) {}
      render();
    };
  }

  function render() {
    document.documentElement.lang = state.lang === 'no' ? 'nb' : 'en';
    document.title = t('appName') + ' | ' + t('concept');
    renderTopbar();
    const el = $('#screen');
    el.className = 'screen screen-' + screen;
    el.innerHTML = screens[screen]();
    bindGlobal();
    if (behaviours[screen]) behaviours[screen]();
  }

  // Count visible time as screen time for the parent overview.
  setInterval(() => {
    if (document.visibilityState === 'visible') {
      state.screenSeconds += 1;
      if (state.screenSeconds % 10 === 0) save();
    }
  }, 1000);

  render();
})();
