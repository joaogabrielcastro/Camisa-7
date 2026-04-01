import { Router } from "express";
import { productController } from "../controllers/productController";
import { sizeController } from "../controllers/sizeController";
import { uploadController } from "../controllers/uploadController";
import { uploadImageMiddleware } from "../middlewares/uploadMiddleware";

export const productRoutes = Router();

productRoutes.get("/tamanhos", sizeController.list);
productRoutes.post("/admin/upload", uploadImageMiddleware.single("imagem"), uploadController.image);
productRoutes.get("/admin/produtos", productController.listAdmin);
productRoutes.get("/produtos", productController.list);
productRoutes.get("/produtos/:id", productController.details);

productRoutes.post("/admin/produtos", productController.create);
productRoutes.patch("/admin/produtos/:id", productController.update);
productRoutes.delete("/admin/produtos/:id", productController.remove);
