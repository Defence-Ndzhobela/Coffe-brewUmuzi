import React from 'react';
import { Brew, MethodFilterType } from '../types';
import { BrewCard } from './BrewCard';
import { Coffee, SearchX, Plus } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

interface BrewListProps {
  brews: Brew[];
  selectedMethod: MethodFilterType;
  onEditBrew: (brew: Brew) => void;
  onDeleteBrew: (brew: Brew) => void;
  onAddClick: () => void;
}

export const BrewList: React.FC<BrewListProps> = ({
  brews,
  selectedMethod,
  onEditBrew,
  onDeleteBrew,
  onAddClick,
}) => {
  if (brews.length === 0) {
    return (
      <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 my-6">
        <div className="inline-flex p-4 bg-amber-100/70 text-amber-900 rounded-2xl mb-1">
          {selectedMethod === 'All methods' ? (
            <Coffee className="w-8 h-8" />
          ) : (
            <SearchX className="w-8 h-8" />
          )}
        </div>

        <div className="space-y-1.5 max-w-sm mx-auto">
          <h3 className="text-lg font-bold text-stone-900">
            {selectedMethod === 'All methods'
              ? 'No brew records yet'
              : `No brews found for "${selectedMethod}"`}
          </h3>
          <p className="text-sm text-stone-500 leading-relaxed">
            {selectedMethod === 'All methods'
              ? 'Start logging your coffee brewing recipes, ratios, ratings, and tasting notes!'
              : `You haven't logged any brews prepared with ${selectedMethod}. Try selecting another filter or add a new brew.`}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add a brew</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
      <AnimatePresence mode="popLayout">
        {brews.map((brew) => (
          <BrewCard
            key={brew.id}
            brew={brew}
            onEdit={onEditBrew}
            onDelete={onDeleteBrew}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
