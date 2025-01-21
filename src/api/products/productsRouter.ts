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

productsRouter.get("/test", async (req, res) => {
    console.time("total");
    console.time("middleware");
    // Simulate middleware timing
    console.timeEnd("middleware");
    console.time("handler");
    const response = ServiceResponse.success("Test 1 ran", true);
    console.timeEnd("handler");

    console.time("serialization");
    handleServiceResponse(response, res);
    console.timeEnd("serialization");

    console.timeEnd("total");
});

productsRouter.get("/test2", async (req, res) => {
    console.time("total");
    console.time("middleware");
    // Simulate middleware timing
    console.timeEnd("middleware");
    console.time("handler");
    const response = ServiceResponse.success("Test 2 ran", true);
    console.timeEnd("handler");

    console.time("serialization");
    handleServiceResponse(response, res);
    console.timeEnd("serialization");

    console.timeEnd("total");
});



// Dashboard specific routes
productsRouter.delete("/dashboard/:id", productsController.removeProductById);
productsRouter.post("/dashboard/add", productsController.saveProduct);
productsRouter.put("/dashboard/update/:id", productsController.updateProduct);

productsRouter.get("/dashboard/fetch-products", productsController.dashboardFetch); 

