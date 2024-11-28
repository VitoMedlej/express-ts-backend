import {ServiceResponse} from "@/common/models/serviceResponse";
import {Product} from "./productModel";
import {connectToDatabase, getCollection} from "@/database/mongodbClient";
import {StatusCodes} from "http-status-codes";
import {logger} from "@/server";

export class productsService {

    async getHomeProducts() : Promise < ServiceResponse < Product[] | null >> {
        try {

            const db = await connectToDatabase();
            const productsCollection = await getCollection(db, "Products");
            const rawProducts = await productsCollection
                .find()
                .toArray();

            if (!rawProducts || rawProducts.length === 0) {
                return ServiceResponse.failure("No products found", null, StatusCodes.NOT_FOUND);
            }

            rawProducts.forEach((product) => {
                if (!product.title || !product.price) {
                    logger.warn("Invalid product detected:", product);
                }
            });

            return ServiceResponse.success("Products found", rawProducts as Product[]);

        } catch (error) {
            const errorMessage = `Error fetching products: ${ (error as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure("An error occurred while retrieving products.", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const ProductsService = new productsService();
