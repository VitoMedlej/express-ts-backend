import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Product } from "../productModel";
import { Request } from "express";

/**
 * Fetches products dynamically based on category and query parameters.
 * @param req Express Request object containing dynamic parameters.
 * @returns ServiceResponse with product sections.
 */
export async function fetchByCategoryService(req: Request): Promise<ServiceResponse<{ Sectiontype: string; products: Product[]; _id: string; title: string | null; } | null>> {
  const category: string = decodeURIComponent(req.params.category || "");
  const { search, skip = 0, limit = 12 } = req.query;
  

  try {
    const db = await connectToDatabase();
    const productsCollection = await getCollection(db, "Products");

    let query: any = {};

    if (search != undefined && `${search}`?.length > 2) {
      query.$text = { $search: decodeURIComponent(search as string) };
    }

    switch (category) {
      case "all":
      case "collections":
        query = { ...query }; 
        break;
      case "new-arrivals":
        query = { ...query, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }; 
        break;
      case "best-sellers":
        query = { ...query, bestSeller: true };
        break;
      default:
        if (category) query = { ...query, category };
    }

    const rawProducts = await productsCollection
      .find(query)
      .sort({ createdAt: -1 }) 
      .skip(Number(skip))
      .limit(Number(limit))
      .toArray();

    if (!rawProducts || rawProducts.length === 0) {
      return ServiceResponse.failure("No products found for the specified criteria.", null, StatusCodes.NOT_FOUND);
    }

    const result = {
      Sectiontype: category || "all",
      products: rawProducts.map((product) => ({
        id: product._id.toString(),
        ...product,
      })) as Product[],
      _id: `section-${category || "all"}`,
      title:
        category === "products" || category === "collections"
          ? "Latest Products"
          : category === "new-arrivals"
          ? "New Arrivals"
          : category === "best-sellers"
          ? "Best Sellers"
          : category || "All Products",
    };

    return ServiceResponse.success("Products fetched successfully.", result);
  } catch (error) {
    const errorMessage = `Error fetching products dynamically: ${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while retrieving products.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
