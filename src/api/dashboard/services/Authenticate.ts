import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { User } from "@/api/user/userModel";

export async function Authenticate(user: User): Promise<ServiceResponse<{ user: { id: string; email: any; name: any; role: any }; token: string } | null>> {
    try {
        const { email, password } = user;
        if (!user || !email || !password) {
            console.warn("Invalid email or password.");
            return ServiceResponse.failure("Invalid email or password.", null, StatusCodes.BAD_REQUEST);
        }

        const usersCollection = await getCollection("Users");

        const foundUser = await usersCollection.findOne({ email });

        if (!foundUser) {
            return ServiceResponse.failure("User not found.", null, StatusCodes.NOT_FOUND);
        }

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

        const token = jwt.sign(
            { id: authenticatedUser.id, email: authenticatedUser.email, role: authenticatedUser.role },
            `${process.env.JWT_SECRET}` ,
            { expiresIn: "64h" }
        );

        return ServiceResponse.success("User authenticated successfully.", { user: authenticatedUser, token });
    } catch (error) {
        console.log(`Error authenticating user: ${error}`);
        return ServiceResponse.failure(
            "An error occurred while authenticating the user.",
            null,
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}
