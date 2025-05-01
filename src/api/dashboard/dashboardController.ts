import {handleServiceResponse} from "@/common/utils/httpHandlers";
import {RequestHandler} from "express";
import {dashboardService} from "./dashboardService";

class DashboardController {
    authenticate : RequestHandler = async(req, res) => {
        const serviceResponse = await dashboardService.Authenticate(req.body.user);
        return handleServiceResponse(serviceResponse, res);
    }

    saveProduct : RequestHandler = async(req, res) => {
        const serviceResponse = await dashboardService.addProduct(req.body
            ?.product ?? null);
        return handleServiceResponse(serviceResponse, res);
    }
    dashboardFetch : RequestHandler = async(req, res) => {
        const serviceResponse = await dashboardService.fetchDashboardProducts(req);
        return handleServiceResponse(serviceResponse, res);
    };
    updateProduct : RequestHandler = async(req, res) => {
        const serviceResponse = await dashboardService.updateProductById(req.params.id, req.body);
        return handleServiceResponse(serviceResponse, res);
    };
    removeProductById: RequestHandler = async (req, res) => {
        const serviceResponse = await dashboardService.removeProductById(req.params?.id ?? null);
        return handleServiceResponse(serviceResponse, res);
    };
    removeOrderById: RequestHandler = async (req, res) => {
        const serviceResponse = await dashboardService.removeOrderById(req.params?.id ?? null);
        return handleServiceResponse(serviceResponse, res);
    };

    dashboardFetchOrders: RequestHandler = async (req, res) => {
        const serviceResponse = await dashboardService.fetchOrders(req);
        return handleServiceResponse(serviceResponse, res);
    };
    dashboardFetchUsers: RequestHandler = async (req, res) => {
        const serviceResponse = await dashboardService.fetchUsers(req);
        return handleServiceResponse(serviceResponse, res);
    };
    updateProductStatus : RequestHandler = async(req, res) => {
        const serviceResponse = await dashboardService.updateProductStatus(req.params.id);
        return handleServiceResponse(serviceResponse, res);
    };
    generateDescription :   RequestHandler = async(req, res) => {
        const serviceResponse = await dashboardService.GenerateDescription(req);
        return handleServiceResponse(serviceResponse, res);
    };

}

export const dashboardController = new DashboardController();