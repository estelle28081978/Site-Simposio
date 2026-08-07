# Polices du site Simposio

Système typographique de la charte graphique : **Titre** / **Sous-titre** / **Corps de texte**.

| Rôle | Police prévue (charte) | Police utilisée sur le site | Statut |
|---|---|---|---|
| Titre | Yeseva One | Yeseva One | ✅ Police exacte (Google Fonts) |
| Corps de texte | Glacial Indifference | Glacial Indifference | ✅ Police exacte (auto-hébergée ici, `glacial-indifference/`) |
| Sous-titre | Canter | Oswald (temporaire) | ⚠️ Substitut — voir ci-dessous |

## Glacial Indifference

Fichiers auto-hébergés dans `glacial-indifference/`, sous licence **SIL Open
Font License 1.1** (texte complet dans `glacial-indifference/LICENSE.txt`) —
libre d'usage commercial, embarquement web autorisé. Récupérée depuis le
paquet npm open-source `typeface-glacial-indifference`.

## Canter — non intégrée pour le moment

Impossible de récupérer les fichiers de la police **Canter** dans cet
environnement : les sites qui la distribuent (fontfabric.com, fontsquirrel.com,
etc.) sont bloqués par la politique réseau de la session, et elle n'existe pas
en paquet npm ni sur Google Fonts. En attendant, **Oswald** (Google Fonts,
gratuite) est utilisée comme remplacement temporaire pour tous les éléments
"sous-titre" (libellés en petites capitales espacées : "DOLCE VITA", titres de
section, badges).

**Pour utiliser la vraie police Canter :** envoyez les fichiers `.otf`/`.ttf`
(vous les avez probablement déjà, puisqu'ils ont servi à la charte graphique)
et remplacez les fichiers ici + le premier `@font-face` du haut de
`assets/css/style.css` — ou demandez-le, et ce sera fait dès réception.
