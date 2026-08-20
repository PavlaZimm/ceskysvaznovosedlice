import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  varianta?: "plne" | "obrys";
};

export default function Tlacitko({ href, children, varianta = "plne" }: Props) {
  const zaklad =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200";
  const styl =
    varianta === "plne"
      ? "bg-vino text-papir hover:bg-vino-tmave hover:shadow-lg hover:shadow-vino/20"
      : "border border-linka bg-transparent text-inkoust hover:border-vino hover:text-vino";

  return (
    <Link href={href} className={`${zaklad} ${styl}`}>
      {children}
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
