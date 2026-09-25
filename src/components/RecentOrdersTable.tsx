'use client';

import React, { useState } from 'react';
import { Order, PaymentStatus } from '@/types';
import ShoeImage from '@/components/ShoeImage';
import {
  Eye,
  CheckCircle2,
  Clock,
  RefreshCw,
  XCircle,
  ShoppingBag,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

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
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Filter based on active tab and search query
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === 'All' || order.paymentStatus === selectedStatus;

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

  const getStatusBadge = (status: PaymentStatus | string) => {
    switch (status) {
      case 'Paid':
      case 'Lunas':
        return {
          label: 'Paid',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
        };
      case 'Pending':
      case 'Menunggu':
        return {
          label: 'Pending',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
          icon: Clock,
        };
      case 'Processing':
      case 'Diproses':
        return {
          label: 'Processing',
          bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
          dot: 'bg-blue-500',
          icon: RefreshCw,
        };
      case 'Cancelled':
      case 'Dibatalkan':
        return {
          label: 'Cancelled',
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
          icon: XCircle,
        };
      default:
        return {
          label: status || 'Paid',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
          icon: CheckCircle2,
        };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const filterTabs = ['All', 'Paid', 'Pending', 'Processing', 'Cancelled'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-base">Recent Orders</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {filteredOrders.length} transactions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed from SoHo flagship store terminal and online digital vault.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl text-xs font-medium w-full sm:w-auto overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedStatus === tab
                  ? 'bg-white text-indigo-600 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Order ID & Date</th>
              <th className="py-3.5 px-4 font-semibold">Customer</th>
              <th className="py-3.5 px-4 font-semibold">Sneaker Item</th>
              <th className="py-3.5 px-4 font-semibold text-right">Total Amount</th>
              <th className="py-3.5 px-4 font-semibold">Payment & Status</th>
              <th className="py-3.5 px-4 font-semibold">Fulfillment</th>
              <th className="py-3.5 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShoppingBag className="w-8 h-8 text-slate-300" />
                    <p className="font-medium text-slate-600">No orders found</p>
                    <p className="text-[11px] text-slate-400">
                      Try adjusting your status filter or search query.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const badge = getStatusBadge(order.paymentStatus);
                const BadgeIcon = badge.icon;
                const primaryItem = order.items[0];
                const otherItemsCount = order.items.length - 1;

                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Order ID & Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors font-mono">
                        {order.id}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{order.orderDate}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200">
                          {getInitials(order.customerName)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {order.customerName}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {order.customerCity}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Sneaker Item */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                          <ShoeImage
                            src={primaryItem.image}
                            alt={primaryItem.shoeName}
                            brand={primaryItem.brand}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <p className="font-semibold text-slate-900 truncate leading-tight">
                            {primaryItem.shoeName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <span className="font-mono font-bold text-slate-700">
                              EUR {primaryItem.size}
                            </span>
                            <span>•</span>
                            <span>Qty {primaryItem.quantity}</span>
                            {otherItemsCount > 0 && (
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                                +{otherItemsCount} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </td>

                    {/* Payment & Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                          <span>{badge.label}</span>
                        </span>
                        <div className="text-[10px] text-slate-400">{order.paymentMethod}</div>
                      </div>
                    </td>

                    {/* Fulfillment */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-800 text-[11px]">
                        {order.shippingCourier}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {order.trackingNumber}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOrder(order);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 font-semibold transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
