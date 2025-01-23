import express, { type Router } from "express";
import { handleServiceResponse, validateRequest } from "@/common/utils/httpHandlers";
import { dashboardController } from "./dashboardController";
import { ServiceResponse } from "@/common/models/serviceResponse";

export const dashboardRouter: Router = express.Router();

// Dashboard specific routes
dashboardRouter.post("/auth/login", dashboardController.authenticate); 
// DashboardRouter.delete("/:id", DashboardController.removeProductById);
// DashboardRouter.post("/add", DashboardController.saveProduct);
// DashboardRouter.put("/update/:id", DashboardController.updateProduct);

// DashboardRouter.get("/fetch-Dashboard", DashboardController.dashboardFetch); 

