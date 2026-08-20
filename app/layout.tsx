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
    default: `${spolek.nazev} — ${spolek.pobocka}`,
    template: `%s | ${spolek.nazev} ${spolek.pobocka}`,
  },
  description:
    "Základní organizace Českého svazu žen v Novosedlicích. Pořádáme kulturní " +
    "a společenské akce, výlety a setkání a podporujeme zapojení žen do veřejného života.",
  keywords: [
    "Český svaz žen",
    "Novosedlice",
    "ZO Novosedlice",
    "spolek",
    "ženy",
    "komunitní život",
  ],
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    siteName: `${spolek.nazev} ${spolek.pobocka}`,
    title: `${spolek.nazev} — ${spolek.pobocka}`,
    description: spolek.motto,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: spolek.plnyNazev,
    alternateName: `${spolek.nazev} ${spolek.pobocka}`,
    slogan: spolek.motto,
    email: spolek.email,
    telephone: spolek.telefon,
    address: {
      "@type": "PostalAddress",
      streetAddress: spolek.ulice,
      postalCode: spolek.psc,
      addressLocality: spolek.mesto,
      addressCountry: "CZ",
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
