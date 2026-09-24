import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
if (!process.env.DATABASE_URL) throw new Error('Chybí DATABASE_URL v .env.local.');
const sql = neon(process.env.DATABASE_URL);
// Schéma má více SQL příkazů: jednotlivé části respektují tělo funkce $$…$$.
const schema = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
const statements = schema.match(/(?:[^;$]|\$(?!\$)|\$\$[\s\S]*?\$\$)+;/g) ?? [];
await sql.transaction(statements.map(statement => sql.query(statement)));
for (const file of ['stranky', 'galerie']) {
  const data = JSON.parse(await readFile(new URL(`../obsah/${file}.json`, import.meta.url), 'utf8'));
  await sql`INSERT INTO csz_content(key, data) VALUES (${`obsah/${file}.json`}, ${JSON.stringify(data)}::jsonb) ON CONFLICT DO NOTHING`;
}
console.log('Databáze připravena. Existující obsah nebyl přepsán.');
