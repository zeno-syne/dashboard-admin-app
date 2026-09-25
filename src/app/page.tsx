'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatCards from '@/components/StatCards';
import RecentOrdersTable from '@/components/RecentOrdersTable';
import LowStockWidget from '@/components/LowStockWidget';
import PopularSizesWidget from '@/components/PopularSizesWidget';
import OrderDetailModal from '@/components/OrderDetailModal';
import AddProductModal from '@/components/AddProductModal';
import EditStockModal from '@/components/EditStockModal';
import InventoryTable from '@/components/InventoryTable';
import PosModule from '@/components/PosModule';
import ReceiptModal from '@/components/ReceiptModal';
import CustomersModule from '@/components/CustomersModule';
import { mockStats, mockOrders, mockProducts, mockCustomers } from '@/data/mockData';
import { Order, PaymentStatus, ShoeProduct, LowStockShoe, PosTransaction, Customer } from '@/types';
import {
  Boxes,
  Users as UsersIcon,
  Settings as SettingsIcon,
  CheckCircle2,
  DownloadCloud,
  Receipt,
  RotateCcw,
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('ringkasan');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Dynamic State for Orders, Inventory, and Customers
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [products, setProducts] = useState<ShoeProduct[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<ShoeProduct | null>(null);
  const [isEditStockOpen, setIsEditStockOpen] = useState<boolean>(false);
  
  // POS Receipt modal state
  const [lastTransaction, setLastTransaction] = useState<PosTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Hydrate data from localStorage once mounted
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('kicksmate_products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      }
      const savedOrders = localStorage.getItem('kicksmate_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      const savedCustomers = localStorage.getItem('kicksmate_customers');
      if (savedCustomers) {
        setCustomers(JSON.parse(savedCustomers));
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('kicksmate_products', JSON.stringify(products));
      } catch (e) {
        console.error(e);
      }
    }
  }, [products, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('kicksmate_orders', JSON.stringify(orders));
      } catch (e) {
        console.error(e);
      }
    }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('kicksmate_customers', JSON.stringify(customers));
      } catch (e) {
        console.error(e);
      }
    }
  }, [customers, isHydrated]);

  // Derive low stock list dynamically from actual products state
  const dynamicLowStock: LowStockShoe[] = useMemo(() => {
    const list: LowStockShoe[] = [];
    products.forEach((p) => {
      Object.entries(p.sizes).forEach(([szStr, qty]) => {
        const sz = parseInt(szStr, 10);
        if (qty <= p.threshold) {
          list.push({
            id: `${p.id}-${sz}`,
            name: p.name,
            brand: p.brand,
            sku: `${p.sku}-${sz}`,
            size: sz,
            stockLeft: qty,
            threshold: p.threshold,
            category: p.category as any,
            price: p.price,
          });
        }
      });
    });
    return list.sort((a, b) => a.stockLeft - b.stockLeft).slice(0, 6);
  }, [products]);

  // Order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: newStatus } : null));
    }
    showToast(`Status pesanan ${orderId} berhasil diubah menjadi "${newStatus}"`);
  };

  // Product Add handler
  const handleAddProduct = (newProduct: ShoeProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Model "${newProduct.name}" berhasil ditambahkan ke inventaris!`);
  };

  // Product Delete handler
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Produk sepatu berhasil dihapus dari inventaris');
  };

  // Open Edit Stock Modal
  const handleOpenEditStock = (product: ShoeProduct) => {
    setSelectedProductForStock(product);
    setIsEditStockOpen(true);
  };

  // Save updated stock per size
  const handleSaveStock = (productId: string, newSizes: Record<number, number>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const totalStock = Object.values(newSizes).reduce((acc, curr) => acc + (curr || 0), 0);
          return { ...p, sizes: newSizes, totalStock };
        }
        return p;
      })
    );
    showToast('Stok sepatu berhasil diperbarui');
  };

  // Quick restock from LowStockWidget (+5 pairs)
  const handleQuickRestock = (compositeId: string) => {
    const parts = compositeId.split('-');
    const size = parseInt(parts[parts.length - 1], 10);
    const prodId = parts.slice(0, -1).join('-');

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === prodId) {
          const current = p.sizes[size] || 0;
          const updatedSizes = { ...p.sizes, [size]: current + 5 };
          const updatedTotal = Object.values(updatedSizes).reduce((acc, curr) => acc + (curr || 0), 0);
          return { ...p, sizes: updatedSizes, totalStock: updatedTotal };
        }
        return p;
      })
    );
    showToast(`Restock +5 pasang berhasil untuk ukuran ${size}`);
  };

  // Real CSV Export
  const handleExportCsv = () => {
    const headers = [
      'ID Pesanan',
      'Tanggal',
      'Pelanggan',
      'Kota',
      'Metode Pembayaran',
      'Status Pembayaran',
      'Kurir / Channel',
      'Detail Produk (Item)',
      'Total Transaksi (IDR)',
    ];

    const rows = orders.map((o) => {
      const itemsDetail = o.items
        .map((it) => `${it.shoeName} (Sz ${it.size} x${it.quantity})`)
        .join('; ');
      return [
        `"${o.id}"`,
        `"${o.orderDate}"`,
        `"${o.customerName}"`,
        `"${o.customerCity}"`,
        `"${o.paymentMethod}"`,
        `"${o.paymentStatus}"`,
        `"${o.shippingCourier}"`,
        `"${itemsDetail}"`,
        o.totalAmount,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan-penjualan-kicksmate-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Laporan penjualan riil (CSV) berhasil diunduh!');
  };

  // Reset to default
  const handleResetDefaultData = () => {
    if (confirm('Reset semua data kembali ke default (menghapus data lokal)?')) {
      localStorage.removeItem('kicksmate_products');
      localStorage.removeItem('kicksmate_orders');
      localStorage.removeItem('kicksmate_customers');
      setProducts(mockProducts);
      setOrders(mockOrders);
      setCustomers(mockCustomers);
      showToast('Data berhasil di-reset ke nilai awal bawaan!');
    }
  };

  // Customer Management Handlers
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`Pelanggan "${newCustomer.name}" berhasil didaftarkan sebagai member!`);
  };

  const handleUpdateCustomerNotes = (customerId: string, notes: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, notes } : c))
    );
    showToast('Catatan pelanggan berhasil diperbarui!');
  };

  // Handle POS Checkout Completion
  const handleCompletePosTransaction = (transaction: PosTransaction) => {
    // 1. Deduct stock for all purchased shoe sizes
    setProducts((prev) => {
      return prev.map((product) => {
        const itemsForThisProduct = transaction.items.filter(
          (item) => item.productId === product.id
        );
        if (itemsForThisProduct.length === 0) return product;

        const updatedSizes = { ...product.sizes };
        itemsForThisProduct.forEach((item) => {
          const currentQty = updatedSizes[item.size] || 0;
          updatedSizes[item.size] = Math.max(0, currentQty - item.quantity);
        });

        const newTotal = Object.values(updatedSizes).reduce((a, b) => a + (b || 0), 0);
        return {
          ...product,
          sizes: updatedSizes,
          totalStock: newTotal,
        };
      });
    });

    // 2. Map transaction to an Order record
    const paymentMethodMap: Record<string, Order['paymentMethod']> = {
      'Tunai': 'COD',
      'QRIS': 'QRIS',
      'Debit BCA': 'BCA Virtual Account',
      'Kartu Kredit': 'Kartu Kredit',
    };

    const newOrder: Order = {
      id: transaction.id,
      customerName: transaction.customerName,
      customerEmail: transaction.customerPhone
        ? `${transaction.customerPhone}@pos.local`
        : 'kasir-offline@kicksmate.id',
      customerPhone: transaction.customerPhone || '0812-POS-OFFLINE',
      customerCity: 'Bandung (Toko Fisik)',
      orderDate: transaction.date,
      totalAmount: transaction.total,
      paymentMethod: paymentMethodMap[transaction.paymentMethod] || 'QRIS',
      paymentStatus: 'Lunas',
      shippingCourier: 'Kasir Toko (Ambil Langsung)',
      trackingNumber: `STRUK-${transaction.id}`,
      items: transaction.items.map((i) => ({
        shoeName: i.name,
        brand: i.brand,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        price: i.price,
        image: i.image || '👟',
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // 3. Sync customer points & LTV if member exists
    if (transaction.customerName && transaction.customerName !== 'Pelanggan Walk-In') {
      setCustomers((prev) =>
        prev.map((c) => {
          if (
            c.name.toLowerCase() === transaction.customerName.toLowerCase() ||
            (transaction.customerPhone && c.phone === transaction.customerPhone)
          ) {
            const newTotalSpent = c.totalSpent + transaction.total;
            const newOrders = c.totalOrders + 1;
            const pointsEarned = Math.round(transaction.total / 10000);
            let newTier = c.tier;
            if (newTotalSpent >= 10000000) newTier = 'Sneakerhead VIP';
            else if (newTotalSpent >= 4000000) newTier = 'Gold Vault';
            else if (newTotalSpent >= 1500000) newTier = 'Silver Collector';

            return {
              ...c,
              totalSpent: newTotalSpent,
              totalOrders: newOrders,
              points: c.points + pointsEarned,
              tier: newTier,
              lastPurchaseDate: 'Hari Ini',
            };
          }
          return c;
        })
      );
    }

    // 4. Trigger receipt modal and toast
    setLastTransaction(transaction);
    setIsReceiptOpen(true);
    showToast(`Transaksi kasir ${transaction.id} berhasil dicatat & stok terpotong!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in-50 slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setIsOpenMobile(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* Dashboard Main Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Welcome Banner / Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Pantauan Penjualan & Toko Sepatu
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Kasir
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Kelola penjualan ritel, kasir POS toko fisik, pantau pembayaran, dan kontrol stok sepatu Anda.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setActiveTab('pos')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-200"
              >
                <Receipt className="w-4 h-4" />
                <span>Buka Kasir POS</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Unduh Laporan (CSV)</span>
              </button>
            </div>
          </div>

          {/* Render based on active tab */}
          {activeTab === 'ringkasan' && (
            <>
              {/* 4 Stat Cards */}
              <section aria-label="Statistik Toko">
                <StatCards
                  stats={mockStats}
                  onFilterLowStock={() => setActiveTab('inventaris')}
                />
              </section>

              {/* Side-by-side widgets: Low Stock Alert & Popular Sizes */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <LowStockWidget
                    lowStockItems={dynamicLowStock}
                    onRestockItem={handleQuickRestock}
                  />
                </div>
                <div className="lg:col-span-5">
                  <PopularSizesWidget />
                </div>
              </div>

              {/* Recent Orders Table */}
              <section aria-label="Tabel Pesanan">
                <RecentOrdersTable
                  orders={orders}
                  onSelectOrder={(order) => setSelectedOrder(order)}
                  searchFilter={searchQuery}
                />
              </section>
            </>
          )}

          {activeTab === 'pos' && (
            <PosModule
              products={products}
              onCompleteTransaction={handleCompletePosTransaction}
            />
          )}

          {activeTab === 'pesanan' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Manajemen Semua Pesanan</h2>
                  <p className="text-xs text-slate-500">
                    Daftar seluruh transaksi yang masuk dari kasir toko fisik, website, dan kurir.
                  </p>
                </div>
              </div>
              <RecentOrdersTable
                orders={orders}
                onSelectOrder={(order) => setSelectedOrder(order)}
                searchFilter={searchQuery}
              />
            </div>
          )}

          {activeTab === 'inventaris' && (
            <div className="space-y-6">
              {/* Full Interactive Inventory Table */}
              <InventoryTable
                products={products}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onSelectProductForEditStock={handleOpenEditStock}
                onDeleteProduct={handleDeleteProduct}
              />

              {/* Secondary widgets row for inventory context */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                <div className="lg:col-span-7">
                  <LowStockWidget
                    lowStockItems={dynamicLowStock}
                    onRestockItem={handleQuickRestock}
                  />
                </div>
                <div className="lg:col-span-5">
                  <PopularSizesWidget />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pelanggan' && (
            <CustomersModule
              customers={customers}
              orders={orders}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomerNotes={handleUpdateCustomerNotes}
            />
          )}

          {activeTab === 'pengaturan' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <SettingsIcon className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Pengaturan Toko Sepatu</h2>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Konfigurasi profil toko fisik, nomor WhatsApp kasir, dan rekening penerimaan.
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Toko Retail</label>
                  <input
                    type="text"
                    defaultValue="KICKSMATE - Sneakers & Footwear Vault"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kota / Cabang</label>
                    <input
                      type="text"
                      defaultValue="Bandung - Cabang Dago"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mata Uang</label>
                    <input
                      type="text"
                      defaultValue="IDR (Rupiah Rp)"
                      disabled
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-600"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <button
                    onClick={() => showToast('Pengaturan toko berhasil diperbarui')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-indigo-200"
                  >
                    Simpan Perubahan
                  </button>

                  <button
                    type="button"
                    onClick={handleResetDefaultData}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200/80 rounded-xl font-semibold transition-all text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Data ke Awal (Hapus Cache)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/* Edit Stock Modal */}
      <EditStockModal
        product={selectedProductForStock}
        isOpen={isEditStockOpen}
        onClose={() => {
          setIsEditStockOpen(false);
          setSelectedProductForStock(null);
        }}
        onSaveStock={handleSaveStock}
      />

      {/* POS Receipt Modal */}
      <ReceiptModal
        transaction={lastTransaction}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onNewTransaction={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
