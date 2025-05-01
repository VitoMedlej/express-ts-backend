import express, { type Router } from "express";
import { dashboardController } from "./dashboardController";

export const dashboardRouter: Router = express.Router();


dashboardRouter.options("/product/delete/:id", (req, res) => {
    res.set("Access-Control-Allow-Origin", "*"); // Adjust if needed
    res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(204); // No content, successful preflight
  });



// Dashboard specific routes
dashboardRouter.post("/auth/login", dashboardController.authenticate); 
// DashboardRouter.delete("/:id", DashboardController.removeProductById);
// DashboardRouter.post("/add", DashboardController.saveProduct);
// DashboardRouter.put("/update/:id", DashboardController.updateProduct);

// DashboardRouter.get("/fetch-Dashboard", DashboardController.dashboardFetch); 

// Dashboard specific routes
dashboardRouter.delete("/product/delete/:id", dashboardController.removeProductById);
dashboardRouter.put("/product/update/:id", dashboardController.updateProduct);


dashboardRouter.delete("/order/delete/:id", dashboardController.removeOrderById);

dashboardRouter.post("/product/add", dashboardController.saveProduct);
dashboardRouter.put("/product/status/:id", dashboardController.updateProductStatus);


dashboardRouter.get("/fetch-products", dashboardController.dashboardFetch); 
dashboardRouter.get("/fetch-orders", dashboardController.dashboardFetchOrders); 
dashboardRouter.get("/fetch-users", dashboardController.dashboardFetchUsers); 

dashboardRouter.post("/generate-description", dashboardController.generateDescription); 
