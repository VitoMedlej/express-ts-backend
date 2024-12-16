import {ServiceResponse} from "@/common/models/serviceResponse";
import {Product} from "./productModel";
import {connectToDatabase, getCollection} from "@/database/mongodbClient";
import {StatusCodes} from "http-status-codes";
import {logger} from "@/server";
import { ObjectId } from "mongodb";
import { Request } from "express"; 




export class productsService {

   
  async getHomeProducts(req: Request): Promise<ServiceResponse<{ Sectiontype: string; data: { id: string; name: any; category: any; }[]; _id: string; title: string | null; }[] | null>> {
    const sections: { filterBy: string; value: string | null }[] = req.body || [];
    console.log('sections: ', sections);
  
    try {
      const db = await connectToDatabase();
      const productsCollection = await getCollection(db, "Products");
  
      // Prepare the result array
      const results = [];
  
      // Loop through each section and query the database
      for (const section of sections) {
        let query: any = {}; // Initialize empty query object
  
        switch (section.filterBy) {
          case 'new-arrivals':
            query = {  }; // New arrivals filter
            // query = { ...query, createdAt: { $gte: new Date() } }; // New arrivals filter
            break;
          case 'category':
            if (section.value) {
              query = { category: section.value }; // Category filter
            }
            break;
          default:
            break;
        }
  
        // Fetch products based on the query
        const rawProducts = await productsCollection.find(query).toArray();
  
        if (rawProducts.length > 0) {
          results.push({
            Sectiontype: section.filterBy,
            data: rawProducts.map(product => ({
              id: product._id.toString(),
              name: product.title,
              category: product.category,
            })),
            _id: `section-${results.length + 1}`,
            title: section.filterBy === 'new-arrivals' ? 'New Arrivals' : section.value,
          });
        }
      }
  
      if (results.length === 0) {
        return ServiceResponse.failure("No products found", null, StatusCodes.NOT_FOUND);
      }
  
      return ServiceResponse.success("Products found", results);
  
    } catch (error) {
      const errorMessage = `Error fetching products: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while retrieving products.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }



    async addProduct(newProduct: Product): Promise<ServiceResponse<null | string>> {
        try {
          
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
