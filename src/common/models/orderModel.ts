
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderData = z.infer<typeof OrderDataSchema>;

// Order Item Schema
export const OrderItemSchema = z.object({
  id: z.string(),
  productName: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

// Order Data Schema
export const OrderDataSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  items: z.array(OrderItemSchema),
  priceAfterDiscount: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
  orderDate: z.string(),
  productImage: z.string().url(),
});