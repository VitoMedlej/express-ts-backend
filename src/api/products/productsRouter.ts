import express, { type Router } from "express";
// import { handleServiceResponse, validateRequest } from "@/common/utils/httpHandlers";
import { productsController } from "./productsController";
// import { ServiceResponse } from "@/common/models/serviceResponse";

export const productsRouter: Router = express.Router();

// Public Frontend routes
productsRouter.post("/home", productsController.fetchHomeProducts); 
productsRouter.get("/search", productsController.searchProducts); 
productsRouter.post("/shop/:category", productsController.fetchPageByCategory); 
productsRouter.get("/recommended", productsController.fetchRecommendedProducts); 
productsRouter.get("/get-item/:id", productsController.getProductById);




