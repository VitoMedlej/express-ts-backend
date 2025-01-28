import type { Request, RequestHandler, Response } from "express";

import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { UserService } from "./userService";

class UserController {
  // public getUsers: RequestHandler = async (_req: Request, res: Response) => {
  //   const serviceResponse = await userService.findAll();
  //   return handleServiceResponse(serviceResponse, res);
  // };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const serviceResponse = await UserService.findUserById(String(id));
    return handleServiceResponse(serviceResponse, res);
  };

  
}

export const userController = new UserController();
