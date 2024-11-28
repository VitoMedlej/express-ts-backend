import express, { type Router } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import { productsController } from "./productsController";

export const productsRouter: Router = express.Router();

// Define routes manually
productsRouter.get("/", productsController.getHomeProducts); // Get all products
// productsRouter.get("/:id", validateRequest(GetProductSchema), productsController.getProductById); // Get product by ID
