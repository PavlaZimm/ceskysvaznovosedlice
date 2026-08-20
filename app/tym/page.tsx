import type { Metadata } from "next";
import HlavickaStranky from "@/components/HlavickaStranky";
import Tlacitko from "@/components/Tlacitko";
import { tym } from "@/lib/obsah";

export const metadata: Metadata = {
  title: "Tým",
  description:
    "Výbor základní organizace Českého svazu žen v Novosedlicích — předsedkyně, " +
    "místopředsedkyně a jednatelka.",
};

/** Iniciály ze jména, tituly se přeskočí. */
function iniciely(jmeno: string): string {
  return jmeno
    .split(" ")
    .filter((c) => !c.includes("."))
    .slice(0, 2)
    .map((c) => c[0])
    .join("");
}

export default function TymStranka() {
  return (
    <>
      <HlavickaStranky nadnadpis="Kdo to vede" nadpis="Náš tým" perex={tym.uvod} />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tym.clenky.map((c) => (
            <article
              key={c.jmeno}
              className="flex flex-col items-center rounded-2xl border border-linka bg-papir px-8 py-12 text-center transition-shadow hover:shadow-md"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(138,46,65,0.12),rgba(192,138,62,0.18))] font-[family-name:var(--font-nadpis)] text-3xl text-vino">
                {iniciely(c.jmeno)}
              </div>
              <p className="mt-7 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-vino">
                {c.funkce}
              </p>
              <h2 className="mt-3 text-xl">{c.jmeno}</h2>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-linka bg-papir-tmavy/50 px-8 py-12 text-center sm:px-14">
          <h2 className="text-2xl sm:text-3xl">Přidejte se k nám</h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-inkoust-50">
            Členkou se může stát každá žena, která chce být součástí aktivní
            komunity. Stačí se ozvat — rády vám všechno vysvětlíme.
          </p>
          <div className="mt-9">
            <Tlacitko href="/kontakt">Napište nám</Tlacitko>
          </div>
        </div>
      </section>
    </>
  );
}
