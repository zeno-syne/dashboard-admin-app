'use client';

import React from 'react';
import { Order, PaymentStatus } from '@/types';
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

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Lunas':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'Menunggu':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock,
        };
      case 'Diproses':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: RefreshCw,
        };
      case 'Dibatalkan':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle,
        };
    }
  };

  const currentBadge = getStatusBadge(order.paymentStatus);
  const StatusIcon = currentBadge.icon;

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-900 text-base">
              Detail Pesanan <span className="text-indigo-600 font-mono">{order.id}</span>
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
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
                <span>Informasi Pelanggan</span>
              </div>
              <p className="font-medium text-slate-800">{order.customerName}</p>
              <p className="text-xs text-slate-500">{order.customerEmail}</p>
              <p className="text-xs text-slate-500 mt-1">{order.customerPhone}</p>
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/70 flex items-start gap-1.5 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{order.customerCity}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 font-semibold text-slate-900 mb-2">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Logistik & Pembayaran</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ekspedisi:</span>
                  <span className="font-medium text-slate-800">{order.shippingCourier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Resi:</span>
                  <span className="font-mono font-medium text-slate-700">
                    {order.trackingNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="font-medium text-slate-800 flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-slate-400" />
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Order:</span>
                  <span className="text-slate-600">{order.orderDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Ordered Shoes List */}
          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Item Sepatu yang Dipesan ({order.items.length})
            </h4>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                      {item.image}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{item.shoeName}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                          Size {item.size}
                        </span>
                        <span>•</span>
                        <span>{item.color}</span>
                        <span>•</span>
                        <span>{item.quantity} pasang</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-slate-900 text-sm">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      @{formatRupiah(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="mt-3 p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total Pembayaran Tagihan</p>
                <p className="text-xs text-indigo-600 font-medium">Termasuk PPN & Asuransi</p>
              </div>
              <p className="text-xl font-bold text-slate-900">
                {formatRupiah(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Quick Status Update Selector */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Ubah Status Pembayaran Langsung:
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Lunas', 'Menunggu', 'Diproses', 'Dibatalkan'] as PaymentStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(order.id, status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      order.paymentStatus === status
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
          <button
            onClick={() => {
              window.print();
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Cetak Invoice Struk</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-indigo-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
