import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { optional, z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["admin", "viewer"]), 
  email: z.string().email(), 
  password: z.string(),
  createdAt : optional(z.date()) 
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
