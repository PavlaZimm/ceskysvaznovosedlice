"use client";

import { useActionState, useState } from "react";
import { novaAkce } from "@/app/sprava/akce";
import Hlaska from "./Hlaska";
import Tlacitko from "./Tlacitko";

export default function FormularNovaAkce() {
  const [otevreno, setOtevreno] = useState(false);
  const [stav, akce, ceka] = useActionState(novaAkce, null);

  if (!otevreno) {
    return (
      <button
        onClick={() => setOtevreno(true)}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-vino px-6 py-3 text-sm font-medium text-papir transition-colors hover:bg-vino-tmave"
      >
        <span aria-hidden="true">+</span> Přidat novou akci
      </button>
    );
  }

  return (
    <form action={akce} className="mt-8 rounded-2xl border border-linka bg-papir-tmavy/50 p-6">
      <h2 className="text-lg">Nová akce</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="datum" className="mb-2 block text-sm font-medium">
            Datum akce
          </label>
          <input
            id="datum"
            name="datum"
            type="date"
            required
            className="w-full rounded-xl border border-linka bg-papir px-4 py-3 outline-none focus:border-vino"
          />
        </div>
        <div>
          <label htmlFor="nazev" className="mb-2 block text-sm font-medium">
            Název akce
          </label>
          <input
            id="nazev"
            name="nazev"
            placeholder="např. Pálení čarodějnic"
            className="w-full rounded-xl border border-linka bg-papir px-4 py-3 outline-none focus:border-vino"
          />
        </div>
      </div>
      <div className="mt-3">
        <Hlaska stav={stav} />
      </div>
      <div className="mt-5 flex gap-3">
        <Tlacitko ceka={ceka}>Vytvořit a přidat fotky</Tlacitko>
        <button
          type="button"
          onClick={() => setOtevreno(false)}
          className="rounded-full border border-linka px-6 py-3 text-sm text-inkoust-50 transition-colors hover:text-inkoust"
        >
          Zrušit
        </button>
      </div>
    </form>
  );
}
