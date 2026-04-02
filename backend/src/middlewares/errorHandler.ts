import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import { INVALID_IMAGE_TYPE_MESSAGE, MAX_UPLOAD_FILE_SIZE_MB } from "./uploadMiddleware";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: `Ficheiro demasiado grande (max. ${MAX_UPLOAD_FILE_SIZE_MB} MB).` });
    }
    return res.status(400).json({ message: error.message });
  }

  if (error instanceof Error && error.message === INVALID_IMAGE_TYPE_MESSAGE) {
    return res.status(400).json({ message: INVALID_IMAGE_TYPE_MESSAGE });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Dados invalidos.",
      issues: error.issues
    });
  }

  if (error instanceof Error && error.message === "Invalid id") {
    return res.status(400).json({ message: "ID invalido." });
  }

  console.error(error);
  return res.status(500).json({ message: "Erro interno do servidor." });
}
