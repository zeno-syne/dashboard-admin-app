'use client';

import React from 'react';
import { Order, PaymentStatus } from '@/types';
import ShoeImage from '@/components/ShoeImage';
import {
  X,
  Printer,
  Truck,
  CreditCard,
  User,
  MapPin,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: PaymentStatus) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: OrderDetailModalProps) {
  if (!order) return null;

  const getStatusBadge = (status: PaymentStatus | string) => {
    switch (status) {
      case 'Paid':
      case 'Lunas':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'Pending':
      case 'Menunggu':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
        };
      case 'Processing':
      case 'Diproses':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: RefreshCw,
        };
      case 'Cancelled':
      case 'Dibatalkan':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle,
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };
    }
  };

  const currentBadge = getStatusBadge(order.paymentStatus);
  const StatusIcon = currentBadge.icon;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-900 text-base">
              Order Details <span className="text-indigo-600 font-mono">{order.id}</span>
            </h3>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentBadge.bg}`}
            >
              <StatusIcon className="w-3 h-3" />
              <span>{order.paymentStatus}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Section: Customer & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Customer Information</span>
              </div>
              <p className="font-medium text-slate-800">{order.customerName}</p>
              <p className="text-xs text-slate-500">{order.customerEmail}</p>
              <p className="text-xs text-slate-500 mt-1">{order.customerPhone}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{order.customerCity}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Logistics & Fulfillment</span>
              </div>
              <p className="font-medium text-slate-800">{order.shippingCourier}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Tracking No: <span className="font-mono text-slate-700">{order.trackingNumber}</span>
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">Payment:</span>
                <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Section: Items Ordered */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider text-slate-500">
              Purchased Sneaker Items
            </h4>
            <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <ShoeImage
                        src={item.image}
                        alt={item.shoeName}
                        brand={item.brand}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{item.shoeName}</p>
                      <p className="text-xs text-slate-500">{item.brand} • {item.color}</p>
                      <span className="inline-block mt-1 font-mono font-bold text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        Size EUR {item.size}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900 font-mono">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {item.quantity} x {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Financial Summary */}
          <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Standard Shipping:</span>
              <span className="font-mono text-emerald-600 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span className="font-mono text-indigo-600">{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          {/* Section: Change Order Status */}
          <div className="p-4 rounded-xl bg-slate-100/60 border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-800 text-xs">Update Fulfillment Status</p>
              <p className="text-[11px] text-slate-500">
                Change order payment and fulfillment status across store terminals.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(['Paid', 'Processing', 'Cancelled'] as PaymentStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateStatus(order.id, st)}
                  disabled={order.paymentStatus === st}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    order.paymentStatus === st
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice & Packing Slip</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
