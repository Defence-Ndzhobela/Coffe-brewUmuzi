import React, { useState, useEffect } from 'react';
import { BrewFormData, BrewMethod, ValidationErrors } from '../types';
import { Rating } from './Rating';
import { Scale, Droplets, Coffee, Sparkles, AlertCircle } from 'lucide-react';

interface BrewFormProps {
  initialData?: Partial<BrewFormData>;
  onSubmit: (formData: BrewFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
  isEditing?: boolean;
}

const METHODS: BrewMethod[] = [
  'Aeropress',
  'Drip coffee',
  'V60',
  'French Press',
  'Chemex',
];

export const BrewForm: React.FC<BrewFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  isEditing = false,
}) => {
  const [beans, setBeans] = useState(initialData?.beans || '');
  const [method, setMethod] = useState<BrewMethod>(
    initialData?.method || 'Aeropress'
  );
  const [coffeeGrams, setCoffeeGrams] = useState<string>(
    initialData?.coffeeGrams !== undefined ? String(initialData.coffeeGrams) : '15'
  );
  const [waterGrams, setWaterGrams] = useState<string>(
    initialData?.waterGrams !== undefined ? String(initialData.waterGrams) : '225'
  );
  const [rating, setRating] = useState<number>(
    initialData?.rating !== undefined ? initialData.rating : 3
  );
  const [tastingNotes, setTastingNotes] = useState(
    initialData?.tastingNotes || ''
  );

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time Brew Ratio Calculation
  const cGramsNum = parseFloat(coffeeGrams) || 0;
  const wGramsNum = parseFloat(waterGrams) || 0;
  const calculatedRatio =
    cGramsNum > 0 && wGramsNum > 0 ? (wGramsNum / cGramsNum).toFixed(1) : null;

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!beans.trim()) {
      newErrors.beans = 'Bean variety / roast name is required.';
    }

    if (!method) {
      newErrors.method = 'Brew method selection is required.';
    }

    if (!coffeeGrams || isNaN(cGramsNum) || cGramsNum <= 0) {
      newErrors.coffeeGrams = 'Coffee weight must be a positive number (e.g. 15).';
    }

    if (!waterGrams || isNaN(wGramsNum) || wGramsNum <= 0) {
      newErrors.waterGrams = 'Water weight must be a positive number (e.g. 200).';
    }

    if (rating < 0 || rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5.';
    }

    if (!tastingNotes.trim()) {
      newErrors.tastingNotes = 'Tasting notes are required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      beans: true,
      method: true,
      coffeeGrams: true,
      waterGrams: true,
      rating: true,
      tastingNotes: true,
    });

    if (validate()) {
      onSubmit({
        beans: beans.trim(),
        method,
        coffeeGrams: cGramsNum,
        waterGrams: wGramsNum,
        rating,
        tastingNotes: tastingNotes.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Top error summary alert if multiple errors exist */}
      {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 flex items-start gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Please check form errors:</span>
            <ul className="list-disc list-inside space-y-0.5 text-rose-700">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 1. Beans Field */}
      <div>
        <label htmlFor="beans" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
          Coffee Beans <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            id="beans"
            type="text"
            value={beans}
            onChange={(e) => {
              setBeans(e.target.value);
              if (errors.beans) setErrors((prev) => ({ ...prev, beans: undefined }));
            }}
            onBlur={() => setTouched((p) => ({ ...p, beans: true }))}
            placeholder="e.g. Ethiopian Yirgacheffe, Zimbabwean Highlands..."
            className={`w-full rounded-xl border ${
              errors.beans && touched.beans ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'
            } bg-stone-50 px-3.5 py-2.5 text-sm font-medium text-stone-900 placeholder-stone-400 focus:bg-white focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all`}
          />
        </div>
        {errors.beans && touched.beans && (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.beans}</p>
        )}
      </div>

      {/* 2. Method Dropdown */}
      <div>
        <label htmlFor="method" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
          Brew Method <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <select
            id="method"
            value={method}
            onChange={(e) => setMethod(e.target.value as BrewMethod)}
            className="w-full appearance-none rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2.5 text-sm font-medium text-stone-900 focus:bg-white focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all cursor-pointer"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
            <Coffee className="w-4 h-4 text-amber-800" />
          </div>
        </div>
      </div>

      {/* 3 & 4. Coffee Grams and Water Grams in 2 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="coffeeGrams" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center justify-between">
            <span>Coffee Grams (g) <span className="text-rose-500">*</span></span>
          </label>
          <div className="relative">
            <input
              id="coffeeGrams"
              type="number"
              step="0.5"
              min="1"
              value={coffeeGrams}
              onChange={(e) => {
                setCoffeeGrams(e.target.value);
                if (errors.coffeeGrams) setErrors((prev) => ({ ...prev, coffeeGrams: undefined }));
              }}
              onBlur={() => setTouched((p) => ({ ...p, coffeeGrams: true }))}
              placeholder="15"
              className={`w-full rounded-xl border ${
                errors.coffeeGrams && touched.coffeeGrams ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'
              } bg-stone-50 px-3.5 py-2.5 text-sm font-mono font-medium text-stone-900 focus:bg-white focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all`}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 font-mono text-xs">
              g
            </div>
          </div>
          {errors.coffeeGrams && touched.coffeeGrams && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.coffeeGrams}</p>
          )}
        </div>

        <div>
          <label htmlFor="waterGrams" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
            Water Grams (g) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              id="waterGrams"
              type="number"
              step="1"
              min="1"
              value={waterGrams}
              onChange={(e) => {
                setWaterGrams(e.target.value);
                if (errors.waterGrams) setErrors((prev) => ({ ...prev, waterGrams: undefined }));
              }}
              onBlur={() => setTouched((p) => ({ ...p, waterGrams: true }))}
              placeholder="200"
              className={`w-full rounded-xl border ${
                errors.waterGrams && touched.waterGrams ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'
              } bg-stone-50 px-3.5 py-2.5 text-sm font-mono font-medium text-stone-900 focus:bg-white focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all`}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 font-mono text-xs">
              g
            </div>
          </div>
          {errors.waterGrams && touched.waterGrams && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.waterGrams}</p>
          )}
        </div>
      </div>

      {/* Calculated Brew Ratio Badge */}
      {calculatedRatio && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-amber-950 font-medium">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Estimated Brew Ratio:
          </span>
          <span className="font-mono font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-md">
            1:{calculatedRatio}
          </span>
        </div>
      )}

      {/* 5. Rating Input */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
          Rating (0 to 5)
        </label>
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between">
          <Rating value={rating} onChange={(newVal) => setRating(newVal)} size="lg" />
          <span className="text-xs font-semibold text-stone-500">
            {rating === 0
              ? 'Unrated'
              : rating === 1
              ? 'Poor'
              : rating === 2
              ? 'Fair'
              : rating === 3
              ? 'Good'
              : rating === 4
              ? 'Very Good'
              : 'Outstanding!'}
          </span>
        </div>
      </div>

      {/* 6. Tasting Notes */}
      <div>
        <label htmlFor="tastingNotes" className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
          Tasting Notes <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="tastingNotes"
          rows={3}
          value={tastingNotes}
          onChange={(e) => {
            setTastingNotes(e.target.value);
            if (errors.tastingNotes) {
              setErrors((prev) => ({ ...prev, tastingNotes: undefined }));
            }
          }}
          onBlur={() => setTouched((p) => ({ ...p, tastingNotes: true }))}
          placeholder="e.g. Heavy body, soft finish, nutty aroma, floral acidity..."
          className={`w-full rounded-xl border ${
            errors.tastingNotes && touched.tastingNotes
              ? 'border-rose-500 ring-1 ring-rose-500'
              : 'border-stone-300'
          } bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none`}
        />
        {errors.tastingNotes && touched.tastingNotes && (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.tastingNotes}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-amber-700/50 cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
