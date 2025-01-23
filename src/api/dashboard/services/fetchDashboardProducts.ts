import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { Product } from "../../products/productModel";

// Pagination constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;

export async function fetchDashboardProducts(req: Request): Promise<ServiceResponse<{ data: Product[]; total: number } | null>> {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, search = '' } = req.query;
  const parsedPage = parseInt(page as string, 10) || DEFAULT_PAGE;
  const parsedLimit = parseInt(limit as string, 10) || DEFAULT_LIMIT;

  try {
    
    const productsCollection = await getCollection("Products");


    let query: any = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const totalProducts = await productsCollection.countDocuments(query);

    const rawProducts = await productsCollection
      .find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .toArray();

    const products = rawProducts.map(({ _id, ...rest }) => ({
      id: _id.toString(), 
      ...rest,           
    })) as Product[];

    return ServiceResponse.success("Products fetched successfully", {
      data: products,
      total: totalProducts,
    });
  } catch (error) {
    logger.error(`Error fetching dashboard products: ${(error as Error).message}`);
    return ServiceResponse.failure("An error occurred while retrieving products.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
