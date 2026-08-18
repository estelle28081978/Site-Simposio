# Vidéo — section Fondatrice (`engagements.html`)

## `founder-story.mp4` / `founder-story.webm`

**Origine** : la cliente a fourni un clip de référence généré par intelligence
artificielle (PixVerse.ai — filigrane visible en haut à droite de l'image,
fichier original `PixVerse_V5.5_Modify_720P_Vidéo_cinématographique.mp4`,
720p, 24fps, ~5s, avec son). Ce n'est **ni une photo Simposio réelle, ni un
évènement qui a eu lieu** : la scène (cocktail au coucher du soleil, terrasse
avec vue sur des collines, personnes en tenue de soirée, stand-bar sur une
voiture vintage) est entièrement fabriquée par IA, à la demande explicite de
la cliente ("met une vidéo comme ça"). C'est un choix assumé de mise en scène
atmosphérique, pas une photo/vidéo documentaire — à la différence de toutes
les autres photos utilisées sur le site (100% réelles, cf.
`assets/img/CREDITS.md`).

**Citation intégrée aux pixels de la vidéo, pas en surimpression HTML**
(demande explicite de la cliente : "sur la carte du menu intègre la citation
comme s'il était déjà dans la vidéo") : le clip montre la caméra plonger vers
une petite carte/carnet posé sur le comptoir du bar, portant un texte factice
généré par l'IA (illisible, simple texture visuelle). Méthode :
1. Extraction des 121 frames du clip (OpenCV).
2. Repérage manuel des 4 coins de la carte (position réelle dans l'image) sur
   5 images-clés réparties sur la portion du clip où la carte est visible et
   suffisamment grande (frames 90 à 120), via une grille de pixels superposée
   pour un pointage précis — coordonnées interpolées linéairement entre
   images-clés pour les frames intermédiaires.
3. Une texture "carte" propre (fond crème chaud, ornement filet+losange
   terracotta, citation en Yeseva One italique légèrement inclinée en post-
   traitement, signature "Estelle Lorusso, fondatrice") est dessinée à part
   (Pillow), puis plaquée sur chaque frame par transformation de perspective
   (`cv2.getPerspectiveTransform` + `warpPerspective`) suivant exactement le
   mouvement de caméra — la carte "neuve" bouge et se déforme avec la vraie
   carte filmée, au pixel près, plutôt que d'être un texte statique
   superposé.
4. La carte se matérialise progressivement (fondu d'opacité de la frame 90 à
   104) plutôt que d'apparaître d'un coup, cohérent avec l'esthétique déjà
   demandée par la cliente sur les itérations précédentes de cette section.
5. Réencodage des 121 frames en vidéo (ffmpeg — binaire statique installé
   via le paquet Python `imageio-ffmpeg`, ffmpeg n'étant pas préinstallé dans
   cet environnement) : `founder-story.mp4` (H.264 + AAC, pour la
   compatibilité la plus large, notamment Safari) et `founder-story.webm`
   (VP9 + Opus, plus léger, listé en premier dans le HTML). Son d'ambiance
   d'origine conservé sur les deux exports mais la vidéo est **muette par
   défaut sur le site** (attribut `muted`, lecture automatique déclenchée en
   JS à l'entrée dans le viewport).

**Bug de warp corrigé** : un premier essai avec `borderMode:
cv2.BORDER_TRANSPARENT` laissait des pixels de mémoire non initialisée en
dehors de la zone de la carte (au lieu de zéro), provoquant des artefacts
fantômes (copies floues du filigrane visibles à plusieurs endroits de
l'image). Corrigé avec `borderMode: cv2.BORDER_CONSTANT, borderValue:
(0,0,0,0)`.

**Limite assumée, non résolue** : le filigrane "PixVerse.ai" (coin
supérieur droit, sur toute la durée du clip) n'a pas pu être retiré — aucun
outil d'inpainting/retouche vidéo disponible dans cet environnement pour
l'effacer proprement sans laisser de trace visible. **À remplacer avant mise
en ligne définitive** par un export sans filigrane si la cliente dispose d'un
compte PixVerse permettant de le générer, ou à faire retoucher par un
prestataire externe. Documenté aussi dans `CLAUDE.md` (« Limites connues »).

**Script de compositing** : écrit pour cette tâche ponctuelle, non commité
dans le dépôt (comme les autres scripts de traitement d'image ad hoc de ce
projet) — refaire le même repérage de coins si le clip source doit être
changé ou recadré.
