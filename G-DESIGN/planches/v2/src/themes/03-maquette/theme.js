/* 03 — Maquette annotée : une maquette d'écluse posée dans une salle blanche,
   griffonnée à la main pour raconter la règle. Seul accent : rouge. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  function el(svg, tag, attrs) {
    var e = svg.querySelector('[data-k="' + attrs['data-k'] + '"]');
    if (!e) { e = document.createElementNS(NS, tag); svg.appendChild(e); }
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  /* trait main levée : légère irrégularité déterministe */
  function wobblyCircle(cx, cy, rx, ry) {
    var d = '', n = 22;
    for (var i = 0; i <= n + 2; i++) {
      var a = (i / n) * Math.PI * 2 - 0.6, j = 1 + 0.06 * Math.sin(i * 2.7) + (i > n ? 0.08 : 0);
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rx * j).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * j).toFixed(1);
    }
    return d;
  }
  window.THEME = {
    bg: '#efede8', transparent: true, floorShadow: 0.2, accent: '#d7362b', exposure: 1.0, fov: 28,
    envBg: '#e8e6e1',
    envPanels: [{ c: '#ffffff', x: -6, y: 14, z: 6, w: 8, h: 3 }, { c: '#ffffff', x: 6, y: 14, z: 6, w: 8, h: 3 }],
    camDesk: [8, 11, 31, 2.6, 3.6, 0], camMob: [5, 10.5, 36, 0, 4.4, 0],
    mat: {
      wall: { color: '#d9d6cf', roughness: 0.9 },
      floor: { color: '#c9a77c', roughness: 0.7 },
      steel: { color: '#8b9298', metalness: 0.75, roughness: 0.35 },
      held: { color: '#d7362b', roughness: 0.45 },
      ball: { color: '#151515', metalness: 0.3, roughness: 0.15 },
      water: { color: '#5fa8b6', roughness: 0.15, transparent: true, opacity: 0.35, depthWrite: false },
      surface: { color: '#9fd0d9', roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.75 }
    },
    lights: [
      { t: 'hemi', c: '#ffffff', g: '#b9a384', i: 0.9 },
      { t: 'dir', c: '#ffffff', i: 2.4, x: -4, y: 20, z: 7, shadow: true, soft: 8 },
      { t: 'dir', c: '#fff4e6', i: 0.4, x: 8, y: 8, z: 10 }
    ],
    scribble: function (svg, a, v) {
      var s = 'stroke:#d7362b;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round';
      var h = a.held, b = a.ball, wide = v.cv.clientWidth > 600;
      el(svg, 'path', { 'data-k': 'c', d: wobblyCircle(h.x - 4, h.y, wide ? 58 : 46, wide ? 22 : 18), style: s });
      var bx = b.x + (wide ? 92 : 64), by = b.y - (wide ? 52 : 40);
      el(svg, 'path', { 'data-k': 'ar', d: 'M' + bx + ' ' + by + ' C ' + (bx - 30) + ' ' + (by - 6) + ', ' + (b.x + 30) + ' ' + (b.y - 30) + ', ' + (b.x + 15) + ' ' + (b.y - 8), style: s });
      el(svg, 'path', { 'data-k': 'ah', d: 'M' + (b.x + 13) + ' ' + (b.y - 20) + ' L ' + (b.x + 14) + ' ' + (b.y - 7) + ' L ' + (b.x + 26) + ' ' + (b.y - 11), style: s });
    }
  };
})();
