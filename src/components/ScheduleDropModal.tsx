'use client';

import React, { useState } from 'react';
import { X, Flame, Calendar, DollarSign, Tag, Layers, Check } from 'lucide-react';
import { SneakerDrop, DropMechanism, DropStatus } from '@/types';
import { STORE_BRANCHES } from '@/components/BranchSwitcherModal';
import { soundFx } from '@/utils/audio';

interface ScheduleDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDrop: (drop: SneakerDrop) => void;
}

export default function ScheduleDropModal({
  isOpen,
  onClose,
  onAddDrop,
}: ScheduleDropModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Jordan / Nike');
  const [colorway, setColorway] = useState('');
  const [sku, setSku] = useState('');
  const [retailPrice, setRetailPrice] = useState(160);
  const [projectedResale, setProjectedResale] = useState(480);
  const [releaseDate, setReleaseDate] = useState('Oct 18, 2026 • 10:00 AM EST');
  const [mechanism, setMechanism] = useState<DropMechanism>('Digital Raffle');
  const [targetBranch, setTargetBranch] = useState('All Global Branches');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<Record<number, number>>({
    39: 4,
    40: 8,
    41: 12,
    42: 15,
    43: 6,
    44: 3,
  });

  if (!isOpen) return null;

  const totalPairs = Object.values(sizes).reduce((a, b) => a + (b || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sku.trim()) return;

    soundFx.playBarcodeBeep();

    const newDrop: SneakerDrop = {
      id: `DROP-${String(Date.now()).slice(-4)}`,
      name,
      brand,
      colorway: colorway || 'Standard Colorway',
      sku: sku.toUpperCase(),
      retailPrice: Number(retailPrice),
      projectedResale: Number(projectedResale),
      releaseDate,
      launchTimestamp: Date.now() + 1000 * 60 * 60 * 72,
      status: 'Upcoming Drop',
      mechanism,
      targetBranch,
      totalAllocatedPairs: totalPairs,
      raffleEntriesCount: 0,
      sizeAllocation: sizes,
      image: '👟',
      description: description || 'Limited edition vault drop allocation.',
      winnersDrawn: [],
    };

    onAddDrop(newDrop);
    soundFx.playSuccessChime();
    onClose();
  };

  const handleSizeChange = (sz: number, val: number) => {
    soundFx.playClickTone();
    setSizes((prev) => ({
      ...prev,
      [sz]: Math.max(0, val),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Schedule Hyped Sneaker Drop</h3>
              <p className="text-xs text-slate-400">Configure release mechanics, size allocation & resale projection</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Sneaker Silhouette Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Travis Scott x Air Jordan 1 Low"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand / Division</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white"
              >
                <option value="Jordan / Nike">Jordan / Nike</option>
                <option value="Nike Basketball">Nike Basketball</option>
                <option value="adidas Originals">adidas Originals</option>
                <option value="New Balance">New Balance</option>
                <option value="ASICS SportStyle">ASICS SportStyle</option>
                <option value="Salomon Advanced">Salomon Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Colorway Description</label>
              <input
                type="text"
                placeholder="e.g. Reverse Mocha / Sail / Red"
                value={colorway}
                onChange={(e) => setColorway(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Style / SKU Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. DM7866-162"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Retail Price ($)</label>
              <input
                type="number"
                min="1"
                value={retailPrice}
                onChange={(e) => setRetailPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resale Index ($)</label>
              <input
                type="number"
                min="1"
                value={projectedResale}
                onChange={(e) => setProjectedResale(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-emerald-600 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Est. ROI Margin</label>
              <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 text-center">
                +{Math.round(((projectedResale - retailPrice) / retailPrice) * 100)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Release Mechanism</label>
              <select
                value={mechanism}
                onChange={(e) => setMechanism(e.target.value as DropMechanism)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white"
              >
                <option value="Digital Raffle">Digital Raffle (Provably Fair)</option>
                <option value="In-Store Balloting">In-Store Balloting (Boutique Pickup)</option>
                <option value="VIP Priority Draw">VIP Priority Draw (Tier Exclusive)</option>
                <option value="FCFS Speed Drop">FCFS Speed Drop (First-Come)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Destination Branch</label>
              <select
                value={targetBranch}
                onChange={(e) => setTargetBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white"
              >
                <option value="All Global Branches">All Global Branches (Omnichannel)</option>
                {STORE_BRANCHES.map((b) => (
                  <option key={b.id} value={`${b.name} (${b.city})`}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Size Run Allocation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">Size Matrix Allocation (EUR 39 - 44)</label>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                Total: {totalPairs} Pairs
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[39, 40, 41, 42, 43, 44].map((sz) => (
                <div key={sz} className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">EU {sz}</span>
                  <input
                    type="number"
                    min="0"
                    value={sizes[sz] || 0}
                    onChange={(e) => handleSizeChange(sz, Number(e.target.value))}
                    className="w-full text-center text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg py-1 focus:outline-none focus:border-slate-900"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Drop Editorial Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Collector release notes, materials, special packaging..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
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
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Confirm & Schedule Drop</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
