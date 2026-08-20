export default function HlavickaStranky({
  nadnadpis,
  nadpis,
  perex,
}: {
  nadnadpis?: string;
  nadpis: string;
  perex?: string;
}) {
  return (
    <div className="border-b border-linka bg-papir-tmavy/50">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        {nadnadpis && (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-vino">
            {nadnadpis}
          </p>
        )}
        <h1 className="ozdoba mt-3 text-4xl leading-[1.1] sm:text-5xl">
          {nadpis}
        </h1>
        {perex && (
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-inkoust-50">
            {perex}
          </p>
        )}
      </div>
    </div>
  );
}
