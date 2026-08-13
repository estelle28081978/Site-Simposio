# Polices du site Simposio

Système typographique de la charte graphique : **Titre** / **Sous-titre** / **Corps de texte**.

Toutes les polices sont **auto-hébergées** (aucune requête vers Google Fonts
ou un autre CDN au chargement du site — plus rapide, plus fiable, aucune
dépendance externe).

| Rôle | Police prévue (charte) | Police utilisée sur le site | Statut |
|---|---|---|---|
| Titre | Yeseva One | Yeseva One | ✅ Police exacte (Google Fonts, auto-hébergée dans `yeseva-one/`) |
| Corps de texte | Glacial Indifference | Glacial Indifference | ✅ Police exacte (auto-hébergée dans `glacial-indifference/`) |
| Sous-titre (usage systématique) | Canter | Oswald (auto-hébergée dans `oswald/`) | ⚠️ Substitut — voir ci-dessous |
| Touches premium ponctuelles | Canter | Canter (auto-hébergée dans `canter/`) | ✅ Police exacte, intégrée le 2026-08-13 |

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
tout l'usage systématique — eyebrows, labels, nav). Canter est réservée à
quelques **touches ponctuelles** par page via la classe utilitaire
`.font-accent` (`--font-accent` dans `style.css`) : une phrase de citation,
une signature, un nom propre — jamais un rôle structurel répété partout.
C'est un choix explicite de la cliente (« je ne veux pas que ça prenne une
importance principale, mais qu'on la remarque ») — ne pas étendre son usage
à `--font-subtitle` ou à d'autres éléments systématiques sans qu'on le
redemande. Le nom de la police enregistrée en `@font-face` est **"Canter
Accent"**, pas "Canter" : `--font-subtitle` listait déjà "Canter" en premier
choix de secours depuis le début du projet, donc l'enregistrer sous ce nom
exact aurait fait basculer silencieusement tout le sous-titrage du site
d'Oswald vers Canter dès le chargement de la police — piège réel évité en
choisissant un nom de famille distinct.

À utiliser en casse normale/mixte, pas en majuscules : les bas-de-casse de
Canter sont dessinées en petites capitales élégantes, qui font tout le charme
de la police — `text-transform: uppercase` aplatit cet effet.
