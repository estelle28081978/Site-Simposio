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
- **5 pages** : `index.html` (accueil), `prestations.html`,
  `projets.html` (mosaïque galerie), `engagements.html` (À propos + équipe
  + le mot de la fondatrice), `contact.html`. Deux pages ont été retirées à
  la demande de la cliente — voir « État d'avancement » ci-dessous :
  `realisations.html` (immersion 3D des stands-véhicules, Three.js) et,
  plus récemment, `univers.html` (2026-08-18, son contenu redistribué sur
  les pages restantes plutôt que supprimé — voir le même bloc).
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
  **Canter** (sous-titres, usage systématique) reste remplacée par **Oswald**
  (self-hosted, formes géométriques proches) via `--font-subtitle` — voir
  ci-dessous pour l'usage réel de Canter, désormais disponible. Le
  **logo "Simposio."** (`.logo`, header + footer) utilise **Yeseva One**
  comme le reste des titres — un essai avec une police calligraphique
  script (Alex Brush) a été fait puis explicitement annulé par la cliente
  (2026-08-12) ; ne pas la réintroduire sans qu'on le redemande.
  **Canter — police des eyebrows (2026-08-13)** : la cliente a fourni
  directement les fichiers `Canter_Light.otf`/`Canter_Bold.otf` (licence déjà
  détenue pour la charte graphique), convertis en woff2/woff et
  auto-hébergés dans `assets/fonts/canter/` (détails de conversion, licence
  et piège de nommage dans `assets/fonts/README.md`). **Deux itérations** sur
  où l'utiliser : essayée d'abord en touches ponctuelles éparpillées (un
  élément différent par page — citation, signature, tagline...), la cliente
  a explicitement demandé de tout retirer et de la réserver **uniquement**
  aux `.eyebrow` — la petite baseline avant un titre ("Notre promesse", "Nos
  prestations", "Questions fréquentes"...). C'est donc directement la police
  de `.eyebrow` (`font-family: var(--font-accent)`, `font-weight:700`), pas
  `--font-subtitle` (qui reste Oswald pour tout le reste : nav, form labels,
  footer, talent-role, founder-signature...). Si des classes `.font-accent`/
  `.font-accent-bold` ou des touches Canter isolées ailleurs que `.eyebrow`
  réapparaissent dans un diff, c'est l'ancienne approche à ne pas
  réintroduire sans qu'on le redemande. **Piège de nommage évité** :
  l'`@font-face` est enregistrée sous le nom **"Canter Accent"**, pas
  "Canter" — `--font-subtitle` listait déjà le littéral `"Canter"` en
  première position de son fallback stack depuis le début du projet (en
  attendant les fichiers), donc utiliser ce nom exact aurait fait basculer
  silencieusement TOUT le sous-titrage du site (nav, labels) d'Oswald vers
  Canter dès que la police se serait chargée — bug potentiel identifié et
  évité avant publication, pas rencontré en prod. **`.eyebrow` n'est plus en
  majuscules** (`text-transform: uppercase` retiré) : les bas-de-casse de
  Canter sont des petites capitales stylisées, les majuscules aplatissent
  cet effet — le texte HTML des eyebrows était déjà écrit en casse normale
  ("Notre promesse", pas "NOTRE PROMESSE"), seul le CSS les mettait en
  majuscules visuellement, donc ce retrait ne demandait aucun changement de
  contenu. **Taille doublée puis 2,5×** : après un premier doublement,
  la cliente a redemandé explicitement une taille « 2,5 fois plus grande »
  que l'originale (0,95rem) — `.eyebrow` utilise maintenant
  `font-size: clamp(1.3rem, 2.6vw + 0.75rem, 2.375rem)` (2,375rem = 0,95rem
  × 2,5 sur desktop), avec un `clamp()` pour éviter que le plus long eyebrow
  du site (`index.html`, bandeau hero : « Dolce Vita · Événementiel B2B
  premium en Alsace ») ne déborde ou ne passe sur deux lignes en mobile —
  vérifié à 390px de large, tient sur une seule ligne. `letter-spacing`
  réduit de `0.06em` à `0.03em` en même temps : à cette taille, l'ancien
  espacement (pensé pour un petit label façon Oswald) devenait visuellement
  trop aéré avec les formes propres de Canter. **Exception — menu mobile** :
  `.mobile-menu-info .eyebrow` (les libellés "Contact"/"Basée en" dans le
  panneau du menu mobile) reste explicitement sur l'ancien style Oswald
  (0,76rem, `letter-spacing: 0.34em`, majuscules) — retiré de Canter à la
  demande de la cliente, ces deux libellés ne doivent pas suivre la règle
  générale de `.eyebrow`. Règle scoping ajoutée après la règle de base pour
  gagner la cascade sans toucher `.eyebrow` ailleurs.
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
  la section) — voir `updatePromise()`. **Bloc `.promise-footnote` retiré
  (2026-08-13)** : les deux paragraphes qui suivaient la citation
  ("Des parenthèses hors du temps" / "Une œuvre globale, pas un
  empilement de prestataires") ont été supprimés à la demande explicite de
  la cliente, avec leur conteneur (`<div class="promise-inner">` +
  `<div class="promise-footnote" data-reveal-group>`, devenu vide) — la
  section `#positionnement` ne contient donc plus que `.promise-pin` (la
  citation). Si ces deux `<article>` réapparaissent dans un diff, ne pas
  les réintroduire sans qu'on le redemande.
- **Promesse + Fondatrice — refonte immersive (2026-08-17)**
  (`univers.html`, `#positionnement` et `.founder`) : la cliente a jugé
  l'enchaînement de la page Univers trop redondant textuellement — bandeau
  titre (texte) → citation "Suspendre le quotidien..." (texte) → 5 sens
  (déjà très visuel, **explicitement à ne pas toucher**) → citation de la
  fondatrice (texte) — pas assez "vivant", pas assez expérience client. Les
  deux sections texte ont été re-habillées visuellement pour créer de la
  variété (une grande scène cinématique plein écran vs. une petite note
  intime type carte postale), **sans toucher au mécanisme JS ni au contenu
  textuel d'aucune des deux** — seul l'habillage (fond photo, mise en
  page) change. Le parcours des 5 sens (`#sensesJourney`) n'a reçu aucune
  modification, conformément à la demande explicite de la cliente.
  **Promesse → scène cinématique plein écran** (`.promise`) : la citation
  ne repose plus sur un fond navy uni mais sur une photo plein cadre
  (`.promise-photo`, `amalfi-coast-sunset.jpg` — déjà présente dans
  `assets/img/` mais non utilisée ailleurs sur le site, cf. `CREDITS.md` ;
  choisie parce que la citation mentionne littéralement "les falaises
  d'Amalfi") avec un lent effet Ken Burns en boucle
  (`@keyframes promisePhotoDrift`, 22s, `scale`+`translate` légers,
  `alternate`, désactivé sous `prefers-reduced-motion`) et un dégradé
  sombre (`.promise-scrim`) pour garder le texte lisible. La section passe
  de `padding-block` fixe à `min-height:100vh` pour occuper tout l'écran
  comme les autres bandeaux plein écran du site
  (`.page-header-full`/`.senses-journey-sticky`). **Le mécanisme JS de
  coloration progressive des mots (`updatePromise()`, `main.js`) n'a
  strictement pas été modifié** — seule la palette de couleurs des mots a
  changé pour rester lisible sur une photo plutôt que sur un fond uni
  (crème/terracotta-300 au lieu des teintes précédentes), le calcul de
  progression et les classes `.word`/`.lit`/`.accent` sont identiques au
  pixel près. Structure DOM : `<img class="promise-photo">` +
  `<div class="promise-scrim">` ajoutés en premier dans `.promise`, avant
  `.container` — `.promise-pin`/`.promise-inner`/`.promise-quote` et tous
  leurs `<span class="word">` sont inchangés.
  **Fondatrice → carte postale tactile** (`.founder`) : remplace le simple
  bloc de texte centré sur fond navy uni par une carte crème légèrement
  inclinée (`.founder-card`, `transform:rotate(-1.1deg)`, bordure
  pointillée terracotta, ombre portée prononcée — esthétique "note
  manuscrite posée sur la table"), elle-même posée sur une photo
  d'ambiance floutée en fond (`.founder-photo`,
  `evenement-vespa-fleurie-lemon.jpg` — vraie photo Simposio, jusque-là
  inutilisée sur le site ; utilisée floutée/petite donc sa résolution
  source limitée déjà documentée plus haut n'est pas un problème ici) +
  scrim sombre (`.founder-scrim`). **Règle "pas de photo fabriquée
  d'Estelle" explicitement respectée** : la photo de fond est une ambiance
  Vespa/citronnier (déjà utilisée comme telle ailleurs dans le projet),
  jamais un portrait — aucune photo de la fondatrice n'existe à ce jour
  (cf. « Limites connues »), donc aucune n'est utilisée ni suggérée ici.
  Un médaillon `.founder-avatar` ("EL", dégradé terracotta→rouge Venise,
  légèrement pivoté) est ajouté au-dessus de l'eyebrow "La fondatrice" —
  reprend le même motif d'initiales déjà utilisé pour le formulaire de
  contact (`.contact-founder-avatar`, `contact.html`), pour une cohérence
  de repère visuel entre les deux pages plutôt que d'inventer un nouveau
  système d'avatar. La signature passe d'une seule ligne à deux
  (`.founder-signature`, nom en majuscules + sous-ligne "Fondatrice de
  Simposio, une initiative Eurheka Conseil" en casse normale plus petite)
  pour rappeler le rattachement à Eurheka Conseil directement dans la
  section, comme le fait déjà le footer. Le conteneur passe de `<div
  class="founder">` à `<section class="founder">` (sémantique, aucun
  changement fonctionnel) et `.founder-inner` est renommé
  `.founder-card` (nouvelle classe, l'ancienne `.founder-inner` n'est plus
  utilisée nulle part).
  **Crédits photo** : `amalfi-coast-sunset.jpg` (Tracey Hind, Wikimedia
  Commons, CC BY-SA) ajoutée au bloc `.photo-credits` du footer
  d'`univers.html`, à côté du crédit Andrew Parlette déjà présent
  (aucun crédit supplémentaire requis pour `evenement-vespa-fleurie-lemon.jpg`,
  photo Simposio réelle) — `assets/img/CREDITS.md` mis à jour en
  conséquence pour les deux fichiers (colonne "Utilisée sur"). Vérifié par
  regression Playwright complète (6 pages × 2 viewports, la modification
  touchant `style.css` partagé) : 0 débordement, 0 erreur console, sur
  tout le site, pas seulement `univers.html`.
- **Promesse — 2ᵉ refonte, diptyque éditorial façon presse (2026-08-17)**
  (`.promise`, `univers.html`) : la cliente n'a pas aimé la scène
  cinématique plein écran de la refonte précédente (bullet ci-dessus) et a
  explicitement demandé "quelque chose de plus originale", en citant
  Louis Vuitton comme référence. **Accès réseau à louisvuitton.com bloqué
  dans cet environnement** (`EGRESS_BLOCKED`, même limitation déjà
  rencontrée pour les banques d'images Pexels/Unsplash lors de la
  recherche de photos pour les Valeurs) — impossible de calquer leur site
  pixel pour pixel. Dit explicitement à la cliente et reconstitué à partir
  des codes connus de l'éditorial de luxe (guillemet géant décoratif,
  diptyque asymétrique image étroite/texte ample, typographie serif à
  grande échelle, parallaxe discrète) plutôt que d'un relevé visuel direct.
  **Remplace entièrement** le plein-cadre + `.promise-scrim` de la
  refonte précédente : si `.promise-photo` en position `inset:0` plein
  cadre avec `.promise-scrim` réapparaissent ici, c'est cette ancienne
  version (scène cinématique), à ne pas réintroduire sans qu'on le
  redemande.
  **Structure** : `.promise-editorial` (grid deux colonnes à partir de
  900px, `0.8fr 1.2fr`, empilé en dessous) — à gauche `.promise-visual`,
  une photo portrait étroite (`.promise-visual-frame`,
  `aspect-ratio:3/4`, `max-width:26rem`, coins arrondis, ombre portée
  prononcée, toujours `amalfi-coast-sunset.jpg`, même photo que la refonte
  précédente donc aucun nouveau crédit à ajouter) ; à droite
  `.promise-content` avec, dans l'ordre, un guillemet ouvrant «
  surdimensionné en décoration (`.promise-mark`, `clamp(5.5rem,…,11rem)`,
  Yeseva One, terracotta à faible opacité, tiré vers le haut par une
  `margin-bottom` négative pour chevaucher légèrement l'eyebrow qui suit —
  esthétique "pull quote" de presse), un nouvel eyebrow "Notre promesse"
  (cohérent avec le reste du site, qui a un eyebrow sur quasiment chaque
  section — celle-ci n'en avait jamais eu), puis la citation. Alignement à
  gauche sur desktop, centré sous 900px (où le guillemet et l'eyebrow se
  centrent aussi, `text-align` étant hérité).
  **Le mécanisme JS de coloration progressive des mots
  (`updatePromise()`, `main.js`) garde exactement le même calcul de
  progression** (`rect`/`quoteCenter`/`startY`/`endY`/`reveal` inchangés)
  — seule la fonction a été étendue pour piloter EN PLUS une parallaxe
  verticale légère de la photo (`promisePhoto.style.transform =
  translateY((reveal-0.5)*40px)`), en réutilisant directement la même
  variable `reveal` que le surlignage des mots plutôt que de calculer un
  second timing indépendant — la photo dérive donc en cohérence avec
  l'éclairage du texte (légèrement décalée vers le haut à l'entrée,
  recentrée une fois la citation entièrement lue), pas sur sa propre
  boucle d'animation. `.promise-photo` est dimensionnée à `height:116%`
  avec `top:-8%` pour avoir de la marge de déplacement sans jamais laisser
  de bord vide visible pendant la translation. **L'ancienne animation
  Ken Burns en boucle (`@keyframes promisePhotoDrift`) est retirée** — la
  photo ne bouge plus qu'en fonction du scroll réel, plus d'autoplay
  indépendant ; par conséquent plus besoin non plus de règle
  `prefers-reduced-motion` dédiée sur `.promise-photo` (comme pour le
  reveal des mots dont il dépend, la parallaxe est simplement absente
  quand `reducedMotion` est vrai, cf. le même bloc `if` dans
  `main.js`) — cohérent avec la convention déjà établie ailleurs sur le
  site (mapping direct 1:1 au scroll, pas une animation autoplay).
  Vérifié par capture Playwright aux trois états (entrée non éclairée,
  partiellement éclairée, entièrement éclairée) desktop et mobile, puis
  regression complète 6 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Promesse — 3ᵉ refonte, photo plein cadre + typographie "poster" décalée
  (2026-08-17)** (`.promise`, `univers.html`) : ni la scène cinématique (1re
  refonte) ni le diptyque façon Louis Vuitton (2e refonte, bullet
  ci-dessus) n'ont convaincu la cliente. Elle a cette fois fourni sa propre
  maquette Canva (texte en très grande typographie, plusieurs lignes
  décalées horizontalement les unes par rapport aux autres avec des
  espacements irréguliers entre elles) accompagnée d'une capture d'un site
  de référence (wantedfornothing.com — mise en page "poster" à l'anglaise,
  lignes énormes alternant les marges gauche/droite) comme repère
  supplémentaire de style. Contrairement à la 2e refonte, cette fois
  l'inspiration était directement fournie en image par la cliente (pas de
  blocage réseau à contourner), donc calage direct sur sa maquette plutôt
  que sur des codes reconstitués de mémoire. **Remplace entièrement** le
  diptyque de la 2e refonte : si `.promise-editorial` /
  `.promise-visual-frame` / `.promise-mark` réapparaissent ici, ne pas les
  réintroduire sans qu'on le redemande.
  **Citation raccourcie** (demande explicite) : ne reste que « Suspendre le
  quotidien professionnel pour transporter vos invités au cœur de
  l'Italie, iconique et intemporelle. » — la fin (« — entre la Riviera de
  Portofino, les falaises d'Amalfi et la douceur des collines toscanes. »)
  est retirée.
  **Structure** : la photo plein cadre + Ken Burns (`.promise-photo`,
  `@keyframes promisePhotoDrift`) redevient celle de la 1re refonte
  (`amalfi-coast-sunset.jpg`, inchangée) mais **le voile est allégé** —
  `.promise-scrim` passe d'un dégradé sombre (jusqu'à 88% d'opacité en bas)
  à un voile beaucoup plus léger (28–50%), pour que la photo reste
  explicitement "bien visible" comme demandé ; la lisibilité du texte est
  assurée à la place par un `text-shadow` marqué (double ombre portée) sur
  `.promise-quote`. La citation est découpée en 3 `<span class="promise-line">`
  bloc (`display:block`), chacune avec son propre `margin-left` (0 / jusqu'à
  `3.5rem` / jusqu'à `1.75rem`, en `clamp()` pour rester proportionnel à la
  largeur d'écran) et son propre `margin-top` (0.65em / 0.9em) — c'est ce
  décalage horizontal + ces espacements irréguliers ligne par ligne qui
  reproduit l'effet "poster" de la maquette, pas un simple retour à la
  ligne automatique. `text-transform:uppercase` en CSS uniquement (le HTML
  garde la casse normale, accessibilité/lecteurs d'écran inchangés) pour
  l'aspect impactant des références visuelles, tout en gardant la police de
  marque (`--font-display`, Yeseva One — demande explicite de la cliente de
  garder "nos polices", la maquette Canva servait uniquement de référence
  de mise en page). La phrase "l'Italie, iconique et intemporelle" garde
  son accent terracotta (`.accent`, classe générique déjà utilisée ailleurs
  sur le site pour l'emphase, ex. hero) plutôt qu'un système dédié.
  **Tient sur un seul écran d'ordinateur** (contrainte explicite) :
  `.promise` garde `min-height:100vh; display:flex; align-items:center`
  (hérité de la 1re refonte) et la taille de police
  (`clamp(1.9rem,…,3.5rem)`) a été calibrée pour que le bloc de 3 lignes
  tienne confortablement dans cette hauteur sans forcer la section à
  dépasser 100vh — vérifié par script Playwright mesurant la hauteur réelle
  de `#positionnement` à 1440×900 (ordinateur portable courant) et
  1600×900 : hauteur de section strictement égale à la hauteur de
  viewport dans les deux cas, aucun dépassement.
  **Mécanisme de coloration mot par mot au scroll entièrement retiré** :
  la cliente voulait que les lignes "apparaissent toutes en même temps"
  avec un effet d'animation, pas un éclairage progressif — `updatePromise()`
  et son écouteur de scroll dédié sont supprimés de `main.js` (plus aucun
  `<span class="word">`, plus de `#promisePhoto` pour la parallaxe de la 2e
  refonte non plus). Remplacé par le système de reveal générique déjà
  utilisé partout ailleurs sur le site (`[data-reveal]`,
  IntersectionObserver + fondu/`translateY(28px)→0`, seuil 0.15) posé
  directement sur `.promise-quote` : les 3 lignes étant un seul bloc DOM,
  elles entrent ensemble en un seul mouvement dès que la section est
  visible à 15% — satisfait directement "tous en même temps" sans avoir à
  synchroniser plusieurs éléments séparés. Vérifié par script Playwright :
  opacité 0 avant scroll, `.is-visible` + opacité ~1 après. Si un
  mécanisme de coloration progressive ou un `#promisePhoto` réapparaissent
  ici, c'est une ancienne version (1re ou 2e refonte), à ne pas
  réintroduire sans qu'on le redemande.
  Vérifié par regression Playwright complète (6 pages × 2 viewports,
  modification touchant `style.css`/`main.js` partagés) : 0 débordement,
  0 erreur console.
- **Promesse — 4ᵉ itération, typographie massivement agrandie (2026-08-17)**
  (`.promise-line`, `univers.html`) : la cliente a rejugé le rendu de la
  3e refonte "pas du tout bon" et a renvoyé la même capture d'inspiration
  (wantedfornothing.com) une seconde fois, en précisant cette fois
  explicitement le problème : la taille de police devait être "beaucoup
  plus grosse", pour "utiliser beaucoup plus d'espace sur l'écran" — un
  problème d'échelle, pas de structure (le principe de lignes décalées de
  la 3e refonte restait bon).
  **Piège découvert pendant le calibrage** : la première tentative
  dimensionnait `.promise-line` en unités `vw` (comme le reste du site,
  ex. les tailles de la mosaïque ou des titres), mais la contrainte réelle
  ici est la **hauteur** disponible ("tenir sur un seul écran d'ordi"), pas
  la largeur — résultat, un écran 1600×900 (plus large mais pas plus haut
  qu'un 1440×900) affichait un texte plus gros ET une section qui dépassait
  la hauteur de viewport, alors qu'un 1440×900 restait correct. **Corrigé
  en indexant `font-size` sur `vh` plutôt que `vw`**
  (`clamp(2rem, 9vh, 5.4rem)`) : la taille suit désormais la hauteur
  réellement disponible, identique à hauteur de fenêtre égale quelle que
  soit la largeur — cohérent avec la contrainte réelle de la cliente.
  **Découpage réextrait en 8 lignes courtes** (au lieu de 3 dans la 3e
  refonte) : à cette échelle très agrandie, les groupes plus longs comme
  "professionnel pour transporter vos invités" ne tenaient plus sur une
  seule ligne à 1440px de large et retombaient sur 2 lignes, cassant
  l'effet poster et faisant déborder la hauteur — séparés en unités plus
  courtes (« Suspendre le » / « quotidien » / « professionnel » / « pour
  transporter » / « vos invités » / « au cœur de » / « l'Italie, iconique »
  / « et intemporelle », ces deux dernières en accent terracotta comme
  avant) pour garantir une seule ligne rendue par groupe à toutes les
  largeurs testées. Chaque ligne garde un `margin-left` propre
  (0 pour les groupes longs, jusqu'à `clamp(0, 12vw, 7.5rem)` pour les plus
  courts) pour conserver l'effet de décalage horizontal irrégulier.
  **`.promise .container` élargi** (`max-width:100rem`, padding réduit à
  `clamp(1rem, 2.5vw, 2rem)`) pour laisser le texte utiliser presque toute
  la largeur de l'écran, au lieu du `max-width:58rem` de la 3e refonte qui
  gardait une colonne étroite — cohérent avec la demande "utilise beaucoup
  plus d'espace sur l'écran" (plus seulement une question de taille de
  police, la largeur de la zone de texte a aussi été élargie).
  **`.promise` : `padding-block` remplacé** par une valeur `clamp(1.25rem,
  4vh, 3.5rem)` au lieu de la constante sitewide `var(--space-6)` (7rem) :
  à ce niveau de remplissage vertical, un padding fixe de 7rem haut+bas
  suffisait à lui seul à faire dépasser la section de ~27px à 900px de
  haut — retenue : sur une section calée en `vh`/`min-height:100vh` pour
  "tenir sur un seul écran", tout padding fixe non lié au viewport rogne
  directement sur ce budget et doit lui aussi être exprimé en unités
  relatives à la hauteur, pas seulement la typographie.
  **Calibrage validé par script Playwright** mesurant, à 1440×900,
  1600×900, 1920×1080 et 390×844 : le nombre de lignes réellement rendu
  par groupe (technique `Range.selectNodeContents()` + `getClientRects()`,
  déjà établie ailleurs sur le site pour ce type de mesure) et la hauteur
  réelle de `#positionnement` comparée à la hauteur de viewport — résultat
  final : 1 seule ligne rendue par groupe et hauteur de section strictement
  égale à la hauteur de viewport aux trois largeurs desktop testées, aucun
  débordement horizontal nulle part. Regression complète 6 pages ×
  2 viewports revérifiée après coup : 0 débordement, 0 erreur console.
- **Promesse — 5ᵉ itération, "prompt de correction" avec spec CSS exacte
  puis découpage figé à 6 lignes (2026-08-17)** (`.promise*`,
  `univers.html`) : la cliente a jugé la 4e itération encore insuffisante
  et fourni un prompt de correction technique très précis (probablement
  généré par un outil d'analyse de design externe) donnant des valeurs CSS
  exactes, puis — dans le même échange — un second prompt figeant le
  découpage du texte à exactement 6 lignes avec un contenu et des
  `margin-left` donnés mot pour mot. **Le second prompt prime sur le
  premier** pour tout ce qu'il précise explicitement (nombre de lignes,
  texte par ligne, décalages) ; ce qui suit décrit l'état final réellement
  livré, pas l'étape intermédiaire à 9 lignes (jamais commitée).
  **Changements structurels retenus des deux prompts** :
  - `line-height: 0.85` — lignes très resserrées, quasiment superposées,
    demandé explicitement dans les deux prompts.
  - Alignement asymétrique par ligne via `margin-left` (plus de centrage) :
    1re ligne à gauche, lignes suivantes décalées à des pourcentages
    différents, dernière ligne alignée tout à droite
    (`width:fit-content; margin-left:auto`).
  - Couleur unifiée `#f5f5f5` (au lieu du duo crème/terracotta des
    itérations précédentes) — **écart assumé et documenté par rapport à la
    palette de marque fixe** (Bleu Méditerranéen/Terracotta/Blanc Calcaire,
    cf. section Décisions techniques) : la cliente a donné un hex précis
    hors palette, suivi tel quel plutôt que substitué silencieusement par
    `--cream`. Si la couleur du texte doit repasser dans la palette de
    marque, le redemander explicitement.
  - `filter: brightness(0.5)` sur `.promise-photo` **en plus** de
    `.promise-scrim` repassé en overlay noir uni `rgba(0,0,0,0.4)` (au
    lieu du dégradé bleu marine plus léger des itérations précédentes).
  - `.promise` : `height:100vh; overflow:hidden; display:flex;
    flex-direction:column; justify-content:center` — remplace
    `min-height:100vh; align-items:center` (qui laissait la section
    grandir si le contenu dépassait) par une hauteur strictement fixe qui
    **rogne** tout dépassement au lieu de pousser la section plus haute
    que l'écran ; `.promise-pin` (wrapper de centrage devenu redondant) et
    `data-scroll-highlight` sont retirés du HTML.
  **`font-size` explicitement réduit par rapport aux deux valeurs demandées
  dans les prompts** (`clamp(3rem,7vw,9rem)` puis `clamp(3.5rem,8vw,10rem)`)
  — **la seule valeur de cette itération où le chiffre exact du prompt
  n'a pas pu être suivi tel quel**, et documenté ici pour cette raison.
  Cause : le second prompt fige un texte français par ligne (ex. "POUR
  TRANSPORTER VOS INVITÉS", "SUSPENDRE LE QUOTIDIEN") bien plus long que
  les mots-clés anglais de la référence visuelle (wantedfornothing.com,
  "WITH" / "CHANGE COMES" / "OPPORTUNITY") — au `clamp()` demandé, ces
  groupes ne tenaient plus sur une seule ligne rendue (repérés jusqu'à 3
  lignes repliées pour "pour transporter vos invités" sur certaines
  largeurs) et, combiné à `overflow:hidden`, la 1re ligne se retrouvait
  rognée en haut (`top:-68px` observé à 1920×1080). Réduit empiriquement
  par script Playwright (balayage de plusieurs valeurs de `clamp()`,
  mesure du nombre de lignes réellement rendu par groupe via
  `Range.selectNodeContents()`/`getClientRects()`) jusqu'à
  `clamp(2.6rem, 4.2vw, 5.6rem)` — la plus grande taille qui garde les 6
  lignes de la cliente sur une seule ligne rendue chacune, sans
  débordement, aux 3 largeurs desktop testées (1440×900, 1600×900,
  1920×1080). Si la cliente redemande une taille encore plus grande,
  prévenir explicitement que le texte français plus long que la référence
  anglaise est la contrainte réelle — la solution passerait par accepter
  des lignes reformulées plus courtes (comme le découpage à 9 lignes de
  l'itération précédente), pas par une valeur de `clamp()` plus grande
  avec ce texte-ci.
  **`padding-top:6.5rem` conservé sur `.promise`** (même constante que
  `.page-header` utilise déjà pour se dégager du header fixe ailleurs sur
  le site) — nécessaire pour la même raison que documentée lors du
  calibrage à 9 lignes : avec `justify-content:center` sur une boîte
  `height:100vh`, un bloc de texte proche de la hauteur du viewport se
  centre en laissant peu de marge en haut, risquant de faire passer la
  1re ligne derrière le bandeau translucide du header.
  **Découpage final, texte et décalages donnés explicitement par la
  cliente, appliqués mot pour mot** : « Suspendre le quotidien »
  (`margin-left:0`) / « Professionnel » (`25%`) / « Pour transporter vos
  invités » (`5%`) / « Au cœur de l'Italie, » (`15%`) / « Iconique »
  (`0`) / « Et intemporelle » (dernière ligne, `width:fit-content;
  margin-left:auto`, alignée tout à droite). Sous 640px, tous les
  décalages sont retirés (`margin-left:0` partout) et la taille repasse à
  `clamp(1.9rem, 9vw, 3rem)` pour rester lisible sur mobile — contrainte
  "un seul écran d'ordinateur" jamais appliquée au mobile, cohérent avec
  les itérations précédentes ; sur mobile certaines lignes se replient
  naturellement sur 2-3 lignes, accepté (hors scope de la contrainte).
  Vérifié par script Playwright aux 4 largeurs habituelles (1440×900,
  1600×900, 1920×1080, 390×844), avec mesure explicite du nombre de
  lignes rendu par groupe et de la position haut/bas de chaque ligne par
  rapport au viewport : 1 seule ligne rendue par groupe et aucun
  débordement haut/bas aux 3 largeurs desktop, animation d'apparition
  (`[data-reveal]`) revérifiée fonctionnelle. Regression complète 6 pages
  × 2 viewports : 0 débordement, 0 erreur console. Si un découpage à 9
  lignes ou un `clamp()` allant jusqu'à `9rem`/`10rem` réapparaissent
  ici, c'est l'itération intermédiaire (jamais livrée), à ne pas
  réintroduire sans qu'on le redemande.
- **Promesse — 6ᵉ itération, remplissage dynamique par ligne en JS
  (2026-08-17)** (`fitPromiseLines()`, `assets/js/main.js`) : la cliente a
  redemandé d'agrandir encore, cette fois explicitement "à fond" et pour
  que chaque ligne "occupe toute la largeur sauf le décalage demandé" —
  un seul `clamp()` CSS partagé par toutes les lignes (comme les 5
  itérations précédentes) ne peut pas satisfaire ça : un mot court comme
  "Iconique" et une ligne de 4 mots comme "Pour transporter vos invités"
  ont des largeurs naturelles très différentes à une même taille de
  police, donc une taille commune est nécessairement un compromis qui ne
  fait "remplir toute la largeur" pour aucune des deux. Remplace le
  `font-size` fixe en `clamp()` par un calcul JS **par ligne** : chaque
  `.promise-line` reçoit sa propre taille, calculée pour que son texte
  remplisse tout juste sa largeur disponible (largeur du conteneur moins
  son `margin-left`), donc "Iconique" devient énorme (remplit toute la
  largeur à elle seule) tandis que la ligne à 4 mots reste plus modeste en
  taille de police tout en remplissant, elle aussi, sa propre largeur — le
  `clamp()` CSS reste en place comme **filet de sécurité no-JS/avant-JS**
  (le JS écrase juste `style.fontSize` en ligne, cascade CSS normale).
  **Ligne 6 traitée à part** : elle utilise `width:fit-content;
  margin-left:auto` (alignement à droite) plutôt qu'un `margin-left`
  numérique — si elle est dimensionnée pour remplir 100% de la largeur,
  il ne reste plus d'espace pour que la marge automatique la pousse vers
  la droite, et son "décalage" (tout l'intérêt de cette ligne) devient
  invisible. Elle reçoit donc le même budget de largeur que la ligne 2
  (75% de la largeur du conteneur, soit une marge conceptuelle de 25%)
  pour que le décalage à droite reste lisible, cohérent avec la demande
  "sauf le décalage demandé" — cette ligne-là n'est pas censée remplir
  100%, son décalage EST la consigne à respecter.
  **Trois bugs réels rencontrés et corrigés, aucun supposé sans script de
  diagnostic dédié** :
  1. *Course avec le chargement de la police* — au premier chargement de
     page, `fitPromiseLines()` mesurait le texte avant que Yeseva One
     (police self-hébergée) soit prête, avec la police de repli du
     navigateur à la place — repéré via `document.fonts.status` valant
     `"loading"` au moment de la mesure (script de diagnostic dédié, pas
     supposé). Les tailles calculées ne correspondaient donc plus une
     fois Yeseva One chargée. Corrigé en relançant `fitPromiseLines()`
     dans `document.fonts.ready.then(...)`, en plus de l'appel initial et
     du écouteur de resize.
  2. *Bug de mesure de largeur bien plus sérieux, causant des retours à la
     ligne systématiques* — `measureTextWidth()` utilisait
     `Range.selectNodeContents(el)` + `getBoundingClientRect()` (la même
     technique que celle déjà établie ailleurs sur le site pour compter
     des lignes). Problème : à la taille de référence utilisée pour la
     mesure, le texte peut déjà être replié sur plusieurs lignes DANS SA
     BOÎTE NORMALE (rétrécie par son `margin-left`) — et pour un `Range`
     qui couvre plusieurs fragments repliés, `getBoundingClientRect()`
     renvoie l'enveloppe du fragment le plus large, pas la largeur réelle
     du texte non replié. Résultat : la largeur "naturelle" mesurée était
     systématiquement sous-estimée (parfois de plus de 30%), donnant des
     tailles "idéales" bien trop grandes, qui repliaient le texte une fois
     appliquées. Repéré en comparant cette mesure à une mesure de
     contrôle forçant `white-space:nowrap` sur l'élément réel (pas un
     clone hors contexte — un premier essai de diagnostic avec un clone
     ajouté à `document.body` donnait lui aussi un résultat faux, la
     police/les transformations CSS n'étant plus héritées du parent
     `.promise-quote` hors de son arbre d'origine). Corrigé en forçant
     temporairement `white-space:nowrap; display:inline-block;
     width:auto` sur l'élément réel pendant la mesure (puis restauration
     immédiate) — mesure fiable quel que soit l'état de repli avant coup.
     Si `Range.selectNodeContents` réapparaît pour mesurer une largeur de
     texte (par opposition à compter des lignes, où la technique reste
     valide), revérifier ce piège en premier.
  3. *Marge de sécurité anti-arrondi* : même après la correction du point
     2, viser exactement 100% de la largeur disponible pouvait faire
     replier le dernier mot d'une ligne d'un pixel (le texte ne s'étire
     pas parfaitement linéairement avec la taille de police — crénage,
     hinting). Une marge de sécurité de 3% (`available *= 0.97`) est
     appliquée à toutes les lignes avant le calcul de la taille idéale.
  **Toujours contraint à un seul écran** : la hauteur totale du bloc
  (calculée à partir des tailles idéales par ligne) est comparée au
  budget vertical disponible (hauteur de viewport moins la hauteur du
  header, mesurée en direct via `getBoundingClientRect()` plutôt
  qu'une constante en dur) ; si elle dépasse, un facteur d'échelle
  unique est appliqué à toutes les lignes pour conserver leurs
  proportions relatives (le mot court reste proportionnellement plus
  grand que la ligne à 4 mots) tout en revenant sous la limite. **Effet
  desktop/tablette uniquement** (`window.innerWidth > 640`) : sous ce
  seuil, l'effet est désactivé (`style.fontSize` réinitialisé à vide,
  laissant le `clamp()` CSS mobile `1.9rem`–`3rem` prendre le relais) —
  remplir toute la largeur ligne par ligne sur un téléphone étroit
  ferait exploser la taille des mots courts bien au-delà du lisible.
  Vérifié par script Playwright : 1 seule ligne rendue par groupe et 0
  débordement haut/bas aux 3 largeurs desktop (1440×900, 1600×900,
  1920×1080), cycle de resize desktop→mobile→desktop revérifié sans
  erreur console ni débordement, animation d'apparition (`[data-reveal]`)
  toujours fonctionnelle. Regression complète 6 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Promesse — 7ᵉ itération, taille unique partagée + nouveau découpage
  (2026-08-17)** (`fitPromiseLines()`, `univers.html`) : la cliente a
  demandé de repasser à une taille de police **unique pour toutes les
  lignes** (plutôt que chaque ligne remplissant sa propre largeur comme
  dans la 6e itération), calée sur la taille qu'affichait alors le mot
  "professionnel" seul sur sa ligne — tout en gardant l'effet de décalage
  gauche/droite — et a fourni un nouveau découpage en 6 lignes : « Suspendre
  le » / « quotidien professionnel » / « Pour transporter vos » /
  « invités au cœur de » / « l'Italie, iconique » / « et intemporelle »
  (mot pour mot identique à la citation, la virgule après "l'Italie" est
  conservée bien que non retapée dans le message — cohérent avec le reste
  du texte source).
  **`fitPromiseLines()` change de logique** : au lieu de calculer une
  taille idéale **par ligne** (6e itération, chaque ligne remplit sa
  propre largeur, tailles très différentes d'une ligne à l'autre), la
  fonction calcule maintenant la taille idéale de chaque ligne comme avant
  (texte × marge propre à la ligne) puis prend le **minimum** de ces 6
  valeurs et l'applique identiquement à toutes les lignes
  (`Math.min.apply(null, idealSizes)`). C'est la traduction directe de "la
  même taille que professionnel" : au lieu de viser une valeur en pixels
  fixe (qui n'aurait plus eu de sens avec un texte différent, "professionnel"
  n'étant plus seul sur sa ligne), la taille partagée reste dynamique/
  responsive et se cale naturellement sur la ligne la plus contrainte —
  ici "quotidien professionnel" (23 caractères, la plus longue), à qui la
  marge `0%` a été donnée spécifiquement pour qu'elle ne soit pas
  davantage pénalisée et tire la taille commune vers le bas plus que
  nécessaire.
  **Marges recalculées pour le nouveau texte** (`.promise-line-1` à `-5`) :
  attribuées par longueur de ligne plutôt que recopiées de l'itération
  précédente — la plus longue ligne (« quotidien professionnel ») reçoit
  `0%`, les plus courtes (« Suspendre le », 12 caractères) peuvent se
  permettre un décalage plus généreux (`20%`) sans devenir le goulot
  d'étranglement. La ligne 6 (« et intemporelle ») garde le traitement
  `width:fit-content; margin-left:auto` déjà établi (alignement à droite)
  — avec une taille désormais partagée et non plus calculée pour elle
  spécifiquement, elle n'a plus besoin du budget de largeur réduit à 75%
  qu'elle recevait à la 6e itération pour rester visible ; ce cas
  particulier a été retiré de `fitPromiseLines()`.
  Vérifié par script Playwright : 1 seule ligne rendue par groupe et 0
  débordement haut/bas aux 3 largeurs desktop testées, animation
  d'apparition toujours fonctionnelle. Regression complète 6 pages ×
  2 viewports : 0 débordement, 0 erreur console. Si un calcul de taille
  par ligne (plutôt qu'une taille unique via `Math.min`) réapparaît ici,
  c'est la 6e itération, à ne pas réintroduire sans qu'on le redemande.
- **Promesse — 8ᵉ itération, arbitrage largeur/hauteur pour maximiser la
  taille (2026-08-13/17)** (`univers.html`, `assets/css/style.css`) : la
  cliente a redemandé d'agrandir encore, explicitement en acceptant plus
  de lignes si besoin ("en comptant ces écarts, agrandi au maximum
  possible quitte à ce que ça fasse plus de ligne"). Passé de 6 à **8
  lignes** (texte identique, juste redécoupé plus finement, mot pour mot
  inchangé) : « Suspendre le » / « quotidien » / « professionnel » /
  « Pour transporter » / « vos invités » / « au cœur de » / « l'Italie,
  iconique » / « et intemporelle ».
  **Ce n'est pas juste "plus de lignes = plus grand"** : `fitPromiseLines()`
  prend le minimum des tailles idéales par ligne (7e itération), donc deux
  forces s'opposent quand on ajoute des lignes — les lignes individuelles
  raccourcissent (plus de marge pour chacune, la taille "idéale" par
  largeur monte) MAIS le total à caser dans le budget vertical d'un seul
  écran augmente aussi (la taille "idéale" par hauteur descend, cf. le
  calcul `budget / totalHeight` déjà en place). Testé empiriquement avant
  de choisir 8 (comparaison directe des tailles obtenues, pas au jugé) :
  - 6 lignes (texte de la 7e itération, ligne la plus longue "quotidien
    professionnel" à 23 caractères) : ~93–104px selon la largeur —
    limité par la LARGEUR (la ligne à 0% de marge était le goulot).
  - 9 lignes (quasiment un mot par ligne) : ~98–121px — bascule sur la
    limite de HAUTEUR (8 lignes à cette taille tenaient déjà tout juste
    le budget vertical), donc ajouter encore des lignes ne sert plus à
    rien : on gagne en largeur disponible par ligne mais on perd plus en
    budget vertical par ligne.
  - **8 lignes (retenu) : ~111–137px** — meilleur compromis trouvé, marge
    de largeur ET de hauteur toutes deux presque entièrement utilisées
    (calcul vérifié : à 1440×900, hauteur totale du bloc ≈ budget
    disponible à moins de 1px près).
  Le point clé : au-delà d'un certain nombre de lignes, ajouter des
  lignes devient contre-productif (la contrainte de hauteur devient plus
  sévère que le gain de largeur) — 8 est le point où les deux contraintes
  s'équilibrent à peu près pour ce texte précis. Si le texte de la
  citation change à nouveau, refaire ce test comparatif (pas supposer
  qu'un découpage plus fin est automatiquement plus grand).
  **Marges recalculées pour les 8 lignes**, par longueur de texte comme
  aux itérations précédentes (`0%` sur les deux lignes les plus longues —
  "Pour transporter" et "l'Italie, iconique" — jusqu'à `28%` sur la plus
  courte, "quotidien"). Le sélecteur CSS pour la dernière ligne
  (`width:fit-content; margin-left:auto`) a été généralisé en
  `.promise-line:last-child` (au lieu d'un nom de classe `promise-line-N`
  en dur) — comme `fitPromiseLines()` détecte déjà la dernière ligne
  dynamiquement (`i === promiseLines.length - 1`) plutôt que par nom de
  classe, un futur redécoupage en plus ou moins de lignes n'a plus besoin
  d'un aller-retour CSS + HTML + JS à chaque fois, seul le HTML (texte et
  classes `promise-line-N` pour les marges) doit changer.
  Vérifié par script Playwright : 1 seule ligne rendue par groupe et 0
  débordement haut/bas aux 3 largeurs desktop (1440×900, 1600×900,
  1920×1080), animation d'apparition toujours fonctionnelle. Regression
  complète 6 pages × 2 viewports : 0 débordement, 0 erreur console.
- **Promesse — 9ᵉ itération, ×1,75 explicite → contrainte "un seul écran"
  abandonnée, plafond physique du mot le plus long (2026-08-17)**
  (`.promise`, `fitPromiseLines()`, `univers.html`) : la cliente a demandé
  un facteur précis — "fait fois 1,75 sur la taille actuelle" — en gardant
  les écarts de chaque côté. **Ce chiffre exact n'est physiquement pas
  atteignable sans que ça déborde horizontalement** : "professionnel" (13
  caractères, le mot le plus long de toute la citation) ne peut, à lui
  seul, jamais dépasser ~169px de haut sur un écran de 1440px de large
  sans sortir du cadre — largement en dessous de 110,8px×1,75=194px visé.
  Ce plafond est **indépendant du découpage en lignes** : contrairement aux
  itérations précédentes (où repenser les groupes de mots permettait de
  gagner en taille), un mot seul ne peut pas être coupé au milieu — c'est
  une limite physique dure, pas un réglage de marge. Dit explicitement à
  la cliente plutôt que silencieusement plafonné à une valeur plus
  modeste.
  **Abandon de la contrainte "un seul écran" (implicite dans la demande)** :
  ×1,75 sur une taille qui utilisait déjà 100% du budget vertical
  disponible (8e itération, hauteur totale du bloc = budget exact) ne peut
  se caser dans la même hauteur. Plutôt que de continuer à découper en
  lignes plus courtes pour gratter de la hauteur (stratégie des itérations
  6-8, qui devenait ici contre-productive une fois la largeur du mot
  "professionnel" atteinte comme plafond), la contrainte elle-même a été
  relâchée : `.promise` passe de `height:100vh; overflow:hidden` à
  `min-height:100vh` (sans `overflow:hidden`) — la section grandit
  maintenant pour loger tout le texte (page + longue, un peu de scroll en
  plus) plutôt que de rogner quoi que ce soit. Si `height:100vh;
  overflow:hidden` réapparaît sur `.promise`, c'est un retour à l'ancienne
  contrainte, à ne pas réintroduire sans qu'on le redemande — sauf si la
  cliente redemande explicitement de revenir à une version qui tient sur
  un seul écran (auquel cas revoir aussi la taille de police en
  conséquence, les deux allant de pair).
  **`fitPromiseLines()` simplifié** : le calcul en deux temps (taille
  idéale par largeur, plafonnée ensuite par un budget de hauteur d'écran)
  est retiré — `sharedSize` est maintenant directement
  `Math.min.apply(null, idealSizes)`, la plus grande taille qui fait
  encore tenir CHAQUE ligne sur une seule ligne rendue, sans plus aucun
  ajustement après coup. Si un facteur `sharedSize *= 1.75` ou un calcul
  de budget vertical (`totalHeight`/`budget`) réapparaissent dans cette
  fonction, c'est une version intermédiaire de cette itération (un
  multiplicateur fixe appliqué par-dessus l'ancien plafond de hauteur,
  qui provoquait justement les retours à la ligne à corriger) — à ne pas
  réintroduire sans qu'on le redemande.
  **Découpage repoussé à 11 lignes** (texte inchangé mot pour mot) :
  « Suspendre » / « le quotidien » / « professionnel » / « Pour » /
  « transporter » / « vos invités » / « au cœur » / « de l'Italie, » /
  « iconique » / « et » / « intemporelle » — nécessaire pour isoler
  "professionnel" seul sur sa ligne à `margin-left:0` (le mot qui fixe le
  plafond), les autres lignes gardant des marges variées pour le
  décalage gauche/droite. Résultat mesuré : **~159px à 1440×900, ~177px à
  1600×900/1920×1080** — contre ~111–137px à la 8e itération (un gain
  réel de 43 à 60% selon la largeur), l'écart avec le ×1,75 visé
  (194–239px) étant exactement le manque à gagner dû au plafond physique
  de "professionnel" documenté ci-dessus.
  Vérifié par script Playwright : 1 seule ligne rendue par groupe et 0
  débordement horizontal aux 3 largeurs desktop testées (la hauteur, elle,
  dépasse maintenant volontairement un écran — pas un bug), capture
  pleine page confirmant que la photo de fond couvre bien toute la
  nouvelle hauteur de section (pas de bande vide en bas), animation
  d'apparition toujours fonctionnelle. Regression complète 6 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Promesse — 10ᵉ itération, alternance gauche/milieu/droite + apparition
  directionnelle par ligne (2026-08-17)** (`univers.html`,
  `assets/css/style.css`) : deux demandes distinctes.
  **Rythme des décalages recalibré** : la cliente trouvait l'alternance
  "trop centrée parfois" — plusieurs lignes consécutives avaient des
  `margin-left` proches (ex. 8%/8%/5% à la 8e itération), lisibles comme
  "toutes vers le milieu" plutôt qu'une vraie alternance gauche/milieu/
  droite. Les marges des 10 premières lignes (la dernière reste
  `width:fit-content; margin-left:auto`, alignée à droite comme avant)
  sont redistribuées en 3 zones nettement séparées — gauche (`0–5%`),
  milieu (`12–18%`), droite (`25–38%`) — et enchaînées pour qu'aucune
  paire consécutive ne tombe dans la même zone, sauf contrainte physique
  incontournable : "le quotidien"(12 car.) et "professionnel"(13 car.,
  le mot le plus long, cf. 9e itération) doivent toutes les deux rester
  proches de `0%` pour ne pas redevenir le nouveau goulot d'étranglement
  qui réduirait la taille de police globale — ce sont les deux seules
  lignes consécutives à partager la même zone (gauche), un compromis
  physique plutôt qu'un oubli. Toutes les marges ont été revérifiées une
  à une pour rester sous le seuil de sécurité de leur propre longueur de
  texte (formule : marge max ≈ `100×(13−nb_caractères)/13`, `13` étant la
  longueur du mot le plus contraignant) avant de lancer le test complet,
  plutôt que d'ajuster au jugé puis découvrir un retour à la ligne.
  **Apparition par ligne avec glissement directionnel** : chaque
  `.promise-line` glisse désormais depuis le côté vers lequel elle est
  décalée — lignes "gauche" arrivent de la gauche (`translateX(-8vw)`→0),
  lignes "droite" (et la dernière, toujours alignée à droite) arrivent de
  la droite (`translateX(8vw)`→0). Pour les lignes "milieu", pas de
  direction propre définie par leur position — la consigne cliente était
  d'alterner par rapport à la ligne juste au-dessus : chaque ligne milieu
  reçoit la direction opposée à celle de la ligne précédente (ex. ligne 6
  "vos invités", milieu, suit la ligne 5 "transporter" partie de la
  gauche → ligne 6 part de la droite). Décision figée dans le HTML via
  une classe `.promise-line-from-left`/`.promise-line-from-right` par
  ligne (pas recalculée dynamiquement — le texte et son découpage sont
  fixes, contrairement à la taille de police qui reste responsive).
  **`data-reveal` → `data-reveal-group`** sur `.promise-quote` : le
  système générique `[data-reveal-group] > *` (déjà utilisé ailleurs sur
  le site pour des groupes d'enfants à apparition échelonnée, ex.
  `.contact-band-methods`) est réutilisé comme point d'accroche
  IntersectionObserver (aucun changement JS requis, `main.js` observe
  déjà `[data-reveal], [data-reveal-group]` indifféremment) mais son
  `transform: translateY(20px)` par défaut est **surchargé** par des
  règles plus spécifiques
  (`.promise-quote[data-reveal-group] > .promise-line-from-left/-right`)
  pour un `translateX` directionnel à la place — l'ancien mécanisme
  `[data-reveal]` sur l'élément entier (fondu + `translateY` global,
  utilisé par toutes les refontes précédentes de cette section) est
  entièrement retiré. Délais échelonnés par ligne
  (`:nth-child(1)`…`:nth-child(11)`, 60ms d'écart) pour un effet de
  cascade, scopés à `.promise-quote[data-reveal-group]` donc sans impact
  sur les autres `[data-reveal-group]` du site (qui gardent leurs propres
  délais `:nth-child(1)`–`:nth-child(5)` définis plus bas dans le
  fichier). Règle `prefers-reduced-motion` dédiée ajoutée (les lignes
  s'affichent directement sans glissement). Si `data-reveal` (sans
  `-group`) réapparaît sur `.promise-quote`, ou si les lignes utilisent
  encore le `translateY` générique plutôt qu'un `translateX` directionnel
  par ligne, c'est l'ancien mécanisme, à ne pas réintroduire sans qu'on
  le redemande.
  Vérifié par script Playwright : opacité 0 + `translateX` décalé dans le
  bon sens par ligne avant apparition, opacité 1 + `translateX(0)` après
  (mesuré via `getComputedStyle().transform`, pas seulement visuel), 1
  seule ligne rendue par groupe et 0 débordement horizontal aux 3
  largeurs desktop testées. Regression complète 6 pages × 2 viewports :
  0 débordement, 0 erreur console.
- **Fondatrice — refonte complète en plaque bicolore (2026-08-17)**
  (`.founder`, `univers.html`) : la cliente n'aimait "pas du tout" la
  carte postale inclinée sur photo floutée (refonte précédente, bullet
  "Promesse + Fondatrice — refonte immersive" plus haut) — pas un réglage
  à ajuster, un changement de composition entier demandé. **Remplace
  entièrement** cette carte postale : plus de photo du tout (ni plein
  cadre ni floutée en fond), plus d'inclinaison, plus de bordure
  pointillée. Si `.founder-card` / `.founder-photo` / `.founder-scrim`
  réapparaissent ici, c'est cette ancienne version, à ne pas réintroduire
  sans qu'on le redemande. **Toujours aucune photo fabriquée d'Estelle**
  (règle du site, cf. « Limites connues ») : cette version pousse le
  principe plus loin que la précédente, qui utilisait au moins une photo
  d'ambiance en fond — ici le sujet est entièrement porté par la couleur et
  la typographie, aucune photo nulle part dans la section.
  **Nouvelle composition** : `.founder-plate`, une plaque bicolore posée
  sur un fond crème uni (`.founder` repasse de `--navy-900` à `--cream`,
  section auparavant systématiquement sombre) — deux blocs accolés sans
  arrondi entre eux (coins arrondis uniquement sur le contour extérieur de
  la plaque), pas de carte flottante isolée. À gauche (`.founder-plate-id`,
  ~32% en largeur à partir de 700px, empilé au-dessus en dessous) : fond
  dégradé terracotta→rouge Venise (même dégradé que l'ancien avatar,
  réutilisé à plus grande échelle), avatar "EL" en contour (cercle bordé,
  plus grand qu'avant — 4.6rem contre 3.4rem — mais sans remplissage plein
  ni rotation) et la signature (remontée depuis le panneau citation, elle
  vit désormais avec l'identité plutôt qu'en bas du texte). À droite
  (`.founder-plate-quote`, le reste de la largeur) : fond `--navy-900`,
  eyebrow "La fondatrice", un guillemet » géant décoratif en fond de plan
  (`.founder-mark` — même motif que le guillemet de la 2e refonte de la
  Promesse ci-dessus, aujourd'hui disponible puisque la 3e refonte de la
  Promesse ne l'utilise plus ; pas de conflit de réutilisation entre les
  deux sections) et la citation, texte inchangé mot pour mot. `data-reveal`
  sur `.founder-plate` (la plaque entière apparaît en un seul mouvement,
  fondu + translateY) plutôt que sur des éléments séparés — cohérent avec
  le traitement de la nouvelle Promesse juste au-dessus dans la page, sans
  dupliquer sa mise en page (pas de photo, pas de grande typographie
  décalée : composition volontairement différente pour les deux sections).
  **Crédits photo retirés** : `evenement-vespa-fleurie-lemon.jpg` n'étant
  plus utilisée nulle part sur le site depuis ce changement (vérifié par
  recherche dans le HTML des 6 pages et dans `mosaicImagesBase`,
  `main.js`), sa ligne dans `assets/img/CREDITS.md` repasse à "Non
  utilisée actuellement, disponible dans `assets/img/`" ; `amalfi-coast-sunset.jpg`
  reste utilisée par la Promesse juste au-dessus donc son crédit (Tracey
  Hind) reste inchangé dans le footer d'`univers.html`. Vérifié par
  regression Playwright complète (6 pages × 2 viewports) : 0 débordement,
  0 erreur console.
- **Fondatrice — retour au minimalisme, typographie centrée sur fond
  crème uni (2026-08-17)** (`.founder-minimal*`, `univers.html`) :
  demande explicite de la cliente de "revenir à quelque chose de plus
  minimaliste et premium visuellement" — retire tout l'appareil décoratif
  de la plaque bicolore ci-dessus (bloc identité en dégradé
  terracotta→rouge Venise, panneau navy séparé, guillemet `»` géant en
  fond de plan). Si `.founder-plate` / `.founder-plate-id` /
  `.founder-plate-quote` / `.founder-mark` réapparaissent ici, c'est cette
  plaque bicolore précédente, à ne pas réintroduire sans qu'on le
  redemande. **Toujours aucune photo fabriquée d'Estelle** (règle du
  site) : cette version, la plus dépouillée des trois qu'a connues cette
  section, ne porte le sujet que par la typographie — aucune photo,
  aucun bloc de couleur.
  **Nouvelle composition** : une seule colonne centrée
  (`.founder-minimal`, `max-width:42rem`, `margin-inline:auto`) posée
  directement sur le fond crème uni de `.founder` (inchangé depuis la
  plaque bicolore) — eyebrow "La fondatrice" (style générique `.eyebrow`
  du site, plus de variante `on-dark` puisqu'il n'y a plus de panneau
  sombre), la citation directement en Yeseva One sur le crème (texte
  inchangé mot pour mot, guillemets `«`/`»` restés dans le texte comme
  une citation classique plutôt que décoratifs en fond de plan), puis un
  simple trait fin horizontal (`.founder-rule`, `2.75rem` de large,
  `1.5px solid var(--terracotta)` — solid et non pointillé, cohérent avec
  le retrait sitewide des pointillés documenté plus bas) en séparateur,
  puis l'identité (`.founder-id-minimal`, ligne avatar + nom) : le
  médaillon "EL" perd son remplissage en dégradé pour un simple contour
  fin (`border:1px solid rgba(var(--navy-rgb),0.28)`, texte `--navy`),
  cohérent avec l'esprit dépouillé de toute la section. `data-reveal` sur
  `.founder-minimal` : apparition en un seul mouvement (fondu +
  translateY), comme sur la version précédente. Vérifié par capture
  d'écran desktop et mobile (le bloc avatar+nom passe naturellement en
  ligne unique sur les deux, aucun retour à la ligne du logo par rapport
  au nom sur mobile) et regression Playwright complète (6 pages ×
  2 viewports) : 0 débordement, 0 erreur console.
- **5 sens — parcours au scroll** (page Univers, `#sensesJourney`) : un
  chemin SVG se dessine progressivement pendant le scroll dans une section
  pinned/sticky (`.senses-journey`, `height: 1240vh` desktop / `1000vh`
  mobile). Chemin construit à partir de `journeyLayouts.desktop/mobile.points`
  lissés par une spline Catmull-Rom (`catmullRomToBezierD()`) — un grand
  zigzag (7 points, 6 grands virages) plutôt qu'une vague à petites bosses
  ou qu'une lettre/un mot (deux essais précédents le 2026-08-12,
  explicitement annulés par la cliente : le premier épelait "SIMPOSIO" en
  écriture manuscrite — trop chargé — le second faisait des petites bosses
  — trop petit, pas assez étiré). Le design actuel reproduit un croquis
  fourni par la cliente : chaque segment balaie presque toute la largeur du
  cadre avant de repartir dans l'autre sens, en descendant régulièrement.
  **Piège Catmull-Rom** : ce qui casse la courbe (débordement, points non
  ordonnés le long du tracé) n'est pas l'amplitude horizontale en soi, mais
  des allers-retours en x **sans progression verticale claire entre deux
  points consécutifs**. Tant que `y` est strictement croissant d'un point
  au suivant, de très grands écarts en x sont sûrs et ne peuvent pas faire
  que le tracé se croise lui-même (contrainte explicite de la cliente : « le
  trait ne doit jamais se couper ») — c'est exactement ce que fait le
  design actuel. Avant de commiter de nouveaux points, valider avec un
  script Node autonome (reproduire `catmullRomToBezierD`/`fractionAtPoint`,
  vérifier `bestDist` proche de 0, fractions strictement croissantes, et
  qu'aucune paire de points échantillonnés loin l'un de l'autre en longueur
  d'arc ne se retrouve proche dans l'espace) plutôt que de juger seulement
  au visuel. Le viewBox desktop (`0 0 1900 850`, ~2,24 de ratio) est
  volontairement large et court pour matcher l'aspect réel du cadre grand
  écran (`.senses-journey-frame`, jusqu'à 1600px de large pour 66vh de
  haut) ; un viewBox plus carré se retrouve "letterboxé" par
  `preserveAspectRatio="xMidYMid meet"` et le tracé finit coincé dans une
  colonne centrale au lieu de s'étirer d'un bord à l'autre — bug déjà
  rencontré et corrigé, à surveiller si le viewBox est retouché. 5
  bornes/repères nécessaires (5 sens) parmi les 7 points du tracé :
  `markerIndexes` sélectionne 5 indices (`journeyLayouts.*.markerIndexes`),
  le premier et le dernier point du tracé étant toujours parmi eux pour
  marquer clairement début et fin ; choisir les indices en testant
  plusieurs combinaisons pour une répartition à peu près régulière des
  fractions de longueur d'arc (pas forcément un espacement d'index régulier
  — les segments n'ont pas tous la même longueur). `fractionAtPoint()`
  échantillonne la courbe rendue (500 points) pour retrouver la vraie
  fraction de longueur d'arc de chaque repère. Chaque carte ne devient
  visible que lorsque le scroll a **atteint** la fraction du point
  (`journeyDwellSpan`), jamais en cours de trajet — c'est le comportement
  demandé, ne pas le transformer en simple scroll-sync continu.
  `.senses-journey-head` doit rester en flux normal (`position: relative`,
  pas `absolute`) dans la colonne flex `.senses-journey-sticky`, sinon le
  chemin SVG peut chevaucher visuellement le titre (bug déjà rencontré et
  corrigé). **`.senses-journey-progress`** (le compteur "X/5 sens découverts
  en chemin" en bas) **doit rester un enfant flex normal** (`position:
  relative`, avec `flex-shrink: 0` et `margin-top`), **pas**
  `position: absolute; bottom: …` — un vrai bug est survenu avec l'ancienne
  version : un élément en position absolue ancré au bas de
  `.senses-journey-sticky` (100vh) ne réserve aucun espace dans la colonne
  flex au-dessus de lui, donc rien ne force `.senses-journey-frame`
  (dimensionné en `vh`) à rétrécir pour lui laisser de la place. Sur une
  fenêtre de navigateur courte (grand écran mais peu de hauteur, ou fenêtre
  non maximisée), le tracé pouvait alors s'étendre jusqu'à chevaucher
  visuellement ce texte — signalé par la cliente via capture d'écran, où le
  trait touchait littéralement "5/5 SENS DÉCOUVERTS EN CHEMIN". Corrigé en
  remettant `.senses-journey-progress` dans le flux (`flex-shrink: 0` pour
  qu'il ne rétrécisse jamais, lui, puisqu'il est déjà minuscule) : le
  navigateur réserve alors toujours son espace en premier, et c'est
  `.senses-journey-frame` (qui a déjà `flex-shrink: 1; min-height: 0;`) qui
  absorbe la contrainte en rétrécissant si besoin — plus jamais de
  chevauchement, quelle que soit la hauteur de la fenêtre. Si ce genre de
  chevauchement réapparaît ailleurs dans cette section, vérifier en premier
  qu'aucun élément n'est sorti du flux flex par erreur.
  **`.senses-journey-card` doit rester à fond opaque** (`var(--navy-900)`,
  pas de transparence/`backdrop-filter`) : avec le grand zigzag actuel, le
  trait (avec son glow `drop-shadow`) passe forcément derrière la carte à
  un moment ou un autre du scroll puisque la carte est toujours centrée au
  même endroit — un fond même légèrement transparent (l'ancien
  `rgba(16,31,39,0.85)` + blur) laissait le glow transparaître à travers et
  « toucher » visuellement le texte, bug déjà rencontré et corrigé. **Pour
  vérifier visuellement le tracé** sans avoir à scroller
  1240vh : dans la console, forcer
  `document.getElementById('sensesJourneyPath').style.strokeDashoffset='0'`
  (trait complet) et `document.querySelector('.senses-journey-sticky').style.position='fixed'`
  (+ `top:0;left:0;width:100vw;zIndex:9999`) pour amener la section pinned
  à l'écran sans scroll réel, puis screenshot.
  **Bug réel trouvé et corrigé (2026-08-17, audit général du site)** :
  malgré le fond opaque ci-dessus, la carte redevenait "fantôme" (trait
  visible à travers, texte à peine lisible) PENDANT le fondu d'ouverture/
  fermeture (`opacity` fait partie de la `transition` de
  `.senses-journey-card`) — un fond "opaque" en `background-color` ne
  protège de rien quand c'est l'`opacity` de l'ÉLÉMENT LUI-MÊME (pas
  seulement son fond) qui est animée : CSS compose alors tout l'élément,
  fond inclus, comme un groupe semi-transparent, donc le glow du trait
  transperce quand même pendant la transition. Repéré via un balayage
  Playwright fin (60 pas) qui capturait `getComputedStyle(carte).opacity`
  à chaque étape et confirmé par capture d'écran mi-transition. Avec
  `journeyDwellSpan` assez court (0.05), une bonne partie de la fenêtre
  d'affichage pouvait même se passer en fondu plutôt qu'à pleine opacité.
  **Corrigé en retirant `opacity` de la `transition`** de
  `.senses-journey-card` (ne reste que `transform`) : l'opacité bascule
  désormais instantanément entre 0 et 1 au changement de classe — jamais
  d'état intermédiaire translucide — pendant que le `transform: scale()`
  continue d'animer en douceur pour garder un effet d'apparition. Si
  `opacity` réapparaît dans cette `transition`, revérifier ce bug avant de
  le garder.
  **Second bug trouvé au même audit** : le compteur "X/5 sens découverts
  en chemin" pouvait rester bloqué sous 5 même une fois le tracé
  entièrement dessiné et les 5 points allumés — reproduit en simulant un
  scroll rapide (glisser la barre de défilement jusqu'en bas d'un coup) :
  `journeyMaxReached` n'augmentait que lorsque `activeIndex` (fenêtre de
  détection étroite, `journeyDwellSpan=0.05`) passait explicitement par
  chaque point, ce qu'un grand saut de scroll peut sauter entièrement,
  contrairement aux points eux-mêmes (`is-lit`) qui s'allument dès que
  `progress` dépasse leur fraction, sans fenêtre étroite — les deux
  indicateurs pouvaient donc se désynchroniser. Corrigé dans
  `updateJourney()` (`main.js`) : le compteur utilise maintenant le même
  test à base de `progress` que les points (`reachedCount`, calculé à
  chaque frame indépendamment de la fenêtre de la carte), donc toujours
  cohérent avec eux. Vérifié : sauter directement en bas de la section
  affiche bien "5/5" avec les 5 points allumés, plus jamais désynchronisé.
- **5 sens — cartes repassées en blanc (2026-08-17)**
  (`.senses-journey-card*`, `style.css`) : demande explicite de la
  cliente. Fond passé de `var(--navy-900)` à `var(--cream)` (Blanc
  Calcaire, pas un blanc pur — reste dans la palette de marque), bordure
  adaptée (`rgba(var(--navy-rgb), 0.12)` au lieu du liseré clair pensé
  pour un fond sombre). Couleurs de police réajustées pour le contraste
  sur fond clair : `h3` (nom du sens) passe de `var(--cream)` à
  `var(--navy)`, le texte descriptif de `var(--fg-muted-inverse)` (gris
  clair, pensé pour fond sombre) à `var(--fg-muted)` (son équivalent pour
  fond clair, déjà utilisé ailleurs sur le site pour ce rôle, ex.
  `.teaser-card p`), l'icône et le numéro de `var(--terracotta-300)`
  (terracotta clair, pensé pour ressortir sur fond sombre) à
  `var(--terracotta)` (terracotta plein, plus de contraste sur blanc).
  **Le fond doit rester opaque** (règle déjà documentée juste au-dessus
  pour la version navy — le trait lumineux du tracé SVG passe derrière la
  carte à un moment du scroll, un fond même légèrement transparent
  laisserait le glow transparaître) : cette contrainte s'applique
  également au blanc, aucun changement de ce côté. Vérifié par script
  Playwright (fond, couleurs de texte mesurées via `getComputedStyle`) et
  capture d'écran : carte blanche bien lisible sur le fond sombre du
  tracé, aucun changement au mécanisme d'apparition/opacité (toujours
  instantané, pas de transition sur `opacity`, cf. bug documenté
  ci-dessus).
- **Engagements — grille de flip-cards en zigzag avec parallaxe/scale au
  scroll (2026-08-17)** (`.engagement-card*`, `engagements.html`,
  `updateEngagementCards()` dans `main.js`) : remplace entièrement
  l'ancien système de lignes au survol (`#engagementHoverCard`,
  `.engagement-line`, carte suivant le curseur) — demande explicite de la
  cliente, avec cahier des charges précis façon "Awwwards" (flip-card
  recto/verso + parallaxe/scale au scroll). **Note historique** : une
  entrée précédente de ce fichier disait explicitement "il n'y a plus de
  flip-card, ne pas réintroduire ce pattern sans qu'on le redemande" — la
  réintroduction ici est ce redemande explicite, ce n'est pas un oubli de
  cette règle.
  **Structure de carte** : `.engagement-card-flip` (un vrai `<button>`,
  accessible clavier nativement, état géré par `aria-expanded` — pas de
  classe séparée) > `.engagement-card-inner` (fait le flip 3D via
  `transform:rotateY(180deg)` sur `[aria-expanded="true"]`,
  `transform-style:preserve-3d`) > deux faces `.engagement-card-face`
  (`backface-visibility:hidden`) : `.engagement-card-front` (photo pleine
  carte + dégradé + numéro/titre/flèche terracotta) et
  `.engagement-card-back` (`rotateY(180deg)` au repos, fond navy, titre +
  description + "Retour").
  **Scale/parallaxe au scroll, jamais sur l'élément du flip** : le point
  technique important — `updateEngagementCards()` (rAF-throttlé sur
  `scroll`, comme tous les autres effets scroll-liés du site) applique un
  `transform:scale()` continu sur le `<li class="engagement-card">`
  (0.94 au repos → 1.0 au centre du viewport, formule
  `1 - |delta|/(vh*0.7)` où `delta` = distance du centre de la carte au
  centre du viewport) et un `translateY` de parallaxe sur
  `.engagement-card-front-img` (`delta*-0.08`, l'image bouge en sens
  inverse du scroll) et un second `translateY` plus faible sur
  `.engagement-card-front-content` (`delta*-0.035`, décalage différencié
  entre le bloc image et le bloc texte demandé explicitement). Ces trois
  transforms vivent sur **trois éléments différents** de
  `.engagement-card-inner` (qui, lui, ne reçoit que le `rotateY` piloté
  par CSS) — un choix architectural délibéré pour que le scale/parallaxe
  JS ne rentre jamais en conflit avec la transition CSS du retournement au
  clic (les deux mécanismes touchent des propriétés `transform`
  différentes sur des éléments différents, jamais le même élément).
  `.engagement-card-front-img` est dimensionnée à `height:124%` avec
  `inset:-12% 0` pour avoir de la marge de déplacement sans jamais laisser
  de bord vide pendant la translation (même technique que la parallaxe de
  la Promesse, page Univers).
  **Disposition en zigzag** : chaque carte a sa propre classe de position
  (`.engagement-card-pos-left/-center/-right/-center-left/-center-right`,
  `margin-inline` différent par carte) plutôt que d'être alignées sur un
  seul axe vertical — demande explicite de la cliente. Réinitialisé à
  `margin-inline:auto` (toutes centrées) sous 700px, où l'espace ne
  permet plus ce jeu de décalage.
  **`prefers-reduced-motion`** : contrairement à la convention habituelle
  du site (les effets scroll-liés 1:1 restent actifs sous cette
  préférence, cf. parcours des 5 sens, parallaxe de la Promesse), le
  scale/parallaxe des cartes est ici **entièrement désactivé** — décision
  volontaire car cet effet est purement décoratif (contrairement au tracé
  des 5 sens qui porte une information de progression), documentée en
  commentaire dans `main.js` pour ne pas être "corrigée" par erreur vers
  la convention habituelle plus tard.
  **Photos** : 3 photos Simposio réelles jusque-là utilisées uniquement
  dans la mosaïque Projets (`evenement-stand-raye-guirlande.jpg` pour
  "Concept clé en main", `evenement-assiette-agrume-ceramique.jpg` pour
  "Positionnement premium", `evenement-vespa-gelato-brindapino.jpg` pour
  "Spécialiste Dolce Vita" — aucun nouveau crédit requis, `CREDITS.md` mis
  à jour) + `alsace-vineyard.jpg` réutilisée pour "Ancrage alsacien" (déjà
  utilisée plus bas sur cette même page dans le carrousel Valeurs, déjà
  créditée dans le footer — seule photo du site montrant l'Alsace, aucune
  alternative disponible).
  Vérifié par script Playwright : clic (souris + clavier `Enter` sur le
  `<button>` focus) bascule `aria-expanded` et déclenche le flip visuel,
  `prefers-reduced-motion:reduce` neutralise bien le scale/parallaxe
  (`transform:none` mesuré), 0 débordement horizontal. Regression complète
  6 pages × 2 viewports : 0 débordement, 0 erreur console.
- **Engagements — 2ᵉ itération : fond dynamique, cartes plus grandes,
  cascade en escalier, nouvelles photos (2026-08-17)** (`.engagements*`,
  `.engagement-card*`, `layoutEngagementCards()` dans `main.js`) : cinq
  demandes distinctes de la cliente sur la grille de flip-cards ci-dessus,
  sans remettre en cause son mécanisme de flip/scale/parallaxe (inchangé).
  **Fond dynamique** : le fond bicolore statique (`linear-gradient(200deg,
  var(--navy)…)`) reste en base mais un calque animé est ajouté par-dessus
  — `.engagements::before` porte désormais trois `radial-gradient`
  (lueurs terracotta/rouge Venise/navy foncé) très floutées
  (`blur(60px)`) sur un `inset:-25%` généreux pour n'avoir aucun bord net
  visible, qui dérivent lentement en boucle (`@keyframes
  engagementsBgDrift`, 26s, `translate`+`scale` légers) — même technique
  que `.values-sticky::before` (12ᵉ itération des Valeurs, cf. plus haut),
  adaptée ici à une section non-sticky. **Désactivé sous
  `prefers-reduced-motion`** (`animation:none`), cohérent avec le choix
  déjà pris pour le scale/parallaxe des cartes juste au-dessus (effet
  purement décoratif, pas d'information portée). Le petit carré terracotta
  décoratif du coin, qui occupait `::before`, est repoussé sur `::after`
  pour libérer `::before` — si ce carré réapparaît sur `::before` avec le
  fond en dégradés sur `::after`, c'est l'ordre inversé, sans impact
  visuel mais à corriger pour rester cohérent avec le commentaire du code.
  **Cartes plus grandes** : `.engagement-card` passe de `min(88vw, 24rem)`
  à `min(90vw, 27rem)` (+12.5% en largeur plafond).
  **Cascade en escalier, remplace l'espacement uniforme** : demande
  explicite — "fait pas commencé les cartes les unes en dessous des lignes
  avec le même espace à chaque fois... commence la deuxième un peu plus
  haut au niveau des 3/4 de la première, la 3e au niveau de la moitié de
  la 2e et ainsi de suite". Un simple `gap` CSS uniforme est retiré de
  `.engagement-cards` ; **impossible à faire en CSS pur** (un `margin-top`
  en `%` se résout par rapport à la LARGEUR du bloc conteneur, jamais par
  rapport à la hauteur d'un frère) donc calculé en JS,
  `layoutEngagementCards()` (`main.js`) : pour chaque carte à partir de la
  2ᵉ, une fraction de démarrage `startFraction` décroît de 25 points de
  pourcentage à chaque carte (0.75, 0.50, 0.25, plafonnée à un minimum de
  0.15 si d'autres cartes s'ajoutaient un jour) et `margin-top = -(1 -
  startFraction) × offsetHeight(carte précédente)` — utilise
  `offsetHeight` (la vraie boîte de mise en page) plutôt que
  `getBoundingClientRect().height`, qui inclurait l'effet du
  `transform:scale()` déjà appliqué par `updateEngagementCards()` juste
  au-dessus dans le fichier. Appelée au chargement et au resize (fonction
  séparée, pas fusionnée avec `updateEngagementCards()` qui reste
  rAF-throttlée sur `scroll`). **Désactivée sous 700px** : sur cette
  largeur les cartes se recentrent déjà en une seule colonne
  (`margin-inline:auto`), un chevauchement empilé y serait illisible —
  `layoutEngagementCards()` vide alors `style.marginTop` sur toutes les
  cartes et laisse la règle CSS de repli `.engagement-card +
  .engagement-card { margin-top: var(--space-5) }` reprendre la main
  (espacement uniforme classique). Vérifié par script Playwright
  (marges mesurées à 1440px : -130px/-259px/-389px, soit très exactement
  25%/50%/75% de la hauteur réelle des cartes ; à 390px : marges vidées,
  espacement uniforme `var(--space-5)` actif).
  **Piège rencontré et corrigé avant publication** : avec l'ordre de
  zigzag initial (gauche/centre-droite/centre-gauche/droite), la carte 4
  ("Ancrage alsacien") se retrouvait à chevaucher visuellement la carte 2
  ("Positionnement premium") et à cacher son bouton flèche — pas un bug
  de calcul, une conséquence géométrique : la cascade ne raisonne que par
  rapport à la carte immédiatement précédente, mais le décalage cumulé
  entre cartes NON adjacentes (ici carte 2 et carte 4) peut lui aussi
  produire un chevauchement vertical (~25% de la hauteur d'une carte,
  quel que soit l'assignation gauche/droite) — si ces deux cartes
  partagent en plus la même moitié d'écran horizontalement, le
  chevauchement devient visible et gênant. Repéré par capture d'écran à
  mi-scroll (pas supposé). **Corrigé en réordonnant les positions plutôt
  qu'en touchant aux fractions de cascade** : gauche / centre-droite /
  droite / centre-gauche (au lieu de gauche/centre-droite/centre-gauche/
  droite) — dans ce nouvel ordre, les deux cartes qui se chevauchent par
  ricochet (carte 2 "centre-droite" et carte 4 "centre-gauche") occupent
  des plages horizontales disjointes, donc le chevauchement reste
  purement vertical et invisible à l'écran ; le chevauchement adjacent
  voulu par la cliente (carte 2↔3, carte 3↔4, jusqu'à 75% pour la paire
  la plus tardive) reste lui pleinement visible, c'est l'effet de
  "pile de cartes" recherché. Si un futur redécoupage change l'ordre des
  positions ou le nombre de cartes, revérifier par capture d'écran (pas
  seulement par la formule) qu'aucune paire non adjacente ne finit sur la
  même moitié d'écran.
  **Nouvelles photos** (recherche en banque d'images de nouveau non
  fonctionnelle dans cet environnement — `mcp__stock-images__search_images`
  retourne toujours `0 providers`, revérifié cette session — repli sur le
  pool `assets/img/` existant, cohérent avec la pratique déjà établie sur
  ce projet) : deux des quatre photos changent pour mieux représenter
  l'engagement précis de leur carte plutôt qu'un choix plus générique —
  "Concept clé en main" (service intégré/clé en main) passe de
  `evenement-stand-raye-guirlande.jpg` à `evenement-tablee-diner-bougies.jpg`
  (tablée complète — bougies, fleurs, verrerie, art de la table — montre
  littéralement décoration+ambiance+restauration+service réunis, plus
  parlant qu'un stand seul pour ce texte) ; "Positionnement premium"
  passe de `evenement-assiette-agrume-ceramique.jpg` à
  `evenement-carte-degustation.jpg` (carte à déguster sur chevalet en
  terrasse — évoque directement une offre gastronomique pensée/qualitative,
  plus lisible pour "premium" qu'une simple assiette). "Spécialiste Dolce
  Vita" (`evenement-vespa-gelato-brindapino.jpg`, vespa+gelato+toast — déjà
  un match thématique fort, conservée) et "Ancrage alsacien"
  (`alsace-vineyard.jpg`, seule photo du site montrant l'Alsace, aucune
  alternative disponible) sont inchangées. `assets/img/CREDITS.md` mis à
  jour pour les deux photos remplacées (colonne "Utilisée sur").
  Vérifié par regression Playwright complète (6 pages × 2 viewports,
  modification touchant `style.css`/`main.js` partagés) : 0 débordement,
  0 erreur console ; clic-flip et navigation clavier revérifiés
  fonctionnels après les changements de marges.
- **Engagements — 3ᵉ itération : plus aucun chevauchement de carte, bug
  Safari du flip corrigé (2026-08-17)** (`.engagement-card*`,
  `layoutEngagementCards()` dans `main.js`) : la cliente a testé le rendu
  réel de la 2ᵉ itération dans Safari (capture d'écran fournie) et signalé
  deux problèmes distincts.
  **1) Chevauchement de cartes non voulu** : la cascade de la 2ᵉ itération
  calculait volontairement un chevauchement (marge négative, la carte N
  mangeant une fraction croissante de la carte N-1) — c'était une lecture
  littérale de la demande initiale ("commence la deuxième un peu plus haut
  au niveau des 3/4 de la première"), mais une fois vu à l'écran la
  cliente a explicitement demandé qu'aucune carte ne se chevauche jamais.
  **`layoutEngagementCards()` inversé** : les mêmes fractions (0.75, 0.50,
  0.25, plafonnées à 0.15) sont maintenant appliquées comme un **espace
  positif** avant chaque carte (`margin-top = +prevHeight × fraction`) au
  lieu d'un chevauchement négatif (`margin-top = -prevHeight × (1 -
  fraction)`) — le rythme irrégulier/décroissant demandé par la cliente
  est conservé (l'espace avant la carte 2 est le plus large, celui avant
  la carte 4 le plus resserré) mais la marge ne descend plus jamais sous
  zéro, donc deux cartes ne peuvent plus jamais se recouvrir verticalement,
  quelle que soit la combinaison de positions horizontales. Vérifié par
  script Playwright comparant les rectangles de chaque paire de cartes
  (pas seulement les paires adjacentes) : aucun chevauchement vertical
  détecté, à aucune des 6 combinaisons de paires. Si un `margin-top`
  négatif réapparaît sur `.engagement-card` (calculé comme un
  chevauchement mangeant la carte précédente), c'est la version de la 2ᵉ
  itération, à ne pas réintroduire sans qu'on le redemande.
  **2) Bug Safari du flip : le titre s'affichait à l'envers/en miroir au
  verso** : capture d'écran de la cliente montrant, une fois une carte
  retournée, le titre de la face avant ("03 Spécialiste Dolce Vita")
  visible en double, mirroré/à l'envers, dépassant sous la carte
  retournée. **Cause identifiée** : bug WebKit/Safari documenté et
  reproductible — `backface-visibility: hidden` devient non fiable dans
  Safari lorsqu'un ANCÊTRE du sous-arbre `perspective`/
  `transform-style: preserve-3d` porte lui-même un `transform` distinct.
  C'est exactement notre structure : `.engagement-card` (`<li>`, ancêtre)
  reçoit un `transform: scale()` piloté par le scroll
  (`updateEngagementCards()`), et son descendant
  `.engagement-card-flip` > `.engagement-card-inner` porte le
  `perspective`/`preserve-3d`/`rotateY` du flip — Safari peut alors
  continuer à peindre la face censée être masquée (mirrorée, puisque
  c'est la face "arrière" d'un contenu non pivoté). **Non reproductible
  dans cet environnement de développement** (seul Chromium est disponible
  ici, pas de moteur WebKit réel pour valider visuellement le correctif en
  conditions Safari) — corrigé en appliquant le contournement standard
  documenté pour ce bug : `transform: translateZ(0)` sur
  `.engagement-card-flip` (force ce sous-arbre 3D sur son propre calque de
  composition, isolé du `transform` de l'ancêtre) + `-webkit-transform-style:
  preserve-3d` et `will-change: transform` ajoutés sur
  `.engagement-card-inner` (renforcent l'isolation du calque). Chromium
  n'a jamais reproduit ce bug (le flip était déjà visuellement propre avant
  correctif dans nos tests Playwright), donc impossible de vérifier ici
  que le correctif élimine bien le problème en conditions réelles — **à
  revérifier explicitement dans Safari après mise en ligne**, et si le
  problème persiste, envisager de déplacer le `scale()` scroll-lié du
  `<li>` vers un wrapper interne dédié plutôt que de rester sur l'ancêtre
  direct du conteneur `perspective` (changement plus lourd, non fait ici
  pour rester minimal tant que le contournement standard n'a pas été
  invalidé par un test réel).
  Vérifié par script Playwright (Chromium) : 0 chevauchement vertical
  entre toute paire de cartes, flip clic/clavier toujours fonctionnel,
  `transform-style` et `will-change` bien appliqués. Regression complète
  6 pages × 2 viewports : 0 débordement, 0 erreur console.
- **Engagements — 4ᵉ itération : retour au chevauchement littéral avec de
  nouvelles fractions, correctif définitif du titre miroir au dos
  (2026-08-17)** (`.engagement-card*`, `layoutEngagementCards()` dans
  `main.js`) : après avoir vu le rendu réel de la 3ᵉ itération, la cliente
  a redemandé explicitement de revenir au principe de chevauchement de la
  2ᵉ itération, avec de nouvelles fractions précises — "commence au 3/4 de
  la une, la trois à la moitié de la deux et 4 au 1/3 de la 3" — et de
  supprimer entièrement le titre qui s'affichait à l'envers au dos des
  cartes plutôt que de compter sur un contournement de rendu.
  **Chevauchement réintroduit, nouvelles fractions** :
  `engagementStartFractions = [0.75, 0.5, 1/3]` (au lieu de la formule
  arithmétique `-25 points/carte` de la 2ᵉ itération) — carte 2 démarre à
  75% de la hauteur de la carte 1 (chevauchement 25%), carte 3 à 50% de la
  carte 2 (chevauchement 50%), carte 4 à 1/3 de la carte 3 (chevauchement
  ~67%, le plus prononcé). `margin-top` redevient négatif
  (`-(1 - startFraction) × offsetHeight(carte précédente)`). **Le vrai bug
  de la 2ᵉ itération n'était pas le chevauchement en soi** — c'était deux
  cartes NON adjacentes (2 et 4) qui atterrissaient sur le même côté
  horizontal et se chevauchaient donc aussi visuellement — déjà corrigé à
  la 2ᵉ itération en réordonnant les positions
  (gauche/centre-droite/droite/centre-gauche, inchangé ici). Revérifié
  avec les nouvelles fractions par script Playwright comparant les
  rectangles (top/bottom/left/right) de chaque paire de cartes : aucune
  paire NON adjacente ne partage à la fois un chevauchement vertical ET
  horizontal — seules les paires adjacentes (voulues) se chevauchent
  visuellement, jamais deux cartes qui ne se suivent pas dans la grille.
  **Titre miroir au dos — correctif définitif** : le contournement de la
  3ᵉ itération (`translateZ(0)` pour isoler le sous-arbre 3D du flip sur
  son propre calque de composition) n'était qu'un contournement du bug
  WebKit, pas une garantie — invérifiable sans moteur Safari réel dans cet
  environnement. La cliente a redemandé explicitement de "enlever" ce
  titre à l'envers plutôt que d'espérer qu'un contournement de rendu 3D
  suffise. **Nouveau mécanisme, indépendant de `backface-visibility`** :
  chaque `.engagement-card-face` reçoit désormais `transition: visibility
  0s linear 0.375s` (0.375s = la moitié des 0.75s de la rotation de
  `.engagement-card-inner`) et deux règles d'attribut,
  `[aria-expanded="true"] .engagement-card-front { visibility: hidden }` /
  `[aria-expanded="false"] .engagement-card-back { visibility: hidden }` —
  `visibility` ne dépend d'aucun calcul de culling de face 3D (contrairement
  à `backface-visibility`), donc ce mécanisme ne peut pas échouer de la
  même façon dans un navigateur qui gère mal les transforms imbriqués.
  Le délai de moitié de durée fait que chaque face reste visible/masquée
  exactement aussi longtemps qu'elle le serait naturellement du point de vue
  du spectateur, puis bascule pile au moment où elle est de profil
  (donc de toute façon quasi invisible) — imperceptible visuellement, mais
  cette fois garanti correct dans n'importe quel navigateur, pas seulement
  contourné pour Safari. `backface-visibility:hidden` et le `translateZ(0)`
  de la 3ᵉ itération sont conservés en défense en profondeur (aucun mal à
  les garder) mais ne sont plus le mécanisme dont dépend la correction —
  documenté comme tel en commentaire dans le CSS. Vérifié par script
  Playwright lisant `getComputedStyle().visibility` sur les deux faces
  avant/après clic : face avant `hidden` + face arrière `visible` une fois
  retournée, inverse une fois refermée, dans les deux sens. **Toujours
  invérifiable en conditions Safari réelles dans cet environnement**
  (Chromium uniquement) — mais contrairement au correctif de la 3ᵉ
  itération, celui-ci ne dépend d'aucun comportement spécifique à un
  moteur de rendu, donc le risque résiduel est nettement plus faible.
  Vérifié par regression Playwright complète (6 pages × 2 viewports) : 0
  débordement, 0 erreur console.
- **Engagements — 5ᵉ itération : positions 3/4 inversées, garde-fou
  générique contre le chevauchement à distance (2026-08-17)**
  (`.engagement-card-pos-*` dans `engagements.html`,
  `layoutEngagementCards()` dans `main.js`) : la cliente a demandé
  d'échanger les côtés de la carte 3 (repassée à gauche,
  `engagement-card-pos-center-left`, ex-`-right`) et de la carte 4
  (repassée à droite, `engagement-card-pos-right`, ex-`-center-left`), en
  gardant exactement les mêmes niveaux de cascade (aucune valeur dans
  `engagementStartFractions` touchée). **Repéré avant publication, pas
  supposé** : cet échange recréait très exactement le bug corrigé à la 2ᵉ
  itération, mais sur une autre paire — les cartes 2 et 4 se retrouvaient
  toutes les deux du côté droit, et avec les fractions actuelles
  (3/4, 1/2, 1/3) elles partagent ~84px de hauteur en commun, donc la
  carte 4 recouvrait le bouton flèche de la carte 2. Vérifié par script
  Playwright (mesure de rectangles) puis confirmé par capture d'écran
  avant de proposer un correctif — signalé explicitement à la cliente
  plutôt que poussé tel quel, avec 3 options ; elle a choisi de décaler
  légèrement la carte 4 vers le bas.
  **Garde-fou générique ajouté à `layoutEngagementCards()`** (plutôt qu'un
  décalage codé en dur pour ce cas précis) : après avoir positionné
  chaque carte par rapport à la précédente (mécanisme inchangé), la
  fonction compare aussi la carte courante à celle **deux positions plus
  tôt** (`engagementCards[i - 2]`, mesuré via `getBoundingClientRect()`
  une fois la marge de base appliquée) — si les deux se chevauchent à la
  fois horizontalement ET verticalement, la carte courante est repoussée
  vers le bas de juste assez pour dégager la carte plus ancienne (+16px de
  marge de respiration), sans toucher au chevauchement voulu avec la
  carte immédiatement précédente. **Pourquoi un garde-fou général plutôt
  qu'un simple ajustement du cas 2↔4** : ce type de collision "à distance"
  (deux cartes non adjacentes dans la cascade mais du même côté
  horizontal) s'est déjà produit deux fois avec des combinaisons de
  positions différentes (2ᵉ itération : 2↔4 avec l'ancien ordre ; 5ᵉ
  itération : 2↔4 à nouveau mais avec un ordre différent) — un correctif
  ponctuel aurait cassé à la prochaine réorganisation des positions ou au
  prochain changement de fractions ; ce garde-fou se recalcule à chaque
  layout et reste valable quels que soient l'ordre des positions ou les
  valeurs de `engagementStartFractions`, y compris à des largeurs d'écran
  autres que celle testée (revérifié à 1440px, 1600px et 1920px, 0
  collision aux trois). Si un ajustement en dur (ex. un pixel fixe ajouté
  seulement à la carte 4) réapparaît ici à la place de cette comparaison
  générique, c'est un pas en arrière — à ne pas réintroduire.
  Vérifié par script Playwright : `marginTop` de la carte 4 ajusté
  dynamiquement (`-245px` au lieu de `-345px` à 1440px, l'écart
  correspondant exactement au chevauchement mesuré + 16px), aucune
  collision non-adjacente détectée à aucune des 3 largeurs testées.
  Regression complète 6 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Engagements — 6ᵉ itération : carte 4 au 2/3 de la carte 3 (2026-08-17)**
  (`engagementStartFractions`, `main.js`) : demande explicite de la
  cliente ("fait commencer la carte 4 au 2/3 de la 3") — seule la
  troisième valeur du tableau change, `1/3` → `2/3` (`[0.75, 0.5, 2/3]`),
  cartes 2 et 3 inchangées. Avec un chevauchement plus modeste (carte 4
  commence plus bas, donc chevauche moins la carte 3 : ~33% de sa hauteur
  au lieu de ~67%), le garde-fou générique anti-chevauchement à distance
  ajouté à la 5ᵉ itération (comparaison avec la carte deux positions plus
  tôt) n'a plus besoin d'intervenir à 1440px — vérifié : `margin-top`
  calculé vaut exactement `-173px` (= `(1-2/3) × 518px`, la formule brute
  sans ajustement), alors qu'il valait `-245px` (formule brute `-345px`
  + le correctif du garde-fou) à la 5ᵉ itération avec `1/3`. Le garde-fou
  reste en place et continuera de s'activer automatiquement si une future
  valeur de fraction ou un futur changement de positions recréait un
  chevauchement à distance — rien à faire de plus pour ce cas précis.
  Vérifié par regression Playwright complète (6 pages × 2 viewports) : 0
  débordement, 0 erreur console.
- **Valeurs — carrousel "paroles" plein écran, deux colonnes avec photo en
  fondu (2026-08-13, 4ᵉ itération)** (`.values`, `.values-sticky`,
  `.values-inner`, `.values-text`, `.values-window`,
  `.values-list`/`.values-line`, `.values-media`/`.values-media-photo`, sous
  la section Talents, `engagements.html`) : refonte demandée par la cliente
  à partir d'une maquette Canva (capture d'un « ordinateur » fictif montrant
  le rendu attendu). **Remplace la contrainte de hauteur de l'itération
  précédente** (« doit faire la même hauteur que l'ancien bandeau
  terracotta », ~515px/413px/510px selon la largeur) par une contrainte
  différente et explicite : « ne doit pas dépasser la taille d'un écran
  d'ordinateur, doit être entièrement visible en un seul écran ».
  `.values-sticky` est donc calée sur `height: 100vh` (même valeur que
  `.senses-journey-sticky`, univers.html — pas de media query par largeur,
  contrairement à l'itération précédente ; si un `min(Xvh, Ypx)` avec
  plusieurs paliers desktop/tablette/mobile réapparaît ici, c'est
  l'ancienne contrainte de hauteur, à ne pas réintroduire sans qu'on le
  redemande). Le wrapper pinné `.values` est passé de `480vh` à `420vh`
  (ajusté empiriquement, la fenêtre visible n'ayant plus que 4 états actifs
  au lieu de 6 — voir ci-dessous — donc moins de distance de scroll
  nécessaire).
  **Layout deux colonnes** (`.values-inner`, `grid-template-columns:
  1.05fr 0.95fr` à partir de 900px, une seule colonne empilée en dessous) :
  à gauche `.values-text` (eyebrow "Nos valeurs" + le carrousel de 3 lignes,
  aligné à gauche sur desktop, centré en dessous de 900px) ; à droite
  `.values-media`, une photo plein cadre (`object-fit: cover`, ratio 4/5,
  coins arrondis `--radius-lg`, ombre portée) **masquée sous 900px** — sur
  mobile/tablette portrait, seul le carrousel de texte reste visible,
  centré, occupant tout l'écran (comportement hérité de l'itération
  précédente, la maquette de la cliente étant explicitement un rendu
  "écran d'ordinateur").
  **Toujours 3 lignes visibles dès l'entrée dans la section** : contrainte
  explicite de la cliente — "je veux que la valeur principale commence par
  la deuxième valeur pour qu'on retrouve la valeur 1 juste au-dessus et la
  valeur 3 juste en dessous". Dans `main.js`, `updateValuesActive()` calcule
  `activeIndex` **borné à `[1, n-2]`** (jamais l'index 0 ni le dernier) :
  `activeIndex = min(n-2, 1 + floor(progress × (n-2)))`. Avec 6 valeurs,
  l'index actif circule donc uniquement entre 1 et 4 (les valeurs 2 à 5) ;
  la toute première et la toute dernière valeur n'occupent jamais le rôle
  "actif" (`.is-active`), seulement `.is-prev`/`.is-next` en retrait — c'est
  le prix nécessaire pour garantir "toujours 3 lignes remplies" du tout
  début à la toute fin du scroll, plutôt que 2 lignes seulement aux
  extrémités (comme le ferait un simple `activeIndex = floor(progress × n)`
  parcourant tout l'intervalle `[0, n-1]`, l'itération précédente). Si ce
  calcul plus simple réapparaît ici, c'est l'ancienne version à ne pas
  réintroduire sans qu'on le redemande. Le reste de la mécanique
  `.is-prev`/`.is-active`/`.is-next` (jamais deux classes à la fois par
  ligne, lignes sans classe invisibles à `opacity: 0`) est inchangé par
  rapport à l'itération précédente, vérifié par un balayage de scroll
  Playwright confirmant l'assignation correcte à chaque étape.
  **Photo de droite synchronisée avec la valeur active** : 6 `<img
  class="values-media-photo">` empilées en `position: absolute` dans
  `.values-media` (une par valeur, même ordre d'index que `.values-line`),
  `opacity: 0` par défaut, `.is-active` (ajoutée/retirée par
  `updateValuesActive()` sur l'image dont l'index correspond à
  `activeIndex`) → `opacity: 1`, transition `1s` = l'effet de fondu
  enchaîné demandé ("faisant disparaître la photo actuelle pour laisser
  apparaître la photo suivante"). Comme `activeIndex` ne descend jamais à 0
  ni ne monte jamais au dernier index, les photos aux positions 0 et 5 ne
  s'affichent jamais — accepté comme conséquence du choix
  ci-dessus, cohérent avec le fait que ces deux valeurs n'occupent elles
  non plus jamais le rôle "actif" en texte. Photos choisies parmi les
  vraies photos d'événements Simposio déjà présentes dans `assets/img/`
  (aucun crédit requis, cf. `assets/img/CREDITS.md`) pour correspondre au
  sens de chaque valeur : `evenement-carte-degustation.jpg` (exigence),
  `evenement-vespa-gelato-brindapino.jpg` (art de vivre italien),
  `evenement-tablee-diner-bougies.jpg` (interlocuteur/chaleur humaine),
  `evenement-assiette-agrume-ceramique.jpg` (détail), 
  `evenement-planche-charcuterie.jpg` (confiance/partage),
  `evenement-stand-raye-guirlande.jpg` (signature) — texte éditorial des 6
  valeurs inchangé depuis l'itération précédente, toujours à valider avec
  la cliente : « L'exigence comme point de départ », « L'Italie comme art
  de vivre, pas comme décor », « Un interlocuteur, jamais un standard »,
  « Le détail qui change tout », « La confiance avant la prestation »,
  « Chaque événement, une signature ».
- **Valeurs — 5ᵉ itération (2026-08-13) : typographie/photo agrandies,
  carrousel circulaire, transition zoom+flou, nouvelles photos** : quatre
  demandes distinctes sur la même section, toutes dans `engagements.html` /
  `style.css` / `main.js`.
  **Typographie et photo agrandies** ("prendre plus d'espace sur la
  page") : `.values-text .eyebrow` a son propre `font-size` (`clamp(1.7rem,
  3.4vw + 1rem, 3.2rem)`, plus grand que le `.eyebrow` générique du reste du
  site — scoping local, ne touche pas la règle de base) ; `.values-line`
  passe de `clamp(1.15rem,…,1.7rem)`/`clamp(1.5rem,…,2.2rem)` (base/actif) à
  `clamp(1.4rem,…,2.2rem)`/`clamp(2.2rem,…,3.8rem)` ; `.values-media`
  (`max-height`) passe de `min(60vh,32rem)` à `min(76vh,44rem)`. **Piège
  rencontré** : agrandir la police sans agrandir l'espacement vertical fait
  chevaucher les lignes prev/next (souvent sur 2 lignes à cette taille)
  avec la ligne active — `.values-window` est passée de `14rem`/`22rem` à
  `30rem` de hauteur et le `translateY` de prev/next de `±4.6rem`/`±6.6rem`
  à `±8.8rem` pour garder un espacement propre même quand active+prev/next
  sont tous les trois sur 2 lignes simultanément (pire cas observé en
  Playwright à 1600px de large). Si un chevauchement de lignes réapparaît
  après un futur agrandissement de police, recalculer cet écart plutôt que
  le réduire.
  **Centrage gauche/droite plutôt qu'alignement aux bords** : demande
  explicite de la cliente — le texte doit être centré *dans la moitié
  gauche* de l'écran, la photo centrée *dans la moitié droite*, pas calé
  contre le bord intérieur comme un layout formulaire classique.
  `.values-inner` est passée de colonnes asymétriques (`1.05fr 0.95fr`,
  texte aligné à gauche via `align-items:flex-start`) à deux colonnes
  strictement égales (`1fr 1fr`) avec `justify-items:center` sur le grid et
  `.values-text`/`.values-line` recentrés (`align-items:center;
  text-align:center` inconditionnel, plus de override desktop à gauche) ;
  `.values-media` passe de `justify-self:end` à `justify-self:center`. Le
  conteneur `.values-inner` est aussi élargi (`72rem` → `96rem` de
  `max-width`) pour laisser de la place aux éléments agrandis.
  **Carrousel rendu circulaire** ("il faut qu'on puisse accéder à la valeur
  1 et 6 aussi") : l'itération précédente bornait volontairement
  `activeIndex` à `[1, n-2]` pour garantir "toujours 3 lignes visibles dès
  l'entrée", ce qui excluait la 1re et la dernière valeur du rôle actif.
  Remplacé par un carrousel **bouclé** dans `updateValuesActive()`
  (`main.js`) : `activeIndex` parcourt tout `[0, n-1]`
  (`Math.min(n-1, Math.floor(progress*n))`), et `prevIndex`/`nextIndex` se
  calculent par modulo (`(activeIndex-1+n)%n` / `(activeIndex+1)%n`) — il y
  a donc toujours un prev/next valide même à `activeIndex=0` ou `n-1` (le
  prev de la 1re valeur est la dernière, le next de la dernière est la
  1re), satisfaisant à la fois "toujours 3 lignes" et "chaque valeur doit
  pouvoir devenir active". Vérifié par balayage de scroll Playwright :
  motif `AN...P` à l'entrée (valeur 1 active, valeur 6 en prev par
  bouclage) et `N...PA` à la sortie (valeur 6 active, valeur 1 en next par
  bouclage), jamais plus d'une ligne/photo active à la fois.
  **Transition photo : zoom+flou, pas un fondu plat** ("un effet plus
  original et dynamique") : `.values-media-photo` anime désormais `opacity`
  **+** `transform: scale(1.14) rotate(0.7deg)` **+**
  `filter: blur(14px) saturate(0.7)` vers l'état actif (`opacity:1;
  scale(1) rotate(0); blur(0) saturate(1)`), façon "point net progressif"
  façon mise au point d'objectif — plus dynamique qu'un simple fondu
  d'opacité (l'ancienne version) sans le risque de bug ci-dessous.
  **Piège réellement rencontré et écarté** : une première version utilisait
  un effet de "rideau" (`clip-path: inset()` animé sur le seul côté gauche,
  entrant ET sortant avec la même règle de base) — repéré en capturant un
  screenshot à mi-transition (Playwright, `waitForTimeout` court après un
  changement de scroll) : ça laissait un **trou visible** (fond navy nu)
  entre la zone déjà révélée par la photo entrante et la zone déjà
  rétractée par la photo sortante, les deux animant depuis/vers le même
  bord au lieu de bords complémentaires. Un `clip-path` à deux bords
  complémentaires aurait résolu le trou mais complique inutilement le CSS ;
  l'opacité (qui ne peut jamais laisser de trou, les deux calques couvrant
  toujours 100% du cadre) combinée au zoom+flou a été préférée, plus sûre
  pour un site sans build step/sans tests visuels automatisés. Si un
  `clip-path` réapparaît ici, vérifier d'abord l'absence de ce trou à
  mi-transition avant de le garder.
  **Nouvelles photos, aucune déjà affichée ailleurs sur le site** ("prend
  des photos pas encore présentes sur le site") : la recherche de nouvelles
  photos de banque (`mcp__stock-images__search_images`) s'est révélée
  non fonctionnelle dans cet environnement (0 provider configuré,
  résultats vides quelle que soit la requête) et l'accès direct aux CDN
  Pexels/Unsplash est bloqué par la politique réseau de l'environnement
  (`EGRESS_BLOCKED` sur `images.pexels.com`) — repli assumé et transparent
  auprès de la cliente : réutilisation de photos **déjà présentes dans
  `assets/img/` mais encore jamais affichées sur aucune page du site**
  (`CREDITS.md` les listait "non utilisée actuellement"), plutôt que de
  laisser la tâche bloquée ou de dupliquer des photos déjà visibles
  ailleurs (mosaïque, hero...). 6 photos choisies pour leur lien direct
  avec le sens de chaque valeur : `spritz-terrasse.jpg` (Wikimedia, exigence
  — cocktail soigné au geste précis), `piazza-evening-menaggio.jpg`
  (Wikimedia, art de vivre italien — rue authentique au crépuscule, non
  touristique), `spritz-duo-sicile.jpg` (Pexels, interlocuteur — moment
  partagé à deux), `terrasse-lanternes-soir.jpg` (Pexels, détail —
  lanternes en gros plan/bokeh), `alsace-vineyard.jpg` (Wikimedia, confiance
  — vignoble alsacien, métaphore du soin patient),
  `evenement-parasols-jaunes-table.jpg` (photo Simposio réelle, signature —
  garden party parasols rayés jaunes, jamais utilisée ailleurs sur le
  site). Les 3 photos Wikimedia exigent une attribution : un bloc
  `.photo-credits` a été ajouté au footer d'`engagements.html` (qui n'en
  avait aucun avant, n'utilisant jusque-là aucune photo Wikimedia) citant
  JIP, Hartmut Schmidt Heidelberg et Nicolas Torquet — voir
  `assets/img/CREDITS.md` pour le détail complet et l'historique. Si le
  choix des photos est revu, vérifier `CREDITS.md` avant d'en retirer une
  (mise à jour de la colonne "Utilisée sur" nécessaire) et retirer le
  crédit correspondant du footer si une photo Wikimedia n'est plus utilisée
  nulle part sur le site.
- **Valeurs — 6ᵉ itération (2026-08-13) : encore agrandi, centrage strict,
  lignes d'arrière-plan rapprochées de la taille active** : trois demandes
  supplémentaires sur la même section, en plus de l'ajout de
  `.page-header-full` documenté ci-dessus.
  **Tout encore agrandi** : `.values-text .eyebrow` repasse de
  `clamp(1.7rem,…,3.2rem)` à `clamp(2.1rem,…,4.2rem)` ; `.values-line`
  (base/actif) de `clamp(1.4rem,…,2.2rem)`/`clamp(2.2rem,…,3.8rem)` à
  `clamp(2.1rem,…,3.6rem)`/`clamp(2.4rem,…,4rem)` ; `.values-window` de
  `30rem` à `36rem` de hauteur, `translateY` prev/next de `±8.8rem` à
  `±10.4rem` — même piège de chevauchement que la fois précédente, revérifié
  au pire cas (3 lignes de large sur `L'Italie comme art de vivre, pas
  comme décor` en position prev/next) sans collision.
  **Centrage "pile au milieu"** : la cliente a précisé que les colonnes
  1fr/1fr de l'itération précédente ne donnaient pas un espacement
  symétrique — chaque bloc (texte, photo) était centré dans sa propre
  moitié de conteneur, donc l'espace entre le bord gauche de l'écran et le
  texte variait selon la longueur du texte, sans rapport garanti avec
  l'espace entre le texte et la photo. **`.values-inner` passe de
  `display:grid; grid-template-columns:1fr 1fr; justify-items:center` à
  `display:flex; justify-content:center`**, avec `.values-text`
  (`width:min(100%,40rem); flex:0 0 auto`) et `.values-media`
  (dimensionnée par `aspect-ratio` + `height` plutôt que `width:100%`,
  `flex:0 0 auto`) qui ne s'étirent plus pour remplir une colonne — les
  deux blocs se comportent comme une unité compacte centrée dans le
  conteneur, avec un `gap` fixe (`var(--space-6)`) entre eux. Résultat
  vérifié par mesure Playwright (`getBoundingClientRect`) : marge gauche et
  marge droite strictement égales (150,4px chacune à 1600px de large),
  quelle que soit la valeur affichée. Si `grid-template-columns:1fr 1fr`
  avec `justify-items:center` réapparaît ici, c'est l'ancienne version à
  largeurs de colonnes égales mais spacing non garanti — ne pas la
  réintroduire sans qu'on le redemande.
  **Lignes prev/next rapprochées de la taille active** ("juste légèrement
  moins grand que la taille de la police principale") : au-delà de
  l'agrandissement général ci-dessus, l'écart relatif entre actif et
  prev/next a aussi été réduit délibérément — le `scale()` appliqué aux
  lignes non actives passe de `0.84` à `0.92` (`.values-line`, transform de
  base, et `.is-prev`/`.is-next`), rapprochant la taille effective
  (`font-size × scale`) des lignes d'arrière-plan de celle de la ligne
  active (≈83% de la taille active en pire cas, contre ≈49% avant) tout en
  gardant `opacity:0.45` (déjà proche de l'ancien `0.4`) pour que la
  distinction actif/inactif reste lisible via l'opacité et le poids de
  police (`font-weight:700` actif vs `400` inactif) plutôt que via un écart
  de taille marqué.
- **Valeurs — 7ᵉ itération (2026-08-13) : eyebrow aligné sur "L'équipe",
  police des valeurs réduite, plus d'espace, arrière-plan re-réduit,
  carrousel non circulaire** : la cliente a testé le rendu réel de la 6ᵉ
  itération et signalé un chevauchement visible entre lignes (capture
  d'écran fournie, montrant une valeur active sur 3 lignes — « L'Italie
  comme art de vivre, pas comme décor » — touchant les lignes prev/next).
  **Cause identifiée** : le pire cas vérifié lors de la 6ᵉ itération ne
  testait que 2 lignes pour la ligne active ; à la taille alors en vigueur,
  cette valeur précise (la plus longue du jeu, 7 mots) passe en réalité sur
  **3 lignes** une fois active (police plus grande que prev/next), un cas
  non couvert par le test précédent — retenue : toujours tester le pire
  cas avec le texte réellement le plus long de la liste, pas seulement un
  nombre de lignes supposé.
  **Eyebrow "Nos valeurs" aligné sur "L'équipe"** : la règle locale
  `.values-text .eyebrow` (qui surchargeait la taille) a été supprimée —
  l'eyebrow hérite maintenant directement de la règle `.eyebrow` générique
  du site (`clamp(1.3rem, 2.6vw + 0.75rem, 2.375rem)`), identique à
  "L'équipe" (section Talents juste au-dessus, qui utilise aussi `.eyebrow`
  sans override). Si une règle `.values-text .eyebrow { font-size: … }`
  réapparaît ici, c'est une régression vers un eyebrow plus gros que le
  reste du site — à ne pas réintroduire sans qu'on le redemande.
  **Polices des valeurs réduites** : `.values-line` (base/actif) passe de
  `clamp(2.1rem,…,3.6rem)`/`clamp(2.4rem,…,4rem)` à
  `clamp(1.2rem,…,1.8rem)`/`clamp(1.7rem,…,2.6rem)` — nettement plus petit
  que la 6ᵉ itération, réglant le chevauchement à la racine (le pire cas à
  3 lignes tient maintenant confortablement).
  **Plus d'espace entre les valeurs** : `translateY` de `.is-prev`/`.is-next`
  passe de `±10.4rem` à `±11rem` — une augmentation modeste en valeur
  absolue, mais un espacement relatif bien plus généreux vu la police
  réduite (demande explicite de la cliente indépendante de la correction
  du chevauchement). `.values-window` réduite de `36rem` à `28rem` de
  hauteur (les textes plus petits n'ont plus besoin d'autant de place).
  **Arrière-plan re-réduit par rapport à l'actif** : la 6ᵉ itération avait
  rapproché la taille effective de prev/next de celle de l'actif (`scale`
  0.84→0.92, opacity 0.4→0.45) suite à une demande de la cliente. Cette
  7ᵉ itération **inverse partiellement** ce changement (nouvelle demande
  explicite, "réduit encore un peu la taille des valeurs en arrière-plan
  par rapport à la principale") : `scale` repasse de `0.92` à `0.82`,
  `opacity` de `0.45` à `0.4`. Ne pas remonter `scale` à 0.92 sans qu'on le
  redemande — deux demandes contradictoires successives sur ce curseur,
  la version actuelle (0.82) est la dernière en date.
  **Carrousel non circulaire** (`updateValuesActive()`, `main.js`) : la
  cliente a signalé ne pas pouvoir "mettre la valeur 1 et 6 en tant que
  principales" malgré le bouclage par modulo de la 5ᵉ itération (qui
  fonctionnait techniquement — vérifié par balayage Playwright à
  l'époque — mais montrait une valeur sans rapport thématique comme
  "précédente"/"suivante" à ces deux extrémités, probablement perçu comme
  un artefact plutôt qu'un vrai accès à la valeur). Remplacé par la version
  la plus simple : `prevIndex = activeIndex - 1` / `nextIndex =
  activeIndex + 1`, **sans** `% n` — la cliente a explicitement autorisé
  que la 1re valeur active n'ait pas de "précédente" visible et que la
  dernière n'ait pas de "suivante" visible ("règle ça même si à
  l'affichage il y a pas de valeur qui précède pour la 1 et de valeur qui
  succède pour la 6"). Vérifié par balayage Playwright : `activeIndex=0` →
  motif `AN....` (2 lignes seulement, pas de `.is-prev`) ; `activeIndex=5`
  → motif `....PA` (2 lignes seulement, pas de `.is-next`) ; toutes les
  valeurs intermédiaires gardent 3 lignes. Si un `(activeIndex ± 1 + n) % n`
  réapparaît ici, c'est l'ancienne version bouclée, à ne pas réintroduire
  sans qu'on le redemande.
- **Valeurs — 8ᵉ itération (2026-08-13) : fluidité du scroll, tailles
  ré-agrandies (×1,5), flèche d'incitation** : trois demandes distinctes.
  **Bug de fluidité identifié et corrigé** : la cliente a signalé des
  saccades pendant le scroll entre valeurs. Cause : `.values-line`
  animait `font-size` dans sa `transition` (en plus de `opacity` et
  `transform`) — `font-size` déclenche un recalcul de mise en page
  (reflow) à chaque frame de la transition, contrairement à
  `opacity`/`transform` qui sont compositées par le GPU sans reflow.
  Comme 6 lignes changent de classe à chaque scroll (et donc potentiellement
  de `font-size` simultanément), ces reflows répétés étaient la cause
  probable des saccades. **Corrigé en retirant `font-size` de la liste
  `transition`** : la taille change désormais instantanément (snap) au
  moment du changement de classe, pendant que `opacity`/`transform`
  continuent d'animer en douceur — le changement de taille n'est pas
  animé mais reste peu perceptible car simultané au fondu/déplacement.
  Si `font-size` réapparaît dans la `transition` de `.values-line`, revérifier
  la fluidité du scroll avant de la garder.
  **Tailles ré-agrandies (×1,5 des tailles précédentes)** : suite à la
  réduction de la 7ᵉ itération (qui corrigeait un chevauchement réel),
  la cliente a demandé de réagrandir, en proposant elle-même un facteur
  de départ ("essaye d'abord 1,5 fois plus grand"). `.values-line`
  (base/actif) passe de `clamp(1.2rem,…,1.8rem)`/`clamp(1.7rem,…,2.6rem)`
  à `clamp(1.8rem,…,2.7rem)`/`clamp(2.55rem,…,3.9rem)` (×1,5 exact sur
  les 3 valeurs du clamp). Pour ne pas réintroduire le chevauchement
  corrigé à la 7ᵉ itération, l'espacement a été ré-augmenté en proportion :
  `.values-window` de `28rem` à `38rem` de hauteur, `translateY` de
  `.is-prev`/`.is-next` de `±11rem` à `±13.5rem` — revérifié au pire cas
  (la valeur la plus longue passant sur 3 lignes en position active **et**
  sur 3 lignes en position prev/next, le double pire cas) via capture
  Playwright, aucun chevauchement à ces tailles. Si l'agrandissement doit
  être poussé encore plus loin, réappliquer la même méthode : agrandir
  proportionnellement l'espacement en même temps que la police, puis
  revérifier avec le texte le plus long du jeu de valeurs.
  **Flèche d'incitation au scroll** (`.values-scroll-hint`, coin bas-droit
  de `.values-sticky`) : petite flèche SVG fine, légèrement estompée, avec
  un léger rebond vertical en boucle — **retirée à la 9ᵉ itération**
  ci-dessous, remplacée par les indices "Faites défiler" en haut/bas du
  carrousel. Si `.values-scroll-hint` réapparaît dans un diff, c'est cette
  ancienne version à ne pas réintroduire sans qu'on le redemande.
- **Valeurs — 9ᵉ itération (2026-08-13) : indices "Faites défiler" aux deux
  bords, 2 lignes maximum par valeur** : trois demandes distinctes.
  **Indices "Faites défiler" comblant les vides** (`#valuesHintTop`/
  `#valuesHintBottom`, classe partagée `.values-edge-hint`, dans
  `engagements.html`/`style.css`) : la cliente a explicitement demandé de
  combler les vides visuels laissés par l'absence de `.is-prev` (avant la
  1re valeur) et `.is-next` (après la dernière) — voir 7ᵉ itération, qui
  avait accepté "seulement 2 lignes visibles à ces deux extrémités". Les 2
  nouveaux éléments occupent exactement le même emplacement que
  `.is-prev`/`.is-next` (mêmes `translateY(∓11rem)`), avec un texte
  "Faites défiler" fin (`font-family: var(--font-subtitle)`, `0.78rem`,
  `letter-spacing:0.1em`, majuscules) et une flèche SVG fine
  (`stroke-width:1.2`) qui rebondit doucement en boucle. **Directions
  opposées, demandé explicitement** : la flèche du haut (avant la 1re
  valeur) pointe vers le **bas** (`M12 4v15M6 13l6 6 6-6`), celle du bas
  (après la dernière) pointe vers le **haut** (`M12 20V5M6 11l6-6 6 6`) —
  les deux flèches "pointent vers" le carrousel, comme des marque-pages
  encadrant le contenu. Visibilité pilotée dans `updateValuesActive()`
  (`main.js`) via `.is-visible` : le haut s'affiche uniquement quand
  `activeIndex===0`, le bas uniquement quand `activeIndex===n-1` — jamais
  les deux en même temps, vérifié par balayage Playwright (24 pas).
  Remplace `.values-scroll-hint` (coin bas-droit, itération précédente),
  qui a été entièrement retirée du HTML et du CSS. **`.values-edge-hint`
  a lui-même été retiré à la 10ᵉ itération** ci-dessous — voir cette
  entrée avant de le réintroduire.
  **2 lignes maximum par valeur, active ou en arrière-plan** : la cliente a
  demandé que chaque valeur — quel que soit son état — tienne toujours sur
  2 lignes au plus, "donc adapte la police en conséquence". La 8ᵉ itération
  (agrandissement ×1,5) faisait déjà remonter la valeur la plus longue
  ("L'Italie comme art de vivre, pas comme décor", 7 mots) à 3-4 lignes
  selon la largeur — non conforme à cette nouvelle contrainte. **Piège
  méthodologique corrigé en cours de route** : mesurer le nombre de lignes
  via `element.getBoundingClientRect().height ÷ line-height` ne fonctionne
  **pas** sur `.values-line` car cet élément a `position:absolute;
  inset:0` — sa hauteur reflète toujours la hauteur du conteneur
  `.values-window` (28rem), pas la hauteur réelle du texte. Il faut passer
  par un `Range` sur le contenu (`range.selectNodeContents(el);
  range.getClientRects()`, puis compter les valeurs `top` distinctes) pour
  obtenir le vrai nombre de lignes visuelles — à réutiliser pour toute
  future vérification de nombre de lignes sur un élément `inset:0`.
  Une fois cette mesure fiable en place, calibrage empirique (script Node
  autonome balayant 320px à 1920px) : `.values-line` (base/actif) passe de
  `clamp(1.8rem,…,2.7rem)`/`clamp(2.55rem,…,3.9rem)` à
  `clamp(0.88rem, 2.4vw + 0.33rem, 1.8rem)`/`clamp(1.2rem, 3.4vw + 0.45rem,
  2.6rem)` — bornes **basses** très réduites (0.88rem/1.2rem) car à 320px
  de large la fenêtre de texte ne fait plus que ~280px, insuffisant pour 2
  lignes à une taille plus grande ; bornes hautes ramenées à ce qu'elles
  étaient en 7ᵉ itération (2.6rem/1.8rem, déjà vérifiées 2-lignes-max à
  l'époque). Espacement (`.values-window` 38rem→28rem,
  `translateY` prev/next `±13.5rem`→`±11rem`) ramené en proportion aux
  valeurs de la 7ᵉ itération. Si le clamp remonte au-delà de ces bornes
  hautes sans re-vérifier le pire cas à 320px avec la méthode `Range`
  ci-dessus, le risque de dépassement à 3 lignes sur mobile étroit
  réapparaît.
- **Valeurs — 10ᵉ itération (2026-08-13) : bandeau demi-écran, indices
  "Faites défiler" retirés** : la cliente a voulu essayer un format
  différent — "au lieu que le texte et les images soient affichés sur un
  écran entier, fait sur un demi-écran", en précisant explicitement ne pas
  vouloir changer le contenu, seulement rétrécir le format. **`.values-sticky`
  passe de `height:100vh` à `height:50vh`** (+ `min-height:20rem` en
  garde-fou sur les très petites hauteurs de viewport) — le mécanisme de
  pin (`.values`, `height:420vh`) est inchangé, seul le bandeau visible
  pendant le scroll est maintenant deux fois moins haut ; la moitié basse
  du viewport affiche simplement le fond navy uni pendant tout le scroll
  de la section (comportement normal d'un élément `position:sticky` plus
  petit que son wrapper).
  **Rétrécissement en cascade, mais pas partout de la même façon** :
  `.values-window` `28rem`→`15rem`, `translateY` prev/next `±11rem`→
  `±5.8rem`, `.values-media` `min(76vh,44rem)`→`min(38vh,22rem)` — ces
  valeurs ont été purement divisées par ~2 (la contrainte est verticale,
  proportionnelle à la réduction de hauteur du bandeau). **Piège évité** :
  un premier essai a aussi divisé par 2 les bornes **basses** (mobile) des
  `clamp()` de `.values-line`, ce qui donnait un texte illisible sur
  mobile (~10px actif, ~7px arrière-plan) — erreur de raisonnement, car la
  borne basse répond à une contrainte de **largeur** (tenir en 2 lignes à
  320px, cf. 9ᵉ itération), pas de hauteur ; elle n'avait donc aucune
  raison de rétrécir avec le passage en demi-écran. Corrigé en ne
  réduisant que la borne **haute** (desktop, contrainte par la hauteur
  disponible) et en gardant la borne basse proche de sa valeur lisible
  d'origine : `.values-line` (base/actif) devient
  `clamp(0.82rem, 0.8vw + 0.62rem, 1rem)`/`clamp(1.1rem, 1vw + 0.9rem,
  1.4rem)` — vérifié : la marge sur la contrainte 2-lignes-max est
  large à cette taille (la valeur la plus longue tient même sur 1 seule
  ligne sur tout l'intervalle 320px-1920px), donc aucun risque de
  régression en gardant la borne basse plus grande. Si un futur
  rétrécissement de `.values-sticky` est demandé, refaire ce
  raisonnement : ne réduire que ce qui répond à la contrainte de hauteur,
  pas systématiquement tout le clamp.
  **Indices "Faites défiler" retirés** (`.values-edge-hint`, 9ᵉ itération) :
  demande explicite ("enlève la flèche pour défiler en arrière plan"),
  interprétée comme le retrait complet du composant (texte + flèche), pas
  seulement l'icône seule — un texte "Faites défiler" sans flèche aurait
  semblé incomplet. Entièrement supprimé du HTML (`engagements.html`), du
  CSS (`.values-edge-hint*`, `@keyframes valuesEdgeHintBounce`) et du JS
  (`updateValuesActive()` ne référence plus `valuesHintTop`/
  `valuesHintBottom`). Si ces éléments réapparaissent dans un diff, ne pas
  les réintroduire sans qu'on le redemande.
- **Valeurs — 11ᵉ itération (2026-08-13) : retour à `100vh`, tailles
  poussées au maximum sans chevauchement** : la cliente a jugé le format
  demi-écran de la 10ᵉ itération raté — "enlève complètement la deuxième
  moitié où il y a rien" (le bas du viewport restait en fond navy vide
  pendant tout le scroll de la section, comportement normal d'un élément
  `position:sticky` deux fois plus petit que son wrapper, mais visuellement
  perçu comme un trou). Plutôt que de retirer le mécanisme de pin,
  **`.values-sticky` repasse à `height:100vh`** (comme avant la 10ᵉ
  itération) et le vide est comblé en agrandissant vraiment le contenu
  jusqu'à occuper l'espace ("agrandis au maximum... pour occuper l'espace"),
  au lieu de laisser un bandeau à moitié vide comme les itérations
  précédentes le faisaient parfois. `.values-window` repasse à `30rem`,
  `translateY` prev/next à `±11.5rem`, `.values-media` à
  `min(76vh, 44rem)` (tous doublés depuis la 10ᵉ itération, cohérent avec
  le retour à `100vh`).
  **Tailles poussées au maximum, calées au pixel près par script Node
  autonome** (pas par estimation) : pour chaque borne du `clamp()` de
  `.values-line.is-active`, un script a balayé des tailles en px et
  cherché la plus grande qui garde la valeur la plus longue ("L'Italie
  comme art de vivre, pas comme décor") sur 2 lignes maximum — séparément
  pour les largeurs étroites (320px : max sûr 19px) et les largeurs larges
  (1400-1920px, où le conteneur est plafonné par `max-width:44rem` donc la
  largeur du viewport au-delà n'aide plus : max sûr 54px). Résultat :
  `.values-line` (base/actif) = `clamp(0.85rem, 1.9vw + 0.55rem, 2.2rem)`/
  `clamp(1.1rem, 2.6vw + 0.6rem, 3.3rem)` (bornes hautes largement
  augmentées vs 9ᵉ itération, bornes basses quasiment inchangées).
  **Piège reproduit puis corrigé** : un premier essai a remonté à la fois
  la borne basse ET la borne haute du clamp actif (`clamp(1.8rem,…,3.4rem)`)
  en supposant qu'un simple doublement suffirait — repéré immédiatement
  par le balayage automatisé (`worstActive=4` lignes), qui a révélé que
  cette borne haute (3.4rem=54.4px) dépassait de peu le seuil réel de
  sécurité à 1600-1920px (54px), et que la borne basse remontée cassait la
  marge de sécurité à 320px. Toujours valider une borne de clamp par un
  balayage réel de largeurs, jamais par un facteur multiplicatif appliqué
  aveuglément aux deux bornes à la fois — leçon déjà tirée à la 10ᵉ
  itération (dans l'autre sens : bornes basses trop réduites), qui
  s'applique symétriquement en agrandissant.
- **Valeurs — 12ᵉ itération (2026-08-13) : bandeau à 3/4 d'écran, fond
  dynamique, retour des indices "Faites défiler"** : trois demandes sur la
  même section, la cliente ayant explicitement demandé de repartir du
  rendu de la 11ᵉ itération ("reprend exactement comment c'est là") plutôt
  que d'une nouvelle refonte.
  **`.values-sticky` passe de `100vh` à `75vh`** (3/4 de l'espace, au lieu
  de la moitié testée puis rejetée à la 10ᵉ itération). Contrairement à la
  10ᵉ itération, **le contenu n'a volontairement presque pas été réduit** —
  seul un ajustement mineur a été nécessaire pour éviter un léger
  débordement détecté par script (`.values-window` `30rem→27rem`,
  `.values-media` `min(76vh,44rem)→min(64vh,40rem)`), vérifié comme
  suffisant par un script Node comparant les bornes de `.values-inner` à
  celles de `.values-sticky` à 11 largeurs (320px-1920px) : plus aucun
  débordement, ~50-84px de marge selon la largeur. Les tailles de police
  (bornes du 11ᵉ itération) n'ont **pas** été touchées.
  **Fond dynamique** (`.values-sticky::before`, nouveau) : trois
  `radial-gradient` (lueur terracotta, lueur pourpre/rouge, halo navy plus
  sombre) superposés, fortement flambés (`blur(60px)`) et positionnés sur
  un `inset:-25%` généreux pour qu'aucun bord net ne soit visible pendant
  le mouvement, animés en boucle douce (`@keyframes valuesBgDrift`, 24s,
  `translate`+`scale` légers) — désactivé sous `prefers-reduced-motion`.
  Objectif explicite de la cliente : que le quart d'écran non occupé par
  le bandeau (`.values`, `height:420vh`, fond `--navy` uni en dessous du
  `.values-sticky` pendant le scroll) ne se lise plus comme un vide, sans
  revenir à un format 100vh. `.values-inner` passe en
  `position:relative; z-index:1` pour rester au-dessus de ce nouveau
  calque décoratif.
  **Indices "Faites défiler" réintroduits** : retirés à la 10ᵉ itération,
  la cliente les redemande explicitement ("Ajoute avant la 1ère valeur
  'Faites défiler' avec une petite flèche vers le bas et après la 6e
  valeur 'faites défiler' avec une petite flèche vers le haut") —
  implémentation identique à la 9ᵉ itération (`#valuesHintTop`/
  `#valuesHintBottom`, `.values-edge-hint`, visibilité pilotée par
  `activeIndex===0`/`activeIndex===n-1` dans `updateValuesActive()`),
  seul le `translateY` a été réaligné sur le décalage prev/next actuel
  (`±11.5rem`, inchangé depuis la 11ᵉ itération). Ce bloc `.values-edge-hint`
  est resté inchangé depuis, ne pas le retirer par réflexe si on le
  retrouve dans un diff.
- **Valeurs — 13ᵉ itération (2026-08-13) : fond "expérience" (photos
  floutées du carrousel), retour définitif à `100vh`** : la cliente a jugé
  que même avec le fond dynamique en dégradés de la 12ᵉ itération, le
  quart d'écran sous le bandeau `75vh` se lisait encore comme "où il n'y a
  rien" — au lieu de retoucher encore le dégradé, **`.values-sticky`
  repasse définitivement à `height:100vh`** (plus de zone non couverte du
  tout, quelle que soit la nature du fond) et `.values-window`/
  `.values-media` reviennent à leurs tailles de la 11ᵉ itération
  (`30rem`/`min(76vh,44rem)`, annulant le rabotage mineur de la 12ᵉ).
  **Fond remplacé par quelque chose "davantage sur l'expérience"** (demande
  explicite, plutôt que les lueurs abstraites de dégradés) : nouveau
  calque `.values-bg` (premier enfant de `.values-sticky`, derrière
  `.values-inner`) contenant 6 `<img class="values-bg-photo">` — **les
  mêmes fichiers, dans le même ordre, que `.values-media-photo`** (pas de
  nouvelles images) — en plein cadre, fortement flouté et assombri
  (`blur(55px) saturate(1.3) brightness(0.5)`), avec un léger zoom lent en
  boucle pendant qu'une photo est active (`@keyframes
  valuesBgPhotoDrift`, 16s, scale 1.15→1.3 + léger déplacement — désactivé
  sous `prefers-reduced-motion`) et un dégradé sombre par-dessus
  (`.values-bg::after`) pour garder le texte lisible. **Synchronisé sur le
  même `activeIndex`** que `.values-media-photo` (`updateValuesActive()`
  bascule `.is-active` sur les deux jeux d'images en même temps, via une
  nouvelle NodeList `valuesBgPhotos`) : quand une valeur devient active,
  tout l'écran se teinte de l'ambiance de sa photo (pas seulement la
  vignette de droite) — objectif explicite "à partir de ce qui est déjà
  fait pour les valeurs, créer quelque chose davantage sur l'expérience".
  Comme le fond couvre maintenant tout le viewport (retour à `100vh`), le
  souci de "zone vide" des itérations 10-12 disparaît structurellement,
  pas seulement visuellement. Si un fond en dégradés abstraits (`.values-sticky::before`
  avec des `radial-gradient`) réapparaît ici, c'est la version de la 12ᵉ
  itération, à ne pas réintroduire sans qu'on le redemande.
- **Valeurs — 14ᵉ itération (2026-08-17) : refonte complète en album
  filmique horizontal**, remplaçant entièrement le carrousel de texte
  "façon Deezer" des 13 itérations précédentes ci-dessus. Demande explicite
  de la cliente : "quelque chose de très original, immersif dans
  l'expérience client... une version améliorée plus visuelle". Le
  mécanisme texte (3 lignes empilées, `.values-line`/`.values-window`) est
  remplacé par 6 **scènes plein écran** qu'on traverse en glissant
  HORIZONTALEMENT au scroll — comme un album de voyage qu'on feuillette —
  plutôt qu'un JT défilant verticalement. Toutes les classes/variables de
  l'ancien carrousel (`.values`, `.values-sticky`, `.values-bg*`,
  `.values-inner`, `.values-text`, `.values-window`, `.values-line`,
  `.values-media*`, `.values-edge-hint*`, `updateValuesActive()`) ont été
  supprimées de `engagements.html`/`style.css`/`main.js` — si l'une d'elles
  réapparaît dans un diff, c'est cette ancienne version, à ne pas
  réintroduire sans qu'on le redemande.
  **Structure** : même principe d'épinglage que `.senses-journey`
  (long wrapper `.values-reel` de `500vh` + `.values-reel-sticky` en
  `position:sticky; height:100vh`), mais au lieu de dessiner un tracé SVG,
  le scroll pilote un `translateX` JS sur `.values-reel-track` (large de
  `600%`, 6 `.values-reel-scene` de `100%/6` chacune) — la bande glisse
  horizontalement devant la fenêtre `.values-reel-viewport`. Chaque scène :
  une photo plein cadre (`.values-reel-photo`, mêmes 6 fichiers que
  l'ancien carrousel : `spritz-terrasse.jpg`, `piazza-evening-menaggio.jpg`,
  `spritz-duo-sicile.jpg`, `terrasse-lanternes-soir.jpg`,
  `alsace-vineyard.jpg`, `evenement-parasols-jaunes-table.jpg` — mêmes
  crédits/licences déjà couverts, cf. `assets/img/CREDITS.md`, aucune
  photo neuve), un dégradé de lisibilité (`.values-reel-scrim`), et une
  légende (`.values-reel-caption`) avec un **tampon numéroté façon sceau de
  passeport** (`.values-reel-stamp`, cercle en pointillés terracotta,
  légèrement de travers, qui "atterrit" avec un léger rebond au moment où
  sa scène s'active) au-dessus du titre de la valeur — le motif "tampon de
  voyage" fait écho à l'identité Dolce Vita/carnet de voyage de la marque,
  plus original qu'une simple pastille numérotée. Zoom Ken Burns lent
  (`@keyframes valuesReelKenBurns`, 9s, `scale(1.12)→scale(1)`, une seule
  fois par activation via `forwards`, pas `infinite` — jamais l'effet
  "gif qui boucle"). 6 points de navigation (`.values-reel-dot`) en bas de
  section, cliquables pour sauter directement à une valeur
  (`window.scrollTo` vers la position de scroll correspondante dans le
  wrapper épinglé), plus un indice "Faites défiler →" horizontal
  (`#valuesReelHint`) visible uniquement tout au début (`progress < 0.03`).
  **Sous `prefers-reduced-motion`** : le `translateX` reste actif (mapping
  1:1 avec la position de scroll, pas une animation autoplay — même
  raisonnement que le tracé SVG des 5 sens, qui reste lui aussi actif sous
  cette préférence) ; seuls le zoom Ken Burns et le rebond de la flèche
  sont coupés en CSS.
  **Trois bugs réels rencontrés et corrigés pendant la construction**
  (aucun n'était visible dans le code lui-même, tous trouvés par capture
  d'écran/mesure automatisée à chaque étape du scroll plutôt que supposés
  corrects après un seul coup d'œil) :
  1. *Photos manquantes en plein milieu du scroll* — 5 des 6 `<img>`
     avaient `loading="lazy"`, mais dans ce layout elles sont TOUJOURS très
     loin du viewport en position de mise en page réelle (jusqu'à -9700px,
     puisque `.values-reel-track` fait 600% de large et que c'est un
     `transform` JS, pas un vrai scroll, qui les ramène à l'écran) — le
     lazy-loading natif du navigateur ne "voit" jamais qu'elles sont sur le
     point d'apparaître et ne les charge donc jamais. Corrigé en retirant
     `loading="lazy"` sur ces 6 images (seulement 6, chargement anticipé
     acceptable pour une section de toute façon accessible qu'après scroll).
     Piège à surveiller pour tout futur carrousel/bande transformée en JS :
     `loading="lazy"` et positionnement par `transform` (plutôt que par
     scroll réel) ne font pas bon ménage.
  2. *Toute la bande partait hors champ dès qu'on scrollait* — le
     `translateX` était posé en pourcentage
     (`translateX(-progress×(n-1)×100%)`), mais un `%` dans `translateX()`
     se calcule par rapport à la boîte de l'ÉLÉMENT LUI-MÊME (`.values-reel-track`,
     large de 600%), pas par rapport au viewport — un bug de unités classique
     et facile à ne pas voir en relisant juste le code. Résultat : à
     `progress≈0.2` déjà, chaque scène se retrouvait hors du viewport (vérifié
     via un dump des `getBoundingClientRect()` de chaque scène, aucune
     n'avait `left≈0`). Corrigé en mesurant la largeur réelle en pixels de
     `.values-reel-viewport` et en posant un `translateX` en `px`, recalculé
     au `resize`. Si un `translateX` en `%` réapparaît ici, revérifier ce
     calcul avant de le garder.
  3. *Le tampon numéroté chevauchait le titre sur la valeur la plus longue*
     ("L'Italie comme art de vivre, pas comme décor", 3 lignes à cette
     taille de police) — le tampon et le titre étaient chacun positionnés
     indépendamment en `bottom:` fixe, une distance calée pour un titre de
     1-2 lignes ; le titre à 3 lignes grandissait vers le haut et traversait
     le tampon (repéré par capture d'écran, pas supposé). Corrigé en
     regroupant tampon + titre dans un seul conteneur en flux normal
     (`.values-reel-caption`, `flex-direction:column; gap:`) au lieu de
     deux éléments en `position:absolute` synchronisés à la main — le
     tampon se retrouve alors TOUJOURS directement au-dessus du titre, quel
     que soit son nombre de lignes, sans calcul à maintenir. Vérifié sur
     les 6 valeurs, y compris la plus longue.
- **Valeurs — 15ᵉ itération (2026-08-17) : fluidité corrigée, points
  remplacés par une frise chronologique** : deux demandes de la cliente sur
  l'album filmique de la 14ᵉ itération ("fluidifie cette partie... il y a
  2-3 bugs ou freeze" + "pense-la un peu comme une frise... sur laquelle on
  peut se déplacer en tournant les valeurs... que ça soit passé comme une
  seule et unique image... un liant" entre une valeur et la suivante).
  **Cause du "freeze" trouvée et corrigée** : `.values-reel-photo` mélangeait
  une `transition: transform` (sur la règle de base) ET une `animation:
  valuesReelKenBurns ... forwards` (sur `.is-active`), toutes deux ciblant
  `transform`. Scroller en avant-arrière autour d'une limite de scène — un
  geste tout à fait normal au trackpad, pas un cas limite — fait
  basculer `.is-active` on/off rapidement ; à chaque bascule soit
  l'animation redémarrait de zéro, soit la transition tentait de "dérouler"
  vers un état que l'animation était encore en train d'animer, les deux se
  disputant la propriété en même temps — perçu comme des saccades/blocages
  ponctuels pendant le scroll. **Corrigé en remplaçant le mécanisme par une
  seule `transition`** (plus de `@keyframes`/`animation`) : la règle de
  base porte `transform:scale(1.12); transition:transform 0.6s` et
  `.is-active` porte `transform:scale(1); transition:transform 9s linear`
  — en entrant dans une scène, la transition qui s'applique est celle de la
  règle `.is-active` (9s, zoom lent) ; en sortant, c'est celle de la règle
  de base (0.6s, retour plus rapide) qui prend le relais. Une seule
  transition ne peut pas se battre avec elle-même, quel que soit le rythme
  du scroll. Vérifié par un test de stress Playwright (40 allers-retours de
  scroll instantanés autour d'une limite de scène, ~9ms/mise à jour) :
  aucune erreur, aucune valeur de `transform` aberrante (NaN, bloquée hors
  plage), toujours une valeur `matrix(...)` cohérente. `will-change:
  transform` ajouté sur `.values-reel-photo` pour garder l'opération sur le
  compositeur GPU tout du long.
  **Points remplacés par une frise (`.values-reel-timeline`)** : les 6
  `.values-reel-dot` (simples puces sans lien visuel entre elles) sont
  remplacés par 6 `.values-reel-marker` (cercles numérotés 1-6) reliés par
  un trait (`.values-reel-timeline-track`) avec un remplissage
  (`.values-reel-timeline-fill`) qui grandit **en continu avec le scroll
  réel** (`progress×100%` à chaque frame dans `updateValuesReel()`), pas
  seulement par à-coups à chaque changement de valeur active — c'est ce qui
  lui donne un rendu de "fil continu" plutôt que 6 puces indépendantes qui
  s'allument une par une. **C'est directement la réponse à la demande de
  "liant" entre une valeur et la suivante** : la frise vit dans
  `.values-reel-footer`, un enfant flex normal de `.values-reel-sticky` et
  PAS un enfant de `.values-reel-track` (qui, lui, glisse horizontalement
  sous les photos) — elle ne bouge donc jamais pendant que les photos
  défilent derrière/au-dessus d'elle, elle est le seul élément qui reste
  identique à l'écran de la valeur A et à l'écran de la valeur B, avec son
  remplissage qui continue simplement de grandir entre les deux. Chaque
  marqueur passe par 3 états : `.is-reached` (déjà dépassé, contour
  terracotta) via `i <= activeIndex` — même logique directe basée sur
  `progress`/`activeIndex` que la correction du compteur des 5 sens
  documentée plus haut, pour ne jamais se désynchroniser sur un scroll
  rapide — et `.is-active` (valeur courante, rempli, agrandi via un
  `transform:scale(1.3)` avec une courbe `cubic-bezier` à rebond, l'effet
  d'apparition demandé "à chaque fois qu'on arrive à la valeur suivante").
  **Deux façons de "tourner les valeurs"** (`main.js`) :
  1. Cliquer/taper directement un marqueur → saut net et fluide
     (`window.scrollTo(..., behavior:"smooth")`) vers cette valeur
     précisément, comme les anciens points.
  2. Cliquer-glisser n'importe où ailleurs sur la frise → défilement continu
     façon molette/cadran : `pointerdown`/`pointermove`/`pointerup` sur
     `.values-reel-timeline`, position du curseur convertie en fraction de
     progression, `window.scrollTo(..., behavior:"auto")` (jamais "smooth"
     pendant un glissement, sinon le défilement accuserait un temps de
     retard sur le doigt/curseur). `setPointerCapture` au `pointerdown`
     pour que le glissement continue de fonctionner même si le curseur
     sort brièvement de la frise (barre fine, facile à dévier en
     glissant vite). `touch-action:none` sur la frise pour que le geste
     tactile lui soit entièrement dédié plutôt que de déclencher un scroll
     de page natif conflictuel.
  Comme pour le tracé SVG des 5 sens, tout ceci reste un mapping direct
  1:1 avec la position de scroll (pas une animation autoplay), donc actif
  aussi sous `prefers-reduced-motion` ; la règle
  `@media(prefers-reduced-motion:reduce)` dédiée à cette section a pu être
  simplifiée (elle ne coupe plus que le rebond de la flèche "Faites
  défiler") car la règle globale du site (`transition-duration:0.01ms
  !important` sur tous les éléments) neutralise déjà la transition du zoom
  Ken Burns ci-dessus sans avoir besoin d'une règle spécifique. Si
  `.values-reel-dots`/`.values-reel-dot` réapparaissent dans un diff, c'est
  cette ancienne version à ne pas réintroduire sans qu'on le redemande.
- **Valeurs — 16ᵉ itération (2026-08-17) : fil "liant" entre les valeurs,
  défilement raccourci** : la cliente a validé la frise de la 15ᵉ itération
  mais a précisé qu'il manquait encore l'effet de "lien continu" demandé
  dès la 14ᵉ itération, en citant explicitement la frise de la page
  Héritage de Louis Vuitton comme référence — quelque chose de présent sur
  la photo A qui reste présent, de façon continue (pas juste "réapparaît"),
  sur la photo B. Deux changements distincts.
  **Fil filant (`.values-reel-thread`)** : un nouvel élément entre la
  photo et la frise du bas — pas dessus la photo (une ligne plein cadre
  aurait traversé des sujets très différents d'une photo à l'autre : un
  verre en gros plan, un horizon, une lanterne... sans garantie de rester
  élégante partout) — composé d'un trait pointillé fixe
  (`.values-reel-thread-line`), d'un remplissage terracotta qui grandit en
  continu avec le scroll réel (`.values-reel-thread-fill`, même `progress`
  que la frise, mise à jour dans la même fonction `updateValuesReel()`) et
  d'un point lumineux qui **se déplace** le long du trait
  (`.values-reel-thread-marker`, `left: progress*100%`, `box-shadow` en
  double halo pour un effet de lueur). **C'est la réponse directe à la
  demande de la cliente** : ce n'est ni dans `.values-reel-track` (qui
  glisse horizontalement sous les photos) ni recréé à chaque scène — c'est
  un unique élément, enfant normal de `.values-reel-sticky` au même titre
  que `.values-reel-footer`, donc jamais retiré/recréé ni déplacé pendant
  tout le scroll : ce qu'on voit sur l'écran de la valeur A (le trait, son
  remplissage, le point) est très exactement ce qu'on continue de voir,
  simplement un peu plus avancé, sur l'écran de la valeur B — un vrai fil
  continu, pas un élément qui disparaît et réapparaît. Reprend le
  vocabulaire visuel déjà présent (pointillés du tampon passeport, lueur
  terracotta de la frise) pour que le bandeau du bas se lise comme un seul
  système plutôt que deux widgets indépendants.
  **Défilement raccourci** : `.values-reel` passe de `height:500vh` à
  `height:260vh` (~52% de la hauteur précédente, donc environ deux fois
  moins de scroll nécessaire pour passer d'une valeur à la suivante) —
  demande explicite de la cliente ("on est obligé de scroll beaucoup trop
  longtemps"). Le zoom Ken Burns (durée fixe de 9s en temps réel, pas liée
  à la distance de scroll) continue de tourner sans accroc à ce nouveau
  rythme, vérifié par le même test de résistance que la 15ᵉ itération (40
  allers-retours de scroll instantanés) : toujours aucune erreur, aucune
  valeur de transform aberrante.
- **Page "Engagements" renommée "À propos" (2026-08-13)** : demande
  explicite de la cliente suite à l'ajout de la section Valeurs, qui donne à
  cette page un vrai profil "à propos" (engagements + valeurs + équipe). Le
  fichier reste `engagements.html` (aucun lien interne cassé) — seul le
  libellé visible change : l'eyebrow en haut de page, le `<title>`, et le
  lien de navigation dans le header/menu mobile/footer sur **les 6 pages**
  (balisage dupliqué, cf. note en tête de fichier). Si `>Engagements<`
  réapparaît comme libellé de nav dans un diff, c'est l'ancien nom à ne pas
  réintroduire sans qu'on le redemande.
- **Titre Engagements — allers-retours sur le forçage à 3 lignes
  (2026-08-13)** : trois versions successives.
  1. Version initiale : forcé sur 3 lignes via 2 `<br>` manuels + classe
     dédiée `.title-force-3-lines` (`clamp()` plus petit et plafonné, sans
     `max-width`).
  2. La cliente a demandé « les mêmes tailles de police que la première
     partie de la page Univers » → `.title-force-3-lines` retirée, `<br>`
     manuels retirés, texte continu wrappé naturellement par le `clamp()`
     standard des `h1` (`3.4rem`→`8.8rem`) + `max-width:46rem`, exactement
     comme `univers.html`. **Vérifié avant d'appliquer** : à cette taille,
     le titre wrappe sur 4-5 lignes selon la largeur — le même ordre de
     grandeur que le titre d'`univers.html` (3-4 lignes, texte différent),
     donc cohérent avec le comportement déjà en prod sur cette page-là.
  3. La cliente a ensuite précisé vouloir la même taille de police **ET**
     exactement 3 lignes, sans changer la taille ni « le reste de la
     page ». **`.title-3-lines-same-size`** (nouvelle classe, `style.css`,
     à ne pas confondre avec `.title-force-3-lines` qui change aussi la
     taille) retire uniquement `max-width` — le `font-size` reste hérité
     de la règle `h1` standard, inchangé. Les 2 `<br>` manuels sont
     remis dans le HTML (« Un partenaire, » / « pas un prestataire » /
     « de plus »). **Limite physique vérifiée et assumée** : à cette
     taille de police (jusqu'à 8.8rem), retirer `max-width` suffit à tenir
     3 lignes sur la plage **1024px–1600px** (la plus probable pour la
     cliente, testé via Playwright), mais pas au-delà : sous ~1000px de
     large l'écran est physiquement trop étroit pour que le segment « pas
     un prestataire » (le plus long) tienne sur une seule ligne à cette
     taille de police (4-5 lignes), et au-delà de ~1920px le `max-width:
     1320px` du `.container` sitewide (« le reste de la page », volontairement
     non modifié) plafonne la largeur disponible pendant que le `clamp()`
     du `h1` continue de grandir jusqu'à 1920px, donc 4 lignes au-delà.
     Aucune des deux contraintes n'est contournable sans toucher au
     `font-size` ou à la largeur du site — les deux étant explicitement
     exclus par la cliente. Si la précision à ces largeurs extrêmes
     s'avère importante, il faudra la retrouver et arbitrer avec elle.
  La classe `.title-force-3-lines` (`clamp()` réduit) reste présente dans
  `style.css` mais n'est plus appliquée nulle part — disponible si un futur
  titre a besoin d'un nombre de lignes forcé ET d'une taille réduite ; ne
  pas la réintroduire sur ce titre-ci sans qu'on le redemande.
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
  sur `contact.html`, `univers.html` et, depuis le 2026-08-13,
  `engagements.html`) : force le bandeau titre à occuper `100vh`/`100svh`
  avec contenu centré verticalement, pour que le titre remplisse tout
  l'écran avant que la section suivante (formulaire, parcours des 5 sens,
  lignes d'engagement) n'apparaisse au scroll. Ajouté à `engagements.html`
  à la demande explicite de la cliente, qui voulait que le titre « Un
  partenaire, pas un prestataire de plus » (fond calcaire) apparaisse en
  plein écran comme le fait déjà le titre d'`univers.html` — simple ajout
  de la classe au départ. Peu après, la cliente a aussi demandé que ce
  titre partage les **mêmes tailles de police** que celui d'`univers.html`
  (voir bullet dédié ci-dessus : `.title-force-3-lines` a depuis été retiré
  de ce `<h1>`). `.page-header` seul (sans ce modificateur, sur les
  3 autres pages : index, prestations, projets) reste une bande compacte
  dimensionnée par son contenu — ne pas l'ajouter ailleurs sans que ce soit
  demandé.
  **Note de contexte (2026-08-12)** : une session locale (app Claude Code)
  avait en parallèle construit une version alternative de Contact tenant
  entièrement sur un seul écran sans scroll (`.page-header--compact` +
  `.contact-page { height:100dvh }`) — la cliente a tranché en faveur de la
  version plein-écran-puis-scroll ci-dessus. Si `.page-header--compact`
  réapparaît dans un diff, c'est cette ancienne piste non retenue.
- Mosaïque (page Projets) : CSS Grid avec `grid-auto-flow: dense` pour éviter
  tout trou d'affichage — ne jamais réintroduire de `transform: translateY`
  décoratif sur les items, ça casse l'alignement de la grille (bug corrigé).
  `#mosaicViewport`/`.mosaic-viewport` dimensionne le nombre de lignes
  visibles (`buildMosaicGrid()` dans `main.js` calcule `grid.rows` à partir
  de la hauteur réelle du conteneur ÷ `TILE`, pas d'un nombre de lignes en
  dur) — pour agrandir la mosaïque, on augmente donc la `height` CSS du
  viewport, pas une valeur JS. Agrandie de 2 lignes de tuiles à la demande
  de la cliente (2026-08-13) : `height: min(calc(78vh + 480px), 1240px)`
  desktop (+480px = 2 lignes à `TILE=240px`), `min(calc(78vh + 260px),
  1020px)` sous 640px (+260px = 2 lignes à `TILE=130px`, le breakpoint
  mobile de `TILE` dans `main.js`) — garder ces deux valeurs synchronisées
  si `TILE` est retouché.
- **Page Contact — refonte du 2026-08-13** (`contact.html`), demandée par la
  cliente à partir d'une maquette Canva basse-fidélité (annotations
  structurelles, pas un design pixel-exact) : la page suit maintenant un
  flux linéaire de 5 sections, alternant les fonds (calcaire → terracotta →
  calcaire-dim → navy) plutôt que de rester en deux colonnes. **Remplace
  entièrement** l'ancienne structure `.contact-hero`/`.contact-hero-grid`
  deux-colonnes (photo de fond + panneau formulaire) documentée
  précédemment ici — si `.contact-hero-grid`/`.contact-hero-info`/
  `.contact-hero-photo`/`.contact-steps`/`.step-num` réapparaissent dans un
  diff, c'est cette ancienne version, à ne pas réintroduire sans qu'on le
  redemande.
  1. `.page-header.page-header-full` (titre plein écran, inchangé) : eyebrow/h1/lede
     puis une ligne `.page-header-location` (pin + « Basée en Alsace, France »).
  2. `.contact-band` — bandeau plein-largeur fond terracotta juste sous le
     titre, ne contenant **plus que** les trois façons de contacter Simposio
     (« Nous écrire » / « Nous appeler » / « Réseaux sociaux »). **Le nom de
     marque et le placeholder logo (`.contact-band-brand`/`.contact-band-logo`/
     `.contact-band-name`/`.contact-band-dot`) ont été entièrement retirés**
     à la demande explicite de la cliente (2026-08-13, « enlève le nom de la
     marque... pour ne laisser que les autres informations ») — si ces
     classes réapparaissent dans un diff, ne pas les réintroduire sans que ce
     soit redemandé. `.contact-band-methods` est directement l'unique
     contenu de `.contact-band-inner`, en flex `justify-content:
     space-between; width: 100%` pour que les 3 méthodes s'étirent toujours
     d'un bord à l'autre du bandeau, quelle que soit la largeur d'écran —
     ceci corrige un vrai bug rencontré avant le retrait de la marque
     (`.contact-band-inner` en simple `flex-wrap` avec deux enfants
     — marque + méthodes — qui, dès qu'ils passaient sur deux lignes
     séparées, laissaient `.contact-band-methods` hériter d'un
     `justify-content: flex-start` et coller les 3 méthodes à gauche avec un
     grand vide à droite, signalé par la cliente via capture d'écran).
     Les labels des méthodes (`.contact-band-method-label`) ont été **doublés
     à la demande explicite de la cliente** (« double au moins les titres »,
     avec une image de référence montrant des labels bold/imposants) :
     `font-size: 2.3rem` desktop (`1.6rem` sous 700px), `font-weight: 700`.
     **Piège de dégagement du header fixe** : `.contact-band-inner` utilise
     `padding-block: 6.5rem var(--space-4)` — le `6.5rem` en haut n'est pas
     arbitraire, c'est la même constante que `.page-header` utilise pour
     dégager le `.site-header` fixe (~91px de haut, glass/backdrop-blur).
     Avant ce correctif le padding-top était plus petit (`var(--space-4)`,
     hérité d'un ancien padding symétrique) : ça passait quand la marque
     (plus haute, avec le cercle logo) occupait la première ligne du
     bandeau, mais une fois la marque retirée, les labels — désormais
     doublés — sont devenus la première ligne et se retrouvaient
     partiellement masqués sous le header dès que le bandeau est scrollé
     jusqu'en haut de l'écran (bug réel rencontré et corrigé). Si ce padding
     est retouché, vérifier que le haut des labels reste visible quand la
     section est scrollée pile au ras du haut du viewport (pas seulement en
     l'observant après un scroll généreux). Chaque `.contact-band-method`
     affiche un `.contact-band-icon` **et** une valeur texte
     (`.contact-band-method-value`), pas juste une icône seule.
     **Coordonnées actuellement provisoires/fictives** (demandé
     explicitement par la cliente pour prévisualiser la densité visuelle
     réelle, cf. commentaire `TODO` juste au-dessus de `.contact-band-methods`
     dans `contact.html`) : email `contact@simposio.fr` (lien `mailto:`),
     téléphone `03 88 00 00 00` (lien `tel:`), comptes réseaux sociaux
     `@simposio.events` / `Simposio` sous les icônes Instagram/LinkedIn
     (markup dérivé de `.nav-social`) — **à remplacer par les vraies avant
     mise en ligne**. **Apparition de bas en haut** : `.contact-band-methods`
     porte `data-reveal-group` (les 3 blocs "Nous écrire"/"Nous appeler"/
     "Réseaux sociaux" sont ses 3 enfants directs) — réutilise le système
     déjà en place (`[data-reveal-group].is-visible > *`, `main.js` : IIFE
     unique qui observe `[data-reveal], [data-reveal-group]` et ajoute
     `.is-visible` une fois via IntersectionObserver) plutôt que d'inventer
     une nouvelle animation : chaque titre glisse de `translateY(20px)`
     (donc du bas) vers sa position finale en fondu, avec un décalage
     échelonné (0/80/160ms) entre les trois. Ne pas dupliquer ce mécanisme
     avec du CSS ad hoc si d'autres titres du bandeau doivent un jour
     recevoir le même traitement — ajouter `data-reveal-group` au bon
     conteneur parent suffit.
  3. `.contact-devis` (fond `--bg-dim`) — **deux colonnes** sur desktop
     (`.contact-devis-inner`, `grid-template-columns: 0.85fr 1.15fr`,
     **`align-items: start`** à partir de 960px — pas `center` : la cliente
     a explicitement demandé que le texte de gauche commence à la même
     hauteur que le haut de la carte formulaire, pas qu'il soit centré
     verticalement par rapport à elle — empilé en une colonne en dessous)
     reproduisant la maquette Canva de la cliente (texte à gauche, carte
     formulaire à droite — **pas centré**, correction explicite après un
     premier essai en colonne unique centrée qui ne respectait pas la
     maquette) :
     - `.contact-devis-text` (gauche) : eyebrow/h2/lede alignés à gauche
       (repris de l'ancien `.contact-hero-info-content`), puis
       `.contact-founder-strip` (pastille compacte avatar "EL"
       `.contact-founder-avatar` + citation, variante claire de l'ancien
       `.contact-founder` qui était stylée pour fond sombre).
     - `.contact-devis-form` (droite) : `.form-card.form-card-premium` — fond
       **bleu Méditerranéen** (`linear-gradient(200deg, var(--navy) 0%,
       var(--navy-900) 100%)`, demandé explicitement par la cliente à la
       place du blanc initial), avec tous les textes/bordures adaptés pour
       rester lisibles sur fond sombre (`.form-card-premium .field label`,
       `.form-group-label`, `.form-note`, `.form-success`, etc. — voir le
       bloc CSS dédié). **Piège de spécificité CSS** : le sélecteur doit
       être le composé `.form-card.form-card-premium` et pas seulement
       `.form-card-premium` seul, sinon la règle `.form-card` de base
       (définie plus bas dans le fichier, même spécificité, background
       blanc) gagne la cascade par ordre de source et écrase le fond navy —
       bug réel rencontré et corrigé, à surveiller si ce bloc est retouché.
       Le `#leadForm` interne est inchangé (ids/names de champs,
       `.service-picker`). L'ancien `.contact-steps` (timeline 3 étapes) a
       été retiré et son contenu absorbé dans la 1ʳᵉ question de la FAQ
       ci-dessous plutôt que dupliqué.
     **Champ date** (`#eventDate`) : `type="text"` avec placeholder
     `JJ/MM/AAAA`, **pas** `type="date"` — un `<input type="date">` a été
     essayé mais son surlignage interne du segment actif (jour/mois/année)
     reste bleu natif du navigateur (Chromium/Safari) quel que soit ce qui
     est tenté en CSS (`accent-color`, `color-scheme` n'ont aucun effet sur
     ce surlignage précis, seulement sur les cases à cocher/curseurs) —
     limitation navigateur non contournable sans un composant JS de
     date-picker custom, hors scope pour un champ optionnel sur un site
     sans build step. Ne pas revenir à `type="date"` ici sans construire un
     picker maison.
  4. `.contact-scroll-cta` — bouton flèche-vers-le-bas (rebond CSS
     `@keyframes contact-scroll-bounce`, désactivé si
     `prefers-reduced-motion`) sous la carte formulaire, ancre vers `#faq`.
  5. `.contact-faq` (fond `--navy-900`) — accordéon FAQ en **`<details>`/
     `<summary>` natifs** (pas de JS requis, cohérent avec le reste du site
     qui n'ajoute du JS que quand c'est nécessaire) ; `.faq-item-icon` est un
     rond avec un `+` en `::before`/`::after` qui pivote à 45° (devient un
     `×`) via `.faq-item[open]`.
  Important si le formulaire est retouché : `main.js` pré-remplit le type
  de prestation depuis le paramètre d'URL `?service=` via
  `document.querySelectorAll('input[name="serviceType"]')` (et non plus
  `getElementById("serviceType")`) — garder ce sélecteur cohérent avec le
  balisage radio si la structure change.
- **Bandeau Contact — photo de fond « dolce vita » (2026-08-14)**
  (`.contact-band`, `contact.html`) : demande explicite de la cliente
  (« met une photo en rapport avec la dolce vita qui prend la place de tout
  le fond terracotta ») — le fond terracotta uni du bandeau des 3 méthodes
  de contact est remplacé par une photo plein cadre. Photo choisie :
  `evenement-fiat500-creme-mur-pierre.jpg` (Fiat 500 vintage crème devant un
  mur en pierre et des branches d'olivier), déjà utilisée en photo Simposio
  réelle sur l'accueil (hero) et la mosaïque Projets — aucun nouveau crédit
  requis (cf. `assets/img/CREDITS.md`, colonne « Utilisée sur » mise à
  jour). Choisie pour son identité « dolce vita » immédiatement lisible
  (voiture italienne d'époque, pierre chaude, cadrage paysage adapté à un
  bandeau large) plutôt qu'une nouvelle recherche de photo — recherche de
  banque d'images non fonctionnelle dans cet environnement (cf. section
  Photos ci-dessus, même limitation déjà rencontrée pour les valeurs
  d'Engagements). **Structure** : `<img class="contact-band-photo">` en
  premier enfant de `.contact-band` (`position:absolute; inset:0;
  object-fit:cover; z-index:0`), puis `.contact-band-scrim` (dégradé
  terracotta semi-transparent, `z-index:1`) par-dessus pour garder
  l'identité de couleur de marque et la lisibilité du texte crème sur une
  photo par nature plus chargée visuellement qu'un fond uni, puis
  `.contact-band-inner` repassé en `position:relative; z-index:2` pour
  rester au-dessus des deux calques. `.contact-band` reçoit
  `position:relative; overflow:hidden` (le fond terracotta uni reste
  déclaré comme base/fallback, désormais entièrement recouvert). Vérifié
  par capture Playwright desktop (1600px) et mobile (390px) : photo visible
  sur toute la largeur/hauteur du bandeau, texte et icônes des 3 méthodes
  parfaitement lisibles, aucun débordement horizontal, aucune régression
  sur la mise en page à 3 colonnes.
- **Titres forcés sur un nombre de lignes précis (2026-08-17)** : demande de
  la cliente sur 4 titres à la fois — forcer un nombre de lignes exact
  ("sans rien changer d'autre... ni la taille de la police") pour le hero
  d'`index.html` (3 lignes), le titre "Quatre mondes, une même Dolce Vita"
  d'`index.html` (2 lignes), le titre "Racontez-nous votre projet" de
  `contact.html` (2 lignes) et retirer « — même en vrac » du titre "Dites-nous
  où vous en êtes" de `contact.html` (qui devait aussi passer à 2 lignes).
  **Méthode** : simple découpage du texte par `<br>` manuels à des points de
  césure naturels (comme pour le titre d'`engagements.html` documenté
  plus haut), MAIS chaque titre ici a un `clamp()` de police bien plus large
  que celui d'`engagements.html`, donc un découpage manuel à 2-3 mots ne
  suffit pas partout : un même groupe de mots peut tenir sur une ligne à
  certaines largeurs d'écran et déborder à d'autres (la police grandit avec
  le viewport, le conteneur non). **Validé par script Playwright** balayant
  tout le jeu de découpages possibles (partitions du texte en N groupes
  contigus) à plusieurs largeurs (360 à 1920px), mesurant le nombre de
  lignes réel via la technique `Range.selectNodeContents()` +
  `getClientRects()` (cf. technique documentée plus haut pour les Valeurs),
  PAS `getBoundingClientRect().height` (invalide sur ces éléments) —
  jamais estimé au jugé.
  - **Hero `index.html`** (`.hero-content h1`, `<br>` entre "qui"/"a" et
    entre "d'une"/"expérience" : "L'événement qui" / "a le goût d'une" /
    "expérience") : tient sur 3 lignes de 390px à 1450px sans rien changer
    d'autre. Au-delà (≥1470px), la police plafonne à `5.2rem` et
    "L'événement qui" (~658px) dépasse le `max-width:40rem`(640px) par
    défaut de `.hero-content` — **`.hero-content` (pas seulement le `h1`)
    est élargi à `44rem` via `@media (min-width:1470px)`** : un enfant bloc
    en largeur `auto` ne peut pas dépasser la largeur de son parent quel
    que soit le `max-width` qu'on lui donne à LUI (seul le parent peut
    grandir), d'où l'élargissement sur `.hero-content` et non sur le `h1`
    seul — piège vérifié en pratique avant de choisir cette approche. Sans
    effet sous 1470px (le parent est déjà plus étroit que 44rem via le
    viewport, donc rien ne change), et sans effet visuel sur l'eyebrow/le
    bouton CTA qui partagent ce conteneur (l'eyebrow tient déjà sur une
    ligne, le bouton est aligné à gauche — l'espace en plus à droite est
    juste inutilisé). En dessous de 390px (très petits téléphones), le
    texte déborde à 4 lignes — limite physique du même type que celle déjà
    documentée et acceptée pour le titre d'`engagements.html`.
  - **Teaser `index.html`** (`.teaser .section-head h2`, `<br>` après la
    virgule : "Quatre mondes," / "une même Dolce Vita") : tient sur 2
    lignes de 768px à 1920px. Le `max-width:46rem`(736px) hérité de la
    règle générique `.section-head` est trop étroit pour "une même Dolce
    Vita" une fois la police du `h2` proche de son plafond (jusqu'à
    `5.6rem`) — élargi à `58rem` via une règle scopée
    `.teaser .section-head` (n'affecte aucun autre `.section-head` du
    site). Sous 768px (mobile/petite tablette), la colonne est de toute
    façon bornée par le viewport (pas par ce `max-width`), donc
    l'élargissement est un no-op et le titre reste sur 3 lignes — même
    limite physique qu'ailleurs, acceptée.
  - **Contact `contact.html`** (`.page-header h1`, `<br>` après
    "Racontez-nous" : "Racontez-nous" / "votre projet") : tient sur 2
    lignes de 768px à 1920px. Ce titre utilise le `clamp()` de `h1`
    générique du site, qui grimpe jusqu'à `8.8rem` (!) — à cette taille
    "Racontez-nous" seul demande plus de 1000px, très au-delà du
    `max-width:46rem` générique de `.page-header h1`. **Nouvelle classe
    scopée `.title-2-lines-wide`** (`max-width:68rem`), appliquée
    uniquement au `h1` de `contact.html` — n'affecte pas le `max-width`
    générique `.page-header h1` (donc aucun effet sur les titres
    d'univers/prestations/projets/engagements, qui gardent 46rem). En
    dessous de 768px, même limite physique qu'ailleurs (le mot
    "Racontez-nous" seul dépasse déjà la largeur de la colonne mobile),
    dégrade à 3-4 lignes, acceptée.
  - **Devis `contact.html`** (`.contact-devis-text h2`, `<br>` après
    "Dites-nous" : "Dites-nous" / "où vous en êtes") + retrait de
    « — même en vrac » du texte du titre (le paragraphe juste en dessous,
    qui répète « même en vrac » dans une autre phrase, n'a pas été touché,
    seul le titre était visé). **Cas différent des trois précédents** :
    cette colonne de texte est une piste de grille CSS (`grid-template-
    columns: 0.85fr 1.15fr`) à côté de la carte formulaire, pas un bloc
    avec son propre `max-width` — l'élargir déborderait visuellement sur la
    carte formulaire juste à côté (changerait « la mise en page », ce que
    la cliente excluait explicitement). Or à partir de ~1024px cette
    colonne mesure une largeur fixe de **445px seulement**, plus étroite
    que le mot « Dites-nous » seul (~457px) à la taille de police plafond
    du `h2` (jusqu'à `5.6rem`) — **limite physique non contournable sans
    élargir la colonne de texte ni réduire la police**, les deux étant
    explicitement exclus. Le titre tient sur 2 lignes de 360px à 768px
    (mobile + tablette, où la mise en page passe en une seule colonne
    pleine largeur avant 960px), mais affiche 3-4 lignes de 1024px à
    1920px — accepté et documenté comme limite physique, du même type que
    celle déjà actée pour le titre d'`engagements.html` et pour les trois
    titres ci-dessus.
  Aucun débordement horizontal introduit par ces changements (vérifié par
  script sur les 6 pages × 2 viewports).
- **Formulaire de contact compacté (2026-08-17)** (`.form-card` et son
  contenu, `contact.html`/`style.css`) : demande explicite de la cliente
  ("essaye que le formulaire tienne sur un écran d'ordi... réduis donc sa
  taille actuelle"). Réduction de tous les espacements internes de la
  carte formulaire (pas de la section qui la contient, ni du reste de la
  page) : `.form-card` padding desktop `var(--space-5)`(4.5rem)→`2.25rem`,
  `.form-group` margin-bottom `var(--space-4)`(2.75rem)→`var(--space-2)`
  (1rem), `.form-group-label` margin-bottom `var(--space-3)`(1.75rem)→
  `0.85rem`, `.form-row` margin-bottom/gap `var(--space-3)`→`var(--space-2)`,
  `.field input/select/textarea` padding vertical `0.9em`→`0.6em`,
  `.field textarea` min-height `120px`→`64px`, `.service-option` padding
  vertical `0.75em`→`0.55em`, `.form-footer` margin-top `var(--space-3)`→
  `var(--space-2)`. Résultat mesuré par Playwright : hauteur de
  `.form-card` réduite de **1155px à 851px** à 1440×900 (un ordinateur
  portable courant), soit sous la hauteur de viewport elle-même — le
  formulaire tient donc quasiment entièrement à l'écran une fois scrollé
  jusqu'à lui, sans scroll interne excessif. Vérifié visuellement
  (captures desktop et mobile) : aucun champ ne paraît écrasé ou illisible
  malgré la réduction, l'espacement reste confortable.
- Formulaire de contact : validation + construction du `mailto:` dans
  `buildMailto()`/`validate()`. Les champs sont repérés par leur `id`/`name`
  (`fullName`, `company`, `email`, `phone`, `serviceType`, `guests`,
  `eventDate`, `message`) — à conserver si le formulaire est retouché.
- **Audit général du site (2026-08-17)** : demande explicite de la
  cliente ("corrige tous les bugs et incohérences, visuels ou autre") —
  passage systématique des 6 pages × 2 viewports (regression Playwright
  automatisée : débordement horizontal, erreurs console, images cassées,
  liens morts/ancres orphelines, IDs dupliqués), balayage visuel image par
  image de chaque page en plusieurs segments de scroll, et test manuel des
  interactions (formulaire, menu mobile, survol engagements, glisser-
  déposer + clavier de la mosaïque, accordéon FAQ). Deux bugs sur la page
  Univers sont documentés ci-dessus (carte des 5 sens translucide pendant
  le fondu, compteur désynchronisé des points) ; trois autres trouvés,
  détaillés ici :
  - **"@" quasi invisible dans l'email du menu mobile** (`.mobile-menu-info
    a`, "Estellelorusso@eurhekaconseil.com", dupliqué sur les 6 pages) :
    repéré uniquement grâce à une capture d'écran en haute résolution
    (×4) — à la résolution d'écran normale (×1, la plupart des écrans non
    Retina), le glyphe "@" de la police self-hébergée Glacial Indifference
    (400, normal) se rendait avec des traits beaucoup plus fins que le
    reste de la police à cette taille, quasiment invisible à l'œil nu sur
    fond sombre. Vérifié que ce n'était ni un problème de police non
    chargée, ni de largeur de boîte/ellipsis (le caractère occupait bien
    sa place dans la mise en page, juste peint quasi vide) — un vrai
    défaut du fichier de police à cette taille précise. Corrigé en
    isolant uniquement le caractère "@" dans un `<span class="mailto-at">`
    avec `font-family: "Helvetica Neue", Arial, sans-serif` (le reste de
    l'email garde Glacial Indifference) — chirurgical, ne change
    l'apparence d'aucun autre caractère. Si un autre "@" affiché en corps
    de texte (pas dans un `href`) doit être ajouté ailleurs sur le site,
    vérifier d'abord qu'il n'utilise pas Glacial Indifference à une petite
    taille, ou appliquer le même correctif.
  - **Incohérence de code (pas un bug visuel)** : le bloc `.manifesto`
    d'`index.html` (citation "Suspendre le quotidien...", teaser vers
    Univers) utilisait des styles inline (`style="display:block;
    margin-bottom:..."`, `style="margin-top:..."`) au lieu de classes CSS
    scopées comme partout ailleurs sur le site (ex. `.page-header .eyebrow`
    pour le même besoin). Remplacé par `.manifesto-eyebrow`/`.manifesto-cta`
    dans `style.css` — aucun changement visuel, juste une mise en
    cohérence avec la convention du reste du code.
  - Les seuls autres éléments signalés par l'audit (liens `href="#"` du
    header/footer, coordonnées provisoires du bandeau Contact, photos
    d'équipe manquantes) sont des placeholders déjà documentés et
    intentionnels (voir « Limites connues » ci-dessous) — pas des bugs.
  Regression complète re-vérifiée après chaque correctif : 0 débordement,
  0 erreur console, sur les 6 pages × 2 viewports.
- **Bordures pointillées retirées sitewide, remplacées par des traits
  pleins (2026-08-17)** : demande explicite de la cliente ("enlève ce qui
  est en pointillé pour remplacer par des lignes pleines"), appliquée à
  toutes les occurrences de `border-style: dashed` trouvées dans
  `style.css` (aucune n'utilisait `dotted`) — seule la valeur `dashed` →
  `solid` change à chaque fois, couleurs/épaisseurs/opacités inchangées :
  le cercle décoratif du coin de `.page-header::before`, le tampon
  numéroté façon passeport `.values-reel-stamp` (page À propos, album des
  Valeurs), le trait "liant" entre les valeurs
  `.values-reel-thread-line`/`.values-reel-thread-fill` (même section), et
  le cercle décoratif de `.contact-devis::before` (page Contact). Si
  `dashed` réapparaît sur l'une de ces règles (ou une nouvelle), c'est un
  retour à l'ancien style, à ne pas réintroduire sans qu'on le redemande —
  la convention du site est désormais traits pleins uniquement pour ce
  type d'élément décoratif. Vérifié par script Playwright parcourant tous
  les éléments de chaque page et comptant les styles de bordure `dashed`
  calculés (`getComputedStyle`) : 0 sur les 6 pages. Regression complète
  6 pages × 2 viewports : 0 débordement, 0 erreur console.
- **Cinq retouches ponctuelles (2026-08-18)**, demandées ensemble par la
  cliente sur des pages différentes.
  - **Hero `index.html` plein écran** : `.hero` passe de `min-height: 94svh`
    à `100svh` — auparavant un fin liseré du `.stats-band` terracotta qui
    suit restait visible en bas d'écran au chargement ; désormais le
    carrousel photo occupe tout l'écran et le bandeau chiffres n'apparaît
    qu'au scroll, comme demandé.
  - **`.stats-band-grid` centré** : chaque chiffre clé (`dt`/`dd`) est
    maintenant centré dans sa colonne (`text-align:center` sur
    `.stats-band-grid > div`, `margin-inline:auto` sur `dd` pour que son
    `max-width` reste centré) plutôt que collé à gauche contre le séparateur.
  - **Boutons "haut de page"/"bas de page" sur la mosaïque Projets**
    (`.page-scroll-nav`, `projets.html`) : deux boutons ronds, alignés à
    droite, verticalement centrés sur la hauteur de la mosaïque, chacun avec
    juste la pointe d'un chevron (pas de flèche complète) —
    `scrollTopBtn`/`scrollBottomBtn` dans `main.js` font un
    `window.scrollTo` (haut de page / bas de la page entière, pas seulement
    de la mosaïque), en `smooth` sauf `prefers-reduced-motion`.
    **Itération immédiate (même jour)** : la première version utilisait
    `position: fixed`, donc les boutons suivaient l'utilisateur sur toute la
    page (header, footer...) — la cliente a explicitement demandé qu'ils
    n'apparaissent qu'au niveau de la mosaïque. `.page-scroll-nav` est passé
    en `position: absolute`, **sibling** de `.mosaic-viewport` (pas un
    descendant) à l'intérieur de `.mosaic-section` (qui a reçu
    `position: relative` pour servir d'ancrage) : sa hauteur épouse
    naturellement celle de `.mosaic-viewport` puisque c'est le seul contenu
    de la section, donc les boutons restent visuellement au même endroit
    qu'avant, mais scrollent avec la page au lieu d'y rester fixes.
    **Volontairement pas à l'intérieur de `#mosaicViewport`** : un essai
    intermédiaire les plaçait en enfants de `#mosaicViewport` (plus simple
    à styliser), mais `#mosaicViewport` capture le pointeur au
    `pointerdown` (`setPointerCapture`, pour le glisser-déposer de la
    mosaïque) — un clic réel (souris down/up simulée, pas juste
    `element.click()` scripté) sur un bouton enfant interrompait parfois le
    `window.scrollTo` en cours de route. Non reproduit une fois les boutons
    sortis comme frères de `.mosaic-viewport` plutôt que comme enfants.
  - **Carré terracotta retiré du fond des cartes Engagements**
    (`.engagements::after`, `engagements.html`) : la cliente le trouvait trop
    présent dans le fond des flip-cards ; supprimé entièrement (le calque de
    lueurs animées `.engagements::before` reste inchangé). Si ce carré
    réapparaît dans un diff, ne pas le réintroduire sans qu'on le redemande.
  - **Formulaire de contact compacté une seconde fois** (`.form-card` et son
    contenu, `contact.html`) : après un premier compactage le 2026-08-17
    (voir plus haut, 1155px→851px à 1440×900), toujours trop haut sur l'écran
    réel de la cliente — réduit encore (padding carte 2.25rem→1.75rem,
    marges/gaps des groupes et lignes 1rem→0.7rem, padding vertical des
    champs 0.6em→0.45em, hauteur mini des textarea 64px→48px, padding des
    `.service-option` 0.55em→0.4em) : **851px→773px** à 1440×900, vérifié
    par script Playwright + capture d'écran — le formulaire complet (jusqu'au
    bouton "Envoyer ma demande" et la note en dessous) tient désormais dans
    un viewport de 900px de haut.
  - **Effet d'apparition des formules Prestations défloqué (gèle corrigé)**
    (`.formula-slide-left`/`.formula-slide-right`, `style.css` +
    `decoding="async"` sur les 4 `.world-media-photo`, `prestations.html`) :
    la cliente signalait un freeze/saccade au scroll sur cette page. Cause
    probable identifiée : `filter: blur(7px→0)` était dans la `transition`
    de l'article `.world` (quasi plein écran, contient une grande photo
    encore `loading="lazy"` à ce moment précis du scroll) — animer un filtre
    de flou force un re-rasterize de tout ce sous-arbre à chaque frame,
    et ça coïncidait avec le décodage de l'image qui vient tout juste
    d'entrer dans le viewport. Corrigé en sortant `filter` de la liste
    `transition` (le flou passe donc instantanément de 7px à 0 au lieu de
    s'animer sur 0.55s — l'effet "point net progressif" reste visible mais
    ne coûte plus une rastérisation par frame), en ajoutant
    `will-change: transform, opacity` (retiré une fois `.is-visible`, pour
    ne pas garder le calque promu indéfiniment) et `decoding="async"` sur
    les 4 photos pour que leur décodage ne bloque pas le thread principal
    pile au moment du reveal. Si `filter` réapparaît dans cette liste
    `transition`, revérifier ce risque de gel avant de le garder. Vérifié
    par script Playwright (classe/`filter` calculé après transition,
    `blur(0px)` atteint) et regression complète 6 pages × 2 viewports : 0
    débordement, 0 erreur console.
  Regression Playwright complète (6 pages × 2 viewports) revérifiée après
  l'ensemble de ces cinq changements : 0 débordement, 0 erreur console.
- **Engagements — cartes sur une seule ligne (2026-08-18)**
  (`.engagement-card*`, `engagements.html`) : demande explicite de la
  cliente ("met les cartes les unes à côté des autres sur la même ligne") —
  remplace entièrement la grille en zigzag/cascade des 6 itérations
  précédentes (positions `.engagement-card-pos-*`, fonction
  `layoutEngagementCards()`). Les deux sont retirées ; si elles
  réapparaissent dans un diff, c'est cette ancienne mise en page, à ne pas
  réintroduire sans qu'on le redemande (voir plus haut pour l'historique
  complet des 6 itérations de cascade, gardé pour référence).
  **`.engagement-cards` passe en `display:flex; flex-direction:row;
  flex-wrap:wrap`**, les 4 `<li>` en `flex:1 1 15rem; min-width:15rem;
  max-width:16.5rem` — un vrai `min-width` (pas `min-width:0`) est ce qui
  rend cette mise en page responsive sans breakpoint manuel : le
  navigateur passe à la ligne suivante dès qu'il ne peut plus caser 4
  cartes d'au moins 15rem, plutôt que de continuer à les rétrécir
  indéfiniment. Sous 700px, comportement inchangé (colonne unique,
  `width:min(92vw,22rem)`).
  **Deux bugs réels trouvés et corrigés avant publication, aucun supposé** :
  1. *Titre qui déborde/se fait couper* — `.engagement-card-title` et
     `.engagement-card-back-title` utilisaient un `clamp()` avec un
     coefficient `vw` calé sur l'ancienne carte (~27rem, quasi la largeur
     du viewport) ; une fois 4 cartes par ligne (~15–16.5rem chacune, soit
     environ un quart du viewport), ce coefficient continuait de calculer
     une taille pensée pour une carte 4× plus large, et le mot
     "Positionnement" (le plus long de tous les titres, 14 caractères)
     débordait hors de la carte — invisible à l'œil car
     `.engagement-card-face` a `overflow:hidden`, donc silencieusement
     coupé plutôt qu'affiché en dépassement. Repéré par script Playwright
     comparant `scrollWidth`/`clientWidth` du titre (pas par simple
     inspection visuelle, qui ne montre qu'un texte tronqué sans indiquer
     la cause). Corrigé en réduisant les `clamp()` (coefficient `vw`
     nettement plus faible) et en ajoutant `overflow-wrap:break-word` en
     filet de sécurité si un futur titre/traduction est encore plus long.
  2. *Contenu du dos de la carte coupé verticalement* — plus sérieux :
     avec `min-width:0` (avant le correctif ci-dessus), les cartes
     pouvaient rétrécir jusqu'à ~135–165px à des largeurs d'écran
     intermédiaires (tablette/petit ordinateur portable, ex. 768px) —
     `.engagement-card-inner` gardant `aspect-ratio:5/6`, une carte plus
     étroite est aussi plus basse, et le numéro+titre+description+"Retour"
     du dos ne tenaient plus dans cette hauteur réduite : jusqu'à 261px de
     contenu coupé par l'`overflow:hidden` de `.engagement-card-face`,
     mesuré via `scrollHeight - clientHeight` à plusieurs largeurs. Ce
     n'est pas ce qui a été corrigé en réduisant la police (le titre avant
     ne débordait déjà plus) — c'est le `min-width` réel décrit ci-dessus
     qui règle ce problème en empêchant les cartes de rétrécir sous une
     hauteur viable, forçant un retour à la ligne à la place. Vérifié par
     script Playwright à 6 largeurs (701 à 1920px) : 0 débordement de
     titre, 0 contenu de dos coupé, 4 cartes bien sur une seule ligne aux
     largeurs desktop courantes (1440, 1920), passage à une grille 2×2
     lisible aux largeurs plus étroites plutôt que de casser.
  Le mécanisme de flip/scale/parallaxe au scroll (`updateEngagementCards()`,
  `main.js`) est entièrement inchangé — seule la disposition des cartes
  change. Regression complète 6 pages × 2 viewports : 0 débordement,
  0 erreur console.
- **Promesse réutilisée sur l'accueil, échelle réduite via `data-scale`
  (2026-08-18)** (`fitPromiseLines()`, `main.js`, section `.promise` sur
  `index.html`) : dans le cadre du déplacement du contenu d'`univers.html`
  (voir « État d'avancement » plus bas pour la vue d'ensemble), la cliente
  a demandé d'appliquer exactement le même traitement typographique
  "poster" (même photo `amalfi-coast-sunset.jpg`, mêmes 11 lignes/mêmes
  classes `.promise-line-N`/`.promise-line-from-left/-right`) à la section
  "Notre promesse" de la page d'accueil, mais avec une taille de police
  0,75× celle calculée normalement. **Nouveau mécanisme `data-scale`** :
  `fitPromiseLines()` lit désormais `promiseQuote.dataset.scale`
  (`parseFloat(...) || 1`, donc `1` par défaut si l'attribut est absent) et
  multiplie `sharedSize` par cette valeur juste après le calcul habituel
  (taille idéale par ligne puis minimum partagé) — l'échelle s'applique
  donc TOUJOURS relativement à la largeur réelle du conteneur de cette
  instance précise, jamais une valeur en pixels recopiée depuis l'autre
  page. `index.html` porte `data-scale="0.75"` sur `#promiseQuote` ; si
  cet attribut est retiré ou si une valeur en dur remplace ce calcul
  relatif, c'est une régression par rapport à ce mécanisme. Comme un seul
  `#promiseQuote` existe par page au chargement (chaque page HTML est
  indépendante), aucun risque de conflit entre les deux instances du site.
  Vérifié par script Playwright : `font-size` calculé cohérent entre les 11
  lignes (taille partagée, mécanisme `Math.min` inchangé), rendu visuel
  conforme sur desktop et mobile (le `clamp()` CSS de repli sous 640px
  reste inchangé et n'est pas concerné par `data-scale`, qui ne s'applique
  qu'à la branche JS desktop/tablette). Regression complète 6 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Promesse (accueil) — regroupée en 8 lignes (2026-08-18)**
  (`.promise-quote`, `index.html`, `.promise-line-N` dans `style.css`) :
  demande explicite de la cliente ("met plus de mot par ligne pour faire
  en sorte que ça tienne sur 8 lignes") sur la version accueil de cette
  citation (cf. bullet précédent — cette section n'existe plus que sur
  `index.html` depuis la suppression d'`univers.html`). Texte inchangé mot
  pour mot, seul le découpage en lignes change : de 11 lignes
  (« Suspendre » / « le quotidien » / « professionnel » / « Pour » /
  « transporter » / « vos invités » / « au cœur » / « de l'Italie, » /
  « iconique » / « et » / « intemporelle ») à 8 (« Suspendre le
  quotidien » / « professionnel » / « Pour transporter » / « vos invités »
  / « au cœur » / « de l'Italie, » / « iconique » / « et intemporelle »).
  « professionnel » reste seule sur sa ligne à `margin-left:0` (mot le
  plus long de la citation, plafond physique déjà documenté pour la
  version originale de cette section) ; les marges des 6 autres lignes
  numérotées ont été recalculées pour la nouvelle répartition
  gauche/milieu/droite (la 8ᵉ ligne, dernière, reste gérée génériquement
  par le sélecteur `:last-child` — aucune classe `.promise-line-8`
  nécessaire, cf. commentaire déjà en place à ce sujet). Comme
  `fitPromiseLines()` (`main.js`) calcule déjà la taille dynamiquement à
  partir du texte réel de chaque ligne, regrouper des mots en lignes plus
  longues n'a demandé aucun changement JS — seule la taille partagée
  résultante devient un peu plus petite (les lignes combinées étant plus
  larges à caser). Vérifié par script Playwright (technique
  `Range.selectNodeContents()`/`getClientRects()`, déjà établie ailleurs
  sur le site pour ce type de mesure) à 1024, 1440, 1600 et 1920px : 1
  seule ligne rendue par groupe, 0 débordement horizontal. Si un
  découpage à 11 lignes réapparaît ici, c'est l'ancienne version, à ne pas
  réintroduire sans qu'on le redemande.
- **Accueil — cartes formules avec photo de fond + réordonnancement
  (2026-08-18)** (`.teaser-card*`, `index.html`) : deux demandes de la
  cliente sur la section "Quatre mondes, une même Dolce Vita".
  **Photos de fond, voile sombre pour la lisibilité** : chaque carte
  affiche désormais la même photo que sa section correspondante sur
  `prestations.html` — `positano-ceramiche-decor.jpg` (La Cartolina),
  `vespa-fleuriste-rue.jpg` (L'Esperienza), `evenement-rangee-spritz.jpg`
  (L'Aperitivo), `terrace-dinner-assisi.jpg` (La Tavola) — aucune nouvelle
  photo, `assets/img/CREDITS.md` mis à jour (colonne "Utilisée sur") pour
  les 4 fichiers. Structure `<img class="teaser-card-photo">` +
  `.teaser-card-scrim` (dégradé sombre `rgba(16,31,39,0.4→0.86)`) +
  `.teaser-card-content` (texte), même schéma en couches que
  `.engagement-card-front*` (engagements.html) déjà utilisé ailleurs sur
  le site pour ce type de carte photo+texte — réutilisé plutôt
  qu'inventé. Couleurs de texte inversées pour le contraste sur fond
  sombre (`h3` en `--cream`, `p` en blanc cassé, `.num` en
  `--terracotta-300`) et `.link-arrow` reçoit la classe `on-dark` déjà
  existante ailleurs sur le site (hero, page-header sombres) plutôt qu'un
  nouveau style dédié. `terrace-dinner-assisi.jpg` (Wikimedia, CC BY,
  Andrew Parlette) était déjà créditée dans le footer d'`index.html`
  (utilisée par le hero) — aucun crédit supplémentaire à ajouter ;
  `positano-ceramiche-decor.jpg`/`vespa-fleuriste-rue.jpg` (Pexels,
  aucune attribution requise) et `evenement-rangee-spritz.jpg` (photo
  Simposio réelle) ne changent rien non plus côté footer.
  **Parcours des 5 sens déplacé après cette section** : la cliente a
  demandé de placer `#sensesJourney` en dessous de la section formules
  plutôt qu'au-dessus (ordre hérité du déplacement depuis `univers.html`,
  cf. bullet dédié plus haut) — nouvel ordre sur `index.html` : hero →
  chiffres clés → Notre promesse → **formules** → **5 sens** → CTA.
  Aucun changement de contenu/mécanisme sur le parcours des 5 sens
  lui-même, un simple déplacement de bloc dans le HTML (le JS cherche
  l'élément par id, indifférent à sa position dans la page). **Deux
  sections sombres redeviennent adjacentes en fin de page** (5 sens →
  CTA, toutes deux à fond sombre) — déjà le cas dans l'ordre précédent
  entre Promesse et 5 sens (deux sections sombres juste après l'autre y
  coexistaient déjà avant ce changement, sans que la cliente ne le
  signale comme un problème), donc accepté ici aussi sans repenser
  l'alternance de fond de toute la page pour ce seul réordonnancement ;
  les deux sections restent visuellement distinctes (dégradé uni pour les
  5 sens vs photo + dégradé pour le CTA), pas de "bloc" plat. Vérifié par
  script Playwright (ordre des sections lu directement dans le DOM) et
  regression complète 6 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Promesse (accueil) — encore agrandie, ×1,25 (2026-08-18)**
  (`data-scale`, `index.html`) : demande explicite de la cliente sur la
  version accueil de cette citation ("agrandi le texte... de 1,25 fois").
  `data-scale` sur `#promiseQuote` passe de `0.75` à `0.9375`
  (= `0.75 × 1.25`) — seule cette valeur change, aucun autre paramètre du
  mécanisme `fitPromiseLines()` n'est touché. Vérifié par script
  Playwright : taille de police calculée passe de 72,7px à 90,9px à
  1440px de large (ratio exact 1,25), toujours 1 seule ligne rendue par
  groupe, 0 débordement horizontal.
- **CTA "Composons ensemble" (accueil) — rouge remplacé par terracotta
  (2026-08-18)** (`.contact`, `index.html`) : demande explicite de la
  cliente sur le bandeau CTA de fin de page d'accueil ("remplace le rouge
  par terracotta et adapte les couleurs des polices"). Le fond en
  dégradé à deux tons (`rosso-ombria` → quasi-noir rouge) passe à un
  terracotta assombri équivalent (`rgba(106,54,25,…)` →
  `rgba(52,26,12,…)`, même structure de dégradé, mêmes opacités) — calculé
  en assombrissant `--terracotta` (`#c1622d`) dans les mêmes proportions
  que `--rosso-ombria` l'était par rapport à `--rosso-venezia`, plutôt
  qu'une teinte choisie au jugé. Le glow radial en haut à droite était
  déjà en terracotta plein (`rgba(193,98,45,…)`), inchangé.
  **Couleurs de police adaptées** (la partie de la demande qui ne se
  limite pas au fond) : l'eyebrow "Composons ensemble" utilisait la
  règle générique sitewide `.eyebrow.on-dark` (`--terracotta-300`) — sur
  un fond désormais terracotta, même famille de teinte, le contraste
  devenait trop faible (texte et fond se fondaient) ; surchargé
  localement en `.contact-intro .eyebrow { color: var(--cream) }` (scopé
  à cette section, aucun autre `.eyebrow.on-dark` du site n'est
  affecté). Le lede passe du gris-bleu neutre `--fg-muted-inverse`
  (pensé pour un fond navy, plus utilisé nulle part dans cette section
  précise) à `rgba(246,241,231,0.85)` — même teinte crème translucide
  déjà utilisée pour du texte secondaire sur fond photo/dégradé chaud
  ailleurs sur le site (`.teaser-card p`, `.engagement-card-back-text`),
  réutilisée ici pour cohérence plutôt qu'une nouvelle valeur inventée.
  Les boutons (`.btn-primary`/`.btn-outline`, `.contact-info` non
  utilisée sur cette page) étaient déjà en terracotta/neutre, aucun
  changement nécessaire de ce côté. Vérifié par capture d'écran et
  regression Playwright complète (6 pages × 2 viewports) : 0
  débordement, 0 erreur console.
- **Promesse (accueil) — alternance gauche/droite corrigée (2026-08-18)**
  (`.promise-line-from-left`/`-from-right`, `index.html`) : demande
  explicite de la cliente ("alterne entre un glissement venant de gauche
  puis de droite"). Le découpage à 8 lignes (bullet précédent, hérité du
  découpage à 11 lignes d'origine) avait conservé les classes de
  direction telles quelles lors du regroupement de mots, ce qui cassait
  l'alternance stricte (gauche/gauche/droite/droite/gauche/droite/droite/
  droite au lieu d'alterner à chaque ligne). Corrigé en réassignant les 8
  classes en pure alternance : gauche/droite/gauche/droite/gauche/droite/
  gauche/droite (`.promise-line-2`, `-3` et `-7` changent de sens ; `-1`,
  `-4`, `-5`, `-6` et la dernière ligne restaient déjà cohérentes avec
  cette alternance). Aucun changement CSS/JS — uniquement les classes
  `promise-line-from-left`/`-from-right` sur les `<span>` dans le HTML,
  le mécanisme de `fitPromiseLines()`/reveal (`main.js`) est inchangé.
  Vérifié par script Playwright : direction de chaque ligne lue
  directement dans les classes, décalage `translateX` mesuré avant
  révélation (signe alterné, `-115.2px`/`+115.2px` à 1440px de large) et
  toutes les lignes revenues à `translateX(0)` une fois révélées.
  Regression complète 6 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Nouveau motif de marque : le "coin tranché" (2026-08-18)** — en réponse
  à une demande explicite de la cliente ("crée un motif graphique récurrent
  propre à la marque qui est original, impactant et qui fait premium"),
  après un échange où elle a précisé vouloir un retour purement sur la
  forme (mise en page, motifs visuels), pas sur le texte (pas encore
  travaillé). Un geste géométrique simple — un panneau dont le bord droit
  est tranché en diagonale (`clip-path: polygon(0 0, calc(100% - Xrem) 0,
  100% 100%, 0 100%)`), évoquant un ticket/une note tranchée plutôt qu'un
  rectangle plat — choisi pour être réutilisable à plusieurs échelles sans
  dépendre d'un nouveau logo (la cliente n'a pas encore dessiné le sien).
  **Deux premiers usages, sur `index.html`** (voir les deux bullets
  suivants pour le détail de chaque section) :
  1. À grande échelle : les 3 panneaux de la section "Notre méthodologie"
     (`.method-step-panel`).
  2. À petite échelle : le badge "100% B2B" du bandeau chiffres clés
     (`.stats-band-grid > div.is-b2b dt`).
  **Vocation volontairement extensible, pas rétroactive** : ce motif n'a
  PAS été appliqué rétroactivement aux marqueurs numérotés existants
  ailleurs sur le site (points du parcours des 5 sens, tampons du
  carrousel Valeurs, numéros des flip-cards Engagements) — un retrofit
  large aurait été un changement de forme non demandé sur des sections
  déjà validées par la cliente à plusieurs itérations. Documenté ici comme
  le nouveau vocabulaire de référence pour toute future extension
  (marqueurs numérotés, séparateurs de section, badges) si la cliente
  souhaite le généraliser. Si un futur logo est dessiné, ce biais
  diagonal est un candidat naturel à y faire écho (mentionné à la cliente
  en discussion, non implémenté).
- **"Composons ensemble" fusionné avec une nouvelle section "Notre
  méthodologie" (2026-08-18)** (`.method-cta*`, `index.html`) : demande
  explicite de la cliente, avec une capture d'écran d'un autre site
  (mise en page à étudier, pas leur identité de marque) comme référence —
  grand titre empilé à gauche sur fond clair + panneaux numérotés à bord
  tranché empilés à droite. **Remplace entièrement** l'ancien bandeau CTA
  (`.contact`/`.contact-grid`/`.contact-intro`/`.contact-info`, colonne
  unique centrée sur fond terracotta plein cadre, lui-même un remplacement
  d'un dégradé rouge encore antérieur) — ces classes et leur CSS ont été
  supprimés (y compris `.contact::after` du sélecteur partagé de texture
  de grain, qui ne s'applique plus qu'à `.hero`/`.senses-journey-sticky`).
  Si `.contact`/`.contact-grid`/`.contact-intro` réapparaissent dans un
  diff, c'est cette ancienne version, à ne pas réintroduire sans qu'on le
  redemande.
  **Fond repassé en crème** (`.method-cta`, `var(--bg)`) au lieu du
  terracotta plein cadre précédent — inspiré de la référence de la
  cliente, et corrige au passage une remarque déjà notée plus haut dans ce
  fichier ("deux sections sombres redeviennent adjacentes en fin de
  page") : l'ordre devient 5 sens (sombre) → ce bandeau (crème) → footer
  (sombre), une vraie alternance plutôt que deux sections sombres
  consécutives.
  **Deux colonnes** (`.method-cta-grid`, `0.85fr 1.15fr` à partir de
  960px, empilé en dessous) : à gauche `.method-cta-intro`, le contenu CTA
  inchangé au mot près (eyebrow "Composons ensemble" / h2 / lede / boutons
  devis+projets) mais recoloré pour un fond clair — l'eyebrow et le lede
  perdent leurs classes `on-dark` (devenues inutiles), et le bouton
  secondaire passe de `.btn-outline` (pensé pour un fond sombre : bordure/
  fond quasi transparents en blanc, invisibles sur crème) à une nouvelle
  classe `.btn-outline-dark` (texte/bordure navy, transparent, s'inverse
  au survol) ajoutée dans le bloc `.btn-ghost` du fichier. À droite
  `.method-steps` : eyebrow "Notre méthodologie" + 3 `<li class="method-
  step">` en cascade légèrement décalée horizontalement (`margin-left`
  croissant puis décroissant sur les cartes 2 et 3, pas de chevauchement
  vertical — volontairement plus simple que les 6 itérations de cascade
  des cartes Engagements documentées plus haut, qui n'ont plus de raison
  d'être reproduites ici) et un texte de clôture
  (`.method-steps-note`, séparé par un trait plein — pas pointillé,
  cohérent avec le retrait sitewide des pointillés du 2026-08-17).
  **Contenu des 3 étapes, à valider avec la cliente comme le reste du
  texte du site** (pas repris d'un cahier des charges existant, rédigé
  pour cette nouvelle section) : 01 Écouter (cadrage besoins/budget), 02
  Concevoir (proposition détaillée), 03 Orchestrer (pilotage jour J).
  **Bug réel trouvé et corrigé avant publication** : le badge numéroté en
  losange (`.method-step-num`) était d'abord un enfant positionné en
  absolute À L'INTÉRIEUR du panneau à coin tranché — `clip-path` découpe
  tout ce qui est peint dans l'élément, y compris un descendant qui déborde
  de sa boîte, donc la moitié du losange qui dépasse au-dessus du bord
  supérieur était rognée (repéré par capture d'écran : triangle tronqué au
  lieu d'un losange complet, pas visible en relisant le CSS seul). Corrigé
  en séparant le panneau clippé (nouvelle classe `.method-step-panel`,
  enfant de `.method-step`) du badge numéroté (resté enfant direct de
  `.method-step`, qui lui n'a pas de `clip-path`) — le badge peut
  déborder librement au-dessus du panneau sans être rogné.
  **Second bug trouvé et corrigé** : sur mobile (empilement à une colonne),
  le `margin-bottom` hérité de la règle générique `.hero-actions` (pensée
  pour un hero où un autre élément suit dans le même bloc) s'ajoutait au
  `gap` de la grille `.method-cta-grid` (7rem), créant un vide d'environ
  184px entre les boutons et "Notre méthodologie" (repéré par capture
  d'écran, invisible sur desktop où les 2 colonnes sont côte-à-côte donc ce
  margin-bottom n'a pas d'effet visible) — corrigé en mettant ce
  margin-bottom à 0 pour `.method-cta-intro .hero-actions` et en réduisant
  le `gap` de la grille à `var(--space-5)` sous 700px.
  Vérifié par script Playwright (position/largeur de chaque panneau,
  0 débordement horizontal à 390/768/1024/1440/1600/1920px, reveal
  `[data-reveal-group]` déclenché par un vrai scroll — pas seulement forcé
  en JS — et opacité confirmée à 1 après) et capture d'écran desktop +
  mobile. Regression complète 5 pages × 2 viewports : 0 débordement,
  0 erreur console, 0 lien interne cassé.
- **Bandeau chiffres clés — repère "100% B2B" (2026-08-18)**
  (`.stats-band-grid`, `index.html`) : en réponse à la question de la
  cliente sur l'opportunité d'un endroit dédié précisant le positionnement
  100% B2B/corporate du site — ajout d'un 4ᵉ élément à la grille (passée
  de `repeat(3, 1fr)` à `repeat(4, 1fr)`), plutôt qu'une section dédiée
  qui aurait cassé le rythme narratif Dolce Vita du reste de la page.
  **Traité différemment des 3 autres chiffres** : "100% B2B" est une
  affirmation de positionnement, pas un comptage (contrairement à "4"
  formules, "5 sens", "Alsace") — plutôt que de lui donner le même
  traitement typographique géant (`--font-display`, jusqu'à 3rem), son
  `dt` devient une petite plaque à coin tranché (voir bullet précédent
  pour la 1ʳᵉ apparition de ce motif, à plus grande échelle) : fond navy,
  texte terracotta clair, `clip-path` biseauté — un vrai badge plutôt
  qu'un chiffre parmi d'autres, via la classe `.is-b2b` sur le `<div>`
  correspondant. dd : "Aucun évènement grand public : uniquement des
  projets d'entreprise et d'institutions".
  **Bug de largeur de colonnes trouvé et corrigé** : avec `repeat(4, 1fr)`
  seul, les 4 colonnes ne se répartissaient pas à égalité entre ~701 et
  900px de large — une piste `1fr` reste bornée par le max-content de son
  contenu tant qu'aucun `min-width` n'est fixé, donc la colonne "Alsace"
  (texte le plus long) élargissait sa piste au détriment du badge B2B, qui
  repliait "100% B2B" sur 2 lignes plus tôt que nécessaire (repéré par
  capture d'écran à 768px, pas visible aux largeurs desktop plus larges où
  il y a assez de place pour toutes les colonnes). Corrigé en ajoutant
  `min-width: 0` à `.stats-band-grid > div` (règle déjà partagée par les 4
  colonnes) — chaque piste respecte désormais le partage 1fr/1fr/1fr/1fr et
  laisse le texte se replier librement à l'intérieur plutôt que de forcer
  la grille à s'élargir.
  Vérifié par script Playwright (largeurs de colonnes mesurées égales à
  768px après correctif : 123px×4, contre 112.6/112.6/141.5/125.4px avant)
  et capture d'écran à 390/768/1440px. Regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Motif "coin tranché" retiré, méthodologie retravaillée en version
  premium/arrondie + animations (2026-08-18)** : deux demandes explicites
  de la cliente sur le rendu livré juste au-dessus. D'une part retirer le
  motif de coin tranché partout où il avait été posé — elle dessinera
  elle-même le motif récurrent de la marque, ce chantier n'est donc plus
  au programme ici. D'autre part retravailler "Notre méthodologie" pour un
  rendu plus premium, avec des animations et des formes moins carrées/plus
  arrondies.
  **Badge "100% B2B" (`.stats-band-grid`)** : la règle
  `.stats-band-grid > div.is-b2b dt` (fond navy, `clip-path` biseauté)
  est supprimée — ce `dt` hérite de nouveau des règles génériques
  partagées avec les 3 autres chiffres (même `--font-display`, même
  couleur blanche), identique en tout point à "4"/"5 sens"/"Alsace". La
  classe `.is-b2b` reste sur le `<div>` dans `index.html` (accroche
  neutre, aucun effet CSS actuel) au cas où un traitement différencié
  serait redemandé plus tard. Si une règle de fond/`clip-path` réapparaît
  sur `.is-b2b dt`, c'est cette ancienne version, à ne pas réintroduire
  sans qu'on le redemande.
  **"Notre méthodologie" (`.method-step*`)** : le `clip-path` biseauté du
  panneau est remplacé par des coins très arrondis (`border-radius:
  var(--radius-lg)`, 36px) et un dégradé subtil (`linear-gradient(155deg,
  var(--navy-900), var(--navy))`) au lieu d'un aplat — plus premium qu'un
  bloc de couleur uni. Le badge numéroté, auparavant un losange
  (`rotate(45deg)` + contre-rotation du texte pour rester lisible), devient
  un simple cercle (`border-radius:50%`) — cohérent avec la demande de
  formes moins carrées, et markup simplifié au passage (plus besoin du
  `<span>` interne contre-tourné). **Animations ajoutées** :
  1. Survol/focus (`:hover`, `:focus-within` pour l'accessibilité clavier) :
     le panneau se soulève (`translateY(-8px)`) avec une ombre qui
     s'accentue (`box-shadow` plus large/plus sombre), et le badge
     numéroté grossit légèrement en pivotant (`scale(1.12) rotate(-8deg)`)
     — un détail ludique qui n'était pas possible avec l'ancien losange
     (rotation déjà utilisée pour la forme elle-même, pas disponible comme
     effet de survol).
  2. Entrée en cascade retravaillée : plutôt que le reveal générique
     `[data-reveal-group] > *` du site (fondu + `translateY(20px)` simple,
     80ms d'écart entre enfants — toujours utilisé ailleurs, ex.
     `.contact-band-methods`), un override ciblé
     `.method-steps-list[data-reveal-group] > .method-step` combine fondu +
     montée plus prononcée + léger zoom (`translateY(36px) scale(0.96)` →
     `translateY(0) scale(1)`), avec un écart plus long entre les 3 cartes
     (140ms au lieu de 80ms) pour un effet plus posé/premium sur une
     section qui n'en contient que 3. Même schéma que l'override déjà en
     place sur `.promise-quote[data-reveal-group]` plus haut dans ce
     fichier (règle spécifique plutôt que modification de la règle
     générique partagée par tout le site) ; règle
     `prefers-reduced-motion: reduce` dédiée ajoutée en conséquence,
     cohérente avec la même convention.
  Si `clip-path: polygon(...)` réapparaît sur `.method-step-panel`, si le
  badge redevient un losange `rotate(45deg)` avec un `<span>` interne
  contre-tourné, ou si `.method-steps-list[data-reveal-group] >
  .method-step` disparaît (reveal retombé sur le générique simple), c'est
  un retour à une version précédente, à ne pas réintroduire sans qu'on le
  redemande.
  Vérifié par script Playwright (0 débordement à 390/768/1024/1440/1600/
  1920px, badge B2B confirmé identique aux 3 autres chiffres — même
  `background: transparent`, plus de `clip-path`) et capture d'écran
  (état normal + état survolé sur la 1ʳᵉ carte, confirmant le soulèvement
  et l'ombre accentuée). Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **5 sens — tracé de fond (guide complet) masqué, ne reste que le trait
  animé au scroll (2026-08-18)** (`.senses-journey-path-bg`, `style.css`) :
  demande explicite de la cliente ("fait apparaitre le trait petit à petit
  au scroll, pas qu'il soit déjà tracé en entier... change rien à part la
  manière dont il apparait"). **Le mécanisme d'apparition progressive
  existait déjà** — `journeyPath.style.strokeDashoffset` (`main.js`,
  `updateJourney()`) est piloté par la progression de scroll depuis la
  toute première version de cette section (`journeyPathLength * (1 -
  progress)`, vérifié par script Playwright : passe de la longueur totale
  à ~0 entre `progress=0` et `progress=1`, parfaitement linéaire). Ce
  n'était donc pas ce trait animé (`#sensesJourneyPath`,
  `.senses-journey-path`) que la cliente voyait "déjà tracé en entier" au
  chargement, mais **le second `<path>`, `.senses-journey-path-bg`** — un
  calque de guidage à faible opacité (16%) partageant exactement le même
  attribut `d`, affiché en fond, toujours visible en entier dès l'arrivée
  sur la section (jamais animé, contrairement au trait terracotta
  au-dessus). C'est ce guide statique qui donnait l'impression que le
  chemin entier était déjà dessiné avant même de scroller.
  **Corrigé en passant son `opacity` à 0** (une seule ligne ajoutée à la
  règle CSS existante) — l'élément et son `d` (toujours mis à jour par
  `applyJourneyLayout()` dans `main.js`, au redimensionnement
  desktop/mobile) restent inchangés dans le HTML/JS, volontairement : la
  demande était explicitement de ne rien changer d'autre que l'apparence.
  Les bornes (`.senses-journey-dot-group`, cercles numérotés 1-5) ne sont
  pas concernées — ce sont des éléments séparés, positionnés
  indépendamment du tracé animé, donc le chemin continue de les traverser
  exactement comme avant, seul son mode d'apparition change. Si l'opacité
  de `.senses-journey-path-bg` remonte au-dessus de 0, le chemin complet
  redevient visible dès l'arrivée sur la section — à ne pas réintroduire
  sans qu'on le redemande.
  Vérifié par script Playwright : `strokeDashoffset` mesuré à 7 fractions
  de progression (0 → 1), confirmant un tracé strictement progressif ;
  capture d'écran à `progress≈0.02` (juste un petit segment près de la
  borne 1, rien d'autre visible) et `progress≈0.45` (trait dessiné jusqu'à
  mi-chemin de la borne 2→3, bornes 3/4/5 encore non atteintes visibles en
  attente). Regression complète 5 pages × 2 viewports : 0 débordement,
  0 erreur console.
- **Engagements — fond bleu Méditerranéen uni (2026-08-18)**
  (`.engagements`, `engagements.html`) : demande explicite de la cliente
  sur la section des flip-cards (celle littéralement nommée "engagements",
  à ne pas confondre avec la section fondatrice ci-dessous). Remplace le
  fond dynamique de l'itération précédente (dégradé navy de base +
  `.engagements::before`, trois `radial-gradient` très floutés en dérive
  continue façon lueurs, `@keyframes engagementsBgDrift`) par un simple
  `background: var(--navy)` uni — le pseudo-élément animé et ses
  keyframes sont supprimés. Si `.engagements::before`/
  `@keyframes engagementsBgDrift` réapparaissent ici, c'est cette ancienne
  version, à ne pas réintroduire sans qu'on le redemande. Vérifié par
  capture d'écran : fond bleu Méditerranéen (`--navy`) plat, les 4
  flip-cards restent parfaitement lisibles dessus.
- **Fondatrice — citation "inscrite au fond d'une assiette", décor de
  table Dolce Vita (2026-08-18)** (`.founder*`, `engagements.html`) :
  demande explicite de la cliente, en co-construction ("travaillons ça
  ensemble") — remplace la typographie centrée minimaliste sur fond crème
  uni (itération précédente, elle-même un remplacement de deux versions
  encore antérieures — plaque bicolore, carte postale sur photo floutée —
  déjà documentées plus haut dans ce fichier). Si `.founder-minimal`/
  `.founder-quote-minimal`/`.founder-rule` réapparaissent directement
  enfants de `.container` (sans `.founder-scene`/`.founder-plate`), c'est
  cette version minimaliste précédente, à ne pas réintroduire sans qu'on
  le redemande.
  **Décor de table** : `.founder-scene-photo` — `evenement-tablee-diner-bougies.jpg`,
  déjà utilisée plus haut sur cette même page dans la grille de flip-cards
  Engagements, réutilisée ici avec un traitement très différent (floutée
  `blur(7px)` + assombrie + `scale(1.08)` pour ne jamais laisser de bord
  net visible en fond plein cadre, au lieu d'une photo nette au premier
  plan) — aucun nouveau crédit requis (photo Simposio réelle). Par-dessus,
  `.founder-scene-scrim` : un dégradé terracotta → rouge Venise → navy
  foncé, pour la couleur chaude "Dolce Vita" demandée en plus de la simple
  lisibilité du texte (un scrim neutre gris/noir n'aurait apporté que la
  lisibilité, pas la couleur). **Toujours aucune photo fabriquée
  d'Estelle** (règle du site) : la photo de fond est une ambiance de table
  dressée réelle, jamais un portrait.
  **L'assiette** (`.founder-plate`) : un cercle crème
  (`radial-gradient(circle at 38% 32%, #fffdf8, var(--cream) 72%)`, effet
  de lumière rasante) avec un rebord décoratif façon céramique italienne —
  3 cercles SVG concentriques (`.founder-plate-rim-outer` plein terracotta,
  `.founder-plate-rim-dashes` pointillé rouge Venise, `.founder-plate-rim-inner`
  fin terracotta à 55% d'opacité) — plutôt qu'une photo de vraie assiette
  (l'option écartée : une assiette photographiée avec son propre décor
  aurait entré en conflit visuel avec le texte posé dessus ; un cercle
  CSS/SVG garde un contrôle total sur la lisibilité tout en restant
  entièrement dans la palette de marque). La citation vit dans ce cercle
  (`.founder-quote-plate`), en italique (`--font-display`), couleur
  `--rosso-ombria` — évoque une peinture/glaçure sur céramique plutôt
  qu'une simple couleur de texte.
  **Bug réel rencontré et corrigé, en deux temps, aucun supposé sans
  mesure** : la 1ʳᵉ version centrait la citation via `.founder-plate` en
  `display:flex; padding:20%` — deux problèmes en cascade, repérés par
  script Playwright comparant largeur/hauteur mesurées du cercle et du
  texte (pas par relecture du CSS seule) :
  1. Un pourcentage de `padding` se résout par rapport à la largeur du
     conteneur PARENT (`.founder-scene`, ~1200px+), pas de l'élément
     lui-même — sur un cercle de ~470px, `padding:20%` valait donc
     plusieurs centaines de pixels de chaque côté, écrasant la largeur de
     contenu disponible à 0 (`quoteWidth` mesuré à 0px).
  2. Ce texte à largeur nulle repartait mot par mot sur une hauteur
     énorme (`quoteHeight` mesuré à plus de 700px), qui à son tour étirait
     le cercle parent en ovale ~2× plus haut que large (un flex item sans
     hauteur explicite prend par défaut le contenu comme hauteur minimale,
     au-delà de ce qu'imposerait `aspect-ratio`).
  **Corrigé en repositionnant la citation en `position:absolute; inset:20%`**
  (plutôt qu'un padding sur un parent flex) : un pourcentage d'`inset` sur
  un élément absolument positionné se résout par rapport à son bloc
  englobant (`.founder-plate`, `position:relative`) — donc 20% signifie
  bien 20% du diamètre du cercle lui-même, quelle que soit la largeur de
  la page. Étant hors flux, ce texte ne peut plus non plus influencer la
  hauteur de son parent, donc `aspect-ratio:1` reste fiable sans avoir
  besoin d'un `min-height:0` de secours. Revérifié : cercle parfaitement
  carré (398.55×398.55px à 1440px de large) à toutes les largeurs
  testées, texte entièrement contenu dans le disque (comparaison des 4
  coins du texte à la distance du centre vs. le rayon du cercle).
  **La carte-nom** (`.founder-card`) : sous l'assiette, une petite carte
  crème légèrement inclinée (`rotate(-1.6deg)`), façon marque-place posé
  sur la table — reprend telles quelles les classes déjà établies
  `.founder-avatar-minimal`/`.founder-signature-minimal` de la version
  précédente (médaillon "EL" à contour fin + nom/rattachement Eurheka
  Conseil), avec l'eyebrow "La fondatrice" déplacé de son emplacement
  précédent (au-dessus de la citation) vers cette carte — l'assiette porte
  désormais uniquement la citation, la carte porte l'identité, comme deux
  éléments distincts d'une même mise en table plutôt qu'un bloc de texte
  unique.
  Vérifié par script Playwright (0 débordement à 390/768/1024/1440/1920px,
  texte de citation entièrement contenu dans le cercle aux 5 largeurs) et
  capture d'écran desktop + mobile. Regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console. **Explicitement une base
  de travail à affiner ensemble** (couverts/accessoires de table
  supplémentaires, ajustement des couleurs/tailles...) plutôt qu'une
  version considérée figée.
- **Fondatrice — remplacée par une plongée au scroll dans une photo réelle
  du stand Vespa, carte de menu sur le comptoir (2026-08-18)**
  (`.founder-dive*`, `.founder-scene*`, `.founder-menu-card*`,
  `engagements.html`) : remplace entièrement l'assiette CSS/SVG du bullet
  précédent, sur cahier des charges précis de la cliente. Si
  `.founder-scene`/`.founder-plate`/`.founder-quote-plate` réapparaissent,
  c'est cette version assiette, à ne pas réintroduire sans qu'on le
  redemande (historique complet des 3 versions encore antérieures — plaque
  bicolore, carte postale sur photo floutée, typographie minimaliste —
  déjà documenté plus haut).
  **Contrainte outillage explicitement posée avant de commencer** : la
  cliente demandait de retirer par retouche photo les sachets de pâtes
  visibles sur une photo de stand Vespa et de détourer la scène
  (mur/escalier/sol). Aucun outil de retouche générative/inpainting n'est
  disponible dans cet environnement de développement (uniquement du code,
  pas de Photoshop/IA d'édition d'image) — un détourage ou un effacement
  d'objet pixel par pixel via script aurait rendu un résultat visiblement
  bricolé, à l'opposé du standard premium tenu partout ailleurs sur ce
  site. Dit explicitement à la cliente, qui a tranché pour l'option
  proposée : une carte de menu en CSS/SVG posée PAR-DESSUS l'emplacement
  des pâtes (qui restent sous la carte, invisibles à l'écran, jamais
  effacées), et un recadrage + vignettage (pas un détourage) pour le
  mur/escalier/sol.
  **Photo source identifiée** : la cliente décrivait une image jointe
  (`image_5a35c9.jpg`) qui n'est en réalité jamais arrivée dans la
  session (aucun fichier reçu, vérifié sur le disque) — mais sa
  description (comptoir en céramique à motifs citron, sachets de pâtes,
  stand Vespa) correspondait exactement à `evenement-vespa-fleurie-lemon.jpg`,
  déjà présente dans `assets/img/` mais inutilisée sur le site jusqu'ici
  (photo Simposio réelle, résolution source limitée déjà documentée dans
  ce fichier — non retouchée davantage ici que par le crop/vignettage
  ci-dessous, aucun agrandissement).
  **Recadrage + vignettage** (nouveau fichier dérivé
  `evenement-vespa-fleurie-lemon-scene.jpg`, généré par un script Python/
  Pillow, voir `assets/img/CREDITS.md` pour le détail) : le tiers de mur
  vide au-dessus du parasol est recadré (1875px de haut → 1595px, les
  280px du haut retirés), puis un vignettage radial doux (assombrissement
  progressif vers les bords, jusqu'à ~32% aux coins, centré légèrement
  au-dessus du comptoir) atténue le reste du mur ainsi que l'escalier en
  pierre visible en bas à gauche — sans effacer ni inventer aucun pixel,
  contrairement à un détourage qui aurait nécessité un outil non
  disponible ici.
  **Structure, en pin façon `.senses-journey`/`.values-reel`** :
  `.founder-dive` (wrapper `height:280vh`, fournit la distance de scroll)
  contient `.founder-dive-sticky` (`position:sticky; height:100vh`) avec
  l'eyebrow "La fondatrice" (fixe), `.founder-scene-frame` (cadre visible,
  `overflow:hidden`, `aspect-ratio:1500/1595` — identique à la photo
  recadrée, pour que les pourcentages de position de la carte
  correspondent exactement aux pixels réels de la photo) et
  `.founder-scene-caption` (signature, apparaît en fondu en fin de
  parcours). À l'intérieur du cadre, `.founder-scene-zoom` enveloppe À LA
  FOIS la photo et `.founder-menu-card` — les deux sont donc scalées
  ensemble comme un seul bloc rigide par `updateFounderDive()`
  (`main.js`), garantissant que la carte reste verrouillée au même endroit
  visuel de la photo à chaque étape du zoom sans calcul de parallaxe
  séparé. `transform-origin` de `.founder-scene-zoom` calé sur la position
  réelle de la carte (38.7% / 52.7%, mesurée par script Python sur l'image
  recadrée) : le zoom "plonge" donc précisément vers la carte plutôt que
  vers le centre générique du cadre.
  **Position de la carte** : mesurée par script Python (crop successifs +
  inspection visuelle) sur la photo recadrée — bbox des sachets de pâtes à
  28.7–48.7% en largeur, 45.8–59.6% en hauteur. `.founder-menu-card` est
  positionnée à 26–51% / 43–62% (légère marge de sécurité sur la bbox
  mesurée) avec une rotation `-2.5deg` pour suivre la perspective du
  comptoir (qui recule légèrement vers la droite sur la photo) — vérifié
  par capture d'écran rapprochée : aucun sachet ni étiquette ne dépasse
  des bords de la carte. 4 coins décoratifs (`.founder-menu-card-corner`,
  traits terracotta en L) + un double-liséré (`::before`, rouge Venise) —
  ce sont les "petites décorations aux couleurs de Simposio sur les
  bords" demandées.
  **Deux bugs réels de dimensionnement du texte, trouvés et corrigés en
  cascade, tous deux repérés par mesure Playwright (jamais supposés)** :
  1. `padding: 9% 10%` sur `.founder-menu-card` — un pourcentage de
     padding se résout par rapport à la largeur du conteneur ENGLOBANT
     (`.founder-scene-zoom`, ~544px), pas de la carte elle-même (~136px) —
     même piège que celui déjà rencontré et corrigé sur l'assiette de la
     version précédente, mais réintroduit ici sans y penser. Ça donnait
     ~49–54px de padding de chaque côté sur une carte de 136px de large,
     ne laissant quasiment plus de largeur pour le texte (~25px), qui
     débordait alors massivement en hauteur hors de la carte
     (`quoteScrollH` mesuré à 262px pour une carte de 108px de haut) — le
     texte se retrouvait visible sous la carte, sur le motif en céramique,
     au lieu de rester contenu dans son cadre crème. Repéré par capture
     d'écran (`dive_100.png`, dernière ligne de la citation visible hors
     de la carte) puis confirmé par script.
  2. Une fois le padding corrigé (fixe, en px), un `font-size` en
     `clamp()`/`vw` ne suivait pas fidèlement la taille RÉELLE de la
     carte, qui est un pourcentage d'un cadre dont la largeur plafonne de
     façon non linéaire (`min(80vw, 34rem)`) — la carte passe d'environ
     307px de large en grand écran à ~62px sur mobile étroit (390px et
     moins), un rapport qu'aucune unité CSS testée ne suit correctement.
     Un essai avec les unités de conteneur CSS (`container-type:
     inline-size` + `cqw`) — la solution "propre" en théorie — s'est
     résolu à des tailles de police quasi nulles dans cet environnement
     (`font-size` calculé à 0px sur plusieurs largeurs testées) : support
     de Container Queries pas assez fiable ici pour en dépendre seul, sans
     compter l'incertitude sur les navigateurs réels des visiteurs du
     site. Écarté au profit d'un calcul JS (`fitFounderCard()`,
     `main.js`) — même principe que `fitPromiseLines()` déjà établi
     ailleurs sur le site : mesure l'espace réellement disponible dans la
     carte (hauteur moins padding) et réduit `font-size` par pas de 0.4px
     jusqu'à ce que `scrollHeight` du texte tienne dans cet espace, avec
     une marge de sécurité de 4% ; appelée au chargement, après
     `document.fonts.ready` (même précaution que `fitPromiseLines()`,
     déjà documentée comme nécessaire pour éviter une mesure prise avec
     la police de repli du navigateur) et au resize.
  **Zoom au scroll** (`updateFounderDive()`, `main.js`) : mapping direct
  1:1 avec la progression de scroll dans `.founder-dive` (même mécanisme
  que `updateJourney()`/`updateValuesReel()` — `rAF`-throttlé sur
  `scroll`), `scale = 1 + progress × 2.4` (donc jusqu'à ×3.4 en fin de
  parcours) appliqué à `.founder-scene-zoom`. Comme le tracé des 5 sens et
  le fil des Valeurs, ce mapping reste actif sous
  `prefers-reduced-motion` (mouvement piloté par le geste de l'utilisateur,
  pas une animation autoplay) — seule la transition d'apparition de la
  signature est coupée sous cette préférence. La signature
  (`.founder-scene-caption`) apparaît en fondu une fois `progress > 0.72`
  (les derniers 22% du scroll), pour se révéler seulement une fois la
  carte suffisamment agrandie/lisible.
  Vérifié par script Playwright : `scale` mesuré à 5 fractions de
  progression (1 → 3.4, linéaire), fondu de la signature confirmé
  (opacité 0 avant 72%, croissante ensuite), citation entièrement lisible
  et contenue dans la carte à son plus grand zoom, aucun sachet de pâtes
  visible autour de la carte à aucun niveau de zoom (0 débordement du
  texte, 0 fragment de sachet visible) à 320/390/768/1024/1440/1600/
  1920px. Regression complète 5 pages × 2 viewports : 0 débordement,
  0 erreur console.
- **Fondatrice — remplace la photo par un vrai détourage 2D transparent,
  carte qui se matérialise (2026-08-18)** (`.founder-dive*`,
  `.founder-menu-card*`, `founder-vespa-cutout.webp`, `engagements.html`) :
  la cliente a explicitement rejeté l'itération précédente (photo
  recadrée/vignettée avec carte posée dessus) — "oublie la photo... une
  modélisation 2D ultra réaliste... fidèle à ce qui s'y trouve et la
  disposition des éléments... intègre-le comme s'il était en 2D", puis,
  sur la carte : qu'elle soit invisible avant le zoom et se matérialise
  progressivement sur le comptoir plutôt que d'être déjà là. Si
  `.founder-scene-photo`/`evenement-vespa-fleurie-lemon-scene.jpg`
  réapparaissent, c'est cette ancienne version photo, à ne pas
  réintroduire sans qu'on le redemande (fichier supprimé du dépôt).
  **Détourage plutôt qu'illustration dessinée** : la cliente demandait une
  "modélisation 2D", mais aucun outil de génération d'image n'est
  disponible dans cet environnement — dessiner à la main une illustration
  vectorielle d'un niveau photoréaliste (céramique peinte à motifs citron,
  parasol à franges, chrome de la Vespa...) n'est pas faisable, et un essai
  aurait rendu un résultat visiblement amateur. Compromis assumé et
  explicité à la cliente : détourer la vraie photo (segmentation, pas de
  pixel inventé) pour obtenir un objet 2D à fond transparent, fidèle par
  construction puisque ce sont les pixels réels de la photo.
  **Trois méthodes de segmentation essayées, deux écartées** :
  1. `rembg`/u2net (réseau de neurones généraliste, salient-object) :
     traite la Vespa comme arrière-plan et la fait quasiment disparaître
     (probablement à cause de sa couleur crème claire, proche des tons
     "incertain" appris par le modèle) — écarté après inspection visuelle
     du résultat.
  2. `rembg`/isnet-general-use, avec `alpha_matting` : pire — la Vespa
     devient un fantôme translucide, le matting confondant ses zones
     blanches avec de l'arrière-plan incertain — écarté aussi.
  3. **OpenCV GrabCut (retenu)** : algorithme de segmentation classique
     par graph-cut sur les couleurs/textures — moins "intelligent" que les
     modèles ci-dessus, mais piloté directement par des rectangles de
     premier-plan/arrière-plan placés à la main (`cv2.GC_FGD`/`GC_BGD`),
     ce qui le rend prévisible et corrigible point par point,
     contrairement à une boîte noire neuronale. A gardé la Vespa intacte
     dès le premier essai. Affiné sur plusieurs passes (script Python
     autonome, jamais commité — un dérivé du fichier source, comme les
     autres traitements d'image de ce projet) : un premier essai avec un
     seul rectangle englobant a laissé passer le mur/la fenêtre en
     arrière-plan (à l'intérieur du rectangle, non distingués du
     premier-plan) ; passage à `GC_INIT_WITH_MASK` avec des graines
     précises placées après inspection d'une grille de coordonnées
     superposée à la photo (pas au jugé) a corrigé la plupart des fuites,
     mais chaque graine mal placée créait un nouveau dégât ailleurs (un
     trou dans le parasol, un panier détaché de ses étiquettes) — corrigé
     itérativement, capture d'écran à l'appui à chaque passe, jamais un
     changement appliqué à l'aveugle.
  **Limite assumée, non résolue** : un fragment de mur/fenêtre reste
  visible derrière un massif de verdure sur la droite de la composition —
  le buisson recouvre partiellement une fenêtre en arrière-plan, rendant
  la séparation pixel par pixel particulièrement difficile à cet endroit
  précis (essai d'un seuillage colorimétrique local pour l'isoler
  spécifiquement : a empiré le résultat plutôt que de l'améliorer, annulé).
  Décision : sacrifier proprement le buisson concerné (rectangle marqué
  arrière-plan) plutôt que de continuer à risquer d'abîmer le reste d'un
  détourage par ailleurs propre — la cliente a validé ce compromis avant
  que le travail de construction de l'animation ne commence (capture
  envoyée, question posée explicitement).
  **Export** : `founder-vespa-cutout.webp` (recadré à la boîte englobante
  du détourage, fond RGBA transparent) — WebP plutôt que PNG pour la
  taille de fichier (~470 Ko contre ~3,6 Mo en PNG, rendu visuellement
  identique) ; aucun fallback `<picture>` nécessaire, WebP a un support
  navigateur universel aujourd'hui.
  **Présentation "objet 2D posé sur un aplat"** : `.founder-scene-frame`
  perd son fond/ombre/coins arrondis de card photo — la découpe repose
  directement sur le bleu Méditerranéen (`--navy-900`) de `.founder-dive`,
  sans bordure ni cadre visible. `.founder-scene-cutout` utilise
  `filter:drop-shadow()` (pas `box-shadow`) : l'ombre épouse la silhouette
  détourée (parasol, Vespa...) plutôt que de projeter l'ombre d'un
  rectangle photo — c'est ce qui fait lire l'ensemble comme un sticker/une
  découpe posée sur la page plutôt qu'une photo encadrée.
  **Matérialisation de la carte** (`updateFounderDive()`, `main.js`) :
  la carte démarre invisible (`opacity:0` en CSS, filet de sécurité) et le
  scroll pilote *trois* propriétés en phase avec le même `progress` que le
  zoom — `opacity` (0→1 entre `progress` 0.12 et 0.42), `filter:blur()`
  (6px→0, effet de mise au point progressive) et une translation verticale
  (`translateY(10px)→0`, comme si la carte se "posait" sur le comptoir) —
  plutôt qu'un simple fondu, pour une matérialisation plus crédible.
  Pleinement visible et nette entre `progress` 0.42 et la fin, laissant le
  temps du zoom restant pour la lire confortablement.
  **Bug de cadrage trouvé et corrigé à l'échelle maximale** : le
  `transform-origin` de `.founder-scene-zoom`, d'abord calé pile sur le
  centre géométrique de la carte (32.5%, 45.8%), poussait le bord gauche
  de la carte hors du cadre visible à l'échelle maximale (×3,4) — repéré
  par capture d'écran (le "S" de "Simposio" et le "l'" d'"envie" rognés
  au ras du bord), pas supposé. Cause : 32,5% n'est pas le centre du
  cadre (50%), donc une mise à l'échelle centrée sur ce point déporte
  mécaniquement le contenu agrandi vers la gauche. Corrigé en décalant le
  `transform-origin` en x à 25,1% (calculé pour équilibrer les marges
  gauche/droite à l'échelle ×3,4 exactement) — recentre la carte agrandie
  dans le cadre en fin de parcours sans changer sa position réelle sur le
  comptoir aux échelles faibles/intermédiaires (l'écart ne devient
  perceptible qu'à mesure que l'échelle s'éloigne de 1).
  Vérifié par script Playwright + capture d'écran à plusieurs fractions de
  progression (0, 0.1, 0.25, 0.42, 0.6, 1) sur desktop et mobile : carte
  invisible avant 0.12, matérialisation confirmée par mesure directe
  d'`opacity`/`filter`/`transform`, citation entièrement lisible et
  contenue dans le cadre à l'échelle maximale (plus de rognage), aucune
  régression sur le reste du détourage. Regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console, 0 lien/asset cassé
  (l'ancien fichier photo a été supprimé du dépôt).
- **Fondatrice — traitement duotone ("modélisation, pas l'image"), carte
  redessinée, bug de rendu du drop-shadow corrigé (2026-08-18, même
  journée)** (`founder-vespa-cutout.webp`, `.founder-menu-card*`,
  `.founder-scene-cutout`, `engagements.html`/`style.css`/`main.js`) : la
  cliente a rejeté le détourage couleur du bullet précédent ("Je t'ai dit
  que je veux une modélisation de l'image, pas l'image elle-même et que tu
  découpes uniquement le stand. Par ailleurs la carte est vraiment moche
  retravaille tout ça pour que ça fasse élégant.") — deux corrections
  distinctes.
  **"Modélisation, pas l'image elle-même"** : une tentative d'illustration
  vectorielle dessinée à la main (Vespa en SVG simplifié) a été essayée en
  premier et écartée après rendu — beaucoup trop grossière/amateur pour le
  niveau de finition attendu sur ce site (aucun outil de génération d'image
  disponible dans cet environnement pour produire une illustration
  crédible, cf. limitation déjà documentée). Remplacé par un traitement
  **duotone** du détourage réel (toujours issu de GrabCut, cf. bullet
  précédent, aucun pixel modifié) : luminance de chaque pixel interpolée
  entre le Bleu Méditerranéen foncé (`--navy-900`) et le Blanc Calcaire
  (`--cream`), canal alpha d'origine conservé à l'identique (script Pillow/
  numpy, non commité — dérivé comme les autres traitements photo du
  projet). Le résultat se lit comme une gravure/illustration éditoriale
  plutôt qu'une photo filtrée — validé visuellement avant application (une
  version composée sur fond navy a été inspectée) puis confirmé une fois
  en place sur la page réelle. Dimensions inchangées (1362×1369) donc
  aucun recalcul des pourcentages de position de la carte ni du
  `transform-origin` du zoom n'a été nécessaire.
  **"Découpe uniquement le stand" — tenté puis explicitement abandonné** :
  un essai de recadrage pour exclure un panier en osier secondaire visible
  à droite de la composition a été fait, mesuré par script Python (analyse
  colonne par colonne de l'opacité) — mais le panier et la carrosserie
  arrière de la Vespa se chevauchent en pixels sur toute cette zone (aucune
  colonne totalement transparente entre les deux), rendant impossible une
  découpe rectangulaire propre. Un premier essai de recadrage a produit un
  bord net tranchant en plein milieu du scooter, repéré par capture d'écran
  avant d'être appliqué au site — abandonné. Le fichier livré garde donc
  l'assemblage complet du stand (parasol, meuble en céramique, Vespa et
  panier), qui reste cohérent comme un seul élément de décor. Si un
  recadrage partiel de `founder-vespa-cutout.webp` réapparaît ici, vérifier
  d'abord par un script d'opacité colonne par colonne qu'aucune découpe
  franche du Vespa n'est réintroduite.
  **Carte "vraiment moche" — retravaillée** (`.founder-menu-card`,
  `style.css`) : les 4 coins décoratifs en L (`.founder-menu-card-corner-*`)
  et le double liséré pointillé-devenu-plein intérieur
  (`.founder-menu-card::before`) — jugés trop chargés, effet "enseigne de
  motel" — sont entièrement retirés (HTML et CSS) et remplacés par un seul
  petit ornement minimal (`.founder-menu-card-ornament` : un fin trait
  terracotta horizontal avec un losange centré) posé au-dessus de la
  citation. La carte elle-même est adoucie : `border-radius` de `3px` à
  `9px`, la bordure fine `rgba(navy,0.16)` est retirée (le `box-shadow`
  seul suffit à détacher la carte du fond), l'ombre portée est éclaircie/
  diffusée (`0 14px 32px` + un liseré clair `inset` en haut plutôt qu'un
  simple `0 10px 26px` plat), la rotation réduite de `-2.5deg` à `-1.1deg`
  pour une pose plus posée. La disposition interne passe de
  `justify-content:center` (ligne unique) à `flex-direction:column;
  gap:6px` pour empiler l'ornement au-dessus du texte. **Piège de padding
  en `%` réintroduit puis corrigé sur-le-champ** : le premier jet utilisait
  `padding:9% 10%` sur `.founder-menu-card` — comme déjà documenté et
  corrigé une fois pour cette même carte (bullet précédent), un pourcentage
  de padding se résout par rapport à la largeur du conteneur ENGLOBANT
  (`.founder-scene-zoom`, ~544px), pas de la carte elle-même (~131px) ;
  repéré avant publication (pas seulement corrigé après coup) et remplacé
  par un padding fixe (`8px 9px`). La rotation codée en dur dans
  `updateFounderDive()` (`main.js`, appliquée à chaque frame de scroll par-
  dessus la base CSS) a été mise à jour en conséquence (`-2.5deg` →
  `-1.1deg`), sans quoi le JS aurait écrasé la nouvelle rotation CSS à
  chaque tick de scroll.
  **Bug de rendu Chromium réel trouvé et corrigé, sans lien avec les deux
  demandes ci-dessus** : lors de la vérification par capture d'écran, un
  rectangle légèrement plus sombre que le fond navy restait visible en
  haut à droite du cadre, y compris dans des zones à 100% transparentes du
  détourage — confirmé par échantillonnage de pixels (le rectangle
  disparaissait entièrement quand `filter` était désactivé en JS dans la
  console). Cause : `filter:drop-shadow()` sur `.founder-scene-cutout`,
  combiné au `transform:scale()` du zoom au scroll porté par son parent
  `.founder-scene-zoom` — un vrai bug de rastérisation de filtre sur calque
  transformé, pas un réglage à ajuster. Deux contournements standards
  testés et écartés (aucun n'a fait disparaître le rectangle) : réduire le
  rayon de flou (`50px→18px`) et isoler l'image sur son propre calque de
  composition (`transform:translateZ(0)` + `will-change`). Le filtre a été
  retiré plutôt que contourné — le détourage duotone se suffit à lui-même
  sans ombre portée photographique, cohérent avec l'esprit "modélisation
  graphique" plutôt que photo. Si `filter:drop-shadow` réapparaît sur
  `.founder-scene-cutout`, revérifier ce bug (comparaison de pixels
  avant/après désactivation) avant de le garder.
  Vérifié par script Playwright (0 erreur console, 0 débordement horizontal,
  carte : opacité/rotation/`border-radius` mesurés conformes, texte de
  citation contenu dans la carte — `scrollHeight` ≤ hauteur disponible — à
  7 fractions de progression de scroll × desktop/mobile) et capture d'écran
  aux mêmes fractions. Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console, 0 lien/asset cassé.
- **Fondatrice — refonte complète en "mini vidéo" cinématique avec de
  vraies photos, remplace tout le travail sur le détourage (2026-08-18,
  même journée)** (`.founder-story*`, `updateFounderStory()` dans
  `main.js`, `engagements.html`) : la cliente a rejeté l'ensemble des
  itérations précédentes sur le détourage/traitement graphique du stand
  Vespa ("ça ne me plaît pas du tout") et a demandé autre chose en
  substance : *"une sorte de mini vidéo dans laquelle on a l'impression de
  passer dans un évènement tourné autour de la Dolce Vita et qu'on plonge
  jusqu'à soit une carte soit un menu soit une assiette dans laquelle on
  retrouvera la citation, mais tout ça de manière à ce que ce soit comme
  dans la vie réelle."* **Remplace entièrement** la section précédente
  (détourage/duotone du stand Vespa + carte de menu matérialisée,
  `.founder-dive*`/`.founder-scene-*`/`.founder-menu-card*`,
  `founder-vespa-cutout.webp` — fichier supprimé du dépôt, `git rm`) : si
  l'une de ces classes ou ce fichier réapparaissent dans un diff, c'est
  cette ancienne version, à ne pas réintroduire sans qu'on le redemande
  (historique complet des ~10 itérations précédentes de cette section —
  plaque bicolore, carte postale sur photo floutée, typographie
  minimaliste, assiette CSS/SVG, détourage GrabCut couleur puis duotone —
  conservé plus haut dans ce fichier pour référence).
  **"Comme dans la vie réelle" = de vraies photos, pas de détourage/
  synthèse** : le site est statique sans backend et aucun outil de
  génération/composition vidéo ou d'image photoréaliste n'est disponible
  dans cet environnement — une "mini vidéo" au sens propre (fichier .mp4)
  n'était donc pas réalisable en gardant l'exigence de réalisme. Traduit
  en une séquence cinématique **pilotée par le scroll** (même famille de
  mécanisme que `.senses-journey`/`.values-reel`, déjà établie sur le
  site) construite à partir de **4 vraies photos Simposio non retouchées**,
  déjà utilisées ailleurs sur le site (aucun nouveau crédit,
  `assets/img/CREDITS.md` mis à jour) : `evenement-parasols-jaunes-
  table.jpg` (plan large — arrivée sous les parasols, tables encore vides)
  → `evenement-tablee-diner-bougies.jpg` (plan moyen — à table, bougies et
  bouquets) → `evenement-rangee-spritz.jpg` (détail — rangée de spritz,
  moment aperitivo) → `evenement-assiette-agrume-ceramique.jpg` (très gros
  plan — l'assiette). Une vraie progression narrative "on entre dans
  l'évènement puis on s'en approche", pas une suite de photos
  interchangeables — répond directement à "on a l'impression de passer
  dans un évènement... et qu'on plonge".
  **La citation n'est jamais présentée comme "imprimée" sur l'assiette** :
  contrairement à toutes les tentatives précédentes (carte matérialisée,
  citation "au fond d'une assiette" en CSS/SVG...), elle apparaît ici en
  fondu par-dessus la scène finale, comme une citation de sortie éditoriale
  (technique classique de films/reportages d'évènementiel : un pull-quote
  qui apparaît sur un plan légèrement assombri) — délibérément honnête sur
  la nature de l'image (une vraie photo, pas un objet qui existerait
  réellement dans la scène) plutôt que de simuler un compositing
  photoréaliste hors de portée des outils disponibles ici.
  **Structure, plein écran** (contrairement à l'ancienne version qui
  restait dans un cadre étroit `.founder-scene-frame`) : `.founder-story`
  (wrapper, `height:420vh`) > `.founder-story-sticky`
  (`position:sticky; height:100vh`, occupe tout le viewport) contenant les
  4 `.founder-story-scene` (empilées en `position:absolute`, crossfade
  d'opacité + léger zoom avant continu par scène), deux bandes
  `.founder-story-letterbox` (haut/bas, fixes, effet "format cinéma" —
  renforce l'impression de "mini vidéo" sans nécessiter de vrai fichier
  vidéo), un `.founder-story-scrim` (dégradé sombre, ne s'intensifie qu'en
  toute fin de parcours pour ne pas assombrir les 3 premières scènes) et
  `.founder-story-quote` (citation + signature, fondu en toute fin).
  4 petits points (`.founder-story-dots`) indiquent la scène active.
  **`updateFounderStory()` (`main.js`)** : 4 segments de progression
  (`[0, 0.24, 0.48, 0.7, 1]`, le dernier plus large pour laisser le temps
  au voile puis à la citation d'apparaître sans précipitation) déterminent
  la scène active (`.is-active`, crossfade géré par la `transition` CSS sur
  `opacity`) et un zoom avant local par scène (`scale` de 1 à 1.12 sur la
  fenêtre de progression propre à chaque scène). **Point de vigilance
  respecté dès la conception** (déjà rencontré et corrigé une fois sur
  `.values-reel-photo`, cf. plus haut dans ce fichier) : le zoom des
  scènes est appliqué en `style.transform` recalculé à chaque frame de
  scroll, **jamais** via une `transition`/`animation` CSS sur `transform`
  — seule `opacity` porte une `transition` CSS (une seule propriété, pas
  de risque de collision transition/animation). Voile et citation basculent
  aussi par simple ajout/retrait de classe (`.is-visible`) au-delà de
  seuils de progression (0.66 et 0.8).
  **Bug réel trouvé et corrigé avant publication, pas supposé** : un
  premier jet plaçait l'eyebrow "La fondatrice" À L'INTÉRIEUR de la bande
  `.founder-story-letterbox-top` (fine, 7vh ≈ 63px) — repéré par capture
  d'écran, le texte s'entrechoquait visuellement avec le header fixe du
  site (`z-index:100`, ~91px de haut, donc plus haut que la bande fine) :
  les deux occupaient la même zone en haut d'écran sans être clairement
  séparés. Corrigé en sortant l'eyebrow de la bande (qui reste une pure
  bande de couleur, sans contenu) et en le positionnant indépendamment
  avec la même marge de dégagement que `.page-header` utilise déjà pour le
  header fixe (`top:calc(6.5rem + 0.4rem)`).
  **`prefers-reduced-motion`** : comme le tracé des 5 sens et le fil des
  Valeurs, le crossfade et le zoom restent un mapping 1:1 avec le scroll
  (pas une animation autoplay) donc actifs même sous cette préférence —
  seules les `transition` (fondu, zoom des points) sont neutralisées pour
  un affichage instantané plutôt qu'un fondu forcé qui contredirait la
  préférence.
  **`founder-vespa-cutout.webp` supprimé du dépôt** (`git rm`, pas laissé
  comme fichier orphelin) : c'était un fichier dérivé (détourage/duotone),
  sans usage possible ailleurs contrairement à une vraie photo client —
  voir `assets/img/CREDITS.md` pour le détail. `fitFounderCard()` et
  toute la logique de mesure de police associée à l'ancienne carte de menu
  sont également retirées de `main.js` (plus de carte à dimensionner).
  Vérifié par script Playwright (10 fractions de progression × desktop/
  mobile : scène active, visibilité du voile/de la citation cohérentes
  avec les seuils, 0 erreur console, 0 débordement horizontal) et capture
  d'écran à chaque fraction sur les deux formats. Regression complète
  5 pages × 2 viewports : 0 débordement, 0 erreur console.
- **Fondatrice — remplacée par une vraie mini vidéo, citation composée dans
  les pixels de la carte (2026-08-18, même journée)**
  (`assets/video/founder-story.mp4`/`.webm`, `.founder-story*`,
  `engagements.html`) : la cliente a rejeté la séquence de 4 photos qui se
  crossfadaient ("ça ne me plaît pas du tout") et a fourni en référence un
  clip vidéo — demande : *"met une vidéo comme ça pour la citation mais sur
  la carte du menu intègre la citation comme s'il était déjà dans la
  vidéo"*. **Remplace entièrement** le mécanisme scroll-pin de 4 scènes
  (`.founder-story-scenes`/`.founder-story-scene`/`.founder-story-scrim`/
  `.founder-story-dots`/`.founder-story-quote`, `updateFounderStory()`
  dans `main.js`, bullet précédent) — si l'une de ces classes ou fonctions
  réapparaît ici, c'est cette ancienne version, à ne pas réintroduire sans
  qu'on le redemande.
  **La vidéo de référence est générée par IA (PixVerse.ai), pas un
  évènement réel** — détail complet, méthode de compositing et limites
  assumées (filigrane non retirable) documentés dans
  `assets/video/README.md`, résumé ici : la citation est composée
  directement dans les pixels de la vidéo (pas une surimpression HTML) via
  un suivi de perspective image par image (121 frames, OpenCV) sur la
  petite carte visible sur le comptoir dans le clip — une texture "carte"
  propre (fond crème, ornement, citation en Yeseva One, signature) est
  plaquée sur chaque frame en suivant exactement le mouvement de caméra du
  clip source, avec une matérialisation progressive (fondu, frames 90→104)
  plutôt qu'une apparition brutale. C'est la réponse directe à "comme s'il
  était déjà dans la vidéo".
  **Piège de warp rencontré et corrigé** : un premier rendu affichait des
  artefacts fantômes (copies floues du filigrane PixVerse à plusieurs
  endroits de l'image) — cause : `cv2.warpPerspective` avec
  `borderMode=cv2.BORDER_TRANSPARENT` laisse les pixels hors de la zone
  mappée à leur valeur mémoire NON INITIALISÉE plutôt que de les mettre à
  zéro (le nom du mode prête à confusion). Corrigé avec
  `borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0)`.
  **Structure, sans scroll-pin cette fois** : contrairement à toutes les
  sections scroll-pilotées du site (`.senses-journey`, `.values-reel`,
  l'ancienne version de cette section), `.founder-story` est un simple
  bloc `height:100vh` en flux normal — une vidéo a sa propre temporalité
  fixe en temps réel, qui ne se prête pas au scroll-scrubbing (source de
  bugs déjà rencontrée plusieurs fois ailleurs sur ce site) ; la vidéo se
  lance simplement une fois via `IntersectionObserver` quand la section
  entre dans le viewport (`main.js`), comme n'importe quelle vidéo intégrée
  standard. Bandes `.founder-story-letterbox` (cadre cinéma) et eyebrow "La
  fondatrice" conservés à l'identique de la version précédente (même
  correctif de collision avec le header fixe). Muette par défaut
  (`muted`), deux formats servis (`<source>` WebM/VP9 en premier, plus
  léger, puis MP4/H.264 pour la compatibilité la plus large notamment
  Safari) — encodés via un binaire ffmpeg statique (paquet Python
  `imageio-ffmpeg`, aucun ffmpeg système dans cet environnement).
  **Piège de vérification rencontré pendant cette tâche, sans rapport avec
  le site lui-même** : le Chromium de cet environnement de développement
  n'a AUCUN décodeur vidéo fonctionnel sur une page `data:text/html,...`
  (H.264 et VP9 tous deux en échec, y compris sur un clip VP9 minimal
  généré à la volée pour tester) — d'abord pris pour un bug du fichier
  vidéo produit. Revérifié sur le vrai `engagements.html` servi en
  `http://localhost` (pas une page `data:`) : lecture automatique
  fonctionnelle dès l'entrée dans le viewport, `readyState:4`,
  progression réelle de `currentTime`, `ended:true` en fin de lecture,
  capture d'écran confirmant la carte + citation intégrée bien visibles et
  figées sur la dernière frame. Le problème de lecture était donc
  spécifique aux pages `data:` de ce sandbox de test, pas au site.
  **Limites connues, à traiter avec la cliente avant mise en ligne
  définitive** (ajoutées à la section « Limites connues » plus bas) : le
  filigrane "PixVerse.ai" reste visible (aucun outil de retouche
  vidéo/inpainting disponible ici pour l'effacer proprement) et la scène
  est entièrement fabriquée par IA (aucune personne, lieu ni évènement
  réel) — à la différence de toutes les autres photos du site.
  Vérifié par regression Playwright complète (5 pages × 2 viewports) : 0
  débordement, 0 erreur console.
- **Fondatrice — trois filets de sécurité pour le démarrage de la vidéo
  (2026-08-18, même journée)** (`.founder-story-play`, `engagements.html`/
  `style.css`/`main.js`) : la cliente a signalé que la vidéo ne se lançait
  pas chez elle (visionnage en aperçu privé) alors qu'elle fonctionnait
  dans tous les tests menés ici (serveur local, ouverture directe du
  fichier, desktop et mobile). Cause la plus probable, non confirmée mais
  cohérente avec le symptôme : un aperçu affiché dans une iframe sans
  attribut `allow="autoplay"` bloque tout autoplay, y compris muet, quel
  que soit le mécanisme de déclenchement — hors de contrôle du code du
  site (c'est l'attribut de la page PARENTE qui embarque l'iframe qui en
  décide). Plutôt que de continuer à deviner, trois mécanismes sont
  désormais empilés, du plus automatique au plus manuel : (1) attribut
  HTML `autoplay` natif ; (2) `IntersectionObserver` (`main.js`) qui
  appelle `.play()` dès que la section est visible à 15% (seuil aligné sur
  le reveal générique du site, au lieu de 0.4 précédemment) ; (3) un
  bouton de lecture manuel (`.founder-story-play`, cercle translucide avec
  triangle "lecture", centré sur la vidéo) toujours visible tant que la
  vidéo n'a pas réellement démarré (masqué sur l'évènement `playing`, pas
  sur un simple appel à `.play()` qui peut échouer silencieusement).
  **Piège rencontré et corrigé pendant la mise en place de ce filet** : le
  gestionnaire de clic du bouton était attaché APRÈS le bloc
  `IntersectionObserver`, dans le même `if` non protégé — si
  `new IntersectionObserver(...)` avait levé une exception dans un
  contexte restreint (ex. un aperçu fournissant un global
  `IntersectionObserver` cassé/absent), le reste du bloc, y compris
  l'attachement du bouton, n'aurait jamais été exécuté : le filet de
  secours aurait été indisponible pile dans le scénario où il est le plus
  nécessaire. Corrigé en attachant le bouton EN PREMIER,
  inconditionnellement, puis en enveloppant l'initialisation de
  l'`IntersectionObserver` dans un `try/catch` séparé. Repéré en isolant le
  bouton dans un test Playwright dédié (autoplay et observer désactivés
  manuellement) — un premier test avait donné un faux négatif à cause d'un
  mock cassant par ailleurs le reste du script (`window.IntersectionObserver
  = undefined` rendait `"IntersectionObserver" in window` toujours vrai,
  donc `new IntersectionObserver` levait quand même une exception, y
  compris dans du code sitewide plus haut dans le même IIFE) — reproduit
  proprement en dispatchant un `click` directement via JS plutôt qu'en
  passant par les vérifications d'actionabilité de Playwright, confirmant
  que le bouton fonctionne correctement une fois cette regression de test
  écartée.
  Vérifié : lecture déclenchée par l'observer au scroll (`paused:false`,
  `currentTime` progresse, `ended:true` en fin de lecture), bouton masqué
  correctement une fois la lecture réellement commencée, clic manuel sur
  le bouton fonctionnel de façon indépendante. Regression complète 5 pages
  × 2 viewports : 0 débordement, 0 erreur console.
- **Fondatrice — la piste vidéo mise en pause, retour au minimalisme
  typographique (2026-08-18, même journée)** (`.founder`/
  `.founder-minimal*`, `engagements.html`) : la cliente n'a jamais réussi à
  voir la vidéo se lancer dans son contexte de visionnage (probablement un
  aperçu en iframe qui bloque tout autoplay indépendamment du code du
  site, cf. bullet précédent — jamais confirmé avec certitude faute
  d'accès à son environnement exact) et a tranché : *"retourne à une
  citation designer de manière plus minimaliste, mais garde cette idée de
  vidéo en tête"* — une mise en pause explicite, pas un rejet définitif.
  **La section active redevient une typographie minimaliste sur fond
  crème**, reprenant la structure de l'avant-dernière itération non-vidéo
  de cette section (une seule colonne centrée, eyebrow "La fondatrice",
  citation en Yeseva One directement sur le crème — texte inchangé mot
  pour mot, trait fin terracotta en séparateur, médaillon "EL" en simple
  contour + nom) — voir plus haut dans ce fichier pour le détail complet
  de cette composition déjà documentée une première fois. `.founder`
  repasse en fond `var(--bg)` (crème), ce qui referme l'alternance de la
  page (navy `.engagements` → crème-dim `.talents` → navy
  `.values-reel-sticky` → crème `.founder`).
  **Rien de la piste vidéo n'est supprimé** — demande explicite de la
  cliente de la garder "en tête" : `assets/video/founder-story.mp4`/
  `.webm`/`README.md` restent dans le dépôt tels quels (citation déjà
  composée dans les pixels de la carte, prête à être réactivée). Seuls le
  HTML actif (`.founder-story`, vidéo + bouton de lecture), le bloc CSS
  associé et la logique JS de lecture (`main.js`) sont retirés — code mort
  une fois la section vidéo hors service, mais rien qui empêche de la
  refaire pointer vers ces mêmes fichiers plus tard si la cliente
  redemande cette piste. Si le filigrane PixVerse peut être retiré
  entre-temps (export propre, prestataire de retouche), ce serait le bon
  moment pour le faire avant une éventuelle réactivation.
  Vérifié par script Playwright (0 débordement, 0 erreur console, 2
  viewports) et capture d'écran desktop + mobile. Regression complète
  5 pages × 2 viewports : 0 débordement, 0 erreur console.
- **Bandeau menu plein largeur, escalier de la méthodologie corrigé,
  bulles de mots-clés sur les formules Prestations (2026-08-19)** : trois
  demandes distinctes de la cliente sur trois zones différentes du site.
  **Header (`.site-header`, `style.css`, toutes les pages)** : la barre de
  navigation était une pilule flottante (`.site-header .container` portait
  elle-même le fond/flou/bordure, avec `border-radius:999px` et un
  `max-width` réduit de 3rem par rapport au reste du site) — la cliente a
  demandé qu'elle prenne toute la largeur. Le fond/flou/bordure/`border-bottom`
  sont déplacés sur `.site-header` (déjà `inset-inline:0`, donc bord à bord
  par nature), `.site-header .container` n'a plus de style propre et
  hérite simplement de la règle `.container` générique du site — effet de
  bord : le contenu (logo, icônes, bouton menu) s'aligne maintenant très
  exactement sur les mêmes marges que le reste du contenu de chaque page,
  ce qui n'était pas garanti avant (la pilule avait son propre padding
  fixe `0.6rem 0.6rem 0.6rem 1.6rem`, sans rapport avec le padding-inline
  responsive de `.container`). Si `border-radius:999px` ou un `max-width`
  réduit réapparaissent sur `.site-header .container`, c'est cette
  ancienne pilule flottante, à ne pas réintroduire sans qu'on le redemande.
  **Méthodologie (`.method-step-2`/`.method-step-3`, `index.html`)** : les
  3 panneaux "Écouter"/"Concevoir"/"Orchestrer" étaient déjà légèrement
  décalés horizontalement (`margin-left`), mais selon un zigzag — panneau 2
  décalé de `6vw`/`3.5rem`, panneau 3 seulement `3vw`/`1.75rem` (donc en
  retrait par rapport au 2, pas un vrai escalier qui continue de descendre).
  La cliente a demandé de corriger l'irrégularité ("recentre les données
  correctement pour avoir les mêmes écarts partout... le décalage fait en
  escalier"). Corrigé en donnant aux deux marches le même incrément —
  `4vw`/`2.25rem` pour la 2ᵉ, exactement le double (`8vw`/`4.5rem`) pour la
  3ᵉ — l'écart marche 1→2 est désormais strictement égal à l'écart marche
  2→3 (mesuré par script Playwright : 36px puis 36px à 1440px de large),
  un vrai escalier à pas régulier plutôt qu'un aller-retour.
  **Formules Prestations (`prestations.html`, les 4 `<article class="world">`)** :
  le long paragraphe descriptif (`.desc`) de chaque formule est retiré et
  remplacé par 3-4 petites étiquettes de mots-clés (`.world-tags-wrap` >
  `.container` > `.world-tags`, nouvel élément frère de `.world-media`/
  `.world-copy` dans `.world`, pas un enfant du bloc de texte centré
  verticalement) ancrées au bas de la photo plein cadre plutôt que dans le
  texte — demande explicite, avec liberté sur le style visuel des
  étiquettes. Effet verre dépoli choisi (`background:rgba(cream,0.14)` +
  `backdrop-filter:blur(16px) saturate(160%)` + liseré clair) plutôt qu'un
  aplat de couleur : reste lisible quelle que soit la photo en fond, sans
  ajouter une teinte par formule à gérer. Alignées à gauche (Cartolina,
  Aperitivo) ou à droite (Esperienza, Tavola) en écho au texte de la
  formule au-dessus, imbriquées dans leur propre `.container` pour
  s'aligner exactement sur les mêmes marges que `.world-copy` — sous
  700px, toutes repassent à gauche (comme `.world-copy-inner` sur mobile,
  cf. règle existante juste au-dessus dans le fichier). Mots-clés choisis
  en reprenant directement les éléments énumérés dans les anciens
  paragraphes retirés (rien d'inventé) : La Cartolina → "Mobilier chiné" /
  "Éclairage d'ambiance" / "Signalétique" / "Musique" ; L'Esperienza →
  "Décoration" / "Animation" / "Gastronomie italienne" / "Service
  personnalisé" ; L'Aperitivo → "Comptoir illuminé" / "Guirlandes
  lumineuses" / "Spritz & cicchetti" ; La Tavola → "Menu sur mesure" /
  "Vins italiens" / "Service discret". Retirer `.desc` du texte fait
  automatiquement remonter le bouton "Demander un devis" juste sous la
  tagline (`.tagline` a déjà `margin-bottom:var(--space-3)`) — aucun CSS de
  bouton à retoucher pour ça, effet secondaire attendu du retrait plutôt
  qu'un repositionnement calculé. Si `<p class="desc">` réapparaît dans
  l'un des 4 formulas, ou si `.world-tags-wrap` est absent, c'est un
  retour à l'ancienne version, à ne pas réintroduire sans qu'on le
  redemande.
  Vérifié par script Playwright (mesure des rectangles des 3 panneaux
  méthodologie, capture d'écran des 4 formules desktop + mobile, bandeau
  menu vérifié bord à bord aux 2 largeurs, toggle du menu mobile revérifié
  fonctionnel) et regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Formules Prestations — titre remonté, bulles agrandies et recentrées
  sur l'information principale (2026-08-19, même journée)** : retour de la
  cliente sur le bullet précédent. **Titre/tagline remontés** :
  `.world-copy-inner` reçoit `margin-top: clamp(-6rem, -9vh, -3rem)`
  (≥701px seulement — sous 700px `.world` est déjà contraint en `100svh`,
  remonter davantage rapprocherait trop le titre du header fixe) — un
  simple décalage négatif dans le flex centré de `.world` (`align-items:
  center`), pas besoin de changer le mode de centrage. **Bulles
  agrandies** : `font-size` 0.8rem→1.05rem, padding 0.55em/1.1em→
  0.75em/1.4em, gap 0.65rem→0.85rem (desktop) ; `white-space:nowrap`
  retiré (`max-width:15rem` à la place) pour permettre un repli sur 2
  lignes dans la bulle plutôt qu'une pilule qui déborderait avec les
  libellés plus longs de cette itération. **Contenu recentré sur
  l'information principale** : la cliente a jugé les mots-clés du bullet
  précédent "trop précis" (des éléments de mise en scène pris isolément —
  "Mobilier chiné", "Signalétique"...) et a demandé des repères qui
  décrivent le service dans son ensemble. Remplacés par des value
  props/traits distinctifs de chaque formule plutôt que des items de sa
  liste de composants : La Cartolina → "Décor clé en main" / "Immersion
  Dolce Vita" / "Sans changer de lieu" ; L'Esperienza → "Service
  signature" / "Organisation clé en main" / "Immersion totale" ;
  L'Aperitivo → "Format court & convivial" / "Rituel d'équipe" /
  "Ponctuel ou en abonnement" ; La Tavola → "Atmosphère sobre & élégante"
  / "Discrétion du service" / "L'échange au centre". Toutes passées de
  3-4 à exactement 3 par formule (cohérent avec des bulles plus grandes
  prenant plus de place). Vérifié par capture d'écran des 4 formules
  desktop + 2 en mobile et regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Formules Prestations — titre encore remonté, vrai bug de hauteur des
  bulles corrigé (2026-08-19, même journée)** : nouveau retour de la
  cliente. **Titre remonté davantage** : `margin-top` sur
  `.world-copy-inner` passe de `clamp(-6rem, -9vh, -3rem)` à
  `clamp(-8rem, -12vh, -4.5rem)`, même mécanisme que l'itération
  précédente, juste poussé plus loin.
  **Bug réel trouvé et corrigé, pas supposé** : la cliente demandait que
  chaque bulle soit "adaptée à la taille" de son propre contenu (compacte
  sur 1 ligne, plus grande sur 2, même si ça donne des bulles de tailles
  différentes dans une même formule) — repéré par script Playwright
  (mesure de `getBoundingClientRect().height` de chaque bulle à plusieurs
  largeurs de viewport) que ce n'était PAS le cas : `.world-tags` est un
  conteneur flex sans `align-items` explicite, donc `stretch` (valeur par
  défaut) s'appliquait — dès qu'une bulle repliait son texte sur 2 lignes
  (ex. "Ponctuel ou en abonnement"), ses voisines à 1 ligne dans la même
  ligne flex étaient étirées à la même hauteur qu'elle (mesuré : 68px au
  lieu de 47px sur "Rituel d'équipe" à 1440/1024/820/768/701px de large),
  avec leur texte recentré dans un vide au lieu de rester compactes.
  Corrigé en ajoutant `align-items: flex-end` à `.world-tags` — chaque
  bulle retrouve sa hauteur naturelle (revérifié : 47px/68px sur desktop,
  37px/56px sur mobile, stable à toutes les largeurs testées), alignées
  sur leur bord bas (cohérent avec `.world-tags-wrap { bottom: … }`,
  l'ancrage au bas de la photo). Si `align-items` disparaît de
  `.world-tags` (retour à `stretch` implicite), ce bug redevient
  probable — ne pas le retirer sans le remplacer par un autre override
  explicite. Vérifié par script (mesure de hauteur à 6 largeurs) et
  capture d'écran desktop + mobile ; regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Équipe — refonte en "stage" photo + sélecteur de petits cercles
  (2026-08-19)** (`.talent-stage*`, `engagements.html`) : la cliente a
  fourni une image de référence (design "Kollektiva") — une grande photo
  de la personne actuellement sélectionnée, un texte informatif sur son
  rôle à côté, et une rangée de petits cercles-avatars en bas permettant
  de changer de personne, la photo de fond changeant au clic. Repris pour
  le MÉCANISME et la composition générale, pas une copie pixel de la
  typographie/mise en page de la référence — adapté à l'identité Simposio
  (Yeseva One pour le nom, palette navy/terracotta/crème). **Remplace
  entièrement** l'ancienne grille `.talents-grid` de deux `.talent-card`
  (fond dégradé + icône "Photo à venir") — si `.talents-grid`/
  `.talent-card`/`.talent-photo-placeholder` réapparaissent dans un diff,
  c'est cette ancienne version, à ne pas réintroduire sans qu'on le
  redemande.
  **Structure** : `.talent-stage` est une seule carte (fond `--navy-900`,
  coins arrondis, `overflow:hidden`) contenant `.talent-stage-media` (les
  2 `<img class="talent-stage-photo">` empilées en `position:absolute`,
  fondu croisé par `opacity`/`transition` — même principe que
  `.values-media-photo` ailleurs sur cette page) puis `.talent-stage-bar`,
  une **vraie barre en flux normal sous la photo** (pas un chevauchement
  en marge négative par-dessus la photo) contenant à gauche
  `.talent-stage-panels` (un `.talent-stage-panel` par personne,
  `display:none`/`block` selon `.is-active`, pas de fondu sur le texte)
  et à droite `.talent-stage-selector` (les cercles-avatars, `3.2rem` de
  diamètre — "si petits" demandé explicitement par la cliente).
  **Pourquoi une barre en flux plutôt qu'un chevauchement** : un premier
  jet plaçait la barre de texte en `margin-top` négatif par-dessus le bas
  de la photo (comme un bandeau de légende superposé) — écarté avant même
  d'être committé, repéré par calcul : la hauteur du panneau de texte
  dépend de la longueur de la bio de chaque personne (donnée réelle,
  pas maîtrisée à l'avance côté design), donc un chevauchement calé pour
  une bio tiendrait mais déborderait sur le fond de la section pour une
  bio plus longue — fragile par construction. La barre en flux normal
  avec son propre fond opaque est robuste quelle que soit la longueur du
  texte, sans calcul à maintenir.
  **JS** (`main.js`, bloc dédié après les flip-cards Engagements) : un
  clic sur un `.talent-stage-avatar` (de vrais `<button>`, focus/Enter
  clavier natifs) bascule `.is-active` en parallèle sur les avatars, les
  2 photos et les 2 panneaux, tous repérés par le même attribut
  `data-talent-target` — un seul gestionnaire de clic suffit à
  resynchroniser les trois groupes. `role="tablist"`/`role="tab"`/
  `aria-selected` pour l'accessibilité (pattern d'onglets standard).
  **Photos temporaires** : la cliente a demandé de "prendre des photos
  dans notre banque d'image, des photos de personnes au hasard, le temps
  de choisir les bonnes et les nôtres" — deux portraits professionnels
  Pexels (`talent-placeholder-1.jpg`/`-2.jpg`, aucune attribution requise,
  cf. `CREDITS.md`) tiennent lieu de vraies photos d'équipe. Nommés
  volontairement `talent-placeholder-*` (pas `evenement-*` ni un nom
  suggérant que c'est la vraie photo d'Estelle) pour qu'aucune confusion
  ne soit possible dans le code une fois les vraies photos ajoutées — TODO
  détaillé dans `engagements.html` juste au-dessus de la section.
  **Bug de recadrage trouvé et corrigé avant publication** : la 2ᵉ photo
  (portrait avec beaucoup d'espace vide au-dessus de la tête) se
  retrouvait cadrée sur le haut du front avec les yeux à peine visibles en
  bas du cadre avec `object-position:top center` — repéré par capture
  d'écran, pas supposé. Corrigé en `object-position:center 22%`, qui cadre
  correctement les deux visages (vérifié sur les deux). Purement
  cosmétique et sans rapport avec le contenu réel à venir — à revérifier
  une fois les vraies photos en place, leur cadrage peut demander un
  réglage différent.
  Vérifié par script Playwright (clic + navigation clavier Tab/Enter,
  état `is-active` des 3 groupes confirmé synchronisé après chaque
  interaction, 0 erreur console) et capture d'écran desktop + mobile pour
  les deux personnes. Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Formules Prestations — bulles forcées sur 1 ligne, titre remonté une
  3ᵉ fois, panneau "En savoir plus" glissant (2026-08-19)** : trois
  demandes de la cliente en une fois.
  **Bulles toujours sur 1 ligne** : revirement par rapport à l'itération
  précédente (qui autorisait explicitement un repli sur 2 lignes pour les
  libellés les plus longs, avec une hauteur de bulle adaptée). `max-width`
  est retiré de `.world-tags li`, `white-space:nowrap` remis — la LISTE
  reste `flex-wrap:wrap` (une bulle entière peut passer à la ligne
  suivante sur un écran étroit) mais plus aucun texte ne se replie DANS
  une bulle. Le `font-size` mobile est recalibré (`0.92rem`→`0.82rem`) et
  vérifié par script Playwright balayant 360 à 1920px : les 12 bulles (3
  par formule × 4 formules) restent sur 1 ligne à toutes ces largeurs,
  0 débordement horizontal. Le garde-fou `align-items:flex-end` de
  l'itération précédente (qui corrigeait un bug de hauteurs mélangées
  1-ligne/2-lignes) devient sans objet une fois toutes les bulles
  uniformément sur 1 ligne, mais reste en place sans effet négatif.
  **Titre/tagline remontés une 3ᵉ fois** : `margin-top` sur
  `.world-copy-inner` passe de `clamp(-8rem, -12vh, -4.5rem)` à
  `clamp(-10rem, -15vh, -6rem)` — vérifié à plusieurs hauteurs de
  viewport (700 à 1080px) que le titre reste toujours nettement dégagé du
  bandeau du header fixe (jamais moins de 100px d'écart mesuré).
  **Panneau "En savoir plus"** (`.world-more-trigger`/`.world-more-panel`,
  `main.js`) : sous les bulles, un petit lien texte+flèche en terracotta
  (réutilise `.link-arrow`, déjà établi sur le site pour ce type de CTA
  discret — ex. "Entrer dans l'univers" du hero accueil — avec une
  nouvelle couleur `.world-more-trigger` puisqu'aucune variante existante
  de `.link-arrow` n'était terracotta) plutôt qu'un bouton. Au clic, un
  panneau glisse depuis le côté qui NE porte NI le titre NI les bulles —
  demande explicite de la cliente. Comme le titre/les bulles vivent à
  gauche sur Cartolina/Aperitivo et à droite sur Esperienza/Tavola (même
  logique d'alignement que `.world-copy-inner` déjà en place), le panneau
  est ancré à droite par défaut et bascule à gauche pour ces deux
  dernières via les mêmes sélecteurs de formule utilisés partout ailleurs
  sur cette page. **Contenu du panneau : le paragraphe descriptif
  d'origine de chaque formule** (`.desc`, retiré du texte principal plus
  tôt dans la journée, cf. bullet correspondant) réutilisé tel quel — sa
  longueur ("pas très long, mais pas trop court") avait déjà été validée
  par la cliente à l'époque, pas de nouveau texte à rédiger. Sous 700px
  (où gauche/droite n'a plus de sens, tout étant empilé), le panneau perd
  sa distinction de côté et remonte du bas à la place (`transform:
  translateY(100%)→0`, pleine largeur, `max-height:75vh`).
  **JS** (`main.js`, bloc dédié juste après la logique du "stage" équipe) :
  chaque déclencheur `[data-more-toggle]` est relié à son propre panneau
  via `aria-controls`/`id` (4 paires indépendantes, une par formule) —
  re-clic sur le déclencheur, bouton `[data-more-close]` dédié, ou touche
  Échap ferment le panneau ; `aria-expanded` tenu à jour sur le
  déclencheur.
  **Piège de test rencontré, pas un bug du site** : une première vérification
  par capture d'écran semblait montrer le panneau de "La Cartolina" affichant
  le contenu de "L'Esperienza" — en fait un artefact de `page.click()` de
  Playwright, qui fait défiler automatiquement l'ÉLÉMENT CLIQUÉ (le
  déclencheur, situé tout en bas de chaque section `min-height:92vh`) dans
  la vue, ramenant surtout la section SUIVANTE à l'écran plutôt que celle
  visée. Revérifié en re-scrollant explicitement vers le haut de la bonne
  section après le clic : chaque panneau affiche bien le contenu de sa
  propre formule, ancré du bon côté. Vérifié par script Playwright
  (mesure `getBoundingClientRect` confirmant l'ancrage gauche/droite selon
  la formule, ouverture/fermeture par clic/clavier Enter/Échap, 0 erreur
  console) et capture d'écran desktop + mobile (panneau latéral vs.
  panneau du bas). Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Formules Prestations — repères sans habillage bulle, "En savoir plus"
  devenu un vrai bouton (2026-08-19, même journée)** : la cliente a
  inversé les deux traitements visuels de l'itération précédente — les
  repères de mots-clés en pilules "donnent envie de cliquer" alors qu'ils
  sont purement informatifs, et inversement "En savoir plus" (qui, lui,
  déclenche une action) devait ressembler à un bouton plutôt qu'à un
  simple lien texte+flèche. **`.world-tags li` perd tout habillage de
  bouton** (fond `rgba(cream,0.16)`, bordure, `border-radius:999px`,
  `backdrop-filter`) — remplacé par une liste en ligne, typographie
  `--font-subtitle` majuscules espacées (même langage que les eyebrows du
  site) sur un `text-shadow` pour la lisibilité sur photo, séparée par de
  fins traits verticaux (`::after`) plutôt que par des puces ou un fond.
  **`.world-more-trigger` devient un vrai bouton pilule** : réutilise
  `.btn` (la classe de bouton générique du site, même famille que
  "Demander un devis" juste au-dessus) avec une nouvelle variante
  `.btn-terracotta` — aucune variante de `.btn` existante n'était
  terracotta. Toujours le même mécanisme JS (`data-more-toggle`,
  inchangé) ; seule l'habillage visuel change. Si `background`/
  `border-radius:999px` réapparaissent sur `.world-tags li`, ou si
  `.world-more-trigger` redevient un `.link-arrow` sans fond de bouton,
  c'est un retour à l'itération précédente, à ne pas réintroduire sans
  qu'on le redemande. Vérifié par capture d'écran des 4 formules et
  regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Équipe — photo aux 3/4 à droite, texte sur zone floutée à gauche,
  cercles agrandis (2026-08-19, même journée)** (`.talent-stage*`,
  `engagements.html`) : nouvelle direction de la cliente, plus proche de
  la référence "Kollektiva" d'origine — "la photo occupe les 3/4 de la
  page vers la droite, la partie gauche forme un dégradé, un peu flou, sur
  laquelle il y aura du texte informatif". **Remplace** la carte "photo en
  haut / barre d'info opaque pleine largeur en dessous" de la 1ʳᵉ passe
  (`.talent-stage-bar`/`.talent-stage-scrim`) par une seule photo plein
  cadre avec le texte superposé dans une zone floutée/assombrie sur la
  gauche. Si ces deux classes réapparaissent (photo+barre empilées plutôt
  que superposées), c'est l'ancienne version, à ne pas réintroduire sans
  qu'on le redemande.
  **`.talent-stage-blur`** : pas une 2ᵉ copie de l'image — un
  `backdrop-filter:blur(22px)` qui floute directement la photo visible à
  travers lui, surmonté d'un dégradé sombre (`linear-gradient`) pour la
  lisibilité du texte, le tout estompé vers la photo nette via
  `mask-image` (flou/assombrissement pleins jusqu'à 30% de large, fondu
  jusqu'à 55%) plutôt qu'une coupure nette entre les deux zones.
  **`.talent-stage` (pas `.talent-stage-media`) reste le conteneur
  `position:relative`** : `.talent-stage-media` et `.talent-stage-caption`
  sont deux enfants séparés plutôt que la légende en position absolue à
  l'intérieur du bloc photo — évite un piège déjà rencontré ailleurs sur
  ce site (l'assiette de la Fondatrice, itération abandonnée, cf. plus
  haut dans ce fichier) : un enfant en `position:static` dans une boîte à
  `aspect-ratio` peut forcer la boîte à grandir au-delà du ratio si son
  contenu déborde. En gardant les deux en enfants directs de
  `.talent-stage`, `.talent-stage-media` garde un `aspect-ratio` fiable
  quelle que soit la longueur de la bio.
  **Responsive assumé, pas juste une media query mineure** : sous 640px, un
  partage gauche/droite écraserait la photo en une bande trop étroite pour
  être lisible — `.talent-stage-blur` est simplement masqué
  (`display:none` par défaut, réactivé ≥640px) et `.talent-stage-caption`
  redevient un enfant en flux normal (fond `--navy-900` plein, sous la
  photo) plutôt qu'une superposition — repli sur la composition "empilée"
  de la 1ʳᵉ passe, qui reste la plus lisible sur petit écran.
  **Cercles-avatars agrandis** ("un petit peu", pas "si petits" comme la
  toute première demande) : `.talent-stage-avatar` passe de `3.2rem` à
  `4rem` de diamètre.
  Vérifié par script Playwright (0 erreur console, clic + navigation
  clavier Tab/Enter toujours fonctionnels) et capture d'écran à
  640/700/768/900/1440px desktop + 390px mobile : texte toujours lisible
  sur la zone floutée, aucun chevauchement avec la photo nette, avatars
  visiblement plus grands. Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Équipe — cercles-avatars sortis du rectangle de texte, décalés à droite
  (2026-08-19, même journée)** (`.talent-stage-selector`,
  `engagements.html`/`style.css`) : la cliente a repointé la même référence
  "Kollektiva" (mockup laptop) en précisant cette fois : "je veux juste que
  les ronds de l'équipe ne sont pas dans un rectangle et que tu les
  décales plus à droite". Bien que `.talent-stage-selector` n'ait jamais eu
  de fond/bordure propre, il vivait comme enfant de `.talent-stage-caption`
  (itération précédente) — la colonne de texte à `width:min(24rem,46%)`
  avec la zone floutée/assombrie derrière elle — donc les cercles se
  lisaient visuellement comme confinés dans ce bloc rectangulaire, sans
  déborder sur la photo nette.
  **`.talent-stage-selector` devient un enfant direct de `.talent-stage`**
  (frère de `.talent-stage-media`/`.talent-stage-caption`, plus un enfant
  de `.talent-stage-caption`) — `position:absolute` par rapport à
  `.talent-stage` (inchangé, déjà le conteneur `position:relative`).
  Décalé à `left:38%` sur desktop (≥640px) : déborde volontairement au-delà
  de la colonne de texte (46% de large) pour flotter sur la photo nette à
  droite, comme le montre la référence — un vrai flottement, plus confiné
  à aucun bloc. Sous 640px, reste à `left:var(--space-4)` (aligné au bord
  gauche de la carte, cohérent avec `.talent-stage-caption` qui redevient
  empilée pleine largeur sous la photo à cette largeur — décaler à droite
  n'aurait aucun sens sur cette mise en page repliée).
  **Bug réel trouvé et corrigé avant publication** : en sortant le
  sélecteur du flux normal de `.talent-stage-caption` (devenu
  `position:absolute`), plus rien ne réservait d'espace pour lui sous
  640px — la légende y reste en flux normal (empilée sous la photo,
  hauteur dictée par son contenu), donc son `padding` d'origine
  (`var(--space-4)` partout) ne laissait aucune marge pour les cercles
  (4rem de diamètre) qui flottent par-dessus le bas de la carte : repéré
  par capture d'écran mobile (`v3_mobile.png`), le texte de la bio passait
  visuellement derrière les avatars. Corrigé en ajoutant
  `padding-bottom: calc(4rem + var(--space-4) + var(--space-3))` sur la
  règle mobile de base de `.talent-stage-caption` (sans toucher à la
  règle `≥640px`, qui redéfinit déjà tout `padding` pour la mise en page
  superposée où ce problème ne se pose pas). Revérifié par script
  Playwright comparant les rectangles (`getBoundingClientRect`) de
  `.talent-stage-bio` et `.talent-stage-selector` aux deux viewports : plus
  aucun chevauchement (avant : bio et sélecteur se recouvraient
  verticalement sur mobile ; après : 0 intersection aux deux largeurs).
  `box-shadow` ajoutée sur `.talent-stage-avatar` (`0 6px 18px
  rgba(16,31,39,0.35)`) pour détacher visuellement les cercles de la photo
  maintenant qu'ils flottent librement, sans fond de conteneur pour les
  distinguer autrement. Si `.talent-stage-selector` réapparaît comme enfant
  de `.talent-stage-caption`, c'est l'ancienne version confinée à la
  colonne de texte, à ne pas réintroduire sans qu'on le redemande.
  Vérifié par script Playwright (0 chevauchement bio/sélecteur aux 2
  viewports, fond du sélecteur confirmé transparent — `rgba(0,0,0,0)` —,
  navigation clavier Tab/Enter toujours fonctionnelle, 0 erreur console) et
  capture d'écran desktop + mobile. Regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Citation/Valeurs interverties, Équipe en plein écran (2026-08-20)**
  (`engagements.html`/`style.css`) : deux demandes de la cliente en une
  fois, en repointant une nouvelle fois la référence "Kollektiva".
  **1) Citation et Valeurs interverties, citation en premier** : demande
  explicite — "change de place la citation avec les valeurs, mais la
  citation au-dessus des valeurs". Simple réordonnancement des deux
  `<section>` dans le HTML (aucun changement de contenu, de mécanisme ni
  de style à l'intérieur de chacune) : `.founder` (citation minimaliste
  sur fond crème) passe désormais AVANT `.values-reel` (album Valeurs),
  alors qu'elle était après depuis le déplacement du contenu d'`univers.html`
  (cf. « État d'avancement » plus bas). **Écart assumé sur l'alternance de
  fonds** : ce nouvel ordre donne crème (header) → navy (engagements) →
  crème-dim (talents) → **crème (founder) → navy (valeurs)** — deux
  sections claires (`--bg-dim` puis `--bg`) se retrouvent adjacentes, alors
  que l'ordre précédent (crème, navy, crème-dim, navy, crème) alternait
  strictement. Demande explicite de la cliente suivie telle quelle plutôt
  que réajustée silencieusement pour préserver l'alternance — à
  retravailler avec elle si l'effet de deux sections claires consécutives
  gêne une fois vu en conditions réelles.
  **2) Équipe (`.talent-stage`) en plein écran** : la cliente a redonné la
  même référence "Kollektiba" en précisant l'unique écart voulu — "fais en
  sorte que la photo plus le dégradé prenne toute la largeur sur l'écran,
  le seul détail que je veux de différent" — et redemandé, dans la même
  phrase, que les cercles-avatars restent hors de tout rectangle et
  "plus décalés à droite" (déjà en place depuis l'itération précédente,
  mais reconfirmé et poussé plus loin ici).
  **Sorti de `.container` plutôt qu'une astuce de marges négatives en
  `vw`** : `.talent-stage` devient un enfant direct de
  `<section class="talents">` dans le HTML (qui n'a pas de padding
  horizontal propre, seul `.container` en avait) — le `<div class="section-head">`
  et le `<p class="visual-note">` restent chacun dans leur propre
  `.container` de part et d'autre. Plus simple et plus sûr qu'un
  `width:100vw` (qui peut introduire un débordement horizontal lié à la
  largeur de la barre de scroll) et cohérent avec la façon dont les
  autres sections plein-large du site (Valeurs, 5 sens) sont déjà
  construites. `.talent-stage` perd `max-width:58rem`/`margin-inline:auto`/
  `border-radius` (une boîte bord-à-bord n'a plus de raison d'avoir des
  coins arrondis). Si `max-width:58rem` réapparaît sur `.talent-stage`,
  c'est l'ancienne carte centrée, à ne pas réintroduire sans qu'on le
  redemande.
  **`.talent-stage-media` : `aspect-ratio` remplacé par une hauteur bornée
  en `vh`** (`≥640px`) : une fois la photo étirée à toute la largeur de
  l'écran (jusqu'à 1920px+), garder `aspect-ratio:16/9` aurait rendu la
  boîte démesurément haute (jusqu'à 1080px) — remplacé par
  `height:min(68vh,40rem)`, une hauteur proportionnée à la fenêtre plutôt
  qu'à la largeur de la photo.
  **Deux bugs réels trouvés et corrigés en cascade, tous deux repérés par
  capture d'écran à plusieurs largeurs, aucun supposé** :
  1. Arrêts du dégradé/masque de `.talent-stage-blur` d'abord convertis en
     longueurs fixes (`rem`) pour éviter qu'ils ne s'étirent en `%` bien
     au-delà de la colonne de texte (elle-même plafonnée en `rem`,
     `width:min(24rem,46%)`) sur les très grands écrans — mais à `rem`
     fixe seul, ce même plafond devient une fraction bien plus grande de
     la largeur totale de la photo sur les largeurs desktop/tablette plus
     étroites (~640-900px), floutant quasiment tout le visage (repéré à
     640px, pas supposé). Corrigé en passant à `min(%, rem)` sur chaque
     arrêt du dégradé et du masque (`background`, `-webkit-mask-image`,
     `mask-image`) : proportionnel comme avant sur les largeurs étroites,
     plafonné comme voulu sur les très grandes. Si un arrêt en `rem` fixe
     seul (sans `min()`) réapparaît sur `.talent-stage-blur`, revérifier
     ce compromis avant de le garder.
  2. `.talent-stage-selector` repositionné en `left:max(28rem, 42%)`
     (au lieu du `left:38%` seul de l'itération précédente) pour la même
     raison — un `%` seul aurait soit sous-décalé sur les largeurs
     desktop étroites (où 38% de la largeur totale peut encore tomber
     dans la zone floutée), soit sur-décalé sur très grand écran. `max()`
     garantit un plancher absolu (au-delà de la colonne de texte/zone
     floutée) tout en continuant de dériver vers la droite en proportion
     sur les écrans larges.
  Vérifié par script Playwright à 6 largeurs desktop/tablette (640, 768,
  900, 1024, 1440, 1920px, plus mobile 390px) : 0 débordement horizontal à
  aucune largeur, sélecteur toujours hors de la colonne de texte et jamais
  hors du viewport, aucun chevauchement bio/sélecteur sur mobile, fond du
  sélecteur confirmé transparent, navigation clavier Tab/Enter toujours
  fonctionnelle, ordre des sections confirmé (`engagements`, `talents`,
  `founder`, `values-reel`) directement dans le DOM. Capture d'écran aux 6
  largeurs + mobile. Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Équipe — photo agrandie jusqu'au bandeau, dégradé terracotta, visage
  décalé, typographie plus grande, 2ᵉ photo remplacée deux fois
  (2026-08-20, même journée)** (`.talent-stage*`, `engagements.html`) :
  cinq demandes de la cliente en une fois, à partir d'une capture d'écran
  montrant un vrai bug (cercles-avatars posés en plein sur le front de la
  2ᵉ photo, quasiment aucun visage visible).
  **1) "Prennent même la place" du petit bandeau au-dessus de la
  citation** : `.talents` passe de `padding-block: var(--space-6)` (7rem
  haut ET bas) à `var(--space-6) var(--space-4)` (7rem haut, 2.75rem
  bas seulement) et `.talent-stage-media` (≥640px) de `height:min(68vh,
  40rem)` à `min(88vh, 54rem)` — le bandeau `.visual-note` (fond
  `--bg-dim`) qui séparait la photo de la citation de la fondatrice
  (fond `--bg`, quasiment la même teinte crème) se réduit d'autant que la
  photo grandit, sans être supprimé entièrement (le texte "Photos
  provisoires..." reste nécessaire tant que les vraies photos ne sont pas
  en place).
  **2) Dégradé recoloré en terracotta** : `.talent-stage-blur`
  (`background`, le calque de lisibilité derrière le texte) passe de
  `rgba(16,31,39,…)` (`--navy-900`) à `rgba(193,98,45,…)` (`--terracotta`)
  — mêmes paliers d'opacité et arrêts `min(%, rem)` déjà en place,
  seule la teinte change.
  **3) Visage décalé pour ne plus toucher le dégradé** : `object-position`
  passe de `center 22%` à `30% 22%` sur `.talent-stage-photo` — piège
  vérifié avant d'appliquer (pas supposé) : pour `object-fit:cover`,
  DIMINUER le `%` horizontal montre davantage le bord GAUCHE de la photo
  source, ce qui pousse le sujet vers la DROITE de la boîte affichée (et
  non l'inverse, comme l'intuition pourrait le suggérer) — confirmé par
  capture d'écran avant de fixer la valeur.
  **4) Typographie agrandie "en jouant sur différentes tailles"** :
  plutôt qu'un facteur uniforme sur les 3 éléments, l'écart entre eux est
  creusé pour renforcer la hiérarchie — `.talent-stage-name` (`clamp`
  jusqu'à `3.4rem`, +62% sur le plafond desktop) grandit nettement plus
  que `.talent-stage-role` (`0.78rem→0.95rem`, +22%) et `.talent-stage-bio`
  (`0.95rem→1.2rem`, +26%), pour que le nom domine clairement plutôt que
  les trois tailles montent en bloc.
  **5) 2ᵉ photo remplacée deux fois le même jour** — la cliente a
  précisé que les deux membres de l'équipe représentées sont des femmes
  ("le clip est composé des deux filles non"), donc `talent-placeholder-2.jpg`
  (jusque-là un portrait d'homme, Christoph Sixt) devait devenir une
  photo de femme. **1er remplacement** (Pexels photo 29852895, Ifeyinka
  Adeyemo, tête seule très serrée) : **bug réel trouvé après coup, pas
  supposé** — une fois affichée dans la boîte `.talent-stage-media`
  désormais très large et peu haute (jusqu'à 2,3:1 en plein écran), le
  visage se retrouvait recadré en gros plan yeux/nez/bouche, sans front
  ni menton visibles (`object-fit:cover` zoome fortement dès que la boîte
  est beaucoup plus large que haute — un sujet déjà cadré serré dans la
  photo source n'a alors plus aucune marge). **2ᵉ remplacement** (Pexels
  photo 4342352, Edmond Dantès, buste bras croisés avec beaucoup plus
  d'espace au-dessus de la tête et sous les épaules) : bien mieux, mais
  toujours trop serré avec le même `object-position` vertical que la 1ʳᵉ
  photo (`22%`, calé sur Zoe Galarza qui a beaucoup de cheveux
  au-dessus du visage) — **calibré empiriquement par balayage de
  plusieurs valeurs (0% à 50% par pas de 5-10, capture d'écran à chaque
  fois, jamais deviné)** : `.talent-stage-photo[data-talent-target="1"]`
  reçoit un `object-position:30% 38%` propre à cette photo (spécificité
  CSS plus élevée que la règle générique `30% 22%`, qui reste inchangée
  pour la 1ʳᵉ photo) — tête, cou et épaules visibles sans rogner ni le
  haut du crâne ni le menton, vérifié aux largeurs 2000, 1440, 768px et
  en mobile (le fond bordeaux de cette photo, choisi sans arrière-pensée,
  se marie d'ailleurs bien avec le Rouge Pourpre de Venise/Rouge Terre
  d'Ombrie de la palette de marque). `assets/img/CREDITS.md` mis à jour
  pour les deux remplacements successifs.
  Vérifié par script Playwright (0 chevauchement, 0 débordement
  horizontal aux largeurs 2000/1440/768/390px, navigation clavier
  Tab/Enter toujours fonctionnelle, transition de fondu entre les 2
  photos confirmée complète) et capture d'écran à chaque largeur pour
  les deux photos. Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Équipe — titre fusionné dans la photo, moins zoomée, dégradé bleu
  Méditerranéen, glissement au changement de profil (2026-08-20, même
  journée)** (`.talent-stage*`, `engagements.html`) : six demandes de la
  cliente en une fois, à partir d'une nouvelle capture d'écran.
  **1) Bandeau "Photos provisoires" retiré** : `<div class="container">
  <p class="visual-note">…</p></div>` supprimé du HTML, `.talents`
  repasse à `padding-block: var(--space-5) 0` (plus de padding bas, plus
  besoin d'absorber l'espace d'un bandeau qui n'existe plus).
  **2) Titre + eyebrow fusionnés dans la photo** ("intègre le titre...
  ainsi que la baseline... dans une seule et même partie avec les photos
  de présentation pour que les deux réunis tiennent sur un écran de PC") :
  `.section-head` (bloc séparé au-dessus de `.talent-stage`) est retiré ;
  eyebrow + `h2` deviennent `.talent-stage-heading`, premier enfant de
  `.talent-stage-caption` — ils vivent donc dans la même colonne
  superposée/floutée que le nom-rôle-bio, et se centrent avec elle comme
  un seul groupe (`.talent-stage-caption` reste `justify-content:center`,
  inchangé). Aucun scrim/padding-top dédié au header fixe n'a été
  nécessaire : le titre hérite du padding du haut de `.talents` et du
  centrage vertical de la colonne, dans la même zone déjà floutée/
  assombrie que la légende (le dégradé gauche, `inset:0` sur
  `.talent-stage-blur`, couvre déjà toute la hauteur de la photo, pas
  seulement la zone de la légende). `h2` reçoit une taille scopée bien
  plus petite que le `h2` générique du site (`clamp(1.7rem,…,2.4rem)`
  contre jusqu'à `5.6rem`) — un repère de wayfinding secondaire ici, pas
  le point focal (qui reste le nom du membre).
  **3) Photos moins zoomées** ("j'aimerais qu'elle soit moins zoomée pour
  faire apparaître davantage la personne") : `.talent-stage-media`
  (≥640px) passe de `min(88vh,54rem)` à `min(88vh,60rem)`. **Point clé
  vérifié par calcul avant de choisir ce sens** : avec `object-fit:cover`
  sur une boîte plein écran, la largeur (fixe, celle du viewport) impose
  déjà l'échelle — la fraction de la photo source réellement visible vaut
  `(hauteur_boîte / largeur_boîte) × ratio_image`, donc c'est la HAUTEUR
  de la boîte qui contrôle le zoom : une boîte plus haute montre une plus
  grande tranche de la photo (moins zoomé), une boîte plus courte en
  montre moins (plus zoomé) — le sens inverse de l'intuition "réduire la
  boîte pour moins zoomer". Le titre fusionné (point 2) et le bandeau
  retiré (point 1) libèrent la marge nécessaire pour agrandir la boîte
  sans casser "tient sur un écran de PC" : hauteur totale de la section
  mesurée entre 666px (1024×768) et 946px (2000×1250) selon la largeur —
  reste dans l'ordre de grandeur d'un écran, vérifié par script Playwright
  plutôt que supposé.
  **4) Texte "mieux organisé" avec des tailles variées, "très visuel"** :
  `.talent-stage-role` passe d'un simple libellé uppercase à un badge/
  pilule (fond `rgba(224,149,106,0.14)`, bordure assortie, coins
  arrondis, padding) — se distingue mieux entre le nom énorme et la bio
  qu'une ligne de texte de plus. `.talent-stage-name` reçoit
  `line-height:1.05` (hérite sinon du `line-height:1.6` du site, bien trop
  aéré pour un nom en 2 lignes à `3.4rem` — un `<span>`, pas un `h1-h3`,
  donc pas couvert par la règle générique `line-height:1.02` des titres).
  **5) Glissement depuis la gauche au changement de profil** ("qu'ils
  apparaissent avec un effet de glissement venant de la gauche") : les 2
  `.talent-stage-panel` passent de `display:none/block` (aucune transition
  possible sur `display`) à un empilement permanent en `position:absolute`
  (même principe déjà établi sur cette page pour les 2
  `.talent-stage-photo`), avec `opacity`/`transform:translateX(-2rem→0)`
  piloté par `.is-active` — le mécanisme de bascule JS existant
  (`classList.toggle`) n'a nécessité aucun changement, seule la traduction
  CSS de l'état change. `.talent-stage-panels` reçoit un `min-height`
  fixe (`19rem`, calibré sur le nom le plus long affiché sur 2 lignes)
  puisque ses enfants sont sortis du flux normal. Neutralisé sous
  `prefers-reduced-motion` par la règle globale déjà en place sur le site
  (`transition-duration:0.01ms !important`), sans règle dédiée
  supplémentaire à écrire.
  **6) Dégradé recoloré une 2ᵉ fois, en bleu Méditerranéen** ("le
  dégradé, fais-le finalement en bleu méditerranéen") : `.talent-stage-blur`
  repasse du terracotta (itération précédente, même journée) au bleu
  marine de marque, via `rgba(var(--navy-rgb), …)` (la variable déjà
  définie dans `:root`) plutôt que des composantes RGB en dur.
  **7) Cercles-avatars décalés encore plus à droite** ("décalant encore
  les photos des membres... pour pas qu'elle ne colle trop le dégradé et
  que le dégradé coupe un peu les visages") : `.talent-stage-selector`
  passe de `left:max(28rem,42%)` à `max(34rem,48%)` — même mécanisme
  `max()` (plancher absolu + dérive proportionnelle), poussé plus loin.
  Revérifié par script Playwright (mesure `getBoundingClientRect`) que le
  sélecteur reste au-delà de la largeur de `.talent-stage-caption` (donc
  hors de la zone floutée) et jamais hors du viewport, à 4 largeurs
  (1024-2000px).
  Vérifié par script Playwright (bandeau confirmé absent du DOM, reveal
  `[data-reveal]` toujours fonctionnel sur le titre fusionné, navigation
  clavier Tab/Enter toujours fonctionnelle, 0 débordement horizontal à
  4 largeurs) et capture d'écran aux mêmes largeurs pour les deux photos.
  Regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Équipe — titre repassé à sa taille normale (déployé en hauteur), photo
  encore moins zoomée, glissement ralenti ; Engagements — bande crème
  retirée, fond terracotta (2026-08-20, même journée)** (`.talent-stage*`/
  `.engagements`/`.talents`, `engagements.html`) : quatre demandes de la
  cliente sur le rendu de l'itération précédente.
  **1) Titre à la taille d'avant, "plus dans la longueur que dans la
  largeur"** : l'override local qui réduisait `.talent-stage-heading h2`
  (`clamp(1.7rem,…,2.4rem)`, itération précédente) est supprimé — `h2`
  hérite à nouveau du `clamp(2.4rem,…,5.6rem)` générique du site. La
  largeur de la colonne (`width:min(24rem,46%)` sur `.talent-stage-caption`)
  n'a volontairement PAS changé : à la taille générique dans cette même
  colonne étroite, le texte replie naturellement sur 3-4 lignes au lieu de
  2 — exactement le "plus dans la longueur que dans la largeur" demandé,
  sans aucun risque de déborder sur le visage à droite (vérifié par script
  Playwright : `h2` reste strictement dans les bornes de `.talent-stage-caption`
  à 4 largeurs).
  **2) Photo encore moins zoomée pour laisser la place au titre agrandi**
  ("il faut que tu dézoomes les photos pour laisser de la place à
  l'apparition du titre") : `.talent-stage-media` (≥640px) passe de
  `min(88vh,60rem)` à `min(92vh,66rem)` — même levier que l'itération
  précédente (une boîte plus HAUTE réduit le zoom effectif de
  `object-fit:cover` sur une largeur fixe), poussé plus loin pour
  compenser la hauteur supplémentaire qu'occupe désormais le titre à
  taille normale sur 3-4 lignes.
  **3) Glissement ralenti** ("fais-le plus lentement") : la transition
  `opacity`/`transform` de `.talent-stage-panel` passe de `0.5s` à `1s` ;
  le décalage de départ (`translateX`) est élargi de `-2rem` à `-3rem`
  pour que le glissement reste perceptible sur cette durée plus longue
  plutôt que de se lire comme un simple fondu ralenti. Capturé en plein
  milieu de transition par script Playwright (opacité intermédiaire +
  `translateX` intermédiaire mesurés sur les deux panneaux simultanément)
  pour confirmer visuellement l'effet de croisement plutôt que de se fier
  seulement à la valeur de `transition-duration`.
  **4) Bande crème retirée entre Engagements et Équipe, fond des cartes en
  terracotta** : `.talents` perd son dernier padding restant
  (`padding-block: var(--space-5) 0` → `0`) — c'était ce padding du haut,
  fond `--bg-dim`, qui se lisait comme un bref bandeau clair ("blanc
  calcaire") entre la section Engagements et la photo Équipe ; `.engagements`
  passe de `background: var(--navy)` à `background: var(--terracotta)`.
  Les deux changements combinés font que la photo Équipe (fond
  `--navy-900`) touche désormais directement le bas d'Engagements
  (terracotta) — une vraie rupture de couleur nette plutôt qu'un fondu via
  une bande intermédiaire, vérifié par script Playwright (écart mesuré
  entre les deux sections : 0px aux 4 largeurs testées). `.engagements
  .lede` (texte blanc à 88% d'opacité) n'a demandé aucun ajustement de
  contraste, déjà suffisamment lisible sur terracotta.
  Vérifié par script Playwright (0 débordement horizontal, `h2` toujours
  contenu dans sa colonne, transition mesurée à `1s`, écart Engagements/
  Talents à 0px) à 4 largeurs desktop/tablette + mobile, et capture
  d'écran à chaque largeur. Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console (les `brokenImgs` occasionnels sur
  `index.html`/`projets.html` sont le faux positif de lazy-loading déjà
  documenté — images non scrollées dans le viewport au moment du test,
  confirmées fonctionnelles par requête directe, sans rapport avec les
  changements de cette session).
- **Engagements — fond rouge Pourpre de Venise ; Équipe — titre sur 2
  lignes exactement, boîte qui s'adapte au contenu (bug de rognage
  corrigé), nouvelles photos avec plus d'espace, texte remonté
  (2026-08-20, même journée)** (`.engagements`, `.talent-stage*`,
  `engagements.html`) : cinq demandes de la cliente en une fois, sur le
  rendu de l'itération précédente.
  **1) Fond Engagements recoloré en rouge Pourpre de Venise**
  (`var(--rosso-venezia)`, `#9d3636`) — remplace le terracotta uni de
  l'itération précédente (elle-même un remplacement du bleu Méditerranéen,
  lui-même un remplacement du fond animé à lueurs). Aucun ajustement de
  contraste nécessaire (`.engagements .lede` en blanc à 88% d'opacité
  reste lisible).
  **2) Titre "Les talents derrière Simposio" forcé à exactement 2 lignes**,
  demande explicite, à la taille de police générique du site (déjà
  restaurée à l'itération précédente). `<br>` manuel dans le HTML ("Les
  talents" / "derrière Simposio") plutôt que de compter sur un retour à la
  ligne automatique. **`.talent-stage-heading` élargi au-delà de la
  colonne de `.talent-stage-caption`** (`width:max-content; max-width:
  52rem`, contre la colonne à `min(26rem,48%)`) — à la taille générique
  (jusqu'à `clamp(…,5.6rem)`), aucune colonne aussi étroite ne peut
  contenir "derrière Simposio" sur une seule ligne. `.talent-stage-caption`
  n'a pas `overflow:hidden` (seul `.talent-stage`, son grand-parent, l'a),
  donc un enfant peut dépasser la largeur nominale de son parent sans être
  rogné — seul le titre partagé (identique pour les deux personnes) a
  besoin de cette largeur ; le nom/rôle/bio, propre à chaque membre, reste
  lui dans la colonne étroite pour ne jamais s'approcher du visage.
  `52rem` calibré empiriquement par script Playwright balayant plusieurs
  valeurs à 2000px de large (le cas le plus contraignant, où le `clamp`
  atteint son plafond) : `50rem` est le minimum qui tient encore sur 2
  lignes, `52rem` garde une petite marge.
  **Piège réel rencontré et corrigé** : un premier essai donnait
  `max-width:46rem` seul à `.talent-stage-heading` sans `width:
  max-content` — en enfant d'un flex column, l'alignement par défaut
  (`align-items:stretch`) étire un enfant à la largeur du conteneur
  (26rem) quel que soit son `max-width` (qui ne fait que plafonner cet
  étirement, il ne rend jamais l'enfant plus large que son parent) —
  repéré par capture d'écran : le titre repliait sur 4 lignes au lieu de
  2 malgré le `max-width` généreux. Corrigé en ajoutant `width:
  max-content` (fait dépendre la largeur du texte réel, comme un
  `inline-block`, jusqu'au plafond de `max-width`).
  **3) Bug de rognage du haut du titre trouvé et corrigé, plus grave que
  le point 2** : avant ce correctif, `.talent-stage-caption` utilisait
  `position:absolute;inset:0` (calé exactement sur la hauteur de
  `.talent-stage-media`, une hauteur CIBLE en `vh`/`rem`) avec
  `justify-content:flex-end` pour ancrer le groupe [titre+panneau] en bas
  — mais à la taille de police générique, titre (2 lignes + eyebrow) et
  panneau (nom+rôle+bio) mesurés ensemble (~740px) dépassaient largement
  la hauteur cible réellement disponible à un viewport courant de
  900px de haut (~846px moins les paddings ≈ 580px) : la légende
  débordait de `inset:0` par le HAUT, hors du cadre, et se faisait rogner
  par `overflow:hidden` sur `.talent-stage` — repéré par script Playwright
  (`getBoundingClientRect` du titre commençant à une coordonnée NÉGATIVE
  par rapport à la photo, pas seulement au visuel : le mot "Les" était
  visiblement coupé en haut de la capture d'écran). **Corrigé en
  remplaçant `position:relative` + `inset:0` par une grille CSS à une
  seule cellule** : `.talent-stage` passe en `display:grid` (≥640px),
  `.talent-stage-media` et `.talent-stage-caption` partagent
  `grid-area:1/1` — la grille dimensionne alors `.talent-stage` sur le
  PLUS GRAND des deux enfants au lieu de forcer la légende à occuper
  exactement la hauteur (désormais `min-height`, pas `height`) de la
  photo. Si le contenu a besoin de plus de place, la photo s'étire pour
  suivre (elle reste `position:relative` avec des enfants `inset:0`, donc
  elle suit automatiquement la hauteur réelle de la cellule) — plus jamais
  de rognage, au prix d'un débordement de la hauteur cible sur les
  fenêtres courtes (un peu de défilement dans la section) plutôt qu'un
  titre tronqué, compromis assumé. `.talent-stage-caption` a aussi reçu
  `align-self:stretch` explicite (nécessaire pour que `justify-content:
  flex-end` ait de l'espace à exploiter quand c'est la photo, pas la
  légende, qui pilote la hauteur de la cellule) et `justify-self:start`
  (aligné à gauche dans la cellule, pas centré/étiré par défaut).
  **4) Nouvelles photos, moins zoomées, avec plus d'espace** ("trouve
  d'autres photos de membres qui sont moins zoomées et qui laissent plus
  de place... sans cacher ou être trop près des photos des membres") :
  les deux anciennes photos (Zoe Galarza et Edmond Dantès, portraits
  serrés tête+épaules) laissaient peu de marge une fois recadrées dans la
  boîte très large/peu haute. Remplacées par deux photos à fond uni avec
  énormément d'espace vide autour du sujet — `talent-placeholder-1.jpg`
  (Pisey Tuon, fond crème, buste complet bras croisés) et
  `talent-placeholder-2.jpg` (Karola G, fond blanc, quasiment la moitié du
  cadre est un mur vide au-dessus de la tête) — choisies dans le même
  esprit (fond uni, bras croisés) pour former une paire visuellement
  cohérente. Un premier candidat (photo de bureau avec bibliothèque et
  cadres photo en fond) a été écarté avant même d'être testé : le décor
  montrait d'autres visages photographiés, source de confusion possible
  sur une page "équipe". `assets/img/CREDITS.md` mis à jour pour les deux
  remplacements. `object-position` générique repassé à `30% 22%` (les
  anciennes valeurs `22%`/`38%` par photo, calibrées pour les anciennes
  images, n'ont plus lieu d'être) — fonctionne bien pour les deux
  nouvelles photos grâce à leur généreux espace négatif, aucun réglage par
  photo nécessaire cette fois.
  **5) Texte descriptif remonté davantage** ("remonte le texte
  descriptif des membres... trop proche de la ligne du bas") : la colonne
  de texte (`.talent-stage-caption`) est élargie de `min(24rem,46%)` à
  `min(26rem,48%)` (arrêts du dégradé/masque et position du sélecteur
  d'avatars ajustés en proportion : `min(58%,34rem)`→`min(58%,37rem)`,
  `max(34rem,48%)`→`max(37rem,50%)`) et le `padding-bottom` du groupe
  bas-ancré passe à `12rem` (contre ~8.5rem à l'itération précédente) —
  la bio finit désormais nettement plus haut au-dessus de la rangée
  d'avatars.
  Vérifié par script Playwright (0 chevauchement titre/panneau à toutes
  les largeurs testées, `h2` confirmé à 2 lignes exactement de 768 à
  2000px de large — balayage de plusieurs `max-width` à la largeur la
  plus contraignante avant de fixer 52rem —, navigation clavier Tab/Enter
  et reveal `[data-reveal]` toujours fonctionnels, 0 débordement
  horizontal) et capture d'écran aux mêmes largeurs pour les deux photos.
  Regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Équipe — décalage horizontal des photos via `transform` (`object-position`
  s'avère inopérant à cette échelle) ; Engagements — fond repris tel quel
  du chemin des 5 sens (2026-08-20, même journée)**
  (`.talent-stage-photo`, `.engagements`, `style.css`) : deux demandes de
  la cliente sur deux zones distinctes de cette même page.
  **1) Photos Équipe décalées à droite, sans toucher au titre** : la
  cliente a signalé (captures à l'appui) que le titre "Les talents
  derrière Simposio", redevenu grand à l'itération précédente,
  chevauchait visuellement le visage des deux membres — et a explicitement
  demandé de ne PAS réduire/retoucher le titre, seulement de décaler les
  photos vers la droite. **`object-position` horizontal s'est révélé
  totalement inopérant dans cette configuration précise** — vérifié
  empiriquement d'abord (balayage de 30% à 0%, aucun changement visible à
  l'écran, contrairement à tous les réglages `object-position` précédents
  sur cette même image qui avaient un effet net), puis confirmé par
  calcul plutôt que laissé comme une anomalie non expliquée : avec
  `object-fit:cover`, le facteur d'échelle appliqué vaut
  `max(largeur_boîte/largeur_image, hauteur_boîte/hauteur_image)`. La
  boîte `.talent-stage-media` est extrêmement large et relativement peu
  haute (`min(94vh,72rem)` de haut pour une largeur qui peut dépasser
  1900px, cf. itération précédente), alors que les 2 photos sources
  (1600px de large) ne le sont pas dans ces proportions — l'échelle est
  donc systématiquement pilotée par la LARGEUR à ces dimensions, ce qui ne
  laisse mathématiquement plus aucune marge horizontale : la photo occupe
  déjà 100% de la largeur de la boîte une fois mise à l'échelle, donc
  glisser le point d'ancrage `object-position` horizontalement n'a
  littéralement rien à décaler. Corrigé en sortant du système
  `object-fit`/`object-position` pour l'axe horizontal : un
  `transform:scale()+translateX()` posé directement sur l'`<img>` (une
  opération visuelle appliquée APRÈS le calcul de `cover`, donc
  indépendante de sa logique de mise à l'échelle) zoome légèrement
  au-delà du cadre puis décale ce surplus vers la droite —
  `.talent-stage` a déjà `overflow:hidden` (établi à une itération
  précédente), donc le débordement induit par le zoom est proprement
  rogné sans jamais laisser de bord vide, vérifié par script (0
  débordement horizontal à 390/768/1024/1440/2000px). Valeurs calibrées
  séparément par photo, par balayage empirique (plusieurs couples
  `scale`/`translateX`, capture d'écran à chaque valeur, jamais deviné) :
  photo 1 (Pisey Tuon) → `scale(1.4) translateX(14%)` ; photo 2 (Karola
  G), qui avait déjà davantage d'espace négatif autour du sujet dans sa
  composition d'origine, supportait un décalage bien plus modeste sans
  perdre en naturel → `scale(1.15) translateX(6%)`. **Une première tentative
  a appliqué la valeur de la photo 1 aux deux photos** — repéré avant
  publication en re-capturant explicitement la photo 2 avec cette même
  valeur (pas supposé applicable par défaut) : trop zoomée/décalée par
  rapport à sa composition plus aérée. Si `object-position` horizontal est
  retouché sur `.talent-stage-photo` en espérant un effet visible, revoir
  d'abord ce calcul de saturation d'échelle avant de perdre du temps sur
  des valeurs qui n'auront aucun effet à ces dimensions de boîte.
  **2) Fond `.engagements` repris du chemin des 5 sens** ("prends le même
  fond que pour le chemin des cinq sens") : remplace le rouge Pourpre de
  Venise uni de l'itération précédente par le dégradé exact de
  `.senses-journey-sticky` — `radial-gradient(55% 50% at 88% 8%,
  rgba(193,98,45,0.3), transparent 60%)` + `linear-gradient(190deg,
  var(--rosso-ombria) 0%, #2b1010 100%)` — copié tel quel plutôt que
  réécrit, pour rester automatiquement synchronisé si l'un des deux est
  retouché plus tard. **`.engagements` ajoutée au sélecteur partagé du
  grain photo** (`.hero::after, .senses-journey-sticky::after,
  .engagements::after`) en plus du dégradé : la texture fait partie de la
  façon dont ce fond se lit sur la section des 5 sens, l'omettre aurait
  donné un fond visuellement proche mais pas "le même" au sens strict de
  la demande — sans risque de conflit, `.engagements::after` avait été
  entièrement libéré à une itération précédente (retrait du carré
  terracotta décoratif qui l'occupait). Si `.engagements` retrouve un
  `background: var(--rosso-venezia)` uni ou si `.engagements::after` est
  retiré du sélecteur partagé, c'est un retour à l'itération précédente, à
  ne pas réintroduire sans qu'on le redemande.
  Vérifié par script Playwright (0 débordement horizontal aux 5 largeurs,
  0 erreur console, `transform` confirmé appliqué sur les deux
  `<img>`, fond en dégradé + grain confirmés sur `.engagements`) et
  capture d'écran des deux photos (les deux membres) à 768/1024/1440/2000px
  et du fond Engagements à mi-scroll. Regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Équipe et Engagements interverties, fond Engagements repassé à un
  dynamique en terracotta (2026-08-20, même journée)**
  (`engagements.html`, `.engagements`, `style.css`) : deux demandes de la
  cliente en une fois, arrivées quelques minutes seulement après le fond
  "identique aux 5 sens" ci-dessus (donc très éphémère — jamais vu en
  ligne par la cliente avant d'être déjà remplacé).
  **1) Ordre des sections inversé** : `.talents` (le "stage" photo+texte de
  l'équipe) passe désormais AVANT `.engagements` (les flip-cards), alors
  que l'ordre était l'inverse depuis la toute première version de cette
  page. Simple réordonnancement des deux `<section>` dans le HTML — aucun
  changement de contenu, de mécanisme ni de style à l'intérieur de chacune.
  Nouvel ordre complet de `<main>` sur `engagements.html` : bandeau titre
  (crème) → **talents** (photo pleine largeur, fond navy-900 côté texte) →
  **engagements** (fond terracotta dynamique, cf. point 2) → founder
  (typographie minimaliste sur crème) → values-reel (album Valeurs, navy).
  Un commentaire `<!-- ============================== ENGAGEMENTS
  ============================== -->` a été ajouté au-dessus de la section
  (elle n'en avait jamais eu, contrairement à `<!-- TALENTS -->` déjà
  présent) pour la cohérence de lisibilité du fichier maintenant que les
  deux sont adjacentes dans un nouvel ordre.
  **2) Fond Engagements redevenu dynamique, en terracotta** ("mets un fond
  terracotta dynamique") : remplace le dégradé statique identique à
  `.senses-journey-sticky` de l'itération précédente (rouge Pourpre de
  Venise/navy foncé) — celle-ci est donc restée en place moins longtemps
  que toutes les précédentes itérations de ce fond. Reprend la technique
  du tout premier fond dynamique de cette section (2026-08-17, lueurs
  radiales floutées en dérive lente via `::before` + `@keyframes
  engagementsBgDrift`, retirée le 2026-08-18 puis jamais réutilisée
  depuis) mais avec un vrai changement de dosage : cette fois le
  **terracotta est la teinte de base** de tout le fond
  (`linear-gradient(200deg, var(--terracotta) 0%, #7a3a1c 100%)`), avec des
  lueurs en rouge Pourpre de Venise/rouge Terre d'Ombrie/crème par-dessus
  — la version d'origine faisait l'inverse (base navy, terracotta
  seulement en lueur). C'est la nuance exacte de la nouvelle demande
  ("fond terracotta dynamique", pas juste "fond dynamique"). `::before`
  reprend les mêmes paramètres que l'origine (`inset:-25%`, `blur(60px)`,
  animation `translate`+`scale` sur 26s en boucle alternée) — aucune règle
  `prefers-reduced-motion` dédiée nécessaire, la règle globale du site
  (`animation-duration:0.01ms !important`, tout en haut du fichier) neutralise
  déjà cette animation, même convention que `@keyframes promisePhotoDrift`
  juste au-dessus dans le fichier. **`.engagements` retirée du sélecteur
  partagé de grain photo** (`.hero::after`/`.senses-journey-sticky::after`)
  où elle avait été ajoutée à l'itération précédente pour matcher le fond
  des 5 sens au pixel près — cette raison d'être n'existe plus une fois le
  fond remplacé par ce nouveau dégradé dynamique, ce grain n'a donc pas été
  réappliqué sans qu'on le redemande. Si `background: var(--rosso-venezia)`
  ou un dégradé identique à `.senses-journey-sticky` réapparaissent sur
  `.engagements`, ou si `.engagements` réapparaît dans le sélecteur partagé
  de grain, c'est un retour à l'itération précédente, à ne pas réintroduire
  sans qu'on le redemande.
  Vérifié par script Playwright (ordre des sections confirmé dans le DOM —
  `talents`, `engagements`, `founder`, `values-reel` —, 0 débordement
  horizontal, 0 erreur console, `animation-name:engagementsBgDrift`
  confirmé sur `::before`, `transform` de `::before` mesuré à 2s
  d'intervalle pour confirmer que l'animation progresse réellement plutôt
  que rester figée) et capture d'écran des cartes Engagements desktop
  (1440px) + mobile (390px). Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Engagements repassé avant Équipe, bandeau resserré en largeur
  (2026-08-20, même journée)** (`engagements.html`, `.engagements`,
  `style.css`) : la cliente est revenue sur l'inversion précédente
  (ci-dessus) et a demandé un ajustement de proportions sur le fond.
  **1) Ordre remis dans le sens d'origine** : `.engagements` (les
  flip-cards) repasse AVANT `.talents` (le "stage" équipe) — annule
  exactement le réordonnancement du bullet précédent. Nouvel ordre de
  `<main>` : bandeau titre → **engagements** → **talents** → founder →
  values-reel. Le commentaire `<!-- ENGAGEMENTS -->` ajouté lors de
  l'inversion précédente (pour la lisibilité une fois les deux sections
  adjacentes dans l'autre sens) est retiré avec le retour à l'ordre
  d'origine, qui n'en avait jamais eu.
  **2) Bandeau terracotta resserré en largeur** ("réduis la taille du
  bandeau en largeur car là il est trop gros par rapport à la taille des
  cartes, je veux qu'il y ait un moins grand écart entre le bord d'écran
  et le bandeau") : le fond terracotta dynamique (introduit au bullet
  précédent) était plein-bleed (`100vw`, comme la plupart des sections du
  site), ce qui le faisait paraître disproportionné par rapport aux 4
  cartes qu'il contient (~66rem de large au total, bien moins que la
  largeur d'un grand écran). **`.engagements` reçoit `max-width:
  var(--max-width)` (1320px — la même largeur que `.container` partout
  ailleurs sur le site, réutilisée plutôt qu'une valeur inventée) +
  `margin-inline:auto` + `border-radius:var(--radius-lg)`** : le fond
  devient un panneau centré, proportionné aux cartes, avec des coins
  arrondis puisque ce n'est plus une bande bord-à-bord mais un bloc qui
  flotte sur le crème de la page. Sous ~1320px de large (tablette/mobile,
  où le site n'a de toute façon jamais de marges génériques latérales
  hors `.container`), le bloc redevient naturellement plein-largeur — la
  cliente a précisé vouloir "un MOINS grand écart" (pas de très grande
  marge), donc plafonner à la largeur de `.container` plutôt qu'à une
  valeur plus étroite : l'écart résultant reste modeste sur les largeurs
  desktop courantes (60px de chaque côté à 1440px, 150px à 1620px) et ne
  devient plus généreux que sur les très grands écrans (300px à 1920px),
  sans jamais créer un vide disproportionné. `overflow:hidden` (déjà en
  place pour clipper le calque de lueurs animées `::before`) continue de
  fonctionner correctement avec le nouveau `border-radius` — le
  navigateur clippe bien le contenu aux coins arrondis, vérifié par
  capture d'écran (aucune lueur qui déborde des coins). Si
  `.engagements` retrouve `overflow:hidden` seul (sans `max-width`/
  `margin-inline:auto`/`border-radius`), c'est le bandeau plein-bleed
  précédent, à ne pas réintroduire sans qu'on le redemande.
  Vérifié par script Playwright (ordre des sections confirmé dans le DOM —
  `engagements`, `talents`, `founder`, `values-reel` —, largeur/écart du
  bandeau mesurés à 5 largeurs : plein-largeur sous 1320px, écart
  symétrique croissant au-delà, 0 débordement horizontal, 0 erreur
  console) et capture d'écran desktop (1024/1440/1920px) + mobile
  (390px). Regression complète 5 pages × 2 viewports : 0 débordement, 0
  erreur console.
- **Engagements — bandeau retiré, seules les cartes restent ; dos des
  cartes en terracotta (2026-08-20, 6ᵉ passe)** (`.engagements`,
  `.engagement-card-back*`, `style.css`) : la cliente a fait marche
  arrière sur le panneau resserré de la passe précédente ("on va essayer
  d'enlever complètement le bandeau d'écart d'engagement et laisser
  uniquement les cartes d'engagement") — remplace entièrement le fond en
  dégradé terracotta/coins arrondis/calque de lueurs animées
  (`.engagements::before`/`@keyframes engagementsBgDrift`) par une section
  sans aucun style de fond propre : `.engagements` ne porte plus que
  `padding-block`, les 4 cartes reposent directement sur le fond crème de
  la page (hérité de `body { background: var(--bg) }`). `.engagements
  .lede` (qui portait un blanc translucide pensé pour le fond terracotta
  disparu) revient au style `.lede` générique du site (texte sombre par
  défaut) plutôt que d'être surchargé. Si un `background`/`border-radius`/
  `::before` réapparaissent sur `.engagements`, c'est une itération
  précédente (bandeau plein-bleed ou resserré), à ne pas réintroduire sans
  qu'on le redemande.
  **Le terracotta ne disparaît pas de la section — il se déplace sur le
  dos des cartes** ("lorsque le retourne elles doivent être de couleur
  terracotta") : `.engagement-card-back` passe du dégradé navy hérité de
  la toute première version des flip-cards à
  `linear-gradient(200deg, var(--terracotta) 0%, #7a3a1c 100%)` (mêmes
  arrêts de couleur que l'ancien fond de bandeau, réutilisés ici plutôt
  qu'une nouvelle valeur inventée). **Ajustement de contraste nécessaire
  et repéré avant publication, pas après coup** : `.engagement-card-num-back`
  et `.engagement-card-back-close` ("Retour") héritaient de
  `var(--terracotta-300)` — une teinte claire pensée pour ressortir sur un
  fond sombre (navy), qui devenait quasi illisible une fois le dos
  lui-même terracotta (même famille de teinte, contraste proche de zéro).
  Recolorés en `var(--navy)`, le choix de contraste déjà établi ailleurs
  sur le site pour du texte sur fond terracotta (`.stats-band`,
  `.contact-band`) — le titre et le texte du dos restent en crème/blanc
  translucide, déjà suffisamment contrastés sans changement.
  **Le titre reste entièrement visible sur un écran de PC avant tout
  scroll, sans changement nécessaire à `.page-header-full`** : la cliente
  a demandé explicitement d'"adapter l'espace par rapport au titre" pour
  ce résultat, mais `.page-header-full` (déjà en place, cf. plus haut)
  force `height:100vh`/`100svh` — le titre occupait déjà tout le premier
  écran et rien de `.engagements` n'était visible avant le premier scroll,
  qu'il y ait un fond de section ou non. Retirer le bandeau n'affecte donc
  pas cette mécanique ; vérifié explicitement (pas supposé) par script
  Playwright mesurant, à 1440×900, 1440×1080 et 390×844, la position du
  `<h1>` (entièrement dans les bornes du viewport) et celle du haut de
  `.engagements` (toujours ≥ hauteur du viewport au chargement) — confirmé
  aux 3 tailles.
  Vérifié par script Playwright (0 débordement horizontal, 0 erreur
  console sur les 5 pages × 2 viewports, retournement clic + clavier
  Enter toujours fonctionnel — `aria-expanded` confirmé, dégradé du dos
  mesuré via `getComputedStyle`) et capture d'écran desktop (cartes non
  retournées + carte 1 retournée en gros plan) + mobile (390px).
- **Bandeau chiffres clés (accueil) — centrage corrigé ; menu plein écran
  entièrement retravaillé (2026-08-20)** : deux demandes distinctes de la
  cliente.
  **1) `.stats-band-grid` — vraie cause du défaut de centrage identifiée
  et corrigée** (`style.css`) : la cliente a signalé que les infos
  n'étaient "pas parfaitement centrées" dans leur colonne, ni l'ensemble.
  Cause réelle, pas une impression : les séparateurs verticaux entre
  colonnes étaient un `border-left` + `padding-left` sur `.stats-band-grid
  > div` (retirés uniquement sur `:first-child`) — `border`/`padding`
  consomment de l'espace UNIQUEMENT à gauche du contenu, donc
  `text-align:center` centrait chaque chiffre/libellé dans une boîte de
  contenu asymétrique (décalée vers la droite pour les colonnes 2 à 4, la
  1ʳᵉ n'ayant ni l'un ni l'autre) — visible sur capture d'écran ("1" et "5
  sens" nettement à gauche du milieu de leur piste). Corrigé en
  transformant le séparateur en `::before` décoratif positionné en absolu
  au bord gauche de la piste (`position:relative` sur le `div`, `::before`
  en `inset:0 auto 0 0`) : il n'occupe plus aucun espace de mise en page,
  donc `text-align:center` centre désormais sur toute la largeur réelle de
  la piste `1fr` — et par construction, la ligne entière de 4 colonnes
  égales se lit comme parfaitement centrée dans `.container`. Vérifié par
  script Playwright mesurant le milieu de chaque `<dt>` contre le milieu
  de sa colonne (`getBoundingClientRect`) : écart de `0.0px` sur les 4
  colonnes à 1440px de large. Si `padding-left`/`border-left` réapparaissent
  sur `.stats-band-grid > div`, c'est ce défaut de centrage, à ne pas
  réintroduire sans qu'on le redemande.
  **2) Menu plein écran (`.mobile-menu`) — refonte complète** (les 5
  pages, `style.css`) : demande explicite ("rajoute l'accueil dans la page
  du menu et retravaille-moi complètement la page du menu, je te laisse me
  faire une proposition, garde juste l'idée de mettre les polices en très
  très grand"). **C'est bien "la page du menu" au sens propre** :
  `.nav-toggle` (le bouton "Menu") n'est masqué par aucune media query
  dans `style.css` — ce plein écran est l'unique navigation du site, à
  toutes les largeurs, pas seulement en mobile malgré son nom de classe
  hérité.
  **"Accueil" ajouté** : 5ᵉ page manquante du menu (`index.html`), insérée
  en première position — le menu comptait jusque-là Prestations/Projets/
  À propos/Contact seulement.
  **Proposition retenue** — une seule colonne empilée à toutes les
  largeurs (remplace la disposition à deux colonnes précédente, liens à
  gauche/bloc contact figé à droite dès 860px, devenue impraticable avec
  une police aussi grande) :
  - Eyebrow "Menu" en haut (style `.eyebrow.on-dark` générique du site).
  - Les 5 liens en pleine largeur, chacun précédé d'un numéro d'index
    (`01`–`05`, classe `.idx` — **réutilise une classe CSS déjà présente
    dans le fichier mais jamais posée dans le HTML d'aucune page**,
    trouvée morte pendant l'audit de ce composant, plutôt que d'en créer
    une nouvelle). Taille de police portée à
    `clamp(2.6rem, 5vw + 1.4rem, 7.5rem)` — plafond desktop presque
    doublé par rapport à l'ancien (`4.5rem`), calibré par script
    Playwright (390 à 1920px de large) pour rester "très très grand" sans
    qu'aucun libellé (y compris "Prestations", le plus long) ne déborde
    ni ne se replie sur mobile étroit.
  - **Page courante mise en valeur** (nouveauté, absente de l'ancien
    menu) : chaque fichier HTML porte `class="is-current"
    aria-current="page"` sur son propre lien (balisage dupliqué par page,
    cohérent avec la convention déjà en place pour header/footer) — le
    lien passe en terracotta clair, son numéro d'index repasse en crème
    pour garder le contraste inversé. Vérifié par script Playwright sur
    les 5 pages : le bon lien (et lui seul) porte `.is-current` à chaque
    fois.
  - **Bande basse remplace la colonne latérale** : citation de marque
    (« L'événement qui a le goût d'une expérience. », déjà utilisée comme
    baseline ailleurs sur le site — texte existant réutilisé, rien
    d'inventé), coordonnées (email/localisation, markup `.mobile-menu-info`
    inchangé) et icônes Instagram/LinkedIn — empilée sur mobile, sur une
    ligne dès 700px. **Icônes sociales dupliquées depuis le header**
    (mêmes SVG, classe `.nav-social` réutilisée telle quelle) : le header
    (`z-index:100`) passe derrière l'overlay plein écran (`z-index:199`)
    tant que le menu est ouvert, ces icônes lui étaient donc jusqu'ici
    inaccessibles pendant la consultation du menu — corrigé au passage,
    pas seulement esthétique.
  - `.mobile-menu-sub`/`.mobile-menu-side` (CSS mort, jamais référencé par
    aucun des 5 fichiers HTML avant cette refonte) retirées plutôt que
    reconduites.
  Vérifié par script Playwright (0 débordement horizontal sur les 5 pages
  × 2 viewports, avec le menu ouvert ET fermé ; navigation clavier
  Tab/Enter confirmée fonctionnelle — Enter sur un lien focus déclenche
  bien la navigation ; fermeture/réouverture du menu revérifiée) et
  capture d'écran desktop (1440px, y compris la bande basse une fois
  scrollée dans la fenêtre du menu) + mobile (390px). Si l'ancienne mise
  en page à deux colonnes (`.mobile-menu-side`) réapparaît dans un diff,
  c'est cette ancienne version, à ne pas réintroduire sans qu'on le
  redemande.
- **Bandeau chiffres clés — vrai défaut de rythme des séparateurs corrigé ;
  menu — 2ᵉ refonte complète en "panneau divisé" garanti tenir sur un
  écran (2026-08-20, même journée)** : la cliente est revenue sur les deux
  chantiers précédents avec un jugement plus tranché ("il faut que
  vraiment tout soit centré à la perfection" / "retravailler complètement
  le menu pour que ça tienne sur un écran").
  **1) Bandeau chiffres clés — le centrage des colonnes était déjà exact,
  le vrai défaut était ailleurs** : re-vérifié par script Playwright à 21
  largeurs (701 à 2560px), mesurant le milieu de chaque `<dt>` contre le
  milieu de sa colonne ET le milieu du bandeau lui-même — **0,0px d'écart
  partout**, confirmant que le correctif de la passe précédente
  (`::before` au lieu de `padding-left`/`border-left`) tenait bien. Le
  vrai problème, trouvé en examinant le RYTHME visuel plutôt que la seule
  géométrie des colonnes : chaque séparateur (`::before`, `left:0`) se
  plaçait au bord GAUCHE de sa propre colonne, donc juste après le `gap`
  complet (44px) qui suit la colonne précédente — le trait "colle" au
  bord de la colonne suivante avec zéro espace de son côté droit, tout
  l'espace du gap se retrouvant de son côté gauche. Répété 3 fois sur la
  ligne, ce déséquilibre cumulatif (plein d'espace avant chaque trait,
  aucun après) est ce qui donnait l'impression que "tout est poussé vers
  la droite", même si le TEXTE de chaque colonne restait, lui,
  parfaitement centré dans sa piste. **Corrigé en recentrant chaque
  séparateur au milieu de son `gap`** (`left: calc(var(--space-4) / -2)`,
  ≥701px uniquement — sous 700px la mise en page passe en une seule
  colonne empilée, le trait y reste un simple accent vertical `left:0`,
  pas un séparateur "entre deux colonnes"). Vérifié par script Playwright :
  chaque trait tombe exactement au milieu géométrique de son gap (mesuré
  par rapport au bord droit de la colonne précédente et au bord gauche de
  la colonne suivante) aux 3 positions.
  **2) Menu — 2ᵉ refonte complète, contrainte de hauteur d'abord** : la
  1ʳᵉ refonte (bullet précédent, même journée) débordait en hauteur sur
  des fenêtres de navigateur courtes — la cliente a demandé une refonte
  complète avec cette contrainte comme priorité n°1 ("pour que ça tienne
  sur un écran") et un nouveau design ("fais un nouveau design"), pas
  seulement un ajustement de taille. **Remplace entièrement** la colonne
  unique + bande basse de l'itération précédente par un **panneau divisé
  en deux** : `.mobile-menu-brand` (terracotta, la citation de marque déjà
  utilisée ailleurs sur le site, réservé au desktop ≥860px pour ne pas
  grignoter le budget vertical déjà serré en mobile) + `.mobile-menu-nav`
  (navy-900, les liens + pied de page) — empilés en une seule colonne sous
  860px (le panneau terracotta disparaît alors). Si `.mobile-menu-grid`/
  `.mobile-menu-tagline` en bas de page réapparaissent, c'est l'itération
  précédente, à ne pas réintroduire sans qu'on le redemande.
  **Le point technique clé pour garantir "tient sur un écran"** : la
  taille des liens est indexée sur `vh` (hauteur de viewport) et non `vw`
  — même technique déjà établie et éprouvée sur ce site pour cette exacte
  contrainte (cf. `fitPromiseLines()`/le calibrage en `vh` de la Promesse,
  historiquement sur `univers.html`) : "tenir sur un écran" est une
  contrainte de HAUTEUR, la taille doit donc suivre la hauteur
  disponible, pas la largeur. Le bouton fermer passe en `position:absolute`
  (ne consomme plus de hauteur dans le flux). **Vérifié par script
  Playwright balayant 17 combinaisons largeur×hauteur (640 à 1200px de
  haut, 390 à 1920px de large)** : `scrollHeight === clientHeight` du
  menu à chaque fois (0 débordement vertical, 0 scroll nécessaire) —
  `overflow-y:auto` reste en place mais uniquement comme filet de
  sécurité, jamais censé s'activer aux hauteurs réelles.
  **Deux bugs réels trouvés par capture d'écran après ce premier
  calibrage réussi, aucun supposé** :
  1. À 390px de large, "Prestations" (le libellé le plus long) débordait
     hors de l'écran horizontalement — invisible dans un test d'overflow
     classique (`document.documentElement.scrollWidth`) car
     `overflow-x:clip` sur `<html>` (règle globale du site) rogne
     silencieusement le dépassement au lieu de créer une scrollbar
     mesurable ; repéré uniquement par capture d'écran, montrant le mot
     visiblement tronqué. Cause : chaque lien est un `<a>` en
     `display:flex` imbriqué dans plusieurs niveaux de flex-colonne
     (`.mobile-menu-nav` → `.mobile-menu-links` → `a`) — sans `min-width:0`
     à CHAQUE étage, un flex item garde sa largeur intrinsèque de contenu
     non replié (`min-width:auto` par défaut), empêchant tout retour à la
     ligne même si le conteneur est plus étroit. Corrigé en ajoutant
     `min-width:0` en cascade à chaque niveau, et en isolant le texte du
     lien dans un `<span class="label">` dédié (`min-width:0;
     overflow-wrap:break-word`) plutôt que de compter sur le texte brut
     directement enfant du flex container.
  2. Une fois ce retour à la ligne permis, "Prestations" repliait sur 2
     lignes sur les téléphones les plus étroits/courts (320-360px), ce qui
     faisait déborder la hauteur du menu — le `font-size` n'étant indexé
     QUE sur `vh`, rien ne le réduisait quand c'est la LARGEUR qui manque.
     Corrigé en prenant `min(7.2vh, 11.5vw)` plutôt que `7.2vh` seul —
     `11.5vw` calibré par balayage (10 à 12vw, mesure du nombre de lignes
     réellement rendu par lien via `Range.getClientRects()`, pas
     `scrollWidth` qui ne détecte pas un retour à la ligne) : la plus
     grande valeur qui garde "Prestations" sur une seule ligne à
     320/360/375px de large, sans jamais dépasser la hauteur du viewport.
  Vérifié après ces deux correctifs : re-balayage complet des 17
  combinaisons largeur×hauteur (0 débordement vertical) + 6 largeurs
  étroites dédiées 320-414px (0 débordement horizontal, 0 retour à la
  ligne sur aucun lien). Page courante toujours mise en valeur, navigation
  clavier Tab/Enter revérifiée fonctionnelle après le changement de
  structure (`<span class="label">`). Regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Bandeau chiffres clés — asymétrie liée à la scrollbar corrigée ; menu
  — 3ᵉ refonte minimaliste avec chiffres fantômes (2026-08-20, même
  journée)** : la cliente a envoyé une capture d'écran Safari macOS
  montrant un écart visiblement inégal entre la 1ʳᵉ donnée et le bord
  gauche de la fenêtre vs. la 4ᵉ donnée et le "bord blanc" (la scrollbar
  native, visible comme une fine bande claire à droite) — puis redemandé
  un menu "plus minimaliste, mais toujours avec les grosses polices et un
  peu plus original".
  **1) Bandeau chiffres clés — cause enfin isolée : la scrollbar, pas le
  CSS du bandeau lui-même** (`main.js`, `style.css`) : tout le travail de
  centrage précédent (colonnes, puis rythme des séparateurs) était
  correct — invisible dans cet environnement de développement (Chromium
  headless utilise des scrollbars overlay qui ne réservent aucun espace de
  mise en page), mais la cliente utilise Safari avec une scrollbar
  classique (probablement une souris branchée — macOS bascule alors sur
  une scrollbar "toujours visible" qui réserve de la place, contrairement
  au comportement par défaut au trackpad). Tout élément centré via
  `margin-inline:auto` se centre par rapport à `document.documentElement.
  clientWidth`, qui EXCLUT la largeur de la scrollbar — donc par rapport à
  la fenêtre RÉELLE (scrollbar comprise, uniquement à droite), l'écart
  avec le bord droit vaut algébriquement `marge + largeur_scrollbar` alors
  que l'écart avec le bord gauche ne vaut que `marge` : le contenu est
  donc systématiquement décalé vers la gauche par rapport à la fenêtre
  réelle sur ce type de navigateur/configuration — démontré par calcul
  algébrique (pas juste mesuré) avant d'écrire le correctif.
  **Solution écartée d'abord** : `scrollbar-gutter: stable both-edges` sur
  `html` — corrige bien la symétrie en réservant une marge miroir à
  gauche, MAIS teste dans cet environnement révèle un effet de bord
  majeur non souhaité : ça introduit une marge crème permanente (~15px)
  sur TOUTES les sections plein-bleed du site (hero, bandeaux de couleur,
  etc.), cassant l'esthétique "pleine largeur" établie sur l'ensemble du
  site pour corriger un seul bandeau — changement bien plus large que ce
  qui a été demandé, écarté avant publication.
  **Solution retenue, ciblée** : `updateScrollbarWidth()` dans `main.js`
  mesure `window.innerWidth - document.documentElement.clientWidth` (0px
  sur un navigateur à scrollbar overlay) et l'expose en variable CSS
  `--scrollbar-w` sur `:root`, au chargement et au redimensionnement.
  `.stats-band-grid` seul applique `transform: translateX(calc(var(
  --scrollbar-w, 0px) / 2))` — un décalage vers la DROITE de la moitié de
  la largeur de la scrollbar, qui rétablit l'égalité des deux écarts par
  rapport à la fenêtre réelle (vérifié par calcul : après décalage, les
  deux écarts valent chacun `marge + largeur_scrollbar/2`). Sans effet sur
  le reste du site (contrairement à `scrollbar-gutter`), ni sur les
  navigateurs à scrollbar overlay (`--scrollbar-w` reste à 0px, `transform:
  translateX(0)`, no-op). Vérifié par script Playwright simulant une
  scrollbar de 16px (`--scrollbar-w` forcée manuellement) : le décalage
  mesuré correspond exactement à la moitié (8px), dans le bon sens.
  **2) Menu — 3ᵉ refonte, minimaliste avec chiffres "fantômes"**
  (`.mobile-menu*`, les 5 pages) : la cliente a rejeté le panneau divisé
  terracotta/navy de la refonte précédente. **Remplace entièrement**
  `.mobile-menu-panels`/`.mobile-menu-brand`/`.mobile-menu-nav`/
  `.mobile-menu-eyebrow` — plus de panneau terracotta, plus de citation de
  marque, plus de bloc "Menu" séparé : un seul fond navy uni, retour à une
  structure plus simple en surface (demande explicite "plus minimaliste").
  Si ces classes réapparaissent, c'est l'itération précédente, à ne pas
  réintroduire sans qu'on le redemande.
  **"Un peu plus original"** : chaque numéro d'index (`01`-`05`) devient
  un très grand chiffre "fantôme" en terracotta très translucide
  (`rgba(193,98,45,0.16)`), posé en fond de son lien et débordant
  légèrement à droite derrière le texte (façon filigrane de sommaire de
  magazine) — le libellé (`.label`) est superposé par-dessus en pleine
  opacité crème. Plus aucune ligne de séparation entre les liens (le
  `border-bottom` de l'itération précédente est retiré) : c'est ce chiffre
  fantôme qui rythme la liste, pas un trait — plus sobre en surface tout
  en gardant une identité graphique distincte. Au survol/focus clavier, le
  chiffre fantôme s'éclaircit (`rgba(...,0.3)`) et le libellé passe en
  terracotta clair, en plus du décalage `padding-left` déjà établi
  ailleurs sur le site pour ce type d'interaction ; la page courante
  reste identifiable même sans interaction (chiffre fantôme à
  `rgba(...,0.55)`, libellé en terracotta clair fixe).
  **"Tient sur un écran" reconduit sans qu'on le redemande à nouveau** :
  même technique `vh`/`min(vh,vw)` déjà établie à l'itération précédente
  (taille du libellé ET, cette fois, aussi du chiffre fantôme, tous deux
  calés sur la hauteur disponible) — reconduite ici pour ne pas
  réintroduire le débordement de la toute première refonte. Bouton fermer
  toujours en `position:absolute`. Vérifié par script Playwright balayant
  les mêmes 17 combinaisons largeur×hauteur (640-1200px de haut) : 0
  débordement vertical à chaque fois, et les 6 largeurs étroites dédiées
  (320-414px) : 0 débordement horizontal, chaque libellé toujours rendu
  sur une seule ligne — bug de `min-width:0` déjà rencontré et corrigé à
  l'itération précédente, revérifié absent ici (reconduit dans la nouvelle
  structure : `.mobile-menu-links`, `a` et `.label` portent tous
  `min-width:0`).
  Vérifié par script Playwright (0 débordement horizontal/vertical sur les
  5 pages × 2 viewports, menu ouvert ET fermé ; page courante confirmée
  correcte sur les 5 pages ; navigation clavier revérifiée avec un vrai
  `Tab` — pas seulement `.focus()` programmatique, qui ne déclenche pas
  toujours `:focus-visible` — confirmant la coloration terracotta au focus
  clavier réel, puis `Enter` déclenchant bien la navigation) et capture
  d'écran desktop (1440px, 1920px, état normal + survol) et mobile
  (390px). Regression complète 5 pages × 2 viewports : 0 débordement, 0
  erreur console.
- **Bandeau chiffres clés — le "défaut de centrage" n'en était pas un
  (effet optique), donnée 1 et 2 interverties (2026-08-20, même journée)**
  (`index.html`) : la cliente a renvoyé une nouvelle capture Safari montrant
  un écart visiblement inégal entre "4" et le bord gauche vs. "100% B2B" et
  le bord droit — après les deux correctifs précédents (rythme des
  séparateurs, compensation scrollbar), ce troisième signalement méritait
  une vérification directe dans SON navigateur plutôt qu'une nouvelle
  hypothèse à l'aveugle : script de diagnostic fourni à coller dans la
  console Safari (mesure `getBoundingClientRect()` du 1ᵉʳ et du dernier
  `<dt>` par rapport aux bords de la fenêtre réelle). **Résultat sans appel,
  mesuré dans son propre navigateur** : `gapLeft_dataToWindow: 124` et
  `gapRight_dataToWindow: 124` — rigoureusement identiques au pixel près,
  aucune scrollbar comptée (`scrollbarVar: "0px"`, `innerWidth === clientWidth`),
  aucun scroll horizontal résiduel (`scrollX: 0`). **Le bandeau est donc
  mathématiquement centré à la perfection — il n'y avait plus de bug de
  layout à corriger.** L'écart perçu vient d'un effet purement optique,
  inévitable et non spécifique à ce site : "4" est un seul chiffre étroit,
  laissant beaucoup de vide visible autour de lui dans sa colonne, tandis
  que "100% B2B" (texte bien plus long) remplit davantage sa colonne — son
  encre visuelle se rapproche donc naturellement des bords, même si sa
  boîte est géométriquement centrée exactement comme celle du "4". L'œil
  compare "la distance jusqu'au texte visible", pas "la distance jusqu'à
  la boîte" — un artefact qui apparaît sur pratiquement tout bandeau de
  chiffres-clés avec des libellés de longueurs différentes, pas un défaut
  de ce bandeau en particulier.
  **Cliente consultée explicitement** (`AskUserQuestion`, plutôt que de
  décider seul entre "laisser tel quel" et "rééquilibrer optiquement en
  cassant la symétrie géométrique exacte") : elle a choisi une 3ᵉ option
  plus simple — **intervertir les données 1 et 2** ("4" ↔ "5 sens") dans
  `index.html`. `<dt data-count="4">`/`<dd>` (avec son attribut
  `data-count` qui pilote le compteur JS) et le bloc "5 sens" échangent
  simplement de position dans le HTML — aucun changement CSS/JS requis,
  le compteur suit son `<dt>` quel que soit son rang dans la grille. Le
  nouvel ordre ("5 sens" / "4" / "Alsace" / "100% B2B") atténue l'effet
  optique signalé : le chiffre le plus court ("4") n'est plus en 1ʳᵉ
  position contre le bord de la bande, il est encadré par "5 sens" et
  "Alsace" des deux côtés.
  Vérifié par script Playwright : ordre confirmé dans le DOM après le
  swap, animation de comptage du "4" toujours fonctionnelle (atteint sa
  valeur finale), 0 débordement. Regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console. **Retenue méthodologique
  pour la suite** : face à un 3ᵉ signalement du même problème après deux
  correctifs déjà vérifiés par script, demander une mesure directe dans le
  navigateur de la cliente (au lieu d'une 3ᵉ hypothèse à l'aveugle) a permis
  de trancher en un seul aller-retour entre "vrai bug" et "effet de
  perception" — à réutiliser si un désaccord similaire (visuel vs. mesuré)
  se reproduit ailleurs sur le site.
- **Page Contact — essai "tout en Blanc Calcaire" (2026-08-20)**
  (`contact.html`, `style.css`) : demande explicite de la cliente ("on va
  essayer quelque chose... mets tous les fonds de la page contact en blanc
  calcaire, mais que par contre tous les éléments et les polices se
  retrouvent avec les couleurs de la charte graphique"). Un essai, pas un
  remplacement discret des styles de base — voir ci-dessous pour comment
  revenir en arrière si elle n'accroche pas.
  **Scopé à cette seule page** via `<body class="contact-cream">` (ajouté
  uniquement dans `contact.html`) : toutes les nouvelles règles CSS sont
  préfixées `body.contact-cream …`, donc aucun risque pour les 4 autres
  pages, qui gardent leur habillage habituel (footer/FAQ navy, etc. —
  vérifié par script Playwright comparant la couleur de fond du footer sur
  les 5 pages : seule `contact.html` change). Le `.site-header`/
  `.mobile-menu` (chrome persistant, identique sur tout le site) sont
  volontairement laissés inchangés — un header qui changerait de couleur
  selon la page serait plus déroutant qu'utile, et ce n'est pas "la page"
  au sens de son contenu propre.
  **Quatre sections repassent d'un fond sombre/coloré à `--bg` (Blanc
  Calcaire)**, chacune avec ses éléments recolorés dans la palette de
  marque plutôt que de garder les teintes claires pensées pour un fond
  sombre (`--cream`/`--terracotta-300`, invisibles ou trop pâles sur un
  fond déjà clair) :
  - `.contact-band` (bandeau "Nous écrire"/"Nous appeler"/"Réseaux
    sociaux") : la photo "dolce vita" + son voile terracotta sont masqués
    (`display:none`, pas retirés du HTML — faciles à réactiver) plutôt que
    le fond terracotta uni d'origine. Labels/valeurs en navy, icônes en
    cercle à liseré navy translucide ; au survol, l'icône se remplit de
    terracotta plein (texte/icône passent en crème) — reprend le même
    principe de bascule de couleur au survol que l'original (qui basculait
    vers le navy), juste inversé puisque le fond n'est plus coloré.
  - `.contact-devis` : `--bg-dim` (crème légèrement assombri) redevient
    `--bg` (Blanc Calcaire pur). La carte formulaire `.form-card-premium`
    (pensée pour un fond bleu Méditerranéen, texte crème) retrouve
    l'habillage clair déjà utilisé par `.form-card` de base ailleurs sur le
    site — fond blanc, libellés navy, accent terracotta — plutôt
    qu'inventer une 3ᵉ palette de couleurs pour le formulaire.
  - `.contact-faq` : fond navy → Blanc Calcaire, cartes de questions
    passées en blanc pour se détacher du fond (au lieu d'un très léger
    voile crème-sur-navy, invisible une fois le fond éclairci), eyebrow et
    icônes +/− repassés en terracotta plein (`--accent`) au lieu de
    `--terracotta-300`.
  - `.site-footer` : fond navy → Blanc Calcaire, logo et titres de colonne
    repassés en navy, liens et mentions légales en navy translucide (même
    teinte que `--border`/`--navy-rgb`, à différentes opacités) au lieu de
    crème translucide.
  Vérifié par script Playwright (0 débordement, 0 erreur console sur les
  5 pages × 2 viewports ; formulaire toujours fonctionnel — remplissage
  d'un champ + sélection d'une formule testés ; couleur de fond du footer
  comparée entre les 5 pages pour confirmer le scope) et capture d'écran
  pleine page desktop (1440px) + mobile (390px), plus gros plans sur le
  bandeau contact (état normal et survol), le formulaire, la FAQ (fermée
  et ouverte) et le footer.
  **Essai abandonné le jour même** ("finalement j'aime moins, remet les
  fond en couleur") : `class="contact-cream"` retirée du `<body>` de
  `contact.html` et le bloc de règles `body.contact-cream …` supprimé de
  `style.css` (les deux étaient documentés dès le départ comme suffisants
  pour revenir en arrière, cf. ci-dessus — appliqué tel quel). La page
  Contact retrouve donc son habillage d'origine (bandeau photo "dolce
  vita" + voile terracotta, carte formulaire bleu Méditerranéen, FAQ et
  footer sur fond navy). Vérifié par script Playwright : fond du bandeau
  redevenu terracotta uni (photo réaffichée), fond de la carte formulaire
  redevenu le dégradé navy, FAQ et footer redevenus navy, 0 débordement/
  erreur console sur les 5 pages × 2 viewports. Si `body.contact-cream`
  ou son bloc de règles réapparaissent, c'est cet essai abandonné, à ne
  pas réintroduire sans qu'on le redemande.
- **Accueil — transition de couleur de fond au scroll, clair→sombre
  (2026-08-21)** (`#teaser`, `assets/js/main.js`) : demande explicite,
  formulée comme un brief technique générique ("exactement comme sur
  colibrity.com... si le projet utilise GSAP, privilégie GSAP, sinon
  Intersection Observer / `window.onscroll` optimisé avec
  `requestAnimationFrame`"). **Adapté à la stack réelle du site** : aucune
  dépendance sur ce projet (`main.js` est un IIFE vanilla unique, cf. tête
  de ce fichier) — pas de GSAP ajouté, implémentation en scroll listener
  + `requestAnimationFrame`, même convention déjà utilisée partout
  ailleurs sur le site (`updateJourney`, `updateEngagementCards`,
  `updateValuesReel`...).
  **Écart assumé sur la couleur, clarifié avec la cliente avant
  d'implémenter** (`AskUserQuestion`) : la consigne demandait un fond
  "blanc/off-white → noir/anthracite", mais la charte graphique fixe du
  site (cf. section Palette plus haut) n'a ni blanc pur ni noir/anthracite
  — le fond va donc de `--bg-dim`/`--cream-dim` (crème assombri,
  `#ece3d1`) à `--navy-900` (bleu Méditerranéen le plus sombre,
  `#101f27`), sur confirmation explicite de la cliente ("adapte à ma
  palette de couleurs... ne fais pas en noir anthracite").
  **Section choisie plutôt qu'un fondu sur toute la page** (2ᵉ point
  clarifié par `AskUserQuestion`, qu'elle a laissé à mon appréciation en
  validant l'option recommandée) : l'accueil est déjà construit en
  sections à fond FIXE qui alternent selon la charte (navy/terracotta/
  crème, cf. section Décisions techniques) — un fondu sur toute la page
  n'aurait été visible qu'en rendant chaque section transparente, un
  chantier bien plus large que ce qui a été demandé et qui aurait cassé
  l'alternance de couleurs établie. `.teaser` ("Quatre mondes, une même
  Dolce Vita", `id="teaser"` ajouté) est la seule section déjà claire
  juste avant une section sombre (`#sensesJourney`, navy) dans le flux de
  la page — y poser la transition prolonge un contraste de ton déjà
  présent dans la page plutôt que d'en introduire un artificiellement.
  **Mécanisme** (`updateTeaserBg()`, `main.js`) : à chaque frame de
  scroll, `progress = (vh - rect.top) / (rect.height + vh)` (0 quand le
  haut de la section touche le bas du viewport, 1 quand son bas a
  entièrement défilé au-delà du haut du viewport) pilote une
  interpolation RGB linéaire du fond, appliquée en `style.backgroundColor`
  inline (la règle CSS `.teaser { background: var(--bg-dim) }` reste en
  place comme état de repos/filet de sécurité avant que le JS ne
  s'exécute). **Mapping direct 1:1 avec le scroll, reste actif sous
  `prefers-reduced-motion`** — même raisonnement déjà établi ailleurs sur
  le site pour ce type d'effet (tracé des 5 sens, fil des Valeurs, zoom de
  la Fondatrice) : une transition de couleur pilotée par le scroll n'est
  pas le genre de mouvement que cette préférence cherche à supprimer.
  **Bug réel trouvé et corrigé avant publication, pas supposé** : le titre
  de la section (`.section-head h2`, "Quatre mondes, une même Dolce
  Vita") devait aussi changer de couleur pour rester lisible, comme
  demandé explicitement ("les textes... changent également de couleur si
  nécessaire"). Un premier essai interpolait le texte en parallèle du
  fond, à la même vitesse — repéré par script Playwright mesurant les
  deux couleurs à `progress≈0.5` : fond `rgb(126,129,124)` et texte
  `rgb(132,138,137)`, quasiment le même gris, contraste proche de 1:1
  (texte illisible) pile au milieu du scroll — deux couleurs parties
  d'extrêmes opposés et interpolées au même rythme se croisent
  forcément au milieu. Corrigé en ne faisant PAS interpoler le texte :
  il bascule intégralement entre encre foncée (`--ink`) et crème
  (`--cream`) dès que la LUMINANCE réelle du fond interpolé (formule
  `0.299R+0.587G+0.114B`, recalculée chaque frame à partir de la couleur
  de fond réellement affichée) franchit le point milieu entre les
  luminances de départ/arrivée — pas une simple comparaison
  `progress > 0.5` (qui aurait été correcte ici mais casserait
  silencieusement si les couleurs de fond changent un jour vers une paire
  non-monotone en luminance). Vérifié par balayage Playwright fin (51 pas
  de `progress` 0→1) : un seul basculement net du texte, exactement au
  point où le fond franchit sa luminance médiane, contraste large des
  deux côtés du basculement (jamais de zone grise où fond et texte se
  confondent). L'eyebrow "Nos prestations" n'a pas besoin d'interpolation :
  déjà en terracotta plein (`--accent`), lisible aussi bien sur
  `--bg-dim` que sur `--navy-900`, sans changement.
  Vérifié par script Playwright : balayage de progression complet (0 →
  1, un seul basculement de texte, contraste maintenu), `prefers-reduced-
  motion` confirmé actif (fond différent du repos après scroll), recalcul
  correct au redimensionnement (`resize` déclenche `updateTeaserBg()`),
  0 débordement/erreur console sur les 5 pages × 2 viewports (l'effet ne
  s'exécute que si `#teaser` existe dans le DOM, donc sans effet sur les
  4 autres pages). Capture d'écran desktop (état initial clair, mi-scroll
  gris moyen, fin de section fondue dans le sombre) et mobile (mêmes 3
  points). Si le titre de section réapparaît avec un `style.color`
  interpolé en continu (au lieu d'un basculement net piloté par la
  luminance), c'est ce bug de contraste à mi-scroll, à ne pas
  réintroduire sans le revérifier avec le même balayage.
  **Entièrement remplacée le même jour** (voir bullet suivant) — la
  cliente a explicitement rejeté ce fondu scopé à une seule section et
  demandé un mécanisme global. `updateTeaserBg()` a été intégralement
  supprimée de `main.js` (plus de `style.backgroundColor` inline sur
  `#teaser`, plus de bascule de couleur de texte sur `.section-head h2`),
  et `id="teaser"` a été retiré du HTML (plus référencé nulle part). Si
  `updateTeaserBg()` ou un `id="teaser"` réapparaissent, c'est cette
  ancienne version scopée à une seule section, à ne pas réintroduire sans
  qu'on le redemande — l'entrée ci-dessus reste comme trace de la
  discussion (palette adaptée, section vs. page entière) et du bug de
  contraste résolu, au cas où la technique de bascule par luminance serve
  ailleurs un jour.
- **Accueil — transition de couleur de fond au scroll, entre TOUTES les
  sections, en CSS pur (2026-08-21, même jour, remplace le bullet
  ci-dessus)** (`.scroll-transition`, `style.css`/`index.html`) : la
  cliente a explicitement rejeté le fondu scopé à `.teaser` seul
  ("Ce n'est pas vraiment cet effet que je recherche") et reformulé sa
  demande en des termes plus généraux et sans ambiguïté : *"lors du
  défilement scroll de la page, on a un effet de transition de couleur de
  fond au scroll. Donc par exemple si on est sur du blanc calcaire et
  qu'on passe sur du rouge pourpre, on a une sorte d'effet de transition
  fluide et progressif... en fonction de la position au scroll"* — un
  mécanisme qui couvre TOUTE la page, à chaque changement de couleur de
  section, pas un seul endroit choisi.
  **Deux approches plus lourdes écartées avant d'implémenter** : (1)
  rendre les sections elles-mêmes transparentes et piloter un calque de
  fond unique en JS derrière tout le contenu — un chantier bien plus
  large que ce qui a été demandé (revoir individuellement chaque section
  du site) et un scroll-listener global sur toute la page, plus coûteux
  que nécessaire ; (2) un fondu en surimpression (masque dégradé) posé
  sur les bords des sections existantes — écarté après inspection : ça
  aurait risqué de voiler des éléments réels proches de ces bords (la
  flèche "Défiler" du hero, le compteur "X/5 sens découverts en chemin"
  du parcours SVG, la note de clôture de la méthodologie), un risque
  visuel réel plutôt qu'hypothétique vu la densité de contenu à ces
  endroits précis de la page.
  **Solution retenue : des bandeaux dédiés, en CSS pur, zéro JavaScript**
  — un `<div class="scroll-transition" aria-hidden="true">` est inséré
  entre CHAQUE paire de sections adjacentes de couleur différente sur
  `index.html` (6 seams : hero→stats-band, stats-band→promise,
  promise→teaser, teaser→senses-journey, senses-journey→method-cta,
  method-cta→footer), chacun avec ses propres `--from`/`--to` posés en
  style inline (une seule règle CSS partagée
  `background: linear-gradient(to bottom, var(--from), var(--to))`,
  hauteur `clamp(6rem, 16vh, 14rem)` — proportionnelle au viewport donc
  jamais négligeable, y compris mobile). **C'est le point clé qui rend
  l'effet "parfaitement fluide, réactif et optimisé pour les
  performances" sans le moindre calcul par frame** : le "fondu au scroll"
  n'est pas une interpolation pilotée par un scroll-listener + rAF (comme
  la version rejetée ci-dessus, ou comme `updateJourney`/
  `updateEngagementCards`/`updateValuesReel` ailleurs sur le site) —
  c'est simplement le fait de traverser physiquement un dégradé déjà peint
  par le navigateur pendant qu'on scrolle, en scroll natif, sans JS du
  tout impliqué dans l'effet lui-même. Couleurs exactes reprises des
  vraies déclarations CSS des sections concernées (pas devinées) :
  `--navy` `#1c3b4a`, `--terracotta` `#c1622d`, `--navy-900` `#101f27`,
  `--bg-dim` `#ece3d1`, `--rosso-ombria` `#4a1c1c` (couleur de base
  déclarée de `.senses-journey-sticky`, dont le fond réel est en
  dégradé — `#2b1010`, son coin le plus sombre, est utilisé côté sortie
  de section car c'est la teinte visible en bas de cette section très
  longue, `height:1240vh`, au moment où le scroll en sort), `--bg`
  `#f6f1e7`.
  **`#teaser` retiré** (devenu inutile, l'ancien mécanisme JS qui s'y
  accrochait a été supprimé) — `.teaser` reste une section normale, sans
  id ni style particulier lié à cet effet.
  **Vérifié par script Playwright** : les 6 bandeaux confirmés avec le
  bon dégradé calculé (`getComputedStyle().backgroundImage`) aux 2
  viewports (12 combinaisons), captures d'écran à chaque seam confirmant
  visuellement une transition propre sans aucun contenu voilé ni décalé
  (le tracé SVG des 5 sens et son compteur, la note de clôture de la
  méthodologie, la flèche du hero — tous intacts), 0 débordement
  horizontal, 0 image cassée, 0 erreur console sur les 5 pages ×
  2 viewports (regression complète, cet ajout ne touchant qu'`index.html`
  mais vérifié sur tout le site par prudence). **Piège de méthodologie de
  test rencontré et documenté pour éviter de le refaire** : un
  `window.scrollTo({top, behavior:'auto'})` en Playwright ne bypass PAS
  le `scroll-behavior:smooth` sitewide (`html`, `style.css`) — `"auto"`
  au sens de la spec CSSOM View signifie "respecter le CSS de
  l'élément", pas "instantané" ; seul `behavior:'instant'` force un saut
  immédiat. Un premier balayage de captures d'écran avec `'auto'`
  montrait des positions de scroll très en deçà de la cible (jusqu'à
  10 000px d'écart sur les seams les plus bas), pas parce que l'effet ou
  la page avaient un bug, mais parce que le scroll était encore en train
  d'animer en douceur au moment de la capture. Sans rapport avec le site
  lui-même — un piège de l'outil de test, à éviter en préférant toujours
  `behavior:'instant'` pour un positionnement de scroll exact en script.
  Si `.scroll-transition` disparaît d'`index.html` ou si l'ancien
  mécanisme scopé à `#teaser` (bullet ci-dessus) réapparaît, c'est un
  retour à une version antérieure de cet effet, à ne pas réintroduire
  sans qu'on le redemande.
- **Accueil — transition de couleur de fond au scroll entièrement retirée
  (2026-08-21, même jour)** : la cliente a demandé de retirer l'effet et
  de revenir à la version d'avant ("enlève au final et retourne à la
  version avant") — après avoir vu les deux tentatives ci-dessus (le
  crossfade JS scopé à `.teaser`, puis les bandeaux `.scroll-transition`
  en CSS pur entre chaque section), aucune n'a été retenue. `index.html`
  et `assets/css/style.css` sont restaurés à l'identique de leur état
  juste avant la 1ʳᵉ tentative (`git checkout` sur le commit précédent
  ces deux bullets — diff vérifié strictement vide sur les deux
  fichiers) ; `assets/js/main.js` n'avait plus de différence nette à
  restaurer, `updateTeaserBg()` ayant déjà été entièrement supprimée lors
  du remplacement par la version CSS. Les 6 `<div class="scroll-transition">`
  et la règle `.scroll-transition` associée n'existent donc plus nulle
  part sur le site — chaque section de l'accueil retrouve son fond fixe
  opaque d'origine, sans transition au passage de l'une à l'autre. Les
  deux bullets ci-dessus restent comme trace des deux tentatives et de
  pourquoi elles ont été écartées ; si `.scroll-transition` ou
  `updateTeaserBg()` réapparaissent dans un diff, c'est l'une de ces deux
  versions abandonnées, à ne pas réintroduire sans qu'on le redemande.
- **Accueil — 3ᵉ tentative, fond unique qui teinte réellement toute la
  page, mécanique complète (2026-08-21, même jour)** (`#pageBgLayer`,
  `updatePageBg()` dans `main.js`, `assets/css/style.css`) : après le
  retrait complet ci-dessus, la cliente est revenue avec un cahier des
  charges technique détaillé et non ambigu (4 points : déclenchement au
  franchissement d'une section, interpolation dynamique liée au scroll —
  pas un simple changement de classe —, adaptation de couleur du texte en
  contact, `requestAnimationFrame`/pas de saccade). **Choix d'architecture
  posé explicitement à la cliente avant d'implémenter** (`AskUserQuestion`,
  vu le risque) : garder les sections à fond plein et n'ajouter qu'une
  bande à chaque jonction (l'option des deux tentatives précédentes, déjà
  rejetée), ou rendre les sections elles-mêmes transparentes au profit d'un
  unique calque de fond piloté en JS — elle a choisi la seconde,
  explicitement la plus proche de "la couleur de fond de la page" au sens
  littéral, en connaissance du compromis (plus de sections à toucher).
  **Architecture** : `#pageBgLayer` (`position:fixed; inset:0; z-index:-1`,
  premier enfant de `<body class="home">`) porte désormais la vraie couleur
  de fond, recalculée à chaque frame de scroll par `updatePageBg()`
  (rAF-throttlé, même pattern `ticking` que les autres effets scroll-liés
  du site). `.hero`/`.stats-band`/`.promise`/`.teaser`/`.method-cta`
  passent à `background:transparent` (classes déjà exclusives à
  `index.html`, vérifié par grep sur les 5 autres pages avant de les
  toucher — aucun risque hors accueil). `.site-footer`, elle, est
  **partagée par les 6 pages** (balisage dupliqué) — sa règle de
  transparence est donc scopée à `body.home .site-footer` uniquement,
  jamais touchée sur les 4 autres pages (vérifié explicitement par script
  Playwright : fond et couleur de texte du footer inchangés partout
  ailleurs, `#pageBgLayer` absent de leur DOM).
  **`#sensesJourney` volontairement exclu de la transparence** : ce
  mécanisme pinned/sticky autonome (tracé SVG, cartes, glow — calibré sur
  de très nombreuses itérations, cf. plus haut dans ce fichier) est bien
  plus fragile que les sections à fond plat ; le rendre transparent
  n'apporterait rien de visible (sa propre `.senses-journey-sticky` est
  déjà 100% opaque une fois épinglée) tout en risquant de casser un
  système déjà validé. `updatePageBg()` vise simplement la même teinte que
  ses bords haut/bas pendant qu'il reste caché derrière, pour qu'aucun
  bord net ne soit visible au moment précis où il cède la place à la
  section suivante.
  **Interpolation par points-clés (keyframes), pas un simple lerp entre
  deux couleurs par section** : `updatePageBg()` recalcule à chaque frame
  la position RÉELLE de chaque section (`getBoundingClientRect()`, jamais
  mise en cache — même piège déjà rencontré et évité sur les anciens
  bandeaux `.scroll-transition`, des images encore `loading="lazy"` plus
  bas peuvent décaler la mise en page pendant le scroll) et construit une
  liste de points `{y, rgb}` ordonnés : pour chaque frontière, une rampe
  `[top-fenêtre, top]` qui va de la couleur précédente à la couleur de la
  section qui commence, `pageBgSample()` échantillonnant cette liste par
  interpolation linéaire entre les deux points encadrants. La fenêtre de
  chaque rampe (`pageBgWindow()`) est plafonnée à la moitié de l'écart
  réel entre deux frontières, pour ne jamais faire chevaucher deux
  transitions voisines sur une section inhabituellement courte.
  **Bug réel trouvé et corrigé, pas supposé** : un premier jet ne posait
  qu'un point d'ENTRÉE et un point de SORTIE pour `#sensesJourney` (1240vh,
  section la plus longue du site de très loin) sans point intermédiaire —
  `pageBgSample()` interpolait alors linéairement sur toute cette distance
  énorme, faisant dériver le fond en continu pendant toute la traversée du
  parcours des 5 sens au lieu de rester figé derrière lui (repéré par un
  balayage de scroll complet, mesurant la couleur réelle à chaque étape —
  pas visible en relisant juste le code). Corrigé en ajoutant un point
  supplémentaire juste avant la sortie de la section, à la même teinte que
  l'entrée : le fond reste plat sur toute la traversée, puis rampe
  seulement sur les derniers pixels avant la section suivante.
  **2ᵉ bug réel trouvé et corrigé** : la rampe finale (vers le footer)
  restait bloquée en cours de route, quelle que soit la distance
  scrollée — le footer étant la DERNIÈRE section de la page et plus courte
  que le viewport (~390px pour 900px de haut), son propre bord haut ne
  peut jamais atteindre le haut du viewport par un scroll normal (la
  position de scroll maximale, `document.scrollHeight - innerHeight`,
  s'arrête avant) ; la rampe visait donc un point de scroll inatteignable.
  Repéré en comparant explicitement la position de scroll maximale réelle
  à la position du footer (pas supposé), corrigé en plafonnant la cible de
  cette dernière rampe au scroll maximal réel (`footerRampEnd`) — elle se
  termine désormais exactement quand la page ne peut plus défiler, quelle
  que soit la hauteur du footer.
  **Adaptation du texte, "point 3" du cahier des charges** : plutôt qu'un
  fondu continu de couleur sur chaque élément (bug de contraste déjà
  rencontré et documenté sur la 1ʳᵉ tentative — deux couleurs parties
  d'extrêmes opposés interpolées au même rythme se croisent forcément au
  milieu), un seul indicateur global `body.home[data-tone="dark"|"light"]`
  est posé chaque frame sur la luminance réelle du fond (formule
  `0.299R+0.587G+0.114B`, seuil à 0,6 — les teintes "dark" du site
  plafonnent à 0,47, les teintes "light" démarrent à 0,89, large marge de
  sécurité). Un seul indicateur global suffit : à un instant donné, une
  seule transition de section est jamais visible à l'écran, donc les
  éléments concernés par d'autres transitions sont de toute façon hors
  champ. Appliqué via de nouvelles classes marqueurs
  (`.bg-adaptive-eyebrow`/`-heading`/`-lede`/`-outline-btn`/`-footer`) sur
  les seuls éléments qui reposent directement sur le fond plat d'une
  section (pas sur leur propre photo/scrim/carte, qui gèrent déjà leur
  contraste indépendamment) : eyebrow/h2 du bandeau Prestations, eyebrow/
  h2/lede/bouton "Voir nos projets" et eyebrow/note de Notre méthodologie,
  et l'ensemble du footer (`.footer-brand p`/`.footer-col h4`/
  `.footer-bottom`/`.photo-credits`). Les couleurs "dark" réutilisent les
  variantes déjà existantes du site (`--terracotta-300`, mêmes valeurs que
  `.eyebrow.on-dark`/`.lede.on-dark`) plutôt que d'en inventer de
  nouvelles ; les couleurs "light" du footer (normalement toujours sombre)
  réutilisent `--fg-muted`/`--navy` déjà utilisés ailleurs sur le site pour
  ce rôle sur fond clair.
  **Performance** : aucune propriété CSS de type `transform`/`opacity`
  n'était nécessaire ici (contrairement aux autres effets scroll-liés du
  site) — un repaint plein-écran d'une couleur plate est intrinsèquement
  bon marché (pas de décodage d'image, pas de géométrie complexe), donc
  aucun `will-change` n'a été ajouté sur `#pageBgLayer` (n'aurait aucun
  effet utile sur cette propriété). `getBoundingClientRect()` est appelé
  sur seulement 5 éléments par frame, uniquement dans le callback déjà
  planifié par `requestAnimationFrame` (jamais dans le handler `scroll`
  brut) — vérifié par un test de résistance Playwright (40 allers-retours
  de scroll instantanés autour d'une frontière, puis un balayage complet
  109 étapes sur toute la hauteur de page) : aucune valeur de couleur
  invalide, aucune erreur console.
  **`prefers-reduced-motion`** : reste actif sous cette préférence, comme
  tous les autres effets scroll-liés 1:1 du site (mapping direct avec la
  position de scroll, pas une animation autoplay) — vérifié explicitement.
  Vérifié par script Playwright : balayage complet du fond sur toute la
  hauteur de page (couleurs échantillonnées cohérentes à chaque frontière,
  tenue plate confirmée sur toute la traversée des 5 sens), bascule
  dark/light du texte confirmée aux bonnes couleurs à chaque frontière
  (bandeau Prestations, Notre méthodologie, footer), capture d'écran à
  plusieurs points de chaque transition (desktop et mobile) confirmant
  visuellement une lisibilité maintenue tout du long, 0 débordement
  horizontal, 0 erreur console. Regression complète 5 pages × 2 viewports :
  0 débordement, 0 erreur console, footer et fond des 4 autres pages
  confirmés strictement inchangés.
- **Fond de page unique — transitions accélérées (2026-08-21, même jour)**
  (`PAGE_BG_WINDOW`, `main.js`) : la cliente a trouvé la couleur de chaque
  section trop lente à s'installer — `PAGE_BG_WINDOW` (distance de scroll
  sur laquelle chaque rampe se déploie) passe de `560` à `220`. Seule cette
  constante change ; le reste du mécanisme (`pageBgSample()`, la liste de
  keyframes, le plafond dynamique par frontière via `pageBgWindow()`,
  l'indicateur `data-tone`) est inchangé. Revérifié par balayage fin autour
  de la frontière hero→stats-band (la rampe démarre désormais à 220px avant
  la frontière au lieu de 450px) et par le même test de résistance
  Playwright (40 allers-retours de scroll, balayage complet) : aucune
  valeur de couleur invalide, la rampe vers le footer atteint toujours
  exactement `--navy-900` au scroll maximal réel. Regression complète
  5 pages × 2 viewports : 0 débordement, 0 erreur console.
- **Photo retirée de "Notre promesse", hero recentré sur 4 photos ; cercles
  décoratifs des page-headers retirés (2026-08-21)** : deux demandes
  distinctes de la cliente.
  **1) Photo de "Notre promesse" retirée, déplacée dans le hero**
  (`index.html`, `.promise`, `assets/img/CREDITS.md`) : `<img
  class="promise-photo">` et `<div class="promise-scrim">` sont retirés de
  la section "Notre promesse" (la citation "Suspendre le quotidien
  professionnel..."). Comme `.promise` a déjà `background: transparent`
  depuis le fond de page unique (`#pageBgLayer`, cf. plus haut), retirer la
  photo ne laisse pas de vide : le fond visible devient directement la
  teinte animée du calque global, déjà `--navy-900` sur cette portion de
  scroll — exactement la teinte sombre que la photo assombrie (`filter:
  brightness(0.5)`) visait à donner, donc le texte crème de la section
  reste lisible sans aucun ajustement de couleur. `.promise-photo`,
  `.promise-scrim` et `@keyframes promisePhotoDrift` (le Ken Burns de la
  photo) sont supprimés de `style.css`, désormais inutilisés — si l'une de
  ces règles réapparaît ici, c'est cet ancien fond photo, à ne pas
  réintroduire sans qu'on le redemande.
  **La photo réapparaît dans le diaporama du hero** (`.hero-slideshow`,
  tout en haut de la page) plutôt que d'être perdue : `amalfi-coast-sunset.jpg`
  rejoint la rotation, qui passe de 5 à 4 photos — la cliente a listé
  explicitement les 4 à garder : celle-ci, "celle de la fiat"
  (`evenement-fiat500-creme-mur-pierre.jpg`), "celle du plateau d'agrumes"
  (`evenement-plateau-agrumes.jpg`) et "celle des tartines de tomate"
  (`evenement-planche-charcuterie.jpg` — la planche de charcuterie
  comprend des tartines/toasts à la tomate, seule photo de nourriture du
  hero correspondant à cette description). `evenement-tablee-diner-bougies.jpg`
  et `evenement-cave-barolo.jpg` sortent donc de la rotation (aucun fichier
  supprimé, toutes deux restent utilisées dans la mosaïque Projets).
  `.hero-slideshow img:nth-child(N)` : délais d'apparition recalés sur
  30s/4 = 7,5s d'écart (au lieu de 30s/5 = 6s) pour garder un cycle total
  de 30s avec un espacement régulier entre les 4 photos. Aucun nouveau
  crédit requis : les 4 photos étaient déjà toutes utilisées sur
  `index.html` (3 déjà dans le hero, la 4ᵉ dans "Notre promesse" juste en
  dessous) — le crédit Tracey Hind d'`amalfi-coast-sunset.jpg` reste
  inchangé dans le footer, seul l'emplacement précis de la photo change
  (voir `CREDITS.md` pour le détail complet).
  **2) Cercles décoratifs retirés des page-headers** (`.page-header::before`/
  `::after`, `style.css`) : les deux cercles "Havas-esque" (un grand cercle
  à liseré terracotta en haut à droite du bandeau titre + un petit cercle
  plein en bas à gauche), présents sur les 4 pages qui utilisent
  `.page-header` (Prestations, Projets, À propos, Contact), sont retirés à
  la demande explicite de la cliente. `index.html` n'est pas concerné : son
  hero utilise la classe `.hero`, pas `.page-header`, donc n'a jamais eu ces
  cercles. Si `.page-header::before`/`::after` réapparaissent dans un diff,
  c'est cet ancien motif décoratif, à ne pas réintroduire sans qu'on le
  redemande.
  Vérifié par script Playwright (`getComputedStyle(el, '::before').content`
  confirmé `"none"` sur les 4 pages, diaporama du hero confirmé à 4 images
  dans le bon ordre, section Promesse vérifiée sans `<img>`/scrim restant)
  et capture d'écran desktop + mobile. Regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Section "Notre promesse" entièrement supprimée (2026-08-21, même
  jour)** (`.promise`, `index.html`) : suite au retrait de sa photo de
  fond (bullet précédent), la cliente a demandé de retirer la section
  entière — la citation "Suspendre le quotidien professionnel pour
  transporter vos invités au cœur de l'Italie, iconique et intemporelle"
  (et toute sa mise en page "poster" en lignes décalées) disparaît
  d'`index.html`. Le flux de la page passe donc directement des chiffres
  clés (`.stats-band`) à "Quatre mondes, une même Dolce Vita"
  (`.teaser`).
  **Nettoyage complet plutôt qu'un simple retrait du HTML** : `<section
  class="promise">` et tout son contenu (le `<p class="promise-quote"
  id="promiseQuote">` et ses 8 `<span class="promise-line">`) sont
  supprimés d'`index.html` ; `fitPromiseLines()` (`main.js`, la fonction
  JS qui calculait la taille de police partagée des lignes) est
  entièrement supprimée, n'ayant plus de `#promiseQuote` à cibler ; en
  CSS, `.promise`, `.promise-quote`, `.promise-line*` et leurs media
  queries/règles d'apparition sont retirés de `style.css` (`.promise-footnote`/
  `.positioning-tag` juste à côté étaient déjà du CSS legacy inutilisé
  avant ce retrait, non touchés). Cohérent avec la convention du site
  ("si un fichier n'est plus utilisé nulle part, le supprimer plutôt que
  le laisser en orphelin") déjà appliquée à `founder-vespa-cutout.webp` et
  à d'autres retraits de section précédents (Réalisations, Univers).
  **`updatePageBg()` (fond de page unique, cf. plus haut) rebranché sans
  la section intermédiaire** : la chaîne de keyframes passait par
  `.promise` (stats-band → promise → teaser) ; elle passe désormais
  directement de la couleur de `.stats-band` (terracotta) à celle de
  `.teaser` (crème), `pageBgPromise` et `PAGE_BG_PROMISE` retirés du
  script. Vérifié par script Playwright : `document.querySelector('.promise')`
  confirmé absent du DOM, ordre des sections confirmé dans `<main>`
  (`hero`, `stats-band`, `teaser`, `senses-journey`, `method-cta`), fond
  de page échantillonné à plusieurs points de la frontière stats-band→
  teaser (transition directe terracotta→crème, aucun palier navy-900
  intermédiaire résiduel), 0 valeur de couleur invalide sur un balayage
  complet. Regression complète 5 pages × 2 viewports : 0 débordement, 0
  erreur console. Si `.promise`/`.promise-quote`/`fitPromiseLines()`
  réapparaissent dans un diff, c'est cette ancienne section, à ne pas
  réintroduire sans qu'on le redemande — l'historique complet de ses
  ~10 itérations reste documenté plus haut dans ce fichier pour référence.
- **Bandeau chiffres clés redevenu un vrai bandeau séparé (2026-08-21)**
  (`.stats-band`, `style.css`/`main.js`) : depuis la suppression de
  "Notre promesse" (bullet précédent), `.stats-band` et `.teaser` étaient
  devenus directement adjacents, tous deux transparents et fondus l'un
  dans l'autre par le calque de fond animé — la cliente a demandé que le
  bandeau chiffres clés redevienne "un bandeau séparé de la partie
  suivante", "que cela se remarque visuellement".
  **`.stats-band` reprend un fond plein** (`background: var(--terracotta)`,
  au lieu de `transparent`/calque animé) + `position:relative; z-index:1`
  + une `box-shadow` marquée projetée vers le bas
  (`0 28px 56px -24px rgba(16,31,39,0.45)`) — le bandeau se détache
  nettement de `.teaser` juste en dessous, une vraie coupure visible (fond
  plein + ombre portée) plutôt qu'un dégradé continu.
  **Bug réel trouvé et corrigé pendant la vérification, pas supposé** :
  un premier essai a traité `.stats-band` comme `#sensesJourney` plus bas
  dans `updatePageBg()` (teinte plate tenue puis rampe resserrée juste
  avant la sortie) — mais `#sensesJourney` fait 1240vh (bien plus haut que
  le viewport, donc entièrement invisible derrière lui pendant toute sa
  traversée), alors que `.stats-band` ne fait qu'environ 320px, bien
  MOINS que le viewport (~900px) : sa moitié basse et le haut de
  `.teaser` peuvent donc être visibles SIMULTANÉMENT bien avant que
  `scrollY` n'atteigne son bord bas. Avec le palier plat, le calque
  restait figé en terracotta longtemps après que le titre "Quatre
  mondes..." soit déjà visible à l'écran, puis basculait d'un coup en
  crème — repéré par capture d'écran à un point de scroll représentatif
  (pas en relisant juste le code), montrant le titre encore sur fond
  orange alors qu'il aurait dû tendre vers le crème. Corrigé en étalant la
  transition en continu sur toute la traversée du bandeau (`statsTop` →
  `statsBottom`, sans palier ni fenêtre resserrée) — la couleur progresse
  graduellement pendant que le bandeau défile. Le bandeau lui-même n'est
  jamais affecté (fond plein CSS, indépendant de ce calque) ; seule la
  zone transparente de `.teaser` juste en dessous en bénéficie.
  **Limite résiduelle assumée** : contrairement aux autres frontières du
  calque (navy↔crème, écart de luminance énorme), la traversée
  terracotta→crème passe par des tons intermédiaires où ni le texte crème
  ni le texte encre foncée (les deux extrêmes du système
  `.bg-adaptive-*`) ne contrastent très bien — un filet de `text-shadow`
  (sombre en état crème, clair en état encre) a été ajouté sur
  `.teaser .section-head` pour atténuer cette zone, sans l'éliminer
  totalement (limite mathématique du choix binaire de couleur de texte à
  l'instant exact du basculement, pas un bug à corriger davantage). Reste
  bref en scroll réel (une centaine de pixels), plus visible sur une
  capture figée que pendant un scroll continu.
  Vérifié par script Playwright (fond de `.stats-band` confirmé opaque,
  balayage de couleur sur toute la frontière stats→teaser sans valeur
  invalide, test de résistance 40 allers-retours de scroll) et capture
  d'écran à plusieurs points de la transition, desktop et mobile.
  Regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console. Si `.stats-band { background: transparent }` ou un palier
  plat façon `#sensesJourney` réapparaissent sur ce bandeau, c'est un
  retour à une version précédente, à ne pas réintroduire sans qu'on le
  redemande.
- **Menu plein écran — 4ᵉ refonte : grandes typographies centrées, sans
  numéro, avec entrée animée (2026-08-21)** (`.mobile-menu-links`,
  `style.css`, les 5 pages) : la cliente a demandé de reprendre l'esprit
  "titres en gros" des versions précédentes du menu, mais centré, sans
  les numéros d'index, avec un effet d'animation à l'ouverture.
  **Retiré** : les `<span class="idx" aria-hidden="true">01</span>`…`05`
  (chiffres "fantômes" en filigrane, 3ᵉ refonte) sont retirés du HTML des
  5 pages (`perl` en une passe, motif identique partout) et toute la CSS
  associée (`.mobile-menu-links .idx`, ses états hover/is-current, le
  décalage `padding-left` au survol qui n'avait de sens qu'avec un
  chiffre à révéler) est supprimée de `style.css`.
  **Centré** : `.mobile-menu-links` passe à `align-items:center;
  text-align:center` (au lieu d'un alignement à gauche).
  **Titres agrandis** : `.label` passe de `clamp(1.5rem, min(7.2vh,
  11.5vw), 3.4rem)` à `clamp(2.2rem, min(9.5vh, 15vw), 6.4rem)` — plafond
  quasiment doublé, l'espace auparavant partagé avec le chiffre fantôme
  profite maintenant entièrement au libellé. Toujours calé en
  `vh`/`min(vh,vw)` (pas la version `vw` seule de la 1ʳᵉ refonte, qui
  débordait en hauteur sur les fenêtres courtes) pour garder la
  contrainte "tient sur un écran" déjà établie sur ce composant.
  **Effet d'animation** : chaque lien entre en fondu + léger glissement
  vertical (`opacity:0→1`, `translateY(28px)→0`) au moment où
  `.mobile-menu` reçoit `.is-open`, échelonné par `nth-child` (60ms
  d'écart) — même principe de cascade déjà utilisé ailleurs sur le site
  (`[data-reveal-group]`, `.method-steps-list`), reconduit ici pour
  l'ouverture du menu plutôt qu'un scroll. La transition de l'entrée
  (`opacity`/`transform` sur `a`, avec son `transition-delay` échelonné)
  est volontairement séparée de la transition de survol (`color`/
  `transform:scale(1.04)` sur `.label`, sans délai) pour que le survol
  reste instantané quel que soit le lien, jamais retardé par le délai de
  l'ouverture.
  **Calibrage revérifié empiriquement, pas juste recopié de l'ancienne
  version** : le plafond `vh` initial (`11vh`) faisait légèrement
  déborder le menu en hauteur sur quelques largeurs étroites à 640px de
  haut (repéré par un balayage Playwright de 56 combinaisons largeur×
  hauteur, pas supposé) — réduit à `9.5vh`. Sur les tailles d'écran
  réelles courantes (iPhone SE 375×667, iPhone 12+ 390×844, Android
  360×800, Pixel 412×915, desktop/tablette 768 à 1920px de large), 0
  débordement ; seul le très ancien iPhone 5 (320×568, un appareil de
  2012) montre encore un débordement résiduel de 10px, absorbé sans
  casse par le `overflow-y:auto` déjà en place comme filet de sécurité.
  Vérifié par script Playwright : chiffres fantômes confirmés absents du
  DOM, alignement centré confirmé (`getComputedStyle`), taille de police
  ~99px à 1440×900 (vs ~54px avant), page courante toujours mise en
  valeur sur les 5 pages, navigation clavier (Tab + Entrée) confirmée
  fonctionnelle, survol confirmé (couleur + léger agrandissement).
  Regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console. Si `.idx` réapparaît dans le HTML ou en CSS sur ce composant,
  c'est la version à chiffres fantômes (3ᵉ refonte), à ne pas
  réintroduire sans qu'on le redemande — l'historique complet des 3
  refontes précédentes (panneau divisé, chiffres fantômes) reste
  documenté plus haut dans ce fichier pour référence.
- **Menu plein écran — page courante en crème, mouvement au survol,
  majuscules (2026-09-01)** (`.mobile-menu-links`, `style.css`) : trois
  retouches de la cliente sur la 4ᵉ refonte ci-dessus, à partir d'une
  capture d'écran montrant "Accueil" en terracotta au repos alors
  qu'elle ne survolait rien.
  **Page courante plus en couleur au repos** : `.mobile-menu-links
  a.is-current .label { color: var(--terracotta-300) }` est retiré — le
  lien de la page courante reste crème comme les autres tant qu'il n'est
  pas survolé/focus. `aria-current="page"` (déjà posé dans le HTML de
  chaque page) continue de l'identifier pour les lecteurs d'écran, seul
  le repère visuel disparaît.
  **Mouvement au survol** : en plus du changement de couleur et du léger
  agrandissement déjà en place (`scale(1.04)`), le survol/focus ajoute
  désormais un léger soulèvement vertical (`translateY(-6px)`), combiné
  dans la même valeur de `transform` — un vrai "petit mouvement" plutôt
  qu'un simple agrandissement sur place.
  **Majuscules** : `text-transform: uppercase` ajouté sur
  `.mobile-menu-links .label` — les accents restent gérés correctement
  par le navigateur ("À propos" → "À PROPOS"). Scopé à ce seul élément :
  le pied de page du menu (email, "Alsace, France") n'est pas concerné,
  seuls les 5 liens de navigation passent en majuscules.
  Vérifié par script Playwright (couleur de la page courante confirmée
  identique aux autres liens au repos sur 2 pages différentes, `transform`
  au survol confirmé combiné translateY+scale, `text-transform:uppercase`
  confirmé sur les 5 liens) et capture d'écran desktop. Regression
  complète 5 pages × 2 viewports : 0 débordement, 0 erreur console.
- **Hero accueil sans eyebrow, cartes Engagements remontées, Équipe
  moins haute (2026-09-01)** (`index.html`, `.hero-content-minimal`,
  `.engagement-cards`, `.talent-stage-media`, `style.css`) : quatre
  retouches de la cliente en une fois.
  **Eyebrow du hero retiré** : `<p class="eyebrow on-dark">Dolce Vita ·
  Événementiel B2B premium en Alsace</p>`, jusque-là premier enfant de
  `.hero-content-minimal`, est supprimé du HTML — demande explicite, sans
  raison donnée. La règle `.hero-content .eyebrow` (qui ne stylait plus
  que cet unique élément, `.hero-content` n'étant utilisée nulle part
  ailleurs sur le site, vérifié par grep avant de la retirer) est
  supprimée de `style.css`, désormais orpheline.
  **Titre + CTA abaissés** : sans rien au-dessus pour occuper l'espace,
  le `h1` (et le bouton "Entrer dans l'univers" qui le suit dans le même
  flux, sous `.hero-actions`) remontait visiblement trop haut dans le
  cadre une fois centré verticalement par `.hero` (`display:flex;
  align-items:center`). `margin-top: clamp(2rem, 8vh, 6rem)` ajouté sur
  `.hero-content-minimal h1` — abaisse le titre ET, par un simple effet
  de flux normal (pas de règle séparée nécessaire), le CTA en dessous.
  Calé en `clamp()` avec un terme `vh` (pas une valeur fixe) pour rester
  proportionné à la hauteur réelle du viewport plutôt que de pousser le
  bloc hors écran sur les fenêtres basses.
  **Cartes Engagements remontées** : `.engagement-cards` (les 4
  flip-cards sous "Cliquez sur une carte...", `engagements.html`)
  `margin-top` réduit de `var(--space-5)` à `var(--space-4)` — rapproche
  les cartes du texte d'introduction juste au-dessus, sans toucher à leur
  disposition en ligne (`flex-wrap`) ni à leur mécanisme de flip/scale au
  scroll.
  **Équipe moins haute, même largeur** : `.talent-stage-media` (le bloc
  photo+texte "Les talents derrière Simposio", `@media (min-width:640px)`)
  passe de `min(94vh, 72rem)` à `min(84vh, 64rem)`. **Effet de bord
  assumé, documenté** : cette hauteur avait été AUGMENTÉE 4 fois de suite
  à des itérations précédentes (`min(88vh,54rem)` → `min(88vh,60rem)` →
  `min(92vh,66rem)` → `min(94vh,72rem)`, cf. plus haut dans ce fichier)
  précisément parce qu'une boîte plus haute réduit le zoom effectif
  d'`object-fit:cover` (la largeur étant fixée par le viewport, c'est la
  hauteur de la boîte qui pilote la fraction de photo visible) — réduire
  la hauteur ici va donc légèrement à l'inverse et réintroduit un peu
  plus de zoom sur les deux photos de l'équipe qu'à l'itération
  précédente, un compromis accepté implicitement par la demande ("qu'elle
  garde la même longueur sur l'écran juste que tu réduise légèrement la
  hauteur" ne visait que l'espace vertical occupé par la section, pas le
  cadrage des photos) plutôt que quelque chose à corriger. Si le zoom des
  photos d'équipe devient gênant après ce changement, revoir cette
  hauteur en connaissance de cet arbitrage plutôt que de la remonter sans
  y repenser.
  Vérifié par script Playwright (eyebrow confirmé absent du DOM,
  `.engagement-cards` `marginTop` mesuré à `44px` = 2.75rem,
  `.talent-stage-media` `minHeight` mesuré à `756px` = 84vh à 900px de
  haut) et capture d'écran desktop + mobile (390×844) pour le hero et la
  section Équipe — titre/CTA bien repositionnés sur la photo Fiat,
  section Équipe visiblement plus courte en hauteur mais toujours pleine
  largeur, aucun débordement. Regression complète 5 pages × 2 viewports :
  0 débordement, 0 erreur console.
- **Équipe — cadre rogné jusqu'au-dessus des avatars, hero encore abaissé,
  cartes Engagements encore remontées (2026-09-01, même jour)**
  (`.talent-stage-caption`, `.talent-stage-selector`,
  `.hero-content-minimal h1`, `.engagement-cards`, `style.css`) : trois
  retouches supplémentaires de la cliente sur les changements ci-dessus,
  toujours en une seule salve.
  **Équipe — rognée jusqu'au-dessus des avatars** : demande explicite,
  "coupe le bas de la section jusqu'à atteindre au-dessus des ronds
  actuels, et remonte les ronds pour qu'ils ne soient pas coupés". Sur
  cette section (`.talent-stage`, grille CSS à une seule cellule
  `grid-area:1/1` où `.talent-stage-media` et `.talent-stage-caption`
  partagent la même piste, cf. plus haut dans ce fichier), la hauteur
  totale se cale sur le plus grand des deux enfants — et sur les largeurs
  d'écran courantes (~1440-1600px), c'est en réalité `.talent-stage-caption`
  qui est le facteur limitant, pas `.talent-stage-media` : son
  `padding-bottom` (`12rem`) réserve un vide sous le nom/rôle/bio pour
  laisser la place aux avatars (positionnés indépendamment en
  `position:absolute` par rapport à `.talent-stage`, pas dans le flux de
  la légende), et ce vide fait à lui seul une bonne partie de la hauteur
  de la section. **`padding-bottom` réduit de `12rem` à `9rem`** — la
  section se raccourcit directement dès que la légende est le facteur
  limitant (mesuré : hauteur totale à 1440×900 passée de 830,7px à
  783,4px, soit -47px ; à 1600×900, 844,2px→796,9px ; à 1920×1080,
  inchangée, `.talent-stage-media` y devient le facteur limitant à cette
  largeur, cf. plus bas). **`.talent-stage-selector` remonté de
  `var(--space-4)` (44px) à `3.5rem` (56px)** : nécessaire en plus de la
  réduction ci-dessus — un premier essai à `8rem` de `padding-bottom`
  sans toucher au `bottom` des avatars laissait ceux-ci chevaucher
  légèrement le bas du texte de bio (~8px de recouvrement mesuré par
  script Playwright, pas supposé) puisque la réduction du
  `padding-bottom` grignote l'espace réservé sans que les avatars
  (positionnés indépendamment) suivent automatiquement d'autant. Calibré
  empiriquement (mesure des écarts bio→avatar et avatar→bord bas par
  script, pas juste visuellement) jusqu'à un résultat propre : `~18px`
  entre le bas de la bio et le haut des avatars, `~55px` entre le bas des
  avatars et le nouveau bord de la section, aux trois largeurs testées
  (1440/1600/1920px) — vérifié aussi par capture d'écran que les avatars
  ne sont ni tronqués ni superposés au texte, desktop et mobile.
  **Effet de bord attendu, cohérent avec l'itération précédente** : sur
  les très grands écrans (1920px+), où `.talent-stage-media` (dimensionné
  en `vh`/`rem`, inchangé ici) redevient le facteur limitant, cette
  réduction n'a par construction aucun effet visible sur la hauteur
  totale — seul l'espacement interne autour des avatars change. Si un
  effet de raccourcissement est aussi souhaité sur ces très grandes
  largeurs, il faudrait alors retoucher `.talent-stage-media`
  (`min-height`) lui-même, pas seulement `.talent-stage-caption`.
  **Hero encore abaissé** : `margin-top` sur `.hero-content-minimal h1`
  passe de `clamp(2rem, 8vh, 6rem)` à `clamp(3rem, 12vh, 8rem)` — demande
  explicite ("baisse encore leur position"), même mécanisme que la
  1ʳᵉ passe (une seule règle CSS pousse le titre ET le CTA qui le suit
  dans le même flux), juste des bornes plus généreuses. Vérifié par script
  Playwright que le CTA reste entièrement dans le viewport même à 700px de
  hauteur (le cas le plus bas testé sur ce site) — aucun risque de passer
  sous la ligne de flottaison sur une fenêtre basse.
  **Cartes Engagements encore remontées** : `margin-top` sur
  `.engagement-cards` passe de `var(--space-4)` (2,75rem) à `var(--space-2)`
  (1rem) — demande explicite ("remonte encore les cartes d'engagement vers
  le texte d'intro"), 2ᵉ réduction de suite sur ce même réglage (la 1ʳᵉ
  passe l'avait déjà réduit depuis `var(--space-5)`). Le reste de la
  grille (gap entre cartes, largeur, mécanisme de flip/scale au scroll)
  est inchangé.
  Regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Équipe — rognée jusqu'à l'intérieur du coude, cartes Engagements
  remontées une 3ᵉ fois, fond de page unique généralisé aux 4 autres pages
  (2026-09-02)** : trois demandes de la cliente en une fois.
  **Équipe — rognée jusqu'à l'intérieur du coude** (`.talent-stage-caption`/
  `.talent-stage-selector`/`.talent-stage-media`, `style.css`) : demande
  explicite, plus radicale que la précédente — "coupe jusqu'à l'intérieur
  du coude à gauche de la dame" (le coude visible côté gauche du cadre,
  au point où ses bras croisés se plient). **Le vrai levier n'est pas
  `.talent-stage-media`** (`min-height`, déjà réduit à l'itération
  précédente) — sur les largeurs d'écran courantes, c'est
  `.talent-stage-caption` qui reste le facteur limitant de la hauteur
  totale de la grille (`.talent-stage`, grid-area:1/1 partagée, se
  dimensionne sur le plus grand des deux enfants), donc réduire encore
  `min-height` sur la photo seule n'aurait eu strictement aucun effet
  visible tant que la légende reste plus haute — vérifié par script avant
  d'agir plutôt que supposé (trois passes de calibrage où faire varier
  `min-height` seul ne changeait rien à la hauteur réelle mesurée).
  `padding-bottom` de `.talent-stage-caption` (le vide réservé sous le
  nom/rôle/bio, qui pilote directement la hauteur totale via
  `justify-content:flex-end`) est donc réduit une 2ᵉ fois, de `9rem` à
  `1.25rem` — calibré empiriquement par balayage de plusieurs valeurs avec
  capture d'écran à chaque fois (jamais deviné), jusqu'à ce que le bord bas
  de la photo tombe très exactement à l'intérieur du coude visible.
  `.talent-stage-media` (`min-height`) est tout de même réduit en
  accompagnement, de `min(84vh,64rem)` à `min(50vh,40rem)`, pour rester
  largement sous ce nouveau plancher réel et ne pas risquer de le
  redevenir sur un viewport inhabituellement haut. `.talent-stage-selector`
  (`bottom`) repasse de `3.5rem` à `1rem` pour garder les avatars
  entièrement dans le cadre (`overflow:hidden` sur `.talent-stage`), avec
  encore un peu de marge sous eux.
  **Le "chevauchement avatars/bio" documenté à l'itération précédente
  s'est révélé ne pas être un vrai risque, une fois réexaminé avec ce
  nouveau calibrage plus serré** : `.talent-stage-selector` vit dans une
  colonne horizontalement disjointe du texte (`left:max(37rem,50%)`, à
  droite de la colonne de texte `width:min(26rem,48%)`) — un recouvrement
  de leurs rectangles en coordonnée Y seule (ce qu'une mesure
  `getBoundingClientRect` brute détecte) ne produit aucun chevauchement
  VISUEL tant que leurs plages en X restent séparées, ce qui est le cas ici
  à toutes les largeurs testées (vérifié par capture d'écran, pas
  seulement par le calcul). Documenté pour éviter de re-complexifier ce
  réglage sur une fausse alerte si un futur calibrage retombe sur des
  chiffres en apparence "qui se chevauchent".
  Vérifié par script Playwright (avatars confirmés entièrement dans le
  cadre — `top`/`bottom` comparés à ceux de `.talent-stage` — à
  1024/1440/1600/1920px de large, 0 débordement horizontal, 0 erreur
  console) et capture d'écran à chacune de ces largeurs : le bord bas de la
  photo tombe systématiquement à l'intérieur du coude visible, quelle que
  soit la largeur, sans dépendre d'un réglage par largeur.
  **Cartes Engagements remontées une 3ᵉ fois** : `margin-top` sur
  `.engagement-cards` passe de `var(--space-2)` (1rem) à `0.5rem` — demande
  explicite ("remonte encore un peu les cartes d'engagement"), même
  mécanisme, encore resserré.
  **Fond de page unique généralisé aux 4 autres pages** (`#pageBgLayer`,
  `main.js`/`style.css`, les 5 fichiers HTML sauf `index.html`) : demande
  explicite ("rajoute l'effet de fond au scroll de la page d'accueil sur
  les autres pages") — le mécanisme documenté plus haut dans ce fichier
  (calque de fond unique fixe, teinte interpolée en continu au scroll,
  `body[data-tone]` pour l'adaptation du texte) existait jusqu'ici
  seulement sur `index.html` (`body.home`). Étendu à Prestations, Projets,
  À propos et Contact.
  **Bloc JS entièrement séparé, pas un refactor du bloc `index.html`**
  (`main.js`) : pour ne prendre aucun risque sur le mécanisme de l'accueil,
  déjà calé au pixel près sur de nombreuses itérations (cf. plus haut) —
  ses fonctions `pageBgLerp`/`pageBgSample`/`pageBgWindow` restent locales
  à ce bloc, dupliquées plutôt que partagées. Se désactive lui-même sur
  `body.home` (`if (... || document.body.classList.contains("home")) return;`)
  et sur toute page où le markup attendu est incomplet — aucun risque de
  double-exécution ni de crash si une page ne correspond à aucune
  configuration connue.
  **Règle de construction des repères de couleur, plus simple que celle de
  l'accueil** : pour chaque frontière entre deux sections, une courte rampe
  (fenêtre `w`, plafonnée à la moitié de l'écart entre les deux) va de la
  couleur de la section précédente à celle de la section suivante, ancrée
  sur le bord réel (`top`, recalculé chaque frame, jamais mis en cache) de
  la section suivante. Entre deux frontières consécutives, les deux
  repères qui encadrent l'intérieur d'une section partagent TOUJOURS la
  même couleur — l'interpolation y est donc automatiquement plate, sans
  dérive, que la section soit courte (ex. le bandeau `.contact-band`) ou
  très longue/épinglée (`.values-reel`, même mécanisme que
  `#sensesJourney`) : aucun cas particulier ("hold" explicite, comme celui
  qu'a nécessité `#sensesJourney` sur l'accueil) n'est nécessaire ici,
  cette règle le couvre déjà par construction.
  **Chaque page a son propre `body.page-X`** (`page-prestations`/
  `page-projets`/`page-engagements`/`page-contact`) pour scoper la
  transparence des classes qu'elle PARTAGE avec d'autres pages
  (`.page-header`, `.site-footer`) sans jamais toucher `body.home` ni les
  autres pages ; les classes exclusives à une seule page (`.founder`,
  `.contact-devis`, `.contact-faq`) sont rendues transparentes directement
  à leur déclaration d'origine (vérifié par grep qu'aucune autre page ne
  les réutilise).
  **Sections gardées OPAQUES**, pour la même raison que `.stats-band`/
  `#sensesJourney` sur l'accueil (photo plein cadre ou mécanisme pinned
  déjà calé, aucun bénéfice visible à les rendre transparentes) : `.world`
  (Prestations, 4 panneaux photo plein cadre), `.mosaic-section` (Projets —
  sa grille de tuiles sans espace couvre déjà 100% de la section),
  `.contact-band` (photo "dolce vita"), `.values-reel` (À propos, épinglé).
  **Piège réel trouvé avant publication, pas supposé** : `.talents`
  (À propos) a un fond CSS nominal `--bg-dim` (crème-dim, clair), mais
  celui-ci n'est en réalité JAMAIS visible à l'écran — `.talent-stage` (le
  bloc photo+texte de l'équipe) est plein cadre et opaque (fond
  `--navy-900`, sombre) et couvre 100% de la section. Le repère de couleur
  utilisé dans `main.js` pour cette section est donc `--navy-900` (la
  teinte RÉELLEMENT visible), pas le `--bg-dim` nominal de `.talents` —
  utiliser ce dernier aurait fait dériver le calque vers une teinte claire
  qui n'apparaît jamais réellement à l'écran, créant un décalage au moment
  où `.founder` (vraiment claire, juste après) prend le relais.
  **Adaptation du texte aux frontières les plus marquées**
  (`.bg-adaptive-eyebrow`/`.bg-adaptive-heading`/`.bg-adaptive-lede`,
  `contact.html`/`engagements.html`) : les règles `[data-tone] .bg-adaptive-*`
  existantes (nées pour l'accueil, scopées `body.home`) sont étendues en
  LISTE de sélecteurs (`body.home[data-tone="dark"] .bg-adaptive-eyebrow,
  body.page-contact[data-tone="dark"] .bg-adaptive-eyebrow { … }`, jamais
  généralisées en `[data-tone]` seul) — pour ne prendre aucun risque de
  changement de couleur non désiré sur l'accueil. Appliquées à
  `.contact-devis-text` (eyebrow/h2/lede, nés pour un fond clair juste
  après `.contact-band`, sombre — même cas que `.teaser`/`.method-cta` sur
  l'accueil, mêmes couleurs cibles réutilisées) et à l'eyebrow "La
  fondatrice" (`.founder`, né pour un fond clair juste après `.talents`,
  RÉELLEMENT sombre malgré son `--bg-dim` nominal, cf. piège ci-dessus).
  **Cas inverse, nouveau, propre à `.contact-faq`** : son eyebrow/titre
  sont nés pour un fond SOMBRE (`.eyebrow.on-dark`, texte `--fg-inverse`
  hérité de la section) juste après une section claire
  (`.contact-devis`) — l'inverse exact du cas ci-dessus, qui n'existait
  nulle part sur l'accueil (son seul équivalent "né sombre" est le footer,
  qui a déjà son propre `.bg-adaptive-footer` dédié). Deux règles neuves,
  scopées uniquement à `body.page-contact[data-tone="light"]`, sans
  équivalent sur l'accueil.
  Vérifié par script Playwright : balayage complet du scroll sur les 4
  pages (couleur du calque et `data-tone` échantillonnés à 26 points
  chacune) confirmant des transitions cohérentes, des couleurs de départ/
  arrivée correctes et 0 valeur invalide ; capture d'écran à chaque
  frontière de couleur sur les 4 pages (desktop et mobile) confirmant
  visuellement un texte lisible tout du long, y compris aux deux
  frontières protégées par `.bg-adaptive-*` sur Contact ; `index.html`
  revérifié à l'identique (balayage de couleur comparé point par point,
  aucune différence — le nouveau bloc se désactive bien via
  `body.home`). Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Effet de fond au scroll — retiré partout sauf 3 sections précises,
  nouveau déclencheur "bas de section au milieu de l'écran" (2026-09-02)** :
  la cliente a demandé de retirer l'effet de fond au scroll généralisé
  ci-dessus, en ne le gardant QUE sur "Nos prestations / Quatre mondes,
  une même Dolce Vita" (`.teaser`, accueil), la citation de la fondatrice
  (`.founder`, À propos) et "Questions fréquentes" (`.contact-faq`,
  Contact) — avec une consigne précise sur `.teaser` (l'effet doit aller du
  bleu au blanc) et un nouveau déclencheur explicite pour les 3 sections
  gardées : la couleur définitive doit apparaître au moment où le BAS de
  la section arrive au MILIEU de l'écran (pas un simple passage de
  frontière comme avant).
  **Remplace ENTIÈREMENT** le mécanisme de "fond de page unique"
  (`#pageBgLayer`, un calque fixe partagé, avec ses variantes `body.home`
  pour l'accueil puis `body.page-X` pour les 4 autres pages — historique
  complet des nombreuses itérations documenté juste au-dessus dans ce
  fichier) — remplacé par `initScrollFade(el, fromRgb, toRgb)`
  (`main.js`), une fonction minuscule appelée 3 fois, une par section
  gardée, chacune totalement indépendante : plus de calque fixe partagé ni
  de repères inter-sections, chaque section porte directement sa PROPRE
  couleur de fond. `#pageBgLayer` et les classes `body.home`/`body.page-X`
  sont entièrement retirés du HTML des 5 pages. Si l'une de ces classes ou
  `#pageBgLayer` réapparaissent dans un diff, c'est cet ancien mécanisme, à
  ne pas réintroduire sans qu'on le redemande — l'historique complet des
  itérations reste documenté plus haut dans ce fichier pour référence, et
  n'est plus d'actualité.
  **Nouveau déclencheur, plus simple que l'ancien système de repères par
  frontière** : `progress = (viewportHeight - rect.bottom) / (viewportHeight
  / 2)`, clampé `[0,1]` — `progress=0` quand le bas de la section touche le
  bas du viewport (elle commence tout juste à apparaître), `progress=1`
  quand son bas atteint le milieu de l'écran (consigne explicite de la
  cliente), et la couleur reste figée à la couleur d'arrivée au-delà (pas
  de retour en arrière tant qu'on ne scrolle pas remonte). Revenir en
  arrière au scroll refait aussi refondre vers la couleur de départ,
  cohérent avec tous les autres effets scroll-liés bidirectionnels du
  site. Recalcule `getBoundingClientRect()` à chaque frame (pas de cache),
  même précaution que l'ancien mécanisme.
  **Bug réel trouvé et corrigé, pas supposé** : sans filet de sécurité,
  `.contact-faq` (suivie d'un footer plus court que le reste de la
  distance de scroll qu'il faudrait pour que son propre bas atteigne
  géométriquement le milieu de l'écran) restait bloquée à `progress≈0,87`
  même au scroll maximal de la page — la couleur définitive (bleu
  Méditerranéen le plus sombre) n'était alors jamais atteinte, repéré par
  balayage de scroll complet (mesure de `progress` à chaque étape jusqu'au
  scroll max réel), pas supposé. Corrigé en forçant `progress=1` dès que
  `window.scrollY` atteint le scroll maximal réel de la page
  (`document.documentElement.scrollHeight - window.innerHeight`) — même
  principe que le `footerRampEnd` de l'ancien mécanisme, qui avait déjà dû
  résoudre exactement ce même genre de problème pour la même raison
  structurelle (une section proche de la fin de page, suivie d'un élément
  plus court que la distance de scroll idéale).
  **Couleurs** (aucune inventée, toutes reprises de la palette de marque
  fixe) : `.teaser` va de `--navy` (28,59,74, "bleu", demande explicite) à
  `--bg`/`--cream` (246,241,231, "blanc calcaire" — la palette du site n'a
  pas de blanc pur, cette teinte est la plus proche et déjà la couleur
  cible historique de cette section) ; `.founder` va de `--navy-900`
  (16,31,39 — la teinte RÉELLEMENT visible juste au-dessus dans la page,
  via `.talent-stage` qui couvre entièrement `.talents` malgré son
  `--bg-dim` nominal jamais montré à l'écran, cf. commentaire déjà présent
  dans le code) à `--bg` ; `.contact-faq` va de `--bg-dim` (236,227,209, la
  teinte de `.contact-devis` juste au-dessus, redevenue statique, cf.
  plus bas) à `--navy-900`.
  **Sections revenues à un fond fixe (statique, plus aucun effet)** :
  `.hero`/`.method-cta` (accueil, → `var(--navy)`/`var(--bg)`),
  `.contact-devis` (Contact, → `var(--bg-dim)`) — ainsi que TOUTES les
  sections des 4 autres pages qui avaient reçu l'effet généralisé
  ci-dessus (`.page-header`, `.site-footer`, `.world`, `.mosaic-section`,
  `.talents`, `.values-reel`, `.contact-band`) : aucune n'a plus le
  moindre effet de fond au scroll désormais, seules les 3 sections
  nommées explicitement par la cliente le gardent. Les classes
  `.bg-adaptive-*` devenues inertes sur ces sections (`.method-cta`,
  `.site-footer`, `.contact-devis-text`) sont retirées de leur HTML par
  cohérence (plus aucune règle CSS ne les cible), pas seulement laissées
  en dead code.
  **`data-tone` posé directement sur la SECTION elle-même** (pas sur
  `body` comme dans l'ancien mécanisme, devenu inutile puisque chaque
  fondu est maintenant autonome et ne concerne jamais qu'une seule section
  à la fois) : `.teaser[data-tone]`/`.founder[data-tone]`/
  `.contact-faq[data-tone]` pilotent l'adaptation de leurs propres
  éléments `.bg-adaptive-*` (mêmes classes que l'ancien mécanisme,
  simplement rescopées).
  **Deux bugs de contraste réels trouvés et corrigés pendant la
  vérification par capture d'écran, aucun supposé** — l'ancien mécanisme
  ne concernait que l'eyebrow/le titre de chaque section (seuls éléments
  à risque sur l'accueil/Contact) ; le fondu bien plus large en amplitude
  de `.founder` (bleu Méditerranéen le plus sombre → crème, un écart de
  luminance bien plus marqué que les frontières de l'ancien mécanisme) a
  révélé deux éléments supplémentaires jamais concernés jusqu'ici :
  1. La citation/signature de la fondatrice (`.founder-quote-minimal`/
     `.founder-signature-minimal`/`.founder-avatar-minimal`, toutes en
     `--navy`, fixe) devenait quasi illisible en tout début de fondu
     (texte navy sur fond encore bleu Méditerranéen très sombre, les deux
     étant proches en luminance) — capturé à un point de scroll précis où
     le texte est déjà visible à l'écran mais le fond encore entièrement
     sombre (`{el:'.founder-quote-minimal', bg:'rgb(16,31,39)'}` mesuré).
     Corrigé par des règles `.founder[data-tone="dark"] .founder-quote-
     minimal/.founder-signature-minimal/.founder-avatar-minimal` basculant
     vers `--cream`/`--fg-muted-inverse`, réutilisant les teintes déjà
     établies ailleurs sur le site pour ce rôle sur fond sombre.
  2. Les cartes FAQ (`.faq-item`, fond quasi transparent à 3% de blanc,
     texte `--cream`/`--fg-muted-inverse`, nées pour le fond sombre de
     repos) devenaient illisibles pendant la phase claire du fondu de
     `.contact-faq` (texte clair sur fond redevenu clair) — même défaut
     que le cas précédent, dans l'autre sens. Corrigé par
     `.contact-faq[data-tone="light"] .faq-item`
     (`border-color:var(--border); background:rgba(28,59,74,0.03)`, même
     opacité que l'original mais teintée navy) et ses `summary`/`p`
     rebasculés vers `--ink`/`--fg-muted`.
  Vérifié par script Playwright : balayage complet du scroll sur les 3
  sections gardées (couleur/`data-tone` échantillonnés à 20-21 points
  chacune) confirmant `progress=0` en entrée, `progress=1` (couleur
  figée) dès que le bas de la section atteint le milieu de l'écran, et
  0 valeur invalide — y compris au scroll maximal réel pour
  `.contact-faq` (correctif du bug ci-dessus revérifié) ; capture d'écran
  à plusieurs points de chaque fondu (desktop et mobile) confirmant
  visuellement un texte lisible tout du long, y compris pour les deux
  bugs de contraste ci-dessus une fois corrigés. Regression complète
  5 pages × 2 viewports : 0 débordement, 0 erreur console.
  **Correction du déclencheur, le jour même** : la cliente s'est trompée
  dans sa consigne initiale ("je me suis trompé, je veux que cela
  apparaisse quand le HAUT de la section a atteint le milieu de l'écran")
  — `update()` dans `initScrollFade()` passe de `progress = (vh -
  rect.bottom) / (vh/2)` à `progress = (vh - rect.top) / (vh/2)`, seule
  cette ligne change (le reste du mécanisme — filet de sécurité au scroll
  maximal, `data-tone`, bornage `[0,1]` — est inchangé). Avec le haut de
  section comme repère, la couleur définitive est atteinte plus tôt dans
  le scroll qu'avec le bas (le haut passe le milieu de l'écran avant le
  bas, forcément) — revérifié que le filet de sécurité au scroll maximal
  (nécessaire avec `rect.bottom` pour `.contact-faq`, cf. bullet
  ci-dessus) reste inoffensif ici : avec `rect.top`, cette section
  atteint désormais `progress=1` bien avant la fin réelle du scroll de la
  page, le filet ne se déclenche donc plus, mais reste en place par
  précaution pour une future section courte en fin de page. Si
  `rect.bottom` réapparaît dans cette fonction, c'est ce réglage
  initial (une consigne erronée, corrigée le jour même), à ne pas
  réintroduire sans qu'on le redemande. Vérifié par le même script de
  balayage de scroll (progress 0→1 atteint quand `rect.top<=vhMid` sur
  les 3 sections, plus aucune valeur bloquée avant la fin de page) et
  regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Repère du déclencheur passé du milieu aux trois quarts de l'écran,
  à l'essai (2026-09-02, même jour)** : demande explicite ("j'aimerais que
  tu essayes quand le haut de la section arrive aux trois quarts de
  l'écran") — `initScrollFade()` prend une nouvelle constante partagée
  `SCROLL_FADE_TRIGGER_FRACTION = 0.75` (au lieu du milieu, `0.5`, codé en
  dur dans la formule) : `triggerY = vh × 0.75`, et `progress = (vh -
  rect.top) / (vh - triggerY)`. Avec un repère plus bas dans l'écran, le
  haut de la section n'a plus qu'un quart de la hauteur du viewport à
  parcourir (au lieu de la moitié) pour que `progress` passe de 0 à 1 —
  la couleur définitive est donc atteinte nettement plus tôt dans le
  scroll pour les 3 sections. Le filet de sécurité au scroll maximal
  (pour une section proche de la fin de page, cf. bullet précédent) est
  inchangé et reste en place par précaution, bien qu'il ne se déclenche
  plus pour aucune des 3 sections à ce nouveau réglage (`progress`
  atteint 1 naturellement bien avant la fin réelle du scroll de la page).
  Si `0.5` réapparaît dans le calcul de `triggerY` (ou si la constante
  `SCROLL_FADE_TRIGGER_FRACTION` disparaît au profit d'une valeur codée en
  dur), c'est le réglage précédent, à ne pas réintroduire sans qu'on le
  redemande — un simple changement de cette seule constante suffit à
  essayer d'autres valeurs si celle-ci ne convient pas non plus. Vérifié
  par le même script de balayage de scroll (progress 0→1 atteint quand
  `rect.top<=0.75×vh` sur les 3 sections, transition visiblement plus
  rapide confirmée par capture d'écran) et regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Repère du déclencheur repassé au premier tiers de l'écran, à l'essai
  (2026-09-02, même jour)** : nouvelle demande explicite ("j'aimerais que
  tu essayes quand le haut de la section arrive au premier tiers de
  l'écran") — `SCROLL_FADE_TRIGGER_FRACTION` passe de `0.75` à `1 / 3`,
  seule cette constante change (le reste du mécanisme, y compris le filet
  de sécurité au scroll maximal, est inchangé). **Effet inverse des deux
  réglages précédents** : ce repère est plus HAUT dans l'écran (premier
  tiers, pas trois quarts) donc le haut de la section doit parcourir DAVANTAGE
  de hauteur de viewport avant d'atteindre `progress=1` (les deux tiers de
  la hauteur du viewport, contre un quart avec `0.75` et la moitié avec
  `0.5`) — la couleur définitive est donc atteinte plus tard dans le
  scroll qu'avec les deux réglages précédents, pas plus tôt. Vérifié par
  le même script de balayage de scroll (progress 0→1 atteint quand
  `rect.top<=vh/3` sur les 3 sections, y compris `.contact-faq` qui
  l'atteint là aussi bien avant la fin réelle du scroll de la page — le
  filet de sécurité ne se déclenche toujours pas) et regression complète
  5 pages × 2 viewports : 0 débordement, 0 erreur console. Si `0.75`
  réapparaît dans `SCROLL_FADE_TRIGGER_FRACTION`, c'est le réglage
  précédent, à ne pas réintroduire sans qu'on le redemande.
- **Menu plein écran — minuscules, survol nettement agrandi "au premier
  plan" (2026-09-02)** (`.mobile-menu-links`, `style.css`) : deux demandes
  de la cliente sur ce composant.
  **Retour aux minuscules** : `text-transform: uppercase` retiré de
  `.mobile-menu-links .label` (ajouté le 2026-09-01, cf. plus haut dans ce
  fichier) — le HTML des liens était déjà écrit en casse normale ("À
  propos", pas "À PROPOS"), donc ce retrait ne demande aucun changement de
  contenu, seul le rendu visuel change.
  **Agrandissement au survol nettement accentué** : demande explicite
  ("j'aimerais qu'il apparaisse en plus gros que les autres, en prenant
  plus de place comme s'il allait un peu au premier plan") — remplace le
  léger `scale(1.04)` du 2026-09-01 (pensé comme un simple "petit
  mouvement", à peine perceptible) par `scale(1.35)`, conservant le léger
  soulèvement vertical (`translateY(-6px)`) déjà en place. `z-index:2`
  ajouté sur le LIEN survolé/focus (`.mobile-menu-links a:hover`, pas
  seulement sur `.label`) : sans ça, le lien agrandi chevauche
  visuellement ses voisins (gap vertical fixe entre liens, le `transform`
  sur `.label` ne modifie pas la mise en page) mais reste dans l'ordre
  d'empilement normal du flux — `z-index` le fait vraiment passer
  au-dessus des liens voisins, ce qui est le sens de "premier plan"
  demandé. `.mobile-menu-links a` est déjà `position:relative` (nécessaire
  pour que `z-index` ait un effet, sinon ignoré). Si
  `text-transform:uppercase` ou `scale(1.04)` réapparaissent sur ces
  règles, ce sont les réglages précédents, à ne pas réintroduire sans
  qu'on le redemande.
  Vérifié par script Playwright (menu ouvert, survol du 3ᵉ lien simulé par
  positionnement direct de la souris — pas de clic — puis capture d'écran,
  0 débordement horizontal confirmé desktop et mobile, 0 erreur console) :
  le lien survolé s'affiche visiblement plus grand et chevauche
  proprement l'espace de ses voisins, en terracotta, au-dessus d'eux.
- **Menu plein écran — texte agrandi et aligné à gauche, agrandissement au
  survol remplacé par un décalage horizontal (2026-09-02, même jour)**
  (`.mobile-menu-links`, `style.css`) : trois demandes de la cliente en une
  fois sur le rendu de l'itération précédente ("mets l'écriture en plus
  gros et centre, le texte à gauche dans le menu ensuite enlève l'effet qui
  grandit lorsqu'on passe la souris et trouve un autre effet pour mettre en
  évidence en plus de la couleur").
  **Bloc centré, texte aligné à gauche** : `.mobile-menu-links` passe de
  `align-items:center; text-align:center` à `align-items:flex-start;
  text-align:left` — `margin-inline:auto`/`max-width:var(--max-width)`
  restent inchangés, donc le bloc de liens dans son ensemble reste centré
  sur la largeur de l'écran (comme demandé, "centre"), mais chaque libellé
  s'aligne désormais à gauche à l'intérieur de ce bloc plutôt que d'être
  centré individuellement ("le texte à gauche").
  **Texte agrandi, calibré empiriquement à la contrainte "tient sur un
  écran"** : `.mobile-menu-links .label` passe de
  `clamp(2.2rem, min(9.5vh, 15vw), 6.4rem)` à
  `clamp(2.2rem, min(10.1vh, 15.5vw), 7.2rem)` — même famille de calcul
  déjà établie sur ce composant (le plafond `vh` reste le levier principal,
  "tient sur un écran" étant une contrainte de hauteur, pas de largeur ; le
  terme `vw` reste un filet pour les écrans très étroits). **Calibré par
  script Playwright** (`menu_fit_check.js`, mesurant
  `menu.scrollHeight <= menu.clientHeight` sur 10 tailles de viewport
  réalistes, de 320×568 à 1920×1080) plutôt que deviné : un premier essai à
  `clamp(2.2rem, min(13vh, 18vw), 9rem)` débordait (nécessitait un scroll
  interne) sur 7 des 10 tailles testées, y compris des tailles desktop
  courantes (1440×900, 1024×768) — réduit par pas jusqu'à la valeur
  retenue, qui tient sur toutes les tailles testées **sauf** 320×568 (un
  iPhone 5 de 2012, déjà toléré comme cas résiduel ailleurs sur ce
  composant — `overflow-y:auto` reste le filet de sécurité). Confirmé
  malgré tout nettement plus grand que la valeur précédente à toutes les
  tailles usuelles (calcul direct des deux clamps : +5,4px à 1440×900,
  +4,6px à 1024×768, +2,0px à 390×844, +6,7px à 1920×1080). Aucun retour à
  la ligne introduit par cet agrandissement (`maxLines:1` sur les 5 liens à
  toutes les tailles testées, mesuré via `Range.selectNodeContents()` +
  `getClientRects()`, la technique déjà établie ailleurs sur le site pour
  ce type de vérification).
  **Effet d'agrandissement au survol retiré, remplacé par un décalage
  horizontal** : demande explicite de retirer le `scale(1.35)`/
  `translateY(-6px)`/`z-index:2` ajoutés le même jour, un tour plus tôt, à
  la demande de la cliente elle-même — `.mobile-menu-links a:hover,
  .mobile-menu-links a:focus-visible { z-index: 2; }` est retiré (plus
  nécessaire : un simple décalage horizontal ne fait chevaucher aucun lien
  voisin, contrairement à un agrandissement) et
  `transform: translateY(-6px) scale(1.35)` devient
  `transform: translateX(clamp(0.75rem, 2.5vw, 2rem))` sur
  `.mobile-menu-links a:hover .label`/`a:focus-visible .label` — le lien
  survolé glisse vers la droite (cohérent avec le nouvel alignement à
  gauche : le texte "part" de sa position naturelle vers l'espace libre à
  droite) en plus du changement de couleur déjà en place
  (`color: var(--terracotta-300)`), sans changer sa taille ni son
  empilement. Si `scale(1.35)`/`translateY(-6px)` ou la règle `z-index:2`
  sur le lien survolé réapparaissent ici, c'est l'itération précédente
  (agrandissement "premier plan"), à ne pas réintroduire sans qu'on le
  redemande — de même pour `align-items:center; text-align:center` sur
  `.mobile-menu-links`, qui serait un retour à l'alignement centré
  d'avant cette itération.
  Vérifié par script Playwright (alignement à gauche confirmé par capture
  d'écran desktop et mobile, taille de police mesurée cohérente avec le
  nouveau clamp, survol du 3ᵉ lien confirmé : décalage horizontal +
  changement de couleur, sans changement de taille ni chevauchement des
  voisins, 0 débordement horizontal desktop et mobile, 0 erreur console) et
  regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Cartes Engagements — retour à de vraies photos d'événement ; photos
  d'équipe renouvelées (2026-09-02)** (`engagements.html`,
  `assets/css/style.css`) : demande explicite de la cliente ("pour les
  cartes d'engagement prend des photos vraiment évènementiel Dolce
  Vita et aussi prends deux autres photos pour l'équipe cherche sur
  Pinterest, si tu peux sinon sur nos banques d'image").
  **Cartes Engagements (flip-cards, 3 des 4)** : les photos issues du
  renouvellement du 2026-08-19 — `ravello-villa-cimbrone-jardin.jpg`,
  `ravello-terrasse-infini.jpg`, `piazza-siena-terrasses.jpg` (jardin/
  terrasse/place, du tourisme italien plutôt qu'un événement) — sont
  remplacées par de vraies photos Simposio déjà utilisées ailleurs sur le
  site (mosaïque Projets), qui montrent cette fois un vrai événement mis
  en scène plutôt qu'un simple décor : `evenement-tablee-diner-bougies.jpg`
  ("Concept clé en main", tablée complète bougies/fleurs/verrerie),
  `evenement-carte-degustation.jpg` ("Positionnement premium", carte à
  déguster sur chevalet), `evenement-vespa-gelato-brindapino.jpg`
  ("Spécialiste Dolce Vita", vespa+gelato+toast). Ce sont d'ailleurs les 3
  mêmes photos utilisées sur ces mêmes cartes avant le renouvellement du
  2026-08-19 — un retour plutôt qu'un nouveau choix, cohérent avec le sens
  de la demande ("vraiment évènementiel"). La classe
  `.engagement-card-front-img--pos-left` (recadrage spécifique au buste en
  marbre de l'ancienne photo "Positionnement premium") est retirée du
  `<img>` de cette carte, plus nécessaire avec la nouvelle photo (crop par
  défaut déjà bien centré, vérifié par capture). **La 4ᵉ carte ("Ancrage
  alsacien", `alsace-maisons-colombages.jpg`) n'est pas touchée** : elle
  reste le point de contraste non-italien de cette grille (déjà documenté
  comme volontaire lors du renouvellement précédent), pas un événement
  Dolce Vita au sens propre. Crédits Wikimedia Greg Willis et Nessy
  retirés du bloc `.photo-credits` d'`engagements.html` (leurs 2 photos ne
  sont plus utilisées nulle part) ; `assets/img/CREDITS.md` mis à jour
  (les 3 anciennes photos remises en "non utilisée actuellement", les 3
  photos Simposio remises en "Utilisée sur").
  **Photos d'équipe (`.talent-stage`)** : Pinterest a été essayé en
  premier (demande explicite) via recherche web, mais écarté pour la
  sélection finale — la plateforme republie des photos dont elle ne
  détient pas nécessairement les droits, sans information de licence
  fiable pour un usage commercial, contrairement à Pexels (licence Pexels,
  déjà la source établie sur ce projet) et Wikimedia Commons (CC BY/BY-SA
  avec attribution) ; repli sur Pexels, la 2ᵉ option proposée par la
  cliente elle-même. `talent-placeholder-1.jpg`/`-2.jpg` (les 2 photos de
  banque provisoires en place depuis le 2026-08-20) sont remplacées par
  `talent-placeholder-3.jpg` (buste en tailleur bleu marine sur mur uni,
  bras croisés, très grande marge au-dessus de la tête — Pexels 6702633,
  Maksim Goncharenok) et `talent-placeholder-4.jpg` (buste en chemise,
  bras croisés, devant une véranda/fenêtre — Pexels 7648239, RDNE Stock
  project). Toujours des photos temporaires en attente des vraies photos
  de l'équipe (TODO déjà présent dans le HTML, inchangé).
  **Recadrage entièrement recalibré pour les 2 nouvelles photos**
  (`.talent-stage-photo[data-talent-target="0"/"1"]`, `style.css`) — les
  anciens réglages (`object-position`/`transform:scale()+translateX()`)
  étaient taillés pixel par pixel pour les compositions des 2 anciennes
  photos (têtes plus serrées), donc obsolètes pour ces 2 nouvelles. Même
  méthode déjà établie sur ce composant : `object-position` vertical seul
  pour cadrer tête/torse (l'axe horizontal reste inopérant dans cette
  boîte très large/peu haute une fois `object-fit:cover` appliqué, cf.
  explication déjà en place dans le CSS), complété par
  `transform:scale()+translateX()` pour dégager le visage de la zone
  floutée/assombrie de gauche (`.talent-stage-blur`, ≥640px uniquement).
  Calibré par balayage empirique (capture d'écran à chaque valeur, jamais
  deviné) à 5 largeurs desktop (768 à 1920px) puis revérifié à l'identique
  sur mobile : `data-talent-target="0"` → `object-position:50% 52%` +
  `transform:scale(1.1) translateX(9%)` ; `data-talent-target="1"` →
  `object-position:50% 32%` + `transform:scale(1.3) translateX(18%)` (zoom
  plus fort car son visage, plus proche du centre de la photo source, a
  besoin de plus de décalage pour sortir de la zone floutée).
  **Piège méthodologique rencontré et corrigé pendant ce calibrage, pas un
  bug du site** : un premier balayage sur mobile via
  `.locator('.talent-stage').screenshot()` semblait montrer un recadrage
  cassé (torse seul, tête absente, identique quelle que soit la valeur
  testée) — écarté après investigation : c'est le header fixe du site
  (translucide, toujours à l'écran) qui se retrouvait peint par-dessus le
  haut de la photo au moment précis où Playwright scrollait la section
  pile au ras du haut du viewport pour la capturer, masquant la tête —
  un artefact de la méthode de capture (scroll-into-view avant screenshot
  d'un long élément), pas un défaut de mise en page. Confirmé en
  screenshotant l'`<img>` isolé plutôt que toute la section : le cadrage
  était en réalité déjà correct. Un candidat de remplacement pour la 2ᵉ
  photo (Pexels 34381970, Karola G — portrait plus serré que le choix
  final) a par contre été rejeté pour un vrai motif géométrique, confirmé
  par calcul et capture d'écran : sur les très grands écrans, la boîte
  `.talent-stage-media` devient si peu haute par rapport à sa largeur que
  cette composition plus serrée n'y laissait plus aucune marge, coupant le
  haut du crâne — remplacé par une photo au format paysage (3:2), bien
  mieux adaptée à ce type de boîte très large/peu haute.
  Vérifié par script Playwright (0 débordement horizontal, 0 erreur
  console sur les 5 pages × 2 viewports ; retournement des flip-cards
  clic+clavier et navigation clavier du sélecteur d'équipe revérifiés
  fonctionnels après les changements de photos) et capture d'écran à
  5 largeurs (390 à 1920px) pour les 2 photos d'équipe et les 4 cartes
  d'engagement. Regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
- **Effet de fond au scroll rajouté sur "Notre méthodologie" ; "Composons
  ensemble" retiré, "Notre méthodologie" prend sa place ; numéros des
  cases retirés (2026-09-02, même jour)** (`.method-cta`, `index.html`,
  `assets/css/style.css`, `assets/js/main.js`) : trois demandes de la
  cliente sur le bandeau CTA+méthodologie de l'accueil, dans la foulée du
  retrait de l'effet de fond au scroll généralisé plus tôt le même jour
  (cf. bullet "Effet de fond au scroll — retiré partout sauf 3 sections
  précises" plus haut, qui avait explicitement retiré l'effet de
  `.method-cta`).
  **1) Effet de fond au scroll rajouté** : un 4ᵉ appel à `initScrollFade()`
  (`main.js`) est ajouté pour `.method-cta`, en plus des 3 sections déjà
  gardées (`.teaser`, `.founder`, `.contact-faq`) — même mécanisme,
  aucune modification de la fonction elle-même. Couleurs : rouge Terre
  d'Ombrie très sombre (`#2b1010`, 43,16,16) → blanc calcaire (`--bg`,
  246,241,231). **Couleur de départ pas prise dans la palette nominale de
  la section précédente, mais dans sa teinte RÉELLEMENT visible** — même
  raisonnement déjà appliqué à `.founder` (dont le fromRgb avait pris la
  teinte réelle de `.talent-stage` plutôt que le `--bg-dim` nominal,
  jamais visible à l'écran) : la section juste au-dessus,
  `#sensesJourney`, est un long parcours ÉPINGLÉ (`position:sticky`,
  1240vh de scroll) dont le fond ne défile pas — c'est le bas de son
  propre dégradé interne (`.senses-journey-sticky`,
  `linear-gradient(190deg, var(--rosso-ombria) 0%, #2b1010 100%)`) qui est
  visible au moment de sortir de cette section, pas une valeur nominale
  de section entière.
  **Quatre éléments à adapter au fondu (contre 1-2 pour les 3 autres
  sections déjà gardées)** : cette section a plusieurs blocs de texte de
  rôles différents (eyebrow, titre, lede, ET un bouton outline) qui
  reposent tous directement sur le fond de la section plutôt que sur leur
  propre carte/photo — nouvelles classes marqueurs `.bg-adaptive-eyebrow`/
  `.bg-adaptive-heading`/`.bg-adaptive-lede`/`.bg-adaptive-btn-outline`/
  `.bg-adaptive-note` posées sur l'eyebrow, le `h2`, le `.lede`, le bouton
  "Voir nos projets" (`.btn-outline-dark`, pensé pour un fond clair —
  bordure/texte navy, transparent, invisible sur fond sombre) et
  `.method-steps-note`. Règles `.method-cta[data-tone="dark"] .bg-adaptive-*`
  ajoutées à côté des règles déjà en place pour les 3 autres sections,
  même structure (`[data-tone]` posé directement sur la section par
  `initScrollFade()`). `.method-step-panel` (les 3 cases elles-mêmes)
  n'a besoin d'aucune adaptation : il a déjà son propre fond dégradé navy
  fixe, indépendant du fondu de la section.
  **2) "Composons ensemble" retiré, "Notre méthodologie" prend sa place** :
  demande explicite ("enlève le titre composons ensemble et décale le
  notre méthodologie à la place"). L'eyebrow "Composons ensemble" de
  `.method-cta-intro` (colonne de gauche, au-dessus du `h2` "Votre
  prochain événement commence ici") est supprimé ; l'eyebrow "Notre
  méthodologie", qui vivait jusque-là au-dessus de la liste des 3 étapes
  dans `.method-steps` (colonne de droite), est déplacé à sa place — un
  seul eyebrow pour toute la section désormais, au lieu de deux
  (un par colonne). `.method-steps-eyebrow` (la classe CSS dédiée,
  devenue orpheline) est supprimée de `style.css`. Si `Composons
  ensemble` réapparaît comme eyebrow, ou si `.method-steps` a de nouveau
  son propre eyebrow séparé, c'est un retour à l'ancienne disposition, à
  ne pas réintroduire sans qu'on le redemande.
  **3) Numéros des cases retirés** : demande explicite ("sur les cases de
  la méthodologie, enlève les numéros") — les 3 `<span class="method-step-num">
  01/02/03</span>` (badges circulaires terracotta positionnés en
  `top:-1.1rem` par-dessus chaque panneau) sont retirés du HTML, ainsi que
  leurs règles CSS (`.method-step-num`, `.method-step:hover .method-step-num`)
  — plus aucun changement de mise en page nécessaire, le badge était
  purement décoratif, jamais dans le flux du panneau. Si
  `.method-step-num` réapparaît, c'est cet ancien badge, à ne pas
  réintroduire sans qu'on le redemande.
  Vérifié par script Playwright (balayage de scroll sur `.method-cta`
  confirmant `progress`/`data-tone`/couleur cohérents du rouge sombre au
  crème, couleurs adaptatives des 5 éléments confirmées par
  `getComputedStyle` en phase sombre, `.method-step-num` confirmé absent
  du DOM, eyebrow de `.method-cta-intro` confirmé = "Notre méthodologie",
  0 eyebrow restant dans `.method-steps`) et capture d'écran à plusieurs
  points du fondu + à l'état survolé d'un panneau, desktop et mobile.
  Regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Page Contact — CTA "Une question avant d'envoyer ?" retiré, FAQ
  remontée directement sous le formulaire, quart de cercle décoratif
  retiré (2026-09-02)** (`contact.html`, `assets/css/style.css`) : trois
  demandes de la cliente sur la section `.contact-devis`
  ("Deux minutes suffisent" + formulaire) et la FAQ juste en dessous.
  **CTA retiré** : le lien `.contact-scroll-cta` ("Une question avant
  d'envoyer&nbsp;?" + flèche rebondissante, ancré vers `#faq`) est
  supprimé du HTML, avec ses règles CSS (`.contact-scroll-cta*`,
  `@keyframes contact-scroll-bounce`) — plus aucune autre page ne pointait
  vers `#faq` (vérifié par grep), donc aucun lien interne cassé ; l'`id="faq"`
  reste sur la section elle-même, sans effet si rien ne le référence.
  **FAQ remontée sous le formulaire** : conséquence directe du retrait
  ci-dessus — `.contact-scroll-cta` portait `margin: var(--space-5) auto 0`
  (un espace au-dessus, aucun en dessous), donc le retirer suffit à faire
  suivre `.contact-faq` immédiatement après la fin du formulaire, sans
  autre changement de padding/marge nécessaire (vérifié par script
  Playwright : écart mesuré entre le bas de `.contact-devis` et le haut
  de `.contact-faq` = 0px, desktop et mobile).
  **Quart de cercle décoratif retiré** : `.contact-devis::before` (un
  cercle complet de 22rem, `border-radius:50%`, positionné en haut à
  gauche à cheval sur le bord de la section via `left:-9rem; top:-8rem` —
  `overflow:hidden` sur `.contact-devis` n'en laissait apparaître qu'un
  quart, juste au-dessus de l'eyebrow "Deux minutes suffisent") est
  supprimé. Si `.contact-scroll-cta` ou `.contact-devis::before`
  réapparaissent dans un diff, ce sont ces éléments retirés, à ne pas
  réintroduire sans qu'on le redemande.
  Vérifié par script Playwright (`.contact-scroll-cta` confirmé absent du
  DOM, `.contact-devis::before` confirmé `content:none`, écart
  formulaire→FAQ mesuré à 0px, accordéon FAQ revérifié fonctionnel au
  clic) et capture d'écran du haut de `.contact-devis` et de la jonction
  formulaire/FAQ, desktop et mobile. Regression complète 5 pages ×
  2 viewports : 0 débordement, 0 erreur console.
- **Effet de fond au scroll de "Notre méthodologie" — couleur de départ
  corrigée en bleu marine, comme les autres sections (2026-09-02)**
  (`.method-cta`, `main.js`/`style.css`) : demande explicite de la
  cliente ("fait comme les autres, en passant du bleu marine jusqu'à la
  couleur originale"). Le fromRgb de `initScrollFade()` pour
  `.method-cta` passait `[43, 16, 16]` (`#2b1010`, la teinte réellement
  visible en bas du dégradé interne du parcours des 5 sens juste
  au-dessus, épinglé — même logique déjà appliquée à `.founder`) — la
  cliente veut ici la même paire de couleurs que `.teaser` juste en
  dessous dans la page, sans dérivation depuis la section précédente :
  `[28, 59, 74]` (`--navy`) → `[246, 241, 231]` (`--bg`), valeur
  identique au caractère près à l'appel `.teaser`. Si `[43, 16, 16]`
  réapparaît sur cet appel, c'est ce réglage précédent, à ne pas
  réintroduire sans qu'on le redemande. Commentaires associés dans
  `main.js` et `style.css` mis à jour en conséquence.
  Vérifié par script Playwright (balayage de scroll confirmant la couleur
  interpolée entre `rgb(28,59,74)` et `rgb(246,241,231)` à 6 points de
  progression, `data-tone` cohérent) et capture d'écran en mi-fondu.
  Regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console.
- **Méthodologie — cartes en glissement depuis la droite, note de clôture
  retirée (2026-09-02)** (`.method-steps-list`, `index.html`, `style.css`)
  : deux demandes de la cliente sur les 3 cases "Notre méthodologie".
  **Entrée en glissement depuis la droite** : remplace l'entrée en cascade
  de la 1ʳᵉ passe (fondu + montée `translateY(36px)` + léger zoom
  `scale(0.96)`) par un fondu + glissement horizontal
  (`translateX(6rem)→0`) — demande explicite ("un effet de glissement
  provenant de la droite et qui s'arrête dans le même positionnement que
  là actuellement"). Le point de repos (position finale, `translateX(0)`)
  est strictement identique à avant : le décalage horizontal en escalier
  des cartes 2 et 3 (`margin-left`, mise en page) est un mécanisme
  entièrement distinct de cette animation d'entrée, non touché. **Durée
  allongée à 1,2s** (au lieu de `var(--dur-slow)`, 900ms — déjà le palier
  "lent" du site) : demande explicite ("pas trop rapide pour que lorsqu'on
  scroll, on puisse le voir") — un reveal `[data-reveal-group]` se
  déclenche une seule fois au passage du seuil de l'IntersectionObserver
  (15% visible), donc une transition trop courte peut se terminer avant
  d'être remarquée sur un scroll rapide ; le décalage entre cartes
  (`transition-delay`, cascade) est aussi allongé en proportion (0/180/
  360ms, contre 0/140/280ms avant). Vérifié par script Playwright : les 3
  cartes démarrent bien à `translateX(96px)` (6rem) au déclenchement du
  reveal, progressent à des rythmes différents (carte 1 en tête, carte 3
  encore à son point de départ à 300ms grâce au délai), toutes à
  `translateX(0)` en fin de transition ; `prefers-reduced-motion:reduce`
  confirmé neutralisant l'effet (transform à `none` immédiatement, comme
  la règle déjà en place). Si `translateY(36px) scale(0.96)` réapparaît
  sur cette règle, c'est la 1ʳᵉ passe, à ne pas réintroduire sans qu'on le
  redemande.
  **Note de clôture retirée** : `<p class="method-steps-note">Un
  accompagnement de bout en bout, du premier échange à la remise des
  clés.</p>`, sous la liste des 3 cartes, est supprimée — demande
  explicite ("enlève '...' et la ligne juste au dessus"), où "la ligne"
  désignait le `border-top` qui servait de séparateur visuel juste
  au-dessus de ce texte (pas une 2ᵉ ligne de texte séparée) : les deux
  disparaissent ensemble avec le retrait de l'élément, sans action
  distincte nécessaire. `.method-steps-note` (CSS) et `.bg-adaptive-note`
  (son override de couleur en phase sombre du fondu de fond, devenu
  orphelin) sont retirés de `style.css`. Si `.method-steps-note` ou
  `.bg-adaptive-note` réapparaissent, c'est cet ancien texte de clôture, à
  ne pas réintroduire sans qu'on le redemande.
  Vérifié par capture d'écran (desktop en cours de transition et à l'état
  final, mobile) et regression complète 5 pages × 2 viewports : 0
  débordement, 0 erreur console.
  **Ralentie une 2ᵉ fois, même jour** ("encore plus lent l'animation") :
  durée `1,2s` → `2,2s`, décalage entre cartes `180ms/360ms` → `320ms/640ms`
  (même proportion conservée). Vérifié par script Playwright (balayage à
  600ms/1800ms/3000ms confirmant une progression bien plus lente et un
  retour à `translateX(0)` sur les 3 cartes en fin de transition) et
  regression complète 5 pages × 2 viewports : 0 débordement, 0 erreur
  console. Si `1.2s`/`180ms`/`360ms` réapparaissent, c'est le réglage
  d'avant ce ralentissement, à ne pas réintroduire sans qu'on le
  redemande.
- **Bandeau chiffres clés — "100% B2B" et "Alsace" interverties
  (2026-09-02)** (`.stats-band-grid`, `index.html`) : demande explicite de
  la cliente. Simple échange de position des deux `<div>` dans le HTML —
  nouvel ordre "5 sens" / "4" / "100% B2B" / "Alsace" (au lieu de "5 sens"
  / "4" / "Alsace" / "100% B2B"). Aucun changement CSS/JS nécessaire :
  `.stats-band-grid > div:not(:first-child)::before` (séparateurs entre
  colonnes) et le compteur animé (`data-count`, sur la 2ᵉ colonne
  "4") ne dépendent pas de l'ordre des colonnes suivantes ; `.is-b2b`
  (classe restée sur le `<div>` "100% B2B" depuis le retrait de son
  ancien style badge, cf. plus haut dans ce fichier) n'a de toute façon
  plus aucun effet CSS. Vérifié par script Playwright (ordre des `dt`
  confirmé dans le DOM, compteur "4" toujours fonctionnel après scroll)
  et capture d'écran desktop. Regression complète 5 pages × 2 viewports :
  0 débordement, 0 erreur console.
- **Menu plein écran — essai fond Blanc Calcaire (2026-09-02)**
  (`.mobile-menu`, `style.css`, les 5 pages) : demande explicite de la
  cliente ("essaye de mettre le menu en blanc calcaire en adaptant les
  couleurs") — un essai, pas un remplacement discret des styles de base.
  `.mobile-menu { background: var(--navy-900) }` → `var(--bg)`. Chaque
  élément pensé pour un fond sombre est adapté à son équivalent pour fond
  clair :
  - `.mobile-menu-close` : bordure `var(--border-inverse)` → `var(--border)`,
    icône `var(--cream)` → `var(--ink)`, fond au survol
    `rgba(246,241,231,0.1)` → `rgba(28,59,74,0.08)`.
  - `.mobile-menu-links .label` : `var(--cream)` → `var(--ink)` ; couleur
    au survol/focus `var(--terracotta-300)` (variante claire, pensée pour
    ressortir sur fond sombre) → `var(--accent)` (terracotta plein, plus
    de contraste sur blanc) — même choix de contraste déjà établi
    ailleurs sur le site pour du texte sur fond clair.
  - `.mobile-menu-footer` : bordure `var(--border-inverse)` → `var(--border)`.
  - `.mobile-menu-info` (labels "Contact"/"Basée en" + email + "Alsace,
    France") : `var(--fg-muted-inverse)` → `var(--fg-muted)`, survol
    `var(--cream)` → `var(--ink)`.
  - `.mobile-menu-info .eyebrow` : la classe `on-dark` (qui forçait
    `var(--terracotta-300)`) est retirée du HTML des 5 pages sur ces 2
    spans précis (uniquement ceux dans `.mobile-menu-info` — les autres
    usages de `eyebrow on-dark` ailleurs sur chaque page, eux, restent sur
    fond sombre et ne sont pas touchés) : l'eyebrow hérite alors du
    `.eyebrow` générique (`var(--accent)`, terracotta plein), déjà adapté
    à un fond clair.
  - Icônes Instagram/LinkedIn du pied de menu : `.nav-social` est une
    classe générique partagée avec le header (toujours sur fond sombre,
    non concerné par cet essai) — variante claire ajoutée en scopé
    (`.mobile-menu-social .nav-social`, `var(--fg-muted)` / survol
    `var(--accent)` + fond `rgba(28,59,74,0.06)`) plutôt que de toucher la
    règle de base, qui reste inchangée pour le header.
  Vérifié par script Playwright (0 débordement/erreur console desktop +
  mobile sur les 5 pages, header confirmé resté sur fond sombre
  — `rgba(16,31,39,0.6)`, inchangé —, survol d'un lien confirmé en
  terracotta, navigation clavier Tab toujours fonctionnelle) et capture
  d'écran desktop (état normal + survol) et mobile. Regression complète
  5 pages × 2 viewports : 0 débordement, 0 erreur console. Si
  `background: var(--navy-900)` réapparaît sur `.mobile-menu`, ou si
  `.mobile-menu-info .eyebrow` retrouve la classe `on-dark`, c'est un
  retour à l'ancien fond sombre, à ne pas réintroduire sans qu'on le
  redemande.
- **Menu — survol en terracotta + bleu Méditerranéen (2026-09-02, même
  jour)** (`.mobile-menu-close`, `.mobile-menu-social .nav-social`,
  `.mobile-menu-info a`, `style.css`) : demande explicite de la cliente,
  juste après le passage du menu en Blanc Calcaire ci-dessus ("met en
  terracotta et bleu méditerranéen quand on passe dessus"). Duo de
  couleurs appliqué de façon cohérente sur tous les éléments interactifs
  du pied de menu : les boutons ronds (fermeture, icônes Instagram/
  LinkedIn) remplissent leur cercle de `var(--navy)` plein (au lieu d'une
  teinte translucide, 8%/6% selon l'élément) pendant que leur icône passe
  en `var(--accent)` (terracotta) ; le lien email suit la même logique
  côté texte (`var(--ink)` → `var(--accent)` au survol, au lieu de rester
  simplement plus foncé). Les 5 liens de navigation gardaient déjà un
  survol terracotta (`var(--accent)`, posé lors du passage en Blanc
  Calcaire) — non modifiés ici, cohérents avec ce nouveau duo sans
  changement supplémentaire. `color` ajouté à la liste `transition` de
  `.mobile-menu-close` (absente jusqu'ici, seuls `background`/`transform`
  étaient animés) pour que le changement de couleur de l'icône reste
  progressif comme le reste. Vérifié par script Playwright
  (`getComputedStyle` sur les 3 éléments au survol : fond `rgb(28,59,74)`
  et texte/icône `rgb(193,98,45)` sur les boutons ronds, texte
  `rgb(193,98,45)` sur le lien email) et capture d'écran de chaque état de
  survol. Regression complète 5 pages × 2 viewports : 0 débordement, 0
  erreur console.
- **Menu — répartition terracotta/bleu Méditerranéen étendue à tout le
  pied de menu, nouvelle catégorie "Réseaux sociaux" (2026-09-02, même
  jour)** (`.mobile-menu*`, les 5 pages, `style.css`) : demande explicite
  de la cliente ("met 'contact', 'basée en' et rajoute une catégorie
  'réseaux sociaux' ainsi que les titres des pages en terracotta et le
  reste en bleu méditerranéen").
  **"Contact"/"Basée en" étaient déjà en terracotta** (`.mobile-menu-info
  .eyebrow` hérite de `.eyebrow` générique, `var(--accent)`, depuis le
  passage du menu en Blanc Calcaire) — aucun changement nécessaire de ce
  côté, seulement vérifié.
  **Nouvelle catégorie "Réseaux sociaux"** : un `<span class="eyebrow">
  Réseaux sociaux</span>` est ajouté devant les icônes Instagram/LinkedIn
  dans `.mobile-menu-social`, sur les 5 pages (markup dupliqué, cf.
  convention du site). Le sélecteur Oswald compact partagé avec "Contact"/
  "Basée en" (`.mobile-menu-info .eyebrow`) est étendu à
  `.mobile-menu-social .eyebrow` pour que ce nouveau libellé reprenne le
  même style discret plutôt que le très grand `.eyebrow` générique du
  site (pensé pour un titre de section) — `align-items:center` ajouté à
  `.mobile-menu-social` pour aligner ce texte avec les cercles d'icônes
  34px sur la même ligne.
  **"Les titres des pages" (les 5 liens Accueil/Prestations/Projets/À
  propos/Contact) passent en terracotta au repos** :
  `.mobile-menu-links .label` — `var(--ink)` → `var(--accent)`. Le survol,
  qui basculait jusqu'ici vers ce même terracotta (devenu invisible
  puisque déjà la couleur de repos), passe à l'inverse en `var(--navy)` —
  un vrai changement de couleur reste ainsi perceptible au survol,
  cohérent avec "le reste en bleu méditerranéen".
  **"Le reste" passé en bleu Méditerranéen** : email + "Alsace, France"
  (`.mobile-menu-info a`/`span:last-child`, `var(--fg-muted)` →
  `var(--navy)`), icônes Instagram/LinkedIn au repos
  (`.mobile-menu-social .nav-social`, `var(--fg-muted)` → `var(--navy)`),
  bouton de fermeture au repos (`.mobile-menu-close`, `var(--ink)` →
  `var(--navy)`). Les survols déjà établis au tour précédent (email en
  terracotta, icônes/fermeture en icône terracotta sur fond navy plein)
  restent inchangés — cohérents avec ce nouveau partage : ces éléments
  "de repos bleu Méditerranéen" affichent tous un survol terracotta,
  symétrique à celui des liens de navigation (repos terracotta → survol
  bleu Méditerranéen).
  Vérifié par script Playwright (`getComputedStyle` sur les 8 éléments
  concernés : les 5 libellés + les 3 eyebrows du pied de menu confirmés
  en `rgb(193,98,45)` (terracotta), email/"Alsace, France"/icônes/bouton
  de fermeture confirmés en `rgb(28,59,74)` (bleu Méditerranéen), survol
  d'un lien confirmé bien passé au bleu Méditerranéen) et capture d'écran
  desktop (état normal + survol) et mobile (le nouveau libellé "Réseaux
  sociaux" se réaligne proprement au-dessus des icônes sur la largeur
  mobile, sans débordement). Regression complète 5 pages × 2 viewports :
  0 débordement, 0 erreur console.

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

🗑️ **Page Univers retirée, contenu redistribué (2026-08-18)** :
contrairement à Réalisations ci-dessus, `univers.html` n'a pas été
supprimée avec son contenu — la cliente a explicitement demandé de
déplacer chaque section vers une autre page avant de supprimer le fichier,
dans cet ordre précis (voir aussi les 3 bullets dédiés plus haut pour le
détail technique de chaque déplacement) :
1. **Promesse** (`.promise`, la citation "Suspendre le quotidien..." en
   typographie poster décalée sur `amalfi-coast-sunset.jpg`) — le même
   traitement est réappliqué sur `index.html` à la section "Notre
   promesse" (ex-`.manifesto`, un simple blockquote sur fond uni), avec un
   nouveau mécanisme `data-scale` sur `#promiseQuote` pour piloter une
   taille réduite (`0.75` ici) sans dupliquer `fitPromiseLines()`
   (`main.js`) — voir bullet dédié. **`.manifesto`/`.manifesto-eyebrow`/
   `.manifesto-cta` sont supprimées de `style.css`** (plus aucun usage) ;
   si elles réapparaissent dans un diff, c'est l'ancien bloc, à ne pas
   réintroduire sans qu'on le redemande.
2. **5 sens** (`#sensesJourney`, le chemin SVG scroll-dessiné) — déplacé
   tel quel sur `index.html`, juste après la nouvelle section Promesse.
   Aucun changement de markup/JS : le mécanisme (`main.js`) est déjà
   indifférent à la page qui l'héberge, il cherche l'élément par id.
3. **Le mot de la fondatrice** (`.founder-minimal`, citation minimaliste
   sur fond crème) — déplacé sur `engagements.html` (À propos), en tout
   dernier dans `<main>` (après la section Valeurs), pour préserver
   l'alternance de fonds crème/navy déjà en place sur cette page (crème →
   navy → crème-dim → navy → **crème**) — l'insérer ailleurs (ex. juste
   après le bandeau titre, crème lui aussi) aurait cassé cette alternance.
   Aucun changement de contenu ni de style, copié tel quel.
Une fois ces trois déplacements faits et vérifiés (regression complète),
`univers.html` a été supprimée, ainsi que tous les liens y menant : l'entrée
"L'Univers" du menu mobile et du footer sur les 5 pages restantes, et le
CTA du hero d'`index.html` ("Entrer dans l'univers"), repointé de
`href="univers.html"` vers `href="#sensesJourney"` (ancre vers la nouvelle
section sur la même page — le texte du lien n'a pas été changé, il reste
cohérent avec cette nouvelle destination). Vérifié par script Playwright
listant tous les `href` internes des 5 pages restantes × 2 viewports :
aucun ne pointe vers `univers.html`, aucune requête 404, 0 débordement,
0 erreur console. Si `univers.html` ou un lien `href="univers.html"`
réapparaît dans un diff, c'est cette ancienne page, à ne pas réintroduire
sans qu'on le redemande.

## Limites connues / à traiter avec la cliente

- **Vidéo de la section Fondatrice, en pause, pas supprimée**
  (`assets/video/founder-story.mp4`/`.webm`) : la cliente n'a jamais réussi
  à voir la vidéo se lancer dans son contexte de visionnage et a demandé de
  revenir à une citation typographique minimaliste pour l'instant, "en
  gardant l'idée en tête" — la section active d'`engagements.html`
  n'utilise donc plus ces fichiers, mais ils restent dans le dépôt (citation
  déjà composée dans les pixels de la carte, prêts à être réactivés). Si
  cette piste est reprise plus tard : (1) filigrane "PixVerse.ai" visible en
  haut à droite sur toute la durée — à faire retirer via un export sans
  filigrane (compte PixVerse de la cliente) ou un prestataire de retouche
  vidéo, aucun outil d'inpainting disponible dans cet environnement pour
  l'effacer proprement ; (2) la scène est entièrement générée par IA
  (personnes, lieu, évènement fictifs), à la différence de toutes les
  autres photos du site qui sont 100% réelles — voir
  `assets/video/README.md` pour le détail complet.
- **Police Canter** non disponible → substituée par Oswald (cf. ci-dessus).
- **Mosaïque Projets & page Talents (Engagements)** : conçues pour
  correspondre à l'esprit du site double2.fr, mais sans accès réseau à
  double2.fr dans cet environnement pour un calage pixel-exact — à affiner
  si des captures d'écran de leurs pages sont fournies.
- **Photos d'équipe** (`engagements.html`, section `.talent-stage`) :
  utilise actuellement `talent-placeholder-3.jpg`/`-4.jpg`, deux photos de
  banque (cf. bullet dédié plus haut et `CREDITS.md`) — en attente des
  vraies photos et du nom/rôle/bio de la 2ᵉ personne (voir commentaire
  `TODO` dans le fichier).
- **Liens réseaux sociaux** (`#` dans le header) : placeholders `TODO` à
  remplacer, présents dans les 6 pages.
- **Coordonnées du bandeau Contact** (`.contact-band`, `contact.html`) :
  email, téléphone et comptes réseaux sociaux affichés sont **provisoires/
  fictifs** (`contact@simposio.fr`, `03 88 00 00 00`, `@simposio.events` /
  `Simposio`), demandés tels quels par la cliente pour prévisualiser le
  rendu visuel — à remplacer par les vraies coordonnées avant mise en ligne
  (voir commentaire `TODO` dans le HTML, juste au-dessus de
  `.contact-band-methods`).
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
