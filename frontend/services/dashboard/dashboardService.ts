import axiosInstance from '@/lib/axios';
import type { DashboardData } from '@/types/dashboard';

// API Response Types
interface Order {
  total: number;
  orderStatus: string;
  orderType?: string;
  isDelayed?: boolean;
  paymentMethod?: string;
  paymentStatus?: string;
  refundStatus?: string;
}

interface Warehouse {
  status: string; // "active" or "inactive"
}

interface Category {
  name: string;
  isActive: boolean;
}

interface TopSellingItem {
  itemName: string;
  totalQuantitySold: number;
}

interface EODData {
  totalUnits?: number;
  totalValue?: number;
  isReconciled?: boolean;
  summary?: {
    totalUnits?: number;
    totalValue?: number;
    totalItems?: number;
    lowStockItems?: number;
    outOfStockItems?: number;
  };
  noDataForDate?: boolean;
  isFutureDate?: boolean;
}

// Dashboard API Service
export const dashboardService = {
  // ============================================
  // SECTION 1: TOP KPI CARDS
  // ============================================
  
  // Get today's orders count from order-service (unified)
  async getTodaysOrders(startDate?: string, endDate?: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // If no dates provided, use today
      const start = startDate || today;
      const end = endDate || today;
      
      // Add end of day time to endDate to include all orders on that day
      const endDateTime = new Date(end);
      endDateTime.setHours(23, 59, 59, 999);
      const endDateISO = endDateTime.toISOString();
      
      // Fetch both POS and Online orders from order-service
      const [posResponse, onlineResponse] = await Promise.all([
        axiosInstance.get('/api/order/pos-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/api/order/online-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } }))
      ]);
      
      const posOrders = posResponse.data.data?.length || 0;
      const onlineOrders = onlineResponse.data.data?.length || 0;
      
      return posOrders + onlineOrders;
    } catch (error) {
      console.error('Error fetching today\'s orders:', error);
      return 0;
    }
  },

  // Get today's revenue from order-service (unified)
  async getTodaysRevenue(startDate?: string, endDate?: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // If no dates provided, use today
      const start = startDate || today;
      const end = endDate || today;
      
      // Add end of day time to endDate
      const endDateTime = new Date(end);
      endDateTime.setHours(23, 59, 59, 999);
      const endDateISO = endDateTime.toISOString();
      
      // Fetch both POS and Online orders from order-service
      const [posResponse, onlineResponse] = await Promise.all([
        axiosInstance.get('/api/order/pos-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/api/order/online-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } }))
      ]);
      
      const posOrders: Order[] = posResponse.data.data || [];
      const onlineOrders: Order[] = onlineResponse.data.data || [];
      
      const posRevenue = posOrders.reduce((sum: number, order) => sum + (order.total || 0), 0);
      const onlineRevenue = onlineOrders.reduce((sum: number, order) => sum + (order.total || 0), 0);
      
      return posRevenue + onlineRevenue;
    } catch (error) {
      console.error('Error fetching today\'s revenue:', error);
      return 0;
    }
  },

  // Get average order value from order-service (unified)
  async getAverageOrderValue(startDate?: string, endDate?: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // If no dates provided, use today
      const start = startDate || today;
      const end = endDate || today;
      
      // Add end of day time to endDate
      const endDateTime = new Date(end);
      endDateTime.setHours(23, 59, 59, 999);
      const endDateISO = endDateTime.toISOString();
      
      // Fetch both POS and Online orders from order-service
      const [posResponse, onlineResponse] = await Promise.all([
        axiosInstance.get('/api/order/pos-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/api/order/online-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } }))
      ]);
      
      const posOrders: Order[] = posResponse.data.data || [];
      const onlineOrders: Order[] = onlineResponse.data.data || [];
      const allOrders = [...posOrders, ...onlineOrders];
      
      if (allOrders.length === 0) return 0;
      
      const total = allOrders.reduce((sum: number, order) => sum + (order.total || 0), 0);
      return total / allOrders.length;
    } catch (error) {
      console.error('Error fetching average order value:', error);
      return 0;
    }
  },

  // Get on-time delivery percentage
  async getOnTimeDelivery() {
    try {
      // This would come from delivery service
      // For now, return mock data
      return 98.5;
    } catch (error) {
      console.error('Error fetching on-time delivery:', error);
      return 0;
    }
  },

  // Get cancelled orders count from order-service
  async getCancelledOrders(startDate?: string, endDate?: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // If no dates provided, use today
      const start = startDate || today;
      const end = endDate || today;
      
      // Add end of day time to endDate
      const endDateTime = new Date(end);
      endDateTime.setHours(23, 59, 59, 999);
      const endDateISO = endDateTime.toISOString();
      
      // Fetch cancelled orders from both POS and Online
      // POS uses orderStatus parameter, Online uses status parameter
      const [posResponse, onlineResponse] = await Promise.all([
        axiosInstance.get('/api/order/pos-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            orderStatus: 'cancelled',
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/api/order/online-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            status: 'cancelled',
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } }))
      ]);
      
      const posCount = posResponse.data.data?.length || 0;
      const onlineCount = onlineResponse.data.data?.length || 0;
      
      return posCount + onlineCount;
    } catch (error) {
      console.error('Error fetching cancelled orders:', error);
      return 0;
    }
  },

  // Get warehouse status
  async getWarehouseStatus() {
    try {
      const response = await axiosInstance.get('/api/inventory/warehouses');
      const warehouses: Warehouse[] = response.data.data || [];
      return {
        total: warehouses.length,
        online: warehouses.filter((w) => w.status === 'active').length,
        offline: warehouses.filter((w) => w.status === 'inactive').length
      };
    } catch (error) {
      console.error('Error fetching warehouse status:', error);
      return { total: 0, online: 0, offline: 0 };
    }
  },

  // ============================================
  // SECTION 2: ORDER OPERATIONS
  // ============================================
  
  async getOrderOperations(startDate?: string, endDate?: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // If no dates provided, use today
      const start = startDate || today;
      const end = endDate || today;
      
      // Add end of day time to endDate
      const endDateTime = new Date(end);
      endDateTime.setHours(23, 59, 59, 999);
      const endDateISO = endDateTime.toISOString();
      
      // Fetch both POS and Online orders from order-service
      const [posResponse, onlineResponse] = await Promise.all([
        axiosInstance.get('/api/order/pos-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } })),
        axiosInstance.get('/api/order/online-orders', {
          params: { 
            startDate: start,
            endDate: endDateISO,
            limit: 1000
          }
        }).catch(() => ({ data: { data: [] } }))
      ]);
      
      const posOrders: Order[] = posResponse.data.data || [];
      const onlineOrders: Order[] = onlineResponse.data.data || [];
      
      // POS orders are mostly completed, so we focus on online orders for operations
      // Online order statuses: pending, confirmed, packing, shipped, delivered, cancelled
      return {
        pending: onlineOrders.filter((o) => o.orderStatus === 'pending').length,
        confirmed: onlineOrders.filter((o) => o.orderStatus === 'confirmed').length,
        packing: onlineOrders.filter((o) => o.orderStatus === 'packing').length,
        shipped: onlineOrders.filter((o) => o.orderStatus === 'shipped').length,
        delivered: onlineOrders.filter((o) => o.orderStatus === 'delivered').length,
        cancelled: onlineOrders.filter((o) => o.orderStatus === 'cancelled').length
      };
    } catch (error) {
      console.error('Error fetching order operations:', error);
      return {
        pending: 0,
        confirmed: 0,
        packing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };
    }
  },

  // ============================================
  // SECTION 3: DAILY INSIGHTS
  // ============================================
  
  async getDailyInsights(startDate?: string, endDate?: string) {
    try {
      // Get active categories
      const categoriesResponse = await axiosInstance.get('/api/inventory/categories', {
        params: { isActive: 'true' }
      });
      const categories: Category[] = categoriesResponse.data.data || [];
      
      // Get top items from inventory reports with date range
      const today = new Date().toISOString().split('T')[0];
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const topItemsResponse = await axiosInstance.get('/api/inventory/reports/top-selling', {
        params: {
          startDate: startDate || sevenDaysAgo,
          endDate: endDate || today,
          limit: 5
        }
      });
      
      const topItemsData = topItemsResponse.data.data || {};
      const topItems: TopSellingItem[] = topItemsData.topProducts || [];

      return {
        topCategories: categories.slice(0, 5).map((cat) => ({
          name: cat.name,
          sales: 0, // Would need aggregated sales data
          revenue: 0 // Would need aggregated revenue data
        })),
        topItems: topItems.map((item) => ({
          name: item.itemName,
          quantity: item.totalQuantitySold || 0,
          revenue: 0 // Revenue not available in current API
        })),
        peakHours: [] // Would need time-series data
      };
    } catch (error) {
      console.error('Error fetching daily insights:', error);
      return {
        topCategories: [],
        topItems: [],
        peakHours: []
      };
    }
  },

  // ============================================
  // SECTION 4: DELIVERY PERFORMANCE
  // ============================================
  
  async getDeliveryPerformance() {
    try {
      // This would come from delivery service
      return {
        avgDeliveryTime: 28, // minutes
        activeRiders: 73,
        totalDeliveries: 156,
        failedAttempts: 3.8
      };
    } catch (error) {
      console.error('Error fetching delivery performance:', error);
      return {
        avgDeliveryTime: 0,
        activeRiders: 0,
        totalDeliveries: 0,
        failedAttempts: 0
      };
    }
  },

  // ============================================
  // SECTION 5: PAYMENT & FINANCE
  // ============================================
  
  async getPaymentFinance(startDate?: string, endDate?: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // If no dates provided, use today
      const start = startDate || today;
      const end = endDate || today;
      
      // Fetch sales summary from finance service (includes payment breakdown and monthly trends)
      const summaryResponse = await axiosInstance.get('/api/finance/sales/summary', {
        params: { 
          startDate: start,
          endDate: end
        }
      }).catch((err) => {
        console.warn('Sales summary API error:', err.message);
        return { data: { success: false, data: null } };
      });
      
      interface MonthlyDataItem {
        period: string;
        month: string;
        year: number;
        revenue: number;
        expenses: number;
        orders: number;
        tax: number;
        discount: number;
      }

      interface PaymentMethodItem {
        method: string;
        totalAmount: number;
        totalOrders: number;
        paid: number;
        pending: number;
        failed: number;
      }
      
      const summary = summaryResponse.data.data;
      
      if (!summary) {
        console.warn('No sales summary data available');
        return {
          paymentSplit: { cod: 0, prepaid: 0 },
          pendingCOD: 0,
          failedPayments: 0,
          refundsPending: 0,
          monthlyData: []
        };
      }

      // Transform monthly trends into MonthlyDataItem format
      const monthlyDataMap = new Map<string, MonthlyDataItem>();
      
      // Combine POS and Online monthly trends
      if (summary.monthlyTrends?.pos) {
        summary.monthlyTrends.pos.forEach((item: any) => {
          const [year, month] = item.accountingPeriod.split('-');
          monthlyDataMap.set(item.accountingPeriod, {
            period: item.accountingPeriod,
            month: month || '',
            year: parseInt(year) || 0,
            revenue: item._sum.totalAmount || 0,
            expenses: 0,
            orders: item._count.id || 0,
            tax: 0,
            discount: 0,
          });
        });
      }

      if (summary.monthlyTrends?.online) {
        summary.monthlyTrends.online.forEach((item: any) => {
          const [year, month] = item.accountingPeriod.split('-');
          const existing = monthlyDataMap.get(item.accountingPeriod);
          if (existing) {
            existing.revenue += item._sum.totalAmount || 0;
            existing.orders += item._count.id || 0;
          } else {
            monthlyDataMap.set(item.accountingPeriod, {
              period: item.accountingPeriod,
              month: month || '',
              year: parseInt(year) || 0,
              revenue: item._sum.totalAmount || 0,
              expenses: 0,
              orders: item._count.id || 0,
              tax: 0,
              discount: 0,
            });
          }
        });
      }

      const monthlyData = Array.from(monthlyDataMap.values()).sort((a, b) => 
        a.period.localeCompare(b.period)
      );

      // Transform payment breakdown into PaymentMethodItem format
      const paymentMethods: PaymentMethodItem[] = [];
      
      if (summary.paymentBreakdown?.pos) {
        summary.paymentBreakdown.pos.forEach((item: any) => {
          const existing = paymentMethods.find(p => p.method === item.paymentStatus);
          if (existing) {
            existing.totalAmount += item._sum.totalAmount || 0;
            existing.totalOrders += item._count.id || 0;
          } else {
            paymentMethods.push({
              method: item.paymentStatus,
              totalAmount: item._sum.totalAmount || 0,
              totalOrders: item._count.id || 0,
              paid: item.paymentStatus === 'paid' ? item._count.id : 0,
              pending: item.paymentStatus === 'pending' ? item._count.id : 0,
              failed: item.paymentStatus === 'failed' ? item._count.id : 0,
            });
          }
        });
      }

      if (summary.paymentBreakdown?.online) {
        summary.paymentBreakdown.online.forEach((item: any) => {
          const existing = paymentMethods.find(p => p.method === item.paymentStatus);
          if (existing) {
            existing.totalAmount += item._sum.totalAmount || 0;
            existing.totalOrders += item._count.id || 0;
            if (item.paymentStatus === 'paid') existing.paid += item._count.id;
            if (item.paymentStatus === 'pending') existing.pending += item._count.id;
            if (item.paymentStatus === 'failed') existing.failed += item._count.id;
          } else {
            paymentMethods.push({
              method: item.paymentStatus,
              totalAmount: item._sum.totalAmount || 0,
              totalOrders: item._count.id || 0,
              paid: item.paymentStatus === 'paid' ? item._count.id : 0,
              pending: item.paymentStatus === 'pending' ? item._count.id : 0,
              failed: item.paymentStatus === 'failed' ? item._count.id : 0,
            });
          }
        });
      }
      
      // Calculate payment split
      const codMethods = paymentMethods.filter((p) => 
        p.method === 'cash' || p.method === 'cod'
      );
      const prepaidMethods = paymentMethods.filter((p) => 
        p.method !== 'cash' && p.method !== 'cod'
      );
      
      const totalOrders = paymentMethods.reduce((sum, p) => sum + p.totalOrders, 0);
      const codOrders = codMethods.reduce((sum, p) => sum + p.totalOrders, 0);
      const prepaidOrders = prepaidMethods.reduce((sum, p) => sum + p.totalOrders, 0);
      
      // Calculate pending COD (orders with COD payment method and pending status)
      const pendingCOD = codMethods.reduce((sum, p) => {
        const pendingAmount = (p.totalAmount / p.totalOrders) * p.pending;
        return sum + (isNaN(pendingAmount) ? 0 : pendingAmount);
      }, 0);
      
      // Calculate failed payments
      const failedPayments = paymentMethods.reduce((sum, p) => sum + (p.failed || 0), 0);
      
      console.log('Payment Finance Data:', {
        monthlyDataCount: monthlyData.length,
        paymentMethodsCount: paymentMethods.length,
        pendingCOD,
        failedPayments
      });
      
      return {
        paymentSplit: {
          cod: totalOrders > 0 ? (codOrders / totalOrders) * 100 : 0,
          prepaid: totalOrders > 0 ? (prepaidOrders / totalOrders) * 100 : 0
        },
        pendingCOD: pendingCOD,
        failedPayments: failedPayments,
        refundsPending: 0, // TODO: Add refund tracking
        monthlyData: monthlyData
      };
    } catch (error) {
      console.error('Error fetching payment finance:', error);
      return {
        paymentSplit: { cod: 0, prepaid: 0 },
        pendingCOD: 0,
        failedPayments: 0,
        refundsPending: 0,
        monthlyData: []
      };
    }
  },

  // ============================================
  // SECTION 6: WAREHOUSE & STOCK ALERTS
  // ============================================
  
  async getWarehouseAlerts(startDate?: string, endDate?: string) {
    try {
      // Get stock availability data (no date filter needed - current stock status)
      const stockResponse = await axiosInstance.get('/api/inventory/reports/stock-availability');
      const stockResponseData = stockResponse.data.data || {};
      
      // Get expiry & wastage data (next 30 days)
      const expiryResponse = await axiosInstance.get('/api/inventory/reports/expiry-wastage', {
        params: { 
          daysAhead: 30
        }
      });
      const expiryData = expiryResponse.data.data || {};
      
      return {
        outOfStock: stockResponseData.summary?.outOfStock || 0,
        lowStockAlerts: stockResponseData.summary?.lowStock || 0,
        expiringItems: expiryData.summary?.expiringItems || 0,
        inventoryMismatch: 0 // Would need audit data
      };
    } catch (error) {
      console.error('Error fetching warehouse alerts:', error);
      return {
        outOfStock: 0,
        lowStockAlerts: 0,
        expiringItems: 0,
        inventoryMismatch: 0
      };
    }
  },

  // ============================================
  // SECTION 7: EOD CLOSING
  // ============================================
  
  async getEODClosing(startDate?: string, endDate?: string) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const eodResponse = await axiosInstance.get('/api/inventory/reports/eod-closing-stock', {
        params: { 
          date: endDate || today
        }
      });
      const eodData: EODData = eodResponse.data.data || {};
      const summary = eodData.summary || {};
      
      return {
        dailyThroughput: summary.totalUnits || 0,
        totalCash: summary.totalValue || 0,
        readyToClose: !eodData.noDataForDate && !eodData.isFutureDate
      };
    } catch (error) {
      console.error('Error fetching EOD closing:', error);
      return {
        dailyThroughput: 0,
        totalCash: 0,
        readyToClose: false
      };
    }
  },

  // ============================================
  // COMBINED DASHBOARD DATA
  // ============================================
  
  async getDashboardData(startDate?: string, endDate?: string): Promise<DashboardData> {
    try {
      const [
        todaysOrders,
        todaysRevenue,
        avgOrderValue,
        onTimeDelivery,
        cancelledOrders,
        warehouseStatus,
        orderOperations,
        dailyInsights,
        deliveryPerformance,
        paymentFinance,
        warehouseAlerts,
        eodClosing
      ] = await Promise.all([
        this.getTodaysOrders(startDate, endDate),
        this.getTodaysRevenue(startDate, endDate),
        this.getAverageOrderValue(startDate, endDate),
        this.getOnTimeDelivery(),
        this.getCancelledOrders(startDate, endDate),
        this.getWarehouseStatus(),
        this.getOrderOperations(startDate, endDate),
        this.getDailyInsights(startDate, endDate),
        this.getDeliveryPerformance(),
        this.getPaymentFinance(startDate, endDate),
        this.getWarehouseAlerts(startDate, endDate),
        this.getEODClosing(startDate, endDate)
      ]);

      return {
        kpiCards: {
          todaysOrders,
          todaysRevenue,
          avgOrderValue,
          onTimeDelivery,
          cancelledOrders,
          warehouseStatus
        },
        orderOperations,
        dailyInsights,
        deliveryPerformance,
        paymentFinance,
        warehouseAlerts,
        eodClosing
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};
