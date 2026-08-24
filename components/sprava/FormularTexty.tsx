"use client";

import { useActionState } from "react";
import { ulozTexty } from "@/app/sprava/akce";
import type { ONas, Uvod } from "@/lib/typy";
import Hlaska from "./Hlaska";
import { Pole } from "./Pole";
import Tlacitko from "./Tlacitko";

type Data = {
  motto: string;
  uvod: Uvod;
  oNas: ONas;
  tymUvod: string;
  kontaktUvod: string;
};

function Sekce({ nadpis, children }: { nadpis: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-linka bg-papir p-6">
      <h2 className="text-xl">{nadpis}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export default function FormularTexty({ data }: { data: Data }) {
  const [stav, akce, ceka] = useActionState(ulozTexty, null);

  return (
    <form action={akce} className="mt-8 space-y-6">
      <Sekce nadpis="Úvodní stránka">
        <Pole jmeno="motto" popisek="Hlavní heslo" hodnota={data.motto} />
        <Pole jmeno="perex" popisek="Uvítací odstavec" hodnota={data.uvod.perex} radku={4} />
        <Pole
          jmeno="copDelame"
          popisek="Co děláme"
          hodnota={data.uvod.copDelame.join("\n")}
          radku={4}
          napoveda="Každý řádek je jedna odrážka."
        />
        <Pole
          jmeno="proKoho"
          popisek="Pro koho je svaz určen"
          hodnota={data.uvod.proKoho.join("\n")}
          radku={3}
          napoveda="Každý řádek je jedna odrážka."
        />
        <Pole jmeno="onasKratce" popisek="Odstavec „O nás“ na úvodu" hodnota={data.uvod.onasKratce} radku={3} />
        <Pole jmeno="galerieKratce" popisek="Odstavec „Ženy v akci“" hodnota={data.uvod.galerieKratce} radku={3} />
      </Sekce>

      <Sekce nadpis="Stránka O nás">
        <Pole jmeno="oNasHlavni" popisek="První odstavec" hodnota={data.oNas.hlavni} radku={5} />
        <Pole jmeno="oNasHlavni2" popisek="Druhý odstavec" hodnota={data.oNas.hlavni2} radku={4} />
        <Pole jmeno="proZeny" popisek="Pro ženy" hodnota={data.oNas.proZeny} radku={3} />
        <Pole jmeno="proSpolecnost" popisek="Pro společnost" hodnota={data.oNas.proSpolecnost} radku={3} />
      </Sekce>

      <Sekce nadpis="Naše činnost">
        {data.oNas.cinnost.map((c, i) => (
          <div key={i} className="space-y-4 border-b border-linka pb-5 last:border-0 last:pb-0">
            <Pole jmeno={`cinnostNadpis${i}`} popisek={`${i + 1}. nadpis`} hodnota={c.nadpis} />
            <Pole jmeno={`cinnostText${i}`} popisek={`${i + 1}. popis`} hodnota={c.text} radku={4} />
          </div>
        ))}
      </Sekce>

      <Sekce nadpis="Další stránky">
        <Pole jmeno="tymUvod" popisek="Úvod na stránce Tým" hodnota={data.tymUvod} radku={4} />
        <Pole jmeno="kontaktUvod" popisek="Úvod na stránce Kontakt" hodnota={data.kontaktUvod} radku={3} />
      </Sekce>

      <Hlaska stav={stav} />

      <div className="sticky bottom-4 rounded-full bg-papir/90 p-1 backdrop-blur">
        <Tlacitko ceka={ceka} siroke>Uložit všechny texty</Tlacitko>
      </div>
    </form>
  );
}
