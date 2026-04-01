import { Request, Response } from "express";
import { env } from "../config/env";

export const uploadController = {
  image(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: "Envie um ficheiro no campo imagem." });
    }
    const url = `${env.publicBaseUrl}/uploads/${req.file.filename}`;
    return res.json({ url });
  }
};
