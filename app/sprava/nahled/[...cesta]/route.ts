import { NextResponse } from "next/server";
import { jePrihlasen } from "@/lib/auth";
import { nactiBinarne } from "@/lib/uloziste";

/**
 * Náhledy fotek pro správu webu.
 *
 * Veřejný web servíruje fotky ze složky `public`, jenže ta se plní až při
 * sestavení. Čerstvě nahraná fotka by tedy ve správě chvíli chyběla. Tenhle
 * endpoint ji přečte rovnou z úložiště, takže je vidět hned.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ cesta: string[] }> },
) {
  if (!(await jePrihlasen())) {
    return new NextResponse("Nejste přihlášeni.", { status: 401 });
  }

  const { cesta } = await params;
  const relativni = cesta.join("/");

  // Povolené jsou jen fotky galerie — žádné vykračování mimo složku.
  if (relativni.includes("..") || !/^[\w.-]+\.(webp|jpe?g|png)$/i.test(relativni)) {
    return new NextResponse("Neplatná cesta.", { status: 400 });
  }

  const data = await nactiBinarne(`public/fotky/${relativni}`);
  if (!data) return new NextResponse("Nenalezeno.", { status: 404 });

  const pripona = relativni.split(".").pop()!.toLowerCase();
  const typ =
    pripona === "png" ? "image/png"
    : pripona === "webp" ? "image/webp"
    : "image/jpeg";

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": typ,
      "Cache-Control": "private, max-age=60",
    },
  });
}
