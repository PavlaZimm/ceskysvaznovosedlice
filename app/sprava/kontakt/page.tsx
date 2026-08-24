import { redirect } from "next/navigation";
import { jePrihlasen } from "@/lib/auth";
import { nactiStranky } from "@/lib/uloziste";

export const dynamic = "force-dynamic";
import FormularKontakt from "@/components/sprava/FormularKontakt";

export default async function SpravaKontakt() {
  if (!(await jePrihlasen())) redirect("/sprava/prihlaseni");

  const { spolek, tym } = await nactiStranky();

  return (
    <>
      <h1 className="text-3xl sm:text-4xl">Kontakt a výbor</h1>
      <p className="mt-3 text-inkoust-50">
        Údaje se používají na celém webu — v patičce, na kontaktu i ve
        vyhledávačích.
      </p>
      <FormularKontakt spolek={spolek} clenky={tym.clenky} />
    </>
  );
}
