# Polices du site Simposio

Système typographique de la charte graphique : **Titre** / **Sous-titre** / **Corps de texte**.

Toutes les polices sont **auto-hébergées** (aucune requête vers Google Fonts
ou un autre CDN au chargement du site — plus rapide, plus fiable, aucune
dépendance externe).

| Rôle | Police prévue (charte) | Police utilisée sur le site | Statut |
|---|---|---|---|
| Titre | Yeseva One | Yeseva One | ✅ Police exacte (Google Fonts, auto-hébergée dans `yeseva-one/`) |
| Corps de texte | Glacial Indifference | Glacial Indifference | ✅ Police exacte (auto-hébergée dans `glacial-indifference/`) |
| Sous-titre (nav, labels, footer...) | Canter | Oswald (auto-hébergée dans `oswald/`) | ⚠️ Substitut — voir ci-dessous |
| Eyebrow (baseline avant un titre) | Canter | Canter (auto-hébergée dans `canter/`) | ✅ Police exacte, intégrée le 2026-08-13 |

Yeseva One et Oswald viennent de Google Fonts, sous licence **SIL Open Font
License 1.1** (même licence libre que Glacial Indifference).

## Glacial Indifference

Fichiers auto-hébergés dans `glacial-indifference/`, sous licence **SIL Open
Font License 1.1** (texte complet dans `glacial-indifference/LICENSE.txt`) —
libre d'usage commercial, embarquement web autorisé. Récupérée depuis le
paquet npm open-source `typeface-glacial-indifference`.

## Canter

Fichiers reçus directement de la cliente le 2026-08-13 (`Canter_Light.otf`,
`Canter_Bold.otf` — elle possède déjà la licence, utilisée pour la charte
graphique de la marque), convertis en `.woff2`/`.woff` avec `fontTools` et
auto-hébergés dans `canter/`. Pas de `LICENSE.txt` ici : contrairement à
Yeseva One/Oswald/Glacial Indifference (polices libres SIL OFL), Canter est
une police commerciale — c'est la licence de la cliente qui couvre son usage
sur ce site, pas une licence libre redistribuable.

**Volontairement pas branchée sur `--font-subtitle`** (qui reste Oswald pour
la nav, les form labels, le footer, etc.). Canter est réservée exclusivement
au rôle `.eyebrow` — la petite baseline avant un titre ("Notre promesse",
"Nos prestations", "Questions fréquentes"...) — via `--font-accent` dans
`style.css`. Ce choix a évolué : essayée d'abord en touches ponctuelles
éparpillées (une par page, sur des éléments différents — citation,
signature, tagline...), la cliente a explicitement demandé de tout retirer
et de la réserver uniquement aux eyebrows. Ne pas réintroduire l'ancienne
approche (touches isolées ailleurs que `.eyebrow`) sans qu'on le redemande.

Le nom de la police enregistrée en `@font-face` est **"Canter Accent"**, pas
"Canter" : `--font-subtitle` listait déjà "Canter" en premier choix de
secours depuis le début du projet, donc l'enregistrer sous ce nom exact
aurait fait basculer silencieusement tout le sous-titrage du site d'Oswald
vers Canter dès le chargement de la police — piège réel évité en
choisissant un nom de famille distinct.

`.eyebrow` n'est plus en majuscules (`text-transform: uppercase` retiré) :
les bas-de-casse de Canter sont dessinées en petites capitales élégantes,
qui font tout le charme de la police — les majuscules aplatissent cet
effet. Le texte HTML des eyebrows était déjà écrit en casse normale, donc
ce retrait n'a demandé aucun changement de contenu, juste de CSS.
