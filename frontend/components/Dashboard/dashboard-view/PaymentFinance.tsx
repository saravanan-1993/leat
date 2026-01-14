"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, AlertCircle, RefreshCw, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from "recharts";
import { useCurrency } from "@/hooks/useCurrency";
import { format } from "date-fns";

interface PaymentFinanceProps {
  data: {
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
  };
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function PaymentFinance({ data, dateRange }: PaymentFinanceProps) {
  const currencySymbol = useCurrency();
  
  // Use real data from finance service or fallback to empty array
  const monthlyData = data.monthlyData && data.monthlyData.length > 0 
    ? data.monthlyData.map(item => ({
        month: item.month,
        revenue: Math.round(item.revenue)
      }))
    : [];

  // Format currency using the dynamic currency symbol
  const formatCurrency = (value: number) => {
    return `${currencySymbol}${value.toLocaleString(undefined, { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0 
    })}`;
  };
  
  // Generate date description
  const getDateDescription = () => {
    if (!dateRange) return "Monthly revenue overview";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);
    
    const toDate = new Date(dateRange.to);
    toDate.setHours(0, 0, 0, 0);
    
    // Check if selected date is today
    if (fromDate.getTime() === today.getTime() && toDate.getTime() === today.getTime()) {
      return "Monthly revenue overview";
    }
    
    // Check if same day
    if (format(dateRange.from, "yyyy-MM-dd") === format(dateRange.to, "yyyy-MM-dd")) {
      return `Payment data for ${format(dateRange.from, "MMM dd, yyyy")}`;
    }
    
    return `Payment data from ${format(dateRange.from, "MMM dd")} to ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  return (
    <Card className="lg:col-span-3 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Payment & Finance Overview
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">{getDateDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bar Chart */}
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number | undefined) => value ? formatCurrency(value) : ""}
                cursor={{ fill: "#f1f5f9" }}
                labelStyle={{ color: "#1e293b" }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No revenue data available</p>
              <p className="text-xs mt-1">Data will appear once orders are processed</p>
            </div>
          </div>
        )}

        {/* Financial Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Pending COD</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {currencySymbol}{data.pendingCOD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Failed</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{data.failedPayments}</div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <RefreshCw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Refunds</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{data.refundsPending}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
