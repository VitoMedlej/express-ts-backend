import { z } from "zod";

// import { commonValidations } from "@/common/utils/commonValidation";

export type Product = z.infer<typeof ProductSchema>;
export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number().positive(),
  newPrice: z.number().positive().optional(),
  category: z.string(),
  images: z.array(z.string()),
  createdAt : z.date(),
  updatedAt: z.date(),
});

export const GetProductSchema = z.object({
  params: z.object({  }),
  // params: z.object({ id: commonValidations.id }),
});
