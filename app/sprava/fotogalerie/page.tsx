import Link from "next/link";
import { redirect } from "next/navigation";
import { jePrihlasen } from "@/lib/auth";
import { formatDatum } from "@/lib/fotky";
import { nactiGalerii } from "@/lib/uloziste";

export const dynamic = "force-dynamic";
import FormularNovaAkce from "@/components/sprava/FormularNovaAkce";

export default async function SpravaGalerie() {
  if (!(await jePrihlasen())) redirect("/sprava/prihlaseni");

  const { akce } = await nactiGalerii();

  return (
    <>
      <h1 className="text-3xl sm:text-4xl">Fotogalerie</h1>
      <p className="mt-3 text-inkoust-50">
        Vyberte akci, kterou chcete upravit, nebo založte novou.
      </p>

      <FormularNovaAkce />

      <ul className="mt-10 space-y-3">
        {akce.map((a) => (
          <li key={a.id}>
            <Link
              href={`/sprava/fotogalerie/${a.id}`}
              className="flex items-center gap-5 rounded-2xl border border-linka bg-papir p-4 transition-all hover:border-vino/40 hover:shadow-md"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-papir-tmavy">
                {a.fotky[0] && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`/sprava/nahled/${a.fotky[0].src.replace("/fotky/", "")}`}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-[family-name:var(--font-nadpis)] text-lg">
                  {a.nazev || formatDatum(a.datum)}
                </p>
                <p className="mt-0.5 text-sm text-inkoust-50">
                  {a.nazev && <>{formatDatum(a.datum)} · </>}
                  {a.fotky.length} fotek
                  {!a.nazev && (
                    <span className="ml-2 rounded-full bg-okr/15 px-2 py-0.5 text-xs text-inkoust">
                      chybí název
                    </span>
                  )}
                </p>
              </div>
              <span aria-hidden="true" className="text-inkoust-50">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
