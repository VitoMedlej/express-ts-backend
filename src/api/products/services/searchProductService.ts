import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Product } from "../productModel";
import { Request } from "express";

export async function searchProductService(req: Request): Promise<ServiceResponse<Product[]>> {
  const searchQuery = req.query.q as string;
  if (!searchQuery || searchQuery.length < 2) {
    return ServiceResponse.failure(
      "Query must be at least 2 characters long.",
      [],
      StatusCodes.BAD_REQUEST
    );
  }

  try {
    const productsCollection = await getCollection("Products");


    const results = await productsCollection
      .find({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { tags: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } }
        ]
      })
      .limit(4)
      .toArray();

    return ServiceResponse.success("Products found", results.map(product => ({
      id: product._id.toString(),
      ...product
    })) as Product[] );


  } catch (error) {
    const errorMessage = `Error searching products: ${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure(
      "An error occurred while searching for products.",
      [],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
