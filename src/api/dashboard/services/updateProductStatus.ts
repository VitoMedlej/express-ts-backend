
import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

/**
 * Toggles the status of a product (enable/disable) by ID.
 * @param id The ID of the product to update.
 * @returns A ServiceResponse indicating success or failure.
 */
export async function updateProductStatus(id: string): Promise<ServiceResponse<null>> {
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
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      logger.warn(`No product found with ID: ${id}`);
      return ServiceResponse.failure("Product not found.", null, StatusCodes.NOT_FOUND);
    }

    const updatedStatus = !product.disabled;
    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { disabled: updatedStatus } }
    );

    if (result.modifiedCount === 0) {
      logger.warn(`Failed to update status for product ID: ${id}`);
      return ServiceResponse.failure("Failed to update product status.", null, StatusCodes.BAD_REQUEST);
    }

    logger.info(`Product with ID: ${id} status updated to ${updatedStatus ? "disabled" : "enabled"}.`);
    return ServiceResponse.success(
      `Product ${updatedStatus ? "disabled" : "enabled"} successfully.`,
      null
    );
  } catch (error) {
    logger.error(`Error updating product status: ${(error as Error).message}`);
    return ServiceResponse.failure(
      "An error occurred while updating product status.",
      null,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
