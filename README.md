# Český svaz žen — ZO Novosedlice

Web spolku. Postaveno na Next.js 15 (App Router), Tailwind CSS 4 a TypeScriptu.
Nasazuje se na Vercel.

Nahrazuje původní web na Webnode (`cesky-svaz-zen-51b715.webnode.cz`) — všechny
texty i fotografie jsou převzaté odtud.

---

## Spuštění na vlastním počítači

```bash
npm install
npm run dev
```

Web pak běží na <http://localhost:3000>.

## Nasazení

Push do `main` → Vercel automaticky sestaví a nasadí. Žádné nastavení není
potřeba, Vercel Next.js pozná sám.

---

## Kde co upravit

| Co chci změnit | Soubor |
|---|---|
| Texty, adresa, e-mail, telefon, jména ve výboru | `lib/obsah.ts` |
| Fotogalerie — názvy akcí, pořadí | `lib/fotky.ts` |
| Fotografie | `public/fotky/` |
| Barvy a písma | `app/globals.css` (sekce `@theme`) |
| Položky v menu | `lib/obsah.ts` → `navigace` |

### Změna textu

Skoro všechny texty jsou v `lib/obsah.ts`. Stačí přepsat text v uvozovkách
a uložit — projeví se všude, kde se používá (např. e-mail je zároveň
v patičce, na kontaktu i v odkazu „napsat e-mail").

### Doplnění názvů akcí ve fotogalerii

V `lib/fotky.ts` má každá akce pole `nazev`, které je zatím prázdné — z fotek
nešlo poznat, o jakou akci šlo. Když název doplníte, zobrazí se místo data:

```ts
{
  datum: "2026-04-30",
  nazev: "Pálení čarodějnic",        // ← dopsat
  popis: "Tradiční setkání u ohně.",  // ← nepovinné, zobrazí se pod nadpisem
  fotky: [ ... ],
},
```

Když `nazev` zůstane prázdný, ukáže se datum („30. dubna 2026"). Nic se
nerozbije.

### Přidání nových fotek

1. Zkopírujte soubory do `public/fotky/`.
2. V `lib/fotky.ts` přidejte novou položku na **začátek** pole `akce`
   (akce jsou řazené od nejnovější):

```ts
{
  datum: "2026-06-15",
  nazev: "Výlet do Litoměřic",
  popis: "",
  fotky: [
    { src: "/fotky/nazev-souboru.webp", w: 1920, h: 1080 },
  ],
},
```

`w` a `h` jsou rozměry fotky v pixelech. Musí odpovídat skutečnosti, jinak
bude fotka v mřížce deformovaná.

---

## Struktura

```
app/            stránky (každá složka = jedna adresa)
  page.tsx        úvod
  o-nas/          o nás
  fotogalerie/    fotogalerie
  tym/            tým
  kontakt/        kontakt
  layout.tsx      společný obal (hlavička, patička, SEO)
  globals.css     barvy, písma, základní styly
components/     hlavička, patička, galerie s lightboxem, tlačítko
lib/            obsah.ts (texty), fotky.ts (galerie)
public/fotky/   fotografie
```

## Co web umí

- 5 stránek, všechny se generují staticky (rychlé načtení)
- Fotogalerie: 106 fotek ve 14 akcích, lightbox s ovládáním klávesnicí
  (šipky, Esc)
- Responzivní — mobil, tablet, počítač
- SEO: meta popisky, Open Graph, `sitemap.xml`, `robots.txt`,
  strukturovaná data (schema.org NGO)
- Bez cookies a bez služeb třetích stran → není potřeba cookie lišta
