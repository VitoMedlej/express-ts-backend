import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

/**
 * Removes a Order by ID.
 * @param id The ID of the Order to remove.
 * @returns A ServiceResponse indicating success or failure.
 */
export async function removeOrderById(id: string): Promise<ServiceResponse<null>> {
  try {
    if (!id) {
      logger.warn("Order ID is missing.");
      return ServiceResponse.failure("Order ID is required.", null, StatusCodes.BAD_REQUEST);
    }

    if (!ObjectId.isValid(id)) {
      logger.warn(`Invalid Order ID: ${id}`);
      return ServiceResponse.failure("Invalid Order ID.", null, StatusCodes.BAD_REQUEST);
    }

    const OrdersCollection = await getCollection("Orders");


    const result = await OrdersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      logger.warn(`No Order found with ID: ${id}`);
      return ServiceResponse.failure("Order not found.", null, StatusCodes.NOT_FOUND);
    }

    logger.info(`Order with ID: ${id} removed successfully.`);
    return ServiceResponse.success("Order removed successfully.", null);

  } catch (error) {
    logger.error(`Error removing Order: ${(error as Error).message}`);
    return ServiceResponse.failure(
      "An error occurred while removing the Order.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
