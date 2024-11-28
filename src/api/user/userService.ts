import {StatusCodes} from "http-status-codes";
import {connectToDatabase, getCollection} from "@/database/mongodbClient";
import {ServiceResponse} from "@/common/models/serviceResponse";
import {logger} from "@/server";
import {ObjectId} from "mongodb";
import {User} from "./userModel";

export class UserService {
    private readonly collectionName = "Users";

    /**
     * Retrieves a single user by their ID.
     * @param id - The ID of the user to retrieve.
     */
    async findById(id : string) : Promise < ServiceResponse < User | null >> {
        try {
            const db = await connectToDatabase();
            const usersCollection = await getCollection(db, this.collectionName);

            const user = await usersCollection.findOne({_id: new ObjectId(id)});

            if (!user) {
                return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
            }

            const {
                _id,
                name,
                email,
                age,
                createdAt,
                updatedAt
            } = user;

            const mappedUser : User = {
                id: _id.toString(),
                name: name || "", // Default to empty string if missing
                email: email || "", // Default to empty string if missing
                age: age || 0, // Default to 0 if missing
                createdAt: createdAt
                    ? new Date(createdAt)
                    : null, // Use `null` if missing
                updatedAt: updatedAt
                    ? new Date(updatedAt)
                    : null, // Use `null` if missing
            };

            return ServiceResponse.success < User > ("User found", mappedUser);
        } catch (error) {
            const errorMessage = `Error finding user with id ${id}: ${ (error as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure("An error occurred while finding the user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const userService = new UserService();
