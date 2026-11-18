# PAGES — Écluse

> Statuts : à dessiner / en revue / validée. Liste **proposée**, à valider par Gaia.
> Chaque planche montre deux cadres côte à côte : desktop 1440 × 900 et mobile 390 × 844 (§6 du brief).
> Style retenu : **Relief** (V2.1, `STYLE.md`). Les 4 pages sont dessinées dans ce style et attendent la revue de Gaia (`planches/v2/dist/relief-0*.html`). Explorations V1 et V2 conservées.

| # | Page | Rôle | Contenu clé | Statut |
|---|------|------|-------------|--------|
| 1 | **Post** | Vue dans le feed (splash inline) : faire comprendre le jeu et donner envie d'ouvrir | En-tête du post, nom du jeu, date du jour, la ligne d'eau du canal du jour en aperçu, série du joueur, bouton « Open the lock » | **en revue** · `planches/v2/dist/relief-01-post.html` |
| 2 | **Jeu** | Écran principal, une seule règle en 5 s : « Tap a gate to hold it. Get the ball to the bottom. » | 5 portes qui balaient, la bille qui descend, porte tenue (0,9 s) avec sa jauge, chrono, série, essais, bouton de départ / relance | **en revue** · `planches/v2/dist/relief-02-jeu.html` (style choisi parmi `01-relief`, `02-nuit`, `03-maquette`) |
| 3 | **Carte de fin** | Résultat + boucle quotidienne + accroche commentaire | Temps, nombre d'essais, série, invitation à commenter son temps, prochain canal dans HH:MM | **en revue** · `planches/v2/dist/relief-03-fin.html` |
| 4 | **Séries & classement** | Montrer la communauté et la série | Série perso, meilleurs temps du jour (classement), position du joueur | **en revue** · `planches/v2/dist/relief-04-series.html` (classement en données de démo, cf. question 3) |

États à couvrir dans la déclinaison (pas des pages) : chargement (« Filling the canal… »), porte heurtée (« Gate jammed »), déjà joué aujourd'hui, erreur réseau.

## Questions produit ouvertes (non tranchées)

1. **Bille ou caisse ?** `IDEE.md` dit « one ball », le code actuel dit « crate » (« Release the crate »). Les planches dessinent une **bille** (IDEE fait foi). À confirmer.
2. **« Best time » vs essais** : `IDEE.md` parle de meilleur temps ; le code compte aussi les essais (`attempts`) et le chrono repart à zéro à chaque relance. Le temps affiché est-il celui du dernier essai réussi, ou cumulé depuis le premier lâcher ? Les planches montrent le temps de l'essai en cours + le compteur d'essais.
3. **Classement du jour** : `IDEE.md` cite « community scores » mais rien n'est stocké côté serveur aujourd'hui (seulement série et `solved`). La page 4 suppose un classement des meilleurs temps du jour. À confirmer avant de la dessiner.
4. **Rejouer après réussite** : peut-on améliorer son temps le même jour, ou une seule réussite compte ? (`solvedToday` existe mais n'est pas utilisé côté client.)
