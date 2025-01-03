import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { Product } from "../productModel";
import { sanitizeProductPayload } from "@/common/utils/sanitizeProductPayload";

export async function addProduct(newProduct: Product): Promise<ServiceResponse<null | string>> {
    try {
        // Checks for essential properties
      if (!newProduct || !newProduct.title || !newProduct.category) {
        logger.warn("Missing required fields.");
        return ServiceResponse.failure("Missing required fields.", null, StatusCodes.BAD_REQUEST);
      }

      const db = await connectToDatabase(`admin`);
      const productsCollection = await getCollection(db, "Products");
      const sanitizedData = sanitizeProductPayload(newProduct);
      const documentToInsert = {
        ...sanitizedData,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any;

      const result = await productsCollection.insertOne(documentToInsert);
      console.log('result: ', result);
      if (!result.acknowledged) {
        logger.error("Failed to add product.");
        return ServiceResponse.failure("Failed to add product.", null, StatusCodes.INTERNAL_SERVER_ERROR);
      }

      logger.info("Product added successfully.");
      return ServiceResponse.success("Product added successfully.", JSON.stringify(documentToInsert));

    } catch (error) {
      logger.error(`Error adding product: ${(error as Error).message}`);
      return ServiceResponse.failure("An error occurred while adding the product.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }