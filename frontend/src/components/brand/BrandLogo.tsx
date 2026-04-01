import Image from "next/image";
import Link from "next/link";

type Props = {
  variant?: "header" | "footer";
  className?: string;
};

const sizes = {
  header: { height: 44, width: 168, className: "h-9 w-auto md:h-11" },
  footer: { height: 40, width: 152, className: "h-8 w-auto opacity-95" }
} as const;

export function BrandLogo({ variant = "header", className = "" }: Props) {
  const s = sizes[variant];
  return (
    <Link
      href="/home"
      className={`inline-flex items-center ${className}`}
      aria-label="Camisa 7 Curitiba — início"
    >
      <Image
        src="/logo-camisa7-curitiba.png"
        alt="Camisa 7 Curitiba"
        width={s.width}
        height={s.height}
        className={`${s.className} w-auto object-contain object-left`}
        priority={variant === "header"}
      />
    </Link>
  );
}
