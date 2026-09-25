'use client';

import React, { useState, useMemo } from 'react';
import { Order, ShoeProduct } from '@/types';
import ShoeImage from '@/components/ShoeImage';
import { formatCurrency } from '@/utils/formatters';
import {
  TrendingUp,
  DollarSign,
  Package,
  Layers,
  Percent,
  Download,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  PieChart,
  BarChart3,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface FinancialAnalyticsModuleProps {
  orders: Order[];
  products: ShoeProduct[];
}

export default function FinancialAnalyticsModule({
  orders,
  products,
}: FinancialAnalyticsModuleProps) {
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  // Helper dictionary lookup for product cost & category by name or brand
  const productLookup = useMemo(() => {
    const map = new Map<string, ShoeProduct>();
    products.forEach((p) => {
      map.set(p.name.toLowerCase(), p);
      map.set(p.id.toLowerCase(), p);
    });
    return map;
  }, [products]);

  // Filter orders by time period
  const filteredOrders = useMemo(() => {
    if (timeFilter === 'all') return orders;
    // For mock purpose with 2026 data:
    // month = Sep 2026
    if (timeFilter === 'month') {
      return orders.filter(
        (o) => o.orderDate.includes('Sep 2026') || o.orderDate.includes('2026-09')
      );
    }
    // week = recent 7 days (dates between 18-25 Sep 2026)
    if (timeFilter === 'week') {
      return orders.filter((o) => {
        const d = o.orderDate;
        return (
          d.includes('25 Sep') ||
          d.includes('24 Sep') ||
          d.includes('23 Sep') ||
          d.includes('22 Sep') ||
          d.includes('21 Sep') ||
          d.includes('20 Sep') ||
          d.includes('19 Sep')
        );
      });
    }
    return orders;
  }, [orders, timeFilter]);

  // Aggregate Financial Metrics
  const financials = useMemo(() => {
    let totalRevenue = 0;
    let totalCOGS = 0; // Cost of Goods Sold (Wholesale Cost)
    let totalPairsSold = 0;

    // Brand performance map
    const brandMap = new Map<
      string,
      {
        brand: string;
        pairsSold: number;
        revenue: number;
        cogs: number;
        profit: number;
        margin: number;
      }
    >();

    // Category performance map
    const categoryMap = new Map<
      string,
      {
        category: string;
        pairsSold: number;
        revenue: number;
        cogs: number;
        profit: number;
      }
    >();

    filteredOrders.forEach((order) => {
      // Only calculate paid orders
      if (order.paymentStatus === 'Paid') {
        order.items.forEach((item) => {
          const matchedProd =
            productLookup.get(item.shoeName.toLowerCase()) ||
            products.find((p) => p.brand.toLowerCase() === item.brand.toLowerCase());

          // Cost price per item
          const costPrice = matchedProd ? matchedProd.costPrice : Math.round(item.price * 0.65);
          const category = matchedProd ? matchedProd.category : 'Sneakers';
          const itemRevenue = item.price * item.quantity;
          const itemCost = costPrice * item.quantity;

          totalRevenue += itemRevenue;
          totalCOGS += itemCost;
          totalPairsSold += item.quantity;

          // Aggregate by Brand
          const existingBrand = brandMap.get(item.brand) || {
            brand: item.brand,
            pairsSold: 0,
            revenue: 0,
            cogs: 0,
            profit: 0,
            margin: 0,
          };
          existingBrand.pairsSold += item.quantity;
          existingBrand.revenue += itemRevenue;
          existingBrand.cogs += itemCost;
          existingBrand.profit = existingBrand.revenue - existingBrand.cogs;
          existingBrand.margin =
            existingBrand.revenue > 0
              ? (existingBrand.profit / existingBrand.revenue) * 100
              : 0;
          brandMap.set(item.brand, existingBrand);

          // Aggregate by Category
          const existingCat = categoryMap.get(category) || {
            category,
            pairsSold: 0,
            revenue: 0,
            cogs: 0,
            profit: 0,
          };
          existingCat.pairsSold += item.quantity;
          existingCat.revenue += itemRevenue;
          existingCat.cogs += itemCost;
          existingCat.profit = existingCat.revenue - existingCat.cogs;
          categoryMap.set(category, existingCat);
        });
      }
    });

    const grossProfit = totalRevenue - totalCOGS;
    const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Inventory Valuation (Capital tied up in vault)
    const inventoryAssetValue = products.reduce((acc, p) => acc + p.costPrice * p.totalStock, 0);
    const inventoryRetailValue = products.reduce((acc, p) => acc + p.price * p.totalStock, 0);
    const totalStockPairs = products.reduce((acc, p) => acc + p.totalStock, 0);

    return {
      totalRevenue,
      totalCOGS,
      grossProfit,
      grossMarginPercent,
      totalPairsSold,
      inventoryAssetValue,
      inventoryRetailValue,
      totalStockPairs,
      brandStats: Array.from(brandMap.values()).sort((a, b) => b.profit - a.profit),
      categoryStats: Array.from(categoryMap.values()).sort((a, b) => b.revenue - a.revenue),
    };
  }, [filteredOrders, products, productLookup]);

  // Slow Moving / High Capital Tied Up Shoes
  const capitalTiedUpShoes = useMemo(() => {
    return products
      .map((p) => ({
        ...p,
        tiedUpCapital: p.costPrice * p.totalStock,
      }))
      .filter((p) => p.totalStock > 0)
      .sort((a, b) => b.tiedUpCapital - a.tiedUpCapital)
      .slice(0, 5);
  }, [products]);

  // Export Financial CSV
  const handleExportFinancialCsv = () => {
    const headers = [
      'Footwear Brand',
      'Pairs Sold',
      'Gross Revenue ($)',
      'Total COGS / Wholesale ($)',
      'Gross Profit ($)',
      'Gross Margin (%)',
    ];

    const rows = financials.brandStats.map((b) => [
      `"${b.brand}"`,
      b.pairsSold,
      b.revenue,
      b.cogs,
      b.profit,
      `${b.margin.toFixed(1)}%`,
    ]);

    const summaryRows = [
      '',
      'STORE FINANCIAL P&L SUMMARY',
      `"Gross Revenue: ${formatCurrency(financials.totalRevenue)}"`,
      `"Total Cost of Goods Sold (COGS): ${formatCurrency(financials.totalCOGS)}"`,
      `"Realized Gross Profit: ${formatCurrency(financials.grossProfit)}"`,
      `"Blended Margin: ${financials.grossMarginPercent.toFixed(1)}%"`,
      `"Warehouse Inventory Capital: ${formatCurrency(financials.inventoryAssetValue)}"`,
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(',')), '', ...summaryRows].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `profit-and-loss-report-kicksmate-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-base tracking-tight">
                Gross Profit & Margin Analytics
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                Gross Profit Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time gross margin analytics based on footwear COGS, wholesale buy-ins, and brand performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Filter Range */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeFilter === 'all' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeFilter === 'month' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeFilter === 'week' ? 'bg-white text-indigo-600 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              Past 7 Days
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportFinancialCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export P&L (CSV)</span>
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Gross Sales Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
              {formatCurrency(financials.totalRevenue)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span>{financials.totalPairsSold} footwear pairs sold</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
        </div>

        {/* Card 2: COGS / Total Modal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cost of Goods Sold (COGS)
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
              {formatCurrency(financials.totalCOGS)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span>Wholesale acquisition cost</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
        </div>

        {/* Card 3: Gross Profit & Margin % */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Realized Gross Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl font-black text-emerald-700 font-mono tracking-tight tabular-nums">
              {formatCurrency(financials.grossProfit)}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-mono">
                {financials.grossMarginPercent.toFixed(1)}% MARGIN
              </span>
              <span className="text-[11px] text-slate-500">blended retail return</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Card 4: Inventory Asset Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Warehouse Inventory Capital
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight tabular-nums">
              {formatCurrency(financials.inventoryAssetValue)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>{financials.totalStockPairs} pairs on-hand</span>
              <span className="text-slate-400 font-mono text-[10px]">
                Retail: {formatCurrency(financials.inventoryRetailValue)}
              </span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>
      </div>

      {/* Main Analysis Section: Brand Profitability Matrix & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Brand Profitability Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Brand Profitability & Margin Matrix
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Profit margin benchmarks and revenue contribution by footwear manufacturer.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 font-mono">
              {financials.brandStats.length} Active Brands
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-3 text-center">Pairs Sold</th>
                  <th className="py-3 px-3 text-right">Revenue</th>
                  <th className="py-3 px-3 text-right">Wholesale (COGS)</th>
                  <th className="py-3 px-3 text-right">Gross Profit</th>
                  <th className="py-3 px-4 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financials.brandStats.map((brandStat, idx) => {
                  const profitRatio =
                    financials.grossProfit > 0
                      ? Math.min(100, Math.round((brandStat.profit / financials.grossProfit) * 100))
                      : 0;

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 text-slate-400 font-mono text-[11px] font-bold">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{brandStat.brand}</p>
                            <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                              <div
                                className="bg-indigo-600 h-full rounded-full"
                                style={{ width: `${profitRatio}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-semibold text-slate-700">
                        {brandStat.pairsSold} prs
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-800 tabular-nums">
                        {formatCurrency(brandStat.revenue)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-500 tabular-nums">
                        {formatCurrency(brandStat.cogs)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600 tabular-nums">
                        +{formatCurrency(brandStat.profit)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                            brandStat.margin >= 35
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : brandStat.margin >= 25
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {brandStat.margin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {financials.brandStats.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                      No sales transactions recorded for the selected date range.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown & Insights (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category Share Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Category Distribution</h3>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">By Gross Revenue</span>
            </div>

            <div className="space-y-3">
              {financials.categoryStats.map((cat, idx) => {
                const percentage =
                  financials.totalRevenue > 0
                    ? Math.round((cat.revenue / financials.totalRevenue) * 100)
                    : 0;

                const colors = [
                  'bg-indigo-600 text-indigo-600',
                  'bg-emerald-600 text-emerald-600',
                  'bg-amber-500 text-amber-500',
                  'bg-purple-600 text-purple-600',
                ];
                const activeColor = colors[idx % colors.length];

                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-800">{cat.category}</span>
                      <span className="font-mono text-slate-900 tabular-nums">
                        {percentage}% ({formatCurrency(cat.revenue)})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${activeColor.split(' ')[0]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{cat.pairsSold} pairs sold</span>
                      <span className="text-emerald-600 font-semibold">
                        Profit: {formatCurrency(cat.profit)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Business Health Tip */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50/40 border border-indigo-100 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Senior Retail Advisory</span>
            </div>
            <p className="text-indigo-800/80 leading-relaxed text-[11px]">
              Footwear boutiques maintaining a gross margin above <strong>30%</strong> remain comfortably solvent against commercial lease and retail staff payroll. Maintain steady flow in high-turnover models to ensure swift working capital velocity.
            </p>
          </div>
        </div>
      </div>

      {/* Dead Stock / High Capital Tied Up Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Highest Capital Tied-Up in Vault (Slow-Moving Risk)
              </h3>
              <p className="text-xs text-slate-500">
                Footwear models holding the largest balance sheet cost currently idle in backroom inventory.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Liquidity Watchlist
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-4">Sneaker Model</th>
                <th className="py-3 px-3">Brand</th>
                <th className="py-3 px-3 text-right">Unit Cost</th>
                <th className="py-3 px-3 text-right">Retail Price</th>
                <th className="py-3 px-3 text-center">Stock On-Hand</th>
                <th className="py-3 px-4 text-right">Total Capital Tied-Up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {capitalTiedUpShoes.map((shoe) => (
                <tr key={shoe.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <ShoeImage
                          src={shoe.image}
                          alt={shoe.name}
                          brand={shoe.brand}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs leading-tight">{shoe.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{shoe.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-700">{shoe.brand}</span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-600 tabular-nums">
                    {formatCurrency(shoe.costPrice)}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(shoe.price)}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-100 text-slate-800">
                      {shoe.totalStock} prs
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-rose-600 tabular-nums text-xs">
                    {formatCurrency(shoe.tiedUpCapital)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
