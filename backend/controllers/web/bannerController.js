const { prisma } = require("../../config/database");
const { uploadToS3, deleteFromS3, getPresignedUrl } = require("../../utils/web/uploadsS3");

// Get all banners
const getBanners = async (req, res) => {
  try {
    console.log("Fetching banners...");
    
    const banners = await prisma.banner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Found ${banners.length} banners`);

    // Generate pre-signed URLs for images
    const bannersWithUrls = await Promise.all(
      banners.map(async (banner) => {
        try {
          const imageUrl = banner.imageUrl
            ? await getPresignedUrl(banner.imageUrl, 3600)
            : null;
          return {
            ...banner,
            imageUrl,
          };
        } catch (error) {
          console.error(`Error generating URL for banner ${banner.id}:`, error);
          return {
            ...banner,
            imageUrl: banner.imageUrl, // Return original key if pre-signed URL fails
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      data: bannersWithUrls,
    });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch banners",
      message: error.message,
    });
  }
};

// Get single banner
const getBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: "Banner not found",
      });
    }

    // Generate pre-signed URL for image
    const imageUrl = banner.imageUrl
      ? await getPresignedUrl(banner.imageUrl, 3600)
      : null;

    res.status(200).json({
      success: true,
      data: {
        ...banner,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching banner:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch banner",
    });
  }
};

// Create banner
const createBanner = async (req, res) => {
  try {
    const { title, linkUrl } = req.body;
    const imageFile = req.file;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        error: "Banner image is required",
      });
    }

    // Upload image to S3
    const imageKey = await uploadToS3(imageFile, "banners");

    // Create banner in database
    const banner = await prisma.banner.create({
      data: {
        title: title.trim(),
        linkUrl: linkUrl?.trim() || "",
        imageUrl: imageKey, // Store S3 key, not full URL
      },
    });

    // Generate pre-signed URL for response
    const imageUrl = await getPresignedUrl(banner.imageUrl, 3600);

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: {
        ...banner,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("Error creating banner:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create banner",
    });
  }
};

// Update banner
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, linkUrl, existingImageUrl } = req.body;
    const imageFile = req.file;

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existingBanner) {
      return res.status(404).json({
        success: false,
        error: "Banner not found",
      });
    }

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    let imageKey = existingBanner.imageUrl;

    // If new image is uploaded
    if (imageFile) {
      // Delete old image from S3
      if (existingBanner.imageUrl) {
        try {
          await deleteFromS3(existingBanner.imageUrl);
        } catch (error) {
          console.error("Error deleting old image:", error);
          // Continue even if delete fails
        }
      }

      // Upload new image to S3
      imageKey = await uploadToS3(imageFile, "banners");
    }

    // Update banner in database
    const banner = await prisma.banner.update({
      where: { id },
      data: {
        title: title.trim(),
        linkUrl: linkUrl?.trim() || "",
        imageUrl: imageKey,
      },
    });

    // Generate pre-signed URL for response
    const imageUrl = await getPresignedUrl(banner.imageUrl, 3600);

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: {
        ...banner,
        imageUrl,
      },
    });
  } catch (error) {
    console.error("Error updating banner:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update banner",
    });
  }
};

// Delete banner
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if banner exists
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: "Banner not found",
      });
    }

    // Delete image from S3
    if (banner.imageUrl) {
      try {
        await deleteFromS3(banner.imageUrl);
      } catch (error) {
        console.error("Error deleting image from S3:", error);
        // Continue even if delete fails
      }
    }

    // Delete banner from database
    await prisma.banner.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete banner",
    });
  }
};

module.exports = {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
};
