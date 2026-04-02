"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const term = q.trim();
    onClose();
    const params = new URLSearchParams();
    if (term) params.set("busca", term);
    const qs = params.toString();
    router.push(qs ? `/cliente?${qs}#catalogo` : "/cliente#catalogo");
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true" aria-label="Buscar camisas">
      <button type="button" className="absolute inset-0 bg-neutral-900/40" aria-label="Fechar busca" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md flex-col bg-neutral-100 shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-300 px-4 py-3">
          <h2 className="font-sans text-base font-semibold text-primary">Buscar</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-neutral-800 hover:bg-neutral-200"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-3 p-4">
          <label className="font-body text-xs font-medium text-neutral-600" htmlFor="search-drawer-input">
            Nome ou palavra da camisa
          </label>
          <input
            ref={inputRef}
            id="search-drawer-input"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 font-body text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
            placeholder="Ex.: Palmeiras, Brasil..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary py-3 font-sans text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <Search className="h-4 w-4" aria-hidden />
            Ir para o catálogo
          </button>
          <p className="font-body text-xs text-neutral-500">
            Mostramos só camisas que combinam com a sua pesquisa. Use também os filtros de clube e tamanho na página do
            catálogo.
          </p>
        </form>
      </div>
    </div>
  );
}
