import { redirect } from "next/navigation";
import { jePrihlasen } from "@/lib/auth";
import FormularPrihlaseni from "@/components/sprava/FormularPrihlaseni";

export default async function PrihlaseniStranka() {
  if (await jePrihlasen()) redirect("/sprava");

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-3xl">Správa webu</h1>
      <p className="mt-3 text-inkoust-50">
        Zadejte heslo, které jste dostali od správce webu.
      </p>
      <FormularPrihlaseni />
    </div>
  );
}
