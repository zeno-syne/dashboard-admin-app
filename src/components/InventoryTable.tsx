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
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface InventoryTableProps {
  products: ShoeProduct[];
  onOpenAddModal: () => void;
  onSelectProductForEditStock: (product: ShoeProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onPrintLabel?: (product: ShoeProduct) => void;
}

const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44];

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
  const [stockStatusFilter, setStockStatusFilter] = useState<'All' | 'Healthy' | 'Low' | 'Depleted'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
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
  const criticalItemsCount = products.filter((p) => {
    return Object.values(p.sizes).some((s) => s <= p.threshold);
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

        if (stockStatusFilter === 'Depleted') {
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
        }

        if (sortOrder === 'asc') {
          return valA > valB ? 1 : -1;
        } else {
          return valA < valB ? 1 : -1;
        }
      });
  }, [products, search, selectedBrand, selectedCategory, stockStatusFilter, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'stock' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Mini Inventory KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Models */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Catalog Models</p>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {totalSkuCount} <span className="text-xs text-slate-400 font-normal">SKUs</span>
            </h4>
          </div>
        </div>

        {/* Total Pairs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pairs in Stock</p>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {totalPairsCount} <span className="text-xs text-slate-400 font-normal">pairs</span>
            </h4>
          </div>
        </div>

        {/* Inventory Asset Value */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="truncate">
            <p className="text-xs text-slate-500 font-medium truncate">Inventory Asset Value</p>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-mono tabular-nums">
              {formatCurrency(totalAssetValue)}
            </h4>
          </div>
        </div>

        {/* Depletion Alerts */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Low Stock Alerts</p>
            <h4 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {criticalItemsCount} <span className="text-xs text-slate-400 font-normal">models</span>
            </h4>
          </div>
        </div>
      </div>

      {/* Main Inventory Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Card Header & Controls */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Footwear Inventory & Size Run Matrix
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {filteredProducts.length} models
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage footwear catalog, monitor sizes EUR 38–44, and print barcode box tags.
              </p>
            </div>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-200 transition-all cursor-pointer self-start sm:self-auto"
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
                placeholder="Search sneaker model, SKU, or colorway..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Brand Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 text-[11px]">Brand:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none cursor-pointer"
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
                <span className="text-slate-400 text-[11px]">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                >
                  {['All', 'Sneakers', 'Running', 'Casual', 'Basketball'].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Status Pills */}
              <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl text-xs">
                {(['All', 'Healthy', 'Low', 'Depleted'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStockStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
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

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort('name')}
                    className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Model & Brand</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-4 font-semibold">Category & Color</th>
                <th className="py-3.5 px-4 font-semibold text-right">
                  <button
                    onClick={() => toggleSort('price')}
                    className="flex items-center gap-1.5 justify-end w-full hover:text-slate-900 cursor-pointer"
                  >
                    <span>Retail Price</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                {/* Size Columns EUR 38 - 44 */}
                <th className="py-3.5 px-3 text-center font-bold text-slate-800 bg-slate-100/70 border-x border-slate-200/60">
                  Size Matrix (EUR 38–44)
                </th>
                <th className="py-3.5 px-4 font-semibold whitespace-nowrap">
                  <button
                    onClick={() => toggleSort('stock')}
                    className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
                  >
                    <span>Total Pairs</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-slate-600">No sneakers found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      No models match your search or filter criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const hasZero = Object.values(item.sizes).some((s) => s === 0);
                  const isLowTotal = item.totalStock <= item.threshold * 4;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Model & Brand */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform">
                            <ShoeImage
                              src={item.image}
                              alt={item.name}
                              brand={item.brand}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs leading-tight">
                              {item.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span className="font-semibold text-slate-600">{item.brand}</span>
                              <span>•</span>
                              <span className="font-mono text-slate-400">{item.sku}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Color */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 mb-1">
                          {item.category}
                        </span>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {item.color}
                        </p>
                      </td>

                      {/* Retail Price */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <p className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Cost: {formatCurrency(item.costPrice)}
                        </p>
                      </td>

                      {/* Size Matrix Grid */}
                      <td className="py-2.5 px-3 bg-slate-50/60 border-x border-slate-200/60">
                        <div className="flex items-center justify-center gap-1">
                          {ALL_SIZES.map((sz) => {
                            const qty = item.sizes[sz] || 0;
                            const isZero = qty === 0;
                            const isLow = qty > 0 && qty <= item.threshold;

                            return (
                              <button
                                key={sz}
                                onClick={() => onSelectProductForEditStock(item)}
                                title={`EUR ${sz}: ${qty} pairs in stock`}
                                className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center font-mono text-[10px] transition-all cursor-pointer border ${
                                  isZero
                                    ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100 font-bold'
                                    : isLow
                                    ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 font-bold'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50'
                                }`}
                              >
                                <span className="text-[8px] text-slate-400 leading-none">{sz}</span>
                                <span className="font-bold leading-tight">{qty}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Total Stock */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm font-mono">
                            {item.totalStock}
                          </span>
                          <span className="text-slate-400 text-[11px]">pairs</span>
                          {hasZero ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                              Depleted
                            </span>
                          ) : isLowTotal ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                              Low
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              Healthy
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {onPrintLabel && (
                            <button
                              onClick={() => onPrintLabel(item)}
                              title="Print Shoe Box Barcode Tag"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              <Tag className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onSelectProductForEditStock(item)}
                            title="Adjust Size Stock"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove "${item.name}" from active footwear inventory?`)) {
                                onDeleteProduct(item.id);
                              }
                            }}
                            title="Delete Model"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
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

        {/* Footer info */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Healthy (&gt; Threshold)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Low Stock (&le; Threshold)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Depleted (0 pairs)
            </span>
          </div>
          <span className="font-medium text-slate-400">
            Click any size badge to edit inventory quantity.
          </span>
        </div>
      </div>
    </div>
  );
}
