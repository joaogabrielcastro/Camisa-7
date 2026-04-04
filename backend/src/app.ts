import cors from "cors";
import express from "express";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler";
import { ensureUploadDir } from "./middlewares/uploadMiddleware";
import { productRoutes } from "./routes/productRoutes";

ensureUploadDir();
const uploadDir = path.join(process.cwd(), "uploads");

export const app = express();

/** Coolify/Traefik: so req.secure e forwarded headers refletem HTTPS. */
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir));

app.get("/health", (_req, res) => {
  return res.json({ status: "ok" });
});

app.use("/api", productRoutes);
app.use(errorHandler);
