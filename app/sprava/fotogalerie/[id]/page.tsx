import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { jePrihlasen } from "@/lib/auth";
import { nactiGalerii } from "@/lib/uloziste";

export const dynamic = "force-dynamic";
import DetailAkce from "@/components/sprava/DetailAkce";

export default async function SpravaDetailAkce({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await jePrihlasen())) redirect("/sprava/prihlaseni");

  const { id } = await params;
  const { akce } = await nactiGalerii();
  const a = akce.find((x) => x.id === id);
  if (!a) notFound();

  return (
    <>
      <Link
        href="/sprava/fotogalerie"
        className="text-sm text-inkoust-50 transition-colors hover:text-vino"
      >
        ← Zpět na seznam akcí
      </Link>
      <DetailAkce akce={a} />
    </>
  );
}
