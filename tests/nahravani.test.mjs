import test from 'node:test';
import assert from 'node:assert/strict';
import { rozdelDoDavek } from '../lib/zmenseni.ts';
const fotka = (size, i = 0) => ({ name: `fotka-${i}.jpg`, size });
test('106 malých fotografií respektuje limit 40 snímků a pořadí', () => {
  const soubory = Array.from({ length: 106 }, (_, i) => fotka(1000, i));
  const davky = rozdelDoDavek(soubory);
  assert.deepEqual(davky.map(d => d.length), [40, 40, 26]);
  assert.deepEqual(davky.flat(), soubory);
});
test('dávky nepřesáhnou 3 MB včetně poslední fotografie', () => {
  const soubory = [fotka(1_800_000), fotka(1_300_000), fotka(1_700_000), fotka(1)];
  const davky = rozdelDoDavek(soubory);
  assert.deepEqual(davky.map(d => d.length), [1, 2, 1]);
  for (const d of davky) assert.ok(d.reduce((n, f) => n + f.size, 0) <= 3_000_000);
});
test('nezmenšená velká fotka neodejde do požadavku, který server odmítne', () => {
  assert.throws(() => rozdelDoDavek([fotka(3_000_001)]));
  assert.deepEqual(rozdelDoDavek([]), []);
  assert.equal(rozdelDoDavek([fotka(3_000_000)])[0].length, 1);
});
