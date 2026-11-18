/* 02 — Nuit d'écluse : béton mouillé, acier, une lampe au sodium (seul accent). */
window.THEME = {
  bg: '#06080a', fog: ['#06080a', 30, 60], accent: '#f2a541', exposure: 1.15, fov: 30,
  envBg: '#05070a',
  envPanels: [{ c: '#ffb35c', x: 0, y: 14, z: 4, w: 4, h: 1.2 }, { c: '#3d5260', x: 12, y: 6, z: -8, w: 8, h: 10 }, { c: '#26343c', x: -6, y: 4, z: 14, w: 14, h: 8 }],
  camDesk: [-3.5, 11.5, 25, 0.4, 4.6, 0], camMob: [-2, 10, 35, 1.0, 6.4, 0],
  mat: {
    wall: { color: '#4f5a63', roughness: 0.9 },
    floor: { color: '#0c0e10', roughness: 0.35, metalness: 0.4 },
    steel: { color: '#6d747a', metalness: 0.85, roughness: 0.3 },
    held: { color: '#b86a14', metalness: 0.3, roughness: 0.35, emissive: '#f28a1c', emissiveIntensity: 1.1 },
    ball: { color: '#e6e9eb', metalness: 0.45, roughness: 0.18 },
    water: { color: '#1f6470', roughness: 0.1, transparent: true, opacity: 0.42, depthWrite: false },
    surface: { color: '#2b7684', roughness: 0.04, metalness: 0.3, clearcoat: 1, transparent: true, opacity: 0.8 }
  },
  lights: [
    { t: 'hemi', c: '#3a4a56', g: '#05070a', i: 0.6 },
    { t: 'point', c: '#ffc27a', i: 95, d: 40, x: 0.5, y: 14.5, z: 4, shadow: true },
    { t: 'dir', c: '#8fb5c8', i: 0.9, x: 9, y: 10, z: -9 },
    { t: 'dir', c: '#9fbfd0', i: 0.45, x: -8, y: 6, z: 14 }
  ]
};
