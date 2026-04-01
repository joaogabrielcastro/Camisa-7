import { z } from "zod";
import { productRepository } from "../repositories/productRepository";

const sizeStockSchema = z.object({
  tamanhoId: z.number().int().positive(),
  estoque: z.number().int().min(0)
});

const imagensSchema = z.array(z.string().url()).min(1).max(15);

const createProductSchema = z.object({
  nome: z.string().min(2).max(120),
  descricao: z.string().min(5),
  preco: z.number().min(0),
  imagens: imagensSchema,
  categoria: z.string().min(2).max(80),
  ativo: z.boolean().default(true),
  tamanhos: z.array(sizeStockSchema).min(1)
});

const updateProductSchema = z
  .object({
    nome: z.string().min(2).max(120).optional(),
    descricao: z.string().min(5).optional(),
    preco: z.number().min(0).optional(),
    imagens: imagensSchema.optional(),
    categoria: z.string().min(2).max(80).optional(),
    ativo: z.boolean().optional(),
    tamanhos: z.array(sizeStockSchema).min(1).optional()
  })
  .refine((obj) => Object.keys(obj).length > 0, { message: "Payload vazio." });

export const productService = {
  list(query: { tamanho?: string; categoria?: string; ativo?: string }) {
    return productRepository.list({
      tamanho: query.tamanho,
      categoria: query.categoria,
      ativo: query.ativo === undefined ? true : query.ativo === "true"
    });
  },

  listAdmin(query: { tamanho?: string; categoria?: string }) {
    return productRepository.list({
      tamanho: query.tamanho,
      categoria: query.categoria
    });
  },

  getById(id: number) {
    return productRepository.findById(id);
  },

  create(payload: unknown) {
    const parsed = createProductSchema.parse(payload);
    return productRepository.create(parsed);
  },

  update(id: number, payload: unknown) {
    const parsed = updateProductSchema.parse(payload);
    return productRepository.update(id, parsed);
  },

  remove(id: number) {
    return productRepository.remove(id);
  }
};
