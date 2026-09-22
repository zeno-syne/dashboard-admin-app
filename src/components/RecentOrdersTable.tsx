'use client';

import React, { useState } from 'react';
import { Order, PaymentStatus } from '@/types';
import {
  Eye,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
  Filter,
  ArrowUpDown,
  ShoppingBag,
} from 'lucide-react';

interface RecentOrdersTableProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  searchFilter?: string;
}

export default function RecentOrdersTable({
  orders,
  onSelectOrder,
  searchFilter = '',
}: RecentOrdersTableProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  // Filter based on active tab and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'Semua' || order.paymentStatus === selectedStatus;

    const query = searchFilter.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesSearch =
      order.id.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerEmail.toLowerCase().includes(query) ||
      order.customerCity.toLowerCase().includes(query) ||
      order.items.some(
        (item) =>
          item.shoeName.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query)
      );

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'Lunas':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
        };
      case 'Menunggu':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
          icon: Clock,
        };
      case 'Diproses':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
          dot: 'bg-blue-500',
          icon: RefreshCw,
        };
      case 'Dibatalkan':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
          icon: XCircle,
        };
    }
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const filterTabs = ['Semua', 'Lunas', 'Menunggu', 'Diproses', 'Dibatalkan'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Pesanan Terbaru</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {filteredOrders.length} Transaksi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar pembelian sepatu dari toko fisik dan marketplace
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl overflow-x-auto max-w-full">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 shrink-0 hidden sm:block" />
          {filterTabs.map((tab) => {
            const isActive = selectedStatus === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-5">ID Pesanan</th>
              <th className="py-3 px-5">Pelanggan</th>
              <th className="py-3 px-5">Produk Sepatu</th>
              <th className="py-3 px-5">
                <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                  <span>Total Tagihan</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-5">Status Pembayaran</th>
              <th className="py-3 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ShoppingBag className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300" />
                    <p className="font-semibold text-slate-700 text-sm">Tidak ada pesanan ditemukan</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Coba ganti filter status atau kata kunci pencarian Anda
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const badge = getStatusBadge(order.paymentStatus);
                const firstItem = order.items[0];
                const extraItemsCount = order.items.length - 1;

                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-indigo-50/20 transition-colors cursor-pointer group"
                  >
                    {/* ID & Date */}
                    <td className="py-4 px-5">
                      <div className="font-mono font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {order.id}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {order.orderDate}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {getInitials(order.customerName)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {order.customerCity}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Shoe Product */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👟</span>
                        <div>
                          <div className="font-medium text-slate-800 line-clamp-1">
                            {firstItem.shoeName}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="inline-block px-1.5 py-0.2 bg-slate-100 text-slate-600 font-semibold rounded text-[11px]">
                              Size {firstItem.size}
                            </span>
                            {extraItemsCount > 0 && (
                              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                                +{extraItemsCount} sepatu lainnya
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Amount & Payment Method */}
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900">
                        {formatRupiah(order.totalAmount)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {order.paymentMethod}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        <span>{order.paymentStatus}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 bg-white text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Summary */}
      <div className="p-4 px-5 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>
          Menampilkan <span className="font-semibold text-slate-800">{filteredOrders.length}</span> dari{' '}
          <span className="font-semibold text-slate-800">{orders.length}</span> pesanan terbaru
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Data terintegrasi real-time</span>
        </div>
      </div>
    </div>
  );
}
