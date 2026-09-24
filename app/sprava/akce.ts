"use server";

/** Serverové akce správy webu. Každá začíná ověřením přihlášení. */

import { updateTag, revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { povolPrihlaseni } from "@/lib/limit-prihlaseni";
import { hesloSedi, odhlas, overPrihlaseni, prihlas } from "@/lib/auth";
import { nactiProUpravu, uloz, type Soubor } from "@/lib/uloziste";
import type { Galerie, Stranky } from "@/lib/typy";

const GALERIE = "obsah/galerie.json";
const STRANKY = "obsah/stranky.json";
const FOTKY_DIR = "public/fotky";

/** Největší strana fotky po zmenšení. Šetří místo i přenos dat. */
const MAX_STRANA = 1920;

/** Uloží změnu a vrátí srozumitelnou chybu bez interních údajů. */
async function zkusUlozit(zmena: Parameters<typeof uloz>[0]): Promise<string | null> {
  try {
    await uloz(zmena);
    return null;
  } catch (e) {
    const zprava = e instanceof Error ? e.message : String(e);
    console.error("Správa: ukládání selhalo.");

    if (/není připojeno|read-only|EROFS/i.test(zprava)) {
      return "Ukládání není připravené. Ozvěte se prosím správci webu.";
    }
    if (/KONFLIKT_VERZE/i.test(zprava)) {
      return "Někdo jiný mezitím uložil změnu. Načtěte prosím stránku znovu a zkuste to ještě jednou.";
    }
    return (
      "Uložení se nezdařilo. Zkuste to prosím za chvíli znovu — a pokud to " +
      "nepůjde ani pak, ozvěte se správci webu."
    );
  }
}

function json(x: unknown) {
  return JSON.stringify(x, null, 2) + "\n";
}

function osvez() {
  updateTag("csz-obsah");
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------- přihlášení

export async function prihlaseni(_stav: unknown, data: FormData) {
  try {
    if (!(await povolPrihlaseni())) {
      return { chyba: "Příliš mnoho pokusů. Zkuste to prosím za deset minut." };
    }
  } catch {
    return { chyba: "Přihlášení teď není dostupné. Zkuste to prosím za chvíli." };
  }

  const heslo = String(data.get("heslo") ?? "");
  if (!hesloSedi(heslo)) {
    await new Promise((r) => setTimeout(r, 700));
    return { chyba: "Nesprávné heslo." };
  }

  await prihlas();
  redirect("/sprava");
}

export async function odhlaseni() {
  await odhlas();
  redirect("/sprava/prihlaseni");
}

// ------------------------------------------------------------------- galerie

async function nactiGalerii() {
  return nactiProUpravu<Galerie>(GALERIE);
}

/** Akce seřadíme vždy od nejnovější, ať se ručním zásahem nerozhodí pořadí. */
function serad(g: Galerie): Galerie {
  g.akce.sort((a, b) => b.datum.localeCompare(a.datum));
  return g;
}

export async function novaAkce(_stav: unknown, data: FormData) {
  try {
    await overPrihlaseni();
    const datum = String(data.get("datum") ?? "");
    const nazev = String(data.get("nazev") ?? "").trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
      return { chyba: "Vyberte prosím datum akce." };
    }

    const { data: g, verze } = await nactiGalerii();
    let id = datum;
    for (let i = 2; g.akce.some((a) => a.id === id); i++) id = `${datum}-${i}`;

    g.akce.push({ id, datum, nazev, popis: "", fotky: [] });
    const chyba = await zkusUlozit({
      verze,
      zapis: [{ cesta: GALERIE, obsah: json(serad(g)) }],
      zprava: `Správa: nová akce ${nazev || datum}`,
    });
    if (chyba) return { chyba };
    osvez();
    redirect(`/sprava/fotogalerie/${id}`);
  } catch (error) {
    unstable_rethrow(error);
    return { chyba: error instanceof Error && error.message === "Nejste přihlášeni."
      ? "Přihlášení vypršelo. Přihlaste se prosím znovu."
      : "Změna se nepodařila. Zkuste to prosím za chvíli znovu." };
  }
}

export async function upravAkci(_stav: unknown, data: FormData) {
  try {
    await overPrihlaseni();
    const id = String(data.get("id") ?? "");
    const { data: g, verze } = await nactiGalerii();
    const a = g.akce.find((x) => x.id === id);
    if (!a) return { chyba: "Akce nenalezena." };

    const datum = String(data.get("datum") ?? a.datum);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datum)) {
      return { chyba: "Datum nemá správný tvar." };
    }
    a.datum = datum;
    a.nazev = String(data.get("nazev") ?? "").trim();
    a.popis = String(data.get("popis") ?? "").trim();

    const chyba = await zkusUlozit({
      verze,
      zapis: [{ cesta: GALERIE, obsah: json(serad(g)) }],
      zprava: `Správa: úprava akce ${a.nazev || a.datum}`,
    });
    if (chyba) return { chyba };
    osvez();
    return { hotovo: "Uloženo." };
  } catch (error) {
    unstable_rethrow(error);
    return { chyba: error instanceof Error && error.message === "Nejste přihlášeni."
      ? "Přihlášení vypršelo. Přihlaste se prosím znovu."
      : "Změna se nepodařila. Zkuste to prosím za chvíli znovu." };
  }
}

export async function smazAkci(id: string): Promise<{ chyba: string } | void> {
  try {
    await overPrihlaseni();
    const { data: g, verze } = await nactiGalerii();
    const a = g.akce.find((x) => x.id === id);
    if (!a) return;

    const pocet = a.fotky.length;
    g.akce = g.akce.filter((x) => x.id !== id);

    const chyba = await zkusUlozit({
      verze,
      zapis: [{ cesta: GALERIE, obsah: json(g) }],
      zprava: `Správa: smazána akce ${a.nazev || a.datum} (${pocet} fotek)`,
    });
    if (chyba) return { chyba };
    osvez();
    redirect("/sprava/fotogalerie");
  } catch (error) {
    unstable_rethrow(error);
    return { chyba: error instanceof Error && error.message === "Nejste přihlášeni."
      ? "Přihlášení vypršelo. Přihlaste se prosím znovu."
      : "Změna se nepodařila. Zkuste to prosím za chvíli znovu." };
  }
}

/** Bezpečný název souboru — bez diakritiky, mezer a divných znaků. */
function nazevSouboru(id: string, poradi: number, razitko: string) {
  const zaklad = id.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  return `${FOTKY_DIR}/${zaklad}-${razitko}-${poradi}.webp`;
}

export async function nahrajFotky(_stav: unknown, data: FormData) {
  try {
    await overPrihlaseni();
    const id = String(data.get("id") ?? "");
    const soubory = data.getAll("fotky").filter((f): f is File => f instanceof File && f.size > 0);

    if (soubory.length === 0) return { chyba: "Nevybrali jste žádnou fotku." };
    if (soubory.length > 40) return { chyba: "Najednou lze nahrát nejvýš 40 fotek." };

    const { data: g, verze } = await nactiGalerii();
    const a = g.akce.find((x) => x.id === id);
    if (!a) return { chyba: "Akce nenalezena." };

    if (soubory.some(s => s.size > 3_000_000) || soubory.reduce((n, s) => n + s.size, 0) > 3_000_000) {
      return { chyba: "Fotky jsou příliš velké. Vyberte méně snímků nebo je uložte jako JPG." };
    }
    const zapis: Soubor[] = [];
    const razitko = randomUUID();
    let poradi = a.fotky.length;
    let preskoceno = 0;

    for (const s of soubory) {
      try {
        const vstup = Buffer.from(await s.arrayBuffer());
        const obraz = sharp(vstup, { failOn: "error", limitInputPixels: 40_000_000 }).rotate(); // rotate() srovná fotky z mobilu
        const meta = await obraz.metadata();
        if (!meta.width || !meta.height || !["jpeg", "png", "webp", "avif", "heif"].includes(meta.format ?? "") || (meta.pages ?? 1) > 1) {
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
    const chyba = await zkusUlozit({
      verze,
      zapis,
      zprava: `Správa: +${zapis.length - 1} fotek k akci ${a.nazev || a.datum}`,
    });
    if (chyba) return { chyba };
    osvez();

    return {
      nahrano: zapis.length - 1,
      preskoceno,
      hotovo:
        `Nahráno ${zapis.length - 1} fotek.` +
        (preskoceno ? ` ${preskoceno} se nepodařilo zpracovat.` : ""),
    };
  } catch (error) {
    unstable_rethrow(error);
    return { chyba: error instanceof Error && error.message === "Nejste přihlášeni."
      ? "Přihlášení vypršelo. Přihlaste se prosím znovu."
      : "Změna se nepodařila. Zkuste to prosím za chvíli znovu." };
  }
}

export async function smazFotku(id: string, src: string): Promise<{ chyba: string } | void> {
  try {
    await overPrihlaseni();
    const { data: g, verze } = await nactiGalerii();
    const a = g.akce.find((x) => x.id === id);
    if (!a) return;
    if (!a.fotky.some(f => f.src === src)) return { chyba: "Fotka nenalezena." };
    a.fotky = a.fotky.filter((f) => f.src !== src);

    const chyba = await zkusUlozit({
      verze,
      zapis: [{ cesta: GALERIE, obsah: json(g) }],
      zprava: `Správa: smazána fotka z akce ${a.nazev || a.datum}`,
    });
    if (chyba) return { chyba };
    osvez();
  } catch (error) {
    unstable_rethrow(error);
    return { chyba: error instanceof Error && error.message === "Nejste přihlášeni."
      ? "Přihlášení vypršelo. Přihlaste se prosím znovu."
      : "Změna se nepodařila. Zkuste to prosím za chvíli znovu." };
  }
}

export async function presunFotku(
  id: string,
  src: string,
  smer: -1 | 1,
): Promise<{ chyba: string } | void> {
  try {
    await overPrihlaseni();
    const { data: g, verze } = await nactiGalerii();
    const a = g.akce.find((x) => x.id === id);
    if (!a) return;
    const i = a.fotky.findIndex((f) => f.src === src);
    if (smer !== -1 && smer !== 1) return { chyba: "Neplatný směr." };
    const j = i + smer;
    if (i < 0 || j < 0 || j >= a.fotky.length) return;
    [a.fotky[i], a.fotky[j]] = [a.fotky[j], a.fotky[i]];

    const chyba = await zkusUlozit({
      verze,
      zapis: [{ cesta: GALERIE, obsah: json(g) }],
      zprava: `Správa: přeskupení fotek u akce ${a.nazev || a.datum}`,
    });
    if (chyba) return { chyba };
    osvez();
  } catch (error) {
    unstable_rethrow(error);
    return { chyba: error instanceof Error && error.message === "Nejste přihlášeni."
      ? "Přihlášení vypršelo. Přihlaste se prosím znovu."
      : "Změna se nepodařila. Zkuste to prosím za chvíli znovu." };
  }
}

// --------------------------------------------------------------------- texty

export async function ulozTexty(_stav: unknown, data: FormData) {
  try {
    await overPrihlaseni();
    const { data: s, verze } = await nactiProUpravu<Stranky>(STRANKY);

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

    const chyba = await zkusUlozit({
      verze,
      zapis: [{ cesta: STRANKY, obsah: json(s) }],
      zprava: "Správa: úprava textů",
    });
    if (chyba) return { chyba };
    osvez();
    return { hotovo: "Texty uloženy." };
  } catch (error) {
    unstable_rethrow(error);
    return { chyba: error instanceof Error && error.message === "Nejste přihlášeni."
      ? "Přihlášení vypršelo. Přihlaste se prosím znovu."
      : "Změna se nepodařila. Zkuste to prosím za chvíli znovu." };
  }
}

export async function ulozKontakt(_stav: unknown, data: FormData) {
  try {
    await overPrihlaseni();
    const { data: s, verze } = await nactiProUpravu<Stranky>(STRANKY);

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

    const chyba = await zkusUlozit({
      verze,
      zapis: [{ cesta: STRANKY, obsah: json(s) }],
      zprava: "Správa: úprava kontaktů a výboru",
    });
    if (chyba) return { chyba };
    osvez();
    return { hotovo: "Uloženo." };
  } catch (error) {
    unstable_rethrow(error);
    return { chyba: error instanceof Error && error.message === "Nejste přihlášeni."
      ? "Přihlášení vypršelo. Přihlaste se prosím znovu."
      : "Změna se nepodařila. Zkuste to prosím za chvíli znovu." };
  }
}
