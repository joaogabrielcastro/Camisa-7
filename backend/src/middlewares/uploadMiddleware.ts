import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import multer from "multer";

const uploadDir = path.join(process.cwd(), "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

export const INVALID_IMAGE_TYPE_MESSAGE = "Apenas imagens JPEG, PNG, GIF ou WebP.";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safe = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext) ? ext : ".jpg";
    cb(null, `${randomUUID()}${safe}`);
  }
});

export const uploadImageMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|pjpeg|png|gif|webp)$/.test(file.mimetype);
    if (!ok) {
      cb(new Error(INVALID_IMAGE_TYPE_MESSAGE));
      return;
    }
    cb(null, true);
  }
});
