import { OrderData } from "@/common/models/orderModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";

export async function saveOrder(order: OrderData): Promise<ServiceResponse<OrderData | null>> {
  try {
    if (!order || !order.customerName || !order.items || order.items.length === 0) {
      logger.warn("Missing required fields.");
      return ServiceResponse.failure("Missing required fields.", null, StatusCodes.BAD_REQUEST);
    }

    const ordersCollection = await getCollection("Orders");

    const { id, ...rest } = order; // Exclude `id` for MongoDB
    const documentToInsert = {
      ...rest,
      _id: new ObjectId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(documentToInsert as any);

    if (!result.acknowledged) {
      logger.error("Failed to save the order.");
      return ServiceResponse.failure("Failed to save the order.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    logger.info("Order saved successfully.");

    const savedOrder: OrderData = {
      ...order,
      id: documentToInsert._id.toString(),
    };

    return ServiceResponse.success<OrderData>("Order saved successfully.", savedOrder);
  } catch (error) {
    const errorMessage = `Error saving order: ${(error as Error).message}`;
    logger.error(errorMessage);
    return ServiceResponse.failure("An error occurred while saving the order.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
