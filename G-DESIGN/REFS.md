# REFS — Écluse

> Principes retenus uniquement. Aucun layout, texte, asset, police ou marque repris.
> Ouvertes le 2026-11-18 dans le navigateur intégré.

## Framer — framer.com

Observé :
- Fond noir plein, texte blanc ; une seule couleur vive réservée à l'action et à la lumière (halo bleu derrière le module de démonstration).
- Titres en graisse moyenne (500), pas en gras : 54 px / interlignage 1.0 / approche négative (≈ −0,04 em). Corps en 14 px. Très peu de tailles différentes.
- Navigation minuscule (12 px), un seul bouton plein blanc ; tout le reste est texte ou contour.
- La lumière vient d'un seul endroit (le halo) et sert à guider l'œil vers l'objet interactif.
- Transitions sur toutes les propriétés, courtes ; rien ne clignote.

Retenu pour Écluse :
1. **Retenue** : 2 graisses, 4 tailles max, un seul bouton plein par écran.
2. **Lumière = attention** : la lueur (caustique / lampe) est posée là où le joueur doit regarder (la porte qui approche de la bille), pas en décor partout.
3. **Titres serrés, graisse moyenne** : chiffres du chrono et nom du jeu en approche négative, pas de « font-black » criard.
4. **Mouvement court et amorti** : 160–240 ms, courbe ease-out, pas de rebond.

## Igloo Inc. — igloo.inc

Observé :
- Le site est une scène WebGL plein écran. Dans le navigateur intégré, **seul l'écran de chargement s'est affiché** (la scène 3D n'a pas démarré, même après ~20 s) : un fond gris-bleu froid uni (`#a0a5b1`) et un petit chargeur fait de caractères ASCII qui se transforment.
- Pas de texte HTML visible, pas de chrome : la matière (le décor) *est* l'interface.

Retenu pour Écluse (à confirmer sur une machine où la scène se charge) :
1. **Un seul décor matériel** : l'écluse elle-même (acier, eau, béton) est le fond, pas un dégradé décoratif. Pas de cartes flottantes par-dessus.
2. **Éclairage plausible** : une source de lumière, des reflets cohérents sur l'acier, la caustique sur les parois — dessinés en SVG/CSS, pas en image.
3. **Couleur froide désaturée** comme base (le gris-bleu du chargeur), la couleur saturée réservée à un seul élément.
4. **Le chargement fait partie de la direction** : l'état « Filling the canal… » doit être dessiné avec le même soin (ligne d'eau qui monte).

## Limite

L'analyse d'Igloo est partielle (scène non chargée). Si Gaia veut qu'on s'appuie davantage sur ses rendus de matière, il faudra la rouvrir dans Chrome avec WebGL actif.

---

# V2 — 2026-11-18 · Refs de l'usine (`hackatons-pipeline/REFERENCES-DESIGN.md`)

> Demande de Gaia : repartir de zéro en s'appuyant sur les refs design de l'usine,
> côté **narration** et **3D / matière**. Les refs V1 (Framer, Igloo) sont remplacées.
> Ouvertes le 2026-11-18 dans le navigateur intégré.

| Ref (n° fiche) | Ouverte ? | Observé | Retenu pour Écluse |
|---|---|---|---|
| **Flow Computing** (#3) — flow-computing.com | oui, rendu complet | Un seul relief blanc, doux, éclairé par la gauche et ombré à droite ; titre noir puis gris ; un onglet noir vertical au bord droit, seule masse sombre | Direction **01 Relief** : l'écluse en argile blanche, lumière de gauche, longue ombre à droite ; règle en titre noir puis gris ; le chrono = l'onglet noir vertical |
| **Igloo** (#2) — igloo.inc | partiel : scène WebGL non chargée (écran de chargement gris-bleu seulement) | Fiche : 3D réaliste immersive comme décor principal | Directions **01** et **02** : le décor *est* l'écluse en 3D (three.js), pas une carte posée sur un fond |
| **Gapsy Studio** (#9) — gapsystudio.com | oui, rendu complet | Salle blanche réaliste, lettres rouges en relief fixées au mur, griffonnages main (bulle, flèche) par-dessus la 3D, sol bois | Direction **03 Maquette** : maquette d'écluse dans une salle blanche, « ÉCLUSE » en relief rouge au mur, la règle racontée par des notes à la main (« your ball », « tap = hold it 0.9 s ») |
| **Dominic Burt** (#4) | non rouverte (fiche seulement) | Fiche : grande linéale très serrée, long tiret comme motif, grain | 03 : nom en linéale serrée suivi d'un long tiret « ÉCLUSE— », grain léger sur le mur |
| **Noon** (#7) — noon.ai | oui, mais le site a changé : fond clair aujourd'hui, l'accent orange unique demeure | Fiche : sombre + un seul accent orange | Direction **02 Nuit** : nuit, une seule lumière chaude (sodium) = l'accent |
| **Raben Rifaie** (#8) — rabenrifaie.com | partiel : écran « Welcome », la 3D ne démarre pas dans le volet | Fiche : orange unique, scroll narratif + 3D | Principe de narration : une seule action raconte la scène (ici la bille qui descend) ; non dessiné tel quel |

## Principes transversaux appliqués (synthèse)
1. **Un seul accent** par direction : eau `#2e7d8f` (01), sodium `#f2a541` (02), rouge `#d7362b` (03), réservé à la porte tenue.
2. **Matière et lumière avant l'ornement** : vraie 3D (volumes biseautés, ombres portées, eau translucide, surface ondulante), pas de dégradés décoratifs.
3. **Le premier écran raconte sans menu** : la règle se lit sur la scène même (porte colorée + anneau/étiquette + flèche vers la bille).
4. **Narration** : 02 et 03 annotent la scène (« your ball », « tap = hold it ») ; les vignettes d'états racontent la boucle prêt → tenue → heurt → remplissage.

## Limites
Igloo et Raben Rifaie ne rendent pas leur WebGL dans le navigateur intégré ; Dominic Burt n'a pas été rouvert. À revoir dans Chrome si Gaia veut s'appuyer davantage dessus.
