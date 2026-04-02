"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Heart, Trash2, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { resolveApiBaseUrl } from "@/lib/apiBaseUrl";
import {
  FAVORITES_CHANGED_EVENT,
  FAVORITES_STORAGE_KEY,
  readFavoriteIds,
  notifyFavoritesChanged
} from "@/lib/favorites";

function apiBase(): string {
  return resolveApiBaseUrl();
}

async function fetchProdutos(): Promise<Product[]> {
  const res = await fetch(`${apiBase()}/produtos`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [ids, setIds] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const refreshIds = useCallback(() => {
    setIds(readFavoriteIds());
  }, []);

  useEffect(() => {
    refreshIds();
    const onEvt = () => refreshIds();
    window.addEventListener(FAVORITES_CHANGED_EVENT, onEvt);
    window.addEventListener("storage", onEvt);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onEvt);
      window.removeEventListener("storage", onEvt);
    };
  }, [refreshIds]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void (async () => {
      const list = await fetchProdutos();
      if (!cancelled) setProducts(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  function removeId(id: number) {
    const next = readFavoriteIds().filter((x) => x !== id);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
    notifyFavoritesChanged();
    setIds(next);
  }

  const favoritosOrdenados = ids
    .map((id) => products.find((p) => Number(p.id) === id))
    .filter((p): p is Product => Boolean(p));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Favoritos">
      <button type="button" className="absolute inset-0 bg-neutral-900/40" aria-label="Fechar" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-neutral-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-300 px-4 py-3">
          <h2 className="flex items-center gap-2 font-sans text-base font-semibold text-primary">
            <Heart className="h-5 w-5 fill-primary text-primary" aria-hidden />
            Favoritos
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-neutral-800 hover:bg-neutral-200"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {ids.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
              <Heart className="h-12 w-12 text-primary/40" strokeWidth={1.5} />
              <p className="font-body text-sm text-neutral-700">
                Toque no <strong>coração</strong> numa camisa para guardá-la aqui.
              </p>
              <Link
                href="/cliente#catalogo"
                onClick={onClose}
                className="rounded-lg border-2 border-primary bg-primary px-4 py-2.5 font-sans text-sm font-semibold text-neutral-100 hover:bg-primary-dark"
              >
                Ver catálogo
              </Link>
            </div>
          ) : favoritosOrdenados.length === 0 ? (
            <p className="font-body text-sm text-neutral-600">A carregar produtos...</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {favoritosOrdenados.map((p) => (
                <li
                  key={p.id}
                  className="flex gap-3 rounded-lg border border-neutral-300 bg-white p-2 shadow-sm"
                >
                  <Link href={`/produto/${p.id}`} onClick={onClose} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-neutral-200">
                    <Image src={p.imagem} alt="" fill className="object-cover" sizes="64px" unoptimized />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/produto/${p.id}`}
                      onClick={onClose}
                      className="font-sans text-sm font-semibold text-primary line-clamp-2 hover:underline"
                    >
                      {p.nome}
                    </Link>
                    <p className="mt-0.5 font-body text-sm font-bold text-neutral-800">R$ {p.preco.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeId(p.id)}
                    className="shrink-0 self-start rounded-md p-2 text-neutral-500 hover:bg-red-50 hover:text-error"
                    aria-label={`Remover ${p.nome} dos favoritos`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {ids.length > 0 && (
          <div className="border-t border-neutral-300 p-4">
            <Link
              href="/cliente#catalogo"
              onClick={onClose}
              className="block w-full rounded-lg border-2 border-primary py-3 text-center font-sans text-sm font-semibold text-primary hover:bg-primary/10"
            >
              Continuar a ver camisas
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
