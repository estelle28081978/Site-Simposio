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
  formes géométriques proches) via la variable CSS `--font-subtitle`. Le
  **logo "Simposio."** (`.logo`, header + footer) utilise **Yeseva One**
  comme le reste des titres — un essai avec une police calligraphique
  script (Alex Brush) a été fait puis explicitement annulé par la cliente
  (2026-08-12) ; ne pas la réintroduire sans qu'on le redemande.
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
  mobile). Chemin construit à partir de `journeyLayouts.desktop/mobile.points`
  (13 points desktop, 12 mobile) lissés par une spline Catmull-Rom
  (`catmullRomToBezierD()`) — une vague classique, pas une lettre ni un mot
  (un essai en 2026-08-12 faisait épeler "SIMPOSIO" en écriture manuscrite,
  explicitement annulé par la cliente le jour même : trop chargé, elle
  voulait un tracé simple). **Chaque courbure doit rester variée** (jamais
  une onde répétitive uniforme, ni toutes de la même taille) — demande
  explicite, vérifier visuellement après toute retouche des points. Le
  tracé part du coin haut-gauche du cadre et rejoint le coin bas-droit, en
  couvrant toute la largeur/hauteur du viewBox (`0 0 1900 780` desktop,
  `0 0 540 1500` mobile — **le viewBox desktop est volontairement large et
  court (~2,44 de ratio) pour matcher l'aspect réel du cadre grand écran**
  (`.senses-journey-frame`, jusqu'à 1600px de large pour 66vh de haut) ; un
  viewBox plus carré comme l'ancien 1650×1350 se retrouve "letterboxé" par
  `preserveAspectRatio="xMidYMid meet"` et le tracé finit coincé dans une
  colonne centrale au lieu de s'étirer d'un bord à l'autre — c'est le bug
  que la cliente a signalé ("ça occupe trop le milieu, pas assez étiré") et
  qui a motivé ce changement de ratio, en plus d'amplitudes de vague
  nettement plus grandes qu'avant). 5 bornes/repères nécessaires (5 sens) parmi les 13
  points : `markerIndexes` sélectionne 5 indices répartis sur tout le
  tracé (`journeyLayouts.*.markerIndexes`), le premier et le dernier point
  du tracé étant toujours parmi eux pour marquer clairement début et fin.
  `fractionAtPoint()` échantillonne la courbe rendue (500 points) pour
  retrouver la vraie fraction de longueur d'arc de chaque repère (les
  points ne sont pas espacés uniformément une fois les courbures ajoutées).
  Chaque carte ne devient visible que lorsque le scroll a **atteint** la
  fraction du point (`journeyDwellSpan`), jamais en cours de trajet — c'est
  le comportement demandé, ne pas le transformer en simple scroll-sync
  continu. `.senses-journey-head` doit rester en flux normal
  (`position: relative`, pas `absolute`) dans la colonne flex
  `.senses-journey-sticky`, sinon le chemin SVG peut chevaucher visuellement
  le titre (bug déjà rencontré et corrigé). **Piège Catmull-Rom déjà
  rencontré** : des points qui inversent la direction horizontale de façon
  trop marquée (grands allers-retours en x) font largement déborder la
  courbe et cassent l'échantillonnage de `fractionAtPoint()` (`bestDist`
  qui explose, fractions non croissantes) — garder des variations
  horizontales modérées, surtout sur le tracé mobile qui serpente déjà
  gauche/droite. Avant de commiter de nouveaux points, valider avec un
  script Node autonome (reproduire `catmullRomToBezierD`/`fractionAtPoint`
  et vérifier `bestDist` proche de 0 + fractions strictement croissantes)
  plutôt que de juger seulement au visuel. **Pour vérifier visuellement le
  tracé** sans avoir à scroller 1240vh : dans la console, forcer
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
- **`.page-header-full`** (modificateur optionnel de `.page-header`, utilisé
  sur `contact.html` et `univers.html`) : force le bandeau titre à occuper
  `100vh`/`100svh` avec contenu centré verticalement, pour que le titre
  remplisse tout l'écran avant que la section suivante (formulaire, parcours
  des 5 sens) n'apparaisse au scroll. `.page-header` seul (sans ce
  modificateur, sur les 4 autres pages) reste une bande compacte dimensionnée
  par son contenu — ne pas l'ajouter ailleurs sans que ce soit demandé.
  **Note de contexte (2026-08-12)** : une session locale (app Claude Code)
  avait en parallèle construit une version alternative de Contact tenant
  entièrement sur un seul écran sans scroll (`.page-header--compact` +
  `.contact-page { height:100dvh }`) — la cliente a tranché en faveur de la
  version plein-écran-puis-scroll ci-dessus. Si `.page-header--compact`
  réapparaît dans un diff, c'est cette ancienne piste non retenue.
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
- **Deux sessions Claude Code en parallèle (2026-08-12)** : la cliente a
  travaillé le même jour avec cette session (cloud) et une session locale
  (app Claude Code desktop) sur les mêmes fichiers sans coordination
  initiale, produisant deux versions différentes de Contact et des fonds de
  formule. Réconcilié à la main (voir décisions ci-dessus + branche git
  `sauvegarde-locale`, qui garde une trace de la version locale d'origine
  si besoin de comparer). Si ça se reproduit : vérifier `git status`/`git log`
  en tout début de session avant de supposer que le dépôt local reflète le
  dernier état poussé.

## Commandes utiles

```bash
# Servir le site en local
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/
```

Aucune commande de build, lint ou test — c'est un site statique pur.
