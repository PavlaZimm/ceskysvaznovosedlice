import Image from "next/image";
import Tlacitko from "@/components/Tlacitko";
import { akce, pocetAkci, pocetFotek } from "@/lib/fotky";
import { spolek, uvod } from "@/lib/obsah";

/* Tři fotky do hero koláže — vybrané ručně z fotogalerie. */
const heroFotky = [
  { src: "/fotky/20260414-173103.webp", alt: "Členky spolku na společném setkání" },
  { src: "/fotky/20251130-163811.webp", alt: "Společná návštěva divadla" },
  { src: "/fotky/20251209-160305.webp", alt: "Předvánoční posezení členek spolku" },
];

export default function DomovskaStranka() {
  const nejnovejsi = akce[0]?.fotky.slice(0, 6) ?? [];

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        {/* teplé pozadí */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(192,138,62,0.16),transparent_58%),radial-gradient(ellipse_at_bottom_left,rgba(138,46,65,0.10),transparent_55%)]"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-vino">
              {spolek.pobocka}
            </p>
            <h1 className="mt-5 text-[2.6rem] leading-[1.05] sm:text-6xl">
              {spolek.motto}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-inkoust-50">
              {uvod.perex}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Tlacitko href="/kontakt">Kontaktujte nás</Tlacitko>
              <Tlacitko href="/o-nas" varianta="obrys">
                Kdo jsme
              </Tlacitko>
            </div>
          </div>

          {/* koláž fotek */}
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl border border-linka shadow-sm">
              <Image
                src={heroFotky[0].src}
                alt={heroFotky[0].alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </div>
            {heroFotky.slice(1).map((f) => (
              <div
                key={f.src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-linka shadow-sm"
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 1024px) 50vw, 23vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CO DĚLÁME / PRO KOHO ---------- */}
      <section className="border-y border-linka bg-papir-tmavy/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <h2 className="ozdoba text-3xl sm:text-4xl">Pro ženy, pro společnost</h2>

          <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-14">
            <Seznam nadpis="Co děláme" polozky={uvod.copDelame} />
            <Seznam nadpis="Pro koho je svaz určen" polozky={uvod.proKoho} />
          </div>
        </div>
      </section>

      {/* ---------- O NÁS ---------- */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-linka">
            <Image
              src="/fotky/20260402-160934-001.webp"
              alt="Členky spolku na společné akci"
              fill
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="ozdoba text-3xl sm:text-4xl">O nás</h2>
            <p className="mt-7 text-lg leading-relaxed text-inkoust-50">
              {uvod.onasKratce}
            </p>
            <div className="mt-9">
              <Tlacitko href="/o-nas" varianta="obrys">
                Více o spolku
              </Tlacitko>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ŽENY V AKCI ---------- */}
      <section className="border-t border-linka bg-papir-tmavy/50">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <h2 className="ozdoba text-3xl sm:text-4xl">Ženy v akci</h2>
            <p className="mt-7 text-lg leading-relaxed text-inkoust-50">
              {uvod.galerieKratce}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {nejnovejsi.map((f) => (
              <div
                key={f.src}
                className="relative aspect-square overflow-hidden rounded-xl border border-linka"
              >
                <Image
                  src={f.src}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Tlacitko href="/fotogalerie">Celá fotogalerie</Tlacitko>
            <p className="text-sm text-inkoust-50">
              {pocetFotek} fotografií z {pocetAkci} akcí
            </p>
          </div>
        </div>
      </section>

      {/* ---------- VÝZVA KE KONTAKTU ---------- */}
      <section className="mx-auto max-w-6xl px-5 pt-20 sm:px-8 sm:pt-24">
        <div className="rounded-3xl border border-linka bg-[linear-gradient(135deg,rgba(138,46,65,0.07),rgba(192,138,62,0.09))] px-8 py-16 text-center sm:px-14">
          <h2 className="ozdoba ozdoba-stred text-3xl sm:text-4xl">
            Chcete nás kontaktovat?
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-inkoust-50">
            Máte zájem se zapojit, nebo se chcete jen na něco zeptat? Napište
            nám, zavolejte, nebo přijďte na některou z našich akcí.
          </p>
          <div className="mt-10">
            <Tlacitko href="/kontakt">Ozvěte se nám</Tlacitko>
          </div>
        </div>
      </section>
    </>
  );
}

function Seznam({ nadpis, polozky }: { nadpis: string; polozky: string[] }) {
  return (
    <div>
      <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-vino">
        {nadpis}
      </h3>
      <ul className="mt-6 space-y-4">
        {polozky.map((p) => (
          <li key={p} className="flex gap-4 border-b border-linka/70 pb-4 last:border-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-1 shrink-0 text-okr"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span className="text-[1.05rem] leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
