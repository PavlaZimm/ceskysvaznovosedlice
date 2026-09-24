import Link from "next/link";
import { redirect } from "next/navigation";
import { jePrihlasen } from "@/lib/auth";
import { zkusNacistGalerii } from "@/lib/uloziste";
import NelzeNacist from "@/components/sprava/NelzeNacist";

export const dynamic = "force-dynamic";

const dlazdice = [
  {
    href: "/sprava/fotogalerie",
    nadpis: "Fotogalerie",
    text: "Přidat fotky z akce, pojmenovat akci, smazat nebo přeskupit snímky.",
  },
  {
    href: "/sprava/texty",
    nadpis: "Texty",
    text: "Úvodní stránka, O nás a popis činnosti spolku.",
  },
  {
    href: "/sprava/kontakt",
    nadpis: "Kontakt a výbor",
    text: "Telefon, e-mail, adresa a jména členek výboru.",
  },
];

export default async function SpravaRozcestnik() {
  if (!(await jePrihlasen())) redirect("/sprava/prihlaseni");

  const galerie = await zkusNacistGalerii();
  if (!galerie) return <NelzeNacist />;
  const { akce } = galerie;
  const pocetAkci = akce.length;
  const pocetFotek = akce.reduce((n, a) => n + a.fotky.length, 0);
  const posledni = akce[0];

  return (
    <>
      <h1 className="text-3xl sm:text-4xl">Co budeme upravovat?</h1>
      <p className="mt-3 text-inkoust-50">
        Web má teď {pocetFotek} fotek z {pocetAkci} akcí
        {posledni && <> — poslední je {posledni.nazev || "z " + posledni.datum}</>}.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {dlazdice.map((d) => (
          <Link
            key={d.href}
            href={d.href}
            className="rounded-2xl border border-linka bg-papir p-7 transition-all hover:border-vino/40 hover:shadow-md"
          >
            <h2 className="text-xl">{d.nadpis}</h2>
            <p className="mt-3 text-sm leading-relaxed text-inkoust-50">{d.text}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-linka bg-papir-tmavy/50 p-7">
        <h2 className="text-lg">Jak to funguje</h2>
        <p className="mt-3 leading-relaxed text-inkoust-50">
          Po uložení jsou změny zveřejněné. Otevřenou stránku webu obnovte,
          abyste viděly nový obsah. U fotek počkejte na potvrzení nahrání.
        </p>
      </div>
    </>
  );
}
