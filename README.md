# Český svaz žen — ZO Novosedlice

Web https://csznovosedlice.cz, Next.js 16, React 19, Tailwind CSS 4.
Správa: https://csznovosedlice.cz/sprava. Návod pro výbor: [NAVOD-SPRAVA.md](NAVOD-SPRAVA.md).

## Ukládání obsahu

Texty, kontakty a galerie jsou v Neon Postgres. Nové fotografie se zmenšují na nejvýše 1920 px a ukládají do Vercel Blob. Původní fotografie zůstávají v `public/fotky`. Uložení ve správě obnoví cache veřejného webu, nevyžaduje commit ani nové nasazení.

Každý zápis obsahu uchová předchozí verzi v `csz_content_history`. Podmínka na číslo revize zabrání přepsání souběžného zápisu. Smazání fotografie odstraní její odkaz z galerie; fyzický soubor zůstává pro případ obnovy. Historie v téže databázi není nezávislá záloha. Před většími zásahy exportujte databázi. Trvalé odstranění snímku musí správce provést i v Blob/Gitu a v historii.

## Spuštění

Použijte Node.js 24, `npm ci`, vytvořte `.env.local` podle `.env.example`, pak `npm run dev`. Bez DATABASE_URL běží lokální vývoj nad JSON soubory; na Vercelu je zápis bez databáze zakázán.

Po propojení se správným projektem pomocí `vercel link` lze stáhnout vývojové přístupy: `vercel env pull .env.local`. Nikdy nedávejte produkční přístupy do preview. Projekt používá oddělené databáze a Blob úložiště pro produkci a preview/vývoj.

## Inicializace a nasazení

1. Nastavte serverové proměnné DATABASE_URL, BLOB_READ_WRITE_TOKEN, SPRAVA_HESLO a SPRAVA_TAJEMSTVI. Veřejná NEXT_PUBLIC_URL_WEBU je https://csznovosedlice.cz.
2. S přístupy správného prostředí spusťte `npm run db:init`. Vytvoří tabulky a vloží původní JSON pouze tam, kde obsah dosud neexistuje. Opakované spuštění obsah nepřepíše.
3. Ověřte `npm test`, `npm run typecheck` a sestavení/preview na Vercelu.
4. Push do main spouští produkční sestavení přes GitHub integraci Vercelu.

Přístupové údaje nepatří do Gitu, návodu pro veřejnost ani proměnných NEXT_PUBLIC_. Změna SPRAVA_HESLO zneplatní přihlášení po nasazení nové konfigurace. Přihlašování má omezení pokusů uložené v databázi.

## Obnova

Správce může vybrat předchozí obsah z `csz_content_history` podle `key` a `revision` a obnovit jej do `csz_content` podmíněným UPDATE s aktuální revizí. Aktualizace musí zvýšit revision o 1; trigger zachová i nahrazený obsah. Po obnově obnovte cache novým nasazením nebo vyčkejte na běžnou revalidaci (5 minut). Obnovu nejprve ověřte v testovací databázi.

## Údržba

Správa mění živou databázi, JSON v repozitáři je počáteční obsah. Vzhled upravujte v app/ a components/. Sledujte využití Neon a Blob ve Vercelu; bezplatné tarify mají limity. Staré a nepoužité snímky se automaticky nemažou. Odkazy a kroky pro propagaci jsou v SEO-KROKY.md.
