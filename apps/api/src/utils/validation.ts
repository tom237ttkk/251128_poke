import type { Context } from "hono";
import type { ZodSchema } from "zod";

export const parseJson = async <T>(c: Context, schema: ZodSchema<T>) => {
  const payload = await c.req.json().catch(() => null);
  return schema.safeParse(payload);
};

export const validationError = (details: unknown) => ({
  code: "VALIDATION_ERROR",
  message: "Invalid payload",
  details,
});
