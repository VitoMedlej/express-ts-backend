import { ServiceResponse } from "@/common/models/serviceResponse";
import { getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { User } from "@/api/user/userModel";

// Pagination constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

export async function fetchUsers(
  req: Request
): Promise<ServiceResponse<{ data: User[]; total: number } | null>> {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, search = "" } = req.query;
  const parsedPage = parseInt(page as string, 10) || DEFAULT_PAGE;
  const parsedLimit = parseInt(limit as string, 10) || DEFAULT_LIMIT;
  const searchQuery = (search as string).trim();

  try {
    const usersCollection = await getCollection("Users");

    let query: any = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalUsers = await usersCollection.countDocuments(query);

    const rawUsers = await usersCollection
      .find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .toArray();

    const users = rawUsers.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    })) as User[];

    return ServiceResponse.success("Users fetched successfully", {
      data: users,
      total: totalUsers,
    });
  } catch (error) {
    logger.error(`Error fetching users: ${(error as Error).message}`);
    return ServiceResponse.failure(
      "An error occurred while retrieving users.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}