"use client";

import { useActionState, useState } from "react";
import { ulozKontakt } from "@/app/sprava/akce";
import type { Spolek, Tym } from "@/lib/typy";
import Hlaska from "./Hlaska";
import { Pole } from "./Pole";
import Tlacitko from "./Tlacitko";

export default function FormularKontakt({
  spolek,
  clenky: puvodni,
}: {
  spolek: Spolek;
  clenky: Tym["clenky"];
}) {
  const [stav, akce, ceka] = useActionState(ulozKontakt, null);
  const [clenky, setClenky] = useState(puvodni);

  const styl =
    "w-full rounded-xl border border-linka bg-papir px-4 py-3 text-[0.95rem] outline-none focus:border-vino";

  return (
    <form action={akce} className="mt-8 space-y-6">
      <section className="rounded-2xl border border-linka bg-papir p-6">
        <h2 className="text-xl">Kontaktní údaje</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Pole jmeno="email" popisek="E-mail" hodnota={spolek.email} typ="email" />
          <Pole jmeno="telefon" popisek="Telefon" hodnota={spolek.telefon} />
          <Pole jmeno="ulice" popisek="Ulice a číslo" hodnota={spolek.ulice} />
          <div className="grid grid-cols-[7rem_1fr] gap-3">
            <Pole jmeno="psc" popisek="PSČ" hodnota={spolek.psc} />
            <Pole jmeno="mesto" popisek="Obec" hodnota={spolek.mesto} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-linka bg-papir p-6">
        <h2 className="text-xl">Výbor</h2>
        <p className="mt-2 text-sm text-inkoust-50">
          Když u někoho smažete jméno, z webu zmizí.
        </p>
        <ul className="mt-5 space-y-3">
          {clenky.map((c, i) => (
            <li key={i} className="grid gap-3 sm:grid-cols-2">
              <input
                name="clenkaFunkce"
                defaultValue={c.funkce}
                placeholder="Funkce"
                aria-label={`Funkce ${i + 1}`}
                className={styl}
              />
              <input
                name="clenkaJmeno"
                defaultValue={c.jmeno}
                placeholder="Jméno a příjmení"
                aria-label={`Jméno ${i + 1}`}
                className={styl}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setClenky([...clenky, { funkce: "", jmeno: "" }])}
          className="mt-4 rounded-full border border-linka px-5 py-2.5 text-sm text-inkoust-50 transition-colors hover:border-vino hover:text-vino"
        >
          + Přidat další členku
        </button>
      </section>

      <Hlaska stav={stav} />
      <Tlacitko ceka={ceka} siroke>Uložit</Tlacitko>
    </form>
  );
}
