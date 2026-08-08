import React from 'react';
import { Coffee, RotateCcw, Plus } from 'lucide-react';

interface NavbarProps {
  onAddClick: () => void;
  onResetData: () => void;
  brewCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onAddClick,
  onResetData,
  brewCount,
}) => {
  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-700/90 text-amber-100 rounded-2xl shadow-inner border border-amber-600/40">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-stone-100 font-serif">
                Brew Log
              </h1>
              <span className="text-2xs font-mono font-semibold bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded-full border border-amber-700/50">
                v1.0
              </span>
            </div>
            <p className="text-2xs text-stone-400 font-medium hidden sm:block">
              Craft coffee extraction & recipe log
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
            title="Clear all brew records from database"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
            <span className="hidden md:inline">Clear Records</span>
          </button>

          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add brew</span>
          </button>
        </div>
      </div>
    </header>
  );
};
