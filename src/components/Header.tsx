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
  PackageCheck,
  Zap,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAddModal?: () => void;
  isOffline?: boolean;
  onToggleOffline?: () => void;
  pendingOfflineCount?: number;
}

export default function Header({
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
  onOpenAddModal,
  isOffline = false,
  onToggleOffline,
  pendingOfflineCount = 0,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'New Order Received!',
      desc: 'Marcus Vance purchased New Balance 550 (EUR 42)',
      time: '15 mins ago',
      type: 'order',
      unread: true,
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      desc: 'Air Jordan 1 Chicago is down to 1 pair left (EUR 41)',
      time: '1 hour ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 3,
      title: 'Payment Settled',
      desc: 'Apple Pay transaction of $210.00 confirmed',
      time: '2 hours ago',
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
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sneakers, SKU, colorway, or order ID..."
            className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs pointer-events-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Network Status, Date, Notifications, Quick Action */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Network Online/Offline Status Pill */}
        {onToggleOffline && (
          <button
            type="button"
            onClick={onToggleOffline}
            title={
              isOffline
                ? 'Offline Mode Active. Click to simulate online reconnection.'
                : 'Cloud Sync Connected. Click to simulate offline disconnection.'
            }
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              isOffline
                ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/80 hover:bg-emerald-100'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOffline ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
              }`}
            />
            <span className="text-[11px]">
              {isOffline ? `Offline (${pendingOfflineCount} Queued)` : 'Cloud Active'}
            </span>
          </button>
        )}

        {/* Date Indicator (hidden on small screens) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Friday, Sep 25, 2026</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
            aria-label="View Notifications"
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
                    <h4 className="font-semibold text-sm text-slate-900">Notifications</h4>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                      2 Unread
                    </span>
                  </div>
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
                    Mark as read
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
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 text-center bg-slate-50 border-t border-slate-100">
                  <button className="text-xs text-slate-600 hover:text-indigo-600 font-medium cursor-pointer">
                    View Activity Log
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Primary Action Button */}
        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Sneaker</span>
          </button>
        )}
      </div>
    </header>
  );
}
