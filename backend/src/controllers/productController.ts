import { Request, Response } from "express";
import { productService } from "../services/productService";

function parseId(value: string): number {
  const id = Number(value);
  if (Number.isNaN(id) || id <= 0) {
    throw new Error("Invalid id");
  }
  return id;
}

export const productController = {
  async list(req: Request, res: Response) {
    const data = await productService.list({
      tamanho: req.query.tamanho as string | undefined,
      categoria: req.query.categoria as string | undefined,
      ativo: req.query.ativo as string | undefined,
      busca: (req.query.busca ?? req.query.q) as string | undefined
    });
    return res.json(data);
  },

  async listAdmin(req: Request, res: Response) {
    const data = await productService.listAdmin({
      tamanho: req.query.tamanho as string | undefined,
      categoria: req.query.categoria as string | undefined,
      busca: (req.query.busca ?? req.query.q) as string | undefined
    });
    return res.json(data);
  },

  async details(req: Request, res: Response) {
    const id = parseId(req.params.id);
    const product = await productService.getById(id);
    if (!product) {
      return res.status(404).json({ message: "Produto nao encontrado." });
    }
    return res.json(product);
  },

  async create(req: Request, res: Response) {
    const created = await productService.create(req.body);
    return res.status(201).json(created);
  },

  async update(req: Request, res: Response) {
    const id = parseId(req.params.id);
    const updated = await productService.update(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Produto nao encontrado." });
    }
    return res.json(updated);
  },

  async remove(req: Request, res: Response) {
    const id = parseId(req.params.id);
    const removed = await productService.remove(id);
    if (!removed) {
      return res.status(404).json({ message: "Produto nao encontrado." });
    }
    return res.status(204).send();
  }
};
