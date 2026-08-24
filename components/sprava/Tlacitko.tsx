"use client";

export default function Tlacitko({
  children,
  ceka,
  siroke,
  varianta = "plne",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  ceka?: boolean;
  siroke?: boolean;
  varianta?: "plne" | "obrys" | "smazat";
}) {
  const styl = {
    plne: "bg-vino text-papir hover:bg-vino-tmave disabled:bg-vino/50",
    obrys: "border border-linka text-inkoust hover:border-vino hover:text-vino",
    smazat: "border border-vino/40 text-vino hover:bg-vino hover:text-papir",
  }[varianta];

  return (
    <button
      {...rest}
      disabled={ceka || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed ${styl} ${siroke ? "w-full" : ""} ${rest.className ?? ""}`}
    >
      {ceka && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
          <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {ceka ? "Ukládám…" : children}
    </button>
  );
}
