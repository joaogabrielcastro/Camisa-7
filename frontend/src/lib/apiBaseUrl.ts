/**
 * Backend mounts routes under `/api` (see backend/src/app.ts).
 * Accepts either `https://host/api` or just `https://host` (appends `/api`).
 */
export function normalizeApiBaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return "http://127.0.0.1:3333/api";
  if (/\/api$/i.test(trimmed)) return trimmed;
  return `${trimmed}/api`;
}

/** Server: prefers API_URL; client/build: NEXT_PUBLIC_API_URL. */
export function resolveApiBaseUrl(): string {
  const raw =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:3333/api";
  return normalizeApiBaseUrl(raw);
}
