import express, { type Router } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import { productsController } from "./productsController";

export const productsRouter: Router = express.Router();

// Public Frontend routes
productsRouter.post("/home", productsController.fetchHomeProducts); 
productsRouter.get("/:id", productsController.getProductById);


// Dashboard specific routes
productsRouter.delete("/:id", productsController.removeProductById);
productsRouter.post("/add", productsController.saveProduct);

productsRouter.get("/dashboard/fetch-products", productsController.dashboardFetch); 

