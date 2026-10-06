// GET /api/wind
// Lit les widgets vent spotair (pages HTML, pas de CORS) des balises listées ci-dessous et renvoie :
//   { "ffvl/61": { name, ts, dir, min, avg, max }, ... }
// ts = heure du relevé (secondes epoch), dir = direction d'où vient le vent (degrés),
// vitesses en km/h, null si absentes. Une balise en erreur vaut { error }.
//
// La liste est fixe (pas de paramètre) : une seule URL, mise en cache par le CDN, et
// personne ne peut se servir de l'endpoint pour interroger spotair à sa place.
// À garder synchronisée avec BALISES dans cams.js.
export const BALISE_IDS = [
  'ffvl/12', 'ffvl/13', 'ffvl/14', 'ffvl/144', 'ffvl/146', 'ffvl/15', 'ffvl/16', 'ffvl/182',
  'ffvl/187', 'ffvl/2111', 'ffvl/2170', 'ffvl/3495', 'ffvl/3770', 'ffvl/3997', 'ffvl/5017',
  'ffvl/54', 'ffvl/61', 'ffvl/62', 'ffvl/67', 'ffvl/75', 'romma/186', 'romma/289',
];

function num(s) {
  if (s == null) return null;
  const t = String(s).trim().replace(',', '.');
  const n = Number(t);
  return t !== '' && t !== '-' && Number.isFinite(n) ? n : null;
}

export function parseWidget(html) {
  const ts = num(html.match(/data-tsreleve=["']?(\d+)/)?.[1]);
  if (ts == null) throw new Error('format de widget inattendu');
  const name = html.match(/data-name=["']([^"']*)["']/)?.[1] ?? null;
  const dir = num(html.match(/balise\.svg\.php\?[^)"']*?\bd=(\d+(?:\.\d+)?)/)?.[1]);
  // <span ... class="widget_wind_speed ..." ...>valeur</span>, dans l'ordre min / moy / max
  const speeds = [...html.matchAll(/<span\b[^>]*\bclass=["'][^"']*\bwidget_wind_speed\b[^"']*["'][^>]*>([^<]*)</g)]
    .map(m => num(m[1]));
  const [min = null, avg = null, max = null] = speeds;
  return { name, ts, dir, min, avg, max };
}

async function fetchOne(id) {
  const r = await fetch(`https://www.spotair.mobi/widget/wind/${id}?mode=free_flight&unit=kmh&quadrant=true`, {
    headers: { 'user-agent': 'webcams-parapente (dashboard perso)' },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return parseWidget(await r.text());
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('allow', 'GET, HEAD');
    res.end();
    return;
  }

  const results = await Promise.allSettled(BALISE_IDS.map(fetchOne));
  const out = {};
  BALISE_IDS.forEach((id, i) => {
    out[id] = results[i].status === 'fulfilled' ? results[i].value : { error: String(results[i].reason?.message ?? results[i].reason) };
  });

  res.statusCode = 200;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  // Cache CDN 2 min, puis sert l'ancienne réponse pendant qu'il rafraîchit.
  res.setHeader('cache-control', 'public, s-maxage=120, stale-while-revalidate=600');
  res.end(req.method === 'HEAD' ? undefined : JSON.stringify(out));
}
