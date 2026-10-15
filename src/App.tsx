/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TOOLS, CATEGORIES } from './data/toolsData';
import { ToolCategory, ToolItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolCard } from './components/ToolCard';
import { ToolView } from './components/ToolView';
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
      return saved ? JSON.parse(saved) : ['hashtag-generator', 'word-counter', 'json-formatter', 'image-compressor'];
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

  // Theme: Light by default as requested, Dark optional
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('asbily_theme') === 'dark';
  });

  // Sync theme with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('asbily_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('asbily_theme', 'light');
    }
  }, [darkMode]);

  // Parse route from URL pathname & hash
  const syncRouteFromUrl = () => {
    const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
    const segments = pathname.split('/').filter(Boolean);
    const hash = window.location.hash;

    // Check legacy hash first: #tool=some-id
    if (hash && hash.startsWith('#tool=')) {
      const toolId = hash.replace('#tool=', '');
      const tool = TOOLS.find((t) => t.id === toolId);
      if (tool) {
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

    // Pattern 0: /sitemap (Public Interactive HTML Sitemap)
    if (segments.length === 1 && segments[0] === 'sitemap') {
      setIsSitemapOpen(true);
      setActiveTool(null);
      setSelectedCategory('all');
      return;
    }

    // Pattern 1: /category/toolId  (e.g., /text/word-counter)
    if (segments.length >= 2) {
      const catSegment = segments[0];
      const toolSegment = segments[1];
      const tool = TOOLS.find((t) => t.id === toolSegment);
      if (tool) {
        setIsSitemapOpen(false);
        setActiveTool(tool);
        setSelectedCategory(tool.category);
        addRecentlyUsed(tool.id);
        return;
      }
    }

    // Pattern 2: /category  (e.g., /text, /developer, /qr) OR /toolId (shortcut)
    if (segments.length === 1) {
      const segment = segments[0];
      const isCategory = CATEGORIES.some((c) => c.id === segment);
      if (isCategory) {
        setIsSitemapOpen(false);
        setSelectedCategory(segment as ToolCategory);
        setActiveTool(null);
        return;
      }

      // Check if it's a direct tool ID
      const tool = TOOLS.find((t) => t.id === segment);
      if (tool) {
        setIsSitemapOpen(false);
        setActiveTool(tool);
        setSelectedCategory(tool.category);
        addRecentlyUsed(tool.id);
        // Normalize URL to /category/toolId
        window.history.replaceState(null, '', `/${tool.category}/${tool.id}`);
        return;
      }
    }

    // Root homepage
    setIsSitemapOpen(false);
    setActiveTool(null);
    setSelectedCategory('all');
  };

  // Sync on initial load and handle browser back/forward buttons (popstate)
  useEffect(() => {
    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => window.removeEventListener('popstate', syncRouteFromUrl);
  }, []);

  // Update dynamic page title & canonical URL tag with 100% domain priority
  useEffect(() => {
    let pageTitle = 'Asbily Free Tools — Free Tools. Simple Solutions.';
    let pageDesc = 'All-in-one free online tools platform for text manipulation, social media hashtag generators, developer utilities, SEO checkers, client-side image compression, PDF documents, and productivity tools by Asbily Platforms.';
    let canonicalPath = '/';

    if (isSitemapOpen) {
      pageTitle = 'Public Sitemap & SEO Directory — Asbily Free Tools';
      pageDesc = 'Explore the complete public sitemap, URL index, and robots crawling architecture for all 83+ tools on Asbily Free Tools.';
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

    // Keep canonical link synchronized with 100% domain priority on https://tools.asbily.com
    const fullCanonicalUrl = `https://tools.asbily.com${canonicalPath}`;
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', fullCanonicalUrl);
    }

    // Dynamic Meta Description
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute('content', pageDesc);
    }

    // OpenGraph dynamic synchronization
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', pageTitle);

    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', pageDesc);

    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl) ogUrlEl.setAttribute('content', fullCanonicalUrl);
  }, [activeTool, selectedCategory, isSitemapOpen]);

  // Global keyboard shortcut '/' or Cmd+K / Ctrl+K to open search modal
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

  const addRecentlyUsed = (toolId: string) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((id) => id !== toolId);
      const updated = [toolId, ...filtered].slice(0, 6);
      localStorage.setItem('asbily_recent', JSON.stringify(updated));
      return updated;
    });
  };

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

  // Open tool with clean /category/tool-name URL
  const handleOpenTool = (tool: ToolItem) => {
    const newPath = `/${tool.category}/${tool.id}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    setIsSitemapOpen(false);
    setActiveTool(tool);
    setSelectedCategory(tool.category);
    addRecentlyUsed(tool.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select category with clean /category URL
  const handleSelectCategory = (cat: ToolCategory) => {
    const newPath = cat === 'all' ? '/' : `/${cat}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    setIsSitemapOpen(false);
    setActiveTool(null);
    setSelectedCategory(cat);
  };

  const handleQuickToolClick = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (tool) {
      handleOpenTool(tool);
    }
  };

  const handleBackToHome = () => {
    const newPath = selectedCategory !== 'all' ? `/${selectedCategory}` : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    setIsSitemapOpen(false);
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSitemap = () => {
    if (window.location.pathname !== '/sitemap') {
      window.history.pushState(null, '', '/sitemap');
    }
    setIsSitemapOpen(true);
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (tab: 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact') => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // Filtered tools
  const displayedTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      // Category match
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;

      // Search match
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

  // Recently used tool objects
  const recentToolItems = useMemo(() => {
    return recentlyUsed
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter((t): t is ToolItem => Boolean(t));
  }, [recentlyUsed]);

  // Favorite tool objects
  const favoriteToolItems = useMemo(() => {
    return favorites
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter((t): t is ToolItem => Boolean(t));
  }, [favorites]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] dark:bg-[#0B0B0C] text-[#111111] dark:text-[#F3F4F6] transition-colors selection:bg-[#111111] selection:text-white overflow-x-hidden w-full max-w-full">
      {/* Header */}
      <Header
        onSearchClick={() => setIsSearchModalOpen(true)}
        favoritesCount={favorites.length}
        onFavoritesClick={() => {
          setActiveTool(null);
          setSelectedCategory('all');
          setSearchQuery('');
          const favSection = document.getElementById('favorites-section');
          favSection?.scrollIntoView({ behavior: 'smooth' });
        }}
        darkMode={darkMode}
        onToggleDarkMode={() => {
          setDarkMode(!darkMode);
          showToast(!darkMode ? 'Dark mode enabled' : 'Light mode enabled', 'info');
        }}
        onOpenLegal={handleOpenLegal}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onHomeClick={handleBackToHome}
        onOpenSitemap={handleOpenSitemap}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        {isSitemapOpen ? (
          <SitemapView
            onBackToHome={handleBackToHome}
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
            onBack={handleBackToHome}
            isFavorite={favorites.includes(activeTool.id)}
            onToggleFavorite={toggleFavorite}
            onSelectTool={handleOpenTool}
            favorites={favorites}
            onShowToast={showToast}
          />
        ) : (
          <div className="space-y-12">
            {/* Hero Section */}
            <Hero
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
              totalToolsCount={TOOLS.length}
              onQuickToolClick={handleQuickToolClick}
            />

            <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-12 w-full max-w-full overflow-hidden">
              {/* Responsive Header Ad (728x90 Desktop / 320x50 Mobile) */}
              <AdSlot slotName="Sponsored Advertisement" type="responsive-header" />

              {/* Favorites Section if any & no search query */}
              {!searchQuery && selectedCategory === 'all' && favoriteToolItems.length > 0 && (
                <section id="favorites-section" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                        Your Favorite Utilities ({favoriteToolItems.length})
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {favoriteToolItems.slice(0, 4).map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        onOpen={handleOpenTool}
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                        onShowToast={showToast}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Recently Used Section if any & no search query */}
              {!searchQuery && selectedCategory === 'all' && recentToolItems.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-neutral-400" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                        Recently Used ({recentToolItems.length})
                      </h2>
                    </div>
                    <button
                      onClick={clearRecentlyUsed}
                      className="text-xs text-neutral-400 hover:text-rose-500 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {recentToolItems.map((tool) => (
                      <div
                        key={tool.id}
                        onClick={() => handleOpenTool(tool)}
                        className="group p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-900 dark:hover:border-neutral-400 transition cursor-pointer bg-white dark:bg-[#0E0E10] flex flex-col justify-between shadow-2xs hover:shadow-sm"
                      >
                        <div className="text-xs font-semibold line-clamp-1 group-hover:underline">
                          {tool.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-2 flex items-center justify-between">
                          <span>{tool.categoryLabel}</span>
                          <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* All Tools Grid Section */}
              <section id="tools-grid-section" className="space-y-6 w-full max-w-full overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-neutral-500" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#111111] dark:text-neutral-100">
                      {selectedCategory === 'all' ? 'All Free Tools' : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                      <span className="ml-2 text-xs font-normal text-neutral-400">
                        ({displayedTools.length} {displayedTools.length === 1 ? 'tool' : 'tools'})
                      </span>
                    </h2>
                  </div>

                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-xs text-neutral-500 hover:text-black dark:hover:text-white underline cursor-pointer"
                    >
                      Show All Categories
                    </button>
                  )}
                </div>

                {displayedTools.length === 0 ? (
                  <div className="p-12 sm:p-16 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center space-y-3">
                    <div className="text-base font-semibold text-neutral-700 dark:text-neutral-300">
                      No tools match your query "{searchQuery}"
                    </div>
                    <div className="text-xs text-neutral-400">
                      Try searching with different keywords or browse our categories.
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="mt-2 px-4 py-2 border rounded-lg text-xs font-medium cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
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

                        {/* In-Between Ad 1: Clean responsive banner divider after 6 tools */}
                        {index === 5 && displayedTools.length >= 8 && (
                          <AdSlot slotName="Sponsored Promotion" type="in-feed-banner" />
                        )}

                        {/* In-Between Ad 2: High CPM 300x250 Medium Rectangle after 14 tools */}
                        {index === 13 && displayedTools.length >= 16 && (
                          <div className="col-span-full py-2 flex justify-center w-full max-w-full overflow-hidden">
                            <AdSlot slotName="Featured Sponsored Solution" type="300x250" />
                          </div>
                        )}

                        {/* In-Between Ad 3: Clean responsive banner divider after 22 tools */}
                        {index === 21 && displayedTools.length >= 24 && (
                          <AdSlot slotName="Sponsored Promotion" type="in-feed-banner" />
                        )}

                        {/* In-Between Ad 4: High CPM 300x250 Medium Rectangle after 30 tools */}
                        {index === 29 && displayedTools.length >= 32 && (
                          <div className="col-span-full py-2 flex justify-center w-full max-w-full overflow-hidden">
                            <AdSlot slotName="Featured Sponsored Solution" type="300x250" />
                          </div>
                        )}

                        {/* In-Between Ad 5: Clean responsive banner divider after 38 tools */}
                        {index === 37 && displayedTools.length >= 40 && (
                          <AdSlot slotName="Sponsored Promotion" type="in-feed-banner" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </section>

              {/* Bottom In-Content Ad Placement (Native Recommendations) */}
              <AdSlot slotName="Sponsored Recommendations" type="native" />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenLegal={handleOpenLegal}
        onSelectCategory={(cat) => {
          handleSelectCategory(cat);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onOpenSitemap={handleOpenSitemap}
      />

      {/* Global Command Palette / Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        tools={TOOLS}
        onSelectTool={handleOpenTool}
      />

      {/* Legal & Information Modal */}
      <LegalModal
        initialTab={legalModalTab}
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />

      {/* Interactive Micro Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
