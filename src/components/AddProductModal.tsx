'use client';

import React, { useState } from 'react';
import { ShoeProduct, ShoeCategory } from '@/types';
import { X, Plus, PackageCheck, Sparkles } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ShoeProduct) => void;
}

const SIZES_LIST = [38, 39, 40, 41, 42, 43, 44];

export default function AddProductModal({
  isOpen,
  onClose,
  onAddProduct,
}: AddProductModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Sepatu Compass');
  const [category, setCategory] = useState<ShoeCategory>('Sneakers');
  const [sku, setSku] = useState('');
  const [color, setColor] = useState('');
  const [price, setPrice] = useState('550000');
  const [costPrice, setCostPrice] = useState('380000');
  const [threshold, setThreshold] = useState('3');
  const [sizeStock, setSizeStock] = useState<Record<number, number>>({
    38: 3,
    39: 4,
    40: 6,
    41: 5,
    42: 4,
    43: 2,
    44: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const generateSku = () => {
    const brandPrefix = brand.substring(0, 3).toUpperCase().replace(/\s/g, '');
    const namePrefix = (name || 'SHOE').substring(0, 3).toUpperCase().replace(/\s/g, '');
    const randomNum = Math.floor(100 + Math.random() * 900);
    setSku(`${brandPrefix}-${namePrefix}-${randomNum}`);
  };

  const handleSizeStockChange = (size: number, val: string) => {
    const parsed = parseInt(val, 10);
    setSizeStock((prev) => ({
      ...prev,
      [size]: isNaN(parsed) ? 0 : Math.max(0, parsed),
    }));
  };

  const totalCalculatedStock = Object.values(sizeStock).reduce((acc, curr) => acc + (curr || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalSku =
      sku ||
      `${brand.substring(0, 3).toUpperCase()}-${(name || 'SHOE')
        .substring(0, 3)
        .toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProduct: ShoeProduct = {
      id: `PRD-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      brand,
      sku: finalSku,
      category,
      price: parseInt(price, 10) || 0,
      costPrice: parseInt(costPrice, 10) || 0,
      color: color.trim() || 'Standard Edition',
      sizes: sizeStock,
      totalStock: totalCalculatedStock,
      threshold: parseInt(threshold, 10) || 3,
      image: '👟',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onAddProduct(newProduct);
      // Reset form
      setName('');
      setSku('');
      setColor('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tambah Model Sepatu Baru</h3>
              <p className="text-[11px] text-slate-500">Daftarkan SKU dan stok ukuran ke inventaris</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Shoe Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Model Sepatu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Compass Retrograde Low Black White"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand / Merk</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 bg-white"
              >
                <option value="Sepatu Compass">Sepatu Compass</option>
                <option value="Ventela">Ventela</option>
                <option value="Aerostreet">Aerostreet</option>
                <option value="Patrobas">Patrobas</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="New Balance">New Balance</option>
                <option value="Asics">Asics</option>
                <option value="Puma">Puma</option>
                <option value="Converse">Converse</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShoeCategory)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 bg-white"
              >
                <option value="Sneakers">Sneakers</option>
                <option value="Casual">Casual</option>
                <option value="Running">Running</option>
                <option value="Basketball">Basketball</option>
                <option value="Formal">Formal</option>
              </select>
            </div>
          </div>

          {/* SKU & Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Kode SKU Gudang</label>
                <button
                  type="button"
                  onClick={generateSku}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  Auto-SKU
                </button>
              </div>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Misal: CMP-RET-BLK"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Varian Warna</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Contoh: Black / Off-White"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>
          </div>

          {/* Pricing: Cost & Retail */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Harga Modal / Beli (Rp)
              </label>
              <input
                type="number"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Harga Jual Retail (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 font-semibold"
              />
            </div>
          </div>

          {/* Size Distribution Grid */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-700">
                Alokasi Stok Awal per Ukuran (EUR)
              </label>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Total: {totalCalculatedStock} Pasang
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {SIZES_LIST.map((sz) => (
                <div key={sz} className="text-center">
                  <span className="block text-[10px] font-bold text-slate-500 mb-1">EUR {sz}</span>
                  <input
                    type="number"
                    min="0"
                    value={sizeStock[sz] || 0}
                    onChange={(e) => handleSizeStockChange(sz, e.target.value)}
                    className="w-full text-center py-1.5 font-bold text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs bg-slate-50/60"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Min threshold */}
          <div className="pt-1 flex items-center justify-between text-slate-600">
            <span className="text-[11px]">Batas Peringatan Stok Menipis</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="20"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-14 text-center py-1 text-xs border border-slate-200 rounded-lg bg-white"
              />
              <span className="text-[11px] text-slate-400">pasang/ukuran</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Menyimpan ke Gudang...</span>
              ) : (
                <>
                  <PackageCheck className="w-4 h-4" />
                  <span>Daftarkan Produk</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
