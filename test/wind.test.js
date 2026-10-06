import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseWidget } from '../api/wind.js';

const fixture = name => readFileSync(new URL(`fixtures/${name}`, import.meta.url), 'utf8');

test('widget FFVL capturé', () => {
  assert.deepEqual(parseWidget(fixture('ffvl-61.html')),
    { name: 'St Hilaire du Touvet', ts: 1791277438, dir: 180, min: 0, avg: 5, max: 9 });
});

test('widget ROMMA capturé : min absent', () => {
  assert.deepEqual(parseWidget(fixture('romma-186.html')),
    { name: 'Saint-Hilaire-du-Touvet', ts: 1791276660, dir: 90, min: null, avg: 6, max: 10 });
});

test('attributs supplémentaires, guillemets simples, décimales', () => {
  const html = `<title data-tsreleve='100' data-name='X'></title>
    <div style="background-image: url(/icones/balises/balise.svg.php?c=g&d=45.5)"></div>
    <span title="min" class='widget_wind_speed min' data-x="1"> 2,5 </span>/
    <span class="foo widget_wind_speed widget_wind_speed_green">7</span>/
    <span class="widget_wind_speed">12</span>`;
  assert.deepEqual(parseWidget(html), { name: 'X', ts: 100, dir: 45.5, min: 2.5, avg: 7, max: 12 });
});

test('page inattendue → erreur explicite', () => {
  assert.throws(() => parseWidget('<html><body>Maintenance</body></html>'), /format de widget inattendu/);
});

test('liste serveur = BALISES de cams.js', async () => {
  const { runInNewContext } = await import('node:vm');
  const { BALISE_IDS } = await import('../api/wind.js');
  const ctx = {};
  runInNewContext(readFileSync(new URL('../cams.js', import.meta.url), 'utf8') + '\nthis.B = BALISES; this.C = CAMS;', ctx);
  assert.deepEqual([...BALISE_IDS].sort(), Object.keys(ctx.B).sort());
  // Toute balise posée sur une image doit exister.
  for (const cam of ctx.C) for (const s of cam.winds ?? [])
    assert.ok(ctx.B[typeof s === 'string' ? s : s.id], `${cam.name} : balise inconnue ${JSON.stringify(s)}`);
});
