/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS, CATEGORIES } from './data/toolsData';
import { ToolCategory, ToolItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolCard } from './components/ToolCard';
import { ToolView } from './components/ToolView';
import { SavedToolsView } from './components/SavedToolsView';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { LegalModal } from './components/LegalModal';
import { SitemapView } from './components/SitemapView';
import { AdSlot } from './components/AdSlot';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Sparkles, Clock, Star, Trash2, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [isSavedPage, setIsSavedPage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact'>('about');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Favorites in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asbily_favorites');
      return saved ? JSON.parse(saved) : ['3d-mockup-studio', 'pdf-merge-split', 'json-formatter', 'image-compressor'];
    } catch {
      return [];
    }
  });

  // Recently Used in LocalStorage
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('asbily_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Theme: Light by default, Dark optional
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('asbily_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('asbily_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('asbily_theme', 'light');
    }
  }, [darkMode]);

  const addRecentlyUsed = (toolId: string) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 6);
      localStorage.setItem('asbily_recent', JSON.stringify(updated));
      return updated;
    });
  };

  // Parse route from URL pathname & hash
  const syncRouteFromUrl = () => {
    const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
    const segments = pathname.split('/').filter(Boolean);
    const hash = window.location.hash;

    if (hash && hash.startsWith('#tool=')) {
      const toolId = hash.replace('#tool=', '');
      const tool = TOOLS.find((t) => t.id === toolId);
      if (tool) {
        setIsSavedPage(false);
        setIsSitemapOpen(false);
        setActiveTool(tool);
        setSelectedCategory(tool.category);
        addRecentlyUsed(tool.id);
        const cleanPath = `/${tool.category}/${tool.id}`;
        if (window.location.pathname !== cleanPath) {
          window.history.replaceState(null, '', cleanPath);
        }
        return;
      }
    }

    // /saved or /favorites -> Dedicated Saved Tools page
    if (segments.length === 1 && (segments[0] === 'saved' || segments[0] === 'favorites')) {
      setIsSavedPage(true);
      setIsSitemapOpen(false);
      setActiveTool(null);
      setSelectedCategory('all');
      if (segments[0] === 'favorites') {
        window.history.replaceState(null, '', '/saved');
      }
      return;
    }

    // /sitemap -> Public Interactive Directory
    if (segments.length === 1 && segments[0] === 'sitemap') {
      setIsSavedPage(false);
      setIsSitemapOpen(true);
      setActiveTool(null);
      setSelectedCategory('all');
      return;
    }

    // /category/toolId
    if (segments.length >= 2) {
      const toolSegment = segments[1];
      const tool = TOOLS.find((t) => t.id === toolSegment);
      if (tool) {
        setIsSavedPage(false);
        setIsSitemapOpen(false);
        setActiveTool(tool);
        setSelectedCategory(tool.category);
        addRecentlyUsed(tool.id);
        return;
      }
    }

    // /category or /toolId
    if (segments.length === 1) {
      const segment = segments[0];
      const isCategory = CATEGORIES.some((c) => c.id === segment);
      if (isCategory) {
        setIsSavedPage(false);
        setIsSitemapOpen(false);
        setSelectedCategory(segment as ToolCategory);
        setActiveTool(null);
        return;
      }

      const tool = TOOLS.find((t) => t.id === segment);
      if (tool) {
        setIsSavedPage(false);
        setIsSitemapOpen(false);
        setActiveTool(tool);
        setSelectedCategory(tool.category);
        addRecentlyUsed(tool.id);
        window.history.replaceState(null, '', `/${tool.category}/${tool.id}`);
        return;
      }
    }

    // Root homepage
    setIsSavedPage(false);
    setIsSitemapOpen(false);
    setActiveTool(null);
    setSelectedCategory('all');
  };

  useEffect(() => {
    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => window.removeEventListener('popstate', syncRouteFromUrl);
  }, []);

  // Update dynamic page title, meta, & canonical URL
  useEffect(() => {
    let pageTitle = 'Asbily Free Tools — Free Tools. Simple Solutions.';
    let pageDesc =
      'All-in-one free online tools platform for 3D mockups, PDF merge/split, CV creation, text utilities, developer tools, SEO, images, and productivity.';
    let canonicalPath = '/';

    if (isSavedPage) {
      pageTitle = 'Saved & Starred Tools — Asbily Free Tools';
      pageDesc = 'Your personal bookmarked collection of free client-side tools organized in one place.';
      canonicalPath = '/saved';
    } else if (isSitemapOpen) {
      pageTitle = 'Public Sitemap & Directory — Asbily Free Tools';
      pageDesc = `Explore the complete public sitemap and URL index for all ${TOOLS.length} tools on Asbily Free Tools.`;
      canonicalPath = '/sitemap';
    } else if (activeTool) {
      pageTitle = `${activeTool.name} — Free Online Tool | Asbily`;
      pageDesc = `${activeTool.shortDesc} 100% client-side, private, and free online utility.`;
      canonicalPath = `/${activeTool.category}/${activeTool.id}`;
    } else if (selectedCategory && selectedCategory !== 'all') {
      const cat = CATEGORIES.find((c) => c.id === selectedCategory);
      pageTitle = `${cat?.name || selectedCategory} — Free Online Tools | Asbily`;
      pageDesc = `${cat?.description || 'Browse free online tools'}. Fast, private, browser-based utilities with zero server upload.`;
      canonicalPath = `/${selectedCategory}`;
    }

    document.title = pageTitle;

    const fullCanonicalUrl = `https://tools.asbily.com${canonicalPath}`;
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.setAttribute('href', fullCanonicalUrl);

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', pageDesc);

    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', pageTitle);

    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', pageDesc);

    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl) ogUrlEl.setAttribute('content', fullCanonicalUrl);
  }, [activeTool, selectedCategory, isSitemapOpen, isSavedPage]);

  // Global keyboard shortcut '/' or Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const clearRecentlyUsed = () => {
    setRecentlyUsed([]);
    localStorage.removeItem('asbily_recent');
    showToast('Recently used history cleared', 'info');
  };

  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId];
      localStorage.setItem('asbily_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.setItem('asbily_favorites', JSON.stringify([]));
    showToast('All saved tools cleared', 'info');
  };

  const handleOpenTool = (tool: ToolItem) => {
    const newPath = `/${tool.category}/${tool.id}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    setIsSavedPage(false);
    setIsSitemapOpen(false);
    setActiveTool(tool);
    setSelectedCategory(tool.category);
    addRecentlyUsed(tool.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: ToolCategory) => {
    const newPath = cat === 'all' ? '/' : `/${cat}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    setIsSavedPage(false);
    setIsSitemapOpen(false);
    setActiveTool(null);
    setSelectedCategory(cat);
  };

  const handleQuickToolClick = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (tool) handleOpenTool(tool);
  };

  const handleGoHome = () => {
    if (window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
    setIsSavedPage(false);
    setIsSitemapOpen(false);
    setActiveTool(null);
    setSelectedCategory('all');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromTool = () => {
    const newPath = selectedCategory !== 'all' ? `/${selectedCategory}` : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    setIsSavedPage(false);
    setIsSitemapOpen(false);
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSaved = () => {
    if (window.location.pathname !== '/saved') {
      window.history.pushState(null, '', '/saved');
    }
    setIsSavedPage(true);
    setIsSitemapOpen(false);
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSitemap = () => {
    if (window.location.pathname !== '/sitemap') {
      window.history.pushState(null, '', '/sitemap');
    }
    setIsSavedPage(false);
    setIsSitemapOpen(true);
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (tab: 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  const displayedTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.shortDesc.toLowerCase().includes(q) ||
        tool.categoryLabel.toLowerCase().includes(q) ||
        tool.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const recentToolItems = useMemo(() => {
    return recentlyUsed
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter((t): t is ToolItem => Boolean(t));
  }, [recentlyUsed]);

  const favoriteToolItems = useMemo(() => {
    return favorites
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter((t): t is ToolItem => Boolean(t));
  }, [favorites]);

  const currentViewKey = isSavedPage
    ? 'saved'
    : isSitemapOpen
      ? 'sitemap'
      : activeTool
        ? `tool-${activeTool.id}`
        : 'home';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] dark:bg-[#09090B] text-slate-900 dark:text-zinc-100 transition-colors selection:bg-indigo-600 selection:text-white overflow-x-clip w-full max-w-full">
      {/* Smart Scroll Hide/Show Header */}
      <Header
        onSearchClick={() => setIsSearchModalOpen(true)}
        favoritesCount={favorites.length}
        onFavoritesClick={handleOpenSaved}
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(!darkMode);
          showToast(!darkMode ? 'Dark mode enabled' : 'Light mode enabled', 'info');
        }}
        onOpenLegal={handleOpenLegal}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onHomeClick={handleGoHome}
        onOpenSitemap={handleOpenSitemap}
        isSavedPage={isSavedPage}
      />

      {/* Main Content Area with Smooth Route Transitions */}
      <main className="flex-1 w-full max-w-full overflow-x-clip">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentViewKey}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {isSavedPage ? (
              <SavedToolsView
                favoriteTools={favoriteToolItems}
                onBackToHome={handleGoHome}
                onOpenTool={handleOpenTool}
                onToggleFavorite={toggleFavorite}
                onClearAllFavorites={clearAllFavorites}
                onShowToast={showToast}
              />
            ) : isSitemapOpen ? (
              <SitemapView
                onBackToHome={handleGoHome}
                onOpenTool={handleOpenTool}
                onSelectCategory={(catId) => {
                  setIsSitemapOpen(false);
                  handleSelectCategory(catId as ToolCategory);
                }}
                onShowToast={showToast}
              />
            ) : activeTool ? (
              <ToolView
                tool={activeTool}
                onBack={handleBackFromTool}
                isFavorite={favorites.includes(activeTool.id)}
                onToggleFavorite={toggleFavorite}
                onSelectTool={handleOpenTool}
                favorites={favorites}
                onShowToast={showToast}
              />
            ) : (
              <div className="space-y-10">
                <Hero
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                  totalToolsCount={TOOLS.length}
                  onQuickToolClick={handleQuickToolClick}
                  darkMode={darkMode}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 w-full max-w-full overflow-hidden">
                  <AdSlot slotName="Sponsored Advertisement" type="responsive-header" />

                  {/* Clean Compact Quick Workspace Bar (Saved Page link + Recent items without clutter) */}
                  {!searchQuery && selectedCategory === 'all' && (favoriteToolItems.length > 0 || recentToolItems.length > 0) && (
                    <section className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-[#111114] flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        {recentToolItems.length > 0 ? (
                          <>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-zinc-300 shrink-0 mr-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Recent:</span>
                            </span>
                            {recentToolItems.slice(0, 4).map((tool) => (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => handleOpenTool(tool)}
                                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500 text-xs font-medium transition cursor-pointer truncate max-w-[180px]"
                              >
                                {tool.name}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={clearRecentlyUsed}
                              className="p-1.5 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                              title="Clear recent history"
                              aria-label="Clear recent history"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-500 dark:text-zinc-400">
                            Star your favorite tools to access them anytime from your Saved workspace.
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenSaved}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-indigo-500 text-xs font-semibold text-slate-800 dark:text-zinc-100 transition shrink-0 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Open Saved Tools ({favoriteToolItems.length})</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </section>
                  )}

                  {/* Organized Tools Directory Grid */}
                  <section id="tools-grid-section" className="space-y-6 w-full max-w-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-zinc-100">
                          {selectedCategory === 'all' ? 'All Free Tools' : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                          <span className="ml-2 text-xs font-normal text-slate-400 tabular-nums">
                            ({displayedTools.length} {displayedTools.length === 1 ? 'tool' : 'tools'})
                          </span>
                        </h2>
                      </div>

                      {selectedCategory !== 'all' && (
                        <button
                          type="button"
                          onClick={() => handleSelectCategory('all')}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
                        >
                          Show All Categories
                        </button>
                      )}
                    </div>

                    {displayedTools.length === 0 ? (
                      <div className="p-12 sm:p-16 border border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl text-center space-y-3">
                        <div className="text-base font-semibold text-slate-700 dark:text-zinc-300">
                          No tools match your query "{searchQuery}"
                        </div>
                        <div className="text-xs text-slate-400">
                          Try searching with different keywords or browse our categories.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            handleSelectCategory('all');
                          }}
                          className="mt-2 px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
                        >
                          Clear Search Filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 w-full max-w-full">
                        {displayedTools.map((tool, index) => (
                          <React.Fragment key={tool.id}>
                            <ToolCard
                              tool={tool}
                              onOpen={handleOpenTool}
                              isFavorite={favorites.includes(tool.id)}
                              onToggleFavorite={toggleFavorite}
                              onShowToast={showToast}
                            />

                            {index === 5 && displayedTools.length >= 8 && (
                              <AdSlot slotName="Sponsored Promotion" type="in-feed-banner" />
                            )}

                            {index === 13 && displayedTools.length >= 16 && (
                              <div className="col-span-full py-2 flex justify-center w-full max-w-full overflow-hidden">
                                <AdSlot slotName="Featured Sponsored Solution" type="300x250" />
                              </div>
                            )}

                            {index === 21 && displayedTools.length >= 24 && (
                              <AdSlot slotName="Sponsored Promotion" type="in-feed-banner" />
                            )}

                            {index === 29 && displayedTools.length >= 32 && (
                              <div className="col-span-full py-2 flex justify-center w-full max-w-full overflow-hidden">
                                <AdSlot slotName="Featured Sponsored Solution" type="300x250" />
                              </div>
                            )}

                            {index === 37 && displayedTools.length >= 40 && (
                              <AdSlot slotName="Sponsored Promotion" type="in-feed-banner" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </section>

                  <AdSlot slotName="Sponsored Recommendations" type="native" />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        onOpenLegal={handleOpenLegal}
        onSelectCategory={(cat) => {
          handleSelectCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSitemap={handleOpenSitemap}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        tools={TOOLS}
        onSelectTool={handleOpenTool}
      />

      <LegalModal
        initialTab={legalModalTab}
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
