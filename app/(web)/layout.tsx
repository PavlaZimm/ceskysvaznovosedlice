import Hlavicka from "@/components/Hlavicka";
import Paticka from "@/components/Paticka";
import { urlWebu } from "@/lib/obsah";

import { verejneStranky } from "@/lib/verejny-obsah";

/** Layout veřejné části webu. Správa na /sprava ho nepoužívá. */
export default async function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { spolek, navigace } = await verejneStranky();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${urlWebu}/#organizace`,
    name: spolek.plnyNazev,
    alternateName: [
      `${spolek.nazev} ${spolek.pobocka}`,
      `${spolek.nazev} ${spolek.mesto}`,
      `ČSŽ ${spolek.mesto}`,
    ],
    slogan: spolek.motto,
    description:
      "Základní organizace Českého svazu žen v Novosedlicích u Teplic. " +
      "Pořádáme kulturní a společenské akce, besedy, výlety a setkání.",
    url: urlWebu,
    email: spolek.email,
    telephone: spolek.telefon,
    address: {
      "@type": "PostalAddress",
      streetAddress: spolek.ulice,
      postalCode: spolek.psc,
      addressLocality: spolek.mesto,
      addressRegion: spolek.kraj,
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: spolek.lat,
      longitude: spolek.lon,
    },
    areaServed: [
      { "@type": "Place", name: spolek.mesto },
      { "@type": "Place", name: `okres ${spolek.okres}` },
    ],
    parentOrganization: {
      "@type": "NGO",
      name: "Český svaz žen z. s.",
      url: "https://www.csz.cz",
    },
  };

  return (
    <>
      <a
        href="#obsah"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-vino focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-papir"
      >
        Přeskočit na obsah
      </a>
      <Hlavicka spolek={spolek} navigace={navigace} />
      <main id="obsah" className="flex-1">
        {children}
      </main>
      <Paticka spolek={spolek} navigace={navigace} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
