import { z } from "zod";

/**
 * Validation schemas using Zod
 */

// Placement schema for charm positioning on bracelet
export const PlacementSchema = z.object({
  charmId: z.string().min(1, "Charm ID is required"),
  t: z.number().min(0).max(1, "Position t must be between 0 and 1"),
  offsetMm: z.number().min(-50).max(50, "Offset must be between -50mm and 50mm"),
  rotationDeg: z.number().min(-180).max(180, "Rotation must be between -180 and 180 degrees"),
  zIndex: z.number().int().min(0, "Z-index must be a non-negative integer"),
  quantity: z.number().int().min(1).max(10, "Quantity must be between 1 and 10"),
});

// Design creation schema
export const DesignCreateSchema = z.object({
  braceletSlug: z.string().min(1, "Bracelet slug is required"),
  placements: z.array(PlacementSchema).max(50, "Maximum 50 charm placements allowed"),
});

// Design update schema
export const DesignUpdateSchema = z.object({
  designId: z.string().min(1, "Design ID is required"),
  placements: z.array(PlacementSchema).max(50, "Maximum 50 charm placements allowed"),
});

// Checkout schema
export const CheckoutSchema = z.object({
  designId: z.string().min(1, "Design ID is required"),
  customerEmail: z.string().email("Valid email is required").optional(),
  shippingAddress: z.object({
    name: z.string().min(1, "Name is required"),
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(2, "Country code is required"),
  }).optional(),
});

// Search query schema
export const SearchSchema = z.object({
  query: z.string().min(1).max(100),
  category: z.enum(["bracelets", "charms", "all"]).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  inStock: z.boolean().optional(),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Export types
export type Placement = z.infer<typeof PlacementSchema>;
export type DesignCreate = z.infer<typeof DesignCreateSchema>;
export type DesignUpdate = z.infer<typeof DesignUpdateSchema>;
export type CheckoutRequest = z.infer<typeof CheckoutSchema>;
export type SearchQuery = z.infer<typeof SearchSchema>;
export type PaginationParams = z.infer<typeof PaginationSchema>;

/**
 * Validate environment variables
 */
export function validateEnvironment() {
  const requiredVars = [
    "DATABASE_URL",
    "REDIS_URL", 
    "APP_URL",
    "PAYMENT_PROVIDER"
  ];
  
  const missing = requiredVars.filter(name => !process.env[name]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .trim()
    .slice(0, 1000); // Limit length
}

/**
 * Validate SVG path string
 */
export function validateSVGPath(path: string): boolean {
  // Basic validation - check if it looks like an SVG path
  const svgPathRegex = /^[MmLlHhVvCcSsQqTtAaZz0-9\s,.-]+$/;
  return svgPathRegex.test(path) && path.length > 0 && path.length < 10000;
}

/**
 * Validate image URL
 */
export function validateImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol) && 
           /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(parsedUrl.pathname);
  } catch {
    return false;
  }
}