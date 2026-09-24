import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('migrace, historie a odmítnutí souběžného přepsání', async () => {
  const db = new PGlite();
  try {
    const schema = await readFile(new URL('../scripts/schema.sql', import.meta.url), 'utf8');
    // Stejný způsob dělení jako v inicializačním skriptu, včetně PL/pgSQL funkce.
    const statements = schema.match(/(?:[^;$]|\$(?!\$)|\$\$[\s\S]*?\$\$)+;/g) ?? [];
    assert.equal(statements.length, 5);
    for (const statement of statements) await db.exec(statement);
    const original = { akce: [{ id: '2026-09-24', nazev: 'Původní akce', fotky: [] }] };
    await db.query('INSERT INTO csz_content(key,data) VALUES ($1,$2)', ['obsah/galerie.json', JSON.stringify(original)]);
    for (const statement of statements) await db.exec(statement);
    await db.query('INSERT INTO csz_content(key,data) VALUES ($1,$2) ON CONFLICT DO NOTHING', ['obsah/galerie.json', '{"akce":[]}']);
    assert.deepEqual((await db.query('SELECT data FROM csz_content')).rows[0].data, original);
    const sql = 'UPDATE csz_content SET data=$1::jsonb, revision=revision+1, message=$2, updated_at=now() WHERE key=$3 AND revision=$4 RETURNING revision';
    const args = ['{"akce":[]}', 'Smazána akce', 'obsah/galerie.json', 1];
    assert.equal((await db.query(sql, args)).rows[0].revision, 2);
    assert.equal((await db.query(sql, args)).rows.length, 0);
    assert.deepEqual((await db.query('SELECT data FROM csz_content_history WHERE revision=1')).rows[0].data, original);
    await db.exec('BEGIN');
    await db.query(sql, [JSON.stringify(original), 'Vrácení', 'obsah/galerie.json', 2]);
    await db.exec('ROLLBACK');
    assert.equal((await db.query('SELECT revision FROM csz_content')).rows[0].revision, 2);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM csz_content_history')).rows[0].n, 1);
  } finally { await db.close(); }
});
