import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { Product } from "../productModel";

export async function getProductById(productId: string): Promise<ServiceResponse<Product | null>> {
    try {
      if (!productId || !ObjectId.isValid(productId)) {

        logger.warn("Invalid product ID.");
        return ServiceResponse.failure("Invalid product ID.", null, StatusCodes.BAD_REQUEST);
      }

      const productsCollection = await getCollection("Products");


      const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

      if (!product) {
        return ServiceResponse.failure("Product not found.", null, StatusCodes.NOT_FOUND);
      }

      const formattedProduct = {
        id: product._id.toString(),
        ...product,
      };

      return ServiceResponse.success("Product fetched successfully.", formattedProduct as Product);
    } catch (error) {
      logger.error(`Error fetching product: ${(error as Error).message}`);
      return ServiceResponse.failure(
        "An error occurred while fetching the product.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }