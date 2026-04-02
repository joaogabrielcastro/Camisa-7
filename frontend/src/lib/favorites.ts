export const FAVORITES_STORAGE_KEY = "camisa-curitiba-favoritos";
export const FAVORITES_CHANGED_EVENT = "camisa7-favoritos-changed";

/** IDs vêm do JSON da API como número ou string; normaliza para inteiro positivo. */
export function normalizeFavoriteId(raw: unknown): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.floor(n);
}

export function readFavoriteIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const ids = new Set<number>();
    for (const item of parsed) {
      const id = normalizeFavoriteId(item);
      if (id !== null) ids.add(id);
    }
    return Array.from(ids);
  } catch {
    return [];
  }
}

export function notifyFavoritesChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
}
