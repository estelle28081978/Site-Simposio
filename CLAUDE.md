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
  la section) — voir `updatePromise()`.
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
- **Engagements — lignes au survol** (`#engagementHoverCard`,
  `.engagement-line`) : liste de lignes ; au survol (ou tap sur mobile via
  `matchMedia("(hover: none)")`), une carte de description suit le curseur
  (`positionEngagementCard()`/`scheduleEngagementMove()`, throttlée par
  `requestAnimationFrame`). Il n'y a plus de flip-card (`[data-flip]`
  n'existe plus dans le code) — ne pas réintroduire ce pattern sans
  qu'on le redemande explicitement. Chaque ligne affiche en permanence un
  petit indicateur `.engagement-line-discover` (« + Découvrir ») en bas à
  droite — affordance visible en plus de la carte au survol, demandée
  explicitement ; le `+` se remplit en terracotta au survol/actif comme le
  reste de la ligne.
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
- **Page "Engagements" renommée "À propos" (2026-08-13)** : demande
  explicite de la cliente suite à l'ajout de la section Valeurs, qui donne à
  cette page un vrai profil "à propos" (engagements + valeurs + équipe). Le
  fichier reste `engagements.html` (aucun lien interne cassé) — seul le
  libellé visible change : l'eyebrow en haut de page, le `<title>`, et le
  lien de navigation dans le header/menu mobile/footer sur **les 6 pages**
  (balisage dupliqué, cf. note en tête de fichier). Si `>Engagements<`
  réapparaît comme libellé de nav dans un diff, c'est l'ancien nom à ne pas
  réintroduire sans qu'on le redemande.
- **Titre Engagements — abandon du forçage à 3 lignes (2026-08-13)** : une
  précédente itération forçait « Un partenaire, pas un prestataire de plus »
  sur exactement 3 lignes via 2 `<br>` manuels + une classe dédiée
  `.title-force-3-lines` (clamp plus petit et plafonné, sans `max-width`) —
  **remplacé** à la demande explicite de la cliente, qui veut désormais que
  ce titre ait « les mêmes tailles de police que la première partie de la
  page Univers » (eyebrow "L'Univers Simposio" / h1 "Le sens du nom,
  l'esprit de la maison"). Le `<h1>` d'`engagements.html` utilise donc
  maintenant uniquement `title-slide` (comme celui d'`univers.html`),
  **sans** `.title-force-3-lines`, **sans** les `<br>` manuels — juste
  « Un partenaire, pas un prestataire de plus » en texte continu, wrappé
  naturellement par le `clamp()` standard des `h1` (`3.4rem` → `8.8rem`) +
  `max-width: 46rem` de `.page-header h1`, exactement comme `univers.html`.
  **Vérifié avant d'appliquer** : à taille standard, ce titre wrappe sur 4-5
  lignes selon la largeur d'écran (contre 3-4 lignes pour le titre
  d'`univers.html`, texte différent) — **c'est le même ordre de grandeur et
  le même comportement que le titre d'`univers.html` déjà en prod** (testé
  côte à côte via Playwright aux mêmes largeurs, 320px à 2560px), donc
  cohérent avec l'attente de la cliente plutôt qu'un bug. `.page-header-full`
  utilise `min-height` (pas `max-height`), la section grandit simplement
  au-delà d'un écran si le titre est long — comportement déjà accepté sur
  univers.html. La classe CSS `.title-force-3-lines` (règle
  `.page-header h1.title-force-3-lines`, dans `style.css`) reste présente
  mais n'est plus appliquée nulle part : ne pas la reproposer pour ce titre
  sans qu'on le redemande ; elle reste disponible si un autre titre a un
  jour besoin d'un nombre de lignes strictement forcé (calée empiriquement
  par balayage Playwright plutôt que par calcul de métriques de police —
  approche à réutiliser dans ce cas précis).
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
