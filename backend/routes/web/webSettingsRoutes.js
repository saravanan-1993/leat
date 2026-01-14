const express = require("express");
const router = express.Router();
const { upload } = require("../../utils/web/uploadsS3");
const {
  getWebSettings,
  uploadLogo,
  uploadFavicon,
  deleteLogo,
  deleteFavicon,
} = require("../../controllers/web/webSettingsController");

// Get web settings
router.get("/", getWebSettings);

// Upload logo
router.post("/logo", upload.single("logo"), uploadLogo);

// Upload favicon
router.post("/favicon", upload.single("favicon"), uploadFavicon);

// Delete logo
router.delete("/logo", deleteLogo);

// Delete favicon
router.delete("/favicon", deleteFavicon);

module.exports = router;
