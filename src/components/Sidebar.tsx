'use client';

import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Users,
  Settings,
  Footprints,
  Store,
  ChevronRight,
  LogOut,
  X,
  Receipt,
  TrendingUp,
  Flame,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  currentBranch?: { name: string; city: string };
  onOpenBranchSwitcher?: () => void;
}

export const menuItems = [
  { id: 'ringkasan', label: 'Overview', icon: LayoutDashboard, badge: null },
  { id: 'pos', label: 'POS Terminal', icon: Receipt, badge: 'Cashier' },
  { id: 'pesanan', label: 'Orders', icon: ShoppingBag, badge: '3 New' },
  { id: 'inventaris', label: 'Inventory', icon: Boxes, badge: 'Stock' },
  { id: 'drops', label: 'Drops & Raffles', icon: Flame, badge: 'Hot' },
  { id: 'analitik', label: 'Profit & Margins', icon: TrendingUp, badge: 'Margin' },
  { id: 'pelanggan', label: 'Customers & VIP', icon: Users, badge: null },
  { id: 'pengaturan', label: 'Store Settings', icon: Settings, badge: null },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  currentBranch,
  onOpenBranchSwitcher,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-lg tracking-tight">KICKSMATE</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  POS
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Sneaker Vault Retail OS</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsOpenMobile(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Branch Chip */}
        <div className="px-5 pt-4 pb-2">
          <div
            onClick={onOpenBranchSwitcher}
            title="Click to switch retail branch"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/90 hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <Store className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                  {currentBranch?.name || 'SoHo Flagship Store'}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <p className="text-[11px] text-slate-500 truncate">
                    {currentBranch?.city || 'New York'} • POS Online
                  </p>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-300 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.id === 'inventaris'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Stock Sync Status Card */}
        <div className="px-5 py-3">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/60 via-slate-50 to-slate-100 border border-indigo-100/80 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
              <span>Inventory Sync</span>
              <span className="text-indigo-600 font-bold">99.8%</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">Omnichannel Cloud & In-Store POS</p>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full w-[99.8%]" />
            </div>
          </div>
        </div>

        {/* User Admin Profile & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                  ZN
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">Zeno</p>
                <p className="text-[11px] text-slate-500 truncate">Head of Retail / Admin</p>
              </div>
            </div>

            <button
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
