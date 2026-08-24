export default function Hlaska({ stav }: { stav?: { chyba?: string; hotovo?: string } | null }) {
  if (!stav?.chyba && !stav?.hotovo) return null;
  const chyba = Boolean(stav.chyba);
  return (
    <p
      role="status"
      className={`rounded-xl border px-4 py-3 text-sm ${
        chyba
          ? "border-vino/30 bg-vino/5 text-vino"
          : "border-emerald-600/25 bg-emerald-600/5 text-emerald-800"
      }`}
    >
      {chyba ? stav.chyba : stav.hotovo}
    </p>
  );
}
