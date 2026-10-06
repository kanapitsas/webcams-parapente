# Webcams parapente

Dashboard des webcams et balises vent des sites de vol autour de Grenoble
(Chartreuse, Vercors, Belledonne, Trièves, Annecy & Bauges).

→ **https://webcams-parapente.vercel.app** (installable en web app : « Ajouter à l'écran d'accueil »)

- Grille de webcams par secteur, avec les balises vent superposées aux images
- Carte des webcams et des balises (direction et force du vent)
- Rafraîchissement automatique, mis en pause quand l'onglet est caché

## Fichiers

| Fichier | Rôle |
|---|---|
| `cams.js` | Liste des webcams (URL, position, balises affichées sur l'image) et des balises |
| `index.html` | La page : grille, carte Leaflet, rendu des balises |
| `api/wind.js` | Fonction Vercel `GET /api/wind` : lit les widgets [spotair](https://www.spotair.mobi) et renvoie les mesures en JSON (cache CDN 2 min) |
| `server.mjs` | Serveur de dev local (statique + `/api/wind`) |

## Développement

```bash
npm run dev    # http://localhost:8765
npm test
```

Pour ajouter une balise : l'ajouter à `BALISES` dans `cams.js` **et** à `BALISE_IDS`
dans `api/wind.js` (le test vérifie que les deux listes concordent).

## Sources

Les images appartiennent à leurs auteurs (Prévol, Air Alpin, Skaping, Chamrousse, Neos360,
Trinum, Windy, Grands Espaces…) et sont affichées depuis leurs serveurs. Mesures de vent :
FFVL et ROMMA via spotair. Fond de carte : © OpenStreetMap, OpenTopoMap.
