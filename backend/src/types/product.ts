export type ProductSizeStock = {
  sizeId: number;
  sizeName: string;
  stock: number;
};

export type Product = {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  /** Primeira imagem (capa do catalogo) */
  imagem: string;
  /** Todas as URLs da galeria (ordem importa) */
  imagens: string[];
  categoria: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
  tamanhos: ProductSizeStock[];
};
