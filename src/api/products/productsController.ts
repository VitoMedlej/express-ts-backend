import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { RequestHandler } from "express";
import { ProductsService } from "./productsService";
import { logger } from "@/server";


class ProductsController {
    fetchHomeProducts : RequestHandler = async (req, res) => {
        console.log('req: ', req);
        logger.info(`reqbody: ${req.body}`)
        const serviceResponse = await ProductsService.fetchHomeProducts(req);
        return handleServiceResponse(serviceResponse, res);
    }
    fetchPageByCategory : RequestHandler = async (req, res) => {
      
        const serviceResponse = await ProductsService.fetchByCategoryService(req);
        return handleServiceResponse(serviceResponse, res);
    }
    
   
    getProductById  : RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.getProductById(req.params?.id ?? null);
        return handleServiceResponse(serviceResponse, res);
    }
  
    

    searchProducts: RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.searchProductService(req);
        return handleServiceResponse(serviceResponse, res);
    };
    fetchRecommendedProducts :RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.fetchRecommendedProductsService(req);
        return handleServiceResponse(serviceResponse, res);
    };
    
    
}

export const productsController = new ProductsController(); 