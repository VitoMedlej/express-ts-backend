import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

/**
 * Removes a product by ID.
 * @param id The ID of the product to remove.
 * @returns A ServiceResponse indicating success or failure.
 */
export async function removeProductById(id: string): Promise<ServiceResponse<null>> {
  try {
    if (!id) {
      logger.warn("Product ID is missing.");
      return ServiceResponse.failure("Product ID is required.", null, StatusCodes.BAD_REQUEST);
    }

    if (!ObjectId.isValid(id)) {
      logger.warn(`Invalid product ID: ${id}`);
      return ServiceResponse.failure("Invalid product ID.", null, StatusCodes.BAD_REQUEST);
    }

    const productsCollection = await getCollection("Products");


    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      logger.warn(`No product found with ID: ${id}`);
      return ServiceResponse.failure("Product not found.", null, StatusCodes.NOT_FOUND);
    }

    logger.info(`Product with ID: ${id} removed successfully.`);
    return ServiceResponse.success("Product removed successfully.", null);

  } catch (error) {
    logger.error(`Error removing product: ${(error as Error).message}`);
    return ServiceResponse.failure(
      "An error occurred while removing the product.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
