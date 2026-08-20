"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigace, spolek } from "@/lib/obsah";

export default function Hlavicka() {
  const cesta = usePathname();
  const [otevreno, setOtevreno] = useState(false);

  // Zavřít mobilní menu při přechodu na jinou stránku
  useEffect(() => setOtevreno(false), [cesta]);

  // Zamknout scroll pod otevřeným menu
  useEffect(() => {
    document.body.style.overflow = otevreno ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [otevreno]);

  return (
    <header className="sticky top-0 z-40 border-b border-linka/70 bg-papir/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="font-[family-name:var(--font-nadpis)] text-[1.4rem] leading-none font-semibold text-inkoust transition-colors group-hover:text-vino sm:text-2xl">
            {spolek.nazev}
          </span>
          <span className="hidden text-[0.7rem] font-medium uppercase tracking-[0.18em] text-vino sm:inline">
            {spolek.pobocka}
          </span>
        </Link>

        {/* Desktop navigace */}
        <nav aria-label="Hlavní navigace" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navigace.map((p) => {
              const aktivni =
                p.href === "/" ? cesta === "/" : cesta.startsWith(p.href);
              return (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    aria-current={aktivni ? "page" : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[0.9rem] transition-colors ${
                      aktivni
                        ? "text-vino"
                        : "text-inkoust-50 hover:text-inkoust"
                    }`}
                  >
                    {p.label}
                    {aktivni && (
                      <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-vino" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Přepínač mobilního menu */}
        <button
          type="button"
          onClick={() => setOtevreno((o) => !o)}
          aria-expanded={otevreno}
          aria-controls="mobilni-menu"
          className="-mr-1.5 rounded-lg p-2.5 text-inkoust md:hidden"
        >
          <span className="sr-only">
            {otevreno ? "Zavřít menu" : "Otevřít menu"}
          </span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {otevreno ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M3.5 7h17" />
                <path d="M3.5 12h17" />
                <path d="M3.5 17h17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobilní menu */}
      {otevreno && (
        <nav
          id="mobilni-menu"
          aria-label="Hlavní navigace"
          className="border-t border-linka bg-papir md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-5 py-2 sm:px-8">
            {navigace.map((p) => {
              const aktivni =
                p.href === "/" ? cesta === "/" : cesta.startsWith(p.href);
              return (
                <li key={p.href} className="border-b border-linka/60 last:border-0">
                  <Link
                    href={p.href}
                    aria-current={aktivni ? "page" : undefined}
                    className={`block py-3.5 font-[family-name:var(--font-nadpis)] text-lg ${
                      aktivni ? "text-vino" : "text-inkoust"
                    }`}
                  >
                    {p.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
