'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoeProduct, Order, Customer } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import ShoeImage from '@/components/ShoeImage';
import {
  Search,
  Command,
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Boxes,
  TrendingUp,
  Users,
  Settings,
  Plus,
  ArrowRight,
  DownloadCloud,
  X,
  Footprints,
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ShoeProduct[];
  orders: Order[];
  customers: Customer[];
  onNavigateTab: (tabId: string) => void;
  onOpenAddModal: () => void;
  onExportCsv: () => void;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  products,
  orders,
  customers,
  onNavigateTab,
  onOpenAddModal,
  onExportCsv,
}: CommandPaletteModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keyboard listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Navigation action shortcuts
  const navigationItems = [
    { id: 'ringkasan', label: 'Overview Dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { id: 'pos', label: 'POS Terminal Cashier', icon: Receipt, category: 'Navigation' },
    { id: 'pesanan', label: 'Order Management & Shipping', icon: ShoppingBag, category: 'Navigation' },
    { id: 'inventaris', label: 'Inventory & Size Matrix', icon: Boxes, category: 'Navigation' },
    { id: 'analitik', label: 'Profit & Margin Analytics', icon: TrendingUp, category: 'Navigation' },
    { id: 'pelanggan', label: 'VIP Collectors & CRM', icon: Users, category: 'Navigation' },
    { id: 'pengaturan', label: 'Store & Receipt Settings', icon: Settings, category: 'Navigation' },
  ];

  const filteredNav = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(q)
  );

  // Filtered shoes
  const filteredShoes = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    )
    .slice(0, 4);

  // Filtered orders
  const filteredOrders = orders
    .filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.shippingCourier.toLowerCase().includes(q)
    )
    .slice(0, 3);

  // Filtered customers
  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    )
    .slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, sneaker model, customer, or jump to tab..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
          />
          <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 sm:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto divide-y divide-slate-100 p-2 space-y-4">
          {/* Quick Actions if query is empty */}
          {!q && (
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-2">
                Quick Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAddModal();
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left group cursor-pointer border border-slate-200/60"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                      Register Sneaker Model
                    </p>
                    <p className="text-[10px] text-slate-400">Add new footwear to vault</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onExportCsv();
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-left group cursor-pointer border border-slate-200/60"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <DownloadCloud className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">
                      Export CSV Report
                    </p>
                    <p className="text-[10px] text-slate-400">Download audited sales report</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Section */}
          {filteredNav.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Navigation
              </span>
              <div className="space-y-0.5">
                {filteredNav.map((nav) => {
                  const Icon = nav.icon;
                  return (
                    <button
                      key={nav.id}
                      onClick={() => {
                        onNavigateTab(nav.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors text-xs text-slate-700 font-semibold group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                        <span>{nav.label}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footwear Models Match */}
          {filteredShoes.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Footwear Catalog
              </span>
              <div className="space-y-1">
                {filteredShoes.map((shoe) => (
                  <button
                    key={shoe.id}
                    onClick={() => {
                      onNavigateTab('inventaris');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-white">
                        <ShoeImage
                          src={shoe.image}
                          alt={shoe.name}
                          brand={shoe.brand}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600">
                          {shoe.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {shoe.brand} • {shoe.sku}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold font-mono text-slate-900">
                        {formatCurrency(shoe.price)}
                      </p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {shoe.totalStock} pairs
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders Match */}
          {filteredOrders.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                Recent Orders
              </span>
              <div className="space-y-1">
                {filteredOrders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => {
                      onNavigateTab('pesanan');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors text-left group cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 font-mono">
                        {ord.id} • {ord.customerName}
                      </p>
                      <p className="text-[10px] text-slate-400">{ord.shippingCourier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold font-mono text-emerald-600">
                        {formatCurrency(ord.totalAmount)}
                      </p>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                        {ord.paymentStatus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers Match */}
          {filteredCustomers.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                VIP Collectors & Customers
              </span>
              <div className="space-y-1">
                {filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onNavigateTab('pelanggan');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors text-left group cursor-pointer"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">
                        {c.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {c.city} • Preferred EUR {c.preferredSize}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold font-mono text-slate-900">
                        {formatCurrency(c.totalSpent)} LTV
                      </p>
                      <span className="text-[9px] font-bold text-indigo-600 font-mono">
                        {c.tier}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results fallback */}
          {q &&
            filteredNav.length === 0 &&
            filteredShoes.length === 0 &&
            filteredOrders.length === 0 &&
            filteredCustomers.length === 0 && (
              <div className="py-10 text-center text-slate-400">
                <Footprints className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No results found for &quot;{query}&quot;</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Try searching with a model name, brand, SKU, or customer name.
                </p>
              </div>
            )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-2xs font-bold text-[10px]">
              ↑ ↓
            </kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded shadow-2xs font-bold text-[10px]">
              ↵
            </kbd>
          </div>
          <span>KICKSMATE Command OS</span>
        </div>
      </div>
    </div>
  );
}
