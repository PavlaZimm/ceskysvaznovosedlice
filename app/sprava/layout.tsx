import type { Metadata } from "next";
import Link from "next/link";
import { jePrihlasen } from "@/lib/auth";
import { chybiPristupKUlozisti, zapisujeDoGitHubu } from "@/lib/uloziste";
import { odhlaseni } from "./akce";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Správa webu",
  robots: { index: false, follow: false },
};

const odkazy = [
  { href: "/sprava/fotogalerie", label: "Fotogalerie" },
  { href: "/sprava/texty", label: "Texty" },
  { href: "/sprava/kontakt", label: "Kontakt a výbor" },
];

export default async function SpravaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const prihlasen = await jePrihlasen();

  return (
    <div className="min-h-screen bg-papir">
      {prihlasen && (
        <header className="border-b border-linka bg-papir-tmavy/60">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 sm:px-8">
            <Link
              href="/sprava"
              className="font-[family-name:var(--font-nadpis)] text-lg font-semibold"
            >
              Správa webu
            </Link>
            <nav className="flex flex-wrap gap-1">
              {odkazy.map((o) => (
                <Link
                  key={o.href}
                  href={o.href}
                  className="rounded-full px-3 py-1.5 text-sm text-inkoust-50 transition-colors hover:bg-papir hover:text-inkoust"
                >
                  {o.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-4 text-sm">
              <Link
                href="/"
                target="_blank"
                className="text-inkoust-50 underline decoration-linka underline-offset-4 hover:text-vino"
              >
                Zobrazit web
              </Link>
              <form action={odhlaseni}>
                <button className="text-inkoust-50 transition-colors hover:text-vino">
                  Odhlásit
                </button>
              </form>
            </div>
          </div>
        </header>
      )}

      {prihlasen && chybiPristupKUlozisti && (
        <p className="bg-vino/10 px-5 py-3 text-center text-sm text-vino sm:px-8">
          <strong>Ukládání teď nefunguje.</strong> Web nemá nastavený přístup
          k úložišti, takže se změny neuloží. Ozvěte se prosím správci webu —
          je to otázka pár minut.
        </p>
      )}

      {prihlasen && !zapisujeDoGitHubu && !chybiPristupKUlozisti && (
        <p className="bg-okr/15 px-5 py-2.5 text-center text-sm text-inkoust sm:px-8">
          Zkušební režim — změny se ukládají jen na tento počítač, ne na web.
        </p>
      )}

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {children}
      </main>
    </div>
  );
}
