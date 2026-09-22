'use client';

import React, { useState } from 'react';
import { X, Plus, PackageCheck } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (productName: string) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Sepatu Compass');
  const [size, setSize] = useState('42');
  const [price, setPrice] = useState('489000');
  const [stock, setStock] = useState('20');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(name || 'Sepatu Sneakers Baru');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Tambah Varian Sepatu Baru</h3>
              <p className="text-[11px] text-slate-400">Input katalog stok ke inventaris toko</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Model Sepatu
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Compass Retrograde Low Black"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

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
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Ukuran (Size EUR)</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 bg-white"
              >
                <option value="38">Size 38</option>
                <option value="39">Size 39</option>
                <option value="40">Size 40</option>
                <option value="41">Size 41</option>
                <option value="42">Size 42</option>
                <option value="43">Size 43</option>
                <option value="44">Size 44</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Harga Retail (Rp)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jumlah Stok Awal
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Menyimpan ke Database...</span>
              ) : (
                <>
                  <PackageCheck className="w-4 h-4" />
                  <span>Simpan ke Inventaris Toko</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
