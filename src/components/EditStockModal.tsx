'use client';

import React, { useState, useEffect } from 'react';
import { ShoeProduct } from '@/types';
import ShoeImage from '@/components/ShoeImage';
import { X, Save, Plus, Minus, Layers, AlertCircle } from 'lucide-react';

interface EditStockModalProps {
  product: ShoeProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveStock: (productId: string, newSizes: Record<number, number>) => void;
}

const AVAILABLE_SIZES = [38, 39, 40, 41, 42, 43, 44];

export default function EditStockModal({
  product,
  isOpen,
  onClose,
  onSaveStock,
}: EditStockModalProps) {
  const [sizes, setSizes] = useState<Record<number, number>>({});
  const [note, setNote] = useState('');

  useEffect(() => {
    if (product) {
      setSizes({ ...product.sizes });
      setNote('');
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSizeChange = (size: number, delta: number) => {
    setSizes((prev) => {
      const current = prev[size] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [size]: updated };
    });
  };

  const handleDirectInput = (size: number, value: string) => {
    const parsed = parseInt(value, 10);
    setSizes((prev) => ({
      ...prev,
      [size]: isNaN(parsed) ? 0 : Math.max(0, parsed),
    }));
  };

  const totalCalculatedStock = Object.values(sizes).reduce((acc, curr) => acc + (curr || 0), 0);
  const stockDiff = totalCalculatedStock - product.totalStock;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveStock(product.id, sizes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 font-bold text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Adjust Footwear Stock</h3>
              <p className="text-[11px] text-slate-500">Update stock per size (EUR Size Run)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info Card */}
        <div className="p-4 mx-6 mt-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200">
              <ShoeImage
                src={product.image}
                alt={product.name}
                brand={product.brand}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm">{product.name}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-indigo-600">{product.brand}</span>
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-slate-400 font-medium">Current Stock</p>
            <p className="text-sm font-bold text-slate-800 font-mono">{product.totalStock} pairs</p>
          </div>
        </div>

        {/* Sizes Grid */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-700">EUR Size Matrix</label>
              <span className="text-[11px] text-slate-500">
                New Total:{' '}
                <strong className="text-slate-900 font-mono">{totalCalculatedStock} pairs</strong>{' '}
                {stockDiff !== 0 && (
                  <span
                    className={`font-semibold font-mono ${
                      stockDiff > 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    ({stockDiff > 0 ? `+${stockDiff}` : stockDiff})
                  </span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {AVAILABLE_SIZES.map((size) => {
                const qty = sizes[size] || 0;
                const isLow = qty <= product.threshold && qty > 0;
                const isOut = qty === 0;

                return (
                  <div
                    key={size}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isOut
                        ? 'border-rose-200 bg-rose-50/30'
                        : isLow
                        ? 'border-amber-200 bg-amber-50/30'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-700 text-xs font-mono">EUR {size}</span>
                      <span
                        className={`text-[10px] font-semibold px-1 rounded font-mono ${
                          isOut
                            ? 'text-rose-600 bg-rose-100'
                            : isLow
                            ? 'text-amber-700 bg-amber-100'
                            : 'text-emerald-700 bg-emerald-100'
                        }`}
                      >
                        {qty} pairs
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSizeChange(size, -1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={qty}
                        onChange={(e) => handleDirectInput(size, e.target.value)}
                        className="w-full text-center py-1 font-semibold text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleSizeChange(size, 1)}
                        className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-600 flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Adjustment Audit Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Supplier PO restock / Physical warehouse stocktake audit"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 text-xs"
            />
          </div>

          {stockDiff < 0 && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2 text-amber-800 text-[11px]">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Total stock reduced by {Math.abs(stockDiff)} pairs. Please ensure audit documentation is attached.
              </span>
            </div>
          )}

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2 text-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Stock Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
