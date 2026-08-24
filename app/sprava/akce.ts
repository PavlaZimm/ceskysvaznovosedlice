"use server";

/** Serverové akce správy webu. Každá začíná ověřením přihlášení. */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { hesloSedi, odhlas, overPrihlaseni, prihlas } from "@/lib/auth";
import { nacti, uloz, type Soubor } from "@/lib/uloziste";
import type { Akce, Galerie, Stranky } from "@/lib/typy";

const GALERIE = "obsah/galerie.json";
const STRANKY = "obsah/stranky.json";
const FOTKY_DIR = "public/fotky";

/** Největší strana fotky po zmenšení. Drží repozitář v rozumné velikosti. */
const MAX_STRANA = 1920;

function json(x: unknown) {
  return JSON.stringify(x, null, 2) + "\n";
}

function osvez() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------- přihlášení

let pokusy: { kdy: number }[] = [];

export async function prihlaseni(_stav: unknown, data: FormData) {
  // Jednoduchá brzda proti hádání hesla: max 8 pokusů za 10 minut.
  const ted = Date.now();
  pokusy = pokusy.filter((p) => ted - p.kdy < 600_000);
  if (pokusy.length >= 8) {
    return { chyba: "Příliš mnoho pokusů. Zkuste to prosím za deset minut." };
  }

  const heslo = String(data.get("heslo") ?? "");
  if (!hesloSedi(heslo)) {
    pokusy.push({ kdy: ted });
    await new Promise((r) => setTimeout(r, 700));
    return { chyba: "Nesprávné heslo." };
  }

  pokusy = [];
  await prihlas();
  redirect("/sprava");
}

export async function odhlaseni() {
  await odhlas();
  redirect("/sprava/prihlaseni");
}

// ------------------------------------------------------------------- galerie

async function nactiGalerii(): Promise<Galerie> {
  return JSON.parse(await nacti(GALERIE)) as Galerie;
}

/** Akce seřadíme vždy od nejnovější, ať se ručním zásahem nerozhodí pořadí. */
function serad(g: Galerie): Galerie {
  g.akce.sort((a, b) => b.datum.localeCompare(a.datum));
  return g;
}

export async function novaAkce(_stav: unknown, data: FormData) {
  await overPrihlaseni();
  const datum = String(data.get("datum") ?? "");
  const nazev = String(data.get("nazev") ?? "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    return { chyba: "Vyberte prosím datum akce." };
  }

  const g = await nactiGalerii();
  let id = datum;
  for (let i = 2; g.akce.some((a) => a.id === id); i++) id = `${datum}-${i}`;

  g.akce.push({ id, datum, nazev, popis: "", fotky: [] });
  await uloz({
    zapis: [{ cesta: GALERIE, obsah: json(serad(g)) }],
    zprava: `Správa: nová akce ${nazev || datum}`,
  });
  osvez();
  redirect(`/sprava/fotogalerie/${id}`);
}

export async function upravAkci(_stav: unknown, data: FormData) {
  await overPrihlaseni();
  const id = String(data.get("id") ?? "");
  const g = await nactiGalerii();
  const a = g.akce.find((x) => x.id === id);
  if (!a) return { chyba: "Akce nenalezena." };

  const datum = String(data.get("datum") ?? a.datum);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
    return { chyba: "Datum nemá správný tvar." };
  }
  a.datum = datum;
  a.nazev = String(data.get("nazev") ?? "").trim();
  a.popis = String(data.get("popis") ?? "").trim();

  await uloz({
    zapis: [{ cesta: GALERIE, obsah: json(serad(g)) }],
    zprava: `Správa: úprava akce ${a.nazev || a.datum}`,
  });
  osvez();
  return { hotovo: "Uloženo." };
}

export async function smazAkci(id: string) {
  await overPrihlaseni();
  const g = await nactiGalerii();
  const a = g.akce.find((x) => x.id === id);
  if (!a) return;

  const smaz = a.fotky.map((f) => `public${f.src}`);
  g.akce = g.akce.filter((x) => x.id !== id);

  await uloz({
    zapis: [{ cesta: GALERIE, obsah: json(g) }],
    smaz,
    zprava: `Správa: smazána akce ${a.nazev || a.datum} (${smaz.length} fotek)`,
  });
  osvez();
  redirect("/sprava/fotogalerie");
}

/** Bezpečný název souboru — bez diakritiky, mezer a divných znaků. */
function nazevSouboru(id: string, poradi: number, razitko: number) {
  const zaklad = id.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  return `${FOTKY_DIR}/${zaklad}-${razitko}-${poradi}.webp`;
}

export async function nahrajFotky(_stav: unknown, data: FormData) {
  await overPrihlaseni();
  const id = String(data.get("id") ?? "");
  const soubory = data.getAll("fotky").filter((f): f is File => f instanceof File && f.size > 0);

  if (soubory.length === 0) return { chyba: "Nevybrali jste žádnou fotku." };
  if (soubory.length > 40) return { chyba: "Najednou lze nahrát nejvýš 40 fotek." };

  const g = await nactiGalerii();
  const a = g.akce.find((x) => x.id === id);
  if (!a) return { chyba: "Akce nenalezena." };

  const zapis: Soubor[] = [];
  const razitko = Math.floor(Date.now() / 1000);
  let poradi = a.fotky.length;
  let preskoceno = 0;

  for (const s of soubory) {
    try {
      const vstup = Buffer.from(await s.arrayBuffer());
      const obraz = sharp(vstup, { failOn: "none" }).rotate(); // rotate() srovná fotky z mobilu
      const meta = await obraz.metadata();
      if (!meta.width || !meta.height) {
        preskoceno++;
        continue;
      }
      const zmenseny = await obraz
        .resize(MAX_STRANA, MAX_STRANA, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });

      const cesta = nazevSouboru(id, poradi++, razitko);
      zapis.push({ cesta, obsah: zmenseny.data });
      a.fotky.push({
        src: "/" + cesta.slice("public/".length),
        w: zmenseny.info.width,
        h: zmenseny.info.height,
      });
    } catch {
      preskoceno++;
    }
  }

  if (zapis.length === 0) {
    return { chyba: "Žádnou z vybraných fotek se nepodařilo zpracovat." };
  }

  zapis.push({ cesta: GALERIE, obsah: json(g) });
  await uloz({
    zapis,
    zprava: `Správa: +${zapis.length - 1} fotek k akci ${a.nazev || a.datum}`,
  });
  osvez();

  return {
    hotovo:
      `Nahráno ${zapis.length - 1} fotek.` +
      (preskoceno ? ` ${preskoceno} se nepodařilo zpracovat.` : ""),
  };
}

export async function smazFotku(id: string, src: string) {
  await overPrihlaseni();
  const g = await nactiGalerii();
  const a = g.akce.find((x) => x.id === id);
  if (!a) return;
  a.fotky = a.fotky.filter((f) => f.src !== src);

  await uloz({
    zapis: [{ cesta: GALERIE, obsah: json(g) }],
    smaz: [`public${src}`],
    zprava: `Správa: smazána fotka z akce ${a.nazev || a.datum}`,
  });
  osvez();
}

export async function presunFotku(id: string, src: string, smer: -1 | 1) {
  await overPrihlaseni();
  const g = await nactiGalerii();
  const a = g.akce.find((x) => x.id === id);
  if (!a) return;
  const i = a.fotky.findIndex((f) => f.src === src);
  const j = i + smer;
  if (i < 0 || j < 0 || j >= a.fotky.length) return;
  [a.fotky[i], a.fotky[j]] = [a.fotky[j], a.fotky[i]];

  await uloz({
    zapis: [{ cesta: GALERIE, obsah: json(g) }],
    zprava: `Správa: přeskupení fotek u akce ${a.nazev || a.datum}`,
  });
  osvez();
}

// --------------------------------------------------------------------- texty

export async function ulozTexty(_stav: unknown, data: FormData) {
  await overPrihlaseni();
  const s = JSON.parse(await nacti(STRANKY)) as Stranky;

  const t = (klic: string, puvodni: string) => {
    const v = data.get(klic);
    return v === null ? puvodni : String(v).trim();
  };
  const seznam = (klic: string, puvodni: string[]) => {
    const v = data.get(klic);
    if (v === null) return puvodni;
    return String(v).split("\n").map((r) => r.trim()).filter(Boolean);
  };

  s.spolek.motto = t("motto", s.spolek.motto);
  s.uvod.perex = t("perex", s.uvod.perex);
  s.uvod.copDelame = seznam("copDelame", s.uvod.copDelame);
  s.uvod.proKoho = seznam("proKoho", s.uvod.proKoho);
  s.uvod.onasKratce = t("onasKratce", s.uvod.onasKratce);
  s.uvod.galerieKratce = t("galerieKratce", s.uvod.galerieKratce);
  s.oNas.hlavni = t("oNasHlavni", s.oNas.hlavni);
  s.oNas.hlavni2 = t("oNasHlavni2", s.oNas.hlavni2);
  s.oNas.proZeny = t("proZeny", s.oNas.proZeny);
  s.oNas.proSpolecnost = t("proSpolecnost", s.oNas.proSpolecnost);
  s.oNas.cinnost = s.oNas.cinnost.map((c, i) => ({
    nadpis: t(`cinnostNadpis${i}`, c.nadpis),
    text: t(`cinnostText${i}`, c.text),
  }));
  s.tym.uvod = t("tymUvod", s.tym.uvod);
  s.kontakt.uvod = t("kontaktUvod", s.kontakt.uvod);

  await uloz({
    zapis: [{ cesta: STRANKY, obsah: json(s) }],
    zprava: "Správa: úprava textů",
  });
  osvez();
  return { hotovo: "Texty uloženy." };
}

export async function ulozKontakt(_stav: unknown, data: FormData) {
  await overPrihlaseni();
  const s = JSON.parse(await nacti(STRANKY)) as Stranky;

  const email = String(data.get("email") ?? "").trim();
  const telefon = String(data.get("telefon") ?? "").trim();

  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { chyba: "E-mail nemá správný tvar." };
  }

  if (email) s.spolek.email = email;
  if (telefon) {
    s.spolek.telefon = telefon;
    s.spolek.telefonHref = telefon.replace(/\s+/g, "");
  }
  s.spolek.ulice = String(data.get("ulice") ?? s.spolek.ulice).trim();
  s.spolek.psc = String(data.get("psc") ?? s.spolek.psc).trim();
  s.spolek.mesto = String(data.get("mesto") ?? s.spolek.mesto).trim();

  const jmena = data.getAll("clenkaJmeno").map(String);
  const funkce = data.getAll("clenkaFunkce").map(String);
  s.tym.clenky = jmena
    .map((j, i) => ({ jmeno: j.trim(), funkce: (funkce[i] ?? "").trim() }))
    .filter((c) => c.jmeno);

  await uloz({
    zapis: [{ cesta: STRANKY, obsah: json(s) }],
    zprava: "Správa: úprava kontaktů a výboru",
  });
  osvez();
  return { hotovo: "Uloženo." };
}
