import { ServiceResponse } from "@/common/models/serviceResponse";
import { getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

type mappedUser ={
    id: string;
    name: any;
    email: any;
    createdAt: any;
    role: any;
}

export async function findUserById(id: string): Promise<ServiceResponse<mappedUser | null>> {
  try {
    const usersCollection = await getCollection("Users");

    const user = await usersCollection.findOne({ _id: new ObjectId(`${id}`) });

    if (!user) {
      return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
    }

    const {  name, email, role, createdAt } = user;

    const mappedUser = {
      id: id.toString(),
      name: name || "",
      email: email || "",
      createdAt: createdAt ? createdAt : undefined,
      role: role || "user",
    } as mappedUser;

    return ServiceResponse.success<mappedUser>("User found", mappedUser);
  } catch (error) {
    const errorMessage = `Error finding user with id ${id}: ${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while finding the user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}