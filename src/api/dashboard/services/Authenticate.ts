import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { User } from "@/api/user/userModel";

export async function Authenticate(user: User): Promise<ServiceResponse<{ user: 
    {
        id: string;
        email: any;
        name: any;
        role: any;
    }
    ; token: string } | null>> {
        
        try {
            const { id, email, password, role } = user;
        if (!user || !email || !id || !password || !ObjectId.isValid(id)) {
            logger.warn("Invalid email or user ID.");
            return ServiceResponse.failure("Invalid email or user ID.", null, StatusCodes.BAD_REQUEST);
        }

        const usersCollection = await getCollection("Users");

        // Find user by email and ID
        const foundUser = await usersCollection.findOne({
            _id: new ObjectId(id),
            email: email,
            role: role 
        });

        if (!foundUser) {
            return ServiceResponse.failure("User not found.", null, StatusCodes.NOT_FOUND);
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            logger.warn("Invalid password.");
            return ServiceResponse.failure("Invalid password.", null, StatusCodes.UNAUTHORIZED);
        }

        const authenticatedUser = {
            id: foundUser._id.toString(),
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role
        };

        // Generate JWT
        const token = jwt.sign(
            { id: authenticatedUser.id, email: authenticatedUser.email, role: authenticatedUser.role },
            process.env.JWT_SECRET || "default_secret", // Replace with a secure secret in production
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        return ServiceResponse.success("User authenticated successfully.", { user: authenticatedUser, token });
    } catch (error) {
        // logger.error(`Error authenticating user: ${(error as Error).message}`);
        console.log('`Error authenticating user:  ', `Error authenticating user: ${error}`);
        return ServiceResponse.failure(
            "An error occurred while authenticating the user.",
            null,
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}
