# Aby web někdo našel — co udělat po spuštění

Technická část je hotová (titulky, popisky, ALT texty, sitemapa, strukturovaná
data). To ale samo o sobě návštěvníky nepřivede. Zbytek jsou kroky mimo web
a musí je udělat člověk.

Seřazeno podle toho, co má největší efekt.

---

## 1. Google Search Console — nahlásit web Googlu

**Bez tohohle kroku může trvat týdny, než se web vůbec objeví ve vyhledávání.**

1. Otevřít <https://search.google.com/search-console>
2. Přihlásit se Google účtem → *Přidat službu* → **Předpona URL**
3. Vložit adresu webu (`https://…vercel.app`, později vlastní doménu)
4. Ověřit vlastnictví — nejjednodušší je stažení HTML souboru:
   soubor se uloží do složky `public/`, pak commit a push
5. Po ověření vlevo *Sitemapy* → vložit `sitemap.xml` → **Odeslat**
6. Tamtéž *Kontrola URL* → vložit adresu úvodní stránky → *Požádat o indexaci*

Výsledek se obvykle projeví do několika dní. V Search Console se pak dá sledovat,
na co lidé web našli.

---

## 2. Odkaz z webu obce Novosedlice

**Pro místní spolek nejsilnější signál vůbec.** Google bere odkaz z obecního webu
jako potvrzení, že spolek v obci opravdu působí.

Napsat na **podatelna@novosedlice.cz** s prosbou o zveřejnění odkazu mezi spolky
a organizacemi v obci. Návrh textu:

> Dobrý den,
>
> naše základní organizace Českého svazu žen v Novosedlicích spustila nové
> webové stránky: [adresa webu]
>
> Prosíme o doplnění odkazu mezi spolky a organizace působící v obci, případně
> o zmínku v obecním zpravodaji.
>
> Děkujeme,
> [jméno], Český svaz žen ZO Novosedlice

---

## 3. Odkaz z csz.cz

Ústředí Českého svazu žen (<https://www.csz.cz>) vede přehled základních
organizací. Požádat o doplnění odkazu na náš web u naší organizace.

---

## 4. Facebook

Pokud spolek stránku má:
- doplnit adresu webu do pole *Web* v informacích o stránce
- jednou web nasdílet do příspěvku

Náhledový obrázek je připravený (`public/og.jpg`), takže odkaz se zobrazí
s fotkou a názvem, ne jako holý text.

---

## 5. Doplnit názvy akcí ve fotogalerii

V `lib/fotky.ts` má 13 ze 14 akcí prázdné pole `nazev` a zobrazuje se jen datum.
Názvy jako „Pálení čarodějnic" nebo „Zájezd do Litoměřic" jsou přesně to, co
lidé hledají — a promítnou se zároveň do ALT textů u fotek.

Návod je v `README.md`.

---

## 6. Až bude vlastní doména

Nastavit na Vercelu proměnnou prostředí `NEXT_PUBLIC_URL_WEBU` na novou adresu
(*Project → Settings → Environment Variables*), pak znovu nasadit.
Do kódu není potřeba sahat.

Pozor: v Search Console je pak nutné **přidat novou doménu jako další službu** —
ověření se z `vercel.app` nepřenese.

---

## Co nedělat

- **Neplatit za „registraci do 500 katalogů".** Katalogové odkazy dnes nepomáhají
  a mohou uškodit.
- **Necpát klíčová slova do textů.** Titulky a popisky jsou nastavené v pásmu,
  které Google neořezává; přepisovat je není třeba.
- **Nečekat výsledky za týden.** Nový web se usazuje řádově týdny až měsíce.
