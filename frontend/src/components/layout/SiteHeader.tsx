"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { CartDrawer } from "./CartDrawer";

const nav = [
  { href: "/home#catalogo", label: "Início" },
  { href: "/home?categoria=times#catalogo", label: "Clubes" },
  { href: "/home?categoria=selecao#catalogo", label: "Seleções" }
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const scrollToCatalogo = useCallback(() => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b-2 border-primary/15 bg-neutral-100 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 md:gap-4 md:py-3">
          <BrandLogo variant="header" />

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-sm font-semibold text-neutral-900 transition hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={scrollToCatalogo}
              className="rounded-full p-2 text-primary hover:bg-primary/10"
              aria-label="Ver camisas"
            >
              <Search className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="rounded-full p-2 text-primary hover:bg-primary/10"
              aria-label="Ajuda do pedido"
            >
              <ShoppingBag className="h-5 w-5" aria-hidden />
            </button>
            <Link
              href="/admin"
              className="hidden rounded-md px-2 py-1.5 font-body text-xs text-neutral-800/65 hover:text-primary md:inline"
            >
              Admin
            </Link>
            <button
              type="button"
              className="rounded-full p-2 text-primary lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="menu-mobile"
              aria-label={mobileOpen ? "Fechar menu" : "Menu"}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            id="menu-mobile"
            className="border-t border-neutral-300 bg-neutral-100 px-4 py-3 lg:hidden"
            role="navigation"
            aria-label="Menu"
          >
            <ul className="flex flex-col gap-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-1 font-sans text-sm font-semibold text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin"
                  className="block py-1 font-body text-xs text-neutral-800/65"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
