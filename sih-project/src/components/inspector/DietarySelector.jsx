import React from 'react';
import VegNonVegBadge from '../common/VegNonVegBadge';

/**
 * Dietary Category Selector Bar
 * Allows inspectors to filter or manually declare the product's
 * food classification for Veg / Non-Veg statutory logo verification.
 *
 * @param {'ALL' | 'VEG' | 'NON_VEG' | 'NON_FOOD'} selectedCategory
 * @param {function} onChangeCategory
 */
export default function DietarySelector({ selectedCategory = 'ALL', onChangeCategory }) {
  const options = [
    { id: 'ALL',      label: 'All Items' },
    { id: 'VEG',      label: 'Vegetarian', badge: 'VEG' },
    { id: 'NON_VEG',  label: 'Non-Veg',    badge: 'NON_VEG' },
    { id: 'NON_FOOD', label: 'Non-Food',   badge: 'NON_FOOD' },
  ];

  return (
    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
      <span className="text-xs text-slate-500 font-semibold pl-2 pr-1 hidden sm:inline">
        Category:
      </span>

      {options.map((opt) => {
        const isActive = selectedCategory === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChangeCategory(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              isActive
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
            }`}
          >
            {opt.badge && (
              <VegNonVegBadge type={opt.badge} size="sm" showLabel={false} />
            )}
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
