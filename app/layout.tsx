import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
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
  return (
    <html lang="cs" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
