import express, { type Router } from "express";
import { handleServiceResponse, validateRequest } from "@/common/utils/httpHandlers";
import { productsController } from "./productsController";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";

export const productsRouter: Router = express.Router();

// Public Frontend routes
productsRouter.post("/home", productsController.fetchHomeProducts); 
productsRouter.get("/search", productsController.searchProducts); 
productsRouter.get("/shop/:category", productsController.fetchPageByCategory); 
productsRouter.get("/get-item/:id", productsController.getProductById);

productsRouter.get("/test",async (req, res)=> {
    console.log('test: ');

        // const productsCollection = await getCollection(db, "Products");
    return handleServiceResponse(ServiceResponse.success("Product removed successfully.", true), res);
});

// Dashboard specific routes
productsRouter.delete("/dashboard/:id", productsController.removeProductById);
productsRouter.post("/dashboard/add", productsController.saveProduct);
productsRouter.put("/dashboard/update/:id", productsController.updateProduct);

productsRouter.get("/dashboard/fetch-products", productsController.dashboardFetch); 

