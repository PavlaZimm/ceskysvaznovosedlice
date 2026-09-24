/** Obsah v Neonu, nové fotografie ve Vercel Blob. Přístupy zůstávají na serveru. */
import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { put } from "@vercel/blob";
import { db, pouzivaDatabazi } from "./db";
import type { Galerie, Stranky } from "./typy";

export { pouzivaDatabazi } from "./db";
export const chybiPristupKUlozisti = Boolean(process.env.VERCEL) && !pouzivaDatabazi;
export const chybiUlozisteFotek = pouzivaDatabazi && !(
  process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)
);

export type Soubor = { cesta: string; obsah: string | Buffer };
export type Zmena = { zapis?: Soubor[]; zprava: string; verze: number };
const DOKUMENTY = ["obsah/stranky.json", "obsah/galerie.json"];

function overDokument(cesta: string) {
  if (!DOKUMENTY.includes(cesta)) throw new Error("Neplatný dokument.");
}
function naDisku(cesta: string) {
  if (!DOKUMENTY.includes(cesta) && !/^public\/fotky\/[a-zA-Z0-9_-]+\.(webp|jpe?g|png)$/.test(cesta)) {
    throw new Error("Neplatná cesta.");
  }
  return DOKUMENTY.includes(cesta)
    ? path.join(process.cwd(), "obsah", path.basename(cesta))
    : path.join(process.cwd(), "public", "fotky", path.basename(cesta));
}

export async function nactiProUpravu<T>(cesta: string): Promise<{ data: T; verze: number }> {
  overDokument(cesta);
  if (!pouzivaDatabazi) {
    return { data: JSON.parse(await fs.readFile(naDisku(cesta), "utf8")) as T, verze: 0 };
  }
  const radky = await db()`SELECT data, revision FROM csz_content WHERE key = ${cesta}`;
  if (!radky[0]) throw new Error("Chybí počáteční obsah. Spusťte npm run db:init.");
  return { data: radky[0].data as T, verze: Number(radky[0].revision) };
}

/** Nejprve uloží fotky, potom jedním podmíněným zápisem zveřejní nový obsah. */
export async function uloz({ zapis = [], zprava, verze }: Zmena) {
  if (chybiPristupKUlozisti) throw new Error("Úložiště není připojeno.");
  const dokumenty = zapis.filter(s => DOKUMENTY.includes(s.cesta));
  if (dokumenty.length !== 1) throw new Error("Očekáván jeden dokument.");
  const dokument = dokumenty[0];
  const data = JSON.parse(String(dokument.obsah));
  const fotky = zapis.filter(s => !DOKUMENTY.includes(s.cesta));
  if (fotky.length && dokument.cesta !== "obsah/galerie.json") throw new Error("Neplatná galerie.");

  if (!pouzivaDatabazi) {
    // Vývojový režim. Fotky fyzicky nemažeme: mohou být použité i na úvodní stránce.
    for (const s of zapis) {
      const cil = naDisku(s.cesta);
      await fs.mkdir(path.dirname(cil), { recursive: true });
      await fs.writeFile(cil, s.obsah);
    }
    return;
  }

  if (fotky.length && chybiUlozisteFotek) throw new Error("Úložiště fotografií není připojeno.");
  for (const s of fotky) {
    naDisku(s.cesta); // ověření povoleného názvu
    if (!Buffer.isBuffer(s.obsah)) throw new Error("Neplatná fotografie.");
    const blob = await put(`novosedlice/${s.cesta.slice("public/".length)}`, s.obsah, {
      access: "public", contentType: "image/webp", addRandomSuffix: true,
    });
    const puvodni = s.cesta.slice("public".length);
    for (const akce of (data as Galerie).akce) {
      for (const fotka of akce.fotky) if (fotka.src === puvodni) fotka.src = blob.url;
    }
  }

  // Souběžná úprava se nesmí tiše přepsat. Historii atomicky ukládá trigger.
  const radky = await db()`
    UPDATE csz_content SET data = ${JSON.stringify(data)}::jsonb,
      revision = revision + 1, updated_at = now(), message = ${zprava}
    WHERE key = ${dokument.cesta} AND revision = ${verze}
    RETURNING revision
  `;
  if (!radky.length) throw new Error("KONFLIKT_VERZE");
  // Smazání v galerii odstraní odkaz, soubor zůstane pro obnovu z historie.
  // Při nejistém výsledku DB požadavku nemažeme upload: zápis mohl být potvrzen.
}

export async function nactiStranky(): Promise<Stranky> {
  return (await nactiProUpravu<Stranky>("obsah/stranky.json")).data;
}
export async function nactiGalerii(): Promise<Galerie> {
  return (await nactiProUpravu<Galerie>("obsah/galerie.json")).data;
}
export async function zkusNacistStranky(): Promise<Stranky | null> {
  try { return await nactiStranky(); } catch { return null; }
}
export async function zkusNacistGalerii(): Promise<Galerie | null> {
  try { return await nactiGalerii(); } catch { return null; }
}
export async function nactiBinarne(cesta: string): Promise<Buffer | null> {
  try { return await fs.readFile(naDisku(cesta)); } catch { return null; }
}
