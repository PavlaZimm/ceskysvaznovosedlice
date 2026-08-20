/**
 * Veškeré texty a kontaktní údaje webu na jednom místě.
 * Chcete-li něco změnit, upravte to zde — projeví se to všude.
 */

/**
 * ZMĚŇTE PO KOUPI DOMÉNY.
 * Používá se pro odkazy v sitemap.xml, robots.txt a Open Graph náhledech.
 * Bez lomítka na konci. Na Vercelu lze přepsat proměnnou NEXT_PUBLIC_URL_WEBU.
 */
export const urlWebu =
  process.env.NEXT_PUBLIC_URL_WEBU ?? "https://csz-novosedlice.cz";

export const spolek = {
  nazev: "Český svaz žen",
  pobocka: "ZO Novosedlice",
  plnyNazev: "Český svaz žen z. s. — základní organizace Novosedlice",
  motto: "Společně pro lepší život žen.",
  email: "svazzennovosedlice@seznam.cz",
  telefon: "+420 775 643 743",
  telefonHref: "+420775643743",
  ulice: "Míru 86",
  psc: "417 31",
  mesto: "Novosedlice",
  mapaUrl:
    "https://www.google.com/maps/search/?api=1&query=M%C3%ADru+86%2C+417+31+Novosedlice",
};

export const navigace = [
  { href: "/", label: "Úvod" },
  { href: "/o-nas", label: "O nás" },
  { href: "/fotogalerie", label: "Fotogalerie" },
  { href: "/tym", label: "Tým" },
  { href: "/kontakt", label: "Kontakt" },
];

export const uvod = {
  perex:
    "Vítejte na stránkách Českého svazu žen — základní organizace v Novosedlicích. " +
    "Jsme společenstvím žen, které se snaží podporovat a prosazovat rovnoprávnost " +
    "a důstojnost žen ve společnosti. Přidejte se k nám a buďte součástí pozitivního " +
    "posunu v naší obci.",
  copDelame: [
    "Pořádáme společenské a kulturní akce",
    "Organizujeme výlety a setkání",
    "Podporujeme tradice a komunitní život",
    "Tvoříme, bavíme se, slavíme a pomáháme",
  ],
  proKoho: [
    "Pro ženy všech věkových kategorií",
    "Pro všechny, které chtějí být součástí aktivní komunity",
    "Pro každého, kdo rád tráví čas ve společnosti příjemných lidí",
  ],
  onasKratce:
    "Jsme základní organizace Českého svazu žen v Novosedlicích. Pořádáme kulturní " +
    "a společenské akce a podporujeme zapojení žen do veřejného života. Přidejte se " +
    "k nám a společně budujme silnější a aktivnější společnost.",
  galerieKratce:
    "V naší fotogalerii najdete snímky ze společenských akcí, setkání a aktivit " +
    "našeho spolku. Můžete se podívat na zábavné i poučné momenty z našeho života " +
    "a být v obraze s našimi nejnovějšími událostmi.",
};

export const oNas = {
  hlavni:
    "Český svaz žen z. s. (ČSŽ) je nezávislý, dobrovolný spolek, který působí na celém " +
    "území České republiky; naše organizační struktura je tak budována na základě " +
    "územního principu. Sdružujeme ženy bez ohledu na jejich národnost, náboženskou " +
    "víru, politickou příslušnost, sociální postavení, profese a zájmy a jsme zároveň " +
    "otevřeny spolupráci se všemi sympatizujícími organizacemi i jednotlivci.",
  hlavni2:
    "Posláním našeho spolku je podporovat činnost žen na všech úrovních, inspirovat, " +
    "podněcovat aktivity a tvořivost nejen našich členek. Ve svém programu se hlásíme " +
    "k základním dokumentům přijatým mezinárodním ženským hnutím a opíráme se " +
    "o mezinárodní dokumenty, k nimž se přihlásila Česká republika.",
  proZeny:
    "Český svaz žen z. s. je nevládní organizací s velmi početnou členskou základnou, " +
    "která působí převážně na dobrovolnické bázi ve prospěch a v zájmu žen a jejich práv.",
  proSpolecnost:
    "Naše základní organizace se zaměřuje na podporu a rozvoj žen. Sídlíme " +
    "v Novosedlicích, ale svaz jako celek působí po celé zemi. Věříme v rovnost " +
    "pohlaví a zasazujeme se o práva a možnosti žen ve společnosti.",
  cinnost: [
    {
      nadpis: "Kulturní a společenské akce",
      text:
        "Kulturní a společenské akce jsou důležitým prvkem společenského života. " +
        "Umožňují lidem setkávat se, sdílet zážitky a rozvíjet své zájmy i vzájemné vztahy. " +
        "Pořádáme besedy, posezení, tvořivá odpoledne, návštěvy divadla a společné výlety.",
    },
    {
      nadpis: "Zdravotní prevence pro ženy",
      text:
        "Zdravotní prevence je základem pro udržení fyzického i duševního zdraví. " +
        "Zahrnuje pravidelnou návštěvu lékaře, zdravý životní styl a včasnou diagnostiku " +
        "možných onemocnění. Tématu se věnujeme na přednáškách a besedách s odborníky.",
    },
    {
      nadpis: "Komunitní život v obci",
      text:
        "Podporujeme tradice a sousedské vztahy v Novosedlicích. Zapojujeme se do dění " +
        "v obci, pomáháme tam, kde je potřeba, a vytváříme prostor, kde se lidé " +
        "různých generací potkávají.",
    },
  ],
};

export const tym = {
  uvod:
    "Jsme tým zanícených žen, které se snaží podporovat a posilovat postavení žen " +
    "ve společnosti. Společně se angažujeme v projektech a aktivitách, jež pomáhají " +
    "ženám dosáhnout rovnoprávnosti a úspěchu. Naše sídlo je v Novosedlicích, " +
    "svaz jako celek působí v celé České republice.",
  clenky: [
    { funkce: "Předsedkyně", jmeno: "Dana Židková" },
    { funkce: "Místopředsedkyně", jmeno: "Mgr. Stanislava Hajná" },
    { funkce: "Jednatelka", jmeno: "Ing. Zuzana Müllerová" },
  ],
};

export const kontakt = {
  uvod:
    "Máte zájem se zapojit do našeho spolku, nebo se chcete dozvědět víc o naší " +
    "činnosti? Ozvěte se nám — rády vám odpovíme.",
  zpusoby: [
    {
      nadpis: "Napište nám",
      text:
        "E-mail je nejrychlejší a nejpohodlnější cesta. Zprávy čteme pravidelně " +
        "a odpovídáme obvykle do několika dní.",
    },
    {
      nadpis: "Zavolejte",
      text:
        "Pokud dáváte přednost osobnímu hovoru, zavolejte nám. Ráda vám vše " +
        "vysvětlíme a domluvíme se na setkání.",
    },
    {
      nadpis: "Přijďte mezi nás",
      text:
        "Nejlepší je vidět to na vlastní oči. Přijďte na některou z našich akcí — " +
        "nové tváře jsou u nás vždy vítány.",
    },
  ],
};
