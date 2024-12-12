import {ServiceResponse} from "@/common/models/serviceResponse";
import {Product} from "./productModel";
import {connectToDatabase, getCollection} from "@/database/mongodbClient";
import {StatusCodes} from "http-status-codes";
import {logger} from "@/server";
import { ObjectId } from "mongodb";

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



    // returns the inserted product object stringified
    async addProduct(newProduct: Product): Promise<ServiceResponse<null | string>> {
        try {
          console.log('newProduct: ', newProduct);
          if (!newProduct || !newProduct.title || !newProduct.price || !newProduct.category) {
            logger.warn("Missing required fields.");
            return ServiceResponse.failure("Missing required fields.", null, StatusCodes.BAD_REQUEST);
          }
    
          const db = await connectToDatabase();
          const productsCollection = await getCollection(db, "Products");
    
          const documentToInsert = {
            ...newProduct,
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
}

export const ProductsService = new productsService();
