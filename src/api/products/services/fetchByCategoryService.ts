import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Product } from "../productModel";
import { Request } from "express";
import { handleSortQuery } from "../Utils/handleSortQuery";
import { handleFilters } from "../Utils/handleFilters";

async function getTotalCount(query: any): Promise<number> {
  const productsCollection = await getCollection("Products");
  return productsCollection.countDocuments(query);
}

export async function fetchByCategoryService(req: Request): Promise<ServiceResponse<{ products: Product[]; title: string | null; count: number; } | null>> {
  try {
    logger.info( JSON.stringify(req.body));
    logger.info( JSON.stringify(req.params));
    const category: string = decodeURIComponent(req.params.category || "");
    logger.info(`Category: ${category}`);

    const { search, subcategory, skip = 0, limit = 12, sort, size, color } = req.body;
    logger.info(`category: ${category} search: ${search}, subcategory: ${subcategory}, sort: ${sort}, size: ${size}, color: ${color}`);

    await connectToDatabase();
    const productsCollection = await getCollection("Products");
    let query: any = {};

    if (search && `${search}`.trim().length > 2) {
      query.$text = { $search: decodeURIComponent(search) };
    }

    switch (category) {
      case "all":
      case "collection":
      case "products":
      case "collections":
        break;
      case "new-arrivals":
        query.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
        break;
      case "best-sellers":
        query.bestSeller = true;
        break;
      default:
        query.category = category;
      }
      console.log(query);

    if (subcategory && subcategory !== "undefined") {
      query.subcategory = subcategory;
    }

    // Filter for onSale should be applied here (not as a sort)
    if (sort === 'onSale') {
      query.onSale = true;
    }

    query = handleFilters(query, { size, color });
    const sortQuery = handleSortQuery({ sort: sort as string, size, color });
    logger.info(`${JSON.stringify(sortQuery)}`);

    // Add filter for disabled products
    query.disabled = { $ne: true };

    const count = await getTotalCount(query);
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
        (category === "products" || category === "collections") ? "Latest Products" :
        (category === "new-arrivals") ? "New Arrivals" :
        (category === "best-sellers") ? "Best Sellers" :
        category || "All Products",
      count,
    };

    return ServiceResponse.success("Products fetched successfully.", result);
  } catch (error) {
    const errorMessage = `Error fetching products dynamically: ${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while retrieving products.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}