import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { RequestHandler } from "express";
import { ProductsService } from "./productsService";


class ProductsController {
    getHomeProducts : RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.getHomeProducts(req);
        return handleServiceResponse(serviceResponse, res);
    }

    saveProduct : RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.addProduct(req.body?.product ?? null);
        return handleServiceResponse(serviceResponse, res);
    }
}

export const productsController = new ProductsController(); 