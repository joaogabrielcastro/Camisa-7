import { Request, Response } from "express";
import { env } from "../config/env";

/** URL publica da API (sem barra final). Preferir BACKEND_PUBLIC_URL; senao headers do proxy. */
function resolvePublicOrigin(req: Request): string {
  const explicit = process.env.BACKEND_PUBLIC_URL?.trim().replace(/\/+$/, "");
  if (explicit) return explicit;

  const host = req.get("x-forwarded-host") ?? req.get("host");
  if (!host) {
    return env.publicBaseUrl;
  }

  const rawProto = req.get("x-forwarded-proto");
  const proto =
    rawProto?.split(",")[0]?.trim() || (req.secure ? "https" : "http");
  return `${proto}://${host}`;
}

export const uploadController = {
  image(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: "Envie um ficheiro no campo imagem." });
    }
    const url = `${resolvePublicOrigin(req)}/uploads/${req.file.filename}`;
    return res.json({ url });
  }
};
