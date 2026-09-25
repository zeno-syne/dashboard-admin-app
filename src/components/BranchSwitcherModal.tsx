'use client';

import React from 'react';
import { Store, MapPin, Check, X, Globe, Radio, ShieldCheck } from 'lucide-react';
import { soundFx } from '@/utils/audio';

export interface StoreBranch {
  id: string;
  name: string;
  city: string;
  country: string;
  type: string;
  terminalStatus: 'Active' | 'Online' | 'Synchronized';
  registersCount: number;
  timeZone: string;
  currency: string;
}

export const STORE_BRANCHES: StoreBranch[] = [
  {
    id: 'nyc-soho',
    name: 'SoHo Flagship Store',
    city: 'New York',
    country: 'United States',
    type: 'Primary Flagship & Vault',
    terminalStatus: 'Active',
    registersCount: 4,
    timeZone: 'EDT (UTC-4)',
    currency: 'USD ($)',
  },
  {
    id: 'tokyo-harajuku',
    name: 'Harajuku Sneaker Vault',
    city: 'Tokyo',
    country: 'Japan',
    type: 'Asia-Pacific Consignment',
    terminalStatus: 'Online',
    registersCount: 2,
    timeZone: 'JST (UTC+9)',
    currency: 'USD ($)',
  },
  {
    id: 'london-mayfair',
    name: 'Mayfair Boutique & VIP Lounge',
    city: 'London',
    country: 'United Kingdom',
    type: 'Europe Flagship',
    terminalStatus: 'Online',
    registersCount: 3,
    timeZone: 'BST (UTC+1)',
    currency: 'USD ($)',
  },
  {
    id: 'nj-fulfillment',
    name: 'Central Warehouse & Vault',
    city: 'Secaucus, NJ',
    country: 'United States',
    type: 'Consolidated Distribution',
    terminalStatus: 'Synchronized',
    registersCount: 6,
    timeZone: 'EDT (UTC-4)',
    currency: 'USD ($)',
  },
];

interface BranchSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBranchId: string;
  onSelectBranch: (branch: StoreBranch) => void;
}

export default function BranchSwitcherModal({
  isOpen,
  onClose,
  selectedBranchId,
  onSelectBranch,
}: BranchSwitcherModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50 duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Select Retail Branch</h3>
              <p className="text-xs text-slate-500">Switch active POS terminal location & vault inventory context.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Branch List */}
        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {STORE_BRANCHES.map((b) => {
            const isSelected = b.id === selectedBranchId;
            return (
              <button
                key={b.id}
                onClick={() => {
                  soundFx.playClickTone();
                  onSelectBranch(b);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer group ${
                  isSelected
                    ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-200/50'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-white'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                        {b.name}
                      </p>
                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-600 text-white uppercase tracking-wider font-mono">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{b.city}, {b.country} • {b.type}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono text-emerald-600 font-bold block flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {b.terminalStatus}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {b.registersCount} registers
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 group-hover:border-slate-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Multi-store terminal synchronization active</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">4 Global Hubs</span>
        </div>
      </div>
    </div>
  );
}
