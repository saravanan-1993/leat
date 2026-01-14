"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Activity, Package, DollarSign } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { format } from "date-fns";

interface EODClosingProps {
  data: {
    dailyThroughput: number;
    totalCash: number;
    readyToClose: boolean;
  };
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export function EODClosing({ data, dateRange }: EODClosingProps) {
  const currencySymbol = useCurrency();
  
  // Generate date description
  const getDateDescription = () => {
    if (!dateRange) return "End of day performance snapshot";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fromDate = new Date(dateRange.from);
    fromDate.setHours(0, 0, 0, 0);
    
    const toDate = new Date(dateRange.to);
    toDate.setHours(0, 0, 0, 0);
    
    // Check if selected date is today
    if (fromDate.getTime() === today.getTime() && toDate.getTime() === today.getTime()) {
      return "End of day performance snapshot";
    }
    
    // Check if same day
    if (format(dateRange.from, "yyyy-MM-dd") === format(dateRange.to, "yyyy-MM-dd")) {
      return `Closing summary for ${format(dateRange.from, "MMM dd, yyyy")}`;
    }
    
    return `Closing summary from ${format(dateRange.from, "MMM dd")} to ${format(dateRange.to, "MMM dd, yyyy")}`;
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          EOD Closing Summary
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">{getDateDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <Package className="h-3 w-3" />
                Daily Throughput
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data.dailyThroughput.toLocaleString()}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">units processed</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                Total Cash
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {currencySymbol}{data.totalCash.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">collected today</p>
            </div>
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                data.readyToClose ? 'bg-teal-600 animate-pulse' : 'bg-slate-400 animate-pulse'
              }`} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {data.readyToClose ? 'All systems reconciled' : 'Reconciliation in progress'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

