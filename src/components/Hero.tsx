import React from 'react';
import { Search, ShieldCheck, Zap, WifiOff, Sparkles, Flame, CheckCircle, ArrowLeft, ChevronRight, Grid } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import { ToolCategory } from '../types';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  totalToolsCount: number;
  onQuickToolClick?: (toolId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalToolsCount,
  onQuickToolClick,
}) => {
  // Count tools per category
  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return TOOLS.length;
    return TOOLS.filter((t) => t.category === catId).length;
  };

  const currentCategory = CATEGORIES.find((c) => c.id === selectedCategory);

  const popularShortcuts = [
    { id: 'product-payment-qr', label: 'Payment QR' },
    { id: 'hashtag-generator', label: 'Hashtag Generator' },
    { id: 'json-formatter', label: 'JSON Formatter' },
    { id: 'image-compressor', label: 'Image Compressor' },
    { id: 'qr-generator', label: 'QR Generator' },
  ];

  const isSpecificCategory = selectedCategory !== 'all' && currentCategory;

  return (
    <div className="relative w-full max-w-full overflow-hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0B0B0C] transition-colors py-10 sm:py-14">
      {/* Subtle modern dot-grid ambient background */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6 w-full max-w-full overflow-hidden">
        {isSpecificCategory ? (
          /* Dedicated Category Hub Header */
          <div className="space-y-4">
            {/* Breadcrumb */}
            <nav className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium pb-1">
              <button
                onClick={() => onSelectCategory('all')}
                className="hover:text-black dark:hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Categories</span>
              </button>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                {currentCategory.name}
              </span>
            </nav>

            {/* Category Title & Badge */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-mono text-emerald-600 dark:text-emerald-400">tools.asbily.com/{currentCategory.id}</span>
                <span>·</span>
                <span>{getCategoryCount(currentCategory.id)} Utilities</span>
                <span>·</span>
                <span>100% Client-Side</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#111111] dark:text-white leading-[1.15]">
                {currentCategory.name}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                {currentCategory.description}. Private, instant, browser-based utilities with zero server upload.
              </p>
            </div>
          </div>
        ) : (
          /* Homepage Main Hero */
          <>
            {/* Brand Tagline */}
            <div className="inline-flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-[#111111] dark:text-white">{totalToolsCount}+ Essential Web Utilities</span>
              <span>·</span>
              <span>100% Free Forever</span>
            </div>

            {/* Hero Title */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#111111] dark:text-white leading-[1.1]">
                Free Tools. <span className="underline decoration-neutral-300 dark:decoration-neutral-700 decoration-wavy decoration-1 underline-offset-8">Simple Solutions.</span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed pt-1">
                Engineered for developers, designers, creators, and students. Completely browser-based, zero server logs, instant execution with privacy by design.
              </p>
            </div>
          </>
        )}

        {/* Big Search Input with shortcut hint */}
        <div className="max-w-2xl mx-auto relative pt-2">
          <div className="relative flex items-center shadow-sm rounded-2xl bg-white dark:bg-[#0E0E10] border border-neutral-300 dark:border-neutral-700 focus-within:border-neutral-900 dark:focus-within:border-white focus-within:ring-2 focus-within:ring-neutral-900/10 dark:focus-within:ring-white/10 transition-all">
            <Search className="w-5 h-5 absolute left-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                isSpecificCategory
                  ? `Search in ${currentCategory.name} (or global)...`
                  : 'Search tools (e.g. hashtag, json, pdf, image, password, age)...'
              }
              className="w-full pl-12 pr-24 py-4 bg-transparent text-sm text-[#111111] dark:text-white placeholder:text-neutral-400 focus:outline-none"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-xs text-neutral-400 hover:text-black dark:hover:text-white px-2 py-1 rounded cursor-pointer"
                >
                  Clear
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
                  ⌘K / /
                </kbd>
              )}
            </div>
          </div>

          {/* Quick jump popular shortcuts */}
          <div className="flex items-center justify-center gap-2 pt-3 flex-wrap text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center gap-1 font-semibold text-neutral-700 dark:text-neutral-300 text-[11px] uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Trending:</span>
            </span>
            {popularShortcuts.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (onQuickToolClick) {
                    onQuickToolClick(item.id);
                  } else {
                    onSearchChange(item.label);
                  }
                }}
                className="hover:text-black dark:hover:text-white hover:underline transition cursor-pointer text-xs"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 pt-2 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Client-Side Private</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Zero-Latency Execution</span>
          </div>
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-4 h-4 text-neutral-400" />
            <span>Offline Capable PWA</span>
          </div>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="pt-4 flex items-center justify-start sm:justify-center overflow-x-auto gap-2 no-scrollbar py-2 max-w-full w-full px-1 touch-pan-x overscroll-x-contain">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white shadow-md'
                    : 'bg-white dark:bg-[#0E0E10] border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
