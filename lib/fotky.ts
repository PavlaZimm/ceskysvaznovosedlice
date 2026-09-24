/**
 * Fotogalerie.
 *
 * Data jsou v `obsah/galerie.json`, spravují se na /sprava/fotogalerie.
 * Akce jsou seřazené od nejnovější.
 */
import type { Akce } from "./typy";

export type { Akce, Fotka } from "./typy";


const MESICE = [
  "ledna", "února", "března", "dubna", "května", "června",
  "července", "srpna", "září", "října", "listopadu", "prosince",
];

/** "2026-04-30" → "30. dubna 2026" */
export function formatDatum(iso: string): string {
  const [r, m, d] = iso.split("-");
  return `${Number(d)}. ${MESICE[Number(m) - 1]} ${r}`;
}

/** Nadpis akce — název, pokud je vyplněný, jinak datum. */
export function nadpisAkce(a: Akce): string {
  return a.nazev || formatDatum(a.datum);
}
