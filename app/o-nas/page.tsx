import type { Metadata } from "next";
import Image from "next/image";
import HlavickaStranky from "@/components/HlavickaStranky";
import Tlacitko from "@/components/Tlacitko";
import { oNas } from "@/lib/obsah";

export const metadata: Metadata = {
  title: "O nás",
  description:
    "Český svaz žen z. s. je nezávislý dobrovolný spolek. Naše základní organizace " +
    "působí v Novosedlicích — pořádáme kulturní akce, besedy a podporujeme komunitní život.",
};

export default function ONasStranka() {
  return (
    <>
      <HlavickaStranky nadnadpis="Kdo jsme" nadpis="O nás" />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="space-y-6 text-lg leading-relaxed text-inkoust-50">
            <p className="text-[1.35rem] leading-relaxed text-inkoust">
              {oNas.hlavni}
            </p>
            <p>{oNas.hlavni2}</p>
          </div>

          {/* sticky obal zvlášť — Image s `fill` potřebuje rodiče s position: relative */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-linka">
              <Image
                src="/fotky/20260410-105824.webp"
                alt="Setkání členek Českého svazu žen v Novosedlicích"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pro ženy / pro společnost */}
      <section className="border-y border-linka bg-papir-tmavy/50">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 sm:py-24 md:grid-cols-2 md:gap-14">
          <Karta nadpis="Pro ženy" text={oNas.proZeny} />
          <Karta nadpis="Pro společnost" text={oNas.proSpolecnost} />
        </div>
      </section>

      {/* Naše činnost */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <h2 className="ozdoba text-3xl sm:text-4xl">Naše činnost</h2>
        <p className="mt-7 max-w-2xl text-lg leading-relaxed text-inkoust-50">
          Čemu se v Novosedlicích věnujeme a co pro členky i veřejnost
          připravujeme.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {oNas.cinnost.map((c, i) => (
            <article
              key={c.nadpis}
              className="flex flex-col rounded-2xl border border-linka bg-papir p-8 transition-shadow hover:shadow-md"
            >
              <span className="font-[family-name:var(--font-nadpis)] text-3xl text-okr">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-xl">{c.nadpis}</h3>
              <p className="mt-4 leading-relaxed text-inkoust-50">{c.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Tlacitko href="/fotogalerie" varianta="obrys">
            Podívejte se na fotky z akcí
          </Tlacitko>
          <Tlacitko href="/kontakt">Chci se zapojit</Tlacitko>
        </div>
      </section>
    </>
  );
}

function Karta({ nadpis, text }: { nadpis: string; text: string }) {
  return (
    <div>
      <h2 className="ozdoba text-2xl sm:text-3xl">{nadpis}</h2>
      <p className="mt-7 text-lg leading-relaxed text-inkoust-50">{text}</p>
    </div>
  );
}
