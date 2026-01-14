"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck, Clock, Users, Package } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";

interface DeliveryPerformanceProps {
  data: {
    avgDeliveryTime: number;
    activeRiders: number;
    totalDeliveries: number;
    failedAttempts: number;
  };
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function DeliveryPerformance({ data, dateRange }: DeliveryPerformanceProps) {
  const deliveryData = [
    { name: "On Time", value: data.totalDeliveries - data.failedAttempts },
    { name: "Failed", value: data.failedAttempts },
  ];

  const COLORS = ["#10b981", "#ef4444"]; // Green for on-time, Red for failed
  
  // Generate date description
  const getDateDescription = () => {
    if (!dateRange) return "Real-time delivery metrics";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);
    
    const toDate = new Date(dateRange.to);
    toDate.setHours(0, 0, 0, 0);
    
    // Check if selected date is today
    if (fromDate.getTime() === today.getTime() && toDate.getTime() === today.getTime()) {
      return "Real-time delivery metrics";
    }
    
    // Check if same day
    if (format(dateRange.from, "yyyy-MM-dd") === format(dateRange.to, "yyyy-MM-dd")) {
      return `Delivery metrics for ${format(dateRange.from, "MMM dd, yyyy")}`;
    }
    
    return `Delivery metrics from ${format(dateRange.from, "MMM dd")} to ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Delivery Performance
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">{getDateDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Pie Chart */}
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={deliveryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {deliveryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Avg Time</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{data.avgDeliveryTime} min</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Active Riders</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{data.activeRiders}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Package className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{data.totalDeliveries}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Failed</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{data.failedAttempts}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

