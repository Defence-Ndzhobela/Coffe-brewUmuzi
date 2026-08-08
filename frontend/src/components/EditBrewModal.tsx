import React, { useEffect } from 'react';
import { Brew, BrewFormData } from '../types';
import { BrewForm } from './BrewForm';
import { X, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditBrewModalProps {
  isOpen: boolean;
  brew: Brew | null;
  onClose: () => void;
  onUpdateBrew: (id: string, formData: BrewFormData) => void;
  onDeleteBrew: (brew: Brew) => void;
}

export const EditBrewModal: React.FC<EditBrewModalProps> = ({
  isOpen,
  brew,
  onClose,
  onUpdateBrew,
  onDeleteBrew,
}) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !brew) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-3xl shadow-xl border border-stone-200 w-full max-w-lg p-6 sm:p-8 z-10 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">
                  Edit a brew
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  {brew.beans}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  onDeleteBrew(brew);
                }}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-800 transition-colors focus:outline-none cursor-pointer"
                title="Delete this brew"
                aria-label="Delete brew"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="overflow-y-auto pr-1">
            <BrewForm
              initialData={{
                beans: brew.beans,
                method: brew.method,
                coffeeGrams: brew.coffeeGrams,
                waterGrams: brew.waterGrams,
                rating: brew.rating,
                tastingNotes: brew.tastingNotes,
              }}
              onSubmit={(formData) => {
                onUpdateBrew(brew.id, formData);
                onClose();
              }}
              onCancel={onClose}
              submitLabel="Save Changes"
              isEditing={true}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
