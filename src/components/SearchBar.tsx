import React from 'react';
import { Search, X, Check } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  vegOnly: boolean;
  setVegOnly: (v: boolean) => void;
  totalResults: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  vegOnly,
  setVegOnly,
  totalResults,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-2">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        
        {/* Search Input Box */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sweet corn pizza, paneer sandwich, cold coffee..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-stone-200/90 text-stone-black text-xs sm:text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:border-forest shadow-sm transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Veg-Only Filter Button & Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition border shadow-sm ${
              vegOnly
                ? 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-500/20'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {/* Standard Green Veg Icon Indicator */}
            <span className="w-4 h-4 rounded-sm border border-emerald-600 flex items-center justify-center p-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            </span>
            <span>Veg Only</span>
            {vegOnly && <Check className="w-3.5 h-3.5 text-emerald-700" />}
          </button>

          <span className="text-xs text-stone-400 font-medium whitespace-nowrap pl-1">
            {totalResults} {totalResults === 1 ? 'item' : 'items'}
          </span>
        </div>

      </div>
    </div>
  );
};
