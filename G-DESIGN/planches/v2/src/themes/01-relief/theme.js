/* 01 — Relief : argile blanche éclairée par la gauche, une seule couleur (l'eau).
   V2.1 : contraste renforcé — fond plus sombre en périphérie (CSS), lumière clé forte,
   ambiance basse, contre-jour qui détache les arêtes : le module 3D sort du fond. */
window.THEME = {
  bg: '#e9e8e4', transparent: true, floorShadow: 0.2, accent: '#2e7d8f', exposure: 1.05, fov: 30,
  envBg: '#cfcec9',
  envPanels: [{ c: '#ffffff', x: -12, y: 10, z: 6, w: 14, h: 10 }, { c: '#9a9994', x: 12, y: 4, z: 4, w: 10, h: 8 }],
  camDesk: [3.2, 7.5, 27, 1.2, 4.9, 0], camMob: [1.8, 7, 33, 0, 5.4, 0],
  mat: {
    wall: { color: '#f7f6f2', roughness: 0.92 },
    floor: { color: '#e9e8e4', roughness: 1 },
    steel: { color: '#9c9b95', roughness: 0.55 },
    held: { color: '#2e7d8f', roughness: 0.5 },
    ball: { color: '#111213', metalness: 0.25, roughness: 0.16 },
    water: { color: '#6fb3bf', roughness: 0.2, transparent: true, opacity: 0.32, depthWrite: false },
    surface: { color: '#bfe2e8', roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.85 }
  },
  lights: [
    { t: 'hemi', c: '#ffffff', g: '#8f8e89', i: 0.28 },
    { t: 'dir', c: '#ffffff', i: 4.6, x: -14, y: 14, z: 9, shadow: true, soft: 16 },
    { t: 'dir', c: '#ffffff', i: 1.3, x: 9, y: 12, z: -12 },
    { t: 'dir', c: '#e9eef0', i: 0.06, x: 10, y: 6, z: 8 }
  ]
};
