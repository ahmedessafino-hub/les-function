import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { FunctionCategoryKey, FunctionLevel } from '../types/functions';

interface CategoryNavProps {
  selectedCategory: FunctionCategoryKey | 'all';
  onSelectCategory: (key: FunctionCategoryKey | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedLevel: FunctionLevel | 'all';
  onSelectLevel: (lvl: FunctionLevel | 'all') => void;
  totalCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedLevel,
  onSelectLevel,
  totalCount
}) => {
  return (
    <div id="categories" className="bg-slate-100/80 border-b border-slate-200 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher une fonction (ex: IF, CONCAT, ROUND, DATEDIFF, NULL, etc.)..."
              className="w-full pl-10 pr-9 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-transparent shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white p-1 rounded-lg border border-slate-200 shadow-2xs text-xs font-medium">
            <span className="text-slate-400 px-2 text-[11px] uppercase tracking-wider font-semibold">Niveau:</span>
            <button
              onClick={() => onSelectLevel('all')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedLevel === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({totalCount})
            </button>
            <button
              onClick={() => onSelectLevel('fundamental')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                selectedLevel === 'fundamental'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span>🟢</span> Fondamental
            </button>
            <button
              onClick={() => onSelectLevel('intermediate')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                selectedLevel === 'intermediate'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <span>🟡</span> Intermédiaire
            </button>
            <button
              onClick={() => onSelectLevel('advanced')}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                selectedLevel === 'advanced'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <span>🔴</span> Avancé
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scrolling Pill/Button Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            Toutes les catégories
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => onSelectCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-700 text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {cat.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
