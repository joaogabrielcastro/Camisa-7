"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "camisa-curitiba-favoritos";

function readIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export function FavoriteButton({ productId, label }: { productId: number; label: string }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readIds().includes(productId));
  }, [productId]);

  const toggle = useCallback(() => {
    const ids = readIds();
    const next = ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setActive(next.includes(productId));
  }, [productId]);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      className="rounded-full bg-neutral-100/90 p-2 text-primary shadow-sm backdrop-blur-sm transition hover:bg-neutral-100"
      aria-label={active ? `Remover ${label} dos favoritos` : `Adicionar ${label} aos favoritos`}
      aria-pressed={active}
    >
      <Heart
        className={`h-5 w-5 ${active ? "fill-error text-error" : "text-primary"}`}
        strokeWidth={2}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}
