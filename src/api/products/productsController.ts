import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { RequestHandler } from "express";
import { ProductsService } from "./productsService";


class ProductsController {
    getHomeProducts : RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.getHomeProducts();
        return handleServiceResponse(serviceResponse, res);
    }
}

export const productsController = new ProductsController(); 