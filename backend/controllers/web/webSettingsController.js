const { prisma } = require("../../config/database");
const { uploadToS3, getPresignedUrl, deleteFromS3 } = require("../../utils/web/uploadsS3");

// Get current web settings
const getWebSettings = async (req, res) => {
  try {
    let settings = await prisma.webSettings.findFirst();
    
    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.webSettings.create({
        data: {},
      });
    }

    // Generate presigned URLs for the keys stored in database
    const logoPresignedUrl = settings.logoUrl ? await getPresignedUrl(settings.logoUrl) : null;
    const faviconPresignedUrl = settings.faviconUrl ? await getPresignedUrl(settings.faviconUrl) : null;

    const response = {
      id: settings.id,
      logoUrl: logoPresignedUrl, // Presigned URL for frontend
      faviconUrl: faviconPresignedUrl, // Presigned URL for frontend
      logoKey: settings.logoUrl, // Original key (optional, for reference)
      faviconKey: settings.faviconUrl, // Original key (optional, for reference)
      updatedAt: settings.updatedAt,
      createdAt: settings.createdAt,
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching web settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch web settings",
      message: error.message,
    });
  }
};

// Upload logo
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Get current settings
    let settings = await prisma.webSettings.findFirst();
    
    // Delete old logo from S3 if exists
    if (settings?.logoUrl) {
      await deleteFromS3(settings.logoUrl);
    }

    // Upload new logo to S3 - returns only the key/path
    const logoKey = await uploadToS3(req.file, "web-settings/logos");

    // Update or create settings - store only the key
    if (settings) {
      settings = await prisma.webSettings.update({
        where: { id: settings.id },
        data: { logoUrl: logoKey },
      });
    } else {
      settings = await prisma.webSettings.create({
        data: { logoUrl: logoKey },
      });
    }

    // Generate presigned URL for response
    const logoPresignedUrl = await getPresignedUrl(logoKey);

    res.json({
      success: true,
      message: "Logo uploaded successfully",
      data: {
        logoUrl: logoPresignedUrl, // Presigned URL for immediate use
        logoKey: logoKey, // S3 key stored in database
      },
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload logo",
      message: error.message,
    });
  }
};

// Upload favicon
const uploadFavicon = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Get current settings
    let settings = await prisma.webSettings.findFirst();
    
    // Delete old favicon from S3 if exists
    if (settings?.faviconUrl) {
      await deleteFromS3(settings.faviconUrl);
    }

    // Upload new favicon to S3 - returns only the key/path
    const faviconKey = await uploadToS3(req.file, "web-settings/favicons");

    // Update or create settings - store only the key
    if (settings) {
      settings = await prisma.webSettings.update({
        where: { id: settings.id },
        data: { faviconUrl: faviconKey },
      });
    } else {
      settings = await prisma.webSettings.create({
        data: { faviconUrl: faviconKey },
      });
    }

    // Generate presigned URL for response
    const faviconPresignedUrl = await getPresignedUrl(faviconKey);

    res.json({
      success: true,
      message: "Favicon uploaded successfully",
      data: {
        faviconUrl: faviconPresignedUrl, // Presigned URL for immediate use
        faviconKey: faviconKey, // S3 key stored in database
      },
    });
  } catch (error) {
    console.error("Error uploading favicon:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload favicon",
      message: error.message,
    });
  }
};

// Delete logo
const deleteLogo = async (req, res) => {
  try {
    const settings = await prisma.webSettings.findFirst();
    
    if (!settings || !settings.logoUrl) {
      return res.status(404).json({
        success: false,
        error: "No logo found",
      });
    }

    // Delete from S3
    await deleteFromS3(settings.logoUrl);

    // Update settings
    await prisma.webSettings.update({
      where: { id: settings.id },
      data: { logoUrl: null },
    });

    res.json({
      success: true,
      message: "Logo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting logo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete logo",
      message: error.message,
    });
  }
};

// Delete favicon
const deleteFavicon = async (req, res) => {
  try {
    const settings = await prisma.webSettings.findFirst();
    
    if (!settings || !settings.faviconUrl) {
      return res.status(404).json({
        success: false,
        error: "No favicon found",
      });
    }

    // Delete from S3
    await deleteFromS3(settings.faviconUrl);

    // Update settings
    await prisma.webSettings.update({
      where: { id: settings.id },
      data: { faviconUrl: null },
    });

    res.json({
      success: true,
      message: "Favicon deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting favicon:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete favicon",
      message: error.message,
    });
  }
};

module.exports = {
  getWebSettings,
  uploadLogo,
  uploadFavicon,
  deleteLogo,
  deleteFavicon,
};
