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
import ShoeBoxLabelModal from '@/components/ShoeBoxLabelModal';
import InventoryTable from '@/components/InventoryTable';
import PosModule from '@/components/PosModule';
import ReceiptModal from '@/components/ReceiptModal';
import CustomersModule from '@/components/CustomersModule';
import SettingsModule from '@/components/SettingsModule';
import FinancialAnalyticsModule from '@/components/FinancialAnalyticsModule';
import PwaOfflineManager from '@/components/PwaOfflineManager';
import SalesRevenueTrendChart from '@/components/SalesRevenueTrendChart';
import CommandPaletteModal from '@/components/CommandPaletteModal';
import BranchSwitcherModal, { StoreBranch, STORE_BRANCHES } from '@/components/BranchSwitcherModal';
import DropsModule from '@/components/DropsModule';
import { mockStats, mockOrders, mockProducts, mockCustomers, defaultStoreSettings, mockSneakerDrops, mockStockTransfers } from '@/data/mockData';
import { Order, PaymentStatus, ShoeProduct, LowStockShoe, PosTransaction, Customer, StoreSettings, SneakerDrop, StockTransfer } from '@/types';
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
  
  // Dynamic State for Orders, Inventory, Customers, and Settings
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [products, setProducts] = useState<ShoeProduct[]>(mockProducts);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [offlineQueue, setOfflineQueue] = useState<PosTransaction[]>([]);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedProductForStock, setSelectedProductForStock] = useState<ShoeProduct | null>(null);
  const [isEditStockOpen, setIsEditStockOpen] = useState<boolean>(false);
  const [selectedProductForLabel, setSelectedProductForLabel] = useState<ShoeProduct | null>(null);
  
  // POS Receipt modal state
  const [lastTransaction, setLastTransaction] = useState<PosTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [currentBranch, setCurrentBranch] = useState<StoreBranch>(STORE_BRANCHES[0]);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(false);
  const [drops, setDrops] = useState<SneakerDrop[]>(mockSneakerDrops);
  const [transfers, setTransfers] = useState<StockTransfer[]>(mockStockTransfers);

  // Global ⌘K Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      const currentVersion = localStorage.getItem('kicksmate_version');
      if (currentVersion !== '2.0.0') {
        // Clear legacy IDR/Indonesian schema cache to prevent hydration crashes
        localStorage.removeItem('kicksmate_products');
        localStorage.removeItem('kicksmate_orders');
        localStorage.removeItem('kicksmate_customers');
        localStorage.removeItem('kicksmate_settings');
        localStorage.setItem('kicksmate_version', '2.0.0');
        setProducts(mockProducts);
        setOrders(mockOrders);
        setCustomers(mockCustomers);
        setSettings(defaultStoreSettings);
      } else {
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
        const savedSettings = localStorage.getItem('kicksmate_settings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      }
      const savedOfflineQueue = localStorage.getItem('kicksmate_offline_queue');
      if (savedOfflineQueue) {
        setOfflineQueue(JSON.parse(savedOfflineQueue));
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

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('kicksmate_settings', JSON.stringify(settings));
      } catch (e) {
        console.error(e);
      }
    }
  }, [settings, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem('kicksmate_offline_queue', JSON.stringify(offlineQueue));
      } catch (e) {
        console.error(e);
      }
    }
  }, [offlineQueue, isHydrated]);

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
    showToast(`Order ${orderId} status updated to "${newStatus}"`);
  };

  // Product Add handler
  const handleAddProduct = (newProduct: ShoeProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Sneaker model "${newProduct.name}" added to inventory!`);
  };

  // Product Delete handler
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Sneaker model removed from inventory');
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
    showToast('Footwear stock levels successfully updated');
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
    showToast(`Restocked +5 pairs successfully for EUR size ${size}`);
  };

  // Real CSV Export
  const handleExportCsv = () => {
    const headers = [
      'Order ID',
      'Date',
      'Customer',
      'City / Region',
      'Payment Method',
      'Payment Status',
      'Fulfillment / Courier',
      'Item Breakdown',
      'Total Amount ($)',
    ];

    const rows = orders.map((o) => {
      const itemsDetail = o.items
        .map((it) => `${it.shoeName} (EUR ${it.size} x${it.quantity})`)
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
    link.setAttribute('download', `kicksmate-sales-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Sales report CSV successfully downloaded!');
  };

  // Reset to default
  const handleResetDefaultData = () => {
    if (confirm('Reset all store data back to default factory settings (clears local storage)?')) {
      localStorage.removeItem('kicksmate_products');
      localStorage.removeItem('kicksmate_orders');
      localStorage.removeItem('kicksmate_customers');
      localStorage.removeItem('kicksmate_settings');
      localStorage.setItem('kicksmate_version', '2.0.0');
      setProducts(mockProducts);
      setOrders(mockOrders);
      setCustomers(mockCustomers);
      setSettings(defaultStoreSettings);
      showToast('All store data reset to factory default!');
    }
  };

  // Settings Save Handler
  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    showToast('Store settings and thermal receipt template saved!');
  };

  // Customer Management Handlers
  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`Customer "${newCustomer.name}" successfully registered as VIP member!`);
  };

  const handleUpdateCustomerNotes = (customerId: string, notes: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, notes } : c))
    );
    showToast('Customer notes updated!');
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
      'Cash': 'Cash',
      'Apple Pay': 'Apple Pay',
      'Credit Card': 'Credit Card',
      'Stripe Terminal': 'Stripe Terminal',
    };

    const newOrder: Order = {
      id: transaction.id,
      customerName: transaction.customerName,
      customerEmail: transaction.customerPhone
        ? `${transaction.customerPhone}@pos.local`
        : 'in-store@kicksmate.com',
      customerPhone: transaction.customerPhone || '+1 (212) 555-0199',
      customerCity: 'New York (In-Store POS)',
      orderDate: transaction.date,
      totalAmount: transaction.total,
      paymentMethod: paymentMethodMap[transaction.paymentMethod] || 'Cash',
      paymentStatus: 'Paid',
      shippingCourier: 'Boutique POS (Direct Handover)',
      trackingNumber: `RCPT-${transaction.id}`,
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
    if (transaction.customerName && transaction.customerName !== 'Walk-in Customer') {
      setCustomers((prev) =>
        prev.map((c) => {
          if (
            c.name.toLowerCase() === transaction.customerName.toLowerCase() ||
            (transaction.customerPhone && c.phone === transaction.customerPhone)
          ) {
            const newTotalSpent = c.totalSpent + transaction.total;
            const newOrders = c.totalOrders + 1;
            const pointsEarned = Math.round(transaction.total * 1);
            let newTier = c.tier;
            if (newTotalSpent >= 2500) newTier = 'Sneakerhead VIP';
            else if (newTotalSpent >= 1200) newTier = 'Gold Vault';
            else if (newTotalSpent >= 500) newTier = 'Silver Collector';

            return {
              ...c,
              totalSpent: newTotalSpent,
              totalOrders: newOrders,
              points: c.points + pointsEarned,
              tier: newTier,
              lastPurchaseDate: 'Today',
            };
          }
          return c;
        })
      );
    }

    // 4. Handle Offline Queue vs Online Cloud Sync
    const isCurrentlyOffline = isSimulatedOffline || (typeof navigator !== 'undefined' && !navigator.onLine);
    if (isCurrentlyOffline) {
      setOfflineQueue((prev) => [transaction, ...prev]);
      showToast(`Offline Mode: Transaction ${transaction.id} saved in local queue!`);
    } else {
      showToast(`POS Checkout ${transaction.id} processed & inventory updated!`);
    }

    // 5. Trigger receipt modal
    setLastTransaction(transaction);
    setIsReceiptOpen(true);
  };

  // Sync Offline Queue to Cloud
  const handleSyncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    const count = offlineQueue.length;
    setOfflineQueue([]);
    try {
      localStorage.removeItem('kicksmate_offline_queue');
    } catch (e) {
      console.error(e);
    }
    showToast(`Success! ${count} offline POS transactions synchronized to cloud.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* PWA & Offline Connection Manager */}
      <PwaOfflineManager
        isSimulatedOffline={isSimulatedOffline}
        onToggleSimulateOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
        pendingOfflineCount={offlineQueue.length}
        onSyncOfflineQueue={handleSyncOfflineQueue}
      />

      <div className="flex-1 flex">
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
          currentBranch={currentBranch}
          onOpenBranchSwitcher={() => setIsBranchModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
          {/* Top Header */}
          <Header
            onOpenMobileMenu={() => setIsOpenMobile(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            isOffline={isSimulatedOffline}
            onToggleOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
            pendingOfflineCount={offlineQueue.length}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

        {/* Dashboard Main Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Welcome Banner / Overview Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Footwear Retail & Sneaker Vault Operations
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live POS Terminal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Manage retail sales, in-store POS checkouts, real-time inventory matrix, and profit margins.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => setActiveTab('pos')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-200"
              >
                <Receipt className="w-4 h-4" />
                <span>Launch POS Terminal</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Export CSV Report</span>
              </button>
            </div>
          </div>

          {/* Render based on active tab */}
          {activeTab === 'ringkasan' && (
            <>
              {/* 4 Stat Cards */}
              <section aria-label="Store Performance KPIs">
                <StatCards
                  stats={mockStats}
                  onFilterLowStock={() => setActiveTab('inventaris')}
                />
              </section>

              {/* Interactive 7-Day Revenue & Footfall Curve Chart */}
              <section aria-label="Omnichannel Velocity Curve">
                <SalesRevenueTrendChart />
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
              <section aria-label="Recent Orders Table">
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
                  <h2 className="text-lg font-bold text-slate-900">Order Management & Fulfillment</h2>
                  <p className="text-xs text-slate-500">
                    Comprehensive log of omnichannel transactions across in-store POS, boutique vault, and digital channels.
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
                onPrintLabel={(product) => setSelectedProductForLabel(product)}
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

          {activeTab === 'drops' && (
            <DropsModule
              drops={drops}
              onUpdateDrops={setDrops}
              transfers={transfers}
              onUpdateTransfers={setTransfers}
              products={products}
              showToast={showToast}
            />
          )}

          {activeTab === 'analitik' && (
            <FinancialAnalyticsModule
              orders={orders}
              products={products}
            />
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
            <SettingsModule
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onResetData={handleResetDefaultData}
            />
          )}
        </main>
      </div>
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
        settings={settings}
      />

      {/* Shoe Box Label Modal */}
      <ShoeBoxLabelModal
        product={selectedProductForLabel}
        isOpen={!!selectedProductForLabel}
        onClose={() => setSelectedProductForLabel(null)}
      />

      {/* Global Command Palette ⌘K Modal */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        products={products}
        orders={orders}
        customers={customers}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onOpenAddModal={() => {
          setIsAddModalOpen(true);
          setIsCommandPaletteOpen(false);
        }}
        onExportCsv={handleExportCsv}
      />

      {/* Omnichannel Multi-Store Branch Switcher */}
      <BranchSwitcherModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        selectedBranchId={currentBranch.id}
        onSelectBranch={(branch) => {
          setCurrentBranch(branch);
          showToast(`Active branch switched to ${branch.name} (${branch.city})`);
        }}
      />
    </div>
  );
}
