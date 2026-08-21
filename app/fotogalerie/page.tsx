import type { Metadata } from "next";
import Galerie from "@/components/Galerie";
import HlavickaStranky from "@/components/HlavickaStranky";
import { akce, pocetAkci, pocetFotek } from "@/lib/fotky";

export const metadata: Metadata = {
  title: "Fotogalerie z akcí | Český svaz žen Novosedlice",
  description:
    `${pocetFotek} fotografií ze ${pocetAkci} akcí našeho spolku v Novosedlicích — ` +
    "besedy, výlety, divadlo i tvořivá odpoledne. Prohlédněte si sami, jak se u nás žije.",
  alternates: { canonical: "/fotogalerie" },
  openGraph: {
    title: "Fotogalerie z akcí | Český svaz žen Novosedlice",
    description: `${pocetFotek} fotografií ze ${pocetAkci} akcí našeho spolku v Novosedlicích.`,
    url: "/fotogalerie",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Český svaz žen Novosedlice" }],
  },
};

export default function FotogalerieStranka() {
  return (
    <>
      <HlavickaStranky
        nadnadpis={`${pocetFotek} fotografií z ${pocetAkci} akcí`}
        nadpis="Fotogalerie z našich akcí"
        perex={
          "V naší fotogalerii najdete snímky z různých akcí, které pořádáme jako " +
          "základní organizace Českého svazu žen v Novosedlicích. Zahrnují přednášky, " +
          "schůze, výlety i další společenské aktivity."
        }
      />

      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Galerie akce={akce} />
      </div>
    </>
  );
}
