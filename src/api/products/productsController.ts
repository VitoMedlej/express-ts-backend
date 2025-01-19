import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { RequestHandler } from "express";
import { ProductsService } from "./productsService";


class ProductsController {
    fetchHomeProducts : RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.fetchHomeProducts(req);
        return handleServiceResponse(serviceResponse, res);
    }
    fetchPageByCategory : RequestHandler = async (req, res) => {
      
        const serviceResponse = await ProductsService.fetchByCategoryService(req);
        return handleServiceResponse(serviceResponse, res);
    }
    
    saveProduct : RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.addProduct(req.body?.product ?? null);
        return handleServiceResponse(serviceResponse, res);
    }
    getProductById  : RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.getProductById(req.params?.id ?? null);
        return handleServiceResponse(serviceResponse, res);
    }
    removeProductById: RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.removeProductById(req.params?.id ?? null);
        return handleServiceResponse(serviceResponse, res);
    };
    dashboardFetch: RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.fetchDashboardProducts(req);
        return handleServiceResponse(serviceResponse, res);
    };
    updateProduct: RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.updateProductById(req.params.id, req.body);
        return handleServiceResponse(serviceResponse, res);
    };

    searchProducts: RequestHandler = async (req, res) => {
        const serviceResponse = await ProductsService.searchProductService(req);
        return handleServiceResponse(serviceResponse, res);
    };
    
    
}

export const productsController = new ProductsController(); 