'use client';

import React from 'react';
import { PosTransaction, StoreSettings } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { X, Printer, CheckCircle, Share2, Footprints } from 'lucide-react';

interface ReceiptModalProps {
  transaction: PosTransaction | null;
  isOpen: boolean;
  onClose: () => void;
  onNewTransaction: () => void;
  settings?: StoreSettings;
}

export default function ReceiptModal({
  transaction,
  isOpen,
  onClose,
  onNewTransaction,
  settings,
}: ReceiptModalProps) {
  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const is58mm = settings?.paperSize === '58mm';
  const storeName = settings?.storeName || 'KICKSMATE SNEAKERS';
  const tagline = settings?.tagline || 'Footwear & Sneaker Vault';
  const branchName = transaction.branchName || settings?.branchName || 'SoHo Flagship Store - New York';
  const address = settings?.address || '524 Broadway, SoHo, New York, NY 10012';
  const phone = settings?.phone || '+1 (212) 555-0199';
  const instagram = settings?.instagram || '@kicksmate.nyc';
  const website = settings?.website || 'kicksmate.com';
  const showLogo = settings?.showLogoOnReceipt ?? true;
  const returnPolicyDays = settings?.returnPolicyDays ?? 14;
  const customFooter = settings?.customFooterText || 'Unworn footwear in original packaging eligible for exchange within policy window.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className={`bg-white rounded-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 my-6 transition-all ${
        is58mm ? 'max-w-[320px]' : 'max-w-[370px]'
      }`}>
        {/* Top notification bar */}
        <div className="bg-emerald-600 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-xs font-bold">Transaction Successfully Saved</p>
              <p className="text-[10px] text-emerald-100">Inventory automatically updated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700/50 cursor-pointer"
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
              {showLogo && (
                <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900 text-sm tracking-wider">
                  <Footprints className="w-4 h-4 text-indigo-600" />
                  <span>{storeName.toUpperCase()}</span>
                </div>
              )}
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">{tagline}</p>
              <p className="text-[10px] text-slate-500 font-sans">
                {branchName}
              </p>
              <p className="text-[9px] text-slate-400 font-sans">{address}</p>
              <p className="text-[9px] text-slate-400 font-sans">Tel: {phone} • {instagram}</p>
            </div>

            {/* Meta info */}
            <div className="space-y-1 text-[10px] pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-bold text-slate-800">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span>{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cashier:</span>
                <span>{transaction.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
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
                      EUR {item.size} • {item.quantity} x {formatCurrency(item.price)}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals & Payments */}
            <div className="space-y-1 text-[10px] pt-1 pb-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span>{formatCurrency(transaction.subtotal)}</span>
              </div>
              {transaction.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount Promo:</span>
                  <span>-{formatCurrency(transaction.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>TOTAL:</span>
                <span>{formatCurrency(transaction.total)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Payment:</span>
                <span className="font-bold uppercase">{transaction.paymentMethod}</span>
              </div>
              {transaction.paymentMethod === 'Cash' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount Tendered:</span>
                    <span>{formatCurrency(transaction.cashAmountPaid || transaction.total)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Change Due:</span>
                    <span>{formatCurrency(transaction.changeDue || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer remarks */}
            <div className="text-center text-[9px] text-slate-400 font-sans space-y-1 pt-1">
              <p>Official sales invoice & receipt.</p>
              <p>{customFooter}</p>
              <p>Size exchange permitted within {returnPolicyDays} days with receipt & original box tag.</p>
              <p className="font-bold text-slate-600 mt-2">Thank you for visiting KICKSMATE!</p>
              <p className="font-mono text-[8px] text-slate-400">{website}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print POS Receipt</span>
          </button>

          <button
            onClick={() => {
              onNewTransaction();
              onClose();
            }}
            className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm shadow-indigo-200 cursor-pointer"
          >
            <span>New Sale</span>
          </button>
        </div>
      </div>
    </div>
  );
}
