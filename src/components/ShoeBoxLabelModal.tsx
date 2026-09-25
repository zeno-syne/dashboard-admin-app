'use client';

import React, { useState } from 'react';
import { ShoeProduct } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { X, Printer, Tag, Check, Footprints, QrCode } from 'lucide-react';

interface ShoeBoxLabelModalProps {
  product: ShoeProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

// Convert EUR size to US, UK, and CM standard footwear conversions
export function getRegionalSizes(eurSize: number) {
  const table: Record<number, { us: string; uk: string; cm: string }> = {
    38: { us: 'US 5.5', uk: 'UK 5.0', cm: '24.0 CM' },
    39: { us: 'US 6.5', uk: 'UK 6.0', cm: '24.5 CM' },
    40: { us: 'US 7.5', uk: 'UK 6.5', cm: '25.0 CM' },
    41: { us: 'US 8.0', uk: 'UK 7.5', cm: '26.0 CM' },
    42: { us: 'US 8.5', uk: 'UK 8.0', cm: '26.5 CM' },
    43: { us: 'US 9.5', uk: 'UK 9.0', cm: '27.5 CM' },
    44: { us: 'US 10.0', uk: 'UK 9.5', cm: '28.0 CM' },
  };

  return table[eurSize] || { us: `US ${(eurSize - 33.5).toFixed(1)}`, uk: `UK ${(eurSize - 34).toFixed(1)}`, cm: `${(eurSize * 0.63).toFixed(1)} CM` };
}

// Crisp Vector Barcode Generator
export function BarcodeSvg({ value, height = 48, className = '' }: { value: string; height?: number; className?: string }) {
  // Generate deterministic bar widths from string hash
  const bars: { width: number; isBlack: boolean }[] = [];
  bars.push({ width: 3, isBlack: true });
  bars.push({ width: 2, isBlack: false });
  bars.push({ width: 2, isBlack: true });
  bars.push({ width: 3, isBlack: false });

  for (let i = 0; i < value.length; i++) {
    const charCode = value.charCodeAt(i);
    const pattern = [
      (charCode % 3) + 1,
      ((charCode >> 1) % 3) + 1,
      ((charCode >> 2) % 3) + 1,
      ((charCode >> 3) % 2) + 1,
    ];

    pattern.forEach((w, idx) => {
      bars.push({ width: w * 1.5, isBlack: idx % 2 === 0 });
    });
  }

  // End guards
  bars.push({ width: 3, isBlack: true });
  bars.push({ width: 2, isBlack: false });
  bars.push({ width: 3, isBlack: true });

  const totalWidth = bars.reduce((acc, b) => acc + b.width, 0);

  let currentX = 0;
  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      className={`w-full max-h-12 ${className}`}
      preserveAspectRatio="none"
    >
      {bars.map((bar, index) => {
        const x = currentX;
        currentX += bar.width;
        if (!bar.isBlack) return null;
        return <rect key={index} x={x} y="0" width={bar.width} height={height} fill="currentColor" />;
      })}
    </svg>
  );
}

export default function ShoeBoxLabelModal({
  product,
  isOpen,
  onClose,
}: ShoeBoxLabelModalProps) {
  if (!isOpen || !product) return null;

  // Available sizes with stock or all sizes
  const sizesList = Object.keys(product.sizes).map(Number).sort((a, b) => a - b);
  const [selectedSize, setSelectedSize] = useState<number>(sizesList[0] || 42);
  const [labelFormat, setLabelFormat] = useState<'standard' | 'mini'>('standard');

  const regional = getRegionalSizes(selectedSize);
  const specificSku = `${product.sku}-${selectedSize}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 my-6">
        {/* Header bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight">
                Print Shoe Box Barcode Label
              </h2>
              <p className="text-[11px] text-slate-400">
                Standard sneaker retail box tag format (Thermal 70x50mm)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Options */}
        <div className="p-5 bg-slate-50 border-b border-slate-200/80 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Select Footwear Size (EUR Size):
            </label>
            <div className="flex flex-wrap gap-2">
              {sizesList.map((size) => {
                const stock = product.sizes[size] || 0;
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-xl border font-mono font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>EUR {size}</span>
                    <span
                      className={`text-[10px] px-1 py-0.2 rounded ${
                        isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {stock} prs
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-600">Label Dimensions:</span>
              <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="labelFormat"
                  checked={labelFormat === 'standard'}
                  onChange={() => setLabelFormat('standard')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Standard Retail Box Tag (70x50mm)</span>
              </label>
              <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                <input
                  type="radio"
                  name="labelFormat"
                  checked={labelFormat === 'mini'}
                  onChange={() => setLabelFormat('mini')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Compact Hangtag / Polybag (50x30mm)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Label Preview Container */}
        <div className="p-6 bg-slate-200/60 flex flex-col items-center justify-center">
          <p className="text-[11px] font-semibold text-slate-500 mb-2">
            Live Thermal Label Print Preview:
          </p>

          {/* Printable Box Sticker Label */}
          <div
            id="shoe-box-label-print"
            className="bg-white border-2 border-slate-900 rounded-lg shadow-lg p-4 text-slate-950 font-sans transition-all duration-200 w-full max-w-[420px] print:shadow-none print:m-0 print:border print:border-black"
          >
            {/* Top Brand & Authentic Ribbon */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
              <div className="flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-slate-900" />
                <span className="font-black tracking-wider text-sm uppercase">
                  {product.brand}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  / {product.category}
                </span>
              </div>
              <span className="text-[9px] font-bold tracking-widest uppercase bg-slate-900 text-white px-1.5 py-0.5 rounded">
                GENUINE AUTHENTIC
              </span>
            </div>

            {/* Model Name & Colorway */}
            <div className="py-2 border-b border-dashed border-slate-300">
              <h3 className="font-black text-sm uppercase tracking-tight leading-tight text-slate-900">
                {product.name}
              </h3>
              <p className="text-[10px] text-slate-600 font-semibold uppercase mt-0.5">
                COLOR: {product.color}
              </p>
            </div>

            {/* Regional Size Grid: EUR, US, UK, CM */}
            <div className="grid grid-cols-4 gap-1.5 py-2.5 text-center border-b-2 border-slate-900 bg-slate-50 rounded my-1.5 px-1">
              <div className="border-r border-slate-200 last:border-none">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">EUR</span>
                <span className="block text-xl font-black font-mono text-slate-950">
                  {selectedSize}
                </span>
              </div>
              <div className="border-r border-slate-200 last:border-none">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">US MENS</span>
                <span className="block text-sm font-black font-mono text-slate-800 pt-1">
                  {regional.us.replace('US ', '')}
                </span>
              </div>
              <div className="border-r border-slate-200 last:border-none">
                <span className="block text-[9px] font-bold text-slate-400 uppercase">UK</span>
                <span className="block text-sm font-black font-mono text-slate-800 pt-1">
                  {regional.uk.replace('UK ', '')}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-slate-400 uppercase">LENGTH</span>
                <span className="block text-sm font-black font-mono text-slate-800 pt-1">
                  {regional.cm}
                </span>
              </div>
            </div>

            {/* Barcode & Price Row */}
            <div className="pt-2 flex items-end justify-between gap-3">
              <div className="flex-1 space-y-1">
                <div className="bg-white p-0.5 text-slate-950">
                  <BarcodeSvg value={specificSku} height={40} className="text-slate-950" />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-900 tracking-wider">
                  <span>{specificSku}</span>
                  <span className="text-[9px] text-slate-500 font-sans">SCAN TO POS</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="block text-[8px] font-bold text-slate-400 uppercase">
                  SUGGESTED RETAIL PRICE
                </span>
                <span className="text-sm font-black font-mono text-slate-900 tracking-tight">
                  {formatCurrency(product.price)}
                </span>
              </div>
            </div>

            {/* Guarantee footer */}
            <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-400 font-mono">
              <span>AUTHENTIC CERTIFIED • KICKSMATE VAULT</span>
              <span>VERIFIED DEADSTOCK (DS/BNIB)</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            <span>Thermal label ready for direct spool to printer.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm shadow-indigo-200 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Box Tag (EUR {selectedSize})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
