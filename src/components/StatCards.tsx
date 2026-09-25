'use client';

import React from 'react';
import { StatItem } from '@/types';
import {
  Banknote,
  ShoppingBag,
  AlertTriangle,
  Users,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

interface StatCardsProps {
  stats: StatItem[];
  onFilterLowStock?: () => void;
}

export default function StatCards({ stats, onFilterLowStock }: StatCardsProps) {
  const getIcon = (type: StatItem['iconName']) => {
    switch (type) {
      case 'dollar':
        return {
          icon: Banknote,
          bg: 'bg-emerald-50',
          border: 'border-emerald-200/60',
          text: 'text-emerald-600',
        };
      case 'shoppingBag':
        return {
          icon: ShoppingBag,
          bg: 'bg-indigo-50',
          border: 'border-indigo-200/60',
          text: 'text-indigo-600',
        };
      case 'alertTriangle':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-50',
          border: 'border-amber-200/60',
          text: 'text-amber-600',
        };
      case 'users':
        return {
          icon: Users,
          bg: 'bg-blue-50',
          border: 'border-blue-200/60',
          text: 'text-blue-600',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((item) => {
        const style = getIcon(item.iconName);
        const Icon = style.icon;
        const isAlert = item.id === 'low-stock';

        return (
          <div
            key={item.id}
            onClick={() => {
              if (isAlert && onFilterLowStock) {
                onFilterLowStock();
              }
            }}
            className={`relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group ${
              isAlert ? 'cursor-pointer hover:border-amber-300' : ''
            }`}
          >
            {/* Top row: Icon and Trend Pill */}
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-xl ${style.bg} ${style.border} border flex items-center justify-center ${style.text} shadow-2xs group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {item.isPositive ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{item.change}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{item.change}</span>
                </div>
              )}
            </div>

            {/* Middle: Title & Value */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">{item.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {item.value}
              </h3>
            </div>

            {/* Bottom: Context / Timeframe & Sparkline vibe */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.timeframe}</span>
              </div>
              {isAlert && (
                <span className="text-[11px] font-semibold text-amber-600 underline decoration-amber-300 underline-offset-2">
                  Inspect stock &rarr;
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
