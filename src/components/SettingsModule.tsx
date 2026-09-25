'use client';

import React, { useState } from 'react';
import { StoreSettings } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import {
  Settings,
  Store,
  Printer,
  Receipt,
  RotateCcw,
  Save,
  CheckCircle2,
  Globe,
  Phone,
  MapPin,
  Footprints,
  ShieldCheck,
  FileText,
  DollarSign,
  AtSign,
} from 'lucide-react';

const InstagramIcon = ({ className = 'w-3 h-3' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface SettingsModuleProps {
  settings: StoreSettings;
  onSaveSettings: (newSettings: StoreSettings) => void;
  onResetData: () => void;
}

export default function SettingsModule({
  settings,
  onSaveSettings,
  onResetData,
}: SettingsModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'receipt' | 'financial'>('profile');
  const [form, setForm] = useState<StoreSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field: keyof StoreSettings, val: any) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Settings Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-base tracking-tight">
              Store & Thermal Printer Settings
            </h2>
            <p className="text-xs text-slate-500">
              Configure flagship boutique profile, thermal printer spools (58mm/80mm), tax policies, and digital receipt format.
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Main Grid: Form on Left, Live Thermal Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Configuration Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-1.5 text-xs font-semibold overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab('profile')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'profile'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Store Profile & Branch</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('receipt')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'receipt'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Thermal Receipt (58/80mm)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('financial')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'financial'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Taxes & Policies</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* TAB 1: Store Profile & Branch */}
            {activeSubTab === 'profile' && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Store Name / Primary Brand
                  </label>
                  <input
                    type="text"
                    required
                    value={form.storeName}
                    onChange={(e) => handleChange('storeName', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tagline / Slogan
                    </label>
                    <input
                      type="text"
                      value={form.tagline}
                      onChange={(e) => handleChange('tagline', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Branch / Flagship Location
                    </label>
                    <input
                      type="text"
                      value={form.branchName}
                      onChange={(e) => handleChange('branchName', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Physical Store Address
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      Phone / Support
                    </label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <InstagramIcon className="w-3 h-3 text-slate-400" />
                      Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={form.instagram}
                      onChange={(e) => handleChange('instagram', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-slate-400" />
                      Official Website
                    </label>
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Thermal Receipt (58/80mm) */}
            {activeSubTab === 'receipt' && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Thermal Printer Paper Dimensions
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange('paperSize', '80mm')}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        form.paperSize === '80mm'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Receipt className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">Standard 80mm</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Desktop POS receipt printer (Epson TM-T82, Star Micronics, Sunmi). Full detail, high readability.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange('paperSize', '58mm')}
                      className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        form.paperSize === '58mm'
                          ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Printer className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900 text-xs">Compact 58mm</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Mobile Bluetooth / wireless terminal printer. Compact footprint and paper-saving.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Return & Exchange Window (Days)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={form.returnPolicyDays}
                      onChange={(e) => handleChange('returnPolicyDays', parseInt(e.target.value, 10) || 14)}
                      className="w-20 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-bold text-center"
                    />
                    <span className="text-slate-500 text-xs">
                      days from purchase date (printed on receipt)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Custom Receipt Footer Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={form.customFooterText}
                    onChange={(e) => handleChange('customFooterText', e.target.value)}
                    placeholder="Enter thank you message or footwear authenticity guarantees..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showLogo"
                    checked={form.showLogoOnReceipt}
                    onChange={(e) => handleChange('showLogoOnReceipt', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="showLogo" className="font-medium text-slate-700 text-xs cursor-pointer">
                    Print Brand Logo & Footwear Icons on Top of Receipt
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: Taxes & Policies */}
            {activeSubTab === 'financial' && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Currency Standard</label>
                    <input
                      type="text"
                      disabled
                      value="USD - United States Dollar ($)"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Default Sales Tax (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={form.taxPercentage}
                        onChange={(e) => handleChange('taxPercentage', parseInt(e.target.value, 10) || 0)}
                        className="w-24 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-bold text-center"
                      />
                      <span className="text-slate-500 text-xs">% (0% = Tax exempt retail)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
                  <p className="font-bold text-slate-800">Authenticity Guarantee Policy:</p>
                  <p className="text-[11px] text-slate-500">
                    KICKSMATE guarantees 100% Original Deadstock (DS/BNIB) footwear. Customers are entitled to independent third-party verification (CheckCheck, Legit App).
                  </p>
                </div>
              </div>
            )}

            {/* Submit & Reset Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center gap-2 text-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Settings</span>
              </button>

              <button
                type="button"
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-xl font-semibold transition-all text-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo State (Clear Storage)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Interactive Thermal Receipt Preview (5 cols) */}
        <div className="lg:col-span-5 bg-slate-100/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-xs">Live Thermal Receipt Preview</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 font-mono">
              Width: {form.paperSize}
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Changes made on the left reflect instantly on this simulated thermal printout.
          </p>

          {/* Paper receipt container */}
          <div className="flex justify-center pt-1">
            <div
              className={`bg-white rounded-xl border border-slate-300 shadow-md font-mono transition-all duration-300 p-4 text-slate-800 space-y-2.5 ${
                form.paperSize === '58mm'
                  ? 'w-[260px] text-[10px]'
                  : 'w-[320px] text-[11px]'
              }`}
            >
              {/* Receipt Header */}
              <div className="text-center pb-2 border-b border-dashed border-slate-300 space-y-0.5">
                {form.showLogoOnReceipt && (
                  <div className="flex items-center justify-center gap-1 font-black text-slate-900 text-xs tracking-wider">
                    <Footprints className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{form.storeName.toUpperCase()}</span>
                  </div>
                )}
                <p className="text-[9px] text-slate-500 font-sans">{form.tagline}</p>
                <p className="text-[9px] text-slate-600 font-sans leading-tight mt-0.5">
                  {form.address}
                </p>
                <p className="text-[9px] text-slate-500 font-sans">
                  Tel: {form.phone} • {form.instagram}
                </p>
              </div>

              {/* Meta */}
              <div className="space-y-0.5 text-[9px] pb-2 border-b border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt No:</span>
                  <span className="font-bold">TRX-SAMPLE-01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span>Sep 25, 2026, 04:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cashier:</span>
                  <span>Agung Ota (Terminal 1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold">Marcus Vance (VIP)</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1.5 py-1 border-b border-dashed border-slate-300">
                <div className="space-y-0.5">
                  <div className="font-bold leading-tight truncate">
                    Air Jordan 1 Retro High OG Chicago
                  </div>
                  <div className="flex justify-between text-slate-500 text-[9px]">
                    <span>EUR 42 • 1 x {formatCurrency(210)}</span>
                    <span className="font-bold text-slate-800">{formatCurrency(210)}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-bold leading-tight truncate">
                    Adidas Samba OG Core Black
                  </div>
                  <div className="flex justify-between text-slate-500 text-[9px]">
                    <span>EUR 40 • 1 x {formatCurrency(100)}</span>
                    <span className="font-bold text-slate-800">{formatCurrency(100)}</span>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 text-[10px] pb-2 border-b border-dashed border-slate-300">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(310)}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>VIP Promo Discount (10%):</span>
                  <span>-{formatCurrency(31)}</span>
                </div>
                {form.taxPercentage > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Sales Tax ({form.taxPercentage}%):</span>
                    <span>{formatCurrency(Math.round((279 * form.taxPercentage) / 100))}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(279)}</span>
                </div>
                <div className="flex justify-between text-[9px] pt-1">
                  <span className="text-slate-500">Payment:</span>
                  <span className="font-bold">APPLE PAY</span>
                </div>
              </div>

              {/* Dynamic Footer Policy Text */}
              <div className="text-center text-[9px] text-slate-400 font-sans space-y-1 pt-1">
                <p className="leading-snug">{form.customFooterText}</p>
                <p className="text-slate-500 font-medium">
                  Size exchange eligible within {form.returnPolicyDays} days in unworn condition.
                </p>
                <p className="font-bold text-slate-700 mt-1">Thank You For Your Visit!</p>
                <p className="font-mono text-[8px] text-slate-400">{form.website}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
