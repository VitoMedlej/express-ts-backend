import { ServiceResponse } from "@/common/models/serviceResponse";
import { connectToDatabase, getCollection } from "@/database/mongodbClient";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { z } from "zod";
import { OrderData } from "@/common/models/orderModel";

// Pagination constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 12;



export async function fetchOrders(req: Request): Promise<ServiceResponse<{ data: OrderData[]; total: number } | null>> {
  const { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT, userId = "", status = "" } = req.query;
  const parsedPage = parseInt(page as string, 10) || DEFAULT_PAGE;
  const parsedLimit = parseInt(limit as string, 10) || DEFAULT_LIMIT;

  try {
    const ordersCollection = await getCollection("Orders");

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    const totalOrders = await ordersCollection.countDocuments(query);

    const rawOrders = await ordersCollection
      .find(query)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .toArray();

    const orders = rawOrders.map(({ _id, ...rest }) => ({
      id: _id.toString(),
      ...rest,
    })) as OrderData[];

    return ServiceResponse.success("Orders fetched successfully", {
      data: orders,
      total: totalOrders,
    });
  } catch (error) {
    logger.error(`Error fetching orders: ${(error as Error).message}`);
    return ServiceResponse.failure("An error occurred while retrieving orders.", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
