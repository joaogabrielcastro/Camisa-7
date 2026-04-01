"use client";

import { useMemo, useState } from "react";
import { Product } from "@/lib/types";
import { createWhatsAppLink } from "@/lib/whatsapp";

export function ProductPurchase({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.tamanhos.find((t) => t.stock > 0)?.sizeName ?? "");

  const purchaseLink = useMemo(() => {
    if (!selectedSize) return "#";
    return createWhatsAppLink(product.nome, selectedSize);
  }, [product.nome, selectedSize]);

  const availableSizes = product.tamanhos.filter((size) => size.stock > 0);

  return (
    <section className="space-y-5 rounded-xl border border-neutral-300 bg-neutral-100 p-5 shadow-card">
      <div>
        <h3 className="font-sans text-base font-semibold text-primary">Tamanho</h3>
        <p className="mt-0.5 font-body text-xs text-neutral-800/70">Só aparecem tamanhos com estoque.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {availableSizes.map((size) => {
          const active = selectedSize === size.sizeName;
          return (
            <button
              key={size.sizeId}
              type="button"
              className={`flex h-12 min-w-12 items-center justify-center rounded-full border-2 px-4 font-sans text-sm font-bold transition ${
                active
                  ? "border-primary bg-primary text-neutral-100 ring-2 ring-accent/50"
                  : "border-neutral-300 bg-neutral-100 text-neutral-800 hover:border-accent"
              }`}
              onClick={() => setSelectedSize(size.sizeName)}
              aria-pressed={active}
            >
              {size.sizeName}
              <span className="ml-1.5 font-body text-xs font-normal opacity-80">({size.stock})</span>
            </button>
          );
        })}
      </div>
      {availableSizes.length === 0 && (
        <p className="font-body text-sm text-error">Produto esgotado em todos os tamanhos.</p>
      )}
      <a
        className="inline-flex w-full items-center justify-center rounded-md border-2 border-primary bg-primary py-3.5 font-sans text-sm font-bold text-neutral-100 transition hover:bg-primary-dark disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:px-8"
        href={purchaseLink}
        target="_blank"
        rel="noreferrer"
      >
        Comprar no WhatsApp
      </a>
    </section>
  );
}
