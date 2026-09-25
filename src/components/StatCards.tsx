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
  Activity,
  ArrowDownRight,
} from 'lucide-react';

interface StatCardsProps {
  stats: StatItem[];
  onFilterLowStock?: () => void;
}

// Micro SVG Sparkline renderer with gradient fill
function Sparkline({
  data,
  color,
  id,
}: {
  data: number[];
  color: 'emerald' | 'indigo' | 'amber' | 'blue';
  id: string;
}) {
  if (!data || data.length < 2) return null;

  const width = 110;
  const height = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Generate normalized coordinates
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 8) - 4;
    return { x, y };
  });

  // Build SVG path
  const linePath = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    const prev = points[idx - 1];
    const cp1x = (prev.x + pt.x) / 2;
    const cp1y = prev.y;
    const cp2x = (prev.x + pt.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  const colorConfig = {
    emerald: {
      stroke: '#10b981',
      stop1: '#10b981',
      stop2: '#34d399',
    },
    indigo: {
      stroke: '#6366f1',
      stop1: '#6366f1',
      stop2: '#818cf8',
    },
    amber: {
      stroke: '#f59e0b',
      stop1: '#f59e0b',
      stop2: '#fbbf24',
    },
    blue: {
      stroke: '#3b82f6',
      stop1: '#3b82f6',
      stop2: '#60a5fa',
    },
  }[color];

  const gradientId = `sparkline-gradient-${id}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-24 h-9 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorConfig.stop1} stopOpacity="0.25" />
          <stop offset="100%" stopColor={colorConfig.stop2} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={colorConfig.stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End pulse point */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill={colorConfig.stroke}
        className="animate-pulse"
      />
    </svg>
  );
}

export default function StatCards({ stats, onFilterLowStock }: StatCardsProps) {
  const getStyle = (type: StatItem['iconName'], id: string) => {
    switch (type) {
      case 'dollar':
        return {
          icon: Banknote,
          bg: 'bg-emerald-50',
          border: 'border-emerald-200/60',
          text: 'text-emerald-600',
          sparkColor: 'emerald' as const,
        };
      case 'shoppingBag':
        return {
          icon: ShoppingBag,
          bg: 'bg-indigo-50',
          border: 'border-indigo-200/60',
          text: 'text-indigo-600',
          sparkColor: 'indigo' as const,
        };
      case 'alertTriangle':
        return {
          icon: AlertTriangle,
          bg: 'bg-amber-50',
          border: 'border-amber-200/60',
          text: 'text-amber-600',
          sparkColor: 'amber' as const,
        };
      case 'users':
        return {
          icon: Users,
          bg: 'bg-blue-50',
          border: 'border-blue-200/60',
          text: 'text-blue-600',
          sparkColor: 'blue' as const,
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((item) => {
        const style = getStyle(item.iconName, item.id);
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
            className={`relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group overflow-hidden ${
              isAlert ? 'cursor-pointer hover:border-amber-300' : ''
            }`}
          >
            {/* Top row: Icon and Trend Pill */}
            <div className="flex items-center justify-between mb-3.5">
              <div
                className={`w-11 h-11 rounded-xl ${style.bg} ${style.border} border flex items-center justify-center ${style.text} shadow-2xs group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {item.isPositive ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{item.change}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{item.change}</span>
                </div>
              )}
            </div>

            {/* Middle row: Value & Sparkline side by side */}
            <div className="flex items-end justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {item.title}
                </span>
                <h3 className="text-2xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                  {item.value}
                </h3>
              </div>

              {/* Dynamic SVG Sparkline */}
              {item.sparklineData && (
                <div className="shrink-0 pb-1">
                  <Sparkline
                    data={item.sparklineData}
                    color={style.sparkColor}
                    id={item.id}
                  />
                </div>
              )}
            </div>

            {/* Bottom row: Timeframe & Secondary Metric */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.timeframe}</span>
              </div>

              {item.secondaryMetric ? (
                <span className="text-[11px] font-semibold text-slate-500 font-mono">
                  {item.secondaryMetric}
                </span>
              ) : isAlert ? (
                <span className="text-[11px] font-semibold text-amber-600 underline decoration-amber-300 underline-offset-2">
                  Inspect stock &rarr;
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
