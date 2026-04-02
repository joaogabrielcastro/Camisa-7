import Link from "next/link";
import { Suspense } from "react";
import { ProductFilters } from "@/components/ProductFilters";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/lib/api";

export default async function ClientePage({
  searchParams
}: {
  searchParams: { tamanho?: string; categoria?: string };
}) {
  const products = await getProducts(searchParams);

  return (
    <>
      <section className="relative mb-8 overflow-hidden rounded-xl border border-neutral-900/80 bg-neutral-900 px-5 py-10 md:px-8 md:py-12">
        <div className="pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full bg-primary/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative max-w-xl">
          <h1 className="font-sans text-2xl font-bold leading-tight text-neutral-100 md:text-3xl">
            Camisas de time e seleção
          </h1>
          <p className="mt-2 font-body text-sm text-secondary">
            Clubes e seleções — escolha o tamanho e peça pelo WhatsApp.
          </p>
          <Link
            href="/cliente#catalogo"
            className="mt-5 inline-flex rounded-md bg-neutral-100 px-5 py-2.5 font-sans text-sm font-bold text-primary shadow-glow transition hover:bg-secondary-light hover:text-primary-dark"
          >
            Ver camisas
          </Link>
        </div>
      </section>

      <section id="catalogo" className="scroll-mt-24 md:scroll-mt-28">
        <h2 className="sr-only">Catálogo</h2>
        <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-neutral-300/50" aria-hidden />}>
          <ProductFilters />
        </Suspense>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length === 0 && (
          <p className="mt-8 text-center font-body text-sm text-neutral-800/70">
            Nada neste filtro.{" "}
            <Link href="/cliente" className="font-medium text-primary hover:text-accent">
              Ver todas
            </Link>
          </p>
        )}
      </section>
    </>
  );
}
