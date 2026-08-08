import React from 'react';
import { Brew } from '../types';
import { Coffee, Award, Scale, Droplets } from 'lucide-react';

interface StatsSummaryProps {
  brews: Brew[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ brews }) => {
  const totalBrews = brews.length;
  
  const avgRating = totalBrews > 0
    ? (brews.reduce((acc, b) => acc + b.rating, 0) / totalBrews).toFixed(1)
    : '0';

  const totalCoffee = brews.reduce((acc, b) => acc + (b.coffeeGrams || 0), 0);
  const totalWater = brews.reduce((acc, b) => acc + (b.waterGrams || 0), 0);

  // Determine top method
  const methodCounts: Record<string, number> = {};
  brews.forEach((b) => {
    methodCounts[b.method] = (methodCounts[b.method] || 0) + 1;
  });
  
  let topMethod = 'N/A';
  let maxCount = 0;
  Object.entries(methodCounts).forEach(([method, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topMethod = method;
    }
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 shrink-0">
          <Coffee className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xs uppercase tracking-wider font-semibold text-stone-400">Total Brews</p>
          <p className="text-lg font-bold font-mono text-stone-900">{totalBrews}</p>
        </div>
      </div>

      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xs uppercase tracking-wider font-semibold text-stone-400">Avg Rating</p>
          <p className="text-lg font-bold font-mono text-stone-900">{avgRating} / 5</p>
        </div>
      </div>

      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 shrink-0">
          <Scale className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-2xs uppercase tracking-wider font-semibold text-stone-400">Coffee Used</p>
          <p className="text-lg font-bold font-mono text-stone-900">{totalCoffee}g</p>
        </div>
      </div>

      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-900 shrink-0">
          <Droplets className="w-5 h-5 text-sky-700" />
        </div>
        <div className="min-w-0">
          <p className="text-2xs uppercase tracking-wider font-semibold text-stone-400">Favorite Method</p>
          <p className="text-sm font-bold text-stone-900 truncate">{topMethod}</p>
        </div>
      </div>
    </div>
  );
};
