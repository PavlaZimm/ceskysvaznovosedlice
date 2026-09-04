"use client";


import { useActionState, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { rozdelDoDavek, zmensiFotku } from "@/lib/zmenseni";
import {
  nahrajFotky,
  presunFotku,
  smazAkci,
  smazFotku,
  upravAkci,
} from "@/app/sprava/akce";
import type { Akce } from "@/lib/typy";
import Hlaska from "./Hlaska";
import Tlacitko from "./Tlacitko";

export default function DetailAkce({ akce: a }: { akce: Akce }) {
  const [stavUpravy, akceUpravy, cekaUprava] = useActionState(upravAkci, null);
  const [stavNahrani, setStavNahrani] = useState<{ chyba?: string; hotovo?: string } | null>(null);
  const [prubeh, setPrubeh] = useState<{ faze: string; hotovo: number; celkem: number } | null>(null);
  const cekaNahrani = prubeh !== null;
  const [pretahuje, setPretahuje] = useState(false);
  // chyby z akcí, které nemají vlastní formulář (mazání, přeskupení)
  const [stavAkce, setStavAkce] = useState<{ chyba?: string } | null>(null);
  const [pracuje, start] = useTransition();

  /** Spustí serverovou akci a případnou chybu ukáže uživateli. */
  function proved(akce: () => Promise<{ chyba: string } | void>) {
    setStavAkce(null);
    start(async () => {
      const v = await akce();
      if (v?.chyba) setStavAkce({ chyba: v.chyba });
    });
  }
  const vstupSouboru = useRef<HTMLInputElement>(null);
  const router = useRouter();

  /**
   * Nahrání fotek. Každou nejdřív zmenšíme přímo tady v prohlížeči a teprve
   * pak posíláme na server — nezmenšená fotka z mobilu je na jeden požadavek
   * příliš velká a nahrávání by selhalo.
   */
  async function nahraj(soubory: File[]) {
    const obrazky = soubory.filter((f) => f.type.startsWith("image/"));
    if (obrazky.length === 0) {
      setStavNahrani({ chyba: "Nevybrali jste žádnou fotku." });
      return;
    }

    setStavNahrani(null);
    setPrubeh({ faze: "Připravuji fotky", hotovo: 0, celkem: obrazky.length });

    const zmensene: File[] = [];
    for (const [i, f] of obrazky.entries()) {
      zmensene.push(await zmensiFotku(f));
      setPrubeh({ faze: "Připravuji fotky", hotovo: i + 1, celkem: obrazky.length });
    }

    const davky = rozdelDoDavek(zmensene);
    let nahrano = 0;
    let chyba: string | null = null;

    for (const davka of davky) {
      setPrubeh({ faze: "Nahrávám", hotovo: nahrano, celkem: zmensene.length });
      const data = new FormData();
      data.set("id", a.id);
      for (const f of davka) data.append("fotky", f);

      try {
        const v = await nahrajFotky(null, data);
        if (v?.chyba) {
          chyba = v.chyba;
          break;
        }
        nahrano += davka.length;
      } catch {
        chyba =
          "Nahrávání se přerušilo. Zkontrolujte prosím připojení k internetu " +
          "a zkuste to znovu — fotky, které už se nahrály, tam zůstanou.";
        break;
      }
    }

    setPrubeh(null);
    if (chyba) {
      setStavNahrani({
        chyba:
          nahrano > 0
            ? `Nahráno ${nahrano} fotek, pak nastala potíž: ${chyba}`
            : chyba,
      });
    } else {
      setStavNahrani({ hotovo: `Nahráno ${nahrano} fotek. Na webu budou do minuty.` });
    }
    if (vstupSouboru.current) vstupSouboru.current.value = "";
    router.refresh();
  }

  // Přetažení fotek na plochu = totéž jako výběr přes tlačítko
  function pust(e: React.DragEvent) {
    e.preventDefault();
    setPretahuje(false);
    void nahraj(Array.from(e.dataTransfer.files));
  }

  return (
    <div className="mt-6">
      {/* --- údaje o akci --- */}
      <form action={akceUpravy} className="rounded-2xl border border-linka bg-papir p-6">
        <input type="hidden" name="id" value={a.id} />
        <h1 className="text-2xl">Údaje o akci</h1>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="datum" className="mb-2 block text-sm font-medium">Datum</label>
            <input id="datum" name="datum" type="date" defaultValue={a.datum}
              className="w-full rounded-xl border border-linka bg-papir px-4 py-3 outline-none focus:border-vino" />
          </div>
          <div>
            <label htmlFor="nazev" className="mb-2 block text-sm font-medium">
              Název akce
            </label>
            <input id="nazev" name="nazev" defaultValue={a.nazev}
              placeholder="např. Pálení čarodějnic"
              className="w-full rounded-xl border border-linka bg-papir px-4 py-3 outline-none focus:border-vino" />
            <p className="mt-1.5 text-xs text-inkoust-50">
              Když necháte prázdné, na webu se ukáže jen datum.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="popis" className="mb-2 block text-sm font-medium">
            Popis akce <span className="font-normal text-inkoust-50">(nepovinné)</span>
          </label>
          <textarea id="popis" name="popis" rows={2} defaultValue={a.popis}
            placeholder="Krátká věta, co se na akci dělo."
            className="w-full rounded-xl border border-linka bg-papir px-4 py-3 outline-none focus:border-vino" />
        </div>
        <div className="mt-4"><Hlaska stav={stavUpravy} /></div>
        <div className="mt-5"><Tlacitko ceka={cekaUprava}>Uložit údaje</Tlacitko></div>
      </form>

      {/* --- nahrání fotek --- */}
      <div className="mt-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setPretahuje(true); }}
          onDragLeave={() => setPretahuje(false)}
          onDrop={pust}
          className={`rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
            pretahuje ? "border-vino bg-vino/5" : "border-linka bg-papir-tmavy/40"
          }`}
        >
          <p className="font-[family-name:var(--font-nadpis)] text-xl">
            Přetáhněte sem fotky
          </p>
          <p className="mt-2 text-sm text-inkoust-50">
            nebo je vyberte v počítači. Zmenší se samy, klidně je berte rovnou z mobilu.
          </p>
          <input
            ref={vstupSouboru}
            id="fotky"
            name="fotky"
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => void nahraj(Array.from(e.currentTarget.files ?? []))}
          />
          <label
            htmlFor="fotky"
            className="mt-6 inline-block cursor-pointer rounded-full bg-vino px-6 py-3 text-sm font-medium text-papir transition-colors hover:bg-vino-tmave"
          >
            Vybrat fotky
          </label>
          {prubeh && (
            <div className="mt-6">
              <p className="text-sm text-inkoust-50">
                {prubeh.faze} — {prubeh.hotovo} z {prubeh.celkem}
              </p>
              <div className="mx-auto mt-3 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-linka">
                <div
                  className="h-full bg-vino transition-all duration-300"
                  style={{ width: `${Math.round((prubeh.hotovo / prubeh.celkem) * 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-inkoust-50">
                Nezavírejte prosím stránku, dokud nahrávání neskončí.
              </p>
            </div>
          )}
        </div>
        <div className="mt-4"><Hlaska stav={stavNahrani} /></div>
      </div>

      {/* --- mřížka fotek --- */}
      <h2 className="mt-12 text-2xl">
        Fotky <span className="text-inkoust-50">({a.fotky.length})</span>
      </h2>
      {stavAkce?.chyba && (
        <div className="mt-4">
          <Hlaska stav={stavAkce} />
        </div>
      )}
      {a.fotky.length === 0 ? (
        <p className="mt-4 text-inkoust-50">Zatím tu není žádná fotka.</p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {a.fotky.map((f, i) => (
            <li key={f.src} className="overflow-hidden rounded-xl border border-linka bg-papir">
              <div className="relative aspect-square bg-papir-tmavy">
                {/* Vlastní náhled — viz app/sprava/nahled. Nové fotky jsou
                    vidět hned, ještě než se web znovu sestaví. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/sprava/nahled/${f.src.replace("/fotky/", "")}`}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <div className="flex gap-1">
                  <Sipka
                    smer="vlevo"
                    vypnuto={i === 0 || pracuje}
                    onClick={() => proved(() => presunFotku(a.id, f.src, -1))}
                  />
                  <Sipka
                    smer="vpravo"
                    vypnuto={i === a.fotky.length - 1 || pracuje}
                    onClick={() => proved(() => presunFotku(a.id, f.src, 1))}
                  />
                </div>
                <button
                  type="button"
                  disabled={pracuje}
                  onClick={() => {
                    if (confirm("Opravdu smazat tuhle fotku? Nejde to vzít zpět.")) {
                      proved(() => smazFotku(a.id, f.src));
                    }
                  }}
                  className="rounded-lg px-2 py-1 text-xs text-vino transition-colors hover:bg-vino hover:text-papir disabled:opacity-40"
                >
                  Smazat
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* --- smazání akce --- */}
      <div className="mt-16 rounded-2xl border border-vino/25 bg-vino/5 p-6">
        <h2 className="text-lg">Smazat celou akci</h2>
        <p className="mt-2 text-sm leading-relaxed text-inkoust-50">
          Smaže se akce i všech {a.fotky.length} fotek. Nejde to vzít zpět.
        </p>
        <button
          type="button"
          disabled={pracuje}
          onClick={() => {
            if (confirm(`Opravdu smazat akci i s ${a.fotky.length} fotkami? Nejde to vzít zpět.`)) {
              proved(() => smazAkci(a.id));
            }
          }}
          className="mt-5 rounded-full border border-vino/40 px-6 py-3 text-sm font-medium text-vino transition-colors hover:bg-vino hover:text-papir disabled:opacity-40"
        >
          Smazat akci
        </button>
      </div>
    </div>
  );
}

function Sipka({
  smer,
  vypnuto,
  onClick,
}: {
  smer: "vlevo" | "vpravo";
  vypnuto: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={vypnuto}
      onClick={onClick}
      aria-label={smer === "vlevo" ? "Posunout doleva" : "Posunout doprava"}
      className="rounded-lg border border-linka px-2 py-1 text-xs text-inkoust-50 transition-colors hover:border-vino hover:text-vino disabled:opacity-30"
    >
      {smer === "vlevo" ? "←" : "→"}
    </button>
  );
}
