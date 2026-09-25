'use client';

import React, { useState, useMemo } from 'react';
import { ShoeProduct, ShoeCategory } from '@/types';
import ShoeImage from '@/components/ShoeImage';
import {
  Search,
  Filter,
  Plus,
  Boxes,
  AlertTriangle,
  Layers,
  ChevronDown,
  Edit3,
  Trash2,
  TrendingUp,
  Tag,
  ArrowUpDown,
  CircleAlert,
  CheckCircle2,
  Flame,
  Percent,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface InventoryTableProps {
  products: ShoeProduct[];
  onOpenAddModal: () => void;
  onSelectProductForEditStock: (product: ShoeProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onPrintLabel?: (product: ShoeProduct) => void;
}

const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44] as const;

// Luxury boutique brand signature styling
const getBrandBadge = (brand: string) => {
  switch (brand.toLowerCase()) {
    case 'nike':
      return {
        pill: 'bg-zinc-950 text-white border-zinc-800',
        dot: 'bg-orange-500',
      };
    case 'air jordan':
    case 'jordan':
      return {
        pill: 'bg-red-950 text-red-100 border-red-900/60',
        dot: 'bg-red-500',
      };
    case 'new balance':
      return {
        pill: 'bg-slate-900 text-slate-100 border-slate-700',
        dot: 'bg-red-500',
      };
    case 'adidas':
      return {
        pill: 'bg-black text-white border-zinc-700',
        dot: 'bg-white',
      };
    case 'asics':
      return {
        pill: 'bg-blue-950 text-blue-100 border-blue-800/60',
        dot: 'bg-blue-400',
      };
    default:
      return {
        pill: 'bg-slate-800 text-slate-100 border-slate-700',
        dot: 'bg-indigo-400',
      };
  }
};

export default function InventoryTable({
  products,
  onOpenAddModal,
  onSelectProductForEditStock,
  onDeleteProduct,
  onPrintLabel,
}: InventoryTableProps) {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'All' | 'Healthy' | 'Low' | 'Broken Run'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price' | 'margin'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Unique brands
  const brandsList = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return ['All', ...list];
  }, [products]);

  // Inventory KPI calculations
  const totalSkuCount = products.length;
  const totalPairsCount = products.reduce((acc, curr) => acc + curr.totalStock, 0);
  const totalAssetValue = products.reduce((acc, curr) => acc + curr.costPrice * curr.totalStock, 0);
  const totalRetailValue = products.reduce((acc, curr) => acc + curr.price * curr.totalStock, 0);
  const brokenSizeRunsCount = products.filter((p) => {
    return Object.values(p.sizes).some((s) => s === 0);
  }).length;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        const matchQuery =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.sku.toLowerCase().includes(search.toLowerCase()) ||
          item.brand.toLowerCase().includes(search.toLowerCase()) ||
          item.color.toLowerCase().includes(search.toLowerCase());

        const matchBrand = selectedBrand === 'All' || item.brand === selectedBrand;
        const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;

        let matchStatus = true;
        const hasZero = Object.values(item.sizes).some((s) => s === 0);
        const hasLow = Object.values(item.sizes).some((s) => s > 0 && s <= item.threshold);

        if (stockStatusFilter === 'Broken Run') {
          matchStatus = hasZero || item.totalStock === 0;
        } else if (stockStatusFilter === 'Low') {
          matchStatus = hasLow;
        } else if (stockStatusFilter === 'Healthy') {
          matchStatus = !hasZero && !hasLow;
        }

        return matchQuery && matchBrand && matchCategory && matchStatus;
      })
      .sort((a, b) => {
        let valA: string | number = a.name;
        let valB: string | number = b.name;

        if (sortBy === 'stock') {
          valA = a.totalStock;
          valB = b.totalStock;
        } else if (sortBy === 'price') {
          valA = a.price;
          valB = b.price;
        } else if (sortBy === 'margin') {
          valA = ((a.price - a.costPrice) / a.price) * 100;
          valB = ((b.price - b.costPrice) / b.price) * 100;
        }

        if (sortOrder === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [products, search, selectedBrand, selectedCategory, stockStatusFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'stock' | 'price' | 'margin') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Precision Inventory KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Catalog Models */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Catalog Models
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">
                {totalSkuCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">SKUs</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">Active boutique vault</p>
          </div>
        </div>

        {/* Total Pairs On-Hand */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Pairs In Vault
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-mono">
                {totalPairsCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">pairs</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
              Avg {totalSkuCount > 0 ? (totalPairsCount / totalSkuCount).toFixed(1) : 0} prs/model
            </p>
          </div>
        </div>

        {/* Inventory Capital Value */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Capital Valuation
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                {formatCurrency(totalAssetValue)}
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 truncate mt-0.5 font-mono font-medium">
              Retail: {formatCurrency(totalRetailValue)}
            </p>
          </div>
        </div>

        {/* Broken Size-Run Alerts */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Broken Size-Runs
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-extrabold text-rose-600 tracking-tight font-mono">
                {brokenSizeRunsCount}
              </span>
              <span className="text-xs font-semibold text-slate-400">models</span>
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {totalSkuCount > 0 ? Math.round((brokenSizeRunsCount / totalSkuCount) * 100) : 0}% has depleted sizes
            </p>
          </div>
        </div>
      </div>

      {/* Main Inventory Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Card Header & Controls */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-slate-900 text-base tracking-tight">
                  Footwear Inventory Matrix
                </h3>
                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200/60">
                  {filteredProducts.length} models
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time EUR 38–44 size-run heatmap, wholesale cost margins, and barcode box label printing.
              </p>
            </div>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shadow-indigo-200 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Register Sneaker Model</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search sneaker by model name, SKU, brand, or colorway..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>

            {/* Filter Dropdowns & Status Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Brand Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Brand:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  {brandsList.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none cursor-pointer text-xs"
                >
                  {['All', 'Sneakers', 'Running', 'Casual', 'Basketball'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Status Pills */}
              <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl text-xs border border-slate-200/60">
                {(['All', 'Healthy', 'Low', 'Broken Run'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStockStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      stockStatusFilter === st
                        ? 'bg-white text-indigo-600 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Matrix Table with Heatmap Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/90 text-slate-400 font-bold border-b border-slate-200/80">
              <tr>
                {/* Sneaker Model & Brand */}
                <th className="py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider">
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Footwear Model & SKU</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>

                {/* Category & Colorway */}
                <th className="py-3.5 px-3 font-bold text-[10px] uppercase tracking-wider">
                  Category / Color
                </th>

                {/* Pricing & Margin */}
                <th className="py-3.5 px-4 text-right font-bold text-[10px] uppercase tracking-wider">
                  <button
                    onClick={() => toggleSort('price')}
                    className="flex items-center gap-1.5 justify-end w-full hover:text-slate-900 cursor-pointer"
                  >
                    <span>Retail / Margin</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>

                {/* Precision Size Run Matrix (EUR 38-44) */}
                <th className="py-2.5 px-3 text-center bg-slate-100/80 border-x border-slate-200/70">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      EUR Size-Run Matrix
                    </span>
                    <div className="flex items-center justify-center gap-1 mt-1 font-mono text-[10px] text-slate-500">
                      {ALL_SIZES.map((sz) => (
                        <span key={sz} className="w-8 text-center font-bold">
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>
                </th>

                {/* Total Pairs & Run Health */}
                <th className="py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">
                  <button
                    onClick={() => toggleSort('stock')}
                    className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Total Pairs</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>

                {/* Actions */}
                <th className="py-3.5 px-4 font-bold text-[10px] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center text-slate-400">
                    <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700 text-sm">No footwear models found</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try adjusting your search query, brand, or stock filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const hasZero = Object.values(item.sizes).some((s) => s === 0);
                  const isLowTotal = item.totalStock <= item.threshold * 4;
                  const availableSizesCount = ALL_SIZES.filter((sz) => (item.sizes[sz] || 0) > 0).length;
                  const brandStyle = getBrandBadge(item.brand);

                  // Margin calculation
                  const profitPerPair = item.price - item.costPrice;
                  const marginPercent = Math.round((profitPerPair / item.price) * 100);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/90 transition-colors group"
                    >
                      {/* Model & Brand */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/90 shadow-2xs group-hover:scale-105 transition-transform bg-white">
                            <ShoeImage
                              src={item.image}
                              alt={item.name}
                              brand={item.brand}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border tracking-wide uppercase ${brandStyle.pill}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${brandStyle.dot}`}></span>
                                {item.brand}
                              </span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200/60 text-slate-600 font-semibold">
                                {item.sku}
                              </span>
                            </div>
                            <p className="font-bold text-slate-900 text-xs leading-tight group-hover:text-indigo-600 transition-colors">
                              {item.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category & Colorway */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60 mb-1">
                          {item.category}
                        </span>
                        <p className="text-[11px] text-slate-500 truncate max-w-[130px]">
                          {item.color}
                        </p>
                      </td>

                      {/* Pricing & Margin */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <p className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                          {formatCurrency(item.price)}
                        </p>
                        <div className="flex items-center justify-end gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400 font-mono">
                            Cost: {formatCurrency(item.costPrice)}
                          </span>
                          <span className="text-[10px] font-bold font-mono px-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            +{marginPercent}%
                          </span>
                        </div>
                      </td>

                      {/* Precision Size Matrix with Visual Heatmap */}
                      <td className="py-2.5 px-3 bg-slate-50/50 border-x border-slate-200/60">
                        <div className="flex items-center justify-center gap-1">
                          {ALL_SIZES.map((sz) => {
                            const qty = item.sizes[sz] || 0;
                            const isZero = qty === 0;
                            const isLow = qty > 0 && qty <= item.threshold;
                            const isHealthy = qty > item.threshold && qty < 6;
                            const isHigh = qty >= 6;

                            return (
                              <button
                                key={sz}
                                onClick={() => onSelectProductForEditStock(item)}
                                title={`EUR ${sz}: ${qty} pairs in stock (Threshold: ${item.threshold})`}
                                className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center font-mono text-[10px] transition-all cursor-pointer border ${
                                  isZero
                                    ? 'bg-rose-50/90 border-rose-200 text-rose-600 hover:bg-rose-100 font-extrabold ring-1 ring-rose-200/50 shadow-2xs'
                                    : isLow
                                    ? 'bg-amber-50 border-amber-300/80 text-amber-800 hover:bg-amber-100 font-bold ring-1 ring-amber-200/50 shadow-2xs'
                                    : isHealthy
                                    ? 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50 font-semibold shadow-2xs'
                                    : 'bg-indigo-50/80 border-indigo-200 text-indigo-900 hover:bg-indigo-100 font-bold shadow-2xs'
                                }`}
                              >
                                <span
                                  className={`text-[8px] leading-none ${
                                    isZero
                                      ? 'text-rose-400'
                                      : isLow
                                      ? 'text-amber-500'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {sz}
                                </span>
                                <span className="font-extrabold leading-tight">
                                  {isZero ? '-' : qty}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Total Stock & Size Run Completeness Bar */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm font-mono">
                              {item.totalStock}
                            </span>
                            <span className="text-slate-400 text-xs">pairs</span>
                            {hasZero ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                                Broken Run
                              </span>
                            ) : isLowTotal ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                Full Run
                              </span>
                            )}
                          </div>

                          {/* 7-Segment Size Run Health Bar */}
                          <div className="flex items-center gap-0.5">
                            {ALL_SIZES.map((sz) => {
                              const qty = item.sizes[sz] || 0;
                              return (
                                <div
                                  key={sz}
                                  title={`EUR ${sz}: ${qty} pairs`}
                                  className={`h-1.5 w-2.5 rounded-xs ${
                                    qty === 0
                                      ? 'bg-rose-400'
                                      : qty <= item.threshold
                                      ? 'bg-amber-400'
                                      : 'bg-emerald-500'
                                  }`}
                                />
                              );
                            })}
                            <span className="text-[9px] font-mono text-slate-400 ml-1.5">
                              {availableSizesCount}/7 sizes
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {onPrintLabel && (
                            <button
                              onClick={() => onPrintLabel(item)}
                              title="Print Shoe Box Barcode Label"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectProductForEditStock(item)}
                            title="Adjust Size Quantities"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${item.name}" from active footwear inventory?`)) {
                                onDeleteProduct(item.id);
                              }
                            }}
                            title="Delete Model from Vault"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Legend & Interactive Instructions */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-3.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Heatmap Legend:
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 border border-emerald-600/40"></span>
              Healthy (3–5 prs)
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 border border-indigo-600/40"></span>
              Deep Stock (6+ prs)
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 border border-amber-500/40"></span>
              Low Stock (&le; threshold)
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 border border-rose-600/40"></span>
              Depleted / Broken (-)
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Click any size cell to adjust stock directly.
          </div>
        </div>
      </div>
    </div>
  );
}
