/**
 * Zmenšení fotky v prohlížeči, ještě před odesláním na server.
 *
 * Proč to nedělá až server: fotka z mobilu má běžně 3–10 MB, ale serverová
 * akce ve Vercelu unese jen 4,5 MB na celý požadavek. Nahrání jediné
 * nezmenšené fotky proto skončí chybou. Když se fotka zmenší už tady,
 * má pár set kilobajtů a projde jich najednou klidně deset — a nahrávání
 * je navíc mnohem rychlejší, což ocení každý, kdo fotky posílá z mobilu.
 */

/** Nejdelší strana výsledné fotky v pixelech. */
const MAX_STRANA = 1920;
const KVALITA = 0.82;

export type Prubeh = { hotovo: number; celkem: number };

/**
 * Zmenší jeden obrázek. Když se to z jakéhokoli důvodu nepovede,
 * vrátí původní soubor — ať radši projde velký než žádný.
 */
export async function zmensiFotku(soubor: File): Promise<File> {
  try {
    // from-image srovná fotky vyfocené na výšku (EXIF orientace)
    const bitmapa = await createImageBitmap(soubor, { imageOrientation: "from-image" });

    const pomer = Math.min(1, MAX_STRANA / Math.max(bitmapa.width, bitmapa.height));
    const sirka = Math.round(bitmapa.width * pomer);
    const vyska = Math.round(bitmapa.height * pomer);

    const platno = document.createElement("canvas");
    platno.width = sirka;
    platno.height = vyska;
    const ctx = platno.getContext("2d");
    if (!ctx) return soubor;
    ctx.drawImage(bitmapa, 0, 0, sirka, vyska);
    bitmapa.close();

    const blob = await new Promise<Blob | null>((res) =>
      platno.toBlob(res, "image/webp", KVALITA),
    );
    if (!blob || blob.size === 0) return soubor;

    // Kdyby zmenšení paradoxně nepomohlo, pošleme originál
    if (blob.size >= soubor.size) return soubor;

    const nazev = soubor.name.replace(/\.[^.]+$/, "") + ".webp";
    return new File([blob], nazev, { type: "image/webp" });
  } catch {
    return soubor;
  }
}

/** Velikost dávky tak, aby se požadavek vešel do limitu Vercelu. */
const LIMIT_DAVKY = 3_000_000; // ~3 MB

/** Rozdělí zmenšené fotky do dávek, které se vejdou do jednoho požadavku. */
export function rozdelDoDavek(soubory: File[]): File[][] {
  const davky: File[][] = [];
  let davka: File[] = [];
  let velikost = 0;

  for (const s of soubory) {
    // jedna fotka sama o sobě větší než limit — pošleme ji zvlášť
    if (davka.length > 0 && velikost + s.size > LIMIT_DAVKY) {
      davky.push(davka);
      davka = [];
      velikost = 0;
    }
    davka.push(s);
    velikost += s.size;
  }
  if (davka.length) davky.push(davka);
  return davky;
}
