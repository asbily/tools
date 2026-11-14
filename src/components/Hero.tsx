import React, { useState } from 'react';
import { Search, ShieldCheck, Zap, WifiOff, ArrowLeft, ChevronRight, Share2, Check } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import { ToolCategory } from '../types';
import { HeroScene3D } from './HeroScene3D';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  totalToolsCount: number;
  onQuickToolClick?: (toolId: string) => void;
  darkMode: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  totalToolsCount,
  onQuickToolClick,
  darkMode,
}) => {
  const [copiedCatLink, setCopiedCatLink] = useState(false);

  const getCategoryCount = (catId: string) => {
    if (catId === 'all') return TOOLS.length;
    return TOOLS.filter((t) => t.category === catId).length;
  };

  const currentCategory = CATEGORIES.find((c) => c.id === selectedCategory);

  const popularShortcuts = [
    { id: '3d-mockup-studio', label: '3D Mockup Studio' },
    { id: 'pdf-merge-split', label: 'PDF Merge & Split' },
    { id: 'bg-color-remover', label: 'Remove BG' },
    { id: 'currency-converter', label: 'Currency FX' },
    { id: 'product-payment-qr', label: 'Payment QR' },
    { id: 'resume-builder', label: 'Resume PDF' },
  ];

  const isSpecificCategory = selectedCategory !== 'all' && currentCategory;

  return (
    <section className="relative w-full border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#09090B] transition-colors py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {isSpecificCategory ? (
          <div className="max-w-4xl mx-auto text-center space-y-4 py-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <nav className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Categories</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                <span className="text-slate-900 dark:text-zinc-100 font-semibold">
                  {currentCategory.name}
                </span>
              </nav>

              <button
                type="button"
                onClick={() => {
                  const url = `${window.location.origin}/${currentCategory.id}`;
                  navigator.clipboard.writeText(url);
                  setCopiedCatLink(true);
                  setTimeout(() => setCopiedCatLink(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-900 transition cursor-pointer"
              >
                {copiedCatLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3" />}
                <span>{copiedCatLink ? 'Link Copied' : 'Share Category'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
                <span className="font-mono text-indigo-600 dark:text-indigo-400">/{currentCategory.id}</span>
                <span>·</span>
                <span className="tabular-nums">{getCategoryCount(currentCategory.id)} Tools</span>
                <span>·</span>
                <span>100% Client-Side</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                {currentCategory.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {currentCategory.description}. Instant browser-based utilities with zero server uploads.
              </p>
            </div>

            <div className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center rounded-xl bg-white dark:bg-[#111114] border border-slate-300 dark:border-zinc-700 focus-within:border-indigo-600 dark:focus-within:border-indigo-400 transition-colors">
                <Search className="w-4 h-4 absolute left-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={`Search in ${currentCategory.name}...`}
                  className="w-full pl-11 pr-20 py-3.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Two-Column 3D Spatial + Utility Launchpad Hero */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Core Headline, Search, Quick Shortcuts */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {totalToolsCount} Real Browser Utilities
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>WebGL 3D & PDF Suite</span>
                  <span aria-hidden="true">·</span>
                  <span>Zero Server Uploads</span>
                </div>

                <h1 className="text-3xl sm:text-5xl xl:text-[54px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                  Free Tools.{' '}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Simple Solutions.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                  A complete workstation for 3D mockups, PDF merging & CV creation, transparent cutouts, live currency FX, screen recording, and developer utilities—running privately inside your browser.
                </p>
              </div>

              {/* Search Input */}
              <div className="max-w-xl space-y-3">
                <div className="relative flex items-center rounded-xl bg-white dark:bg-[#111114] border border-slate-300 dark:border-zinc-700 focus-within:border-indigo-600 dark:focus-within:border-indigo-400 shadow-xs transition-colors">
                  <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search tools (e.g. 3d mockup, merge pdf, remove bg, usd to bdt)..."
                    className="w-full pl-12 pr-24 py-3.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  />
                  <div className="absolute right-3 flex items-center gap-1.5">
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white px-2 py-1 rounded cursor-pointer"
                      >
                        Clear
                      </button>
                    ) : (
                      <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700">
                        ⌘K / /
                      </kbd>
                    )}
                  </div>
                </div>

                {/* Quick Launch Links */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500 dark:text-zinc-400">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">Popular:</span>
                  {popularShortcuts.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      {idx > 0 && <span aria-hidden="true" className="opacity-30">·</span>}
                      <button
                        type="button"
                        onClick={() => onQuickToolClick?.(item.id)}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition cursor-pointer font-medium"
                      >
                        {item.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Capability Indicators */}
              <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-slate-500 dark:text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Client-Side Privacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Instant Processing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4 text-slate-400" />
                  <span>Offline Ready PWA</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive WebGL 3D Viewport */}
            <div className="lg:col-span-5 flex">
              <HeroScene3D
                darkMode={darkMode}
                onLaunch3DStudio={() => onQuickToolClick?.('3d-mockup-studio')}
              />
            </div>
          </div>
        )}

        {/* Horizontal Category Segmented Filter Bar */}
        <div className="flex items-center justify-start overflow-x-auto gap-2 no-scrollbar py-1 w-full touch-pan-x overscroll-x-contain">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.id);
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-[#111114] border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    isSelected ? 'text-indigo-100' : 'text-slate-400 dark:text-zinc-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
