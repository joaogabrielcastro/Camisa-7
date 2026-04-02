"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const SIZES = ["P", "M", "G", "GG"] as const;

const TIPOS: { slug: string; label: string }[] = [
  { slug: "", label: "Todas" },
  { slug: "times", label: "Clubes" },
  { slug: "selecao", label: "Seleções" }
];

function chipTipoLabel(categoria: string): string {
  const c = categoria.toLowerCase();
  if (c === "times") return "Clubes";
  if (c === "selecao") return "Seleções";
  return categoria;
}

export function ProductFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSize = searchParams.get("tamanho") ?? "";
  const currentCategory = searchParams.get("categoria") ?? "";
  const currentBusca = searchParams.get("busca") ?? "";
  const [buscaInput, setBuscaInput] = useState(currentBusca);

  useEffect(() => {
    setBuscaInput(currentBusca);
  }, [currentBusca]);

  function setParams(next: { tamanho?: string; categoria?: string; busca?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.tamanho !== undefined) {
      if (next.tamanho) params.set("tamanho", next.tamanho);
      else params.delete("tamanho");
    }
    if (next.categoria !== undefined) {
      if (next.categoria) params.set("categoria", next.categoria);
      else params.delete("categoria");
    }
    if (next.busca !== undefined) {
      if (next.busca) params.set("busca", next.busca);
      else params.delete("busca");
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (currentSize) {
    chips.push({
      key: "tamanho",
      label: `Tam. ${currentSize}`,
      clear: () => setParams({ tamanho: "" })
    });
  }
  if (currentCategory) {
    chips.push({
      key: "categoria",
      label: chipTipoLabel(currentCategory),
      clear: () => setParams({ categoria: "" })
    });
  }
  if (currentBusca) {
    chips.push({
      key: "busca",
      label: `"${currentBusca.length > 24 ? `${currentBusca.slice(0, 24)}…` : currentBusca}"`,
      clear: () => setParams({ busca: "" })
    });
  }

  return (
    <div
      id="catalogo-filtros"
      className="rounded-xl border border-neutral-300 bg-neutral-100 p-3 shadow-card sm:p-4"
    >
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 font-body text-[10px] font-medium uppercase text-neutral-800/60">Buscar</p>
          <div className="flex gap-2">
            <input
              type="search"
              value={buscaInput}
              onChange={(e) => setBuscaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setParams({ busca: buscaInput.trim() });
                }
              }}
              placeholder="Nome da camisa..."
              className="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 font-body text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
              aria-label="Buscar por nome"
            />
            <button
              type="button"
              onClick={() => setParams({ busca: buscaInput.trim() })}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 font-sans text-sm font-semibold text-white hover:bg-primary-dark"
            >
              <Search className="h-4 w-4" aria-hidden />
              Buscar
            </button>
          </div>
        </div>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-sans text-xs font-bold uppercase tracking-wide text-primary">Filtrar</span>
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {chips.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={c.clear}
                className="inline-flex items-center gap-1 rounded-full bg-accent/25 px-2.5 py-0.5 font-body text-[11px] font-medium text-primary-dark"
              >
                {c.label}
                <X className="h-3 w-3" aria-hidden />
              </button>
            ))}
            <button
              type="button"
              onClick={() => router.push(pathname)}
              className="font-body text-[11px] text-accent underline"
            >
              Limpar
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="mb-1.5 font-body text-[10px] font-medium uppercase text-neutral-800/60">Tipo</p>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5">
            {TIPOS.map(({ slug, label }) => {
              const active = slug === "" ? !currentCategory : currentCategory.toLowerCase() === slug;
              return (
                <button
                  key={slug || "all"}
                  type="button"
                  onClick={() => setParams({ categoria: slug })}
                  className={`shrink-0 rounded-full px-3 py-1.5 font-sans text-xs font-semibold transition ${
                    active
                      ? "bg-primary text-neutral-100"
                      : "border border-neutral-300 bg-neutral-100 text-neutral-800 hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="shrink-0">
          <p className="mb-1.5 font-body text-[10px] font-medium uppercase text-neutral-800/60">Tamanho</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setParams({ tamanho: "" })}
              className={`rounded-full px-2.5 py-1.5 font-sans text-xs font-semibold ${
                !currentSize
                  ? "bg-primary text-neutral-100"
                  : "border border-neutral-300 text-neutral-800 hover:border-primary/40"
              }`}
            >
              Todos
            </button>
            {SIZES.map((s) => {
              const active = currentSize === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setParams({ tamanho: active ? "" : s })}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 font-sans text-xs font-bold ${
                    active
                      ? "border-primary bg-primary text-neutral-100"
                      : "border-neutral-300 text-neutral-800 hover:border-accent"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
