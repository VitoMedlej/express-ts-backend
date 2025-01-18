import express, { type Router } from "express";
import { validateRequest } from "@/common/utils/httpHandlers";
import { productsController } from "./productsController";

export const productsRouter: Router = express.Router();

// Public Frontend routes
productsRouter.post("/home", productsController.fetchHomeProducts); 
productsRouter.get("/search", productsController.searchProducts); 
productsRouter.get("/shop/:category", productsController.fetchPageByCategory); 
productsRouter.get("/get-item/:id", productsController.getProductById);


// Dashboard specific routes
productsRouter.delete("/dashboard/:id", productsController.removeProductById);
productsRouter.post("/dashboard/add", productsController.saveProduct);
productsRouter.put("/dashboard/update/:id", productsController.updateProduct);

productsRouter.get("/dashboard/fetch-products", productsController.dashboardFetch); 

