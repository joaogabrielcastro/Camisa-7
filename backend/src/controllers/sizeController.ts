import { Request, Response } from "express";
import { sizeService } from "../services/sizeService";

export const sizeController = {
  async list(_req: Request, res: Response) {
    const data = await sizeService.list();
    return res.json(data);
  }
};
