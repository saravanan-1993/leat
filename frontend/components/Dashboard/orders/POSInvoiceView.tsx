"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Printer, Download, Eye } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { posOrderService, POSOrder } from "@/services/posOrderService";
import { toast } from "sonner";

interface POSOrderItem {
  productId: string;
  productName: string;
  productSku?: string;
  unitPrice: number;
  quantity: number;
  discount?: number;
  subtotal: number;
  total: number;
  gstPercentage?: number;
  gstAmount?: number;
  priceBeforeGst?: number;
}

interface POSInvoiceViewProps {
  order: POSOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function POSInvoiceView({ order, isOpen, onClose }: POSInvoiceViewProps) {
  const currencySymbol = useCurrency();
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  if (!order) return null;

  const formatCurrency = (amount: number | undefined) => {
    const value = amount ?? 0;
    return `${currencySymbol}${value.toFixed(2)}`;
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = order.items.map((item: POSOrderItem) => `
      <div style="margin: 5px 0;">
        <div style="display: grid; grid-template-columns: 2fr 0.5fr 1fr 1.2fr 1fr; gap: 4px; font-size: 11px;">
          <span style="font-weight: bold;">${item.productName}</span>
          <span style="text-align: center;">${item.quantity}</span>
          <span style="text-align: right;">${formatCurrency(item.unitPrice)}</span>
          <span style="text-align: right;">${item.gstPercentage ? `${formatCurrency(item.gstAmount || 0)}(${item.gstPercentage}%)` : '-'}</span>
          <span style="text-align: right; font-weight: bold;">${formatCurrency(item.total)}</span>
        </div>
        ${item.productSku ? `
          <div style="font-size: 10px; color: #333; margin-left: 4px;">
            SKU: ${item.productSku}
          </div>
        ` : ''}
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>POS Invoice ${order.orderNumber}</title>
          <style>
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              background: #fff;
              width: 80mm;
              margin: 0 auto;
              padding: 10px;
            }
            .invoice-header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .invoice-header h1 {
              font-size: 18px;
              font-weight: bold;
              margin: 0 0 5px 0;
            }
            .invoice-header p {
              margin: 2px 0;
              font-size: 11px;
            }
            .invoice-info {
              margin-bottom: 10px;
              font-size: 11px;
            }
            .invoice-info div {
              display: flex;
              justify-content: space-between;
              margin: 2px 0;
            }
            .items-table {
              width: 100%;
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 5px 0;
              margin: 10px 0;
            }
            .items-header {
              display: grid;
              grid-template-columns: 2fr 0.5fr 1fr 1.2fr 1fr;
              gap: 4px;
              font-size: 11px;
              font-weight: bold;
              border-bottom: 1px dashed #000;
              padding-bottom: 3px;
              margin-bottom: 5px;
            }
            .totals {
              margin-top: 10px;
              border-top: 1px dashed #000;
              padding-top: 5px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
              font-size: 11px;
            }
            .total-row.grand-total {
              font-size: 14px;
              font-weight: bold;
              border-top: 2px solid #000;
              padding-top: 5px;
              margin-top: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 2px dashed #000;
              font-size: 10px;
            }
            .footer p {
              margin: 3px 0;
            }
          </style>
        </head>
        <body>
          <!-- Invoice Header -->
          <div class="invoice-header">
            <h1>STORE NAME</h1>
            <p>Store Address Line 1</p>
            <p>City, State - PIN Code</p>
            <p>Phone: +91 1234567890</p>
          </div>

          <!-- Invoice Info -->
          <div class="invoice-info">
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span>Invoice No:</span>
              <span style="font-weight: bold;">${order.orderNumber}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span>Date:</span>
              <span>${formatDate(order.createdAt)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span>Time:</span>
              <span>${new Date(order.createdAt).toLocaleTimeString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span>Customer:</span>
              <span>${order.customerName || 'Walk-in Customer'}</span>
            </div>
            ${order.customerPhone ? `
              <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                <span>Phone:</span>
                <span>${order.customerPhone}</span>
              </div>
            ` : ''}
            ${order.createdBy ? `
              <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                <span>Cashier:</span>
                <span>${order.createdBy}</span>
              </div>
            ` : ''}
          </div>

          <!-- Items Table -->
          <div class="items-table">
            <div class="items-header">
              <span>Item</span>
              <span style="text-align: center;">Qty</span>
              <span style="text-align: right;">Price</span>
              <span style="text-align: right;">GST</span>
              <span style="text-align: right;">Total</span>
            </div>
            ${itemsHtml}
          </div>

          <!-- Totals -->
          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(order.subtotal)}</span>
            </div>
            ${(order.discount ?? 0) > 0 ? `
              <div class="total-row" style="color: #16a34a;">
                <span>Discount:</span>
                <span>-${formatCurrency(order.discount)}</span>
              </div>
            ` : ''}
            <div class="total-row">
              <span>Tax (GST):</span>
              <span>${formatCurrency(order.tax)}</span>
            </div>
            ${(order.roundingOff ?? 0) !== 0 ? `
              <div class="total-row">
                <span>Rounding Off:</span>
                <span>${formatCurrency(order.roundingOff)}</span>
              </div>
            ` : ''}
            <div class="total-row grand-total">
              <span>FINAL TOTAL:</span>
              <span>${formatCurrency(order.total)}</span>
            </div>
            ${order.amountReceived ? `
              <div class="total-row">
                <span>Amount Received:</span>
                <span>${formatCurrency(order.amountReceived)}</span>
              </div>
            ` : ''}
            ${(order.changeGiven ?? 0) > 0 ? `
              <div class="total-row">
                <span>Change Given:</span>
                <span>${formatCurrency(order.changeGiven)}</span>
              </div>
            ` : ''}
          </div>

          <!-- Payment Method -->
          <div style="margin-top: 10px; font-size: 11px;">
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span>Payment:</span>
              <span style="font-weight: bold; text-transform: uppercase;">${order.paymentMethod}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 2px 0;">
              <span>Status:</span>
              <span style="font-weight: bold; text-transform: uppercase; color: ${
                order.paymentStatus === 'completed' ? '#16a34a' : 
                order.paymentStatus === 'pending' ? '#ca8a04' : '#dc2626'
              };">${order.paymentStatus}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p style="font-weight: bold; margin: 3px 0;">Thank you for your purchase!</p>
            <p style="margin: 3px 0;">STORE NAME</p>
            <p style="margin: 3px 0;">Powered by POS System</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = async () => {
    if (!order) return;

    setIsDownloading(true);
    try {
      await posOrderService.downloadInvoicePDF(order.orderNumber);
      toast.success('PDF downloaded successfully');
    } catch (error: any) {
      console.error('Error downloading PDF:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to download PDF: ${errorMessage}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = async () => {
    if (!order) return;

    setIsPreviewing(true);
    try {
      await posOrderService.previewInvoicePDF(order.orderNumber);
    } catch (error: any) {
      console.error('Error previewing PDF:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to preview PDF: ${errorMessage}`);
    } finally {
      setIsPreviewing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            POS Invoice View
          </DialogTitle>
        </DialogHeader>

        {/* Thermal Print Preview */}
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b">
            <p className="text-xs text-gray-600 text-center">Thermal Print Preview (80mm)</p>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto" style={{ fontFamily: "'Courier New', monospace", fontSize: "12px", lineHeight: "1.4" }}>
            <div ref={printRef}>
              {/* Invoice Header */}
              <div className="text-center border-b-2 border-dashed border-gray-800 pb-3 mb-3">
                <h1 className="text-lg font-bold mb-1">STORE NAME</h1>
                <p className="text-xs leading-tight">Store Address Line 1</p>
                <p className="text-xs leading-tight">City, State - PIN Code</p>
                <p className="text-xs leading-tight">Phone: +91 1234567890</p>
              </div>

              {/* Invoice Info */}
              <div className="mb-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Invoice No:</span>
                  <span className="font-semibold">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span>{order.customerName || 'Walk-in Customer'}</span>
                </div>
                {order.customerPhone && (
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <span>{order.customerPhone}</span>
                  </div>
                )}
                {order.createdBy && (
                  <div className="flex justify-between">
                    <span>Cashier:</span>
                    <span>{order.createdBy}</span>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div className="border-t border-b border-dashed border-gray-800 py-2 my-3">
                <div className="grid grid-cols-[2fr_0.5fr_1fr_1.2fr_1fr] gap-1 text-xs font-bold border-b border-gray-800 pb-1 mb-2">
                  <span className="text-left">Item</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Price</span>
                  <span className="text-right">GST</span>
                  <span className="text-right">Total</span>
                </div>
                {order.items.map((item: POSOrderItem, index) => {
                  return (
                    <div key={index} className="mb-2">
                      <div className="grid grid-cols-[2fr_0.5fr_1fr_1.2fr_1fr] gap-1 text-xs">
                        <span className="font-semibold text-left">{item.productName}</span>
                        <span className="text-center">{item.quantity}</span>
                        <span className="text-right">{formatCurrency(item.unitPrice)}</span>
                        <span className="text-right">{item.gstPercentage ? `${formatCurrency(item.gstAmount || 0)}(${item.gstPercentage}%)` : '-'}</span>
                        <span className="text-right font-semibold">{formatCurrency(item.total)}</span>
                      </div>
                      {item.productSku && (
                        <div className="text-xs text-gray-600 ml-1">
                          SKU: {item.productSku}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {(order.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-xs text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span>Tax (GST):</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {(order.roundingOff ?? 0) !== 0 && (
                  <div className="flex justify-between text-xs">
                    <span>Rounding Off:</span>
                    <span>{formatCurrency(order.roundingOff)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold border-t-2 border-gray-800 pt-2 mt-2">
                  <span>FINAL TOTAL:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
                {order.amountReceived && (
                  <div className="flex justify-between text-xs">
                    <span>Amount Received:</span>
                    <span>{formatCurrency(order.amountReceived)}</span>
                  </div>
                )}
                {(order.changeGiven ?? 0) > 0 && (
                  <div className="flex justify-between text-xs">
                    <span>Change Given:</span>
                    <span>{formatCurrency(order.changeGiven)}</span>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="mt-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="font-bold uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-bold uppercase ${
                    order.paymentStatus === 'completed' ? 'text-green-600' : 
                    order.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4 pt-3 border-t-2 border-dashed border-gray-800">
                <p className="text-xs font-bold mb-1">Thank you for your purchase!</p>
                <p className="text-xs">STORE NAME</p>
                <p className="text-xs mt-2">Powered by POS System</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            onClick={handlePrint}
            className="flex-1"
            variant="default"
            size="sm"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button
            onClick={handlePreview}
            className="flex-1"
            variant="outline"
            size="sm"
            disabled={isPreviewing}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewing ? 'Loading...' : 'Preview'}
          </Button>
          <Button
            onClick={handleDownload}
            className="flex-1"
            variant="outline"
            size="sm"
            disabled={isDownloading}
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download'}
          </Button>
        </div>

        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full mt-2"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}