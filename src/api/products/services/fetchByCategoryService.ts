import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Product } from "../productModel";
import { Request } from "express";

/**
 * Fetches the total count of products that match the query parameters.
 * @param query Query parameters for the product search.
 * @returns Count of matching products.
 */
async function getTotalCount(query: any): Promise<number> {
  const productsCollection = await getCollection("Products");
  return productsCollection.countDocuments(query);
}

/**
 * Fetches products dynamically based on category and query parameters.
 * @param req Express Request object containing dynamic parameters.
 * @returns ServiceResponse with product data.
 */
export async function fetchByCategoryService(req: Request): Promise<ServiceResponse<{ products: Product[]; title: string | null; count: number; } | null>> {
  const category: string = decodeURIComponent(req.params.category || "");
  const { search, skip = 0, limit = 12 } = req.query;

  try {
    await connectToDatabase()
    
    const productsCollection = await getCollection("Products");

    let query: any = {};

    if (search != undefined && `${search}`?.length > 2) {
      query.$text = { $search: decodeURIComponent(search as string) };
    }

    switch (category) {
      case "all":
      case "collection":
      case "products":
      case "collections":
        query = { ...query }; // Latest added products
        break;
      case "new-arrivals":
        query = { ...query, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }; // Last 30 days
        break;
      case "best-sellers":
        query = { ...query, bestSeller: true };
        break;
      default:
        if (category) query = { ...query, category };
    }

    // Get total count of products
    const count = await getTotalCount(query);

    const rawProducts = await productsCollection
      .find(query)
      .sort({ createdAt: -1 }) // Sort by latest added
      .skip(Number(skip))
      .limit(Number(limit))
      .toArray();

    if (!rawProducts || rawProducts.length === 0) {
      return ServiceResponse.failure("No products found for the specified criteria.", null, StatusCodes.NOT_FOUND);
    }

    const result = {
      products: rawProducts.map((product) => ({
        id: product._id.toString(),
        ...product,
      })) as Product[],
      title:
        category === "products" || category === "collections"
          ? "Latest Products"
          : category === "new-arrivals"
          ? "New Arrivals"
          : category === "best-sellers"
          ? "Best Sellers"
          : category || "All Products",
      count, 
    };

    return ServiceResponse.success("Products fetched successfully.", result);
  } catch (error) {
    const errorMessage = `Error fetching products dynamically: ${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while retrieving products.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
