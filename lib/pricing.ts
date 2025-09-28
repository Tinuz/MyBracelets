/**
 * Core pricing logic for bracelet designs
 */

export type Bracelet = {
  basePriceCents: number;
};

export type Placement = {
  charmId: string;
  quantity: number;
};

export type CharmMapItem = {
  priceCents: number;
};

export type PricingResult = {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
};

/**
 * Calculate the total price for a bracelet design
 * Includes quantity-based discounts:
 * - 5% off for 5-9 charms
 * - 10% off for 10+ charms
 */
export function priceDesign(
  bracelet: Bracelet,
  placements: Placement[],
  charmMap: Map<string, CharmMapItem>
): PricingResult {
  // Calculate charm costs
  const charmsSum = placements.reduce((acc, placement) => {
    const charm = charmMap.get(placement.charmId);
    if (!charm) return acc;
    return acc + charm.priceCents * placement.quantity;
  }, 0);

  // Calculate total charm count for discount
  const totalCharmCount = placements.reduce((acc, placement) => acc + placement.quantity, 0);
  
  // Determine discount rate
  let discountRate = 0;
  if (totalCharmCount >= 10) {
    discountRate = 0.1; // 10% off
  } else if (totalCharmCount >= 5) {
    discountRate = 0.05; // 5% off
  }

  const subtotal = bracelet.basePriceCents + charmsSum;
  const discount = Math.floor(subtotal * discountRate);
  const total = subtotal - discount;

  return {
    subtotalCents: subtotal,
    discountCents: discount,
    totalCents: total,
  };
}

/**
 * Format price in cents to currency string
 */
export function formatPrice(cents: number, currency: string = "EUR"): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate shipping cost based on order total
 */
export function calculateShipping(totalCents: number): number {
  // Free shipping over €75
  if (totalCents >= 7500) return 0;
  
  // Standard shipping €4.95
  return 495;
}

/**
 * Validate if charm quantities are within allowed limits
 */
export function validateCharmQuantities(
  placements: Placement[],
  charmLimits: Map<string, number>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const placement of placements) {
    const maxAllowed = charmLimits.get(placement.charmId);
    if (maxAllowed && placement.quantity > maxAllowed) {
      errors.push(`Charm ${placement.charmId} exceeds maximum quantity of ${maxAllowed}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}