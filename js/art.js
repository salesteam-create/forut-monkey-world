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

  // Banana tree with `goal` slots in hanging bunches, `n` filled.
  function tree(n, goal, justAdded) {
    // Four bunches of six hanging under the crown.
    const bunches = [[118, 150], [172, 172], [236, 172], [290, 150]];
    let bananas = '';
    for (let i = 0; i < goal; i++) {
      const [bx, by] = bunches[Math.floor(i / 6) % bunches.length];
      const k = i % 6, col = k % 2, row = Math.floor(k / 2);
      const x = bx - 26 + col * 24, y = by + row * 24;
      const inner = `<g transform="rotate(${col ? 20 : -14} 22 18) scale(.7)">${banana(i < n)}</g>`;
      // The pop animation sits on its own group so it does not override the positioning transform.
      bananas += `<g transform="translate(${x} ${y})">${justAdded && i === n - 1 ? `<g class="pop">${inner}</g>` : inner}</g>`;
    }
    return `<svg viewBox="0 0 400 420" aria-hidden="true">
      <path d="M180 420 Q190 300 196 150 H212 Q214 300 232 420Z" fill="#9b6b3c" ${s}/>
      <g ${s} fill="#3f9b4f">
        <path d="M204 120 Q120 40 30 90 Q110 80 204 140Z"/>
        <path d="M204 120 Q290 40 380 90 Q300 80 204 140Z" fill="#4fae5c"/>
        <path d="M204 120 Q150 20 110 10 Q160 60 196 130Z" fill="#4fae5c"/>
        <path d="M204 120 Q270 10 320 20 Q250 60 212 130Z"/>
        <path d="M204 130 Q90 130 40 200 Q120 150 204 150Z" fill="#5fbf6b"/>
        <path d="M204 130 Q320 130 370 200 Q290 150 204 150Z" fill="#5fbf6b"/>
      </g>
      ${bananas}
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

  window.ART = { jungle, nepal, silhouette, hunt, media, hallway, items, face, tree, bananaIcon, icons };
})();
