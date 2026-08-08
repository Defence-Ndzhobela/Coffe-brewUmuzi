import React from 'react';
import { MethodFilterType } from '../types';
import { Filter, Coffee, Sparkles, Droplets, Flame, SlidersHorizontal } from 'lucide-react';

interface MethodFilterProps {
  selectedMethod: MethodFilterType;
  onChange: (method: MethodFilterType) => void;
  methodCounts?: Record<string, number>;
}

export const FILTER_OPTIONS: { label: MethodFilterType; icon?: React.ReactNode }[] = [
  { label: 'All methods' },
  { label: 'Aeropress' },
  { label: 'Drip coffee' },
  { label: 'V60' },
  { label: 'French Press' },
  { label: 'Chemex' },
];

export const MethodFilter: React.FC<MethodFilterProps> = ({
  selectedMethod,
  onChange,
  methodCounts = {},
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <label htmlFor="method-filter-select" className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 flex items-center gap-1.5 whitespace-nowrap">
        <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
        Filter by method:
      </label>

      <div className="relative w-full sm:w-64">
        <select
          id="method-filter-select"
          value={selectedMethod}
          onChange={(e) => onChange(e.target.value as MethodFilterType)}
          className="w-full appearance-none bg-stone-50 border border-amber-900/20 text-stone-900 font-medium text-sm rounded-xl px-3.5 py-2.5 pr-10 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-amber-600 transition-all cursor-pointer hover:bg-stone-100/80"
        >
          {FILTER_OPTIONS.map((opt) => {
            const count = opt.label === 'All methods' 
              ? (Object.values(methodCounts) as number[]).reduce((a, b) => a + b, 0)
              : methodCounts[opt.label] || 0;

            return (
              <option key={opt.label} value={opt.label}>
                {opt.label} {count > 0 ? `(${count})` : ''}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
          <Filter className="w-4 h-4 text-amber-800/60" />
        </div>
      </div>
    </div>
  );
};
