export function Pole({
  jmeno,
  popisek,
  hodnota,
  napoveda,
  radku,
  typ = "text",
}: {
  jmeno: string;
  popisek: string;
  hodnota?: string;
  napoveda?: string;
  radku?: number;
  typ?: string;
}) {
  const styl =
    "w-full rounded-xl border border-linka bg-papir px-4 py-3 text-[0.95rem] leading-relaxed outline-none focus:border-vino";
  return (
    <div>
      <label htmlFor={jmeno} className="mb-2 block text-sm font-medium">
        {popisek}
      </label>
      {radku ? (
        <textarea id={jmeno} name={jmeno} rows={radku} defaultValue={hodnota} className={styl} />
      ) : (
        <input id={jmeno} name={jmeno} type={typ} defaultValue={hodnota} className={styl} />
      )}
      {napoveda && <p className="mt-1.5 text-xs text-inkoust-50">{napoveda}</p>}
    </div>
  );
}
