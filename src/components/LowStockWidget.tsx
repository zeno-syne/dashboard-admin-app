'use client';

import React, { useState } from 'react';
import { LowStockShoe } from '@/types';
import { AlertTriangle, Plus, Check } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface LowStockWidgetProps {
  lowStockItems: LowStockShoe[];
  onRestockItem?: (id: string) => void;
}

export default function LowStockWidget({ lowStockItems, onRestockItem }: LowStockWidgetProps) {
  const [restockedIds, setRestockedIds] = useState<Record<string, boolean>>({});

  const handleRestock = (id: string) => {
    setRestockedIds((prev) => ({ ...prev, [id]: true }));
    if (onRestockItem) {
      onRestockItem(id);
    }
    setTimeout(() => {
      setRestockedIds((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Low Stock Depletion Alert</h3>
            <p className="text-[11px] text-slate-400">Variants with fewer than 3 pairs remaining</p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
          Critical
        </span>
      </div>

      {/* List of Shoes */}
      <div className="divide-y divide-slate-100 flex-1 my-1">
        {lowStockItems.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            All footwear inventory levels are currently healthy.
          </div>
        ) : (
          lowStockItems.map((item) => {
            const isRestocked = !!restockedIds[item.id];

            return (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors rounded-lg px-1.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {item.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-1 rounded font-mono">
                      EUR {item.size}
                    </span>
                    <span>•</span>
                    <span className="text-slate-400">{item.brand}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                {/* Stock Badge & Restock Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md inline-block font-mono">
                      {item.stockLeft} left
                    </span>
                  </div>

                  <button
                    onClick={() => handleRestock(item.id)}
                    disabled={isRestocked}
                    title="Quick Restock (+5 pairs)"
                    className={`p-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isRestocked
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600'
                    }`}
                  >
                    {isRestocked ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link */}
      <div className="pt-3 border-t border-slate-100 text-center">
        <span className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
          Click + to restock 5 pairs instantly &rarr;
        </span>
      </div>
    </div>
  );
}
