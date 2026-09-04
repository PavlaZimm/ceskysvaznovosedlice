import { redirect } from "next/navigation";
import { jePrihlasen } from "@/lib/auth";
import { zkusNacistStranky } from "@/lib/uloziste";
import NelzeNacist from "@/components/sprava/NelzeNacist";

export const dynamic = "force-dynamic";
import FormularTexty from "@/components/sprava/FormularTexty";

export default async function SpravaTexty() {
  if (!(await jePrihlasen())) redirect("/sprava/prihlaseni");

  const data = await zkusNacistStranky();
  if (!data) return <NelzeNacist />;
  const { spolek, uvod, oNas, tym, kontakt } = data;

  return (
    <>
      <h1 className="text-3xl sm:text-4xl">Texty</h1>
      <p className="mt-3 text-inkoust-50">
        Změny se projeví na webu přibližně do minuty po uložení.
      </p>
      <FormularTexty
        data={{
          motto: spolek.motto,
          uvod,
          oNas,
          tymUvod: tym.uvod,
          kontaktUvod: kontakt.uvod,
        }}
      />
    </>
  );
}
