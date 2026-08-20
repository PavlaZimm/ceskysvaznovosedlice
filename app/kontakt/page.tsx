import type { Metadata } from "next";
import Image from "next/image";
import HlavickaStranky from "@/components/HlavickaStranky";
import { kontakt, spolek } from "@/lib/obsah";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    `Kontakt na Český svaz žen ZO Novosedlice — ${spolek.email}, ${spolek.telefon}, ` +
    `${spolek.ulice}, ${spolek.psc} ${spolek.mesto}.`,
};

const Obalka = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const Telefon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
);

const Pin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export default function KontaktStranka() {
  return (
    <>
      <HlavickaStranky nadnadpis="Ozvěte se" nadpis="Kontakt" perex={kontakt.uvod} />

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-5 md:grid-cols-3">
          <KartaKontakt
            ikona={<Obalka />}
            popisek="E-mail"
            hodnota={spolek.email}
            href={`mailto:${spolek.email}`}
            doplnek="Napište nám kdykoliv"
          />
          <KartaKontakt
            ikona={<Telefon />}
            popisek="Telefon"
            hodnota={spolek.telefon}
            href={`tel:${spolek.telefonHref}`}
            doplnek="Zavolejte nám"
          />
          <KartaKontakt
            ikona={<Pin />}
            popisek="Adresa"
            hodnota={`${spolek.ulice}, ${spolek.psc} ${spolek.mesto}`}
            href={spolek.mapaUrl}
            doplnek="Navštivte nás"
            externi
          />
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="ozdoba text-3xl sm:text-4xl">Jak se s námi spojit</h2>
            <p className="mt-7 text-lg leading-relaxed text-inkoust-50">
              Pokud máte zájem se zapojit do našeho spolku, nebo se potřebujete
              dozvědět více informací o naší činnosti, můžete nás kontaktovat
              několika způsoby.
            </p>
          </div>

          <ol className="space-y-8">
            {kontakt.zpusoby.map((z, i) => (
              <li key={z.nadpis} className="flex gap-6">
                <span className="mt-0.5 font-[family-name:var(--font-nadpis)] text-2xl leading-none text-okr">
                  {i + 1}
                </span>
                <div className="border-b border-linka pb-8">
                  <h3 className="text-xl">{z.nadpis}</h3>
                  <p className="mt-3 leading-relaxed text-inkoust-50">{z.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Kde nás najdete — bez vloženého iframu, aby web nezávisel na cizí
            službě a nevyžadoval souhlas s cookies třetích stran. */}
        <div className="mt-20 grid overflow-hidden rounded-2xl border border-linka md:grid-cols-2">
          <div className="flex flex-col justify-center bg-papir-tmavy/60 px-8 py-14 sm:px-12">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-vino">
              Kde nás najdete
            </p>
            <p className="mt-5 font-[family-name:var(--font-nadpis)] text-3xl leading-snug">
              {spolek.ulice}
              <br />
              {spolek.psc} {spolek.mesto}
            </p>
            <p className="mt-5 leading-relaxed text-inkoust-50">
              Okres Teplice, Ústecký kraj. Sídlíme přímo v obci — spojení
              autobusem i vlakem z Teplic.
            </p>
            <a
              href={spolek.mapaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex w-fit items-center gap-2 rounded-full bg-vino px-6 py-3 text-sm font-medium text-papir transition-all hover:bg-vino-tmave hover:shadow-lg hover:shadow-vino/20"
            >
              Zobrazit na mapě
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>

          <div className="relative min-h-[320px]">
            <Image
              src="/fotky/20260306-142129.webp"
              alt="Setkání členek spolku v Novosedlicích"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}

function KartaKontakt({
  ikona,
  popisek,
  hodnota,
  href,
  doplnek,
  externi = false,
}: {
  ikona: React.ReactNode;
  popisek: string;
  hodnota: string;
  href: string;
  doplnek: string;
  externi?: boolean;
}) {
  return (
    <a
      href={href}
      {...(externi ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex flex-col rounded-2xl border border-linka bg-papir p-8 transition-all hover:border-vino/40 hover:shadow-md"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-papir-tmavy text-vino transition-colors group-hover:bg-vino group-hover:text-papir">
        {ikona}
      </span>
      <span className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-inkoust-50">
        {popisek}
      </span>
      <span className="mt-2 font-[family-name:var(--font-nadpis)] text-lg leading-snug break-words text-inkoust transition-colors group-hover:text-vino">
        {hodnota}
      </span>
      <span className="mt-2 text-sm text-inkoust-50">{doplnek}</span>
    </a>
  );
}
