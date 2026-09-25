'use client';

import React, { useState, useMemo } from 'react';
import { ShoeProduct, PosCartItem, PosTransaction } from '@/types';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Printer,
  CreditCard,
  QrCode,
  Banknote,
  RotateCcw,
  Sparkles,
  User,
  Phone,
  AlertCircle,
  Tag,
  Receipt,
  Store,
} from 'lucide-react';

interface PosModuleProps {
  products: ShoeProduct[];
  onCompleteTransaction: (transaction: PosTransaction) => void;
}

const AVAILABLE_SIZES = [38, 39, 40, 41, 42, 43, 44];

export default function PosModule({ products, onCompleteTransaction }: PosModuleProps) {
  // Catalogue Search and Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Semua');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Transaction / Cart state
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [customerName, setCustomerName] = useState('Pelanggan Walk-In');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Tunai' | 'QRIS' | 'Debit BCA' | 'Kartu Kredit'>('Tunai');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [cashAmountInput, setCashAmountInput] = useState<string>('');

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  // Unique Brands
  const brandsList = useMemo(() => {
    return ['Semua', ...Array.from(new Set(products.map((p) => p.brand)))];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBrand = selectedBrand === 'Semua' || p.brand === selectedBrand;
      const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
      return matchQuery && matchBrand && matchCategory;
    });
  }, [products, searchQuery, selectedBrand, selectedCategory]);

  // Add Item to Cart
  const handleAddToCart = (product: ShoeProduct, size: number) => {
    const availableStock = product.sizes[size] || 0;
    if (availableStock <= 0) return;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size
      );

      if (existingIndex > -1) {
        const item = prev[existingIndex];
        if (item.quantity >= availableStock) {
          return prev; // stock limit reached
        }
        const updated = [...prev];
        updated[existingIndex] = {
          ...item,
          quantity: item.quantity + 1,
        };
        return updated;
      } else {
        const newItem: PosCartItem = {
          productId: product.id,
          name: product.name,
          brand: product.brand,
          sku: product.sku,
          size,
          color: product.color,
          price: product.price,
          quantity: 1,
          availableStock,
          image: product.image,
        };
        return [...prev, newItem];
      }
    });
  };

  // Stepper quantity update
  const handleUpdateQty = (productId: string, size: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.size === size) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.availableStock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item): item is PosCartItem => item !== null)
    );
  };

  // Remove single item
  const handleRemoveItem = (productId: string, size: number) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size))
    );
  };

  // Clear Cart
  const handleResetCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setCashAmountInput('');
  };

  // Calculations
  const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Cash calculation
  const cashAmountNum = parseInt(cashAmountInput, 10) || 0;
  const changeDue = Math.max(0, cashAmountNum - totalAmount);
  const isCashSufficient = paymentMethod !== 'Tunai' || cashAmountNum >= totalAmount;

  // Quick cash buttons
  const handleQuickCash = (amount: number) => {
    setCashAmountInput(amount.toString());
  };

  // Submit Transaction
  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Tunai' && cashAmountNum < totalAmount) return;

    const trxId = `TRX-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const dateFormatted = now.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB';

    const newTransaction: PosTransaction = {
      id: trxId,
      customerName: customerName.trim() || 'Pelanggan Walk-In',
      customerPhone: customerPhone.trim() || undefined,
      cashierName: 'Agung Ota (Kasir 1)',
      branchName: 'KICKSMATE - Outlet Dago Sneakers',
      date: dateFormatted,
      items: [...cart],
      subtotal,
      discount: discountAmount,
      total: totalAmount,
      paymentMethod,
      cashAmountPaid: paymentMethod === 'Tunai' ? cashAmountNum : totalAmount,
      changeDue: paymentMethod === 'Tunai' ? changeDue : 0,
    };

    onCompleteTransaction(newTransaction);
    handleResetCart();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base">Kasir POS Retail</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Mode Penjualan Toko
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pilih ukuran sepatu untuk memasukkan ke keranjang kasir, hitung kembalian, dan cetak nota.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          <span className="font-medium">Kasir: <strong className="text-slate-800">Agung Ota</strong></span>
          <span>•</span>
          <span className="font-medium">Outlet: <strong className="text-indigo-600">Dago Bandung</strong></span>
        </div>
      </div>

      {/* Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Product Catalogue & Quick Size Picker (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari sepatu (misal: Samba, Compass, Jordan, 550)..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <div className="shrink-0">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
                >
                  {brandsList.map((b) => (
                    <option key={b} value={b}>
                      Brand: {b}
                    </option>
                  ))}
                </select>
              </div>

              {['Semua', 'Sneakers', 'Running', 'Casual', 'Basketball'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Shoes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white p-10 rounded-2xl border border-slate-200/80 text-center text-slate-400">
                <Search className="w-7 h-7 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-700 text-xs">Tidak ada sepatu ditemukan</p>
                <p className="text-[11px] text-slate-400">Coba gunakan kata kunci merk atau kategori lain.</p>
              </div>
            ) : (
              filteredProducts.map((prod) => {
                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between hover:border-indigo-200 transition-all group"
                  >
                    <div>
                      {/* Product Header */}
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition-transform">
                          {prod.image || '👟'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                            {prod.brand}
                          </span>
                          <h4 className="font-bold text-slate-900 text-xs truncate leading-snug">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">{prod.color}</p>
                        </div>
                      </div>

                      {/* Price & Stock */}
                      <div className="mt-3 flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {formatRupiah(prod.price)}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          Total Stok: <strong className="text-slate-800">{prod.totalStock}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Size Run Buttons */}
                    <div className="mt-3">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Pilih Ukuran Kasir (EUR):
                      </p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {AVAILABLE_SIZES.map((sz) => {
                          const stockCount = prod.sizes[sz] || 0;
                          const isOutOfStock = stockCount <= 0;
                          const inCartQty =
                            cart.find((c) => c.productId === prod.id && c.size === sz)
                              ?.quantity || 0;

                          return (
                            <button
                              key={sz}
                              type="button"
                              disabled={isOutOfStock || inCartQty >= stockCount}
                              onClick={() => handleAddToCart(prod, sz)}
                              title={
                                isOutOfStock
                                  ? `Size ${sz} Habis`
                                  : `Klik untuk tambah Size ${sz} ke keranjang kasir (Sisa ${stockCount})`
                              }
                              className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all text-center flex flex-col items-center justify-center ${
                                isOutOfStock
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-60'
                                  : inCartQty > 0
                                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs ring-1 ring-indigo-400'
                                  : 'bg-white hover:bg-indigo-600 hover:text-white border-slate-200 text-slate-700 active:scale-95'
                              }`}
                            >
                              <span>{sz}</span>
                              <span
                                className={`text-[8px] font-normal leading-none mt-0.5 ${
                                  isOutOfStock
                                    ? 'text-rose-500'
                                    : inCartQty > 0
                                    ? 'text-indigo-600 font-bold'
                                    : 'text-slate-400'
                                }`}
                              >
                                {isOutOfStock ? '0' : `${stockCount} psg`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Cashier Cart & Payment Panel (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-md p-5 space-y-4 sticky top-20">
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Keranjang Transaksi</h3>
                <p className="text-[11px] text-slate-400">
                  {cart.length} item sepatu dipilih
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={handleResetCart}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Customer Metadata Input */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                Nama Pelanggan
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-In Customer"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                No. WhatsApp
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cart.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                <p className="font-semibold text-slate-600 text-xs">Keranjang Kasir Kosong</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Klik nomor ukuran sepatu di katalog sebelah kiri untuk menambah ke kasir.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 truncate text-xs">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                        EUR {item.size}
                      </span>
                      <span>{formatRupiah(item.price)}</span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleUpdateQty(item.productId, item.size, -1)}
                      className="w-6 h-6 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-bold text-slate-800 text-xs">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQty(item.productId, item.size, 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="w-6 h-6 rounded-md border border-slate-200 bg-slate-50 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-700 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.productId, item.size)}
                      className="p-1 text-slate-300 hover:text-rose-600 transition-colors ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Discount & Promo Options */}
          {cart.length > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-indigo-600" />
                  Diskon / Promo
                </span>
                {discountPercent > 0 && (
                  <span className="text-[11px] font-bold text-rose-600">
                    -{formatRupiah(discountAmount)} ({discountPercent}%)
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1 text-[11px]">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercent(pct)}
                    className={`py-1 rounded-lg font-semibold border transition-all ${
                      discountPercent === pct
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {pct === 0 ? '0%' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Payment Method Tabs */}
          {cart.length > 0 && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-[11px] font-semibold text-slate-600">
                Pilih Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Tunai')}
                  className={`p-2 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'Tunai'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Tunai (Cash)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('QRIS')}
                  className={`p-2 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'QRIS'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-indigo-600" />
                  <span>QRIS Static</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Debit BCA')}
                  className={`p-2 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'Debit BCA'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>EDC / BCA</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Kartu Kredit')}
                  className={`p-2 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'Kartu Kredit'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-violet-600" />
                  <span>Kartu Kredit</span>
                </button>
              </div>

              {/* Cash details input */}
              {paymentMethod === 'Tunai' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                    <span>Uang Diterima (Rp)</span>
                    <button
                      type="button"
                      onClick={() => handleQuickCash(totalAmount)}
                      className="text-indigo-600 hover:underline"
                    >
                      Uang Pas
                    </button>
                  </div>

                  <input
                    type="number"
                    value={cashAmountInput}
                    onChange={(e) => setCashAmountInput(e.target.value)}
                    placeholder="Masukkan nominal uang..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  {/* Cash preset quick pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {[500000, 1000000, 1500000, 2000000, 2500000].map((amt) => {
                      if (amt < totalAmount) return null;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleQuickCash(amt)}
                          className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-semibold text-slate-600"
                        >
                          {amt >= 1000000 ? `${amt / 1000000}jt` : `${amt / 1000}rb`}
                        </button>
                      );
                    })}
                  </div>

                  {/* Kembalian calculation status */}
                  {cashAmountNum > 0 && (
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-xs">
                      <span>Kembalian:</span>
                      <span className={cashAmountNum >= totalAmount ? 'text-emerald-600 text-sm' : 'text-rose-600'}>
                        {cashAmountNum >= totalAmount
                          ? formatRupiah(changeDue)
                          : `Kurang ${formatRupiah(totalAmount - cashAmountNum)}`}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pricing Summary */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal Barang:</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-medium">
                <span>Diskon:</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900">
              <span>Total Tagihan:</span>
              <span className="text-base text-indigo-600">{formatRupiah(totalAmount)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            disabled={cart.length === 0 || !isCashSufficient}
            onClick={handleCheckout}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-98"
          >
            <Receipt className="w-4 h-4" />
            <span>Selesaikan & Cetak Struk ({formatRupiah(totalAmount)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
