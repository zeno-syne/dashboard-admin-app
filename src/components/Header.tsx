'use client';

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Menu,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  PackageCheck
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal?: () => void;
}

export default function Header({
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Pesanan Baru Masuk!',
      desc: 'Dimas Pratama memesan New Balance 550 (Size 42)',
      time: '15 menit yang lalu',
      type: 'order',
      unread: true,
    },
    {
      id: 2,
      title: 'Peringatan Stok Rendah',
      desc: 'Ventela Public Low White tersisa 1 pasang (Size 41)',
      time: '1 jam yang lalu',
      type: 'warning',
      unread: true,
    },
    {
      id: 3,
      title: 'Pembayaran Diterima',
      desc: 'BCA VA Siti Rahmawati Rp 489.000 telah lunas',
      time: '2 jam yang lalu',
      type: 'payment',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Search Input */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID pesanan, nama pelanggan, atau model sepatu..."
            className="w-full pl-10 pr-16 py-2 rounded-xl bg-slate-100/70 border border-slate-200/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Date, Notifications, Quick Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Indicator (hidden on small screens) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Selasa, 22 Sep 2026</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
            aria-label="Lihat Notifikasi"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
                <div className="p-3.5 px-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-slate-900">Notifikasi Toko</h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                      2 Baru
                    </span>
                  </div>
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Tandai dibaca
                  </button>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 flex gap-3 hover:bg-slate-50/80 transition-colors ${
                        n.unread ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          n.type === 'order'
                            ? 'bg-indigo-100 text-indigo-600'
                            : n.type === 'warning'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {n.type === 'order' && <PackageCheck className="w-4 h-4" />}
                        {n.type === 'warning' && <AlertCircle className="w-4 h-4" />}
                        {n.type === 'payment' && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {n.title}
                          </p>
                          {n.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                          {n.desc}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50/80 border-t border-slate-100 text-center">
                  <button className="text-xs font-medium text-slate-600 hover:text-slate-900">
                    Lihat Semua Aktivitas
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Action: Tambah Sepatu / Stok */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-200 transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah Produk</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>
    </header>
  );
}
