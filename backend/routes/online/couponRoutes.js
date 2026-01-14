const express = require("express");
const router = express.Router();
const couponController = require("../../controllers/online/couponController");

// Create a new coupon
router.post("/", couponController.createCoupon);

// Get all coupons
router.get("/", couponController.getAllCoupons);

// Get coupon by ID
router.get("/:id", couponController.getCouponById);

// Update coupon
router.put("/:id", couponController.updateCoupon);

// Delete coupon
router.delete("/:id", couponController.deleteCoupon);

// Validate coupon
router.post("/validate", couponController.validateCoupon);

// Apply coupon (record usage)
router.post("/apply", couponController.applyCoupon);

// Get coupon statistics
router.get("/:id/stats", couponController.getCouponStats);

module.exports = router;
