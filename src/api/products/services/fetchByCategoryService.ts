import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Product } from "../productModel";
import { Request } from "express";
// import { ObjectId } from "mongodb";

/**
 * Fetches products dynamically based on category and query parameters.
 * @param req Express Request object containing dynamic parameters.
 * @returns ServiceResponse with product sections.
 */
export async function fetchByCategoryService(req: Request): Promise<ServiceResponse<{ Sectiontype: string; data: Product[]; _id: string; title: string | null; }[] | null>> {
  const category: string = decodeURIComponent(req.params.category || "");
  const { search, skip = 0, limit = 12 } = req.query;
  console.log('req.params: ', req.params);

  try {
    const db = await connectToDatabase();
    const productsCollection = await getCollection(db, "Products");

    let query: any = {};

    if (search) {
      query.$text = { $search: decodeURIComponent(search as string) };
    }

    switch (category) {
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

    const rawProducts = await productsCollection
      .find(query)
      .sort({ createdAt: -1 }) // Sort by latest added
      .skip(Number(skip))
      .limit(Number(limit))
      .toArray();

    if (!rawProducts || rawProducts.length === 0) {
      return ServiceResponse.failure("No products found for the specified criteria.", null, StatusCodes.NOT_FOUND);
    }

    const results = [
      {
        Sectiontype: category || "all",
        data: rawProducts.map((product) => ({
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
      },
    ];

    return ServiceResponse.success("Products fetched successfully.", results);
  } catch (error) {
    const errorMessage = `Error fetching products dynamically: ${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while retrieving products.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
