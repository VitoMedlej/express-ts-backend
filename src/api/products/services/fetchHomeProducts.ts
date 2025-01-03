import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Product } from "../productModel";
import { Request } from "express";


export async function fetchHomeProducts (req: Request): Promise<ServiceResponse<{ Sectiontype: string; data:Product[]; _id: string; title: string | null; }[] | null>> {
    const sections: { filterBy: string; value: string | null }[] = req.body || [];
  
    try {
      const db = await connectToDatabase(`readonly`);
      const productsCollection = await getCollection(db, "Products");
  
     
      const results = [];
  
     
      for (const section of sections) {
        let query: any = {}; 
   
        switch (section.filterBy) {
          case 'new-arrivals':
            query = {  }; 
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
  
        if (rawProducts && rawProducts.length > 0) {
          results.push({
            Sectiontype: section.filterBy,
            data: rawProducts.map(product => ({
              id: product._id.toString(),
              ...product
              
            })),
            _id: `section-${results.length + 1}`,
            title: section.filterBy === 'new-arrivals' ? 'New Arrivals' : section.value,
          });
        }
      }
  
      if (results.length === 0) {
        return ServiceResponse.failure("No products found", null, StatusCodes.NOT_FOUND);
      }
  
      return ServiceResponse.success("Products found", results as any);
  
    } catch (error) {
      const errorMessage = `Error fetching products: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while retrieving products.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }