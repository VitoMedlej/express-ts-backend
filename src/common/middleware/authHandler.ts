import {RequestHandler} from "express";
import {env} from "../utils/envConfig";
import {ServiceResponse} from "../models/serviceResponse";
import {StatusCodes} from "http-status-codes";
import {handleServiceResponse} from "../utils/httpHandlers";
import jwt from "jsonwebtoken";

const authenticateRequest : RequestHandler = (req, res, next) => {
    const jwtSecret = env.JWT_SECRET;
    const isProd = Boolean(env.NODE_ENV == 'production');
    
//     if (isProd == true)
        
        
//         {

//     const authToken = req.headers["authorization"]
//         ?.split(" ")[1];
//     if (!authToken) {
//         const serviceResponse = ServiceResponse.failure("Auth token missing or undefined", null, StatusCodes.UNAUTHORIZED);
//         return handleServiceResponse(serviceResponse, res);
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(authToken, jwtSecret);
//         if (decoded) {
//             next();
//         }
//     } catch (error : any) {
//         const serviceResponse = ServiceResponse.failure("Invalid or expired auth token", error.message, StatusCodes.UNAUTHORIZED);
//         return handleServiceResponse(serviceResponse, res);
//     }
// }
// else {

//     next()
// }
    next()

};

export default authenticateRequest;
