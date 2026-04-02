"use client";

import { Heart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  FAVORITES_CHANGED_EVENT,
  FAVORITES_STORAGE_KEY,
  normalizeFavoriteId,
  readFavoriteIds,
  notifyFavoritesChanged
} from "@/lib/favorites";

export function FavoriteButton({ productId, label }: { productId: number | string; label: string }) {
  const pid = normalizeFavoriteId(productId);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (pid === null) return;
    const sync = () => setActive(readFavoriteIds().includes(pid));
    sync();
    window.addEventListener(FAVORITES_CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [pid]);

  const toggle = useCallback(() => {
    if (pid === null) return;
    const ids = readFavoriteIds();
    const next = ids.includes(pid) ? ids.filter((x) => x !== pid) : [...ids, pid];
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
    setActive(next.includes(pid));
    notifyFavoritesChanged();
  }, [pid]);

  if (pid === null) return null;

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
