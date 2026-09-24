import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export const pouzivaDatabazi = Boolean(process.env.DATABASE_URL);
let klient: NeonQueryFunction<false, false> | undefined;

export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Databáze není připojena.");
  return (klient ??= neon(url));
}
