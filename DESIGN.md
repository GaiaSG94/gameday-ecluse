# DESIGN — Écluse

> Journal de design. Versions datées, jamais écrasées. Tenu par Claude (prompt design).
> Livrables : `G-DESIGN/` (PAGES, REFS, STYLE, planches).

## V1 — 2026-11-18 · Exploration de style sur la page Jeu

**Statut** : en attente de validation de Gaia (étape B du process). Rien n'est verrouillé.

### Compris du produit
Une bille descend dans un puits d'écluse traversé par 5 portes qui balaient de gauche à droite. Toucher une porte la bloque 0,9 s ; si la bille touche une porte en mouvement, on relâche. Une écluse par jour, même seed pour tous, on garde le meilleur temps et la série.

### Pages proposées
Voir `G-DESIGN/PAGES.md` : Post, Jeu, Carte de fin, Séries & classement (+ états : chargement, porte heurtée, déjà joué, erreur).

### Trois directions (page Jeu, desktop 1440 × 900 + mobile 390 × 844)
| # | Fichier | Palette | Typo | Motif |
|---|---------|---------|------|-------|
| 01 | `planches/v1/01-acier.html` | acier `#3a4450`, eau `#2e7d8f`, accent caustique `#bfe9f0` sur nuit `#141a20` | sans condensée industrielle + mono pour chiffres et portes | caustiques animées dans l'eau, ligne d'eau ondulée, plaques rivetées |
| 02 | `planches/v1/02-releve.html` | papier `#eceae3`, encre `#1d2b33`, accent signal `#e4572e` | grotesque médium + mono technique | coupe d'ingénieur : hachures, cotes, symbole de niveau d'eau ▽ « WL ±0.00 » |
| 03 | `planches/v1/03-sodium.html` | nuit `#07090b`, eau `#0b1b20`, accent sodium `#f2a541` | sans fine pour le chrono, mono espacée pour les libellés | une lampe au sodium, reflets ambrés sur l'eau, anneau qui se vide sur la porte tenue |

Chaque planche montre aussi 4 vignettes d'états : prêt, porte tenue, porte heurtée, chargement.

### Décisions prises
- Même cadre de post neutre (sans marque) sur les 3 planches pour comparer uniquement le jeu.
- La bille est fixe au centre (comme dans `src/shared/puzzle.ts`) : un trait pointillé marque son couloir pour que la règle se lise en 5 s.
- Desktop : 3 colonnes (chiffres · puits · liste des portes). Mobile : chiffres en bandeau, puits plein cadre.
- Une seule couleur d'accent par direction, réservée à la porte tenue et au mot-clé « hold it ».
- Polices système uniquement dans les planches (aucune requête réseau) ; la police finale sera embarquée en OFL dans l'app.

### Questions ouvertes
Voir `G-DESIGN/PAGES.md` § Questions produit (bille ou caisse, temps par essai ou cumulé, classement du jour non stocké, rejouer après réussite).

### Changelog
- 2026-11-18 · V1 · PAGES.md, REFS.md, 3 planches de la page Jeu.

## V2 — 2026-11-18 · Reprise de zéro : refs de l'usine, narration + 3D matière

**Statut** : en attente de validation de Gaia. V1 conservée telle quelle (`planches/v1/`), écartée.

**Pourquoi** : retour de Gaia : repartir de zéro en s'appuyant sur les refs design de l'usine (`hackatons-pipeline/REFERENCES-DESIGN.md`), côté narration de jeu et 3D matière. Les planches V1 étaient en SVG/CSS plat.

### Ce qui change
- **Vraie 3D** : three.js r158 (MIT, vendorisé dans `planches/v2/vendor/`) inliné dans chaque planche. L'écluse est modélisée avec des parois biseautées, des rails, 5 plaques, une eau translucide à surface ondulante, la bille et des ombres portées. Tout s'ouvre en double-cliquant, sans réseau.
- **Moteur commun, thèmes séparés** : `src/engine.js` (scène, états, projection des ancres) + `src/themes/<dir>/` (matière, lumière, caméra, HUD, annotations). `node build.mjs` assemble `dist/*.html`.
- **Narration sur la scène** : les annotations suivent les objets 3D en temps réel (étiquette de la porte tenue, « your ball », flèche et cercle tracés à la main en 03).

### Trois directions
| # | Fichier | Refs | Matière / lumière | Accent | Typo |
|---|---------|------|-------------------|--------|------|
| 01 | `planches/v2/dist/01-relief.html` | Flow Computing, Igloo | argile blanche mate, lumière de gauche, longue ombre à droite | eau `#2e7d8f` | linéale serrée noir puis gris ; chrono dans un onglet noir vertical |
| 02 | `planches/v2/dist/02-nuit.html` | Igloo, Noon | béton mouillé, acier, eau sombre, une lampe au sodium | sodium `#f2a541` | chrono fin géant, mono espacée pour les libellés |
| 03 | `planches/v2/dist/03-maquette.html` | Gapsy, Dominic Burt, Flow | maquette dans une salle blanche, sol bois, grain | rouge `#d7362b` | « ÉCLUSE— » en relief rouge au mur, notes à la main |

### Changelog
- 2026-11-18 · V2 · REFS.md (section V2), PAGES.md (statut), moteur 3D + 3 planches de la page Jeu, vérifiées dans le navigateur (desktop + mobile + 4 états).

## V2.1 — 2026-11-18 · Direction retenue : 01 Relief, contraste renforcé

**Décision de Gaia** : la direction **01 Relief** est retenue, avec une demande : « augmente les contrastes de lumière pour faire ressortir le module 3D au milieu ». Le style n'est pas encore verrouillé (`/lock` attend toutes les pages).

### Ce qui change (`planches/v2/src/themes/01-relief/`, `src/engine.js`)
- **Fond** : un puits de lumière clair derrière le module (`#f7f6f3`) qui s'assombrit vers les bords (`#bfbeb8`). Le canvas est transparent pour laisser voir ce dégradé.
- **Lumière** : lumière clé de gauche passée de 3,4 à 4,6, ambiance de 0,55 à 0,28, nouveau contre-jour arrière droit (1,3) qui détache les arêtes ; les faces à l'ombre sont nettement plus sombres.
- **Matière** : parois plus blanches (`#f7f6f2`), plaques plus sombres (`#9c9b95`), eau un peu plus dense : les portes se lisent mieux sur le blanc.
- **Ombre portée** : ombres PCF au lieu de PCFSoft (le flou `radius` est enfin appliqué), zone d'ombre élargie : longue ombre douce à droite, sans coupure nette.
- **Lisibilité** : gris des libellés de `#9a9a96` à `#6f6e69` (le fond plus sombre les effaçait).
- Effet de bord : le passage aux ombres PCF s'applique aussi à 02 et 03 (rebâties, non revérifiées visuellement).

### Changelog
- 2026-11-18 · V2.1 · contraste lumière de 01 Relief, vérifié en desktop et en mobile.

## V2.2 — 2026-11-18 · Déclinaison Relief sur les 4 pages

**Statut** : les 4 planches attendent la revue de Gaia. `/lock` possible une fois toutes validées.

### Livré
- `G-DESIGN/STYLE.md` : palette, typographie, grille, composants, 3D, mouvement, états du style Relief.
- `planches/v2/dist/relief-01-post.html` : **Post**, l'aperçu inline du feed (760 × 512 en desktop) : titre en deux temps, pilule noire « Open the lock », série. États : déjà joué, chargement, erreur.
- `planches/v2/dist/relief-02-jeu.html` : **Jeu**, celui de V2.1 (onglet-chrono, pastille « Held », étiquettes de portes).
- `planches/v2/dist/relief-03-fin.html` : **Carte de fin** : bille au fond, pastille eau « 00:21.40 » accrochée à la bille, meilleur temps / essais / série, aperçu du commentaire sans spoiler, pilule noire « Post your time », compte à rebours.
- `planches/v2/dist/relief-04-series.html` : **Séries & classement** : série sur 14 jours, meilleurs temps du jour, ligne du joueur en eau, le module en témoin à gauche (masqué en mobile). Classement **en données de démo** (marqué sur la planche).

### Décisions
- Le puits de lumière du fond suit le module : centré en Jeu, à droite en Post et Fin, à gauche en Séries.
- Une seule masse noire par écran : onglet-chrono (Jeu), « Open the lock » (Post), « Post your time » (Fin), « See all times » (Séries).
- Mobile Séries : le module 3D disparaît au profit de la liste (lisibilité avant décor).

### Technique
- `build.mjs` construit l'exploration (`src/themes/*` sur la page Jeu) et la déclinaison (`src/pages/*`, `THEME` + `OUT`, `FROM` pour réutiliser une page). Nouveaux états de scène `post`, `done`, `error`. Les ancres HTML tiennent compte du décalage du canvas ; les vues masquées ne sont plus dessinées.

### Changelog
- 2026-11-18 · V2.2 · STYLE.md + planches Post, Jeu, Carte de fin, Séries & classement (desktop + mobile), vérifiées dans le navigateur, sans erreur console.
