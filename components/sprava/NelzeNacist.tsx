export default function NelzeNacist() {
  return (
    <div className="rounded-2xl border border-vino/25 bg-vino/5 p-8">
      <h1 className="text-2xl">Obsah se nepodařilo načíst</h1>
      <p className="mt-4 leading-relaxed text-inkoust-50">
        Web nemá přístup k úložišti, kde jsou uložené texty a fotky —
        nejspíš vypršel přístupový token. Web samotný běží dál a návštěvníci
        na něm nic nepoznají, jen tahle správa dočasně nefunguje.
      </p>
      <p className="mt-4 leading-relaxed text-inkoust-50">
        Ozvěte se prosím správci webu. Oprava je otázka pár minut.
      </p>
    </div>
  );
}
