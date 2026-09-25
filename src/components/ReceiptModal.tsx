'use client';

import React from 'react';
import { PosTransaction } from '@/types';
import { X, Printer, CheckCircle, Share2, Footprints } from 'lucide-react';

interface ReceiptModalProps {
  transaction: PosTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onNewTransaction: () => void;
}

export default function ReceiptModal({
  transaction,
  isOpen,
  onClose,
  onNewTransaction,
}: ReceiptModalProps) {
  if (!isOpen || !transaction) return null;

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 my-6">
        {/* Top notification bar */}
        <div className="bg-emerald-600 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs font-bold">Transaksi Berhasil Disimpan</p>
              <p className="text-[10px] text-emerald-100">Stok inventaris otomatis terpotong</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 bg-slate-50 print:bg-white print:p-0">
          <div
            id="pos-receipt-print"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs font-mono text-[11px] text-slate-800 space-y-3 print:border-none print:shadow-none print:p-2"
          >
            {/* Store Brand Header */}
            <div className="text-center pb-2 border-b border-dashed border-slate-300">
              <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900 text-sm tracking-wider">
                <Footprints className="w-4 h-4 text-indigo-600" />
                <span>KICKSMATE SNEAKERS</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">Footwear & Sneakers Vault</p>
              <p className="text-[10px] text-slate-500 font-sans">
                {transaction.branchName || 'Outlet Dago Sneakers - Bandung'}
              </p>
              <p className="text-[9px] text-slate-400 font-sans">Telp: 0812-2299-8801</p>
            </div>

            {/* Meta info */}
            <div className="space-y-1 text-[10px] pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">No. Nota:</span>
                <span className="font-bold text-slate-800">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu:</span>
                <span>{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kasir:</span>
                <span>{transaction.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pelanggan:</span>
                <span className="font-semibold text-slate-800">{transaction.customerName}</span>
              </div>
            </div>

            {/* Items list */}
            <div className="space-y-2 py-1 border-b border-dashed border-slate-300">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-slate-900 leading-tight">
                    {item.name}
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>
                      Size {item.size} • {item.quantity} x {formatRupiah(item.price)}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals & Payments */}
            <div className="space-y-1 text-[10px] pt-1 pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Diskon Promo:</span>
                  <span>-{formatRupiah(transaction.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL:</span>
                <span>{formatRupiah(transaction.total)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-bold uppercase">{transaction.paymentMethod}</span>
              </div>
              {transaction.paymentMethod === 'Tunai' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Uang Diterima:</span>
                    <span>{formatRupiah(transaction.cashAmountPaid || transaction.total)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Kembalian:</span>
                    <span>{formatRupiah(transaction.changeDue || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer remarks */}
            <div className="text-center text-[9px] text-slate-400 font-sans space-y-1 pt-1">
              <p>Struk ini merupakan bukti pembayaran sah.</p>
              <p>Tukar ukuran max 3 hari dengan menyertakan struk & kondisi sepatu baru.</p>
              <p className="font-bold text-slate-600 mt-2">Terima kasih atas kunjungan Anda!</p>
              <p className="font-mono text-[8px] text-slate-300">kicksmate.id</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk POS</span>
          </button>

          <button
            onClick={() => {
              onNewTransaction();
              onClose();
            }}
            className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-indigo-200"
          >
            <span>Transaksi Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
}
