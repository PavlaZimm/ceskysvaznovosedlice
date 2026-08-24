"use client";

import { useActionState } from "react";
import { prihlaseni } from "@/app/sprava/akce";
import Tlacitko from "./Tlacitko";

export default function FormularPrihlaseni() {
  const [stav, akce, ceka] = useActionState(prihlaseni, null);

  return (
    <form action={akce} className="mt-8 space-y-4">
      <div>
        <label htmlFor="heslo" className="mb-2 block text-sm font-medium">
          Heslo
        </label>
        <input
          id="heslo"
          name="heslo"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border border-linka bg-papir px-4 py-3 outline-none focus:border-vino"
        />
      </div>
      {stav?.chyba && (
        <p className="rounded-xl border border-vino/30 bg-vino/5 px-4 py-3 text-sm text-vino">
          {stav.chyba}
        </p>
      )}
      <Tlacitko ceka={ceka} siroke>
        Přihlásit se
      </Tlacitko>
    </form>
  );
}
