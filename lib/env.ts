import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().min(1),
  PAYMENT_PROVIDER: z.enum(["stripe", "mollie"]),
  STRIPE_SECRET_KEY: z.string().optional(),
  MOLLIE_API_KEY: z.string().optional(),
  APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);