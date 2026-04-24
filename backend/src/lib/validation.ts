import { analyzeRequestSchema } from "./types";
import { z } from "zod";

/**
 * Validates an incoming analyze request body against the schema.
 * 
 * @param body - The request body to validate
 * @returns An object with either:
 *   - { success: true, data: AnalyzeRequest } on successful validation
 *   - { success: false, error: string } on validation failure
 */
export function validateRequest(body: unknown): 
  | { success: true; data: z.infer<typeof analyzeRequestSchema> }
  | { success: false; error: string } {
  
  const result = analyzeRequestSchema.safeParse(body);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }
  
  // Extract a human-readable error message from Zod validation errors
  const errorMessages = result.error.errors.map((err) => {
    const path = err.path.join(".");
    return path ? `${path}: ${err.message}` : err.message;
  });
  
  return {
    success: false,
    error: errorMessages.join("; "),
  };
}
