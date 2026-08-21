import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Hlavicka from "@/components/Hlavicka";
import Paticka from "@/components/Paticka";
import { spolek, urlWebu } from "@/lib/obsah";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(urlWebu),
  title: {
    default: "Český svaz žen Novosedlice — spolek žen v naší obci",
    // Podstránky si titulek nastavují celý samy (viz `title` v jednotlivých page.tsx),
    // aby se vešly do 60 znaků i s lokalitou.
    template: "%s",
  },
  description:
    "Základní organizace Českého svazu žen v Novosedlicích u Teplic. Pořádáme " +
    "besedy, výlety, divadlo a společná setkání. Přidejte se k nám, jste vítány.",
  keywords: [
    "Český svaz žen",
    "Novosedlice",
    "ZO Novosedlice",
    "spolek",
    "ženy",
    "komunitní život",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "/",
    siteName: `${spolek.nazev} ${spolek.pobocka}`,
    title: "Český svaz žen Novosedlice — spolek žen v naší obci",
    description:
      "Pořádáme besedy, výlety, divadlo a společná setkání v Novosedlicích u Teplic.",
    images: [
      { url: "/og.jpg", width: 1200, height: 630, alt: "Český svaz žen Novosedlice" },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <html lang="cs" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#obsah"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-vino focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-papir"
        >
          Přeskočit na obsah
        </a>
        <Hlavicka />
        <main id="obsah" className="flex-1">
          {children}
        </main>
        <Paticka />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
