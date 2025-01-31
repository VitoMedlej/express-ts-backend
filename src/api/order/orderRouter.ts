import express, { type Router } from "express";
import { orderController } from "./orderController";

export const orderRouter: Router = express.Router();

// Public Frontend routes
orderRouter.post("/save-order", orderController.saveOrder); 

