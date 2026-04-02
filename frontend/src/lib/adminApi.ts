import type { Product } from "./types";
import { resolveApiBaseUrl } from "./apiBaseUrl";

export type SizeOption = { id: number; nome: string };

function baseUrl() {
  return resolveApiBaseUrl();
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string; issues?: { message?: string }[] };
    if (data.issues?.length) {
      return data.issues.map((i) => i.message).filter(Boolean).join("; ") || "Dados invalidos.";
    }
    if (data.message) return data.message;
  } catch {
    /* ignore */
  }
  return `Erro ${res.status}`;
}

export async function adminListSizes(): Promise<SizeOption[]> {
  const res = await fetch(`${baseUrl()}/tamanhos`, { cache: "no-store" });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function adminListProducts(): Promise<Product[]> {
  const res = await fetch(`${baseUrl()}/admin/produtos`, { cache: "no-store" });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function adminCreateProduct(body: unknown): Promise<Product> {
  const res = await fetch(`${baseUrl()}/admin/produtos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function adminUpdateProduct(id: number, body: unknown): Promise<Product> {
  const res = await fetch(`${baseUrl()}/admin/produtos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function adminDeleteProduct(id: number): Promise<void> {
  const res = await fetch(`${baseUrl()}/admin/produtos/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error(await parseError(res));
}

export async function adminUploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("imagem", file);

  const url = `${baseUrl()}/admin/upload`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      body: form
    });
  } catch {
    throw new Error(
      `Nao foi possivel contactar a API em ${url}. Confirme o backend (npm run dev na pasta backend) e NEXT_PUBLIC_API_URL.`
    );
  }

  if (!res.ok) throw new Error(await parseError(res));
  const data = (await res.json()) as { url?: string };
  if (!data.url) throw new Error("Resposta de upload invalida.");
  return data.url;
}
