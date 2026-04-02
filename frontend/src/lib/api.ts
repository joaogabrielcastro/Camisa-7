import { Product } from "./types";
import { resolveApiBaseUrl } from "./apiBaseUrl";

function apiBaseUrl(): string {
  return resolveApiBaseUrl();
}

async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = apiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    return await fetch(url, init);
  } catch {
    throw new Error(
      `Nao foi possivel conectar a API em ${url}. ` +
        "Confira se o backend esta no ar, CORS e API_URL ou NEXT_PUBLIC_API_URL (pode ser so o dominio; /api e acrescentado). " +
        "Em dev no Windows use http://127.0.0.1:3333/api se localhost falhar."
    );
  }
}

export async function getProducts(searchParams?: { tamanho?: string; categoria?: string; busca?: string }) {
  const params = new URLSearchParams();
  if (searchParams?.tamanho) params.set("tamanho", searchParams.tamanho);
  if (searchParams?.categoria) params.set("categoria", searchParams.categoria);
  if (searchParams?.busca?.trim()) params.set("busca", searchParams.busca.trim());

  const qs = params.toString();
  const response = await apiFetch(`/produtos${qs ? `?${qs}` : ""}`, {
    cache: "no-store"
  });

  if (!response.ok) throw new Error("Erro ao buscar produtos");
  return (await response.json()) as Product[];
}

export async function getProductById(id: string) {
  const response = await apiFetch(`/produtos/${id}`, { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()) as Product;
}
