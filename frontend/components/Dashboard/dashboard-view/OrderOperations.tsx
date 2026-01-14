"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, Truck, CheckCircle, AlertCircle, Box, XCircle } from "lucide-react";
import { format } from "date-fns";

interface OrderOperationsProps {
  data: {
    pending: number;
    confirmed: number;
    packing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function OrderOperations({ data, dateRange }: OrderOperationsProps) {
  const operations = [
    { label: "Pending", value: data.pending, icon: AlertCircle, color: "bg-yellow-600 dark:bg-yellow-500" },
    { label: "Confirmed", value: data.confirmed, icon: CheckCircle, color: "bg-blue-600 dark:bg-blue-500" },
    { label: "Packing", value: data.packing, icon: Package, color: "bg-purple-600 dark:bg-purple-500" },
    { label: "Shipped", value: data.shipped, icon: Truck, color: "bg-indigo-600 dark:bg-indigo-500" },
    { label: "Delivered", value: data.delivered, icon: Box, color: "bg-green-600 dark:bg-green-500" },
    { label: "Cancelled", value: data.cancelled, icon: XCircle, color: "bg-red-600 dark:bg-red-500" },
  ];

  const total = operations.reduce((sum, op) => sum + op.value, 0);
  
  // Generate date description
  const getDateDescription = () => {
    if (!dateRange) return "Current order status breakdown";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);
    
    const toDate = new Date(dateRange.to);
    toDate.setHours(0, 0, 0, 0);
    
    // Check if selected date is today
    if (fromDate.getTime() === today.getTime() && toDate.getTime() === today.getTime()) {
      return "Current order status breakdown";
    }
    
    // Check if same day
    if (format(dateRange.from, "yyyy-MM-dd") === format(dateRange.to, "yyyy-MM-dd")) {
      return `Orders on ${format(dateRange.from, "MMM dd, yyyy")}`;
    }
    
    return `Orders from ${format(dateRange.from, "MMM dd")} to ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Order Operations
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">{getDateDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {operations.map((op, index) => {
          const Icon = op.icon;
          const percentage = total > 0 ? (op.value / total) * 100 : 0;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{op.label}</span>
                </div>
                <span className="text-slate-600 dark:text-slate-400">{op.value} orders</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${op.color} rounded-full transition-all`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
