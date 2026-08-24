/**
 * Texty webu.
 *
 * Data jsou v `obsah/stranky.json` — ten se dá upravit ručně, nebo přes
 * správu na /sprava. Tenhle soubor je jen typované napojení na ten JSON.
 */
import data from "@/obsah/stranky.json";
import type { Stranky } from "./typy";

const stranky = data as Stranky;

export const spolek = stranky.spolek;
export const navigace = stranky.navigace;
export const uvod = stranky.uvod;
export const oNas = stranky.oNas;
export const tym = stranky.tym;
export const kontakt = stranky.kontakt;

/**
 * Adresa webu — používá se v sitemap.xml, robots.txt, canonical odkazech
 * a v náhledech odkazů na sociálních sítích.
 */
export const urlWebu =
  // 1. vlastní doména, až bude (nastavte na Vercelu NEXT_PUBLIC_URL_WEBU)
  process.env.NEXT_PUBLIC_URL_WEBU ??
  // 2. jinak adresa, kterou přidělil Vercel — canonical a sitemap tak míří
  //    na skutečně existující web i před koupí domény
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
