"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Search, Loader2, FileText, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useCurrency } from "@/hooks/useCurrency";
import { financeService, type SalesOrder, type SalesFilters } from "@/services/financeService";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceView } from "../../../orders/InvoiceView";

const orderStatusColors: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  cancelled: "destructive",
  refunded: "secondary",
};

export default function PosSalesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sales, setSales] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SalesOrder | null>(null);
  const currencySymbol = useCurrency();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalAmount: 0,
  });
  const itemsPerPage = 10;

  // Fetch sales data
  const fetchSales = async () => {
    try {
      setLoading(true);
      
      const filters: SalesFilters = {
        orderType: 'pos',
        page: currentPage,
        limit: itemsPerPage,
        sortBy: 'saleDate',
        sortOrder: 'desc',
      };

      // Add search filter
      if (searchQuery.trim()) {
        // Note: Backend should support search by order number, customer name, etc.
        // For now, we'll filter on frontend after getting results
      }

      // Add payment method filter
      if (paymentMethodFilter !== 'all') {
        // Map frontend filter to backend payment method
        const paymentMethodMap: Record<string, string> = {
          'cash': 'cash',
          'card': 'card',
          'upi': 'upi',
        };
        filters.paymentMethod = paymentMethodMap[paymentMethodFilter];
      }

      // Add date range filter
      if (dateRange !== 'all') {
        const today = new Date();
        let startDate: Date;
        
        switch (dateRange) {
          case 'today':
            startDate = new Date(today.setHours(0, 0, 0, 0));
            filters.startDate = startDate.toISOString();
            filters.endDate = new Date().toISOString();
            break;
          case 'week':
            startDate = new Date(today.setDate(today.getDate() - 7));
            filters.startDate = startDate.toISOString();
            break;
          case 'month':
            startDate = new Date(today.setMonth(today.getMonth() - 1));
            filters.startDate = startDate.toISOString();
            break;
          case 'quarter':
            startDate = new Date(today.setMonth(today.getMonth() - 3));
            filters.startDate = startDate.toISOString();
            break;
        }
      }

      const response = await financeService.getAllSales(filters);
      
      if (response.success) {
        // Apply frontend search filter if needed
        let filteredSales = response.data;
        if (searchQuery.trim()) {
          filteredSales = response.data.filter((sale) =>
            sale.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sale.customerPhone?.includes(searchQuery)
          );
        }

        // Apply order status filter
        if (orderStatusFilter !== 'all') {
          filteredSales = filteredSales.filter(sale => sale.orderStatus === orderStatusFilter);
        }

        setSales(filteredSales);
        setTotalPages(response.pagination.pages);
        setTotalSales(response.pagination.total);
        setSummary({
          totalOrders: response.summary.posOrders,
          totalAmount: response.summary.totalAmount,
        });
      }
    } catch (error) {
      console.error('Error fetching POS sales:', error);
      toast.error('Failed to fetch POS sales data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [currentPage, paymentMethodFilter, dateRange]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchSales();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, orderStatusFilter]);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis-start");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis-end");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleViewDetails = async (sale: SalesOrder) => {
    try {
      const response = await financeService.getOrderDetails('pos', sale.id);
      if (response.success) {
        // You can implement a modal or navigate to details page
        console.log('Order details:', response.data);
        toast.success('Order details loaded');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
    }
  };

  const handleViewInvoice = (sale: SalesOrder) => {
    // Convert SalesOrder to OnlineOrder format for InvoiceView
    const orderForInvoice = {
      id: sale.id,
      orderNumber: sale.orderNumber,
      invoiceNumber: sale.invoiceNumber,
      customerName: sale.customerName || 'Walk-in Customer',
      customerEmail: sale.customerEmail || '',
      customerPhone: sale.customerPhone || '',
      deliveryAddress: sale.deliveryAddress,
      items: [], // Items will be loaded from the order details if needed
      subtotal: sale.subtotal,
      tax: sale.tax,
      discount: sale.discount,
      couponDiscount: 0, // POS orders typically don't have coupon discounts
      shippingCharge: 0, // POS orders don't have shipping charges
      total: sale.total,
      paymentMethod: sale.paymentMethod,
      paymentStatus: sale.paymentStatus === 'paid' ? 'completed' : sale.paymentStatus,
      orderStatus: sale.orderStatus,
      createdAt: sale.saleDate,
      updatedAt: sale.createdAt,
    };
    
    setSelectedSale(orderForInvoice as any);
    setShowInvoiceModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">POS orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currencySymbol}{summary.totalAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">Gross sales amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="size-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={paymentMethodFilter}
            onValueChange={setPaymentMethodFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={orderStatusFilter}
            onValueChange={setOrderStatusFilter}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <p className="text-muted-foreground">Loading POS sales...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
                  <p className="text-muted-foreground">No POS sales found</p>
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{sale.orderNumber}</div>
                      {sale.invoiceNumber && (
                        <div className="text-xs text-muted-foreground">
                          {sale.invoiceNumber}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(sale.saleDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    <div className="text-xs text-muted-foreground">
                      {new Date(sale.saleDate).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{sale.customerName || 'Walk-in Customer'}</div>
                      {sale.customerPhone && (
                        <div className="text-xs text-muted-foreground">
                          {sale.customerPhone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{sale.itemCount} items</TableCell>
                  <TableCell>
                    {currencySymbol}
                    {sale.subtotal.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {currencySymbol}
                    {sale.tax.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {sale.discount > 0
                      ? `${currencySymbol}${sale.discount.toLocaleString("en-IN")}`
                      : "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {currencySymbol}
                    {sale.total.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>{sale.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge variant={orderStatusColors[sale.orderStatus]}>
                      {sale.orderStatus.charAt(0).toUpperCase() +
                        sale.orderStatus.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="View details"
                        onClick={() => handleViewDetails(sale)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Download receipt"
                        onClick={() => handleViewInvoice(sale)}
                      >
                        <FileText className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalSales)} of{" "}
            {totalSales} sales
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis-start" || page === "ellipsis-end" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => setCurrentPage(page as number)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Invoice View Modal */}
      <InvoiceView
        order={selectedSale as any}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
}
