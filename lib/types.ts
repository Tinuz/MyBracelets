// Type aliases for admin compatibility  
export type Bracelet = {
  id: string;
  slug: string;
  name: string;
  svgPath: string | null;
  imageUrl: string | null;
  lengthMm: number;
  basePriceCents: number;
  thickness: number;
  color: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};