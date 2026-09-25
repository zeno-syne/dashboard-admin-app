'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ShoeProduct, PosCartItem, PosTransaction } from '@/types';
import ShoeImage from '@/components/ShoeImage';
import {
  Search,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  RotateCcw,
  Sparkles,
  User,
  Phone,
  Tag,
  Receipt,
  Store,
  Command,
  ArrowRight,
  Flame,
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

  // Tactile animation states
  const [animatingKey, setAnimatingKey] = useState<string | null>(null);
  const [cartBounced, setCartBounced] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const formatRupiah = (val: number) => 'Rp ' + val.toLocaleString('id-ID');

  // Subtle synthesized audio feedback (Cash register tactile tick)
  const playTactileBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore silently if audio is restricted
    }
  };

  // Keyboard shortcut listener (/ to focus search, Esc to clear)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        const tagName = (document.activeElement?.tagName || '').toLowerCase();
        if (tagName !== 'input' && tagName !== 'textarea') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Add Item to Cart with Visual & Tactile Feedback
  const handleAddToCart = (product: ShoeProduct, size: number) => {
    const availableStock = product.sizes[size] || 0;
    if (availableStock <= 0) return;

    const animKey = `${product.id}-${size}`;
    setAnimatingKey(animKey);
    setCartBounced(true);
    playTactileBeep();

    setTimeout(() => {
      setAnimatingKey(null);
    }, 300);

    setTimeout(() => {
      setCartBounced(false);
    }, 450);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.size === size
      );

      if (existingIndex > -1) {
        const item = prev[existingIndex];
        if (item.quantity >= availableStock) {
          return prev;
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
    playTactileBeep();
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
    playTactileBeep();
    setCashAmountInput(amount.toString());
  };

  // Submit Transaction
  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Tunai' && cashAmountNum < totalAmount) return;

    const trxId = `TRX-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const dateFormatted =
      now.toLocaleString('id-ID', {
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
    <div className="space-y-5">
      {/* Top Banner with Clean Retail Branding */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base tracking-tight">Kasir POS Retail</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Terminal Aktif
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Pilih nomor ukuran sepatu untuk menambah ke kasir. Transaksi otomatis memotong stok gudang.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 shrink-0">
          <div>
            <span className="text-slate-400 text-[10px] block">Operator Kasir</span>
            <span className="font-bold text-slate-800">Agung Ota</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <span className="text-slate-400 text-[10px] block">Cabang</span>
            <span className="font-bold text-indigo-600">Dago Bandung</span>
          </div>
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
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari sneaker (misal: Samba, Compass, Jordan, 550)..."
                className="w-full pl-9 pr-14 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none shadow-2xs">
                <span>/</span>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <div className="shrink-0">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-semibold focus:outline-none"
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Shoes Grid with High-Quality Photography & Size Run */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200/80 text-center text-slate-400">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-700 text-sm">Tidak ada sepatu ditemukan</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Coba gunakan kata kunci merk lain atau tekan Escape untuk reset pencarian.
                </p>
              </div>
            ) : (
              filteredProducts.map((prod) => {
                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-indigo-200/90 transition-all duration-200 group"
                  >
                    <div>
                      {/* Product Hero Image with Floating Brand Badge */}
                      <div className="relative mb-2.5 overflow-hidden rounded-xl bg-slate-100">
                        <ShoeImage
                          src={prod.image}
                          alt={prod.name}
                          size="xl"
                          brand={prod.brand}
                          className="w-full h-32 sm:h-36 object-cover"
                        />
                        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[10px] font-black text-slate-800 shadow-2xs border border-slate-200/60 uppercase tracking-wider">
                          {prod.brand}
                        </div>
                        <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-[9px] font-semibold text-white">
                          {prod.category}
                        </div>
                      </div>

                      {/* Shoe Name & Colorway */}
                      <div className="px-0.5">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{prod.color}</p>
                      </div>

                      {/* Price & Stock Stats */}
                      <div className="mt-2.5 px-0.5 flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-mono tabular-nums font-extrabold text-slate-900 text-sm sm:text-base">
                          {formatRupiah(prod.price)}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Stok: <strong className="font-mono tabular-nums text-slate-800">{prod.totalStock}</strong> psg
                        </span>
                      </div>
                    </div>

                    {/* Quick Add Size Run Buttons with Tactile Bounce Effect */}
                    <div className="mt-3 px-0.5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Pilih Ukuran (EUR):
                        </span>
                        <span className="text-[9px] text-slate-400">Klik untuk masuk kasir</span>
                      </div>

                      <div className="grid grid-cols-4 gap-1.5">
                        {AVAILABLE_SIZES.map((sz) => {
                          const stockCount = prod.sizes[sz] || 0;
                          const isOutOfStock = stockCount <= 0;
                          const inCartQty =
                            cart.find((c) => c.productId === prod.id && c.size === sz)
                              ?.quantity || 0;
                          const isJustAdded = animatingKey === `${prod.id}-${sz}`;

                          return (
                            <button
                              key={sz}
                              type="button"
                              disabled={isOutOfStock || inCartQty >= stockCount}
                              onClick={() => handleAddToCart(prod, sz)}
                              title={
                                isOutOfStock
                                  ? `Size ${sz} Habis`
                                  : `Klik untuk tambah Size ${sz} ke kasir (Sisa ${stockCount} psg)`
                              }
                              className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all text-center flex flex-col items-center justify-center cursor-pointer select-none active:scale-90 ${
                                isOutOfStock
                                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed line-through opacity-50'
                                  : isJustAdded
                                  ? 'bg-emerald-500 text-white border-emerald-600 scale-95 ring-2 ring-emerald-300 shadow-sm'
                                  : inCartQty > 0
                                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 ring-1 ring-indigo-400 shadow-2xs'
                                  : 'bg-slate-50 hover:bg-indigo-600 hover:text-white border-slate-200/80 text-slate-700 hover:border-indigo-600 hover:shadow-2xs'
                              }`}
                            >
                              <span className="font-mono tabular-nums leading-none">{sz}</span>
                              <span
                                className={`text-[8px] font-mono tabular-nums leading-none mt-0.5 ${
                                  isOutOfStock
                                    ? 'text-slate-300'
                                    : isJustAdded
                                    ? 'text-emerald-100 font-bold'
                                    : inCartQty > 0
                                    ? 'text-indigo-600 font-bold'
                                    : 'text-slate-400'
                                }`}
                              >
                                {isOutOfStock ? '0' : `${stockCount}p`}
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
        <div
          className={`lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-md p-5 space-y-4 sticky top-20 transition-all duration-300 ${
            cartBounced ? 'ring-2 ring-indigo-500/40 shadow-xl' : ''
          }`}
        >
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold transition-transform ${
                  cartBounced ? 'scale-110 bg-indigo-600 text-white' : ''
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Keranjang Transaksi</h3>
                <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                  {cart.length} varian sepatu •{' '}
                  {cart.reduce((a, b) => a + b.quantity, 0)} total pasang
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={handleResetCart}
                className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 transition-colors"
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
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                WhatsApp (Nota Struk)
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <ShoppingCart className="w-9 h-9 mx-auto mb-2 text-slate-200" />
                <p className="font-semibold text-slate-700 text-xs">Keranjang Kasir Masih Kosong</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                  Pilih nomor ukuran sepatu di katalog kiri untuk memasukkan barang.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="py-2.5 flex items-center justify-between gap-3 text-xs group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <ShoeImage
                      src={item.image}
                      alt={item.name}
                      size="sm"
                      brand={item.brand}
                      className="rounded-lg w-10 h-10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate text-xs leading-snug">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-mono tabular-nums font-bold text-indigo-700 bg-indigo-50 px-1 rounded text-[10px]">
                          EUR {item.size}
                        </span>
                        <span className="font-mono tabular-nums text-slate-600">
                          {formatRupiah(item.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Stepper with Tabular Figures */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.productId, item.size, -1)}
                      className="w-6 h-6 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors active:scale-95"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono tabular-nums font-bold text-slate-800 text-xs">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.productId, item.size, 1)}
                      disabled={item.quantity >= item.availableStock}
                      className="w-6 h-6 rounded-md border border-slate-200 bg-slate-50 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-slate-700 transition-colors disabled:opacity-30 active:scale-95"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
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
                  Diskon Penjualan
                </span>
                {discountPercent > 0 && (
                  <span className="text-[11px] font-mono tabular-nums font-bold text-rose-600">
                    -{formatRupiah(discountAmount)} ({discountPercent}%)
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1 text-[11px]">
                {[0, 5, 10, 15].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      playTactileBeep();
                      setDiscountPercent(pct);
                    }}
                    className={`py-1 rounded-lg font-mono tabular-nums font-semibold border transition-all ${
                      discountPercent === pct
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
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
                Metode Pembayaran
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    playTactileBeep();
                    setPaymentMethod('Tunai');
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'Tunai'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span>Tunai (Cash)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playTactileBeep();
                    setPaymentMethod('QRIS');
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'QRIS'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-indigo-600" />
                  <span>QRIS Static</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playTactileBeep();
                    setPaymentMethod('Debit BCA');
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'Debit BCA'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>EDC / BCA</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playTactileBeep();
                    setPaymentMethod('Kartu Kredit');
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 font-semibold transition-all ${
                    paymentMethod === 'Kartu Kredit'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-500 shadow-xs'
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
                    <span>Uang Diterima</span>
                    <button
                      type="button"
                      onClick={() => handleQuickCash(totalAmount)}
                      className="text-indigo-600 hover:underline font-bold"
                    >
                      Uang Pas
                    </button>
                  </div>

                  <input
                    type="number"
                    value={cashAmountInput}
                    onChange={(e) => setCashAmountInput(e.target.value)}
                    placeholder="Masukkan nominal uang..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white font-mono tabular-nums font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                          className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[10px] font-mono tabular-nums font-semibold text-slate-700 shadow-2xs"
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
                      <span
                        className={`font-mono tabular-nums ${
                          cashAmountNum >= totalAmount
                            ? 'text-emerald-600 text-sm'
                            : 'text-rose-600'
                        }`}
                      >
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

          {/* Pricing Summary with Tabular Typography */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-500 font-mono tabular-nums">
              <span className="font-sans">Subtotal Barang:</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-600 font-mono tabular-nums font-medium">
                <span className="font-sans">Diskon:</span>
                <span>-{formatRupiah(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-extrabold text-slate-900 font-mono tabular-nums">
              <span className="font-sans font-bold">Total Tagihan:</span>
              <span className="text-base text-indigo-600 font-black">{formatRupiah(totalAmount)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            disabled={cart.length === 0 || !isCashSufficient}
            onClick={handleCheckout}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 text-xs sm:text-sm active:scale-98 cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Selesaikan & Cetak Struk</span>
            <span className="font-mono tabular-nums">({formatRupiah(totalAmount)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
