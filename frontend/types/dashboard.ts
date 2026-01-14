// Dashboard Data Types

export interface KPICardsData {
  todaysOrders: number;
  todaysRevenue: number;
  avgOrderValue: number;
  onTimeDelivery: number;
  cancelledOrders: number;
  warehouseStatus: {
    total: number;
    online: number;
    offline: number;
  };
}

export interface OrderOperationsData {
  pending: number;
  confirmed: number;
  packing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface DailyInsightsData {
  topCategories: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  topItems: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  peakHours: Array<{
    hour: string;
    orders: number;
  }>;
}

export interface DeliveryPerformanceData {
  avgDeliveryTime: number;
  activeRiders: number;
  totalDeliveries: number;
  failedAttempts: number;
}

export interface PaymentFinanceData {
  paymentSplit: {
    cod: number;
    prepaid: number;
  };
  pendingCOD: number;
  failedPayments: number;
  refundsPending: number;
  monthlyData?: Array<{
    period: string;
    month: string;
    year: number;
    revenue: number;
    expenses: number;
    orders: number;
    tax: number;
    discount: number;
  }>;
}

export interface WarehouseAlertsData {
  outOfStock: number;
  lowStockAlerts: number;
  expiringItems: number;
  inventoryMismatch: number;
}

export interface EODClosingData {
  dailyThroughput: number;
  totalCash: number;
  readyToClose: boolean;
}

export interface DashboardData {
  kpiCards: KPICardsData;
  orderOperations: OrderOperationsData;
  dailyInsights: DailyInsightsData;
  deliveryPerformance: DeliveryPerformanceData;
  paymentFinance: PaymentFinanceData;
  warehouseAlerts: WarehouseAlertsData;
  eodClosing: EODClosingData;
}
