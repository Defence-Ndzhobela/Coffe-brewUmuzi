import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  onChange,
  readOnly = false,
  size = 'md',
  showNumber = true,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleStarClick = (index: number) => {
    if (!readOnly && onChange) {
      onChange(index);
    }
  };

  const currentDisplayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-1.5" role={readOnly ? 'img' : 'radiogroup'} aria-label={`Rating ${value} out of ${max}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const starIndex = i + 1;
          const isFilled = starIndex <= currentDisplayValue;

          return (
            <button
              key={i}
              type="button"
              disabled={readOnly}
              onClick={() => handleStarClick(starIndex)}
              onMouseEnter={() => !readOnly && setHoverValue(starIndex)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              className={`p-0.5 rounded transition-transform ${
                !readOnly ? 'hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50' : 'cursor-default'
              }`}
              aria-label={`Rate ${starIndex} out of ${max}`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-500 text-amber-500 drop-shadow-xs'
                    : 'fill-stone-200 text-stone-300'
                } transition-colors duration-150`}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className={`font-semibold font-mono text-stone-700 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          {value}/{max}
        </span>
      )}
    </div>
  );
};
