import Link from "next/link";
import { Camera, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-primary bg-neutral-900 text-neutral-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <BrandLogo variant="footer" />
            <p className="mt-3 max-w-sm font-body text-sm text-secondary">
              Camisas de clube e seleção. Pedido pelo WhatsApp.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-secondary/40 p-2 text-secondary transition hover:border-accent hover:text-accent"
                aria-label="Instagram"
              >
                <Camera className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-secondary/40 p-2 text-secondary transition hover:border-accent hover:text-accent"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <Link
              href="/home#catalogo"
              className="font-body text-sm text-accent hover:text-secondary-light"
            >
              Ver camisas →
            </Link>
          </div>
        </div>
        <p className="mt-8 border-t border-neutral-800 pt-6 font-body text-xs text-secondary/70">
          © {new Date().getFullYear()} Camisa 7 Curitiba
        </p>
      </div>
    </footer>
  );
}
