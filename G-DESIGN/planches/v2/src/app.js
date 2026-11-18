/* Écluse V2 — montage des vues et boucle de rendu (commun à toutes les planches). */
(function () {
  'use strict';
  var MSG = {
    ready: ['Drop the ball', 'Lock of the day'],
    jam: ['Gate jammed', 'Drop again · attempt 3'],
    load: ['Filling the canal', 'One moment'],
    done: ['Through in 00:21.40', 'Next lock in 08:42:16'],
    error: ['The canal is dry', 'Reload']
  };
  var tpl = document.getElementById('game');
  var views = [];
  document.querySelectorAll('[data-view]').forEach(function (host) {
    var g = tpl.content.cloneNode(true).querySelector('.game');
    var key = host.getAttribute('data-view');
    g.classList.add('is-' + key);
    var cv = g.querySelector('.cv'); cv.id = 'cv-' + host.getAttribute('data-id');
    var m = MSG[key];
    if (m) g.querySelector('.msg').innerHTML = '<b>' + m[0] + '</b><span>' + m[1] + '</span>';
    host.appendChild(g);
    views.push({ key: key, cv: cv, g: g, live: !host.classList.contains('sw') });
  });

  var eng = window.Ecluse(window.THEME);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function place(v, a) {
    var g = v.g, ox = v.cv.offsetLeft, oy = v.cv.offsetTop; // le canvas peut être décalé dans le cadre
    function put(e, p) { e.style.left = (p.x + ox) + 'px'; e.style.top = (p.y + oy) + 'px'; }
    function at(sel, p) { var e = g.querySelector(sel); if (e) put(e, p); }
    at('.a-ball', a.ball); at('.a-held', a.held);
    g.querySelectorAll('.gl').forEach(function (e, i) { put(e, a.gates[i]); });
    if (window.THEME.scribble) window.THEME.scribble(g.querySelector('.scrib'), a, v);
  }

  function frame(ms) {
    var t = ms / 1000;
    views.forEach(function (v) {
      if (!v.live && v.done) return;
      var a = eng.draw(v.cv, v.key, v.live && !reduce ? t : 3.2);
      if (a) place(v, a);
      v.done = true;
    });
    if (!reduce) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  var b = document.getElementById('board');
  function fit() {
    var k = location.hash === '#full' ? 1 : Math.min(1, window.innerWidth / 1990);
    b.style.transform = 'scale(' + k + ')';
    document.body.style.height = (b.offsetHeight * k) + 'px';
  }
  window.addEventListener('resize', fit); fit();
})();
