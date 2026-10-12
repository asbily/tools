import React from 'react';
import { Search, ShieldCheck, Zap, WifiOff } from 'lucide-react';
import { CATEGORIES } from '../data/toolsData';
import { ToolCategory } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  totalToolsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalToolsCount,
}) => {
  return (
    <div className="w-full max-w-full overflow-hidden py-10 sm:py-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0B0B0C] transition-colors">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6 w-full max-w-full overflow-hidden">
        {/* Brand Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{totalToolsCount}+ Essential Utilities · 100% Free Forever</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-neutral-100">
          Free Tools. Simple Solutions.
        </h1>

        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          High-performance online utilities designed for creators, developers, students, and businesses. Fully client-side, zero server tracking, instant and secure.
        </p>

        {/* Big Search Input */}
        <div className="max-w-xl mx-auto relative pt-2">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by tool name, format, or keyword (e.g. hashtag, json, pdf)..."
              className="w-full pl-12 pr-12 py-3.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white transition shadow-xs placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 text-xs text-neutral-400 hover:text-black dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-neutral-400 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Private (Runs in Browser)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Instant Zero-Latency Execution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-4 h-4 text-neutral-400" />
            <span>Installable PWA & Offline Support</span>
          </div>
        </div>

        {/* Category Horizontal Bar */}
        <div className="pt-4 flex items-center justify-start sm:justify-center overflow-x-auto gap-2 no-scrollbar py-2 max-w-full w-full px-1 touch-pan-x overscroll-x-contain">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white shadow-xs'
                  : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
