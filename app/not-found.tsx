import Tlacitko from "@/components/Tlacitko";

export default function Nenalezeno() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-5 py-32 text-center sm:px-8">
      <p className="font-[family-name:var(--font-nadpis)] text-6xl text-okr">404</p>
      <h1 className="mt-6 text-3xl sm:text-4xl">Tuhle stránku jsme nenašly</h1>
      <p className="mt-5 max-w-md leading-relaxed text-inkoust-50">
        Odkaz je nejspíš zastaralý nebo obsahuje překlep. Zkuste se vrátit
        na úvodní stránku.
      </p>
      <div className="mt-10">
        <Tlacitko href="/">Zpět na úvod</Tlacitko>
      </div>
    </section>
  );
}
