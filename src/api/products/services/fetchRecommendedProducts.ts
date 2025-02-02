import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Product } from "../productModel";
import { Request } from "express";



export async function fetchRecommendedProductsService(
  req: Request
): Promise<ServiceResponse<{ products: Product[]} | null>> {
  try {
    const { limit = 12 } = req.query;
    
    await connectToDatabase();

    const productsCollection = await getCollection("Products");
    const query: any = {};

    const rawProducts = await productsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .toArray();

    if (!rawProducts || rawProducts.length === 0) {
      return ServiceResponse.failure("No recommended products found.", null, StatusCodes.NOT_FOUND);
    }

    const result = {
      products: rawProducts.map((product) => ({
        id: product._id.toString(),
        ...product,
      })) as Product[],

    };

    return ServiceResponse.success("Recommended products fetched successfully.", result);
  } catch (error) {
    const errorMessage = `Error fetching recommended products: ${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while retrieving recommended products.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
