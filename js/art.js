// Inline SVG illustrations, drawn to match the FORUT character style:
// thick dark outlines, flat fills, rounded shapes. Placeholders until the design team's art is ready.
(function () {
  const INK = '#2b2b2b';
  const s = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

  const jungle = `
<svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#bfe8ff"/><stop offset="1" stop-color="#e9f8ff"/>
    </linearGradient>
  </defs>
  <rect width="400" height="700" fill="url(#sky)"/>
  <circle cx="320" cy="90" r="38" fill="#ffe27a"/>
  <path d="M0 420 Q100 340 200 400 T400 380 V700 H0Z" fill="#9fd48a"/>
  <path d="M0 500 Q120 430 240 490 T400 470 V700 H0Z" fill="#7cc26b"/>
  <path d="M0 600 Q140 540 260 590 T400 580 V700 H0Z" fill="#5eae55"/>
  <g ${s} fill="#3f9b4f">
    <path d="M-10 60 Q60 40 110 110 Q50 110 -10 150Z"/>
    <path d="M-10 150 Q70 150 100 230 Q30 210 -10 250Z" fill="#4fae5c"/>
    <path d="M410 200 Q330 190 300 270 Q360 260 410 300Z"/>
    <path d="M410 300 Q320 320 310 400 Q370 370 410 400Z" fill="#4fae5c"/>
  </g>
  <g ${s} fill="none">
    <path d="M40 0 Q60 80 30 160" stroke="#6b4b2a" stroke-width="4"/>
    <path d="M370 0 Q350 60 375 140" stroke="#6b4b2a" stroke-width="4"/>
  </g>
</svg>`;

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
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/></svg>'
  };

  window.ART = { jungle, hallway, items, face, tree, bananaIcon, icons };
})();
