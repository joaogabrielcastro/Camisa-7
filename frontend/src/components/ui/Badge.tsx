import { ReactNode } from "react";

type Variant = "novo" | "promo" | "accent" | "esgotado";

const styles: Record<Variant, string> = {
  novo: "bg-primary text-neutral-100 ring-1 ring-white/40",
  promo: "bg-primary-dark text-neutral-100",
  accent: "bg-secondary-light/90 text-primary-dark ring-1 ring-primary/20",
  esgotado: "bg-error text-neutral-100"
};

export function Badge({
  children,
  variant,
  className = ""
}: {
  children: ReactNode;
  variant: Variant;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
