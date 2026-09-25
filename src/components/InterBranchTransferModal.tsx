'use client';

import React, { useState } from 'react';
import { X, ArrowRightLeft, Truck, Package, ShieldCheck, Check } from 'lucide-react';
import { ShoeProduct, StockTransfer } from '@/types';
import { STORE_BRANCHES } from '@/components/BranchSwitcherModal';
import { soundFx } from '@/utils/audio';

interface InterBranchTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ShoeProduct[];
  currentBranchName?: string;
  onDispatchTransfer: (transfer: StockTransfer) => void;
}

export default function InterBranchTransferModal({
  isOpen,
  onClose,
  products,
  currentBranchName = 'SoHo Flagship Store (New York)',
  onDispatchTransfer,
}: InterBranchTransferModalProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [fromBranch, setFromBranch] = useState(
    'Central Warehouse & Vault (Secaucus, NJ)'
  );
  const [toBranch, setToBranch] = useState(
    'SoHo Flagship Store (New York, USA)'
  );
  const [selectedSize, setSelectedSize] = useState<number>(42);
  const [quantity, setQuantity] = useState<number>(4);
  const [carrier, setCarrier] = useState('FedEx Priority Secure');

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    soundFx.playBarcodeBeep();

    const transferId = `TRF-${Math.floor(9020 + Math.random() * 800)}`;
    const tracking = `SEC-${Math.floor(10000000 + Math.random() * 90000000)}-EXP`;

    const newTransfer: StockTransfer = {
      id: transferId,
      date: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      fromBranch,
      toBranch,
      productName: currentProduct.name,
      sku: currentProduct.sku,
      size: selectedSize,
      quantity,
      status: 'In Transit',
      carrier,
      trackingNumber: tracking,
    };

    onDispatchTransfer(newTransfer);
    soundFx.playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Inter-Branch Stock Transfer</h3>
              <p className="text-xs text-slate-400">Rebalance inventory across worldwide boutique vaults</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Branch Source & Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dispatch Source Branch</label>
              <select
                value={fromBranch}
                onChange={(e) => setFromBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-slate-900"
              >
                {STORE_BRANCHES.map((b) => (
                  <option key={b.id} value={`${b.name} (${b.city})`}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Receiving Destination</label>
              <select
                value={toBranch}
                onChange={(e) => setToBranch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-slate-900"
              >
                {STORE_BRANCHES.map((b) => (
                  <option key={b.id} value={`${b.name} (${b.city})`}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Sneaker Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                soundFx.playClickTone();
                setSelectedProductId(e.target.value);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-slate-900"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.sku} (Available: {p.totalStock} pairs)
                </option>
              ))}
            </select>
          </div>

          {/* Size and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select EUR Size</label>
              <select
                value={selectedSize}
                onChange={(e) => {
                  soundFx.playClickTone();
                  setSelectedSize(Number(e.target.value));
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-slate-900"
              >
                {[38, 39, 40, 41, 42, 43, 44].map((sz) => (
                  <option key={sz} value={sz}>
                    EUR {sz} {currentProduct?.sizes?.[sz] !== undefined ? `(${currentProduct.sizes[sz]} in vault)` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Transfer Quantity (Pairs)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>

          {/* Logistics Carrier */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Logistics & Armored Carrier</label>
            <select
              value={carrier}
              onChange={(e) => setCarrier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:border-slate-900"
            >
              <option value="FedEx Priority Secure">FedEx Priority Secure (Air Armored)</option>
              <option value="DHL Global Express Air">DHL Global Express Air (Worldwide Priority)</option>
              <option value="Nippon Express Air Cargo">Nippon Express Air Cargo (Asia Pacific Vault)</option>
              <option value="Internal Vault Shuttle">Internal Vault Shuttle (NYC Metro Transit)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all hover:scale-102 active:scale-98"
            >
              <Truck className="w-4 h-4 text-indigo-400" />
              <span>Dispatch Transfer Manifest</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
