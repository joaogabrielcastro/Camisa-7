export type ProductSize = {
  sizeId: number;
  sizeName: string;
  stock: number;
};

export type Product = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  /** Capa (primeira foto) — igual a imagens[0] quando existe galeria */
  imagem: string;
  imagens?: string[];
  categoria: string;
  ativo: boolean;
  tamanhos: ProductSize[];
  /** ISO do backend; usado para badge "Novo" */
  createdAt?: string;
};

export function productGalleryUrls(p: Product): string[] {
  if (p.imagens && p.imagens.length > 0) return p.imagens;
  return p.imagem ? [p.imagem] : [];
}
