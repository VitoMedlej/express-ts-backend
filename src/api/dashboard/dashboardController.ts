import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { RequestHandler } from "express";
import { DashboardService } from "./dashboardService";


class DashboardController {
    authenticate : RequestHandler = async (req, res) => {        
        const serviceResponse = await DashboardService.Authenticate(req.body.user);
        return handleServiceResponse(serviceResponse, res);
    }
   
    
    
}

export const dashboardController = new DashboardController(); 