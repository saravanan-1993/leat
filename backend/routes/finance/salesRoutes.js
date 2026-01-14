const express = require("express");
const router = express.Router();
const {
  getAllSales,
  getSalesSummary,
  getSalesByFinancialYear,
} = require("../../controllers/finance/salesController");

// Sales routes
router.get("/", getAllSales);
router.get("/summary", getSalesSummary);
router.get("/by-year", getSalesByFinancialYear);

module.exports = router;
