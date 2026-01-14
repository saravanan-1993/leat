const { prisma } = require("../../config/database");

/**
 * Update stock after order creation (POS or Online)
 * This replaces the Kafka-based stock update flow from microservices
 * 
 * @param {Object} order - Order object with items
 * @param {String} source - "POS_ORDER" or "ONLINE_ORDER"
 * @returns {Promise<Array>} - Array of stock update results
 */
const updateStockAfterOrder = async (order, source = "POS_ORDER") => {
  const results = [];

  try {
    console.log(`📦 [Stock Update] Processing ${source} for order: ${order.orderNumber}`);

    for (const item of order.items) {
      try {
        // For POS orders, we need to update both POSProduct and Item (inventory)
        // For Online orders, we need to find Item using inventoryProductId
        
        let product = null;
        let isPOSProduct = false;

        if (source === "POS_ORDER") {
          // First try to find in POSProduct collection
          const posProduct = await prisma.pOSProduct.findUnique({
            where: { id: item.productId },
          });

          if (posProduct) {
            isPOSProduct = true;
            // Update POS product display quantity
            const previousQuantity = posProduct.quantity;
            const newQuantity = Math.max(0, previousQuantity - item.quantity);

            let status = "in_stock";
            if (newQuantity === 0) {
              status = "out_of_stock";
            } else if (newQuantity <= posProduct.lowStockAlertLevel) {
              status = "low_stock";
            }

            await prisma.pOSProduct.update({
              where: { id: item.productId },
              data: {
                quantity: newQuantity,
                status,
              },
            });

            console.log(
              `✅ POS Product updated: ${posProduct.itemName} (${previousQuantity} → ${newQuantity})`
            );

            // Now find the corresponding inventory item using itemCode
            if (posProduct.itemCode) {
              product = await prisma.item.findFirst({
                where: { itemCode: posProduct.itemCode },
                include: { warehouse: true },
              });
            }
          }
        } else if (source === "ONLINE_ORDER") {
          // For online orders, use inventoryProductId to find the Item
          if (item.inventoryProductId) {
            product = await prisma.item.findUnique({
              where: { id: item.inventoryProductId },
              include: { warehouse: true },
            });
            
            if (product) {
              console.log(`🔗 Found inventory item via inventoryProductId: ${product.itemName}`);
            }
          }
        }

        // If not found yet, try direct productId lookup
        if (!product) {
          product = await prisma.item.findUnique({
            where: { id: item.productId },
            include: {
              warehouse: true,
            },
          });
        }

        if (!product) {
          console.warn(`⚠️ Product not found in inventory: ${item.productId} (${item.productName})`);
          results.push({
            productId: item.productId,
            productName: item.productName,
            success: false,
            error: "Product not found in inventory",
          });
          continue;
        }

        const previousQuantity = product.quantity;
        const quantitySold = item.quantity;
        const newQuantity = Math.max(0, previousQuantity - quantitySold);

        // Check if sufficient stock available
        if (newQuantity < 0) {
          console.error(
            `❌ Insufficient stock for ${product.itemName}: Available: ${previousQuantity}, Requested: ${quantitySold}`
          );
        }

        // Determine new status
        let status = "in_stock";
        if (newQuantity === 0) {
          status = "out_of_stock";
        } else if (newQuantity <= product.lowStockAlertLevel) {
          status = "low_stock";
        }

        // Update product quantity and status
        const updatedProduct = await prisma.item.update({
          where: { id: product.id },
          data: {
            quantity: newQuantity,
            status,
          },
        });

        console.log(
          `✅ Stock updated: ${product.itemName} (${previousQuantity} → ${newQuantity}) - Status: ${status}`
        );

        // Create stock adjustment record for audit trail
        await prisma.stockAdjustment.create({
          data: {
            itemId: product.id,
            itemName: product.itemName,
            category: product.category,
            warehouseId: product.warehouseId,
            warehouseName: product.warehouse?.name || product.warehouse || "Unknown",
            adjustmentMethod: "sales_order",
            adjustmentType: "decrease",
            quantity: quantitySold,
            previousQuantity,
            newQuantity,
            adjustedBy: "system",
            // Sales order specific fields
            salesOrderId: order.id,
            soNumber: order.invoiceNumber || order.orderNumber,
            customerId: order.customerId || null,
            customerName: order.customerName || "Walk-in Customer",
            notes: `${source === "POS_ORDER" ? "POS" : "Online"} sale - Invoice: ${
              order.invoiceNumber || order.orderNumber
            }, Payment: ${order.paymentMethod}`,
          },
        });

        console.log(
          `📝 Stock adjustment created - Invoice: ${
            order.invoiceNumber || order.orderNumber
          }, Method: sales_order, Type: decrease`
        );

        // Log stock alerts
        if (status === "low_stock") {
          console.warn(
            `⚠️ LOW STOCK ALERT: ${product.itemName} - Quantity: ${newQuantity} (Alert Level: ${product.lowStockAlertLevel})`
          );
        } else if (status === "out_of_stock") {
          console.error(`❌ OUT OF STOCK: ${product.itemName} - Quantity: ${newQuantity}`);
        }

        results.push({
          productId: product.id,
          productName: product.itemName,
          previousQuantity,
          newQuantity,
          quantitySold,
          status,
          success: true,
        });
      } catch (itemError) {
        console.error(`❌ Error updating stock for ${item.productName}:`, itemError.message);
        results.push({
          productId: item.productId,
          productName: item.productName,
          success: false,
          error: itemError.message,
        });
      }
    }

    console.log(
      `✅ Stock update completed for order ${order.orderNumber}: ${results.filter((r) => r.success).length}/${
        results.length
      } items updated`
    );

    return results;
  } catch (error) {
    console.error(`❌ Error in updateStockAfterOrder:`, error);
    throw error;
  }
};

/**
 * Update stock after manual stock adjustment
 * This replaces the stock adjustment flow from inventory-service
 * 
 * @param {Object} adjustment - Stock adjustment data
 * @returns {Promise<Object>} - Updated product
 */
const updateStockAfterAdjustment = async (adjustment) => {
  try {
    const { itemId, adjustmentType, quantity } = adjustment;

    // Find the product
    const product = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        warehouse: true,
      },
    });

    if (!product) {
      throw new Error(`Product not found: ${itemId}`);
    }

    const previousQuantity = product.quantity;
    let newQuantity;

    // Calculate new quantity based on adjustment type
    if (adjustmentType === "increase") {
      newQuantity = previousQuantity + quantity;
    } else {
      newQuantity = Math.max(0, previousQuantity - quantity);
    }

    // Determine new status
    let status = "in_stock";
    if (newQuantity === 0) {
      status = "out_of_stock";
    } else if (newQuantity <= product.lowStockAlertLevel) {
      status = "low_stock";
    }

    // Update product
    const updatedProduct = await prisma.item.update({
      where: { id: itemId },
      data: {
        quantity: newQuantity,
        status,
      },
    });

    console.log(
      `✅ Stock adjusted: ${product.itemName} (${previousQuantity} → ${newQuantity}) - ${adjustmentType} by ${quantity}`
    );

    return {
      product: updatedProduct,
      previousQuantity,
      newQuantity,
      quantityChange: adjustmentType === "increase" ? quantity : -quantity,
      status,
    };
  } catch (error) {
    console.error(`❌ Error in updateStockAfterAdjustment:`, error);
    throw error;
  }
};

/**
 * Reverse stock update (for order cancellation/refund)
 * 
 * @param {Object} order - Order object with items
 * @param {String} source - "POS_ORDER" or "ONLINE_ORDER"
 * @returns {Promise<Array>} - Array of stock update results
 */
const reverseStockUpdate = async (order, source = "POS_ORDER") => {
  const results = [];

  try {
    console.log(`🔄 [Stock Reversal] Processing ${source} reversal for order: ${order.orderNumber}`);

    for (const item of order.items) {
      try {
        const product = await prisma.item.findUnique({
          where: { id: item.productId },
          include: {
            warehouse: true,
          },
        });

        if (!product) {
          console.warn(`⚠️ Product not found: ${item.productId}`);
          continue;
        }

        const previousQuantity = product.quantity;
        const quantityReturned = item.quantity;
        const newQuantity = previousQuantity + quantityReturned;

        // Determine new status
        let status = "in_stock";
        if (newQuantity === 0) {
          status = "out_of_stock";
        } else if (newQuantity <= product.lowStockAlertLevel) {
          status = "low_stock";
        }

        // Update product
        await prisma.item.update({
          where: { id: product.id },
          data: {
            quantity: newQuantity,
            status,
          },
        });

        // Create stock adjustment record
        await prisma.stockAdjustment.create({
          data: {
            itemId: product.id,
            itemName: product.itemName,
            category: product.category,
            warehouseId: product.warehouseId,
            warehouseName: product.warehouse?.name || product.warehouse || "Unknown",
            adjustmentMethod: "sales_return",
            adjustmentType: "increase",
            quantity: quantityReturned,
            previousQuantity,
            newQuantity,
            adjustedBy: "system",
            salesOrderId: order.id,
            soNumber: order.invoiceNumber || order.orderNumber,
            customerId: order.customerId || null,
            customerName: order.customerName || "Walk-in Customer",
            notes: `${source === "POS_ORDER" ? "POS" : "Online"} order cancelled/refunded - Invoice: ${
              order.invoiceNumber || order.orderNumber
            }`,
          },
        });

        console.log(`✅ Stock reversed: ${product.itemName} (${previousQuantity} → ${newQuantity})`);

        results.push({
          productId: product.id,
          productName: product.itemName,
          previousQuantity,
          newQuantity,
          quantityReturned,
          status,
          success: true,
        });
      } catch (itemError) {
        console.error(`❌ Error reversing stock for ${item.productName}:`, itemError.message);
        results.push({
          productId: item.productId,
          productName: item.productName,
          success: false,
          error: itemError.message,
        });
      }
    }

    console.log(`✅ Stock reversal completed for order ${order.orderNumber}`);
    return results;
  } catch (error) {
    console.error(`❌ Error in reverseStockUpdate:`, error);
    throw error;
  }
};

module.exports = {
  updateStockAfterOrder,
  updateStockAfterAdjustment,
  reverseStockUpdate,
};
