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

interface InventoryTableProps {
  products: ShoeProduct[];
  onOpenAddModal: () => void;
  onSelectProductForEditStock: (product: ShoeProduct) => void;
  onDeleteProduct: (productId: string) => void;
}

const ALL_SIZES = [38, 39, 40, 41, 42, 43, 44];

export default function InventoryTable({
  products,
  onOpenAddModal,
  onSelectProductForEditStock,
  onDeleteProduct,
}: InventoryTableProps) {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [stockStatusFilter, setStockStatusFilter] = useState<'Semua' | 'Aman' | 'Menipis' | 'Habis'>('Semua');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Format currency
  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  // Unique brands
  const brandsList = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.brand)));
    return ['Semua', ...list];
  }, [products]);

  // Inventory KPI calculations
  const totalSkuCount = products.length;
  const totalPairsCount = products.reduce((acc, curr) => acc + curr.totalStock, 0);
  const totalAssetValue = products.reduce((acc, curr) => acc + (curr.costPrice * curr.totalStock), 0);
  const criticalItemsCount = products.filter((p) => {
    // Has any size <= threshold or totalStock <= 15
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

        const matchBrand = selectedBrand === 'Semua' || item.brand === selectedBrand;
        const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory;

        let matchStatus = true;
        const hasZero = Object.values(item.sizes).some((s) => s === 0);
        const hasLow = Object.values(item.sizes).some((s) => s > 0 && s <= item.threshold);

        if (stockStatusFilter === 'Habis') {
          matchStatus = hasZero || item.totalStock === 0;
        } else if (stockStatusFilter === 'Menipis') {
          matchStatus = hasLow;
        } else if (stockStatusFilter === 'Aman') {
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
      {/* 4 Mini KPI Metric Cards for Inventory */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Model SKU Sepatu</p>
            <p className="text-lg font-extrabold text-slate-900">{totalSkuCount} SKU</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Stok Fisik</p>
            <p className="text-lg font-extrabold text-slate-900">{totalPairsCount} Pasang</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-slate-500">Nilai Aset Modal</p>
            <p className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
              {formatRupiah(totalAssetValue)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Perlu Restock</p>
            <p className="text-lg font-extrabold text-amber-600">{criticalItemsCount} Model</p>
          </div>
        </div>
      </div>

      {/* Main Inventory Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Katalog & Manajemen Stok Sepatu</h2>
              <p className="text-xs text-slate-500">
                Pantau ketersediaan ukuran EUR, kontrol margin profit, dan sesuaikan stok gudang.
              </p>
            </div>
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sepatu Baru</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            {/* Search Input */}
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama sepatu, brand, atau SKU..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            {/* Brand Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
              >
                {brandsList.map((b) => (
                  <option key={b} value={b}>
                    Brand: {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Sneakers">Sneakers</option>
                <option value="Running">Running</option>
                <option value="Casual">Casual</option>
                <option value="Basketball">Basketball</option>
                <option value="Formal">Formal</option>
              </select>
            </div>

            {/* Stock Status Filter */}
            <div className="sm:col-span-2">
              <select
                value={stockStatusFilter}
                onChange={(e) => setStockStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 font-medium"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aman">🟢 Stok Aman</option>
                <option value="Menipis">🟡 Perlu Restock</option>
                <option value="Habis">🔴 Ada Size Habis</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-slate-500 font-semibold select-none">
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Produk & Brand</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Kategori</th>
                <th
                  onClick={() => toggleSort('price')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Harga Jual & Margin</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">
                  <span>Matriks Ukuran (EUR 38-44)</span>
                </th>
                <th
                  onClick={() => toggleSort('stock')}
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Total Stok</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Tidak ada produk yang cocok</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Coba ganti kata kunci pencarian atau reset filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => {
                  const profitMargin = Math.round(
                    ((item.price - item.costPrice) / item.price) * 100
                  );
                  const hasZero = Object.values(item.sizes).some((s) => s === 0);
                  const isLowTotal = item.totalStock <= 15;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Product details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <ShoeImage
                            src={item.image}
                            alt={item.name}
                            size="md"
                            brand={item.brand}
                            className="rounded-xl w-12 h-12"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900 truncate">
                                {item.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="font-bold text-indigo-600 uppercase text-[10px] tracking-wide">{item.brand}</span>
                              <span>•</span>
                              <span className="font-mono tabular-nums text-slate-400">{item.sku}</span>
                              <span>•</span>
                              <span className="text-slate-400">{item.color}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.category}
                        </span>
                      </td>

                      {/* Price & Margin */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <p className="font-mono tabular-nums font-bold text-slate-900">{formatRupiah(item.price)}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <span className="text-slate-400 font-mono tabular-nums">Modal: {formatRupiah(item.costPrice)}</span>
                            <span className="text-emerald-700 font-mono tabular-nums font-semibold bg-emerald-50 px-1 rounded text-[10px]">
                              +{profitMargin}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Size Matrix Pills */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {ALL_SIZES.map((sz) => {
                            const count = item.sizes[sz] || 0;
                            const isOut = count === 0;
                            const isLow = count > 0 && count <= item.threshold;

                            return (
                              <button
                                key={sz}
                                onClick={() => onSelectProductForEditStock(item)}
                                title={`EUR ${sz}: ${count} pasang (Klik untuk atur stok)`}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer hover:shadow-2xs active:scale-95 ${
                                  isOut
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : isLow
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <span className="opacity-60 mr-1">{sz}:</span>
                                <span>{count}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Total Stock */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {item.totalStock}
                          </span>
                          <span className="text-slate-400 text-[11px]">psg</span>
                          {hasZero ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                              Ada Habis
                            </span>
                          ) : isLowTotal ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                              Menipis
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              Aman
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectProductForEditStock(item)}
                            title="Sesuaikan Stok Sepatu"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus produk "${item.name}" dari inventaris?`)) {
                                onDeleteProduct(item.id);
                              }
                            }}
                            title="Hapus Model"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition-colors"
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
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Stok Tersedia
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Stok Menipis (&le; batas aman)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Kosong (0 pasang)
            </span>
          </div>
          <span>
            Menampilkan <strong>{filteredProducts.length}</strong> dari <strong>{products.length}</strong> produk
          </span>
        </div>
      </div>
    </div>
  );
}
