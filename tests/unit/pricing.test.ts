import { describe, it, expect } from 'vitest'
import { priceDesign, formatPrice, calculateShipping, validateCharmQuantities } from '@/lib/pricing'

describe('Pricing Functions', () => {
  describe('priceDesign', () => {
    it('should calculate base price without charms', () => {
      const bracelet = { basePriceCents: 3000 }
    interface Bracelet {
      basePriceCents: number
    }

    interface Placement {
      charmId: string
      quantity: number
    }

    interface Charm {
      priceCents: number
    }

    const placements: Placement[] = []
      const charmMap = new Map()

      const result = priceDesign(bracelet, placements, charmMap)

      expect(result.subtotalCents).toBe(3000)
      expect(result.discountCents).toBe(0)
      expect(result.totalCents).toBe(3000)
    })

    it('should calculate price with charms (no discount)', () => {
      const bracelet = { basePriceCents: 3000 }
      const placements = [
        { charmId: 'charm1', quantity: 2 },
        { charmId: 'charm2', quantity: 1 },
      ]
      const charmMap = new Map([
        ['charm1', { priceCents: 500 }],
        ['charm2', { priceCents: 400 }],
      ])

      const result = priceDesign(bracelet, placements, charmMap)

      expect(result.subtotalCents).toBe(3000 + 500 * 2 + 400) // 4400
      expect(result.discountCents).toBe(0) // < 5 charms
      expect(result.totalCents).toBe(4400)
    })

    it('should apply 5% discount for 5-9 charms', () => {
      const bracelet = { basePriceCents: 3000 }
      const placements = [
        { charmId: 'charm1', quantity: 5 },
      ]
      const charmMap = new Map([
        ['charm1', { priceCents: 500 }],
      ])

      const result = priceDesign(bracelet, placements, charmMap)

      expect(result.subtotalCents).toBe(5500) // 3000 + 5 * 500
      expect(result.discountCents).toBe(275) // 5% of 5500 = 275
      expect(result.totalCents).toBe(5225) // 5500 - 275
    })

    it('should apply 10% discount for 10+ charms', () => {
      const bracelet = { basePriceCents: 3000 }
      const placements = [
        { charmId: 'charm1', quantity: 10 },
      ]
      const charmMap = new Map([
        ['charm1', { priceCents: 500 }],
      ])

      const result = priceDesign(bracelet, placements, charmMap)

      expect(result.subtotalCents).toBe(8000) // 3000 + 10 * 500
      expect(result.discountCents).toBe(800) // 10% of 8000 = 800
      expect(result.totalCents).toBe(7200) // 8000 - 800
    })

    it('should handle unknown charm IDs gracefully', () => {
      const bracelet = { basePriceCents: 3000 }
      const placements = [
        { charmId: 'unknown', quantity: 1 },
        { charmId: 'charm1', quantity: 1 },
      ]
      const charmMap = new Map([
        ['charm1', { priceCents: 500 }],
      ])

      const result = priceDesign(bracelet, placements, charmMap)

      expect(result.subtotalCents).toBe(3500) // 3000 + 500 (unknown charm ignored)
      expect(result.discountCents).toBe(0)
      expect(result.totalCents).toBe(3500)
    })
  })

  describe('formatPrice', () => {
    it('should format price in EUR by default', () => {
      expect(formatPrice(3000)).toMatch(/€\s?30[.,]00/)
    })

    it('should format price with specified currency', () => {
      expect(formatPrice(2500, 'USD')).toMatch(/\$\s?25[.,]00/)
    })
  })

  describe('calculateShipping', () => {
    it('should return free shipping for orders over €75', () => {
      expect(calculateShipping(7500)).toBe(0)
      expect(calculateShipping(10000)).toBe(0)
    })

    it('should return standard shipping cost for smaller orders', () => {
      expect(calculateShipping(5000)).toBe(495) // €4.95
      expect(calculateShipping(7499)).toBe(495)
    })
  })

  describe('validateCharmQuantities', () => {
    it('should validate charm quantities against limits', () => {
      const placements = [
        { charmId: 'charm1', quantity: 3 },
        { charmId: 'charm2', quantity: 8 },
      ]
      const charmLimits = new Map([
        ['charm1', 5],
        ['charm2', 10],
      ])

      const result = validateCharmQuantities(placements, charmLimits)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return errors for exceeded quantities', () => {
      const placements = [
        { charmId: 'charm1', quantity: 6 }, // Exceeds limit
        { charmId: 'charm2', quantity: 5 }, // OK
      ]
      const charmLimits = new Map([
        ['charm1', 5],
        ['charm2', 10],
      ])

      const result = validateCharmQuantities(placements, charmLimits)

      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toContain('charm1')
      expect(result.errors[0]).toContain('5')
    })
  })
})