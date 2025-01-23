import { z } from "zod";

export type Admin = z.infer<typeof AdminSchema>;
export const AdminSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(["admin", "viewer"]), 
  email: z.string().email(), 
  password: z.string(),
});

export const GetAdminSchema = z.object({
  params: z.object({}),
});