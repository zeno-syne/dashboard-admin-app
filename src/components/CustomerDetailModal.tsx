'use client';

import React, { useState } from 'react';
import { Customer, Order } from '@/types';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag,
  Footprints,
  Star,
  MessageCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface CustomerDetailModalProps {
  customer: Customer | null;
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateNotes?: (customerId: string, notes: string) => void;
}

export default function CustomerDetailModal({
  customer,
  orders,
  isOpen,
  onClose,
  onUpdateNotes,
}: CustomerDetailModalProps) {
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (customer) {
      setNotes(customer.notes || '');
    }
  }, [customer]);

  if (!isOpen || !customer) return null;

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  // Filter orders made by this customer
  const customerOrders = orders.filter(
    (o) =>
      o.customerName.toLowerCase() === customer.name.toLowerCase() ||
      o.customerPhone === customer.phone ||
      o.customerEmail.toLowerCase() === customer.email.toLowerCase()
  );

  const getTierColor = (tier: Customer['tier']) => {
    switch (tier) {
      case 'Sneakerhead VIP':
        return {
          bg: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white',
          border: 'border-purple-200',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          glow: 'shadow-purple-200',
        };
      case 'Gold Vault':
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
          border: 'border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          glow: 'shadow-amber-200',
        };
      case 'Silver Collector':
        return {
          bg: 'bg-gradient-to-r from-slate-600 to-slate-700 text-white',
          border: 'border-slate-300',
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          glow: 'shadow-slate-200',
        };
      case 'Bronze Member':
      default:
        return {
          bg: 'bg-gradient-to-r from-amber-700 to-orange-700 text-white',
          border: 'border-orange-200',
          badge: 'bg-orange-50 text-orange-800 border-orange-200',
          glow: 'shadow-orange-200',
        };
    }
  };

  const tierStyle = getTierColor(customer.tier);
  const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/62${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(
    `Halo kak ${customer.name}, salam dari KICKSMATE Dago! Terima kasih sudah menjadi member setia kami.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 my-6">
        {/* Modal Hero Header with Tier Gradient */}
        <div className={`p-6 ${tierStyle.bg} relative overflow-hidden`}>
          <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {customer.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-white text-lg sm:text-xl tracking-tight">
                    {customer.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide uppercase bg-white text-slate-900 shadow-xs">
                    {customer.tier}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-white/80 text-xs mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-white/70" />
                    {customer.city}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-white/70" />
                    Member sejak {customer.joinedDate}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Belanja (LTV)
              </span>
              <p className="font-mono tabular-nums font-extrabold text-slate-900 text-sm mt-1">
                {formatRupiah(customer.totalSpent)}
              </p>
              <span className="text-[10px] text-slate-500">{customer.totalOrders}x transaksi</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Poin Loyalitas
              </span>
              <p className="font-mono tabular-nums font-extrabold text-amber-600 text-sm mt-1 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {customer.points.toLocaleString('id-ID')}
              </p>
              <span className="text-[10px] text-slate-500">Kupon {formatRupiah(customer.points * 50)}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Ukuran Sepatu EUR
              </span>
              <p className="font-mono tabular-nums font-extrabold text-indigo-600 text-sm mt-1 flex items-center gap-1">
                <Footprints className="w-4 h-4 text-indigo-500" />
                EUR {customer.preferredSize}
              </p>
              <span className="text-[10px] text-slate-500">Size favorit</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Brand Favorit
              </span>
              <p className="font-bold text-slate-900 text-sm mt-1 truncate">
                {customer.favoriteBrand}
              </p>
              <span className="text-[10px] text-slate-500">Paling sering dibeli</span>
            </div>
          </div>

          {/* Contact Details & WhatsApp Button */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono font-semibold">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{customer.email}</span>
              </div>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm shadow-emerald-200 shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Catatan Khusus Pelanggan / Preferensi Staf
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Misal: Suka warna retro, sering titip PO rilis baru..."
                className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
              <button
                type="button"
                onClick={() => {
                  if (onUpdateNotes) onUpdateNotes(customer.id, notes);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>

          {/* Customer Specific Order History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>Riwayat Transaksi Pelanggan ({customerOrders.length})</span>
              </h4>
            </div>

            {customerOrders.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                <Clock className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                <span>Belum ada transaksi yang tercatat atas nama ini.</span>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                {customerOrders.map((ord) => (
                  <div key={ord.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ord.paymentStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {ord.orderDate} • {ord.items.map((i) => `${i.shoeName} (Sz ${i.size})`).join(', ')}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono tabular-nums font-bold text-slate-900">
                        {formatRupiah(ord.totalAmount)}
                      </p>
                      <p className="text-[10px] text-slate-400">{ord.paymentMethod}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
