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
- **7 pages** : `index.html` (accueil), `univers.html`, `prestations.html`,
  `realisations.html` (immersion 3D), `projets.html` (mosaïque galerie),
  `engagements.html` (+ équipe), `contact.html`.
- **CSS** : un seul fichier `assets/css/style.css` (~1400 lignes), design
  tokens en variables `:root` (couleurs, espacements, rayons, durées). Pas de
  préprocesseur.
- **JS** : `assets/js/main.js` (vanilla, IIFE unique, pas de dépendances) pour
  tous les comportements interactifs communs. `assets/js/configurator.js` +
  `assets/js/event-scene.js` pour la scène 3D (lazy-loadée).
- **3D** : Three.js self-hosté dans `assets/js/vendor/three/`, chargé via
  `importmap` (spécificateur bare `"three"`). Modèles véhicules dans
  `assets/models/*.glb` (Fiat 500, Vespa, triporteur), stands construits
  procéduralement en JS (canvas textures pour guirlandes, franges, enseigne).
- **Photos** : toutes sourcées sur Wikimedia Commons (licences CC0/CC BY/CC
  BY-SA), redimensionnées/compressées en JPEG. Attribution complète dans
  `assets/img/CREDITS.md` et en pied de page de chaque page concernée.
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
  IntersectionObserver.
- Citation "Suspendre le quotidien..." (page Univers) : la coloration
  progressive des mots est synchronisée sur la position de l'élément
  lui-même par rapport au **milieu du viewport** (pas sur le scroll de toute
  la section) — voir `updatePromise()`.
- 5 sens (page Univers) : mini-jeu cliquable (pas un simple scroll-sync) avec
  suivi de progression et micro-interactions (rebond d'icône, ondulation).
- Cartes à retourner (page Engagements) : flip 3D CSS déclenché au clic/tap
  et au clavier (`[data-flip]`).
- Mosaïque (page Projets) : CSS Grid avec `grid-auto-flow: dense` pour éviter
  tout trou d'affichage — ne jamais réintroduire de `transform: translateY`
  décoratif sur les items, ça casse l'alignement de la grille (bug corrigé).
- Formulaire de contact : validation + construction du `mailto:` dans
  `buildMailto()`/`validate()`. Les champs sont repérés par leur `id`/`name`
  (`fullName`, `company`, `email`, `phone`, `serviceType`, `guests`,
  `eventDate`, `message`) — à conserver si le formulaire est retouché.

## État d'avancement

Le cahier des charges a été appliqué **intégralement, sauf un point explicitement mis de côté par la cliente** :

✅ Fait : charte graphique (esprit Havas Events — en-têtes asymétriques,
formes décoratives, contraste gras/normal — appliqué sur 6 pages), hero
accueil (diaporama photo, CTA refondu), page Univers (animation resynchronisée,
5 sens gamifiés), menu nettoyé, page Prestations réécrite avec nouvelles
photos, mosaïque Projets corrigée, page Engagements gamifiée avec
emplacements photo pour l'équipe, formulaire de contact redesigné.

⏸️ **En attente (mis de côté à la demande de la cliente)** : refonte complète
de la scène 3D des stands-véhicules pour coller fidèlement aux photos de
référence Brindapino — nécessite que ces photos soient repartagées, elles ne
sont plus disponibles dans l'environnement de session actuel.

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
- **Liens réseaux sociaux** (`#` dans le header) et **crédits Sketchfab des
  modèles 3D** : placeholders `TODO` à remplacer, présents dans les 7 pages.
- **Grilles tarifaires** du document de marque : volontairement exclues du
  site public (info confidentielle, usage interne uniquement).

## Commandes utiles

```bash
# Servir le site en local
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/
```

Aucune commande de build, lint ou test — c'est un site statique pur.
