'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Sparkles,
  Trophy,
  Ticket,
  Clock,
  ArrowRightLeft,
  Truck,
  Plus,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Boxes,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { SneakerDrop, DropStatus, StockTransfer, ShoeProduct, RaffleWinner } from '@/types';
import RaffleDrawModal from '@/components/RaffleDrawModal';
import ScheduleDropModal from '@/components/ScheduleDropModal';
import InterBranchTransferModal from '@/components/InterBranchTransferModal';
import { soundFx } from '@/utils/audio';

interface DropsModuleProps {
  drops: SneakerDrop[];
  onUpdateDrops: (drops: SneakerDrop[]) => void;
  transfers: StockTransfer[];
  onUpdateTransfers: (transfers: StockTransfer[]) => void;
  products: ShoeProduct[];
  showToast: (msg: string) => void;
}

export default function DropsModule({
  drops,
  onUpdateDrops,
  transfers,
  onUpdateTransfers,
  products,
  showToast,
}: DropsModuleProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [now, setNow] = useState<number>(Date.now());

  // Modals state
  const [selectedDropForDraw, setSelectedDropForDraw] = useState<SneakerDrop | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // Live 1-second countdown interval
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (targetMs: number) => {
    const diff = targetMs - now;
    if (diff <= 0) return 'DROP IS LIVE IN VAULT';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}h : ${mins.toString().padStart(2, '0')}m : ${secs.toString().padStart(2, '0')}s`;
  };

  // Filtered drops
  const filteredDrops = useMemo(() => {
    return drops.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.brand.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (filterStatus === 'all') return true;
      if (filterStatus === 'raffle' && d.status === 'Raffle Open') return true;
      if (filterStatus === 'upcoming' && d.status === 'Upcoming Drop') return true;
      if (filterStatus === 'completed' && d.status === 'Draw Completed') return true;
      return true;
    });
  }, [drops, searchQuery, filterStatus]);

  // Handle saving drawn winners
  const handleSaveWinners = (dropId: string, winners: RaffleWinner[]) => {
    const updated = drops.map((d) => {
      if (d.id === dropId) {
        return {
          ...d,
          status: 'Draw Completed' as DropStatus,
          winnersDrawn: winners,
        };
      }
      return d;
    });
    onUpdateDrops(updated);
    showToast(`Raffle draw verified! ${winners.length} winning tickets allocated.`);
  };

  // Handle adding new drop
  const handleAddDrop = (newDrop: SneakerDrop) => {
    onUpdateDrops([newDrop, ...drops]);
    showToast(`Drop "${newDrop.name}" scheduled successfully!`);
  };

  // Handle dispatching new transfer
  const handleDispatchTransfer = (transfer: StockTransfer) => {
    onUpdateTransfers([transfer, ...transfers]);
    showToast(`Transfer manifest ${transfer.id} dispatched to ${transfer.toBranch}!`);
  };

  // Handle receiving a transfer
  const handleReceiveTransfer = (transferId: string) => {
    soundFx.playSuccessChime();
    const updated = transfers.map((t) =>
      t.id === transferId ? { ...t, status: 'Received' as const } : t
    );
    onUpdateTransfers(updated);
    showToast(`Transfer ${transferId} marked as Received & stock booked to local vault!`);
  };

  // Calculate metrics
  const totalEntries = drops.reduce((sum, d) => sum + (d.raffleEntriesCount || 0), 0);
  const totalVaultValue = drops.reduce(
    (sum, d) => sum + d.retailPrice * d.totalAllocatedPairs,
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & KPI Stat Cards */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>Omnichannel Release & Launchpad Engine</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Sneaker Drops, Raffles & Vault Logistics
            </h2>
            <p className="text-slate-300 text-xs lg:text-sm max-w-xl">
              Coordinate limited-tier sneaker releases, manage provably fair digital ballot drawings, and transfer stock seamlessly across international flagship vaults.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClickTone();
                setIsTransferOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 backdrop-blur-md transition-all border border-white/10 active:scale-98"
            >
              <ArrowRightLeft className="w-4 h-4 text-indigo-300" />
              <span>Dispatch Transfer</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClickTone();
                setIsScheduleOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-500/25 transition-all hover:scale-102 active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Drop</span>
            </button>
          </div>
        </div>

        {/* 4 Mini Stat Blocks */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Active Scheduled Drops</span>
            <span className="text-xl font-bold text-white">{drops.length} Silhouette Drops</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Raffle Ballots Registered</span>
            <span className="text-xl font-bold text-indigo-300">{totalEntries.toLocaleString()} Entries</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Vault MSRP Value</span>
            <span className="text-xl font-bold text-emerald-400">${totalVaultValue.toLocaleString()} USD</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Avg. Resale Premium Index</span>
            <span className="text-xl font-bold text-amber-400">+194% Market Markup</span>
          </div>
        </div>
      </div>

      {/* Main Content Sections: Drops Grid */}
      <div className="space-y-6">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => {
                soundFx.playClickTone();
                setFilterStatus('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Releases ({drops.length})
            </button>
            <button
              onClick={() => {
                soundFx.playClickTone();
                setFilterStatus('raffle');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === 'raffle'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Raffle Open ({drops.filter((d) => d.status === 'Raffle Open').length})
            </button>
            <button
              onClick={() => {
                soundFx.playClickTone();
                setFilterStatus('upcoming');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === 'upcoming'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming ({drops.filter((d) => d.status === 'Upcoming Drop').length})
            </button>
            <button
              onClick={() => {
                soundFx.playClickTone();
                setFilterStatus('completed');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed Draws ({drops.filter((d) => d.status === 'Draw Completed').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search silhouette or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>
        </div>

        {/* Drops Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDrops.map((drop) => {
            const isCompleted = drop.status === 'Draw Completed';
            const isRaffleOpen = drop.status === 'Raffle Open';

            return (
              <div
                key={drop.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Card Header & Countdown Banner */}
                <div>
                  <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-2xl flex items-center justify-center shrink-0 border border-slate-200/60">
                        {drop.image || '👟'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            {drop.brand}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/60">
                            {drop.sku}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                          {drop.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{drop.colorway}</p>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isRaffleOpen && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Raffle Open
                        </span>
                      )}
                      {drop.status === 'Upcoming Drop' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
                          <Clock className="w-3 h-3" />
                          Upcoming Drop
                        </span>
                      )}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-slate-500" />
                          Draw Completed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Countdown Timer Strip */}
                  <div className="px-5 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Release Window:</span>
                    </div>
                    <div className="font-mono font-bold text-amber-300">
                      {isCompleted ? 'BALLOTS SETTLED' : formatCountdown(drop.launchTimestamp)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    {/* Price and Resale Index */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Retail MSRP</span>
                        <span className="text-sm font-bold text-slate-900">${drop.retailPrice}</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Est. Resale</span>
                        <span className="text-sm font-bold text-indigo-600">${drop.projectedResale}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Markup Index</span>
                        <span className="text-sm font-bold text-emerald-600">
                          +{Math.round(((drop.projectedResale - drop.retailPrice) / drop.retailPrice) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Drop Metadata */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Mechanism:</span>
                        <span className="font-bold text-slate-900">{drop.mechanism}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Boutique Allocation:</span>
                        <span className="font-semibold text-slate-800">{drop.targetBranch}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Ballot Submissions:</span>
                        <span className="font-bold text-indigo-600 font-mono">
                          {drop.raffleEntriesCount.toLocaleString()} Entries
                        </span>
                      </div>
                    </div>

                    {/* Size Allocation Mini Matrix */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                        Allocated Size Run ({drop.totalAllocatedPairs} Total Pairs):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(drop.sizeAllocation).map(([sz, qty]) => (
                          <span
                            key={sz}
                            className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                          >
                            EU {sz}: <strong className="text-slate-900">{qty}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0">
                  {isRaffleOpen ? (
                    <button
                      onClick={() => {
                        soundFx.playClickTone();
                        setSelectedDropForDraw(drop);
                      }}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-101 active:scale-99"
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Conduct Randomized Ballot Draw</span>
                    </button>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        soundFx.playClickTone();
                        setSelectedDropForDraw(drop);
                      }}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-slate-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Official Winners List ({drop.winnersDrawn?.length || 0})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        soundFx.playClickTone();
                        setSelectedDropForDraw(drop);
                      }}
                      className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-indigo-200"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      <span>View Pre-Drop Allocation</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inter-Store Logistics & Vault Transfers Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Inter-Branch Stock Transfer Manifests</h3>
              <p className="text-xs text-slate-500">Live logistical movements between NYC, Tokyo, London & NJ Vault</p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClickTone();
              setIsTransferOpen(true);
            }}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Transfer Manifest</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">Manifest ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">From $\rightarrow$ Destination</th>
                <th className="py-3 px-4">Sneaker Item</th>
                <th className="py-3 px-4">Size & Qty</th>
                <th className="py-3 px-4">Armored Logistics</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {transfers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{t.id}</td>
                  <td className="py-3.5 px-4 text-slate-500">{t.date}</td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="text-[11px] text-slate-500">From: {t.fromBranch}</div>
                      <div className="font-bold text-slate-900">To: {t.toBranch}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 line-clamp-1">{t.productName}</div>
                    <div className="font-mono text-[10px] text-slate-400">{t.sku}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900">{t.quantity} pairs</span>
                    <span className="text-slate-500 block text-[11px]">EUR {t.size}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{t.carrier}</div>
                    <div className="font-mono text-[10px] text-slate-400">{t.trackingNumber}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {t.status === 'Received' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Received
                      </span>
                    ) : t.status === 'In Transit' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <Truck className="w-3 h-3" />
                        In Transit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Dispatched
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {t.status !== 'Received' ? (
                      <button
                        onClick={() => handleReceiveTransfer(t.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-all shadow-xs"
                      >
                        Receive Stock
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold">Vaulted</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <RaffleDrawModal
        drop={selectedDropForDraw}
        isOpen={!!selectedDropForDraw}
        onClose={() => setSelectedDropForDraw(null)}
        onSaveWinners={handleSaveWinners}
      />

      <ScheduleDropModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onAddDrop={handleAddDrop}
      />

      <InterBranchTransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        products={products}
        onDispatchTransfer={handleDispatchTransfer}
      />
    </div>
  );
}
