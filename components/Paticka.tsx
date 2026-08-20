import Link from "next/link";
import { navigace, spolek } from "@/lib/obsah";

export default function Paticka() {
  return (
    <footer className="mt-24 border-t border-linka bg-papir-tmavy/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-[family-name:var(--font-nadpis)] text-xl font-semibold">
            {spolek.nazev}
          </p>
          <p className="mt-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-vino">
            {spolek.pobocka}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-inkoust-50">
            {spolek.motto} Spolek žen v Novosedlicích, který pořádá kulturní
            a společenské akce a podporuje komunitní život v obci.
          </p>
        </div>

        <nav aria-label="Navigace v patičce">
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-inkoust-50">
            Stránky
          </h2>
          <ul className="mt-4 space-y-2.5">
            {navigace.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="text-sm text-inkoust transition-colors hover:text-vino"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-inkoust-50">
            Kontakt
          </h2>
          <address className="mt-4 space-y-2.5 text-sm not-italic">
            <p>
              <a
                href={`mailto:${spolek.email}`}
                className="text-inkoust underline decoration-linka underline-offset-4 transition-colors hover:text-vino hover:decoration-vino"
              >
                {spolek.email}
              </a>
            </p>
            <p>
              <a
                href={`tel:${spolek.telefonHref}`}
                className="text-inkoust transition-colors hover:text-vino"
              >
                {spolek.telefon}
              </a>
            </p>
            <p className="text-inkoust-50">
              {spolek.ulice}
              <br />
              {spolek.psc} {spolek.mesto}
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-linka/70">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-inkoust-50 sm:px-8">
          © {new Date().getFullYear()} {spolek.plnyNazev}
        </p>
      </div>
    </footer>
  );
}
