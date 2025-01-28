import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { RequestHandler } from "express";
import { OrderService } from "./orderService";


class OrderController {
    public saveOrder : RequestHandler = async (req, res) => {
        const orderDetails = req.body.orderDetails;
        const serviceResponse = await OrderService.saveOrder(orderDetails);
        return handleServiceResponse(serviceResponse, res);
      };
}

export const orderController = new OrderController(); 