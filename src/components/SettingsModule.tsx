'use client';

import React, { useState } from 'react';
import { StoreSettings } from '@/types';
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

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

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
              Pengaturan Toko & Printer Struk
            </h2>
            <p className="text-xs text-slate-500">
              Kustomisasi identitas outlet, format cetak printer thermal (58mm/80mm), dan footer nota.
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in-50">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Pengaturan Berhasil Disimpan!</span>
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
              <span>Profil Toko & Cabang</span>
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
              <span>Struk Thermal (58/80mm)</span>
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
              <span>Pajak & Kebijakan</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* TAB 1: Profil Toko & Cabang */}
            {activeSubTab === 'profile' && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Toko / Brand Utama
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
                      Slogan / Tagline
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
                      Nama Cabang / Outlet
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
                    Alamat Lengkap Toko Fisik
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
                      No. WhatsApp
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
                      Instagram Toko
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
                      Website
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

            {/* TAB 2: Struk Thermal (58/80mm) */}
            {activeSubTab === 'receipt' && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Format Ukuran Kertas Thermal Printer
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
                        <p className="font-bold text-slate-900 text-xs">Standar 80mm</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Printer kasir meja desktop (Epson TM-T82, Star, Sunmi, dll). Layout lapang & jelas.
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
                        <p className="font-bold text-slate-900 text-xs">Kompak 58mm</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Printer Bluetooth mobile/portable saku. Format ringkas & hemat kertas.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Batas Waktu Tukar Ukuran (Hari)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={form.returnPolicyDays}
                      onChange={(e) => handleChange('returnPolicyDays', parseInt(e.target.value, 10) || 3)}
                      className="w-20 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800 font-bold text-center"
                    />
                    <span className="text-slate-500 text-xs">
                      hari sejak tanggal pembelian (tertera di nota)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Pesan Kustom Footer Struk
                  </label>
                  <textarea
                    rows={3}
                    value={form.customFooterText}
                    onChange={(e) => handleChange('customFooterText', e.target.value)}
                    placeholder="Tulis pesan ucapan terima kasih atau garansi keaslian sepatu..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showLogo"
                    checked={form.showLogoOnReceipt}
                    onChange={(e) => handleChange('showLogoOnReceipt', e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <label htmlFor="showLogo" className="font-medium text-slate-700 text-xs cursor-pointer">
                    Cetak Logo & Ikon Footwear di Bagian Atas Nota
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: Pajak & Keuangan */}
            {activeSubTab === 'financial' && (
              <div className="space-y-4 animate-in fade-in-50 duration-150">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mata Uang</label>
                    <input
                      type="text"
                      disabled
                      value="IDR - Indonesian Rupiah (Rp)"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-100 text-slate-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tarif PPN Default (%)
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
                      <span className="text-slate-500 text-xs">% (0% = Bebas Pajak Ritel)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs space-y-1">
                  <p className="font-bold text-slate-800">Kebijakan Garansi Keaslian:</p>
                  <p className="text-[11px] text-slate-500">
                    Toko KICKSMATE menerapkan garansi 100% Original Brand New In Box (BNIB). Pelanggan berhak melakukan otentikasi mandiri.
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
                <span>Simpan Pengaturan</span>
              </button>

              <button
                type="button"
                onClick={onResetData}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-xl font-semibold transition-all text-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua Data (Hapus Cache)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Interactive Thermal Receipt Preview (5 cols) */}
        <div className="lg:col-span-5 bg-slate-100/70 p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-xs">Pratinjau Struk Thermal Live</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 font-mono">
              Lebar: {form.paperSize}
            </span>
          </div>

          <p className="text-[11px] text-slate-500">
            Perubahan teks di samping langsung di-render pada simulasi kertas thermal ini.
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
                  Telp/WA: {form.phone} • {form.instagram}
                </p>
              </div>

              {/* Meta */}
              <div className="space-y-0.5 text-[9px] pb-2 border-b border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Nota:</span>
                  <span className="font-bold">TRX-SAMPLE-01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu:</span>
                  <span>25 Sep 2026, 16:30 WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kasir:</span>
                  <span>Agung Ota (Kasir 1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pelanggan:</span>
                  <span className="font-bold">Dimas Pratama (VIP)</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1.5 py-1 border-b border-dashed border-slate-300">
                <div className="space-y-0.5">
                  <div className="font-bold leading-tight truncate">
                    Compass Gazelle Low Black
                  </div>
                  <div className="flex justify-between text-slate-500 text-[9px]">
                    <span>Size 42 • 1 x Rp 489.000</span>
                    <span className="font-bold text-slate-800">Rp 489.000</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <div className="font-bold leading-tight truncate">
                    Adidas Samba OG White
                  </div>
                  <div className="flex justify-between text-slate-500 text-[9px]">
                    <span>Size 40 • 1 x Rp 1.850.000</span>
                    <span className="font-bold text-slate-800">Rp 1.850.000</span>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 text-[10px] pb-2 border-b border-dashed border-slate-300">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>Rp 2.339.000</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Diskon Promo VIP (10%):</span>
                  <span>-Rp 233.900</span>
                </div>
                {form.taxPercentage > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>PPN ({form.taxPercentage}%):</span>
                    <span>Rp {Math.round((2105100 * form.taxPercentage) / 100).toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black text-slate-900 pt-1 border-t border-slate-200">
                  <span>TOTAL:</span>
                  <span>Rp 2.105.100</span>
                </div>
                <div className="flex justify-between text-[9px] pt-1">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="font-bold">QRIS STATIC</span>
                </div>
              </div>

              {/* Dynamic Footer Policy Text */}
              <div className="text-center text-[9px] text-slate-400 font-sans space-y-1 pt-1">
                <p className="leading-snug">{form.customFooterText}</p>
                <p className="text-slate-500 font-medium">
                  Tukar ukuran maksimal {form.returnPolicyDays} hari dengan kondisi belum terpakai.
                </p>
                <p className="font-bold text-slate-700 mt-1">Terima Kasih!</p>
                <p className="font-mono text-[8px] text-slate-400">{form.website}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
