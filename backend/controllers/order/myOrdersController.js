const { prisma } = require("../../config/database");
const { getPresignedUrl } = require("../../utils/online/uploadS3");

/**
 * Convert S3 keys to presigned URLs in order items
 */
const convertOrderImagesToUrls = async (orders) => {
  return Promise.all(
    orders.map(async (order) => {
      const itemsWithUrls = await Promise.all(
        order.items.map(async (item) => {
          if (item.productImage && !item.productImage.startsWith("http")) {
            try {
              const presignedUrl = await getPresignedUrl(item.productImage, 3600);
              return { ...item, productImage: presignedUrl };
            } catch (error) {
              console.error("Error generating presigned URL:", error);
              return item;
            }
          }
          return item;
        })
      );
      return { ...order, items: itemsWithUrls };
    })
  );
};

/**
 * Get all orders for a user
 * GET /api/online/my-orders
 */
const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const { page = 1, limit = 10, status } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { userId };

    if (status && status !== "all") {
      where.orderStatus = status;
    }

    const [orders, total] = await Promise.all([
      prisma.onlineOrder.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.onlineOrder.count({ where }),
    ]);

    // Convert S3 keys to presigned URLs
    const ordersWithUrls = await convertOrderImagesToUrls(orders);

    res.json({
      success: true,
      data: ordersWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
      message: error.message,
    });
  }
};

/**
 * Get single order by order number
 * GET /api/online/my-orders/:orderNumber
 */
const getOrderByNumber = async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const order = await prisma.onlineOrder.findFirst({
      where: {
        orderNumber,
        userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Convert S3 keys to presigned URLs
    const [orderWithUrls] = await convertOrderImagesToUrls([order]);

    res.json({
      success: true,
      data: orderWithUrls,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order",
      message: error.message,
    });
  }
};

module.exports = {
  getMyOrders,
  getOrderByNumber,
};
