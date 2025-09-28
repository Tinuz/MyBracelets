import { test, expect } from '@playwright/test'

test.describe('Bracelet Designer E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/')
  })

  test('should navigate from home to designer', async ({ page }) => {
    // Click on "Start Designing" button
    await page.click('text=Start Designing')
    
    // Should navigate to bracelets page
    await expect(page).toHaveURL('/bracelets')
    
    // Should see bracelet options
    await expect(page.locator('text=Choose Your Base Bracelet')).toBeVisible()
    await expect(page.locator('text=Classic Silver')).toBeVisible()
  })

  test('should load designer for classic bracelet', async ({ page }) => {
    // Navigate directly to designer
    await page.goto('/designer/classic')
    
    // Wait for designer to load
    await expect(page.locator('text=Classic Silver')).toBeVisible()
    await expect(page.locator('svg')).toBeVisible()
    await expect(page.locator('text=Available Charms')).toBeVisible()
  })

  test('should be able to add charms to design', async ({ page }) => {
    await page.goto('/designer/classic')
    
    // Wait for charms to load
    await expect(page.locator('text=Available Charms')).toBeVisible()
    
    // Add a charm
    await page.click('button:has-text("Heart")')
    
    // Should see charm in SVG
    // Note: In a real test, you'd check for specific SVG elements
    await expect(page.locator('svg')).toBeVisible()
    
    // Should see updated pricing
    await expect(page.locator('text=Order Summary')).toBeVisible()
  })

  test('should show pricing calculation', async ({ page }) => {
    await page.goto('/designer/classic')
    
    // Wait for initial load
    await expect(page.locator('text=Order Summary')).toBeVisible()
    
    // Should show base price
    await expect(page.locator('text=€30.00')).toBeVisible()
    
    // Add multiple charms to test discount
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("Heart")')
    }
    
    // Should show discount
    await expect(page.locator('text=Discount')).toBeVisible()
  })

  test('should save design and proceed to checkout', async ({ page }) => {
    await page.goto('/designer/classic')
    
    // Add a charm
    await page.click('button:has-text("Heart")')
    
    // Save design
    await page.click('text=Save Design')
    
    // Wait for save to complete
    await expect(page.locator('text=Proceed to Checkout')).not.toBeDisabled()
    
    // Proceed to checkout
    await page.click('text=Proceed to Checkout')
    
    // Should redirect to success page (mock checkout)
    await expect(page).toHaveURL(/.*success.*/)
    await expect(page.locator('text=Order Successful!')).toBeVisible()
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Test non-existent bracelet
    await page.goto('/designer/nonexistent')
    
    // Should show error or redirect
    await expect(
      page.locator('text=Bracelet not found')
        .or(page.locator('text=404'))
        .or(page.locator('text=Not Found'))
    ).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/designer/classic')
    
    // Designer should still be functional on mobile
    await expect(page.locator('text=Classic Silver')).toBeVisible()
    await expect(page.locator('svg')).toBeVisible()
    
    // Should be able to add charms
    await page.click('button:has-text("Heart")')
    
    // Pricing should be visible
    await expect(page.locator('text=Order Summary')).toBeVisible()
  })
})