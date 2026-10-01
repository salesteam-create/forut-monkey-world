// Inline SVG illustrations, drawn to match the FORUT character style:
// thick dark outlines, flat fills, rounded shapes. Placeholders until the design team's art is ready.
(function () {
  const INK = '#2b2b2b';
  const s = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

  // Jungle backdrop. It grows with the month's bananas (stage 0-4) and has a night version
  // for the goodnight ritual.
  function jungle(stage, night) {
    stage = stage || 0;
    const sky = night ? ['#1d2b55', '#3b4f8a'] : ['#bfe8ff', '#e9f8ff'];
    const hills = night ? ['#35507a', '#2c4468', '#233857'] : ['#9fd48a', '#7cc26b', '#5eae55'];
    const flowers = stage >= 1 ? [[40, 560], [120, 610], [300, 600], [360, 540], [210, 640]].map(([x, y], i) => `
      <g transform="translate(${x} ${y})" ${s} stroke-width="2">
        <path d="M0 0 V22" fill="none" stroke="#2c7a3b"/>
        ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-8" rx="6" ry="9" transform="rotate(${a})" fill="${['#ff8ac2', '#ffd23f', '#ff9d5c', '#c8b6ff', '#ffffff'][i]}"/>`).join('')}
        <circle r="4.5" fill="#ffd23f"/>
      </g>`).join('') : '';
    const butterflies = stage >= 2 && !night ? `
      <g class="flutter" ${s} stroke-width="2">
        <g transform="translate(90 330)"><path d="M0 0 Q-14 -16 -18 0 Q-14 12 0 0 Q14 -16 18 0 Q14 12 0 0Z" fill="#ffb347"/></g>
        <g transform="translate(300 300)"><path d="M0 0 Q-14 -16 -18 0 Q-14 12 0 0 Q14 -16 18 0 Q14 12 0 0Z" fill="#8cc4ff"/></g>
      </g>` : '';
    const bird = stage >= 3 ? `
      <g ${s} stroke-width="2.5">
        <path d="M322 238 Q340 256 362 238 Q352 262 332 258Z" fill="#b07a45"/>
        <g transform="translate(342 226)">
          <ellipse cx="0" cy="0" rx="13" ry="11" fill="${night ? '#8b8fb8' : '#4fb3e8'}"/>
          <circle cx="4" cy="-3" r="2" fill="${INK}" stroke="none"/>
          <path d="M12 -1 L20 1 L12 4Z" fill="#ffb347"/>
        </g>
      </g>` : '';
    const waterfall = stage >= 4 ? `
      <g>
        <path d="M250 380 Q256 440 244 520 H286 Q276 440 282 380Z" fill="${night ? '#6f8fc4' : '#9fdcff'}" ${s}/>
        <path d="M258 400 V500 M270 396 V510" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
        <ellipse cx="265" cy="524" rx="34" ry="9" fill="${night ? '#6f8fc4' : '#9fdcff'}" ${s}/>
      </g>` : '';
    const skyDetail = night
      ? `<circle cx="310" cy="90" r="30" fill="#fff4c2"/><circle cx="296" cy="80" r="30" fill="${sky[0]}"/>
         ${[[60, 70], [140, 40], [220, 110], [90, 180], [360, 200], [250, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.5" fill="#fff"/>`).join('')}`
      : `<circle cx="320" cy="90" r="38" fill="#ffe27a"/>`;
    return `
<svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="sky${night ? 'n' : 'd'}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="700" fill="url(#sky${night ? 'n' : 'd'})"/>
  ${skyDetail}
  <path d="M0 420 Q100 340 200 400 T400 380 V700 H0Z" fill="${hills[0]}"/>
  ${waterfall}
  <path d="M0 500 Q120 430 240 490 T400 470 V700 H0Z" fill="${hills[1]}"/>
  <path d="M0 600 Q140 540 260 590 T400 580 V700 H0Z" fill="${hills[2]}"/>
  <g ${s} fill="${night ? '#2f5a4a' : '#3f9b4f'}">
    <path d="M-10 60 Q60 40 110 110 Q50 110 -10 150Z"/>
    <path d="M-10 150 Q70 150 100 230 Q30 210 -10 250Z" fill="${night ? '#386a57' : '#4fae5c'}"/>
    <path d="M410 200 Q330 190 300 270 Q360 260 410 300Z"/>
    <path d="M410 300 Q320 320 310 400 Q370 370 410 400Z" fill="${night ? '#386a57' : '#4fae5c'}"/>
  </g>
  <g ${s} fill="none">
    <path d="M40 0 Q60 80 30 160" stroke="#6b4b2a" stroke-width="4"/>
    <path d="M370 0 Q350 60 375 140" stroke="#6b4b2a" stroke-width="4"/>
  </g>
  ${bird}
  ${flowers}
  ${butterflies}
</svg>`;
  }

  // Nepal postcard for the mystery friend: mountains and prayer flags.
  const nepal = `
<svg viewBox="0 0 400 240" aria-hidden="true">
  <rect width="400" height="240" fill="#cfeaff"/>
  <g ${s}>
    <path d="M-10 200 L90 70 L150 140 L230 40 L320 150 L360 110 L420 200Z" fill="#9fb6d6"/>
    <path d="M90 70 L70 96 L92 90 L108 104Z M230 40 L205 72 L232 64 L252 80Z" fill="#fff"/>
  </g>
  <path d="M0 210 Q200 150 400 210 V240 H0Z" fill="#7cc26b" ${s}/>
  <path d="M30 60 Q200 110 370 50" fill="none" stroke="${INK}" stroke-width="2"/>
  ${['#3a7bd5', '#fff', '#e8513f', '#56b36a', '#ffd23f', '#3a7bd5', '#fff', '#e8513f', '#56b36a', '#ffd23f'].map((c, i) => {
    const x = 50 + i * 32, y = 66 + Math.sin((i + 0.5) / 10 * Math.PI) * 22;
    return `<rect x="${x}" y="${y}" width="18" height="22" fill="${c}" stroke="${INK}" stroke-width="2"/>`;
  }).join('')}
</svg>`;

  // A soft, rounded silhouette: FORUT owns the real Nepal character, so we only hint at it.
  const silhouette = `
<svg viewBox="0 0 120 120" aria-hidden="true">
  <g fill="#3a4450">
    <ellipse cx="60" cy="82" rx="34" ry="30"/>
    <circle cx="60" cy="44" r="26"/>
    <circle cx="38" cy="24" r="10"/><circle cx="82" cy="24" r="10"/>
  </g>
  <text x="60" y="54" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="30" fill="#ffd23f">?</text>
</svg>`;

  const hunt = {
    red: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <path d="M50 30 Q30 18 20 36 Q10 60 30 82 Q42 94 50 86 Q58 94 70 82 Q90 60 80 36 Q70 18 50 30Z" fill="#e8513f"/>
      <path d="M50 30 Q50 18 58 10" fill="none"/><path d="M54 18 Q66 8 74 16 Q64 24 54 18Z" fill="#56b36a"/></g></svg>`,
    soft: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <circle cx="30" cy="30" r="12" fill="#c99a6b"/><circle cx="70" cy="30" r="12" fill="#c99a6b"/>
      <circle cx="50" cy="48" r="26" fill="#d9ad7c"/><ellipse cx="50" cy="58" rx="12" ry="9" fill="#f3d8b6"/>
      <circle cx="41" cy="44" r="3" fill="${INK}"/><circle cx="59" cy="44" r="3" fill="${INK}"/>
      <path d="M46 58 Q50 62 54 58" fill="none"/>
      <path d="M26 72 Q50 96 74 72" fill="#d9ad7c"/></g></svg>`,
    round: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <circle cx="50" cy="52" r="36" fill="#fff"/>
      <path d="M50 16 Q66 52 50 88 M14 52 Q50 36 86 52" fill="none"/>
      <path d="M50 16 A36 36 0 0 1 86 52 Q66 44 50 16Z" fill="#3a7bd5"/>
      <path d="M14 52 Q34 60 50 88 A36 36 0 0 1 14 52Z" fill="#ffd23f"/></g></svg>`,
    leaf: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <path d="M20 80 Q16 30 70 16 Q86 14 84 30 Q76 80 20 80Z" fill="#ff9d5c"/>
      <path d="M20 80 Q48 52 74 26 M40 60 L38 44 M52 48 L64 50" fill="none"/></g></svg>`
  };

  // Things you spot on a walk. Simple, friendly, readable at 60px.
  const walk = {
    bird: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <ellipse cx="48" cy="56" rx="28" ry="22" fill="#4fb3e8"/><circle cx="68" cy="38" r="15" fill="#4fb3e8"/>
      <path d="M80 38 L92 42 L80 46Z" fill="#ffb347"/><circle cx="71" cy="35" r="3" fill="${INK}"/>
      <path d="M30 52 Q44 40 56 56 Q42 64 30 52Z" fill="#2f8fc4"/><path d="M42 78 V88 M54 78 V88" fill="none"/></g></svg>`,
    dog: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <rect x="20" y="48" width="52" height="26" rx="12" fill="#c99a6b"/><path d="M26 74 V88 M40 74 V88 M56 74 V88 M66 74 V88" fill="none"/>
      <circle cx="74" cy="42" r="16" fill="#d9ad7c"/><path d="M62 30 Q56 46 64 50Z M84 28 Q92 42 86 48Z" fill="#8a5a2c"/>
      <circle cx="70" cy="40" r="2.5" fill="${INK}"/><circle cx="80" cy="40" r="2.5" fill="${INK}"/><ellipse cx="76" cy="48" rx="4" ry="3" fill="${INK}"/>
      <path d="M20 54 Q8 44 12 34" fill="none"/></g></svg>`,
    tree: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <rect x="43" y="56" width="14" height="34" rx="3" fill="#9b6b3c"/>
      <circle cx="50" cy="38" r="26" fill="#56b36a"/><circle cx="32" cy="50" r="14" fill="#4fae5c"/><circle cx="68" cy="50" r="14" fill="#4fae5c"/></g></svg>`,
    flower: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <path d="M50 52 V92 M50 76 Q36 66 30 74 Q40 82 50 76" fill="#56b36a"/>
      ${[0, 72, 144, 216, 288].map(a => `<ellipse cx="50" cy="22" rx="10" ry="15" transform="rotate(${a} 50 38)" fill="#ff8ac2"/>`).join('')}
      <circle cx="50" cy="38" r="9" fill="#ffd23f"/></g></svg>`,
    bus: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <rect x="10" y="24" width="80" height="50" rx="10" fill="#e8513f"/>
      <rect x="18" y="32" width="18" height="16" rx="3" fill="#cfefff"/><rect x="41" y="32" width="18" height="16" rx="3" fill="#cfefff"/><rect x="64" y="32" width="18" height="16" rx="3" fill="#cfefff"/>
      <circle cx="28" cy="76" r="8" fill="#3a4450"/><circle cx="72" cy="76" r="8" fill="#3a4450"/></g></svg>`,
    cat: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <path d="M26 30 L32 12 L44 26Z M74 30 L68 12 L56 26Z" fill="#ff9d5c"/>
      <circle cx="50" cy="44" r="24" fill="#ff9d5c"/><ellipse cx="50" cy="80" rx="24" ry="14" fill="#ff9d5c"/>
      <circle cx="41" cy="42" r="3" fill="${INK}"/><circle cx="59" cy="42" r="3" fill="${INK}"/><path d="M46 52 L50 55 L54 52" fill="none"/>
      <path d="M28 50 H16 M72 50 H84" fill="none" stroke-width="2"/></g></svg>`,
    puddle: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <path d="M12 66 Q14 50 36 52 Q46 42 64 50 Q90 48 88 66 Q86 82 56 80 Q20 86 12 66Z" fill="#8cc4ff"/>
      <ellipse cx="42" cy="64" rx="12" ry="4" fill="#cfe7ff" stroke="none"/>
      <path d="M50 18 Q42 30 50 36 Q58 30 50 18Z" fill="#8cc4ff"/></g></svg>`,
    stone: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <path d="M14 76 Q12 50 34 40 Q56 30 76 44 Q92 58 86 76Z" fill="#b8c0c8"/>
      <path d="M36 52 Q44 48 52 52" fill="none" stroke-width="2"/></g></svg>`,
    bike: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <circle cx="26" cy="66" r="16" fill="none"/><circle cx="76" cy="66" r="16" fill="none"/>
      <path d="M26 66 L42 40 L66 40 L76 66 M42 40 L52 66 L66 40 M38 32 H48 M64 30 L68 40" fill="none" stroke="#3a7bd5" stroke-width="4"/>
      <circle cx="52" cy="66" r="3" fill="${INK}"/></g></svg>`,
    squirrel: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <path d="M40 80 Q8 76 14 40 Q20 14 44 22 Q30 36 38 54Z" fill="#c4622d"/>
      <ellipse cx="58" cy="64" rx="18" ry="20" fill="#d9783f"/><circle cx="64" cy="38" r="13" fill="#d9783f"/>
      <path d="M58 26 L60 16 L66 26Z" fill="#d9783f"/><circle cx="68" cy="36" r="2.5" fill="${INK}"/>
      <ellipse cx="62" cy="66" rx="8" ry="11" fill="#f3d8b6"/></g></svg>`
  };

  // A plate with a dish on it, coloured per dish.
  function dish(color, accent) {
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <ellipse cx="50" cy="60" rx="42" ry="26" fill="#fff"/>
      <ellipse cx="50" cy="58" rx="30" ry="17" fill="${color}"/>
      <circle cx="40" cy="54" r="5" fill="${accent}" stroke-width="2"/><circle cx="58" cy="60" r="5" fill="${accent}" stroke-width="2"/><circle cx="54" cy="50" r="4" fill="${accent}" stroke-width="2"/>
      <path d="M88 24 V48 M84 24 V34 Q88 38 92 34 V24" fill="none" stroke-width="2.5"/></g></svg>`;
  }

  const media = {
    note: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}><path d="M38 70 V22 L78 14 V62" fill="none" stroke-width="5"/><ellipse cx="30" cy="72" rx="12" ry="9" fill="${INK}"/><ellipse cx="70" cy="64" rx="12" ry="9" fill="${INK}"/></g></svg>`,
    film: `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}><rect x="14" y="24" width="72" height="52" rx="10" fill="#fff"/><path d="M42 38 L62 50 L42 62Z" fill="#e8513f"/></g></svg>`
  };

  // Hallway scene for the "Monki comes home" mission.
  const hallway = `
<svg viewBox="0 0 400 520" preserveAspectRatio="none" aria-hidden="true">
  <rect width="400" height="360" fill="#fdf1d8"/>
  <rect y="360" width="400" height="160" fill="#e3b77e"/>
  <path d="M0 360 H400" ${s}/>
  <g ${s} fill="#fff">
    <rect x="300" y="70" width="80" height="120" rx="8" fill="#cfefff"/>
    <path d="M340 70 V190 M300 130 H380"/>
  </g>
  <g ${s}>
    <rect x="40" y="96" width="210" height="18" rx="6" fill="#b07a45"/>
    <rect x="150" y="410" width="170" height="16" rx="6" fill="#b07a45"/>
    <path d="M160 426 V450 M310 426 V450" fill="none"/>
  </g>
  <g ${s} fill="#8a5a2c">
    <path d="M85 114 v22 q0 10 10 10" fill="none"/>
    <path d="M195 114 v22 q0 10 10 10" fill="none"/>
  </g>
</svg>`;

  const items = {
    boots: `
<svg viewBox="0 0 120 100" aria-hidden="true"><g ${s} fill="#ffc83d">
  <path d="M14 10 h26 v52 q0 6 6 8 l14 4 q8 3 8 12 v6 H14Z"/>
  <path d="M52 10 h26 v52 q0 6 6 8 l14 4 q8 3 8 12 v6 H52Z" fill="#ffd966"/>
  <path d="M14 84 H68 M52 84 H106" fill="none"/>
</g></svg>`,
    jacket: `
<svg viewBox="0 0 120 130" aria-hidden="true"><g ${s} fill="#e8513f">
  <path d="M44 14 q16 -10 32 0 l30 18 l10 50 l-18 4 l-6 -30 v66 H28 V56 l-6 30 l-18 -4 l10 -50Z"/>
  <path d="M60 22 V122" fill="none"/>
  <path d="M44 14 q16 22 32 0" fill="#c93f2f"/>
  <circle cx="68" cy="62" r="3" fill="${INK}"/><circle cx="68" cy="86" r="3" fill="${INK}"/>
</g></svg>`,
    hat: `
<svg viewBox="0 0 110 100" aria-hidden="true"><g ${s}>
  <circle cx="55" cy="16" r="12" fill="#fff"/>
  <path d="M14 80 Q14 24 55 24 Q96 24 96 80Z" fill="#3a7bd5"/>
  <rect x="8" y="72" width="94" height="20" rx="8" fill="#2c5fa8"/>
</g></svg>`,
    bag: `
<svg viewBox="0 0 110 120" aria-hidden="true"><g ${s}>
  <path d="M38 22 q17 -22 34 0" fill="none"/>
  <rect x="16" y="20" width="78" height="92" rx="20" fill="#56b36a"/>
  <rect x="30" y="64" width="50" height="34" rx="10" fill="#8fd49c"/>
  <path d="M30 76 H80" fill="none"/>
</g></svg>`
  };

  const faces = {
    happy: { fill: '#ffd23f', mouth: 'M34 62 Q50 78 66 62', brows: '' },
    sad: { fill: '#8cc4ff', mouth: 'M34 72 Q50 58 66 72', brows: 'M30 34 L42 30 M58 30 L70 34' },
    angry: { fill: '#ff8a7a', mouth: 'M36 70 Q50 62 64 70', brows: 'M30 30 L44 38 M56 38 L70 30' },
    scared: { fill: '#c8b6ff', mouth: 'M42 66 a8 10 0 1 0 16 0 a8 10 0 1 0 -16 0', brows: 'M30 30 Q36 24 42 30 M58 30 Q64 24 70 30' },
    excited: { fill: '#ffb347', mouth: 'M32 58 Q50 86 68 58Z', brows: 'M30 30 Q36 24 42 30 M58 30 Q64 24 70 30' }
  };
  function face(key) {
    const f = faces[key];
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><g ${s}>
      <circle cx="50" cy="50" r="44" fill="${f.fill}"/>
      <circle cx="37" cy="44" r="4.5" fill="${INK}"/><circle cx="63" cy="44" r="4.5" fill="${INK}"/>
      <path d="${f.mouth}" fill="${key === 'excited' ? '#fff' : 'none'}"/>
      ${f.brows ? `<path d="${f.brows}" fill="none"/>` : ''}
    </g></svg>`;
  }

  const bananaPath = 'M4 6 Q8 30 34 34 Q42 34 44 30 Q22 28 12 4Z';
  function banana(filled) {
    return filled
      ? `<path d="${bananaPath}" fill="#ffd23f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`
      : `<path d="${bananaPath}" fill="rgba(255,255,255,.55)" stroke="#6d8f5f" stroke-width="2" stroke-dasharray="4 3" stroke-linejoin="round"/>`;
  }
  const bananaIcon = `<svg viewBox="0 0 48 40" aria-hidden="true">${banana(true)}</svg>`;

  // Banana tree with `goal` slots, `n` filled. A banana plant in the FORUT outline style:
  // paddle leaves, a striped trunk, and bunches on stalks ending in the purple banana flower.
  function tree(n, goal, justAdded) {
    const W = 400, H = 460, cx = 204, crownY = 150;

    // A banana in local coordinates (about 44 x 36), curving up and out.
    function fruit(filled, fresh) {
      if (!filled) {
        return `<path d="M2 8 C4 26 20 34 38 28 L41 23 C25 28 11 22 8 5Z" fill="rgba(255,255,255,.7)" stroke="#7a9a6c" stroke-width="2" stroke-dasharray="4 3" stroke-linejoin="round"/>`;
      }
      return `<g${fresh ? ' class="fresh"' : ''}>
        <path d="M2 8 C4 26 20 34 38 28 L41 23 C25 28 11 22 8 5Z" fill="#ffd23f" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M9 13 C13 23 21 27 31 27" fill="none" stroke="#fff3a6" stroke-width="3" stroke-linecap="round"/>
        <path d="M2 8 L8 5" stroke="#6b4b2a" stroke-width="4" stroke-linecap="round"/>
        <circle cx="40" cy="25.5" r="2.2" fill="#6b4b2a"/>
      </g>`;
    }

    // Leaves radiate from the crown: [angle in degrees, length, width, tone]
    const leaves = [
      [-168, 170, 34, 0], [-12, 170, 34, 0],
      [-148, 175, 38, 1], [-32, 175, 38, 1],
      [-120, 150, 34, 0], [-60, 150, 34, 0],
      [-92, 130, 30, 1],
      [-190, 130, 28, 1], [10, 130, 28, 1]
    ];
    const tones = [['#3f9b4f', '#58b765'], ['#4fae5c', '#6fc97a']];
    const leaf = ([ang, L, Wd, tone]) => {
      const [dark, light] = tones[tone];
      return `<g transform="translate(${cx} ${crownY}) rotate(${ang})">
        <path d="M0 0 C${L * .25} ${-Wd} ${L * .8} ${-Wd * .95} ${L} 0 C${L * .8} ${Wd * .75} ${L * .25} ${Wd * .8} 0 0Z" fill="${dark}" ${s}/>
        <path d="M4 -2 C${L * .28} ${-Wd * .9} ${L * .78} ${-Wd * .85} ${L - 6} -2Z" fill="${light}"/>
        <path d="M0 0 Q${L / 2} ${-Wd * .12} ${L - 4} 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
        ${[.3, .5, .7].map(t => `<path d="M${L * t} ${-Wd * .06} L${L * t + 14} ${-Wd * .62}" stroke="${INK}" stroke-width="1.2" opacity=".35"/>`).join('')}
      </g>`;
    };

    // Four bunches of six, hanging from the crown on curved stalks.
    const bunches = [[88, 200], [150, 278], [260, 278], [322, 200]];
    const perBunch = Math.ceil(goal / bunches.length);
    let bunchSvg = '';
    let sparkle = '';
    bunches.forEach(([bx, by], bi) => {
      const rows = Math.ceil(perBunch / 2);
      const bottom = by + rows * 22 + 12;
      let fruits = '';
      for (let k = 0; k < perBunch; k++) {
        const i = bi * perBunch + k;
        if (i >= goal) break;
        const row = Math.floor(k / 2), right = k % 2 === 1;
        const y = by + row * 22;
        const filled = i < n, fresh = justAdded && i === n - 1;
        const tf = right
          ? `translate(${bx + 2} ${y}) rotate(${-8 + row * 6})`
          : `translate(${bx - 2} ${y}) scale(-1 1) rotate(${-8 + row * 6})`;
        fruits += `<g transform="${tf}">${fruit(filled, fresh)}</g>`;
        if (fresh) {
          const sx = right ? bx + 46 : bx - 46;
          sparkle = `<g transform="translate(${sx} ${y + 6})"><g class="sparkle">
            <path d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3Z" fill="#fff" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
          </g></g>`;
        }
      }
      bunchSvg += `
        <path d="M${cx} ${crownY + 8} Q${(cx + bx) / 2} ${crownY + 10} ${bx} ${by - 16}" fill="none" stroke="#6b8f3a" stroke-width="6" stroke-linecap="round"/>
        <path d="M${cx} ${crownY + 8} Q${(cx + bx) / 2} ${crownY + 10} ${bx} ${by - 16}" fill="none" stroke="${INK}" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>
        <path d="M${bx} ${by - 16} V${bottom}" stroke="#6b8f3a" stroke-width="7" stroke-linecap="round"/>
        ${fruits}
        <path d="M${bx} ${bottom - 2} C${bx - 11} ${bottom + 8} ${bx - 8} ${bottom + 26} ${bx} ${bottom + 30} C${bx + 8} ${bottom + 26} ${bx + 11} ${bottom + 8} ${bx} ${bottom - 2}Z" fill="#8e3a59" ${s} stroke-width="2.5"/>
        <path d="M${bx - 3} ${bottom + 6} Q${bx} ${bottom + 18} ${bx} ${bottom + 26}" fill="none" stroke="#c46b8c" stroke-width="2" stroke-linecap="round"/>`;
    });

    // Trunk made of leaf sheaths: tapered, with curved stripes.
    const trunk = `
      <path d="M176 440 C182 360 190 260 194 ${crownY} H216 C220 260 228 360 236 440Z" fill="#b98548" ${s}/>
      <path d="M200 440 C202 360 204 260 205 ${crownY + 4}" fill="none" stroke="#9a6a37" stroke-width="6" opacity=".6"/>
      ${[190, 230, 270, 310, 350, 395].map((y, i) => {
        const half = 9 + i * 3.4;
        return `<path d="M${205 - half} ${y} Q205 ${y + 10} ${205 + half} ${y - 4}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".55"/>`;
      }).join('')}`;

    const ground = `
      <ellipse cx="200" cy="448" rx="190" ry="26" fill="#7cc26b" ${s}/>
      ${[[70, 438], [120, 444], [300, 440], [340, 446], [250, 452]].map(([x, y]) =>
        `<path d="M${x - 8} ${y} q4 -14 8 0 q4 -16 8 0" fill="none" stroke="#3f9b4f" stroke-width="3" stroke-linecap="round"/>`).join('')}`;

    // Little wooden sign with the count.
    const sign = `
      <g transform="translate(46 360)">
        <path d="M34 34 V78" stroke="${INK}" stroke-width="3"/>
        <rect x="32" y="34" width="6" height="46" fill="#9a6a37" ${s} stroke-width="2"/>
        <rect x="0" y="0" width="80" height="40" rx="8" fill="#e3b77e" ${s}/>
        <text x="40" y="28" text-anchor="middle" font-family="'Baloo 2', Nunito, sans-serif" font-weight="800" font-size="24" fill="${INK}">${n}/${goal}</text>
      </g>`;

    const back = leaves.filter(l => l[1] <= 150 || l[0] === -92);
    const front = leaves.filter(l => !back.includes(l));
    return `<svg viewBox="0 0 ${W} ${H + 20}" aria-hidden="true" class="banana-tree ${n >= goal ? 'full' : ''}">
      ${ground}
      ${back.map(leaf).join('')}
      ${trunk}
      ${front.map(leaf).join('')}
      <circle cx="${cx}" cy="${crownY + 4}" r="12" fill="#6b8f3a" ${s} stroke-width="2.5"/>
      ${bunchSvg}
      ${sparkle}
      ${sign}
    </svg>`;
  }

  const icons = {
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8q3 4 0 8M18.5 5.5q5 6.5 0 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    camera: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    gift: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 7h18v3H3zM12 7v13M12 7q-5-5-6 0M12 7q5-5 6 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="currentColor"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" fill="currentColor"/></svg>',
    print: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V4h10v5M7 17H4v-7h16v7h-3M7 14h10v6H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3q5 9 0 18M12 3q-5 9 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/></svg>'
  };

  window.ART = { walk, dish, jungle, nepal, silhouette, hunt, media, hallway, items, face, tree, bananaIcon, icons };
})();
