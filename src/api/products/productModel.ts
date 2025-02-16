import { z } from "zod";

export type Product = z.infer<typeof ProductSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number().positive(),
  newPrice: z.number().positive().optional(),
  category: z.string(),
  disabled: z.boolean().default(false),
  images: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetProductSchema = z.object({
  params: z.object({}),
});
