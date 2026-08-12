# Simposio — site vitrine

## Objectif du site

Site vitrine B2B pour **Simposio**, marque événementielle premium d'**Eurheka
Conseil** (Alsace), sur le thème de la Dolce Vita italienne. Simposio conçoit
des événements d'entreprise clé en main (séminaires, lancements, soirées,
déjeuners d'affaires) inspirés de l'art de vivre italien, positionnés haut de
gamme pour des directions communication/RH, comités d'entreprise et grands
comptes régionaux.

Baseline : *« L'événement qui a le goût d'une expérience »*.

Le site est un **portfolio/vitrine de conversion**, pas une plateforme
transactionnelle : son but est de générer des demandes de devis via le
formulaire de contact (soumission par `mailto:`, pas de backend).

## Décisions techniques

- **Site statique multi-pages**, HTML/CSS/JS vanilla — aucun framework, aucun
  build step. Chaque page est un fichier `.html` autonome avec balisage
  dupliqué (header, menu mobile, footer) plutôt qu'un système de templates.
- **6 pages** : `index.html` (accueil), `univers.html`, `prestations.html`,
  `projets.html` (mosaïque galerie), `engagements.html` (+ équipe),
  `contact.html`. La page `realisations.html` (immersion 3D des
  stands-véhicules, Three.js) a été retirée à la demande de la cliente —
  voir « État d'avancement » ci-dessous.
- **CSS** : un seul fichier `assets/css/style.css`, design
  tokens en variables `:root` (couleurs, espacements, rayons, durées). Pas de
  préprocesseur.
- **JS** : `assets/js/main.js` (vanilla, IIFE unique, pas de dépendances) pour
  tous les comportements interactifs communs (reveal au scroll, parcours des
  5 sens, lignes d'engagement au survol, mosaïque pannable, formulaire de
  contact).
- **Photos** : mélange de photos **Simposio** (vrais événements, fichiers
  `assets/img/evenement-*.jpg`, aucun crédit requis), de photos sourcées sur
  Wikimedia Commons (licences CC BY/CC BY-SA, attribution requise) et de
  quelques photos **Pexels** (licence Pexels, aucune attribution requise).
  Les fichiers sans préfixe `evenement-` ne sont **pas** des photos Simposio
  réelles. **`assets/img/CREDITS.md` est la source de vérité** pour savoir
  quel fichier est utilisé où (y compris la mosaïque Projets, injectée par
  JS depuis `mosaicImagesBase` dans `main.js` — invisible à un `grep` sur le
  HTML seul) et pour l'historique des remplacements de photos ; vérifier
  ce fichier avant d'ajouter/retirer une photo plutôt que de dupliquer cette
  information ici.
  ⚠️ `evenement-vespa-fleurie-lemon.jpg` (actuellement inutilisée, disponible
  dans `assets/img/`) a une résolution source **limitée** fournie par la
  cliente (1200×1500 « vrais » pixels) — une session précédente l'avait
  agrandie artificiellement bien au-delà (×1,6), produisant un flou
  d'interpolation. Corrigé : réexport propre en un seul passage + léger
  `ImageFilter.UnsharpMask` (Pillow). **Ne pas réagrandir davantage** ce
  fichier si réutilisé : le plafond de netteté vient de la résolution
  native, pas d'un mauvais export.
  `positano-ceramiche-decor.jpg` (fond de La Cartolina) a son sujet
  (céramiques) bas et sur toute la largeur du cadre après recadrage — la
  classe CSS `.world-media-photo--pos-low` (`style.css`) biaise le crop
  vertical vers le bas pour ne pas le couper sur grand écran ; si cette
  photo est remplacée, vérifier si ce biais reste pertinent.
- **Polices** : Yeseva One (titres, self-hosted) et Glacial Indifference
  (corps de texte, self-hosted, SIL OFL) sont les polices de marque exactes.
  **Canter** (sous-titres) n'a pas pu être obtenue légalement pour un usage
  self-hosted dans cet environnement — remplacée par **Oswald** (self-hosted,
  formes géométriques proches) via la variable CSS `--font-subtitle`.
- **Palette** (fixe, définie dans le brief de marque) : Bleu Méditerranéen
  `#1c3b4a`, Terracotta Riviera `#c1622d`, Blanc Calcaire `#f6f1e7` (couleurs
  principales) ; Rouge Terre d'Ombrie `#4a1c1c`, Rouge Pourpre de Venise
  `#9d3636` (secondaires). Les fonds alternent exclusivement entre ces
  teintes section par section.
- **Pas de tracking, pas d'analytics, pas de cookies** — formulaire de lead
  soumis en construisant un lien `mailto:` pré-rempli (voir `buildMailto()`
  dans `main.js`), aucune donnée n'est envoyée à un serveur.

## Patterns JS notables (`assets/js/main.js`)

- `[data-reveal]` / `[data-reveal-group]` : reveal au scroll via
  IntersectionObserver (seuil 0.15, `rootMargin "0px 0px -60px 0px"`) — ajoute
  `.is-visible` une seule fois puis `unobserve()`, jamais de re-trigger au
  retour en arrière. Sert de socle à toutes les animations de reveal
  ci-dessous (il suffit d'ajouter une classe CSS en plus de `data-reveal`).
- Citation "Suspendre le quotidien..." (page Univers) : la coloration
  progressive des mots est synchronisée sur la position de l'élément
  lui-même par rapport au **milieu du viewport** (pas sur le scroll de toute
  la section) — voir `updatePromise()`.
- **5 sens — parcours au scroll** (page Univers, `#sensesJourney`) : un
  chemin SVG se dessine progressivement pendant le scroll dans une section
  pinned/sticky (`.senses-journey`, `height: 1240vh` desktop / `1000vh`
  mobile). Depuis 2026-08-12, ce chemin **épelle "SIMPOSIO"** (demande de la
  cliente) plutôt qu'une simple vague décorative : chaque lettre est un
  petit jeu de points dessiné à la main (`LETTER_SHAPES` dans `main.js`,
  une seule lettre = un seul trait, pas de crayon levé à l'intérieur) lissé
  par la même spline Catmull-Rom qu'avant (`catmullRomToBezierD()`) pour
  garder le rendu "tracé à la main". `layoutWord()` place les 8 lettres de
  gauche à droite (desktop, `journeyLayouts.desktop`, viewBox large
  2400×900) ; `layoutWordWrapped()` les répartit sur 2 rangées de 4 pour le
  mobile étroit (`journeyLayouts.mobile`). Entre les lettres, chaque nouvelle
  lettre est un nouveau sous-chemin (`M` sans relier au trait précédent) —
  crayon levé comme une vraie écriture, ça se voit à peine à l'animation et
  ça évite d'avoir à connecter des lettres très différentes en un seul
  trait illisible. **Piège déjà rencontré** : une première version faisait
  onduler la ligne de base de chaque lettre bien plus fort (une lettre en
  haut, la suivante en bas) — ça se lisait comme deux rangées de lettres
  éparpillées, pas comme un mot. Corrigé en aplatissant la ligne de base
  (`layoutWord(..., baselineYs)`, variations de ±25 à ±55 seulement) — si
  la ligne de base est retouchée, vérifier visuellement (voir méthode de
  vérification ci-dessous) que "SIMPOSIO" reste lisible d'un seul tenant.
  5 bornes/repères toujours nécessaires (5 sens) pour 8 lettres :
  `MARKER_LETTER_INDEXES = [0,2,4,5,7]` prend le 1er S, le M, le 1er O, le
  2ᵉ S et le 2ᵉ O (premier point de chacune, dernier point pour la toute
  dernière) plutôt qu'une lettre sur deux, pour garder un vrai début/fin de
  mot sur les 1er/5ᵉ repères. `fractionAtPoint()` échantillonne la courbe
  rendue (500 points) pour retrouver la vraie fraction de longueur d'arc de
  chaque repère (le mécanisme n'a pas changé, seul ce qui alimente
  `journeyLayouts.letters`/`.markers` a changé — avant, un simple tableau
  `.points` servait à la fois de tracé et de repères). Chaque carte ne
  devient visible que lorsque le scroll a **atteint** la fraction du point
  (`journeyDwellSpan`), jamais en cours de trajet — c'est le comportement
  demandé, ne pas le transformer en simple scroll-sync continu.
  `.senses-journey-head` doit rester en flux normal (`position: relative`,
  pas `absolute`) dans la colonne flex `.senses-journey-sticky`, sinon le
  chemin SVG peut chevaucher visuellement le titre (bug déjà rencontré et
  corrigé). **Pour vérifier visuellement le tracé** sans avoir à scroller
  1240vh : dans la console, forcer
  `document.getElementById('sensesJourneyPath').style.strokeDashoffset='0'`
  (trait complet) et `document.querySelector('.senses-journey-sticky').style.position='fixed'`
  (+ `top:0;left:0;width:100vw;zIndex:9999`) pour amener la section pinned
  à l'écran sans scroll réel, puis screenshot.
- **Engagements — lignes au survol** (`#engagementHoverCard`,
  `.engagement-line`) : liste de lignes ; au survol (ou tap sur mobile via
  `matchMedia("(hover: none)")`), une carte de description suit le curseur
  (`positionEngagementCard()`/`scheduleEngagementMove()`, throttlée par
  `requestAnimationFrame`). Il n'y a plus de flip-card (`[data-flip]`
  n'existe plus dans le code) — ne pas réintroduire ce pattern sans
  qu'on le redemande explicitement.
- **Balayage des titres et des formules** (`title-slide` / `formula-slide-left`
  / `formula-slide-right` dans `style.css`, purement CSS, piggyback sur
  `[data-reveal]`) : le tout premier `<h1>` de chaque page glisse depuis la
  droite (`title-slide`). Sur `prestations.html`, chaque `<article class="world">`
  glisse en entier (photo + texte, la photo étant positionnée en absolu à
  l'intérieur donc elle suit le bloc) en alternant gauche/droite, avec un
  effet de point net progressif (`filter: blur()` → 0). **Important** : la
  durée du flou (`filter` transition, ~0.55s) doit rester **découplée et
  nettement plus courte** que la durée du déplacement (`transform`
  transition, ~1.9s) — sinon la photo reste visuellement floue pendant
  qu'elle est encore en train de glisser, ce qui a été signalé comme un bug
  de qualité d'image alors que ce n'en était pas un.
- **Fonds photo des formules** (`.world-media`, `prestations.html`) : une
  seule `<img class="world-media-photo">` par formule, plein cadre
  (`object-fit: cover`), `object-position: right/left center` selon la
  formule (côté opposé au texte). Il y a eu un aller-retour sur ce point :
  une version précédente utilisait deux `<img>` superposées (fond flouté en
  `cover` + photo nette en `contain`, jamais rognée) pour éviter tout
  recadrage agressif des photos portrait sur très grand écran — la cliente a
  explicitement demandé de revenir au plein cadre à une seule image
  (2026-08-12), en gardant l'effet de balayage (`formula-slide-left/right`,
  inchangé, appliqué à l'article entier donc indépendant du nombre de
  couches media). Si des photos très verticales/portrait sont réutilisées
  ici, vérifier le rendu sur desktop très large avant publication : le
  recadrage `cover` peut à nouveau couper une partie de l'image.
- Mosaïque (page Projets) : CSS Grid avec `grid-auto-flow: dense` pour éviter
  tout trou d'affichage — ne jamais réintroduire de `transform: translateY`
  décoratif sur les items, ça casse l'alignement de la grille (bug corrigé).
- Formulaire de contact : validation + construction du `mailto:` dans
  `buildMailto()`/`validate()`. Les champs sont repérés par leur `id`/`name`
  (`fullName`, `company`, `email`, `phone`, `serviceType`, `guests`,
  `eventDate`, `message`) — à conserver si le formulaire est retouché.

## État d'avancement

Le cahier des charges a été appliqué intégralement :

✅ Fait : charte graphique (esprit Havas Events — en-têtes asymétriques,
formes décoratives, contraste gras/normal), hero accueil réduit à
bannière/baseline/CTA avec chiffres clés sur bande dédiée, page Univers (5
sens en parcours scroll-dessiné le long d'un chemin SVG, storytelling
resserré), page Prestations avec vraies photos d'événements Simposio et
balayage d'entrée sur les titres/formules, mosaïque Projets reconstruite en
grille pannable sans trou (glisser-déposer/clavier) affichant les photos
d'événements réelles, page Engagements sur fond bleu marine avec lignes
d'engagement au survol + emplacements photo pour l'équipe, page Contact
repensée (panneau bleu marine + carte formulaire), page Réalisations
(immersion 3D) **retirée du site** à la demande de la cliente — voir
ci-dessous.

🗑️ **Page Réalisations retirée** : la page `realisations.html` et tout ce qui
lui était propre ont été supprimés (Three.js self-hébergé dans
`assets/js/vendor/three/`, `assets/js/configurator.js`,
`assets/js/event-scene.js`, modèles `assets/models/*.glb`, CSS `.event-*` /
`.configurator-*` / `.spinner`). Tous les liens de nav/footer vers cette page
ont été retirés des 6 pages restantes.

## Limites connues / à traiter avec la cliente

- **Police Canter** non disponible → substituée par Oswald (cf. ci-dessus).
- **Mosaïque Projets & page Talents (Engagements)** : conçues pour
  correspondre à l'esprit du site double2.fr, mais sans accès réseau à
  double2.fr dans cet environnement pour un calage pixel-exact — à affiner
  si des captures d'écran de leurs pages sont fournies.
- **Photos d'équipe** (`engagements.html`) : deux emplacements prêts
  (placeholders avec dégradé + icône), en attente des vraies photos couleur
  et du nom/rôle/bio de la 2ᵉ personne (voir commentaires `TODO` dans le
  fichier).
- **Liens réseaux sociaux** (`#` dans le header) : placeholders `TODO` à
  remplacer, présents dans les 6 pages.
- **Grilles tarifaires** du document de marque : volontairement exclues du
  site public (info confidentielle, usage interne uniquement).
- **Résolution de `evenement-vespa-fleurie-lemon.jpg`** : n'est plus utilisée
  comme fond de formule depuis le 2026-08-12 (voir section Photos), mais si
  elle est réutilisée un jour, rappel : le fichier fourni par la cliente est
  nativement plus petit (1200×1500) que les autres photos — le rendu est net
  dans cette limite (réexport propre + accentuation, cf. section Photos
  ci-dessus), mais pour une netteté parfaite sur très grand écran il
  faudrait le fichier d'origine en plus haute résolution.

## Commandes utiles

```bash
# Servir le site en local
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/
```

Aucune commande de build, lint ou test — c'est un site statique pur.
