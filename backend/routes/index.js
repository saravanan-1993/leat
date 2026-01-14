const express = require('express');
const authRoutes = require('./auth/authRoutes');
const emailConfigRoutes = require('./email/emailConfigRoutes');
const webSettingsRoutes = require('./web/webSettingsRoutes');
const bannerRoutes = require('./web/bannerRoutes');
const companyRoutes = require('./web/companyRoutes');
const seoRoutes = require('./web/seoRoutes');
const policyRoutes = require('./web/policyRoutes');
const gstRateRoutes = require('./finance/gstRateRoutes');
const invoiceSettingsRoutes = require('./finance/invoiceSettingsRoutes');
const paymentGatewayRoutes = require('./payment-gateway/paymentGatewayRoutes');
const customerRoutes = require('./customer/customerRoutes');
const deliveryPartnerRoutes = require('./delivery/deliveryPartnerRoutes');
const categoryRoutes = require('./inventory/categoryRoutes');
const itemRoutes = require('./inventory/itemRoutes');
const warehouseRoutes = require('./inventory/warehouseRoutes');
const stockAdjustmentRoutes = require('./inventory/stockAdjustmentRoutes');
const inventoryReportRoutes = require('./inventory/reportRoutes');
const categorySubcategoryRoutes = require('./online/categorySubcategoryRoutes');
const frontendRoutes = require('./online/frontendRoutes');
const onlineProductRoutes = require('./online/onlineProductRoutes');
const productRoutes = require('./online/productRoutes');
const brandRoutes = require('./online/brandRoutes');
const badgeRoutes = require('./online/badgeRoutes');
const cuttingStyleRoutes = require('./online/cuttingStyleRoutes');
const barcodeRoutes = require('./online/barcodeRoutes');
const couponRoutes = require('./online/couponRoutes');
const cartRoutes = require('./online/cartRoutes');
const wishlistRoutes = require('./online/wishlistRoutes');
const addressRoutes = require('./online/addressRoutes');
const orderRoutes = require('./order/orderRoutes');
const myOrdersRoutes = require('./order/myOrdersRoutes');
const adminOrderRoutes = require('./order/adminOrderRoutes');
const posProductRoutes = require('./pos/posProductRoutes');
const posBarcodeRoutes = require('./pos/posBarcodeRoutes');

const router = express.Router();

// Root route - API information
router.get('/', (req, res) => {
  res.json({
    message: 'Monolith E-Commerce API is running',
    version: '1.0.0',
    architecture: 'monolith',
    database: 'monolith-ecommerce',
    timestamp: new Date().toISOString(),
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Monolith E-Commerce Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'connected',
  });
});

// Auth routes
router.use('/auth', authRoutes);

// Email routes
router.use('/email/dashboard/settings/email-configuration', emailConfigRoutes);

// Web settings routes
router.use('/web/web-settings', webSettingsRoutes);
router.use('/web/banners', bannerRoutes);
router.use('/web/company', companyRoutes);
router.use('/web/seo', seoRoutes);
router.use('/web/policies', policyRoutes);

// Finance routes
router.use('/finance/gst-rates', gstRateRoutes);
router.use('/finance/invoice-settings', invoiceSettingsRoutes);
const salesRoutes = require('./finance/salesRoutes');
router.use('/finance/sales', salesRoutes);
const transactionRoutes = require('./finance/transactionRoutes');
router.use('/finance/transactions', transactionRoutes);
const salesReportRoutes = require('./finance/salesReportRoutes');
router.use('/finance/reports', salesReportRoutes);

// Payment Gateway routes
router.use('/payment-gateway', paymentGatewayRoutes);

// Customer routes
router.use('/customer', customerRoutes);

// Delivery routes
router.use('/delivery-partners', deliveryPartnerRoutes);

// Inventory routes
router.use('/inventory/categories', categoryRoutes);
router.use('/inventory/items', itemRoutes);
router.use('/inventory/warehouses', warehouseRoutes);
router.use('/inventory/stock-adjustments', stockAdjustmentRoutes);
router.use('/inventory/reports', inventoryReportRoutes);

// Online service routes
router.use('/online/category-subcategory', categorySubcategoryRoutes);
router.use('/online/frontend', frontendRoutes);
router.use('/online/online-products', onlineProductRoutes);
router.use('/online/products', productRoutes); // Inventory products synced for online use
router.use('/online/brands', brandRoutes);
router.use('/online/badges', badgeRoutes);
router.use('/online/cutting-styles', cuttingStyleRoutes);
router.use('/online/barcodes', barcodeRoutes);
router.use('/online/coupons', couponRoutes);
router.use('/online/cart', cartRoutes);
router.use('/online/wishlist', wishlistRoutes);
router.use('/online/addresses', addressRoutes);
router.use('/online/orders', orderRoutes); // Order creation and management
router.use('/online/my-orders', myOrdersRoutes); // Customer order history
router.use('/online/admin/orders', adminOrderRoutes); // Admin order management

// POS routes
router.use('/pos/products', posProductRoutes); // POS product management
router.use('/pos/barcodes', posBarcodeRoutes); // POS barcode generation
const posOrderRoutes = require('./pos/posOrderRoutes');
router.use('/pos/orders', posOrderRoutes); // POS order management
const posInvoiceRoutes = require('./pos/posInvoiceRoutes');
router.use('/pos/invoices', posInvoiceRoutes); // POS invoice management

module.exports = router;
