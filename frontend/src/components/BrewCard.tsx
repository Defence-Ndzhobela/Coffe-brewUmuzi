import React from 'react';
import { Brew } from '../types';
import { Rating } from './Rating';
import { Edit3, Trash2, Droplets, Scale, Coffee, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface BrewCardProps {
  brew: Brew;
  onEdit: (brew: Brew) => void;
  onDelete: (brew: Brew) => void;
}

const methodStyles: Record<string, { bg: string; text: string; border: string }> = {
  Aeropress: { bg: 'bg-amber-100/80', text: 'text-amber-900', border: 'border-amber-300' },
  'Drip coffee': { bg: 'bg-orange-100/80', text: 'text-orange-950', border: 'border-orange-300' },
  V60: { bg: 'bg-stone-200/80', text: 'text-stone-900', border: 'border-stone-300' },
  'French Press': { bg: 'bg-amber-900/10', text: 'text-amber-950', border: 'border-amber-900/20' },
  Chemex: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
};

export const BrewCard: React.FC<BrewCardProps> = ({ brew, onEdit, onDelete }) => {
  const methodStyle = methodStyles[brew.method] || {
    bg: 'bg-stone-100',
    text: 'text-stone-800',
    border: 'border-stone-200',
  };

  // Calculate brew ratio e.g., 200 / 15 = 13.3 -> 1:13.3
  const ratio = brew.coffeeGrams > 0 ? (brew.waterGrams / brew.coffeeGrams).toFixed(1) : '0';

  const formattedDate = brew.createdAt
    ? new Date(brew.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:border-amber-900/30"
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header: Beans Name and Method Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <h3 className="text-lg font-bold text-stone-900 truncate tracking-tight group-hover:text-amber-900 transition-colors">
              {brew.beans}
            </h3>
            {formattedDate && (
              <div className="flex items-center gap-1 text-xs text-stone-400 font-medium">
                <Clock className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${methodStyle.bg} ${methodStyle.text} ${methodStyle.border} shrink-0`}
          >
            <Coffee className="w-3 h-3 mr-1" />
            {brew.method}
          </span>
        </div>

        {/* Stats Grid: Coffee Grams, Water Grams, Ratio */}
        <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-100 text-center">
          <div className="flex flex-col items-center">
            <span className="text-2xs uppercase tracking-wider font-semibold text-stone-400 flex items-center gap-1">
              <Scale className="w-3 h-3 text-amber-700" /> Coffee
            </span>
            <span className="text-sm font-bold font-mono text-stone-800 mt-0.5">
              {brew.coffeeGrams}g
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-stone-200/60 px-1">
            <span className="text-2xs uppercase tracking-wider font-semibold text-stone-400 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-sky-600" /> Water
            </span>
            <span className="text-sm font-bold font-mono text-stone-800 mt-0.5">
              {brew.waterGrams}g
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xs uppercase tracking-wider font-semibold text-stone-400">
              Ratio
            </span>
            <span className="text-sm font-bold font-mono text-amber-900 mt-0.5">
              1:{ratio}
            </span>
          </div>
        </div>

        {/* Rating Section */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Rating
          </span>
          <Rating value={brew.rating} readOnly size="sm" />
        </div>

        {/* Tasting Notes */}
        {brew.tastingNotes && (
          <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-3 text-xs text-amber-950 leading-relaxed italic">
            "{brew.tastingNotes}"
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="bg-stone-50/80 px-5 py-3 border-t border-stone-100 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(brew)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 hover:text-amber-900 hover:bg-amber-100/60 border border-stone-200 hover:border-amber-300 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
          aria-label={`Edit brew ${brew.beans}`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => onDelete(brew)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-stone-200 hover:border-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/40 cursor-pointer"
          aria-label={`Delete brew ${brew.beans}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </motion.div>
  );
};
