/**
 * Fotogalerie — akce jsou seřazené od nejnovější.
 *
 * NÁZVY AKCÍ: pole `nazev` je zatím prázdné u většiny akcí, protože z fotek
 * samotných nešlo poznat, o jakou akci šlo. Stačí sem název dopsat, například:
 *     { datum: "2026-04-30", nazev: "Pálení čarodějnic", fotky: [...] }
 * Když je `nazev` prázdný, zobrazí se místo něj jen datum.
 */

export type Fotka = { src: string; w: number; h: number };
export type Akce = { datum: string; nazev: string; popis: string; fotky: Fotka[] };

export const akce: Akce[] = [
  {
    datum: "2026-04-30",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20260430-1000033906.webp", w: 1440, h: 1920 },
      { src: "/fotky/20260430-1000033908.webp", w: 1440, h: 1920 },
      { src: "/fotky/20260430-1000033916.webp", w: 1440, h: 1920 },
      { src: "/fotky/20260430-1000033926.webp", w: 1440, h: 1920 },
      { src: "/fotky/20260430-1000033929.webp", w: 1440, h: 1920 },
      { src: "/fotky/20260430-1000033933.webp", w: 1440, h: 1920 },
      { src: "/fotky/20260430-163115.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260430-163137.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260430-img-20260430-wa0014.webp", w: 1440, h: 1920 },
    ],
  },
  {
    datum: "2026-04-14",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20260414-171146-2.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260414-171148.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260414-172352.webp", w: 1399, h: 1920 },
      { src: "/fotky/20260414-173034.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260414-173040.webp", w: 1920, h: 1080 },
      { src: "/fotky/20260414-173103.webp", w: 1920, h: 1080 },
    ],
  },
  {
    datum: "2026-04-10",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20260410-1000032947.webp", w: 1200, h: 1600 },
      { src: "/fotky/20260410-101038-3.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-105241.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-105304.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-105510.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-105824.webp", w: 1920, h: 1080 },
      { src: "/fotky/20260410-105840.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-112037.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-112055.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-112626.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-112634.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-112716.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-114640.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260410-114742.webp", w: 1920, h: 1080 },
    ],
  },
  {
    datum: "2026-04-02",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20260402-131541.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260402-160923.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260402-160934-001.webp", w: 1920, h: 1080 },
      { src: "/fotky/20260402-161029.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260402-161115.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260402-161349.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260402-161354.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260402-161357.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260402-161447.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260402-img-20260402-wa0006.webp", w: 1440, h: 1920 },
    ],
  },
  {
    datum: "2026-03-24",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20260324-141014.webp", w: 1242, h: 1920 },
    ],
  },
  {
    datum: "2026-03-06",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20260306-141851-0.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-142129.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-142144.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-142201.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-142208.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-151356.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-151533.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-151733.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-151736.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-151739.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-151748.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-151755.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-161815.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-161827.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260306-161839.webp", w: 1080, h: 1920 },
    ],
  },
  {
    datum: "2026-02-17",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20260217-163018.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260217-163030-6.webp", w: 1920, h: 1080 },
      { src: "/fotky/20260217-163053.webp", w: 1920, h: 1080 },
      { src: "/fotky/20260217-163119-1.webp", w: 1080, h: 1920 },
      { src: "/fotky/20260217-163137-001.webp", w: 1920, h: 1080 },
    ],
  },
  {
    datum: "2025-12-09",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20251209-155519.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251209-155527.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251209-160253.webp", w: 1920, h: 1080 },
      { src: "/fotky/20251209-160256-5.webp", w: 1920, h: 1080 },
      { src: "/fotky/20251209-160305.webp", w: 1920, h: 1080 },
      { src: "/fotky/20251209-160516.webp", w: 1920, h: 1080 },
      { src: "/fotky/20251209-160531.webp", w: 1920, h: 1080 },
      { src: "/fotky/20251209-160544.webp", w: 1920, h: 1080 },
    ],
  },
  {
    datum: "2025-11-30",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20251130-152525-3.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251130-152537.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251130-152540.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251130-163811.webp", w: 1920, h: 1080 },
      { src: "/fotky/20251130-164002.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251130-164517.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251130-165354.webp", w: 1920, h: 1080 },
    ],
  },
  {
    datum: "2025-11-13",
    nazev: "Divadlo v Ústí nad Labem",
    popis: "",
    fotky: [
      { src: "/fotky/20251113-160919.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251113-161010.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251113-161048.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251113-161237.webp", w: 1920, h: 1080 },
      { src: "/fotky/20251113-181055.webp", w: 1920, h: 1080 },
      { src: "/fotky/20251113-divadlo-ul.webp", w: 596, h: 674 },
      { src: "/fotky/20251113-img-20251113-wa0005.webp", w: 1200, h: 1600 },
    ],
  },
  {
    datum: "2025-10-02",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20251002-160838.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251002-165242-0.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251002-171304.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251002-172548.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251002-172708.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251002-172858-9.webp", w: 1080, h: 1920 },
      { src: "/fotky/20251002-172858.webp", w: 1080, h: 1920 },
    ],
  },
  {
    datum: "2025-06-21",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20250621-100342.webp", w: 1920, h: 1080 },
      { src: "/fotky/20250621-101849.webp", w: 1080, h: 1920 },
      { src: "/fotky/20250621-102030.webp", w: 1080, h: 1920 },
      { src: "/fotky/20250621-115928.webp", w: 1080, h: 1920 },
      { src: "/fotky/20250621-122814.webp", w: 1920, h: 1080 },
      { src: "/fotky/20250621-122849.webp", w: 1080, h: 1920 },
      { src: "/fotky/20250621-123512.webp", w: 1080, h: 1920 },
      { src: "/fotky/20250621-131723.webp", w: 1920, h: 1080 },
      { src: "/fotky/20250621-135349.webp", w: 1080, h: 1920 },
    ],
  },
  {
    datum: "2025-04-03",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20250403-160926.webp", w: 1920, h: 1080 },
      { src: "/fotky/20250403-165822.webp", w: 1920, h: 1080 },
      { src: "/fotky/20250403-165830.webp", w: 1080, h: 1920 },
      { src: "/fotky/20250403-171751-1.webp", w: 1920, h: 1739 },
    ],
  },
  {
    datum: "2025-03-06",
    nazev: "",
    popis: "",
    fotky: [
      { src: "/fotky/20250306-164435.webp", w: 1080, h: 1920 },
      { src: "/fotky/20250306-164443.webp", w: 1080, h: 1920 },
      { src: "/fotky/20250306-164455.webp", w: 1080, h: 1920 },
      { src: "/fotky/20250306-171158.webp", w: 1920, h: 1080 },
    ],
  },
];

const MESICE = ["ledna","února","března","dubna","května","června",
                "července","srpna","září","října","listopadu","prosince"];

/** "2026-04-30" → "30. dubna 2026" */
export function formatDatum(iso: string): string {
  const [r, m, d] = iso.split("-");
  return `${Number(d)}. ${MESICE[Number(m) - 1]} ${r}`;
}

/** Nadpis akce — název, pokud je vyplněný, jinak datum. */
export function nadpisAkce(a: Akce): string {
  return a.nazev || formatDatum(a.datum);
}

export const pocetFotek = akce.reduce((n, a) => n + a.fotky.length, 0);
export const pocetAkci = akce.length;
