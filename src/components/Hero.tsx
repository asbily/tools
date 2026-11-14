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
    <section className="relative w-full border-b border-black/10 dark:border-white/10 bg-gradient-to-b from-[#EDEDED] to-[#FFFFFF] dark:from-[#090909] dark:to-[#050505] transition-colors py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {isSpecificCategory ? (
          <div className="max-w-4xl mx-auto text-center space-y-4 py-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <nav className="inline-flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Categories</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                <span className="text-[#000000] dark:text-[#FFFFFF] font-semibold">
                  {currentCategory.name}
                </span>
              </nav>

              <button
                type="button"
                onClick={() => {
                  const base =
                    window.location.origin && window.location.origin.startsWith('http')
                      ? window.location.origin
                      : 'https://tools.asbily.com';
                  const url = `${base}/${currentCategory.id}`;
                  if (navigator.clipboard?.writeText) {
                    navigator.clipboard.writeText(url).catch(() => {});
                  }
                  setCopiedCatLink(true);
                  setTimeout(() => setCopiedCatLink(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-medium text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer"
              >
                {copiedCatLink ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                <span>{copiedCatLink ? 'Link Copied' : 'Share Category'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <span className="font-mono font-semibold text-[#000000] dark:text-[#FFFFFF]">/{currentCategory.id}</span>
                <span>·</span>
                <span className="tabular-nums">{getCategoryCount(currentCategory.id)} Tools</span>
                <span>·</span>
                <span>100% Client-Side</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#000000] dark:text-[#FFFFFF] leading-[1.12]">
                {currentCategory.name}
              </h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                {currentCategory.description}. Instant browser-based utilities with zero server uploads.
              </p>
            </div>

            <div className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center rounded-xl bg-[#FFFFFF] dark:bg-[#090909] border border-black/15 dark:border-white/15 focus-within:border-[#000000] dark:focus-within:border-[#FFFFFF] transition-colors">
                <Search className="w-4 h-4 absolute left-4 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={`Search in ${currentCategory.name}...`}
                  className="w-full pl-11 pr-20 py-3.5 bg-transparent text-sm text-[#000000] dark:text-[#FFFFFF] placeholder:text-neutral-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 text-xs text-neutral-500 hover:text-[#000000] dark:hover:text-[#FFFFFF] px-2 py-1 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Two-Column 3D Spatial + Utility Launchpad Hero (#EDEDED 'n #FFFFFF) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Column: Core Headline, Search, Quick Shortcuts */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  <span className="font-semibold text-[#000000] dark:text-[#FFFFFF] tabular-nums">
                    {totalToolsCount} Real Browser Utilities
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>WebGL 3D & PDF Suite</span>
                  <span aria-hidden="true">·</span>
                  <span>Zero Server Uploads</span>
                </div>

                <h1 className="text-3xl sm:text-5xl xl:text-[54px] font-extrabold tracking-tight text-[#000000] dark:text-[#FFFFFF] leading-[1.08]">
                  Free Tools.{' '}
                  <span className="text-neutral-500 dark:text-neutral-400">
                    Simple Solutions.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
                  A complete workstation for 3D mockups, PDF merging & CV creation, transparent cutouts, live currency FX, screen recording, and developer utilities—running privately inside your browser.
                </p>
              </div>

              {/* Search Input */}
              <div className="max-w-xl space-y-3">
                <div className="relative flex items-center rounded-xl bg-[#FFFFFF] dark:bg-[#090909] border border-black/15 dark:border-white/15 focus-within:border-[#000000] dark:focus-within:border-[#FFFFFF] shadow-xs transition-colors">
                  <Search className="w-5 h-5 absolute left-4 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search tools (e.g. 3d mockup, merge pdf, remove bg, usd to bdt)..."
                    className="w-full pl-12 pr-24 py-3.5 bg-transparent text-sm text-[#000000] dark:text-[#FFFFFF] placeholder:text-neutral-400 focus:outline-none"
                  />
                  <div className="absolute right-3 flex items-center gap-1.5">
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="text-xs text-neutral-500 hover:text-[#000000] dark:hover:text-[#FFFFFF] px-2 py-1 rounded cursor-pointer"
                      >
                        Clear
                      </button>
                    ) : (
                      <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-[10px] font-mono text-neutral-500 bg-[#F6F6F6] dark:bg-white/10 rounded border border-black/10 dark:border-white/10">
                        ⌘K / /
                      </kbd>
                    )}
                  </div>
                </div>

                {/* Quick Launch Links */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                  <span className="font-semibold text-[#000000] dark:text-[#FFFFFF]">Popular:</span>
                  {popularShortcuts.map((item, idx) => (
                    <React.Fragment key={item.id}>
                      {idx > 0 && <span aria-hidden="true" className="opacity-30">·</span>}
                      <button
                        type="button"
                        onClick={() => onQuickToolClick?.(item.id)}
                        className="hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:underline transition cursor-pointer font-medium"
                      >
                        {item.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Capability Indicators */}
              <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
                  <span>Client-Side Privacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
                  <span>Instant Processing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
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
                    ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                    : 'bg-[#FFFFFF] dark:bg-[#090909] border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:bg-[#F6F6F6] dark:hover:bg-white/10 hover:text-[#000000] dark:hover:text-[#FFFFFF]'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    isSelected ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400 dark:text-neutral-500'
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
