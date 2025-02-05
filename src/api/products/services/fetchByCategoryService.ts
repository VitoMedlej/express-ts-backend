import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Product } from "../productModel";
import { Request } from "express";
import { handleSortQuery } from "../Utils/handleSortQuery";

async function getTotalCount(query: any): Promise<number> {
  const productsCollection = await getCollection("Products");
  return productsCollection.countDocuments(query);
}

export async function fetchByCategoryService(req: Request): Promise<ServiceResponse<{ products: Product[]; title: string | null; count: number; } | null>> {
  try {
    const category: string = decodeURIComponent(req.params.category || "");
    
    // Get data from req.body, not req.query
    const { search, subcategory, skip = 0, limit = 12, sort, size, color } = req.body;
    
    console.log('color: ', color);
    console.log('size: ', size);
    console.log('sort: ', sort);
    console.log('subcategory: ', subcategory);
    console.log('search: ', search);
    console.log('category: ', category);
    await connectToDatabase();

    const productsCollection = await getCollection("Products");
    let query: any = {};

    // Handle search query
    if (search && `${search}`.length > 2) {
      query.$text = { $search: decodeURIComponent(search as string) };
    }

    // Category filters
    switch (category) {
      case "all":
      case "collection":
      case "products":
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

    // Subcategory filter
    if (subcategory) {
      query = { ...query, subcategory };
    }

    // Handle filters for size and color
    query = handleFilters(query, { size:`${size}` , color: `${color}` });

    // Handle sorting
    const sortQuery = handleSortQuery({ sort: sort as string, size, color });

    // Get total count of products
    const count = await getTotalCount(query);

    // Fetch products from database
    const rawProducts = await productsCollection
      .find(query)
      .sort(sortQuery)
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
