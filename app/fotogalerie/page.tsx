import type { Metadata } from "next";
import Galerie from "@/components/Galerie";
import HlavickaStranky from "@/components/HlavickaStranky";
import { akce, pocetAkci, pocetFotek } from "@/lib/fotky";

export const metadata: Metadata = {
  title: "Fotogalerie",
  description:
    `${pocetFotek} fotografií z ${pocetAkci} akcí Českého svazu žen v Novosedlicích — ` +
    "besedy, výlety, divadlo, tvořivá odpoledne a společná setkání.",
};

export default function FotogalerieStranka() {
  return (
    <>
      <HlavickaStranky
        nadnadpis={`${pocetFotek} fotografií z ${pocetAkci} akcí`}
        nadpis="Fotogalerie"
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
