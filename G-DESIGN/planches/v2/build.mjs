// Assemble les planches V2 autonomes dans dist/ (aucune requête réseau au rendu).
// - Exploration : une planche « Jeu » par direction (src/themes/*)        -> dist/<theme>.html
// - Déclinaison : une planche par page, dans le style retenu (src/pages/*) -> dist/<page.OUT>.html
// Usage : node build.mjs
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const rd = (p) => readFileSync(join(here, p), 'utf8');
const json = (p) => JSON.parse(rd(p));
const three = rd('vendor/three.min.js').replace(/^console\.warn\([^\n]*\),\n/, 'void 0,\n');
const shared = {
  CSS_BASE: rd('src/base.css'),
  CSS_GAME: rd('src/game.css'),
  THREE: three,
  ENGINE: rd('src/engine.js'),
  APP: rd('src/app.js'),
};

const theme = (dir) => ({
  ...json(`src/themes/${dir}/meta.json`),
  CSS_THEME: rd(`src/themes/${dir}/theme.css`),
  THEME_JS: rd(`src/themes/${dir}/theme.js`),
});
const page = (id) => {
  const meta = json(`src/pages/${id}/meta.json`);
  const src = meta.FROM || id; // FROM : réutilise le contenu d'une autre page (sans dupliquer)
  const own = (f) => (existsSync(join(here, `src/pages/${id}/${f}`)) ? `src/pages/${id}/${f}` : `src/pages/${src}/${f}`);
  return {
    ...(meta.FROM ? json(`src/pages/${src}/meta.json`) : {}),
    ...meta,
    CSS_PAGE: rd(own('page.css')),
    EMBED: rd(own('embed.html')),
    STATES: existsSync(join(here, own('states.html'))) ? rd(own('states.html')) : '',
  };
};

function emit(out, vars) {
  let html = rd('src/tpl.html');
  // remplacement littéral (pas de motifs $ interprétés) ; THREE en dernier
  const keys = Object.keys(vars).filter((k) => k !== 'THREE').concat('THREE');
  // deux passes : le contenu de page (EMBED, STATES) contient lui-même des variables du thème
  for (let pass = 0; pass < 2; pass++) for (const k of keys) html = html.split(`{{${k}}}`).join(vars[k]);
  const left = html.replace(vars.THREE, '').match(/{{[A-Z_]+}}/g);
  if (left) throw new Error(`${out}: variables non remplacées ${left.join(', ')}`);
  writeFileSync(join(here, 'dist', out), html);
  console.log(`dist/${out}  ${(html.length / 1024).toFixed(0)} Ko`);
}

for (const dir of readdirSync(join(here, 'src/themes'))) {
  emit(`${dir}.html`, { ...shared, ...page('jeu'), ...theme(dir) });
}
for (const id of readdirSync(join(here, 'src/pages'))) {
  const p = page(id);
  if (!p.THEME) continue; // la page Jeu sert l'exploration
  const t = theme(p.THEME);
  emit(p.OUT, { ...shared, ...t, ...p });
}
