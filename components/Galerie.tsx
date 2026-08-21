"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { type Akce, formatDatum, nadpisAkce } from "@/lib/fotky";

type Pozice = { akce: number; fotka: number };

export default function Galerie({ akce }: { akce: Akce[] }) {
  const [pozice, setPozice] = useState<Pozice | null>(null);

  const zavrit = useCallback(() => setPozice(null), []);

  const posun = useCallback(
    (smer: 1 | -1) => {
      setPozice((p) => {
        if (!p) return p;
        const fotky = akce[p.akce].fotky;
        const dalsi = p.fotka + smer;
        // přetečení na předchozí / následující akci
        if (dalsi >= fotky.length) {
          const a = p.akce + 1 < akce.length ? p.akce + 1 : 0;
          return { akce: a, fotka: 0 };
        }
        if (dalsi < 0) {
          const a = p.akce - 1 >= 0 ? p.akce - 1 : akce.length - 1;
          return { akce: a, fotka: akce[a].fotky.length - 1 };
        }
        return { ...p, fotka: dalsi };
      });
    },
    [akce],
  );

  // Klávesnice + zámek scrollu
  useEffect(() => {
    if (!pozice) return;
    const naKlavesu = (e: KeyboardEvent) => {
      if (e.key === "Escape") zavrit();
      else if (e.key === "ArrowRight") posun(1);
      else if (e.key === "ArrowLeft") posun(-1);
    };
    window.addEventListener("keydown", naKlavesu);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", naKlavesu);
      document.body.style.overflow = "";
    };
  }, [pozice, zavrit, posun]);

  const aktualni = pozice ? akce[pozice.akce].fotky[pozice.fotka] : null;
  const aktualniAkce = pozice ? akce[pozice.akce] : null;

  return (
    <>
      <div className="space-y-20 sm:space-y-24">
        {akce.map((a, ai) => (
          <section key={a.datum} aria-labelledby={`akce-${a.datum}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-linka pb-4">
              <h2
                id={`akce-${a.datum}`}
                className="text-2xl sm:text-3xl"
              >
                {nadpisAkce(a)}
              </h2>
              <p className="text-sm text-inkoust-50">
                {a.nazev && (
                  <>
                    <time dateTime={a.datum}>{formatDatum(a.datum)}</time>
                    <span className="mx-2 text-linka">·</span>
                  </>
                )}
                {a.fotky.length}{" "}
                {a.fotky.length === 1
                  ? "fotografie"
                  : a.fotky.length < 5
                    ? "fotografie"
                    : "fotografií"}
              </p>
            </div>

            {a.popis && (
              <p className="mt-6 max-w-2xl leading-relaxed text-inkoust-50">
                {a.popis}
              </p>
            )}

            <div className="mt-8 columns-2 gap-3.5 sm:columns-3 sm:gap-4 lg:columns-4">
              {a.fotky.map((f, fi) => (
                <button
                  key={f.src}
                  type="button"
                  onClick={() => setPozice({ akce: ai, fotka: fi })}
                  className="group mb-3.5 block w-full overflow-hidden rounded-xl border border-linka sm:mb-4"
                  aria-label={`Zvětšit fotografii ${fi + 1} z akce ${nadpisAkce(a)}`}
                >
                  <Image
                    src={f.src}
                    alt={`${nadpisAkce(a)} — fotografie ${fi + 1} z ${a.fotky.length}`}
                    width={f.w}
                    height={f.h}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ---------- LIGHTBOX ---------- */}
      {aktualni && aktualniAkce && pozice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotografie z akce ${nadpisAkce(aktualniAkce)}`}
          className="fixed inset-0 z-50 flex flex-col bg-inkoust/[0.97]"
          onClick={zavrit}
        >
          {/* lišta */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 text-papir sm:px-8">
            <div className="min-w-0">
              <p className="truncate font-[family-name:var(--font-nadpis)] text-lg">
                {nadpisAkce(aktualniAkce)}
              </p>
              <p className="text-sm text-papir/60">
                {pozice.fotka + 1} / {aktualniAkce.fotky.length}
              </p>
            </div>
            <button
              type="button"
              onClick={zavrit}
              className="shrink-0 rounded-full p-2.5 transition-colors hover:bg-papir/10"
            >
              <span className="sr-only">Zavřít</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* fotka */}
          <div className="relative flex flex-1 items-center justify-center px-3 pb-6 sm:px-20">
            <Image
              src={aktualni.src}
              alt={`${nadpisAkce(aktualniAkce)} — fotografie ${pozice.fotka + 1} z ${aktualniAkce.fotky.length}`}
              width={aktualni.w}
              height={aktualni.h}
              sizes="100vw"
              priority
              className="max-h-full w-auto max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <Sipka smer="predchozi" onClick={(e) => { e.stopPropagation(); posun(-1); }} />
            <Sipka smer="dalsi" onClick={(e) => { e.stopPropagation(); posun(1); }} />
          </div>
        </div>
      )}
    </>
  );
}

function Sipka({
  smer,
  onClick,
}: {
  smer: "predchozi" | "dalsi";
  onClick: (e: React.MouseEvent) => void;
}) {
  const predchozi = smer === "predchozi";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-papir/10 p-3 text-papir backdrop-blur-sm transition-colors hover:bg-papir/25 ${
        predchozi ? "left-2 sm:left-6" : "right-2 sm:right-6"
      }`}
    >
      <span className="sr-only">
        {predchozi ? "Předchozí fotografie" : "Následující fotografie"}
      </span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={predchozi ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
      </svg>
    </button>
  );
}
