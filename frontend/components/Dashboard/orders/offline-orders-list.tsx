"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Search, Download, FileText } from "lucide-react";
import { posOrderService, POSOrder } from "@/services/posOrderService";
import { toast } from "sonner";
import { useCurrency } from "@/hooks/useCurrency";
import { POSInvoiceView } from "./POSInvoiceView";

export function OfflineOrdersList() {
  const [orders, setOrders] = useState<POSOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    limit: 20,
  });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<POSOrder | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  

  const currencySymbol = useCurrency();

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, paymentMethodFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        page,
        limit: 20,
      };

      if (statusFilter !== "all") params.orderStatus = statusFilter;
      if (paymentMethodFilter !== "all") params.paymentMethod = paymentMethodFilter;
     

      const response = await posOrderService.getOrders(params);
      
      // Filter by search on client side (order number or customer name)
      let filteredOrders = response.data;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredOrders = response.data.filter(
          (order) =>
            order.orderNumber.toLowerCase().includes(searchLower) ||
            (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
            (order.customerPhone && order.customerPhone.includes(search))
        );
      }

      setOrders(filteredOrders);
      setPagination(response.pagination);
    } catch (error: unknown) {
      console.error("Error fetching orders:", error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : "Failed to fetch orders";
      toast.error(errorMessage || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const handleDownloadPDF = async (orderNumber: string) => {
    setDownloadingPDF(orderNumber);
    try {
      await posOrderService.downloadInvoicePDF(orderNumber);
      toast.success('PDF downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to download PDF: ${errorMessage}`);
    } finally {
      setDownloadingPDF(null);
    }
  };

  const handlePreviewPDF = async (orderNumber: string) => {
    try {
      await posOrderService.previewInvoicePDF(orderNumber);
    } catch (error: any) {
      console.error('Error previewing PDF:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to preview PDF: ${errorMessage}`);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPaymentMethodFilter("all");
   
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-500 text-white",
      pending: "bg-yellow-500 text-white",
      cancelled: "bg-red-500 text-white",
      refunded: "bg-gray-500 text-white",
    };
    return colors[status] || "bg-gray-500 text-white";
  };

  const getPaymentMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      cash: "bg-blue-500 text-white",
      card: "bg-purple-500 text-white",
      upi: "bg-green-500 text-white",
    };
    return colors[method] || "bg-gray-500 text-white";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (pagination.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis-start");
      const start = Math.max(2, page - 1);
      const end = Math.min(pagination.totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (page < pagination.totalPages - 2) pages.push("ellipsis-end");
      pages.push(pagination.totalPages);
    }
    return pages;
  };

  if (loading && orders.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="flex gap-2">
              <Input
                placeholder="Search by order number, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} size="sm">
                <Search size={16} />
              </Button>
            </div>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Method Filter */}
          <Select
            value={paymentMethodFilter}
            onValueChange={setPaymentMethodFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
            </SelectContent>
          </Select>

        </div>

        {/* Clear Filters Button */}
        {(search || statusFilter !== "all" || paymentMethodFilter !== "all") && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No POS orders found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      {order.customerName || "Walk-in Customer"}
                    </TableCell>
                    <TableCell>{order.customerPhone || "-"}</TableCell>
                    <TableCell>{order.items?.length || 0} items</TableCell>
                    <TableCell className="font-semibold">
                      {currencySymbol}
                      {(order.total || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.orderStatus)}>
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getPaymentMethodColor(order.paymentMethod)}
                      >
                        {order.paymentMethod.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowInvoiceModal(true);
                          }}
                          title="View invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewPDF(order.orderNumber)}
                          title="Preview PDF"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(order.orderNumber)}
                          disabled={downloadingPDF === order.orderNumber}
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-gray-600">
                  Showing {(page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} orders
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum, index) => (
                      <PaginationItem key={index}>
                        {pageNum === "ellipsis-start" ||
                        pageNum === "ellipsis-end" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            onClick={() => setPage(pageNum as number)}
                            isActive={page === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((p) => Math.min(pagination.totalPages, p + 1))
                        }
                        className={
                          page === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      {/* Invoice Modal */}
      <POSInvoiceView
        order={selectedOrder}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
}
