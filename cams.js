// Webcams et balises du dashboard (vérifiées le 2026-10-06).
//
// Webcam :
//   type    : "image" (URL directe d'un jpg rafraîchi), "iframe" (page intégrable), "link" (lien seul)
//   lat/lon : position sur la carte
//   refresh : secondes entre deux rechargements (type image)
//   wide    : la carte prend toute la largeur (automatique pour les panoramas)
//   winds   : balises superposées à l'image : 'ffvl/61' ou { id, x, y } avec x/y en % de l'image
//             (x = centre de la balise, y = son bord haut). Sans x/y : coins haut gauche, haut droit, haut centre.
//   ratio, bodyMargin : (type iframe) la page intégrée contient une image pleine largeur de ce
//             ratio, dans un <body> avec cette marge ; le cadre est dimensionné pour la contenir.
//
// Skaping : https://api.skaping.com/<clé>/media/latest/large.jpg redirige vers la dernière image
// (nouvelle image toutes les 10–30 min). La clé se trouve dans SkapingAPI.setConfig(...) de la page.
const SKAPING = key => `https://api.skaping.com/${key}/media/latest/large.jpg`;

// Balises vent (spotair). Toutes apparaissent sur la carte ; les données viennent de /api/wind.
const BALISES = {
  'ffvl/61':   { name: 'St-Hilaire du Touvet', lat: 45.3108, lon: 5.8900, alt: 963 },
  'romma/186': { name: 'St-Hilaire déco Nord', lat: 45.3066, lon: 5.8881, alt: 918 },
  'romma/289': { name: 'Lumbin (atterro)',     lat: 45.3094, lon: 5.9207, alt: 247 },
  'ffvl/13':   { name: 'La Scia',              lat: 45.3450, lon: 5.8450, alt: 1638 },
  'ffvl/3770': { name: 'Petit Som',            lat: 45.3866, lon: 5.8070, alt: 1721 },
  'ffvl/16':   { name: 'Grand Ratz',           lat: 45.3292, lon: 5.6358, alt: 800 },
  'ffvl/2111': { name: 'Atterro Chalais',      lat: 45.2735, lon: 5.6409, alt: 192 },
  'ffvl/187':  { name: 'Montaud',              lat: 45.2448, lon: 5.5749, alt: 1290 },
  'ffvl/15':   { name: 'Moucherotte',          lat: 45.1500, lon: 5.6370, alt: 1824 },
  'ffvl/3495': { name: 'Belvédère de Lans',    lat: 45.0894, lon: 5.5936, alt: 1343 },
  'ffvl/14':   { name: 'Villard Côte 2000',    lat: 45.0322, lon: 5.5670, alt: 1649 },
  'ffvl/54':   { name: 'Malleval',             lat: 45.1353, lon: 5.4053, alt: 1183 },
  'ffvl/144':  { name: 'Chamrousse',           lat: 45.1299, lon: 5.8837, alt: 1803 },
  'ffvl/12':   { name: 'Allevard ouest',       lat: 45.3934, lon: 6.1068, alt: 1409 },
  'ffvl/2170': { name: 'Allevard sud',         lat: 45.3923, lon: 6.1148, alt: 1550 },
  'ffvl/3997': { name: "Bourg-d'Oisans",       lat: 45.0628, lon: 6.0248, alt: 718 },
  'ffvl/146':  { name: 'Laffrey',              lat: 45.0366, lon: 5.7876, alt: 980 },
  'ffvl/62':   { name: 'Sénépy',               lat: 44.9071, lon: 5.7210, alt: 1759 },
  'ffvl/5017': { name: 'Revard',               lat: 45.6834, lon: 5.9754, alt: 1500 },
  'ffvl/67':   { name: 'Semnoz',               lat: 45.7970, lon: 6.1043, alt: 1697 },
  'ffvl/75':   { name: 'Montmin déco',         lat: 45.8139, lon: 6.2467, alt: 1276 },
  'ffvl/182':  { name: 'La Sambuy',            lat: 45.6985, lon: 6.2721, alt: 1827 },
};

const CAMS = [
  // --- Chartreuse ------------------------------------------------------------
  {
    // Page Prévol intégrée telle quelle : image + balises Déco Sud / Moquette / Lumbin superposées.
    // Image seule : https://prevol.com/prevolwebcam/upload/prevol3decoslive.jpg
    name: 'Saint-Hilaire · 3 décos (Prévol)',
    group: 'Chartreuse',
    alt: 1000, lat: 45.307, lon: 5.888,
    type: 'iframe',
    url: 'https://prevol.com/prevolwebcam/includes/webcam.php',
    thumb: 'https://prevol.com/prevolwebcam/upload/prevol3decoslive.jpg',
    page: 'https://www.prevol.com/webcam/',
    ratio: 1920 / 1080,
    bodyMargin: 8,
    wide: true,
  },
  {
    name: 'Saint-Hilaire · déco Est (Air Alpin)',
    group: 'Chartreuse',
    alt: 1000, lat: 45.305, lon: 5.887,
    type: 'image',
    url: 'https://air-alpin.com/api/webcam',
    page: 'https://air-alpin.com/webcam',
    refresh: 60,
    winds: [{ id: 'ffvl/61', x: 8, y: 11 }, { id: 'romma/289', x: 47, y: 46 }],
  },
  {
    name: 'Col de Marcieu',
    group: 'Chartreuse',
    alt: 1060, lat: 45.355, lon: 5.928,
    type: 'image',
    url: 'https://webcams.les7laux.com/col-de-marcieu/webcam1.jpg',
    page: 'https://col-marcieu.com/webcam/',
    refresh: 300,
  },
  {
    name: 'Col de Porte',
    group: 'Chartreuse',
    alt: 1326, lat: 45.293, lon: 5.770,
    type: 'image',
    url: SKAPING('btCBB-AuGfT-zvaXV-OOR2O'),
    page: 'https://www.skaping.com/col-de-porte/ski-alpin',
    refresh: 300,
    winds: ['ffvl/13', 'ffvl/3770'],
  },
  {
    name: 'Sappey-en-Chartreuse',
    group: 'Chartreuse',
    alt: 1000, lat: 45.262, lon: 5.776,
    type: 'image',
    url: SKAPING('iYXG8-sNNmk-JSTz7-TLPB6'),
    page: 'https://www.skaping.com/sappey-en-chartreuse',
    refresh: 300,
  },

  // --- Grenoble & Vercors -----------------------------------------------------
  {
    name: 'Grenoble · Bastille',
    group: 'Grenoble & Vercors',
    alt: 475, lat: 45.199, lon: 5.725,
    type: 'image',
    url: SKAPING('GdP46-rpcxB-2E6ZU-cGCg6'),
    page: 'https://www.skaping.com/grenoble/bastille',
    refresh: 300,
  },
  {
    name: 'Fontaine · vue Moucherotte / St-Nizier',
    group: 'Grenoble & Vercors',
    lat: 45.187, lon: 5.668,
    type: 'image',
    url: SKAPING('LDNJy-PVncu-yRLyk-tnTU7'),
    page: 'https://www.skaping.com/grenoble/les-vouillants',
    refresh: 300,
    winds: [{ id: 'ffvl/15', x: 85, y: 5 }],
  },
  {
    name: 'Lans-en-Vercors · Vertige des Cimes',
    group: 'Grenoble & Vercors',
    lat: 45.090, lon: 5.597,
    type: 'image',
    url: SKAPING('vEbrh-vc9qn-Zrsyn-tCVeC'),
    page: 'https://www.skaping.com/lans-en-vercors/vertige-des-cimes',
    refresh: 300,
    winds: ['ffvl/3495'],
  },
  {
    name: 'Lans-en-Vercors · Les Allières',
    group: 'Grenoble & Vercors',
    lat: 45.115, lon: 5.570,
    type: 'image',
    url: SKAPING('btWNC-Avfae-WLWjI-YfE4j'),
    page: 'https://www.skaping.com/lans-en-vercors/les-allieres',
    refresh: 300,
    winds: ['ffvl/3495'],
  },
  {
    name: 'Villard-de-Lans · Côte 2000',
    group: 'Grenoble & Vercors',
    alt: 1720, lat: 45.032, lon: 5.567,
    type: 'image',
    url: 'https://live.neos360.com/villard_de_lans/webcam/Altitude-2000.jpg',   // ~1,4 Mo
    page: 'https://www.villarddelans-correnconenvercors.com/live/webcams/',
    refresh: 300,
    winds: [{ id: 'ffvl/14', x: 60, y: 6 }],
  },

  // --- Belledonne -------------------------------------------------------------
  {
    name: 'Chamrousse 1800 · vue Grenoble / Vercors',
    group: 'Belledonne',
    alt: 1800, lat: 45.129, lon: 5.883,
    type: 'image',
    url: 'https://static.meteo-chamrousse.com/webcam/webcam-chamrousse.jpg',
    page: 'https://www.chamrousse.com/webcams.html',
    refresh: 300,
    winds: ['ffvl/144'],
  },
  {
    name: 'Chamrousse · La Croix',
    group: 'Belledonne',
    alt: 2250, lat: 45.111, lon: 5.888,
    type: 'image',
    url: SKAPING('bt72j-AvkWE-3i9rS-6n2Yp'),
    page: 'https://www.skaping.com/chamrousse/la-croix',
    refresh: 300,
    winds: ['ffvl/144'],
  },
  {
    name: 'Les 7 Laux · Pipay',
    group: 'Belledonne',
    lat: 45.27, lon: 6.04,
    type: 'image',
    url: SKAPING('Ct8sJ-7YfOn-cLRaV-WKoD9'),
    page: 'https://www.skaping.com/les7laux/pipay/grand-cerf',
    refresh: 300,
  },
  {
    name: "Collet d'Allevard · sommet",
    group: 'Belledonne',
    lat: 45.394, lon: 6.110,
    type: 'image',
    url: SKAPING('zil2x-qc86R-t4ihV-JyJW7'),
    page: 'https://www.skaping.com/collet-d-allevard/sommet',
    refresh: 300,
    winds: ['ffvl/12', 'ffvl/2170'],
  },

  // --- Trièves ----------------------------------------------------------------
  {
    name: 'Gresse-en-Vercors · Grand Veymont',
    group: 'Trièves',
    lat: 44.90, lon: 5.565,
    type: 'image',
    url: 'https://www.trinum.com/ibox/ftpcam/gresse-en-vercors_maison-du-grand-veymont.jpg',
    page: 'https://app.webcam-hd.com/gresse-en-vercors/grand-veymont',
    refresh: 300,
  },
  {
    name: 'Mens · vue Obiou / Courtet',
    group: 'Trièves',
    lat: 44.816, lon: 5.751,
    type: 'image',
    url: 'https://imgproxy.windy.com/_/full/plain/current/1433874838/original.jpg',
    page: 'https://www.windy.com/webcams/1433874838',
    refresh: 300,
    winds: [{ id: 'ffvl/62', x: 8, y: 6 }, { id: 'ffvl/146', x: 20, y: 6 }],
  },

  // --- Annecy & Bauges --------------------------------------------------------
  {
    name: 'Annecy · Planfait (dôme)',
    group: 'Annecy & Bauges',
    lat: 45.826, lon: 6.215,
    type: 'image',
    url: 'https://old.grandsespaces.com/webcams/DOME.jpg',
    page: 'https://grandsespaces.com/en/paragliding-school-annecy/planfait-webcams/',
    refresh: 300,
    winds: ['ffvl/75'],
  },
  {
    name: 'Annecy · atterro Perroix',
    group: 'Annecy & Bauges',
    lat: 45.836, lon: 6.207,
    type: 'image',
    url: 'https://old.grandsespaces.com/webcams/FIXE.jpg',
    page: 'https://grandsespaces.com/en/paragliding-school-annecy/planfait-webcams/',
    refresh: 300,
  },
  {
    name: 'Doussard · plage (atterro Forclaz)',
    group: 'Annecy & Bauges',
    lat: 45.786, lon: 6.214,
    type: 'image',
    url: SKAPING('2gUqi-p9lYX-Jbt5V-5LJfy'),
    page: 'https://www.skaping.com/sources-du-lac-annecy/douss-plage',
    refresh: 300,
    winds: ['ffvl/75'],
  },
  {
    name: 'La Sambuy',
    group: 'Annecy & Bauges',
    lat: 45.699, lon: 6.272,
    type: 'image',
    url: SKAPING('igESl-UDKJP-5ATS5-0H6VY'),
    page: 'https://www.skaping.com/sambuy',
    refresh: 300,
    winds: ['ffvl/182'],
  },
  {
    name: 'Le Revard',
    group: 'Annecy & Bauges',
    lat: 45.683, lon: 5.975,
    type: 'image',
    url: SKAPING('Q5rbB-UKxD7-TCToP-855mL'),
    refresh: 300,
    winds: ['ffvl/5017'],
  },

  // --- Non intégrables ---------------------------------------------------------
  { name: 'Col de la Forclaz (La Pricaz)', group: 'Annecy & Bauges', type: 'link',
    lat: 45.8135, lon: 6.2465,
    url: 'https://www.chaletlapricaz.com/webcam-parapente-annecy/' },
];
