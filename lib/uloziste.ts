/**
 * Ukládání obsahu.
 *
 * Web nemá databázi — texty i fotky se ukládají přímo do repozitáře na
 * GitHubu. Po zápisu Vercel automaticky sestaví web znovu, takže se změna
 * na webu objeví přibližně do minuty.
 *
 * Když není nastavený GITHUB_TOKEN (typicky při vývoji na vlastním počítači),
 * zapisuje se místo toho rovnou na disk.
 */
import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Galerie, Stranky } from "./typy";

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO ?? "PavlaZimm/ceskysvaznovosedlice";
const VETEV = process.env.GITHUB_BRANCH ?? "main";
const API = "https://api.github.com";

export const zapisujeDoGitHubu = Boolean(TOKEN);

/** Jeden soubor k zápisu. Text, nebo binární data (fotky). */
export type Soubor = {
  /** Cesta v repozitáři, např. "obsah/galerie.json" nebo "public/fotky/x.webp". */
  cesta: string;
  obsah: string | Buffer;
};

/** Soubory ke smazání se předávají jako pole cest. */
export type Zmena = {
  zapis?: Soubor[];
  smaz?: string[];
  zprava: string;
};

async function gh(cesta: string, init?: RequestInit) {
  const r = await fetch(`${API}${cesta}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!r.ok) {
    const telo = await r.text();
    throw new Error(`GitHub ${r.status}: ${telo.slice(0, 300)}`);
  }
  return r.json();
}

/**
 * Zapíše (a případně smaže) sadu souborů jedním commitem.
 *
 * Používá Git Data API, aby i nahrání dvaceti fotek najednou znamenalo
 * jediný commit a jediný build na Vercelu — ne dvacet.
 */
async function commitDoGitHubu({ zapis = [], smaz = [], zprava }: Zmena) {
  const ref = await gh(`/repos/${REPO}/git/ref/heads/${VETEV}`);
  const hlavaSha: string = ref.object.sha;
  const commit = await gh(`/repos/${REPO}/git/commits/${hlavaSha}`);
  const zakladStromu: string = commit.tree.sha;

  const polozky: Record<string, unknown>[] = [];

  for (const s of zapis) {
    const jeBinarni = Buffer.isBuffer(s.obsah);
    const blob = await gh(`/repos/${REPO}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({
        content: jeBinarni
          ? (s.obsah as Buffer).toString("base64")
          : (s.obsah as string),
        encoding: jeBinarni ? "base64" : "utf-8",
      }),
    });
    polozky.push({ path: s.cesta, mode: "100644", type: "blob", sha: blob.sha });
  }

  // sha: null ve stromu znamená smazání souboru
  for (const c of smaz) {
    polozky.push({ path: c, mode: "100644", type: "blob", sha: null });
  }

  if (polozky.length === 0) return;

  const strom = await gh(`/repos/${REPO}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: zakladStromu, tree: polozky }),
  });

  const novyCommit = await gh(`/repos/${REPO}/git/commits`, {
    method: "POST",
    body: JSON.stringify({
      message: zprava,
      tree: strom.sha,
      parents: [hlavaSha],
    }),
  });

  await gh(`/repos/${REPO}/git/refs/heads/${VETEV}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: novyCommit.sha }),
  });
}

/**
 * Převede cestu v repozitáři na cestu na disku.
 *
 * Kořenová složka je vždy zapsaná natvrdo ("obsah" / "public"), aby Turbopack
 * nemusel při sestavení sledovat celý projekt — jinak by se do nasazeného
 * balíku přibalily i všechny fotky.
 */
function naDisku(cesta: string): string | null {
  if (cesta.startsWith("obsah/")) {
    return path.join(process.cwd(), "obsah", cesta.slice("obsah/".length));
  }
  if (cesta.startsWith("public/")) {
    return path.join(process.cwd(), "public", cesta.slice("public/".length));
  }
  return null;
}

async function zapisNaDisk({ zapis = [], smaz = [] }: Zmena) {
  for (const s of zapis) {
    const cil = naDisku(s.cesta);
    if (!cil) continue;
    await fs.mkdir(path.dirname(cil), { recursive: true });
    await fs.writeFile(cil, s.obsah as Buffer | string);
  }
  for (const c of smaz) {
    const cil = naDisku(c);
    if (cil) await fs.rm(cil, { force: true });
  }
}

/** Uloží změnu — na Vercelu do GitHubu, lokálně na disk. */
export async function uloz(zmena: Zmena): Promise<void> {
  if (zapisujeDoGitHubu) await commitDoGitHubu(zmena);
  else await zapisNaDisk(zmena);
}

/** Načte aktuální obsah souboru z repozitáře (resp. z disku). */
export async function nacti(cesta: string): Promise<string> {
  if (!zapisujeDoGitHubu) {
    const cil = naDisku(cesta);
    if (!cil) throw new Error(`Neznámá cesta: ${cesta}`);
    return fs.readFile(cil, "utf-8");
  }
  const d = await gh(
    `/repos/${REPO}/contents/${encodeURI(cesta)}?ref=${VETEV}`,
  );
  return Buffer.from(d.content, "base64").toString("utf-8");
}

/**
 * Živé načtení obsahu — pro stránky správy.
 *
 * Veřejný web čte obsah z `obsah/*.json` napřímo (zapeče se do buildu, je to
 * rychlé). Správa ale musí vidět aktuální stav hned po uložení, tedy ještě
 * než Vercel stihne web znovu sestavit — proto čte přes GitHub API.
 */
export async function nactiStranky(): Promise<Stranky> {
  return JSON.parse(await nacti("obsah/stranky.json")) as Stranky;
}

export async function nactiGalerii(): Promise<Galerie> {
  return JSON.parse(await nacti("obsah/galerie.json")) as Galerie;
}

/** Načte binární soubor (fotku) — z GitHubu, nebo z disku. */
export async function nactiBinarne(cesta: string): Promise<Buffer | null> {
  try {
    if (!zapisujeDoGitHubu) {
      const cil = naDisku(cesta);
      return cil ? await fs.readFile(cil) : null;
    }
    const d = await gh(`/repos/${REPO}/contents/${encodeURI(cesta)}?ref=${VETEV}`);
    // Velké soubory vrací GitHub bez obsahu — stáhneme je přes download_url
    if (!d.content && d.download_url) {
      const r = await fetch(d.download_url, { cache: "no-store" });
      return r.ok ? Buffer.from(await r.arrayBuffer()) : null;
    }
    return Buffer.from(d.content, "base64");
  } catch {
    return null;
  }
}
