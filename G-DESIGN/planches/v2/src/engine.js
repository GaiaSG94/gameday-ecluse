/* Écluse V2 — moteur 3D commun (three r158, global THREE).
   Un seul renderer WebGL ; chaque vue (desktop, mobile, vignettes) est rendue
   puis copiée dans son canvas 2D. Les thèmes ne décrivent que matière et lumière. */
(function () {
  'use strict';
  var T = window.THREE;
  var W = 5;            // largeur du puits en cases (shared/puzzle.ts : WIDTH)
  var SPAN = 2;         // largeur d'une porte
  var H = 10;           // hauteur du puits (unités 3D)
  var ROWS = [1, 2, 3, 4, 5].map(function (i) { return H - H * (i / 6); });

  function mat(o) { return new T.MeshStandardMaterial(o); }

  /* volume à arêtes adoucies (la lumière accroche les bords : matière, pas boîte) */
  function rbox(w, h, d, r) {
    r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    var s = new T.Shape(), x = -w / 2 + r, y = -h / 2 + r, iw = w - 2 * r, ih = h - 2 * r;
    s.moveTo(x, y); s.lineTo(x + iw, y); s.lineTo(x + iw, y + ih); s.lineTo(x, y + ih); s.lineTo(x, y);
    var g = new T.ExtrudeGeometry(s, { depth: d - 2 * r, bevelEnabled: true, bevelThickness: r, bevelSize: r, bevelSegments: 4, curveSegments: 4 });
    g.translate(0, 0, -(d - 2 * r) / 2); g.computeVertexNormals();
    return g;
  }

  function envFrom(renderer, theme) {
    var s = new T.Scene();
    s.background = new T.Color(theme.envBg);
    var g = new T.BoxGeometry(1, 1, 1);
    theme.envPanels.forEach(function (p) {
      var m = new T.Mesh(g, new T.MeshBasicMaterial({ color: p.c }));
      m.position.set(p.x, p.y, p.z); m.scale.set(p.w, p.h, 0.1); m.lookAt(0, 0, 0);
      s.add(m);
    });
    var pm = new T.PMREMGenerator(renderer);
    return pm.fromScene(s, 0.04).texture;
  }

  function buildLock(theme) {
    var root = new T.Group();
    var M = theme.mat;
    var wallM = mat(M.wall), steelM = mat(M.steel), heldM = mat(M.held);
    var floorM = theme.floorShadow ? new T.ShadowMaterial({ opacity: theme.floorShadow }) : mat(M.floor);
    // parois, fond, radier
    [[-W / 2 - 0.4, 0.8], [W / 2 + 0.4, 0.8]].forEach(function (p) {
      var w = new T.Mesh(rbox(p[1], H + 1.2, 3.2, 0.14), wallM);
      w.position.set(p[0], H / 2 + 0.1, 0); w.castShadow = w.receiveShadow = true; root.add(w);
    });
    var back = new T.Mesh(rbox(W + 1.6, H + 1.2, 0.4, 0.12), wallM);
    back.position.set(0, H / 2 + 0.1, -1.6); back.receiveShadow = true; root.add(back);
    var base = new T.Mesh(rbox(W + 2.4, 0.5, 4, 0.14), wallM);
    base.position.set(0, -0.25, 0); base.receiveShadow = true; root.add(base);
    var plinth = new T.Mesh(new T.BoxGeometry(60, 0.2, 60), floorM);
    plinth.position.y = -0.6; plinth.receiveShadow = true; root.add(plinth);
    // eau
    var waterM = new T.MeshPhysicalMaterial(M.water);
    var water = new T.Mesh(new T.BoxGeometry(W, 1, 2.8), waterM);
    water.receiveShadow = true; root.add(water);
    var surfG = new T.PlaneGeometry(W, 2.8, 40, 16);
    surfG.rotateX(-Math.PI / 2);
    var surf = new T.Mesh(surfG, new T.MeshPhysicalMaterial(M.surface));
    root.add(surf);
    // portes : rails + plaques
    var gates = ROWS.map(function (y) {
      var rail = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, W, 12), steelM);
      rail.rotation.z = Math.PI / 2; rail.position.set(0, y, -0.9); root.add(rail);
      var rail2 = rail.clone(); rail2.position.z = 0.9; root.add(rail2);
      var plate = new T.Mesh(rbox(SPAN - 0.06, 0.34, 2.1, 0.08), steelM);
      plate.castShadow = plate.receiveShadow = true; plate.position.y = y; root.add(plate);
      return { y: y, plate: plate };
    });
    // anneau de maintien (jauge 0,9 s)
    var ringM = new T.MeshBasicMaterial({ color: theme.accent, side: T.DoubleSide, transparent: true });
    var ring = new T.Mesh(new T.RingGeometry(0.42, 0.5, 48, 1, Math.PI / 2, Math.PI * 2 * 0.6), ringM);
    root.add(ring);
    // bille
    var ball = new T.Mesh(new T.SphereGeometry(0.36, 48, 32), mat(M.ball));
    ball.castShadow = true; root.add(ball);
    return { root: root, gates: gates, ball: ball, water: water, surf: surf, ring: ring, steelM: steelM, heldM: heldM };
  }

  function lights(scene, theme) {
    theme.lights.forEach(function (l) {
      var o;
      if (l.t === 'hemi') o = new T.HemisphereLight(l.c, l.g, l.i);
      if (l.t === 'dir') {
        o = new T.DirectionalLight(l.c, l.i); o.position.set(l.x, l.y, l.z);
        if (l.shadow) {
          o.castShadow = true; o.shadow.mapSize.set(2048, 2048); o.shadow.radius = l.soft || 4;
          var c = o.shadow.camera; c.left = -14; c.right = 22; c.top = 16; c.bottom = -6; c.far = 80;
          o.shadow.bias = -0.0004; o.target.position.set(0, 4, 0); scene.add(o.target);
        }
      }
      if (l.t === 'point') {
        o = new T.PointLight(l.c, l.i, l.d || 0, 2); o.position.set(l.x, l.y, l.z);
        if (l.shadow) { o.castShadow = true; o.shadow.mapSize.set(1024, 1024); o.shadow.radius = 6; }
      }
      scene.add(o);
    });
  }

  /* état d'une vue : où est la bille, quel niveau d'eau, quelle porte tenue */
  var STATES = {
    run:   { ballY: ROWS[2] + 1.05, water: 0.93, held: 2, passed: 2, jam: -1 },
    ready: { ballY: H + 0.35, water: 0.93, held: -1, passed: 0, jam: -1 },
    held:  { ballY: ROWS[2] + 0.75, water: 0.93, held: 2, passed: 2, jam: -1 },
    jam:   { ballY: ROWS[3] + 0.53, water: 0.93, held: -1, passed: 3, jam: 3 },
    load:  { ballY: -99, water: 0.35, held: -1, passed: 0, jam: -1 },
    post:  { ballY: H + 0.35, water: 0.93, held: -1, passed: 0, jam: -1 },
    done:  { ballY: 0.36, water: 0.93, held: -1, passed: 5, jam: -1 },
    error: { ballY: -99, water: 0.04, held: -1, passed: 0, jam: -1 }
  };
  var PHASE = [0.12, 0.71, 0.0, 0.33, 0.88];
  var SPEED = [0.13, 0.11, 0.16, 0.15, 0.1];

  function gateX(i, t, st) {
    if (i === st.held) return -W / 2 + SPAN / 2 + 0.05;           // tenue à gauche : couloir libre
    if (i === st.jam) return 0.25;                                // bloque le couloir central
    var s = (Math.sin((t * SPEED[i] + PHASE[i] * 2) * Math.PI) + 1) / 2;
    return -W / 2 + SPAN / 2 + s * (W - SPAN);
  }

  function pose(L, st, t, theme) {
    L.gates.forEach(function (g, i) {
      g.plate.position.x = gateX(i, t, st);
      g.plate.material = i === st.held ? L.heldM : L.steelM;
      g.plate.position.z = i < st.passed && i !== st.held ? 0 : 0;
    });
    var top = H * st.water;
    L.water.scale.y = top; L.water.position.y = top / 2;
    var p = L.surf.geometry.attributes.position;
    for (var k = 0; k < p.count; k++) {
      var x = p.getX(k), z = p.getZ(k);
      p.setY(k, 0.035 * Math.sin(x * 3 + t * 1.3) + 0.025 * Math.sin(z * 4 - t * 1.7));
    }
    p.needsUpdate = true; L.surf.geometry.computeVertexNormals();
    L.surf.position.y = top + 0.01;
    L.ball.visible = st.ballY > -50;
    L.ball.position.set(0, st.ballY + (st.held >= 0 ? 0.04 * Math.sin(t * 2.2) : 0), 0.15);
    L.ring.visible = st.held >= 0;
    if (st.held >= 0) {
      var hp = L.gates[st.held].plate.position;
      L.ring.position.set(hp.x, hp.y, 1.12);
    }
  }

  function project(cam, v, w, h) {
    var p = v.clone().project(cam);
    return { x: (p.x + 1) / 2 * w, y: (1 - p.y) / 2 * h };
  }

  window.Ecluse = function (theme) {
    var renderer = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: !!theme.transparent });
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFShadowMap; // PCF : respecte shadow.radius (ombres adoucies)
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = theme.exposure || 1;
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    var scene = new T.Scene();
    if (!theme.transparent) scene.background = new T.Color(theme.bg);
    if (theme.fog) scene.fog = new T.Fog(theme.fog[0], theme.fog[1], theme.fog[2]);
    scene.environment = envFrom(renderer, theme);
    lights(scene, theme);
    var L = buildLock(theme); scene.add(L.root);
    var cams = {};

    function camFor(key, w, h) {
      if (!cams[key]) cams[key] = new T.PerspectiveCamera(theme.fov || 30, w / h, 0.1, 200);
      var c = cams[key], wide = w / h > 1;
      var cv = wide ? theme.camDesk : theme.camMob;
      c.aspect = w / h; c.position.set(cv[0], cv[1], cv[2]); c.lookAt(cv[3], cv[4], cv[5]);
      c.updateProjectionMatrix(); return c;
    }

    function draw(canvas, stateKey, t) {
      var w = canvas.clientWidth, h = canvas.clientHeight, dpr = renderer.getPixelRatio();
      if (!w || !h) return null; // vue masquée (ex. module caché en mobile)
      if (canvas.width !== Math.round(w * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
      renderer.setSize(w, h, false);
      var st = STATES[stateKey]; pose(L, st, t, theme);
      var cam = camFor(canvas.id || stateKey + w, w, h);
      renderer.render(scene, cam);
      var ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);
      // ancres pour les annotations HTML/SVG
      var heldIdx = st.held >= 0 ? st.held : 2;
      return {
        ball: project(cam, L.ball.position, w, h),
        held: project(cam, L.gates[heldIdx].plate.position.clone().add(new T.Vector3(0, 0, 1.05)), w, h),
        gates: L.gates.map(function (g) { return project(cam, new T.Vector3(W / 2 + 0.8, g.y, 1.6), w, h); }),
        surface: project(cam, new T.Vector3(-W / 2, H * st.water, 1.4), w, h)
      };
    }
    return { draw: draw };
  };
})();
