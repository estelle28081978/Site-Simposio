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
