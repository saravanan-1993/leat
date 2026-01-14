"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";
import { format } from "date-fns";

interface DailyInsightsProps {
  data: {
    topCategories: Array<{ name: string; sales: number; revenue: number }>;
    topItems: Array<{ name: string; quantity: number; revenue: number }>;
    peakHours: Array<{ hour: string; orders: number }>;
  };
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function DailyInsights({ data, dateRange }: DailyInsightsProps) {
  // Use top items for the chart instead of categories
  const chartData = data.topItems.length > 0 
    ? data.topItems.slice(0, 5).map((item) => ({
        name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
        value: item.quantity,
      }))
    : [];
    
  // Generate date description
  const getDateDescription = () => {
    if (!dateRange) return "Top performing items";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);
    
    const toDate = new Date(dateRange.to);
    toDate.setHours(0, 0, 0, 0);
    
    // Check if selected date is today
    if (fromDate.getTime() === today.getTime() && toDate.getTime() === today.getTime()) {
      return "Top performing items";
    }
    
    // Check if same day
    if (format(dateRange.from, "yyyy-MM-dd") === format(dateRange.to, "yyyy-MM-dd")) {
      return `Top items on ${format(dateRange.from, "MMM dd, yyyy")}`;
    }
    
    return `Top items from ${format(dateRange.from, "MMM dd")} to ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Daily Insights
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">{getDateDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Top Selling Items Bar Chart */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Top Selling Items</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "0.5rem",
                  }}
                  cursor={{ fill: "#f1f5f9" }}
                  formatter={(value) => [`${value} sold`, 'Quantity']}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-8">
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                No item data available
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
