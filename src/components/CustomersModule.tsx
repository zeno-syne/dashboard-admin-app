'use client';

import React, { useState, useMemo } from 'react';
import { Customer, CustomerTier, Order } from '@/types';
import CustomerDetailModal from '@/components/CustomerDetailModal';
import { formatCurrency } from '@/utils/formatters';
import {
  Users,
  Search,
  Plus,
  Star,
  Footprints,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Crown,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  MessageCircle,
  X,
  UserCheck,
} from 'lucide-react';

interface CustomersModuleProps {
  customers: Customer[];
  orders: Order[];
  onAddCustomer: (customer: Customer) => void;
  onUpdateCustomerNotes: (customerId: string, notes: string) => void;
}

export default function CustomersModule({
  customers,
  orders,
  onAddCustomer,
  onUpdateCustomerNotes,
}: CustomersModuleProps) {
  const [search, setSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('New York, NY');
  const [newTier, setNewTier] = useState<CustomerTier>('Bronze Member');
  const [newPreferredSize, setNewPreferredSize] = useState('42');
  const [newFavoriteBrand, setNewFavoriteBrand] = useState('Nike');

  // KPI Calculations
  const totalCustomersCount = customers.length;
  const totalLtv = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const avgLtv = totalCustomersCount > 0 ? Math.round(totalLtv / totalCustomersCount) : 0;
  const vipCount = customers.filter(
    (c) => c.tier === 'Sneakerhead VIP' || c.tier === 'Gold Vault'
  ).length;
  const totalPoints = customers.reduce((acc, c) => acc + c.points, 0);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchQuery =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.city.toLowerCase().includes(search.toLowerCase());

      const matchTier = selectedTier === 'All' || c.tier === selectedTier;
      const matchSize = selectedSize === 'All' || c.preferredSize.toString() === selectedSize;

      return matchQuery && matchTier && matchSize;
    });
  }, [customers, search, selectedTier, selectedSize]);

  const getTierBadge = (tier: CustomerTier) => {
    switch (tier) {
      case 'Sneakerhead VIP':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Gold Vault':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Silver Collector':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Bronze Member':
      default:
        return 'bg-orange-50 text-orange-700 border-orange-200/80';
    }
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCust: Customer = {
      id: `CUST-00${customers.length + 1}`,
      name: newName.trim(),
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: newPhone.trim(),
      city: newCity.trim(),
      tier: newTier,
      points: 100, // Welcome points
      totalSpent: 0,
      totalOrders: 0,
      preferredSize: parseInt(newPreferredSize, 10) || 42,
      favoriteBrand: newFavoriteBrand,
      joinedDate: 'Today',
      lastPurchaseDate: '-',
      notes: 'New member registered at retail terminal.',
    };

    onAddCustomer(newCust);
    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  return (
    <div className="space-y-6">
      {/* 4 Mini KPI Cards for Customer CRM */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Registered Members</p>
            <p className="text-lg font-extrabold text-slate-900">{totalCustomersCount} Collectors</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Average Customer LTV</p>
            <p className="text-base sm:text-lg font-extrabold text-slate-900 font-mono tabular-nums">
              {formatCurrency(avgLtv)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">VIP & Gold Tier</p>
            <p className="text-lg font-extrabold text-purple-700">{vipCount} VIP Members</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Loyalty Points</p>
            <p className="text-lg font-extrabold text-amber-600 font-mono tabular-nums">
              {totalPoints.toLocaleString('en-US')} Pts
            </p>
          </div>
        </div>
      </div>

      {/* Main CRM Toolbar & Filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Customer Relationship & VIP Vault</h2>
            <p className="text-xs text-slate-500">
              Manage global sneakerhead database, track shoe size profiles, and build personalized outreach.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Member</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name, phone number, email, or city..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-700 font-medium"
            >
              <option value="All">All Loyalty Tiers</option>
              <option value="Sneakerhead VIP">Sneakerhead VIP</option>
              <option value="Gold Vault">Gold Vault</option>
              <option value="Silver Collector">Silver Collector</option>
              <option value="Bronze Member">Bronze Member</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-700 font-medium"
            >
              <option value="All">All EUR Sizes</option>
              {[38, 39, 40, 41, 42, 43, 44].map((sz) => (
                <option key={sz} value={sz}>
                  Size EUR {sz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200/80 text-center text-slate-400">
            <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No collectors found</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Try adjusting search terms or clearing tier and size filters.
            </p>
          </div>
        ) : (
          filteredCustomers.map((c) => {
            const cleanPhone = c.phone.replace(/[^0-9]/g, '');
            const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${c.name}, greetings from KICKSMATE! We have a fresh sneaker arrival tailored for your EUR ${c.preferredSize} sizing.`
            )}`;

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Avatar & Tier Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-sm flex items-center justify-center shrink-0 shadow-xs border border-indigo-200/60">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors">
                          {c.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[140px]">{c.city}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${getTierBadge(
                        c.tier
                      )}`}
                    >
                      {c.tier}
                    </span>
                  </div>

                  {/* Footwear Specific Traits (Preferred Size & Favorite Brand) */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50/80 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                        Foot Size (EUR)
                      </span>
                      <span className="font-mono tabular-nums font-black text-indigo-600 text-xs inline-flex items-center gap-1 mt-0.5">
                        <Footprints className="w-3.5 h-3.5" />
                        EUR {c.preferredSize}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                        Favorite Brand
                      </span>
                      <span className="font-bold text-slate-800 text-xs truncate block mt-0.5">
                        {c.favoriteBrand}
                      </span>
                    </div>
                  </div>

                  {/* Financial LTV & Points */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Lifetime Spend</span>
                      <span className="font-mono tabular-nums font-extrabold text-slate-900">
                        {formatCurrency(c.totalSpent)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Reward Points</span>
                      <span className="font-mono tabular-nums font-bold text-amber-600 inline-flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {c.points} Pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions: WhatsApp & View Full History */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Send WhatsApp Message"
                    className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setSelectedCustomer(c)}
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>View Profile & History</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        orders={orders}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onUpdateNotes={onUpdateCustomerNotes}
      />

      {/* Add New Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Register New VIP Member</h3>
                  <p className="text-[11px] text-slate-400">Input collector profile & footwear sizing preferences</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone / Mobile <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="marcus@example.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="New York, NY"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Footwear Size (EUR)</label>
                  <select
                    value={newPreferredSize}
                    onChange={(e) => setNewPreferredSize(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 bg-white"
                  >
                    {[38, 39, 40, 41, 42, 43, 44].map((sz) => (
                      <option key={sz} value={sz}>
                        Size EUR {sz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Favorite Brand</label>
                  <select
                    value={newFavoriteBrand}
                    onChange={(e) => setNewFavoriteBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 bg-white"
                  >
                    <option value="Nike">Nike</option>
                    <option value="Air Jordan">Air Jordan</option>
                    <option value="Adidas">Adidas Originals</option>
                    <option value="New Balance">New Balance</option>
                    <option value="Asics">Asics</option>
                    <option value="Yeezy">Yeezy</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm shadow-indigo-200 cursor-pointer"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
