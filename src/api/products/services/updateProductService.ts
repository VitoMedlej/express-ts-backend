import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

/**
 * Updates a product by ID.
 * @param id The ID of the product to update.
 * @param updateData The data to update in the product.
 * @returns A ServiceResponse indicating success or failure.
 */
export async function updateProductById(id: string, updateData: Record<string, any>): Promise<ServiceResponse<null>> {
  try {
    if (!id) {
      logger.warn("Product ID is missing.");
      return ServiceResponse.failure("Product ID is required.", null, StatusCodes.BAD_REQUEST);
    }

    if (!ObjectId.isValid(id)) {
      logger.warn(`Invalid product ID: ${id}`);
      return ServiceResponse.failure("Invalid product ID.", null, StatusCodes.BAD_REQUEST);
    }

    if (!updateData || typeof updateData !== "object" || Object.keys(updateData).length === 0) {
      logger.warn("No update data provided or invalid data.");
      return ServiceResponse.failure("Update data is required.", null, StatusCodes.BAD_REQUEST);
    }

    const productsCollection = await getCollection("Products");


    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      logger.warn(`No product found with ID: ${id}`);
      return ServiceResponse.failure("Product not found.", null, StatusCodes.NOT_FOUND);
    }

    if (result.modifiedCount === 0) {
      logger.warn(`No changes made to the product with ID: ${id}`);
      return ServiceResponse.failure("No changes made to the product.", null, StatusCodes.BAD_REQUEST);
    }

    logger.info(`Product with ID: ${id} updated successfully.`);
    return ServiceResponse.success("Product updated successfully.", null);

  } catch (error) {
    logger.error(`Error updating product: ${(error as Error).message}`);
    return ServiceResponse.failure(
      "An error occurred while updating the product.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
