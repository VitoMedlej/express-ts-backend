// src/services/GenerateDescription.ts
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  keywords: z.array(z.string()).min(1),
});

export async function GenerateDescription(req: Request): Promise<ServiceResponse<{ description: string } | null>> {
  const parsed = schema.safeParse(req.body);
  console.log(req.body);
  if (!parsed.success) {
    return ServiceResponse.failure("Invalid input", null, StatusCodes.BAD_REQUEST);
  }

  const { title, keywords } = parsed.data;

  try {
    const response = await fetch("http://127.0.0.1:8000/ai/generate-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, keywords }),
    });

    if (!response.ok) {
      throw new Error(`Python service error: ${response.status}`);
    }

    const result = await response.json();
    return ServiceResponse.success("Description generated successfully", { description: result.description });
  } catch (err) {
    logger.error(`Failed to fetch from Python service: ${(err as Error).message}`);
    return ServiceResponse.failure("Description generation failed", null, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
