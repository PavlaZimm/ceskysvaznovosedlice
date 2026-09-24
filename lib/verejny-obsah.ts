import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { nactiGalerii, nactiStranky } from "./uloziste";
import type { Stranky, Galerie } from "./typy";

// Veřejný obsah cachujeme; správa čte vždy čerstvá data.
// Při výpadku DB cache zachová poslední úspěšný obsah při revalidaci.
export const verejneStranky = cache(unstable_cache(
  async (): Promise<Stranky> => nactiStranky(),
  ["csz-stranky-v1"], { tags: ["csz-obsah"], revalidate: 300 },
));
export const verejnaGalerie = cache(unstable_cache(
  async (): Promise<Galerie> => nactiGalerii(),
  ["csz-galerie-v1"], { tags: ["csz-obsah"], revalidate: 300 },
));
