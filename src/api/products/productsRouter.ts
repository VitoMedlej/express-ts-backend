import express, { type Router } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import { productsController } from "./productsController";

export const productsRouter: Router = express.Router();

// Define routes manually
productsRouter.post("/home", productsController.getHomeProducts); 
productsRouter.post("/add", productsController.saveProduct);
productsRouter.get("/:id", productsController.getProductById);
productsRouter.delete("/:id", productsController.removeProductById);
