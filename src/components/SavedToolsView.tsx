import React, { useMemo, useState } from 'react';
import { ArrowLeft, Star, Search, Trash2, Share2, Check, Compass } from 'lucide-react';
import { ToolItem } from '../types';
import { ToolCard } from './ToolCard';

interface SavedToolsViewProps {
  favoriteTools: ToolItem[];
  onBackToHome: () => void;
  onOpenTool: (tool: ToolItem) => void;
  onToggleFavorite: (toolId: string) => void;
  onClearAllFavorites: () => void;
  onShowToast?: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const SavedToolsView: React.FC<SavedToolsViewProps> = ({
  favoriteTools,
  onBackToHome,
  onOpenTool,
  onToggleFavorite,
  onClearAllFavorites,
  onShowToast,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [copiedPage, setCopiedPage] = useState(false);

  const categoriesPresent = useMemo(() => {
    const map = new Map<string, string>();
    favoriteTools.forEach((t) => map.set(t.category, t.categoryLabel));
    return Array.from(map.entries());
  }, [favoriteTools]);

  const filteredTools = useMemo(() => {
    const q = filterQuery.toLowerCase().trim();
    return favoriteTools.filter((tool) => {
      const catOk = selectedCat === 'all' || tool.category === selectedCat;
      const searchOk =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.shortDesc.toLowerCase().includes(q) ||
        tool.categoryLabel.toLowerCase().includes(q) ||
        tool.tags.some((tg) => tg.toLowerCase().includes(q));
      return catOk && searchOk;
    });
  }, [favoriteTools, filterQuery, selectedCat]);

  const handleShareSavedPage = () => {
    const url = `${window.location.origin}/saved`;
    navigator.clipboard.writeText(url);
    setCopiedPage(true);
    onShowToast?.('Saved page link copied!', 'success');
    setTimeout(() => setCopiedPage(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareSavedPage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-medium hover:bg-slate-50 dark:hover:bg-zinc-900 transition cursor-pointer"
          >
            {copiedPage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedPage ? 'Link Copied' : 'Share Page'}</span>
          </button>

          {favoriteTools.length > 0 && (
            <button
              type="button"
              onClick={onClearAllFavorites}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-mono text-indigo-600 dark:text-indigo-400">/saved</span>
            <span>·</span>
            <span className="tabular-nums">{favoriteTools.length} Saved {favoriteTools.length === 1 ? 'Tool' : 'Tools'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Your Saved Tools
          </h1>
          <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xl">
            Every tool you star is organized here in one clean workspace for instant access and one-click link sharing.
          </p>
        </div>

        {favoriteTools.length > 0 && (
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter saved tools..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111114] text-xs focus:outline-none focus:border-indigo-600"
            />
          </div>
        )}
      </div>

      {/* Category Filter Tabs inside Saved Page */}
      {categoriesPresent.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setSelectedCat('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition cursor-pointer ${
              selectedCat === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-[#111114] border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
            }`}
          >
            All Saved ({favoriteTools.length})
          </button>
          {categoriesPresent.map(([catId, catLabel]) => (
            <button
              type="button"
              key={catId}
              onClick={() => setSelectedCat(catId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition cursor-pointer ${
                selectedCat === catId
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-[#111114] border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              {catLabel}
            </button>
          ))}
        </div>
      )}

      {/* Saved Grid or Empty State */}
      {favoriteTools.length === 0 ? (
        <div className="border border-dashed border-slate-300 dark:border-zinc-800 rounded-2xl p-12 sm:p-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center mx-auto">
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">No saved tools yet</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
              Click the star icon on any tool card or inside a tool workspace to bookmark it here for quick daily access.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore All Tools</span>
          </button>
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="border border-dashed border-slate-300 dark:border-zinc-800 rounded-2xl p-10 text-center space-y-2">
          <div className="text-sm font-semibold">No saved tools match "{filterQuery}"</div>
          <button
            type="button"
            onClick={() => {
              setFilterQuery('');
              setSelectedCat('all');
            }}
            className="text-xs text-indigo-600 hover:underline cursor-pointer"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onOpen={onOpenTool}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onShowToast={onShowToast}
            />
          ))}
        </div>
      )}
    </div>
  );
};
