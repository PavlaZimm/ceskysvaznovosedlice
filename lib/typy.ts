/** Datové typy obsahu webu. Data samotná jsou v `obsah/*.json`. */

export type Spolek = {
  nazev: string;
  pobocka: string;
  plnyNazev: string;
  motto: string;
  email: string;
  telefon: string;
  telefonHref: string;
  ulice: string;
  psc: string;
  mesto: string;
  mapaUrl: string;
  okres: string;
  kraj: string;
  lat: number;
  lon: number;
};

export type OdkazVMenu = { href: string; label: string };

export type Uvod = {
  perex: string;
  copDelame: string[];
  proKoho: string[];
  onasKratce: string;
  galerieKratce: string;
};

export type ONas = {
  hlavni: string;
  hlavni2: string;
  proZeny: string;
  proSpolecnost: string;
  cinnost: { nadpis: string; text: string }[];
};

export type Tym = {
  uvod: string;
  clenky: { funkce: string; jmeno: string }[];
};

export type Kontakt = {
  uvod: string;
  zpusoby: { nadpis: string; text: string }[];
};

export type Stranky = {
  spolek: Spolek;
  navigace: OdkazVMenu[];
  uvod: Uvod;
  oNas: ONas;
  tym: Tym;
  kontakt: Kontakt;
};

export type Fotka = { src: string; w: number; h: number };
export type Akce = { id: string; datum: string; nazev: string; popis: string; fotky: Fotka[] };
export type Galerie = { akce: Akce[] };
