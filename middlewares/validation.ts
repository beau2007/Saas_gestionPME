// middlewares/validation.ts
import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema) => {
  return async (req: NextRequest) => {
    try {
      const body = await req.json();
      const validated = schema.parse(body);
      return { validated, error: null };
    } catch (error: any) {
      return {
        validated: null,
        error: NextResponse.json(
          {
            success: false,
            message: "Validation error",
            errors: error.errors,
          },
          { status: 400 }
        ),
      };
    }
  };
};