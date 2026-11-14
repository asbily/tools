import React, { useMemo, useState } from 'react';
import { ArrowLeft, Star, Search, Trash2, Share2, Check, Compass, Download } from 'lucide-react';
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
  const [confirmClear, setConfirmClear] = useState(false);

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
    const base =
      window.location.origin && window.location.origin.startsWith('http')
        ? window.location.origin
        : 'https://tools.asbily.com';
    const url = `${base}/saved`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedPage(true);
    onShowToast?.('Saved page link copied!', 'success');
    setTimeout(() => setCopiedPage(false), 2000);
  };

  const handleExportSavedBackup = () => {
    const payload = {
      app: 'Asbily Tools',
      exportedAt: new Date().toISOString(),
      favorites: favoriteTools.map((t) => ({ id: t.id, name: t.name, category: t.category })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asbily-saved-tools-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast?.('Saved tools JSON exported locally.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/10 dark:border-white/10">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleShareSavedPage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-medium text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer"
          >
            {copiedPage ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedPage ? 'Link Copied' : 'Share Page'}</span>
          </button>

          {favoriteTools.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportSavedBackup}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-medium text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backup JSON</span>
              </button>

              {confirmClear ? (
                <div className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClearAllFavorites();
                      setConfirmClear(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
                  >
                    Confirm Clear ({favoriteTools.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-medium text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <Star className="w-4 h-4 text-[#000000] fill-[#000000] dark:text-[#FFFFFF] dark:fill-[#FFFFFF]" />
            <span className="font-mono font-semibold text-[#000000] dark:text-[#FFFFFF]">/saved</span>
            <span>·</span>
            <span className="tabular-nums">{favoriteTools.length} Saved {favoriteTools.length === 1 ? 'Tool' : 'Tools'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#000000] dark:text-[#FFFFFF]">
            Your Saved Tools
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl">
            Every tool you star is organized here in one clean workspace for instant access and one-click link sharing.
          </p>
        </div>

        {favoriteTools.length > 0 && (
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter saved tools..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs text-[#000000] dark:text-[#FFFFFF] focus:outline-none focus:border-[#000000] dark:focus:border-[#FFFFFF]"
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
                ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                : 'bg-[#FFFFFF] dark:bg-[#090909] border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:bg-[#F6F6F6]'
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
                  ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                  : 'bg-[#FFFFFF] dark:bg-[#090909] border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:bg-[#F6F6F6]'
              }`}
            >
              {catLabel}
            </button>
          ))}
        </div>
      )}

      {/* Saved Grid or Empty State */}
      {favoriteTools.length === 0 ? (
        <div className="border border-dashed border-black/20 dark:border-white/20 rounded-2xl bg-[#F6F6F6] dark:bg-[#090909] p-12 sm:p-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFFFFF] dark:bg-[#050505] border border-black/10 dark:border-white/15 flex items-center justify-center mx-auto">
            <Star className="w-6 h-6 text-[#000000] dark:text-[#FFFFFF]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#000000] dark:text-[#FFFFFF]">No saved tools yet</h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Click the star icon on any tool card or inside a tool workspace to bookmark it here for quick daily access.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#000000] hover:bg-[#090909] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold transition cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore All Tools</span>
          </button>
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="border border-dashed border-black/20 dark:border-white/20 rounded-2xl p-10 text-center space-y-2 bg-[#F6F6F6] dark:bg-[#090909]">
          <div className="text-sm font-semibold">No saved tools match "{filterQuery}"</div>
          <button
            type="button"
            onClick={() => {
              setFilterQuery('');
              setSelectedCat('all');
            }}
            className="text-xs font-semibold text-[#000000] dark:text-[#FFFFFF] hover:underline cursor-pointer"
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
