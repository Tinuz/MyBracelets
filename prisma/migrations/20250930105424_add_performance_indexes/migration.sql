-- CreateIndex
CREATE INDEX "base_bracelets_active_featured_basePriceCents_idx" ON "base_bracelets"("active", "featured", "basePriceCents");

-- CreateIndex
CREATE INDEX "base_bracelets_braceletType_active_idx" ON "base_bracelets"("braceletType", "active");

-- CreateIndex
CREATE INDEX "base_bracelets_metalType_active_idx" ON "base_bracelets"("metalType", "active");

-- CreateIndex
CREATE INDEX "charms_active_priceCents_idx" ON "charms"("active", "priceCents");

-- CreateIndex
CREATE INDEX "charms_stock_active_idx" ON "charms"("stock", "active");

-- CreateIndex
CREATE INDEX "orders_status_createdAt_idx" ON "orders"("status", "createdAt");

-- CreateIndex
CREATE INDEX "orders_customerEmail_idx" ON "orders"("customerEmail");

-- CreateIndex
CREATE INDEX "orders_paymentId_idx" ON "orders"("paymentId");
