/**
 * Přihlášení do správy webu.
 *
 * Jedno sdílené heslo (proměnná prostředí SPRAVA_HESLO). Po přihlášení se
 * uloží podepsaná cookie, která platí 30 dní. Žádná databáze uživatelů —
 * na spolek se třemi lidmi ve výboru je to dostatečné a nejmíň se to plete.
 */
import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "sprava";
const PLATNOST_DNI = 30;

function tajemstvi(): string {
  const t = process.env.SPRAVA_TAJEMSTVI ?? process.env.SPRAVA_HESLO;
  if (!t) throw new Error("Chybí SPRAVA_HESLO / SPRAVA_TAJEMSTVI.");
  return `${t}:${process.env.SPRAVA_HESLO ?? ""}`;
}

function podepis(data: string): string {
  return createHmac("sha256", tajemstvi()).update(data).digest("base64url");
}

/** Porovnání odolné vůči měření času odpovědi. */
function shodujeSe(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    // i tak porovnáme, ať trvá stejně dlouho
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

export function hesloSedi(zadane: string): boolean {
  const spravne = process.env.SPRAVA_HESLO;
  if (!spravne) return false;
  return shodujeSe(zadane, spravne);
}

export async function prihlas(): Promise<void> {
  const platiDo = Date.now() + PLATNOST_DNI * 86_400_000;
  const nahoda = randomBytes(8).toString("hex");
  const data = `${platiDo}.${nahoda}`;
  const c = await cookies();
  c.set(COOKIE, `${data}.${podepis(data)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PLATNOST_DNI * 86_400,
  });
}

export async function odhlas(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE);
}

export async function jePrihlasen(): Promise<boolean> {
  try {
    const c = await cookies();
    const hodnota = c.get(COOKIE)?.value;
    if (!hodnota) return false;
    const casti = hodnota.split(".");
    if (casti.length !== 3) return false;
    const [platiDo, nahoda, podpis] = casti;
    if (!platiDo || !nahoda || !podpis) return false;
    if (!shodujeSe(podpis, podepis(`${platiDo}.${nahoda}`))) return false;
    return Number(platiDo) > Date.now();
  } catch {
    return false;
  }
}

/** Použít na začátku každé serverové akce, která mění obsah. */
export async function overPrihlaseni(): Promise<void> {
  if (!(await jePrihlasen())) throw new Error("Nejste přihlášeni.");
}
