# STYLE — Écluse · direction « Relief »

> Système retenu par Gaia le 2026-11-18 (V2.1, direction 01 Relief, contraste renforcé).
> Source de vérité pour toutes les planches. Non verrouillé tant que toutes les pages ne sont pas validées (`/lock`).
> Refs : Flow Computing (relief blanc éclairé à gauche, titre noir puis gris, une seule masse noire), Igloo (le décor 3D est l'interface).

## 1. Idée
L'écluse est **un seul relief blanc** posé au centre d'un puits de lumière. La lumière vient de la gauche et l'ombre part à droite. Tout le reste s'efface : texte petit et gris, **une seule masse noire** par écran (l'action ou le chrono), **une seule couleur** : l'eau.

## 2. Palette
| Rôle | Hex | Usage |
|---|---|---|
| Lumière (centre du fond) | `#f7f6f3` | puits de lumière derrière le module |
| Argile | `#e6e5e0` | fond intermédiaire, surfaces de carte |
| Pénombre | `#cdccc6` → `#bfbeb8` | bords du cadre (vignettage) |
| Paroi | `#f7f6f2` | parois 3D (mat, rugosité 0,92) |
| Acier | `#9c9b95` | plaques et rails (rugosité 0,55) |
| Encre | `#111214` | texte principal, bille, **la** masse noire (bouton / onglet) |
| Gris | `#6f6e69` | second niveau du titre, libellés, indications |
| Filet | `#d0cfca` | séparateurs, points de série éteints |
| **Eau (seul accent)** | `#2e7d8f` | porte tenue, pastille d'état, ton du joueur dans les listes |
| Eau 3D | `#6fb3bf` (opacité 0,32), surface `#bfe2e8` | volume d'eau translucide |

Règles : pas d'autre couleur saturée ; le blanc pur n'existe que sur le texte inversé ; jamais de dégradé décoratif (le seul dégradé est le puits de lumière).

## 3. Typographie
Linéale grotesque (planches : Nimbus Sans / Helvetica Neue / Liberation Sans ; production : une grotesque OFL embarquée, p. ex. Inter, à confirmer). Deux graisses : 400 et 500. Pas de gras 700+.

| Niveau | Desktop | Mobile | Graisse | Approche | Exemple |
|---|---|---|---|---|---|
| Titre | 40 px / 1.02 | 24–28 px | 500 | −0,045 em | « Hold the gate. *Let the ball fall.* » (2e phrase en gris) |
| Chiffre | 22–56 px | 20–40 px | 500 | −0,03 em | temps, série ; chiffres tabulaires |
| Corps | 15 px | 14 px | 400 | 0 | phrases d'accompagnement |
| Libellé | 11–13 px | 11 px | 400 | 0 | « Attempt », date, « Gate 3 » |

Le titre est toujours écrit en deux temps : **ce qu'on fait** en encre, **la conséquence** en gris.

## 4. Grille et cadre
- Cadre du post : desktop 760 px de large (jeu 760 × 600, aperçu feed 760 × 512) ; mobile 370 px (jeu 370 × 560).
- Marges intérieures : 28 px desktop, 22 px mobile. Le module 3D occupe le tiers central ; le texte vit dans les marges (colonne gauche ou bandeau bas), jamais par-dessus le module.
- Mobile : titre en haut, module au centre, chiffres en ligne en bas.

## 5. Composants
- **Masse noire** (un seul par écran) : onglet vertical collé au bord droit (chrono en jeu) ou pilule pleine (`Open the lock`, `Post your time`). Fond encre, texte blanc 15 px 500, rayon 8 px (onglet) / 999 px (pilule).
- **Pastille eau** : pilule `#2e7d8f`, texte blanc 12 px, pour l'état d'un objet 3D (« Held · 0.54 s »), ancrée à l'objet et qui le suit.
- **Lien secondaire** : texte encre souligné 1 px, pas de bouton contour.
- **Série** : 7 points de 6 px (encre = jour réussi, filet = jour manqué ou à venir).
- **Liste** (classement) : lignes de 44 px, filet 1 px `#d0cfca`, rang en gris, temps en chiffres tabulaires à droite ; la ligne du joueur est en eau.
- **Étiquettes de portes** : « Gate 1…5 » 11 px gris, alignées à droite du module, à la hauteur de chaque rail.

## 6. 3D (three.js)
- Une scène unique : parois biseautées, 5 rails doubles, 5 plaques, eau translucide à surface ondulante, bille noire brillante, sol qui ne montre que l'ombre.
- Lumières : ambiance 0,28 ; clé blanche à gauche 4,6 avec ombre PCF adoucie (rayon 16) ; contre-jour arrière droit 1,3.
- Caméra de face légèrement en surplomb (FOV 30) ; le module est centré, la longue ombre part vers la droite.
- Poids : un seul renderer par planche ; three.js inline (MIT), aucune requête réseau.

## 7. Mouvement
- Portes : balayage sinusoïdal continu (la règle du jeu) ; surface de l'eau qui ondule lentement.
- Porte tenue : elle s'arrête net et passe en eau ; l'anneau se vide en 0,9 s.
- Transitions d'interface : 160–240 ms, ease-out, pas de rebond ; rien ne clignote.
- `prefers-reduced-motion` : tout s'arrête sur une image fixe.

## 8. États
| État | Traitement |
|---|---|
| Prêt | bille posée au-dessus de l'eau, pilule noire « Drop the ball » |
| Porte tenue | plaque en eau + anneau + pastille « Held · 0.54 s » |
| Porte heurtée | bille posée sur la plaque, titre « Gate jammed. *Drop again.* », essai +1 |
| Écluse franchie | bille au fond, toutes les portes au repos, carte de fin |
| Déjà joué | aperçu du feed : ton temps à la place du bouton, « Next lock in HH:MM:SS » |
| Chargement | l'eau monte dans le relief, « Filling the canal… » |
| Erreur | même cadre, titre « The canal is dry. *Try again.* », lien « Reload » |
