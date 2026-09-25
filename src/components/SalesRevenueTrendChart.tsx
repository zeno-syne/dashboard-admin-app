'use client';

import React, { useState } from 'react';
import { mockWeeklySalesTrend, DailySalesTrend } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import {
  TrendingUp,
  Store,
  Calendar,
  Sparkles,
  ShoppingBag,
  Users,
  Footprints,
} from 'lucide-react';

type MetricType = 'revenue' | 'orders' | 'footfall';

export default function SalesRevenueTrendChart() {
  const [activeMetric, setActiveMetric] = useState<MetricType>('revenue');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = mockWeeklySalesTrend;

  // Metric configuration
  const config = {
    revenue: {
      label: 'Gross Sales Revenue',
      symbol: '$',
      format: (val: number) => formatCurrency(val),
      stroke: '#4f46e5', // indigo-600
      fillFrom: 'rgba(79, 70, 229, 0.22)',
      fillTo: 'rgba(79, 70, 229, 0.0)',
      pillActive: 'bg-indigo-600 text-white',
      peakLabel: 'Peak Day',
    },
    orders: {
      label: 'Footwear Orders Fulfilled',
      symbol: '',
      format: (val: number) => `${val} orders`,
      stroke: '#059669', // emerald-600
      fillFrom: 'rgba(5, 150, 105, 0.22)',
      fillTo: 'rgba(5, 150, 105, 0.0)',
      pillActive: 'bg-emerald-600 text-white',
      peakLabel: 'Busiest Day',
    },
    footfall: {
      label: 'In-Store & Vault Footfall',
      symbol: '',
      format: (val: number) => `${val.toLocaleString()} visits`,
      stroke: '#0284c7', // sky-600
      fillFrom: 'rgba(2, 132, 199, 0.22)',
      fillTo: 'rgba(2, 132, 199, 0.0)',
      pillActive: 'bg-sky-600 text-white',
      peakLabel: 'Peak Footfall',
    },
  }[activeMetric];

  // SVG dimensions
  const svgWidth = 680;
  const svgHeight = 220;
  const padLeft = 50;
  const padRight = 30;
  const padTop = 20;
  const padBottom = 35;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const values = data.map((d) => d[activeMetric]);
  const minVal = Math.min(...values) * 0.85;
  const maxVal = Math.max(...values) * 1.1;
  const valRange = maxVal - minVal || 1;

  // Generate coordinates
  const points = data.map((d, idx) => {
    const x = padLeft + (idx / (data.length - 1)) * chartW;
    const y = padTop + chartH - ((d[activeMetric] - minVal) / valRange) * chartH;
    return { x, y, raw: d };
  });

  // Smooth bezier curve
  const pathD = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    const prev = points[idx - 1];
    const cp1x = (prev.x + pt.x) / 2;
    const cp1y = prev.y;
    const cp2x = (prev.x + pt.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

  // Summary calculations
  const totalVal = values.reduce((a, b) => a + b, 0);
  const avgVal = Math.round(totalVal / values.length);
  const peakIdx = values.indexOf(Math.max(...values));
  const peakData = data[peakIdx];

  const activeHover = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Top Header & Metric Selector */}
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
              Omnichannel Sales & Footfall Velocity
            </h3>
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              7-Day Live Run
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare daily revenue curves, walk-in customer footfall, and flagship store velocity.
          </p>
        </div>

        {/* Metric Switcher Pills */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 self-start md:self-auto">
          {(
            [
              { id: 'revenue', label: 'Revenue ($)', icon: TrendingUp },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'footfall', label: 'Footfall', icon: Users },
            ] as const
          ).map((m) => {
            const Icon = m.icon;
            const isSelected = activeMetric === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMetric(m.id);
                  setHoveredIdx(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? `${config.pillActive} shadow-xs`
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Body + Quick Stats Bar */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Chart Area */}
        <div className="lg:col-span-8 overflow-x-auto">
          <div className="min-w-[500px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.fillFrom} />
                  <stop offset="100%" stopColor={config.fillTo} />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[0, 0.33, 0.66, 1].map((ratio) => {
                const y = padTop + chartH * ratio;
                const gridVal = maxVal - ratio * valRange;
                return (
                  <g key={ratio}>
                    <line
                      x1={padLeft}
                      y1={y}
                      x2={svgWidth - padRight}
                      y2={y}
                      stroke="#f1f5f9"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      className="text-[9px] font-mono fill-slate-400 font-semibold"
                    >
                      {activeMetric === 'revenue'
                        ? `$${Math.round(gridVal / 1000)}k`
                        : Math.round(gridVal)}
                    </text>
                  </g>
                );
              })}

              {/* Area path */}
              <path d={areaD} fill="url(#chartGradient)" />

              {/* Smooth curve stroke */}
              <path
                d={pathD}
                fill="none"
                stroke={config.stroke}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Hover guide line */}
              {activeHover && (
                <line
                  x1={activeHover.x}
                  y1={padTop}
                  x2={activeHover.x}
                  y2={padTop + chartH}
                  stroke="#94a3b8"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}

              {/* Data points and hover circles */}
              {points.map((pt, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <g
                    key={pt.raw.day}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(idx)}
                  >
                    {/* Background hit area */}
                    <circle cx={pt.x} cy={pt.y} r="16" fill="transparent" />

                    {/* Point circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? '6' : '3.5'}
                      fill="#ffffff"
                      stroke={config.stroke}
                      strokeWidth={isHovered ? '3' : '2'}
                      className="transition-all duration-150"
                    />

                    {/* X-axis Day labels */}
                    <text
                      x={pt.x}
                      y={padTop + chartH + 18}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-bold transition-colors ${
                        isHovered ? 'fill-slate-900 font-extrabold' : 'fill-slate-400'
                      }`}
                    >
                      {pt.raw.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Info Box / Active Day Inspector Card */}
        <div className="lg:col-span-4 bg-slate-50/80 rounded-xl p-4.5 border border-slate-200/70 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Inspected Date
              </span>
              <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  {activeHover.raw.day}, {activeHover.raw.date}
                </span>
              </p>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-indigo-600 border border-slate-200 shadow-2xs font-mono">
              Live Inspector
            </span>
          </div>

          {/* Metric Value Hero */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {config.label}
            </span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight mt-0.5">
              {config.format(activeHover.raw[activeMetric])}
            </div>
          </div>

          {/* Details breakdown */}
          <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Top Moving Shoe:</span>
              <span className="font-bold text-slate-800 text-right truncate max-w-[150px]">
                {activeHover.raw.topShoe}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">In-Store Footfall:</span>
              <span className="font-mono font-bold text-slate-700">
                {activeHover.raw.footfall.toLocaleString()} visits
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Omnichannel Split:</span>
              <span className="font-mono font-bold text-emerald-600">
                74% In-Store POS
              </span>
            </div>
          </div>

          {/* Peak Performance Badge */}
          <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{config.peakLabel}:</span>
            </div>
            <span className="font-mono font-bold text-indigo-700">
              {peakData.day} ({config.format(peakData[activeMetric])})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
