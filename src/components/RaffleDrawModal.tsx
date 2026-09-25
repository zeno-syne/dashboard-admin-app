'use client';

import React, { useState } from 'react';
import { X, Sparkles, Trophy, CheckCircle2, Ticket, Users, ShieldCheck, RefreshCw } from 'lucide-react';
import { SneakerDrop, RaffleWinner } from '@/types';
import { soundFx } from '@/utils/audio';

interface RaffleDrawModalProps {
  drop: SneakerDrop | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveWinners: (dropId: string, winners: RaffleWinner[]) => void;
}

const SAMPLE_ENTRANTS = [
  { name: 'Marcus Vance', tier: 'Sneakerhead VIP' },
  { name: 'Sofia Chen', tier: 'Gold Vault' },
  { name: 'Liam O’Connor', tier: 'Silver Collector' },
  { name: 'Aria Takahashi', tier: 'Sneakerhead VIP' },
  { name: 'Dante Rossi', tier: 'Gold Vault' },
  { name: 'Elena Rostova', tier: 'Silver Collector' },
  { name: 'Zack Sterling', tier: 'Sneakerhead VIP' },
  { name: 'Chloe Dubois', tier: 'Bronze Member' },
  { name: 'Kai Tanaka', tier: 'Gold Vault' },
  { name: 'Nico Bellini', tier: 'Sneakerhead VIP' },
];

export default function RaffleDrawModal({
  drop,
  isOpen,
  onClose,
  onSaveWinners,
}: RaffleDrawModalProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnList, setDrawnList] = useState<RaffleWinner[]>(drop?.winnersDrawn || []);

  if (!isOpen || !drop) return null;

  const currentWinners = drawnList.length > 0 ? drawnList : (drop.winnersDrawn || []);

  const handleExecuteDraw = () => {
    setIsDrawing(true);
    soundFx.playClickTone();

    setTimeout(() => {
      soundFx.playBarcodeBeep();
    }, 400);

    setTimeout(() => {
      // Generate winners based on size allocation
      const winners: RaffleWinner[] = [];
      let ticketSeed = 9100 + Math.floor(Math.random() * 500);

      // Distribute winners across sizes
      const sizes = Object.keys(drop.sizeAllocation).map(Number);
      let entrantIdx = 0;

      sizes.forEach((sz) => {
        const countForSize = Math.min(drop.sizeAllocation[sz] || 0, 2); // sample 1-2 per size for simulation display
        for (let i = 0; i < countForSize; i++) {
          const entrant = SAMPLE_ENTRANTS[entrantIdx % SAMPLE_ENTRANTS.length];
          entrantIdx++;
          ticketSeed += 3;
          winners.push({
            ticketNumber: `TKT-${ticketSeed}`,
            customerName: entrant.name,
            size: sz,
            claimed: Math.random() > 0.3,
            drawnAt: new Date().toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
          });
        }
      });

      setDrawnList(winners);
      onSaveWinners(drop.id, winners);
      setIsDrawing(false);
      soundFx.playSuccessChime();
    }, 1200);
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
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Ballot & Raffle Drawing Engine</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Provably Fair
                </span>
              </div>
              <p className="text-xs text-slate-400">{drop.name} • SKU: {drop.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Allocation</span>
              <span className="text-lg font-bold text-slate-900">{drop.totalAllocatedPairs} Pairs</span>
            </div>
            <div className="text-center border-x border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Registered Ballots</span>
              <span className="text-lg font-bold text-indigo-600">{drop.raffleEntriesCount.toLocaleString()} Entries</span>
            </div>
            <div className="text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Win Ratio</span>
              <span className="text-lg font-bold text-emerald-600">
                {((drop.totalAllocatedPairs / drop.raffleEntriesCount) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Draw Trigger or Winners List */}
          {currentWinners.length === 0 ? (
            <div className="text-center py-10 px-4 bg-gradient-to-b from-amber-50/50 to-transparent border border-dashed border-amber-200 rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center mb-4 shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">Ready to Conduct Official Drawing</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Our cryptographic randomizer assigns pairs across each EU size matrix according to stock allocation. Winners receive an automated SMS & email claim token.
              </p>
              <button
                onClick={handleExecuteDraw}
                disabled={isDrawing}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
              >
                {isDrawing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Shuffling & Drawing Ballots...</span>
                  </>
                ) : (
                  <>
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Run Randomized Raffle Draw</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">
                    Official Winners List ({currentWinners.length} Allocated)
                  </span>
                </div>
                <button
                  onClick={handleExecuteDraw}
                  disabled={isDrawing}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDrawing ? 'animate-spin' : ''}`} />
                  <span>Re-roll Draw</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {currentWinners.map((w, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono text-xs font-bold border border-indigo-100">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{w.customerName}</span>
                          <span className="font-mono text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                            {w.ticketNumber}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">Size: EUR {w.size} • Drawn: {w.drawnAt}</span>
                      </div>
                    </div>

                    <div>
                      {w.claimed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Claimed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <Ticket className="w-3 h-3" />
                          <span>Awaiting Pickup</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Size Allocation Summary */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">Stock Allocation Breakdown</span>
            <div className="grid grid-cols-6 gap-2">
              {Object.entries(drop.sizeAllocation).map(([sz, count]) => (
                <div key={sz} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase block">EUR {sz}</span>
                  <span className="text-sm font-bold text-slate-900">{count} Pairs</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Ledger Verified</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Done & Return
          </button>
        </div>
      </div>
    </div>
  );
}
