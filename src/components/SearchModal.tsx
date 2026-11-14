import React, { useState, useEffect, useRef } from 'react';
import { Search, X, CornerDownLeft, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { ToolItem } from '../types';
import { CATEGORIES } from '../data/toolsData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tools,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  const filtered = tools.filter((t) => {
    // Category filter
    if (selectedCategory !== 'all' && t.category !== selectedCategory) {
      return false;
    }

    const q = query.toLowerCase().trim();
    if (!q) return true;

    return (
      t.name.toLowerCase().includes(q) ||
      t.shortDesc.toLowerCase().includes(q) ||
      t.categoryLabel.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }).slice(0, 12);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= filtered.length) {
      setSelectedIndex(Math.max(0, filtered.length - 1));
    }
  }, [filtered.length, selectedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectTool(filtered[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#0E0E10] border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 bg-white dark:bg-[#0E0E10] sticky top-0 z-10">
          <Search className="w-5 h-5 text-neutral-400 ml-1 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Search all ${tools.length} free tools by name, tag, or function...`}
            className="flex-1 bg-transparent border-none text-sm text-[#111111] dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-neutral-400 hover:text-black dark:hover:text-white px-1.5 py-0.5 rounded cursor-pointer"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-500">
            ESC
          </kbd>
        </div>

        {/* Category Quick Tabs */}
        <div className="px-3.5 py-2 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
            }`}
          >
            All Tools
          </button>
          {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-900/60 p-1"
        >
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-neutral-300 dark:text-neutral-700 mx-auto" />
              <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                No tools found for "{query}"
              </div>
              <div className="text-xs text-neutral-400">
                Try searching with a broader keyword (e.g. "json", "pdf", "image", "calculate", "hash")
              </div>
            </div>
          ) : (
            filtered.map((t, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTool(t);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 sm:p-3.5 rounded-xl cursor-pointer flex items-center justify-between group transition ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/35'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-900/40'
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#111111] dark:text-neutral-100 truncate">
                        {t.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium shrink-0">
                        · {t.categoryLabel}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                      {t.shortDesc}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-neutral-400 hidden sm:inline">
                      Press ↵
                    </span>
                    <CornerDownLeft
                      className={`w-4 h-4 transition ${
                        isSelected
                          ? 'text-neutral-900 dark:text-white'
                          : 'text-neutral-300 dark:text-neutral-700'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-[9px]">
                ↑
              </kbd>
              <kbd className="px-1 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-[9px]">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-[9px]">
                ↵
              </kbd>
              <span>to open</span>
            </span>
          </div>
          <div>
            <span>{filtered.length} results</span>
          </div>
        </div>
      </div>
    </div>
  );
};
