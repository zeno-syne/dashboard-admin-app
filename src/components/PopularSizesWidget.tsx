'use client';

import React from 'react';
import { mockPopularSizes } from '@/data/mockData';
import { Ruler, Sparkles } from 'lucide-react';

export default function PopularSizesWidget() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top-Selling Footwear Sizes</h3>
              <p className="text-[11px] text-slate-400">Monthly customer size demand curve</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Trend
          </span>
        </div>

        {/* Size Progress Bars */}
        <div className="space-y-3.5 my-4">
          {mockPopularSizes.map((item) => (
            <div key={item.size} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  Size EUR {item.size}{' '}
                  <span className="text-[11px] font-normal text-slate-400">
                    ({item.count})
                  </span>
                </span>
                <span className="font-bold text-indigo-600 font-mono">{item.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick insight callout */}
      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50/70 to-slate-50 border border-indigo-100/70 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-semibold text-slate-900">Restock Recommendation</p>
          <p className="text-slate-500 text-[11px] mt-0.5">
            Sizes 41 & 42 generate 65% of checkout transactions. Prioritize procurement allocations for these two sizes.
          </p>
        </div>
      </div>
    </div>
  );
}
