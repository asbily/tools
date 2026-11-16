/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOOLS, CATEGORIES } from './data/toolsData';
import { getToolGuide } from './data/toolGuides';
import { ToolCategory, ToolItem } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolCard } from './components/ToolCard';
import { ToolView } from './components/ToolView';
import { SavedToolsView } from './components/SavedToolsView';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { LegalContent, LegalModal, LegalTab } from './components/LegalModal';
import { OfflineIndicator, SwUpdateBanner } from './components/PWAControls';
import { ToastContainer, ToastMessage } from './components/Toast';
import { AdSlot } from './components/AdSlot';
import {
  Sparkles,
  Clock,
  Star,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  WifiOff,
  Layers,
  Cpu,
  HelpCircle,
  HardDrive,
} from 'lucide-react';

const INFO_PAGES: { id: LegalTab; label: string; title: string; description: string }[] = [
  {
    id: 'about',
    label: 'About Us',
    title: 'About Asbily Tools — Asbily Platforms',
    description:
      'Learn about Asbily Tools by Asbily Platforms: local-first browser utilities engineered for everyday work with no account required.',
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy — Asbily Tools',
    description:
      'Read how Asbily Tools processes inputs locally in your browser, uses LocalStorage and Service Worker caching, and protects your privacy.',
  },
  {
    id: 'terms',
    label: 'Terms of Use',
    title: 'Terms of Use — Asbily Tools',
    description: 'Terms governing use of the browser-based utilities published on Asbily Tools.',
  },
  {
    id: 'disclaimer',
    label: 'Disclaimer',
    title: 'Disclaimer — Asbily Tools',
    description:
      'Important informational notice regarding financial, tax, land area, health, currency reference, and template outputs on Asbily Tools.',
  },
  {
    id: 'faq',
    label: 'FAQ',
    title: 'Frequently Asked Questions — Asbily Tools',
    description:
      'Answers about local processing, offline PWA behavior, LocalStorage backups, currency conversion, and privacy on Asbily Tools.',
  },
  {
    id: 'contact',
    label: 'Contact',
    title: 'Contact & Feedback — Asbily Tools',
    description:
      'Compose feedback locally to copy, download, or send via email to contact@asbily.com.',
  },
];

const FEATURED_TOOL_IDS = [
  '3d-mockup-studio',
  'pdf-merge-split',
  'bg-color-remover',
  'product-payment-qr',
];

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [isSavedPage, setIsSavedPage] = useState(false);
  const [activeInfoPage, setActiveInfoPage] = useState<LegalTab | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTab>('about');
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

  // Parse route from URL pathname & legacy hash
  const syncRouteFromUrl = () => {
    const pathname = window.location.pathname.replace(/^\/|\/$/g, '');
    const segments = pathname.split('/').filter(Boolean);
    const hash = window.location.hash;

    if (hash && hash.startsWith('#tool=')) {
      const toolId = hash.replace('#tool=', '');
      const tool = TOOLS.find((t) => t.id === toolId);
      if (tool) {
        setIsSavedPage(false);
        setActiveInfoPage(null);
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

    // Info pages (/about, /privacy, /terms, /disclaimer, /faq, /contact)
    if (segments.length === 1 && INFO_PAGES.some((p) => p.id === segments[0])) {
      setIsSavedPage(false);
      setActiveTool(null);
      setSelectedCategory('all');
      setActiveInfoPage(segments[0] as LegalTab);
      return;
    }

    // /saved or /favorites -> Dedicated Saved Tools page
    if (segments.length === 1 && (segments[0] === 'saved' || segments[0] === 'favorites')) {
      setIsSavedPage(true);
      setActiveInfoPage(null);
      setActiveTool(null);
      setSelectedCategory('all');
      if (segments[0] === 'favorites') {
        window.history.replaceState(null, '', '/saved');
      }
      return;
    }

    // /category/toolId
    if (segments.length >= 2) {
      const toolSegment = segments[1];
      const tool = TOOLS.find((t) => t.id === toolSegment);
      if (tool) {
        setIsSavedPage(false);
        setActiveInfoPage(null);
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
        setActiveInfoPage(null);
        setSelectedCategory(segment as ToolCategory);
        setActiveTool(null);
        return;
      }

      const tool = TOOLS.find((t) => t.id === segment);
      if (tool) {
        setIsSavedPage(false);
        setActiveInfoPage(null);
        setActiveTool(tool);
        setSelectedCategory(tool.category);
        addRecentlyUsed(tool.id);
        window.history.replaceState(null, '', `/${tool.category}/${tool.id}`);
        return;
      }
    }

    // Root homepage
    setIsSavedPage(false);
    setActiveInfoPage(null);
    setActiveTool(null);
    setSelectedCategory('all');
  };

  useEffect(() => {
    syncRouteFromUrl();
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => window.removeEventListener('popstate', syncRouteFromUrl);
  }, []);

  // Update dynamic page title, meta, canonical URL, hreflang, and JSON-LD structured data
  useEffect(() => {
    let pageTitle = 'Asbily Tools — Free Online Tools for Everyday Work';
    let pageDesc =
      'Discover free, practical browser tools for productivity, business, development, PDF documents, images, 3D mockups, and daily tasks. Local-first processing with no account required.';
    let pageKeywords =
      'Asbily Tools, free online tools, browser utilities, PDF merge split, image compressor, background remover, JSON formatter, QR code generator, 3D mockup studio, calculators, developer tools';
    let canonicalPath = '/';
    let robotsContent = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    const graphItems: Record<string, any>[] = [
      {
        '@type': 'Organization',
        '@id': 'https://tools.asbily.com/#organization',
        name: 'Asbily Platforms',
        url: 'https://asbily.com',
        logo: 'https://tools.asbily.com/pwa-512x512.png',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://tools.asbily.com/#website',
        url: 'https://tools.asbily.com/',
        name: 'Asbily Tools',
        description: 'Free Tools. Simple Solutions. Browser-native utilities running locally on your device.',
        inLanguage: 'en',
        publisher: { '@id': 'https://tools.asbily.com/#organization' },
      },
    ];

    if (isSavedPage) {
      pageTitle = 'Saved Tools — Asbily Tools';
      pageDesc = 'Your locally saved tools in Asbily Tools for quick browser access.';
      canonicalPath = '/saved';
      robotsContent = 'noindex, follow';
    } else if (activeInfoPage) {
      const info = INFO_PAGES.find((p) => p.id === activeInfoPage);
      if (info) {
        pageTitle = info.title;
        pageDesc = info.description;
        pageKeywords = `${info.label}, Asbily Tools, Asbily Platforms, local-first browser tools`;
        canonicalPath = `/${info.id}`;
        graphItems.push({
          '@type': 'WebPage',
          url: `https://tools.asbily.com${canonicalPath}`,
          name: info.title,
          description: info.description,
          inLanguage: 'en',
          isPartOf: { '@id': 'https://tools.asbily.com/#website' },
        });
        graphItems.push({
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Asbily Tools', item: 'https://tools.asbily.com/' },
            { '@type': 'ListItem', position: 2, name: info.label, item: `https://tools.asbily.com${canonicalPath}` },
          ],
        });
        if (info.id === 'faq') {
          graphItems.push({
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Is Asbily Tools free and account-free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. Every utility in Asbily Tools is free to use directly in your browser without creating an account.',
                },
              },
              {
                '@type': 'Question',
                name: 'Does Asbily Tools work offline?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Initial access requires an internet connection to load and cache the application shell and bundled libraries. Once loaded or installed as a PWA, compatible client-side tools continue working offline.',
                },
              },
              {
                '@type': 'Question',
                name: 'Are my files or passwords uploaded anywhere?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. File processing, PDF manipulation, image editing, 3D rendering, and cryptographic operations run locally inside your browser.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is data saved in LocalStorage permanent?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No. Browser LocalStorage stays on your device, but clearing site data or switching browsers removes it. Use the JSON backup export in Browser Storage Explorer to keep safe copies.',
                },
              },
              {
                '@type': 'Question',
                name: 'How does the Currency Converter work without external APIs?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'To protect privacy and work offline, it uses built-in reference rates and lets you enter and save exact custom exchange rates locally.',
                },
              },
            ],
          });
        }
      }
    } else if (activeTool) {
      const guide = getToolGuide(activeTool);
      pageTitle = `${activeTool.name} — Free Online Tool | Asbily Tools`;
      pageDesc = `${activeTool.shortDesc} Runs locally in your browser with no server upload or account required.`;
      pageKeywords = `${activeTool.name}, ${activeTool.categoryLabel}, ${activeTool.tags.join(', ')}, free online tool, Asbily Tools`;
      canonicalPath = `/${activeTool.category}/${activeTool.id}`;

      graphItems.push({
        '@type': 'WebApplication',
        url: `https://tools.asbily.com${canonicalPath}`,
        name: activeTool.name,
        description: activeTool.shortDesc,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All modern web browsers',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        inLanguage: 'en',
        publisher: { '@id': 'https://tools.asbily.com/#organization' },
      });

      graphItems.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Asbily Tools', item: 'https://tools.asbily.com/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: activeTool.categoryLabel,
            item: `https://tools.asbily.com/${activeTool.category}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: activeTool.name,
            item: `https://tools.asbily.com${canonicalPath}`,
          },
        ],
      });

      if (guide.steps.length > 0) {
        graphItems.push({
          '@type': 'HowTo',
          name: `How to use ${activeTool.name}`,
          description: activeTool.shortDesc,
          step: guide.steps.map((stepText, idx) => ({
            '@type': 'HowToStep',
            position: idx + 1,
            text: stepText,
          })),
        });
      }

      if (guide.faqs.length > 0) {
        graphItems.push({
          '@type': 'FAQPage',
          mainEntity: guide.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        });
      }
    } else if (selectedCategory && selectedCategory !== 'all') {
      const cat = CATEGORIES.find((c) => c.id === selectedCategory);
      const catTools = TOOLS.filter((t) => t.category === selectedCategory);
      pageTitle = `${cat?.name || selectedCategory} — Free Online Tools | Asbily Tools`;
      pageDesc = `${cat?.description || 'Browse local-first browser utilities'}. Private client-side tools by Asbily Platforms.`;
      pageKeywords = `${cat?.name || selectedCategory}, ${catTools.slice(0, 8).map((t) => t.name).join(', ')}, Asbily Tools`;
      canonicalPath = `/${selectedCategory}`;

      graphItems.push({
        '@type': 'CollectionPage',
        url: `https://tools.asbily.com${canonicalPath}`,
        name: `${cat?.name || selectedCategory} — Asbily Tools`,
        description: pageDesc,
        inLanguage: 'en',
        isPartOf: { '@id': 'https://tools.asbily.com/#website' },
      });

      graphItems.push({
        '@type': 'ItemList',
        name: `${cat?.name || selectedCategory} Directory`,
        numberOfItems: catTools.length,
        itemListElement: catTools.map((t, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: t.name,
          url: `https://tools.asbily.com/${t.category}/${t.id}`,
        })),
      });

      graphItems.push({
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Asbily Tools', item: 'https://tools.asbily.com/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: cat?.name || selectedCategory,
            item: `https://tools.asbily.com${canonicalPath}`,
          },
        ],
      });
    } else {
      graphItems.push({
        '@type': 'WebApplication',
        '@id': 'https://tools.asbily.com/#webapp',
        url: 'https://tools.asbily.com/',
        name: 'Asbily Tools',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All modern web browsers',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        inLanguage: 'en',
        publisher: { '@id': 'https://tools.asbily.com/#organization' },
      });

      graphItems.push({
        '@type': 'ItemList',
        name: 'Asbily Tools Categories',
        numberOfItems: CATEGORIES.filter((c) => c.id !== 'all').length,
        itemListElement: CATEGORIES.filter((c) => c.id !== 'all').map((c, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: c.name,
          url: `https://tools.asbily.com/${c.id}`,
        })),
      });

      graphItems.push({
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Do I need an account or subscription to use Asbily Tools?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Every tool on tools.asbily.com opens directly in your browser without registration, login walls, or paywalls.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are uploaded files, PDFs, or text sent to any server?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. File parsing, image editing, PDF merging, cryptographic hashing, and 3D rendering run locally inside your browser.',
            },
          },
          {
            '@type': 'Question',
            name: 'Will Asbily Tools work on my first visit without internet?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Your browser must first load the website online so the Service Worker can cache the app shell and assets. After caching, compatible tools work offline.',
            },
          },
          {
            '@type': 'Question',
            name: 'How safe is data saved inside LocalStorage?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'LocalStorage stays on your device, not on our servers, but clearing browser site data can erase it. Use JSON or CSV exports for permanent backups.',
            },
          },
        ],
      });
    }

    document.title = pageTitle;

    const fullCanonicalUrl = `https://tools.asbily.com${canonicalPath}`;
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) canonicalEl.setAttribute('href', fullCanonicalUrl);

    const altEnEl = document.querySelector('link[rel="alternate"][hreflang="en"]');
    if (altEnEl) altEnEl.setAttribute('href', fullCanonicalUrl);

    const altDefaultEl = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
    if (altDefaultEl) altDefaultEl.setAttribute('href', fullCanonicalUrl);

    const robotsEl = document.querySelector('meta[name="robots"]');
    if (robotsEl) robotsEl.setAttribute('content', robotsContent);

    const googlebotEl = document.querySelector('meta[name="googlebot"]');
    if (googlebotEl) googlebotEl.setAttribute('content', robotsContent);

    const bingbotEl = document.querySelector('meta[name="bingbot"]');
    if (bingbotEl) bingbotEl.setAttribute('content', robotsContent);

    const keywordsEl = document.querySelector('meta[name="keywords"]');
    if (keywordsEl) keywordsEl.setAttribute('content', pageKeywords);

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', pageDesc);

    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    if (ogTitleEl) ogTitleEl.setAttribute('content', pageTitle);

    const ogDescEl = document.querySelector('meta[property="og:description"]');
    if (ogDescEl) ogDescEl.setAttribute('content', pageDesc);

    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    if (ogUrlEl) ogUrlEl.setAttribute('content', fullCanonicalUrl);

    const twTitleEl = document.querySelector('meta[name="twitter:title"]');
    if (twTitleEl) twTitleEl.setAttribute('content', pageTitle);

    const twDescEl = document.querySelector('meta[name="twitter:description"]');
    if (twDescEl) twDescEl.setAttribute('content', pageDesc);

    const jsonLdEl = document.getElementById('asbily-jsonld');
    if (jsonLdEl) {
      jsonLdEl.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': graphItems,
      });
    }
  }, [activeTool, selectedCategory, isSavedPage, activeInfoPage]);

  // Global keyboard shortcut '/' or Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
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
    setActiveInfoPage(null);
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
    setActiveInfoPage(null);
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
    setActiveInfoPage(null);
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
    setActiveInfoPage(null);
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSaved = () => {
    if (window.location.pathname !== '/saved') {
      window.history.pushState(null, '', '/saved');
    }
    setIsSavedPage(true);
    setActiveInfoPage(null);
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (tab: LegalTab) => {
    const newPath = `/${tab}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
    setIsLegalModalOpen(false);
    setIsSavedPage(false);
    setActiveTool(null);
    setSelectedCategory('all');
    setActiveInfoPage(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const popularTools = useMemo(() => TOOLS.filter((t) => t.popular).slice(0, 8), []);
  const featuredTools = useMemo(
    () =>
      FEATURED_TOOL_IDS.map((id) => TOOLS.find((t) => t.id === id)).filter((t): t is ToolItem =>
        Boolean(t)
      ),
    []
  );
  const newTools = useMemo(() => TOOLS.filter((t) => t.isNew).slice(0, 8), []);

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

  const isDefaultHome = !searchQuery && selectedCategory === 'all';

  const currentViewKey = isSavedPage
    ? 'saved'
    : activeInfoPage
      ? `info-${activeInfoPage}`
      : activeTool
        ? `tool-${activeTool.id}`
        : `home-${selectedCategory}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF] transition-colors selection:bg-[#000000] selection:text-[#FFFFFF] overflow-x-clip w-full max-w-full">
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
        isSavedPage={isSavedPage}
      />

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
            ) : activeInfoPage ? (
              <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/10 dark:border-white/10">
                  <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    <button
                      type="button"
                      onClick={handleGoHome}
                      className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Asbily Tools</span>
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    <span className="text-[#000000] dark:text-[#FFFFFF] font-semibold">
                      {INFO_PAGES.find((p) => p.id === activeInfoPage)?.label}
                    </span>
                  </nav>
                </div>

                <div className="flex flex-wrap gap-2">
                  {INFO_PAGES.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleOpenLegal(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        activeInfoPage === tab.id
                          ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                          : 'bg-[#FFFFFF] dark:bg-[#090909] border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-300 hover:bg-[#F6F6F6] dark:hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <article className="border border-black/10 dark:border-white/10 rounded-2xl p-6 sm:p-8 bg-[#FFFFFF] dark:bg-[#090909] text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 space-y-4">
                  <LegalContent activeTab={activeInfoPage} />
                </article>
              </div>
            ) : activeTool ? (
              <ToolView
                tool={activeTool}
                onBack={handleBackFromTool}
                onSelectCategory={(cat) => {
                  handleSelectCategory(cat);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                isFavorite={favorites.includes(activeTool.id)}
                onToggleFavorite={toggleFavorite}
                onSelectTool={handleOpenTool}
                favorites={favorites}
                onShowToast={showToast}
              />
            ) : (
              <div className="space-y-12">
                {/* Sections 1 & 2: Hero + Search Tools + Category Filter Bar */}
                <Hero
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleSelectCategory}
                  totalToolsCount={TOOLS.length}
                  onQuickToolClick={handleQuickToolClick}
                  darkMode={darkMode}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14 w-full max-w-full overflow-hidden">
                  <AdSlot slotName="Sponsored Advertisement" type="responsive-header" />

                  {/* Quick Local Workspace Bar */}
                  {isDefaultHome && (favoriteToolItems.length > 0 || recentToolItems.length > 0) && (
                    <section className="p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        {recentToolItems.length > 0 ? (
                          <>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#000000] dark:text-[#FFFFFF] shrink-0 mr-1">
                              <Clock className="w-3.5 h-3.5 text-neutral-500" />
                              <span>Recent:</span>
                            </span>
                            {recentToolItems.slice(0, 4).map((tool) => (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => handleOpenTool(tool)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#FFFFFF] dark:bg-[#090909] border border-black/10 dark:border-white/15 hover:border-[#000000] dark:hover:border-[#FFFFFF] text-xs font-medium text-[#000000] dark:text-[#FFFFFF] transition cursor-pointer truncate max-w-[180px]"
                              >
                                {tool.name}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={clearRecentlyUsed}
                              className="p-1.5 text-neutral-500 hover:text-[#000000] dark:hover:text-[#FFFFFF] transition cursor-pointer"
                              title="Clear recent history"
                              aria-label="Clear recent history"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">
                            Star your favorite utilities for quick local access in Saved Tools.
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenSaved}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold hover:opacity-90 transition shrink-0 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Open Saved Tools ({favoriteToolItems.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </section>
                  )}

                  {/* Section 3: Popular Tools */}
                  {isDefaultHome && popularTools.length > 0 && (
                    <section aria-labelledby="heading-popular-tools" className="space-y-5">
                      <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10">
                        <div>
                          <h2
                            id="heading-popular-tools"
                            className="text-base sm:text-lg font-bold tracking-tight text-[#000000] dark:text-[#FFFFFF]"
                          >
                            Popular Tools
                          </h2>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Frequently used utilities across documents, images, code, and everyday workflows.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {popularTools.map((tool) => (
                          <ToolCard
                            key={`pop-${tool.id}`}
                            tool={tool}
                            onOpen={handleOpenTool}
                            isFavorite={favorites.includes(tool.id)}
                            onToggleFavorite={toggleFavorite}
                            onShowToast={showToast}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Section 4: Browse Categories */}
                  {isDefaultHome && (
                    <section id="browse-categories-section" aria-labelledby="heading-categories" className="space-y-5">
                      <div className="pb-2.5 border-b border-black/10 dark:border-white/10">
                        <h2
                          id="heading-categories"
                          className="text-base sm:text-lg font-bold tracking-tight text-[#000000] dark:text-[#FFFFFF]"
                        >
                          Browse Categories
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Explore all 15 dedicated tool suites organized by domain.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
                          const catCount = TOOLS.filter((t) => t.category === cat.id).length;
                          return (
                            <a
                              key={cat.id}
                              href={`/${cat.id}`}
                              onClick={(e) => {
                                if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                                  e.preventDefault();
                                  handleSelectCategory(cat.id);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                              }}
                              className="group text-left p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] hover:border-[#000000] dark:hover:border-[#FFFFFF] transition-colors flex flex-col justify-between gap-3 cursor-pointer"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-bold text-sm text-[#000000] dark:text-[#FFFFFF]">
                                    {cat.name}
                                  </span>
                                  <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 tabular-nums shrink-0">
                                    {catCount} tools
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                  {cat.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-semibold text-[#000000] dark:text-[#FFFFFF]">
                                <span>Open Suite</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Section 5: Featured Tools */}
                  {isDefaultHome && featuredTools.length > 0 && (
                    <section aria-labelledby="heading-featured-tools" className="space-y-5">
                      <div className="pb-2.5 border-b border-black/10 dark:border-white/10">
                        <h2
                          id="heading-featured-tools"
                          className="text-base sm:text-lg font-bold tracking-tight text-[#000000] dark:text-[#FFFFFF]"
                        >
                          Featured Tools
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Advanced interactive workspaces powered by WebGL, Canvas, and client-side PDF engines.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {featuredTools.map((tool) => (
                          <ToolCard
                            key={`feat-${tool.id}`}
                            tool={tool}
                            onOpen={handleOpenTool}
                            isFavorite={favorites.includes(tool.id)}
                            onToggleFavorite={toggleFavorite}
                            onShowToast={showToast}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Section 6: Recently Added Tools */}
                  {isDefaultHome && newTools.length > 0 && (
                    <section aria-labelledby="heading-recent-tools" className="space-y-5">
                      <div className="pb-2.5 border-b border-black/10 dark:border-white/10">
                        <h2
                          id="heading-recent-tools"
                          className="text-base sm:text-lg font-bold tracking-tight text-[#000000] dark:text-[#FFFFFF]"
                        >
                          Recently Added Tools
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Latest local-first additions across business, image, PDF, and daily utilities.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {newTools.map((tool) => (
                          <ToolCard
                            key={`new-${tool.id}`}
                            tool={tool}
                            onOpen={handleOpenTool}
                            isFavorite={favorites.includes(tool.id)}
                            onToggleFavorite={toggleFavorite}
                            onShowToast={showToast}
                          />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Complete Directory Grid / Filtered Results */}
                  <section id="tools-grid-section" className="space-y-6 w-full max-w-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-[#000000] dark:text-[#FFFFFF]">
                          {selectedCategory === 'all'
                            ? 'Complete Tools Directory'
                            : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                          <span className="ml-2 text-xs font-normal text-neutral-500 dark:text-neutral-400 tabular-nums">
                            ({displayedTools.length} {displayedTools.length === 1 ? 'tool' : 'tools'})
                          </span>
                        </h2>
                      </div>

                      {selectedCategory !== 'all' && (
                        <button
                          type="button"
                          onClick={() => handleSelectCategory('all')}
                          className="text-xs text-[#000000] dark:text-[#FFFFFF] hover:underline cursor-pointer font-semibold"
                        >
                          Show All Categories
                        </button>
                      )}
                    </div>

                    {displayedTools.length === 0 ? (
                      <div className="p-12 sm:p-16 border border-dashed border-black/15 dark:border-white/15 rounded-2xl bg-[#F6F6F6] dark:bg-[#050505] text-center space-y-3">
                        <div className="text-base font-semibold text-[#000000] dark:text-[#FFFFFF]">
                          No tools match your query &quot;{searchQuery}&quot;
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          Try searching with different keywords or browse our categories.
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            handleSelectCategory('all');
                          }}
                          className="mt-2 px-4 py-2 bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] rounded-lg text-xs font-semibold cursor-pointer hover:opacity-90 transition"
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
                            {index === 5 && displayedTools.length > 6 && (
                              <AdSlot
                                slotName="Sponsored In-Feed Banner"
                                type="in-feed-banner"
                                className="col-span-full"
                              />
                            )}
                            {index === 13 && displayedTools.length > 14 && (
                              <AdSlot
                                slotName="Sponsored Card"
                                type="300x250"
                                className="mx-auto h-full flex flex-col justify-center"
                              />
                            )}
                            {index === 21 && displayedTools.length > 22 && (
                              <AdSlot
                                slotName="Sponsored In-Feed Banner"
                                type="in-feed-banner"
                                className="col-span-full"
                              />
                            )}
                            {index === 29 && displayedTools.length > 30 && (
                              <AdSlot
                                slotName="Sponsored Card"
                                type="300x250"
                                className="mx-auto h-full flex flex-col justify-center"
                              />
                            )}
                            {index === 37 && displayedTools.length > 38 && (
                              <AdSlot
                                slotName="Sponsored In-Feed Banner"
                                type="in-feed-banner"
                                className="col-span-full"
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Section 7: Why Asbily Tools? */}
                  {isDefaultHome && (
                    <section aria-labelledby="heading-why-asbily" className="space-y-5">
                      <div className="pb-2.5 border-b border-black/10 dark:border-white/10">
                        <h2
                          id="heading-why-asbily"
                          className="text-base sm:text-lg font-bold tracking-tight text-[#000000] dark:text-[#FFFFFF]"
                        >
                          Why Asbily Tools?
                        </h2>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Engineered by Asbily Platforms for clarity, predictability, and everyday reliability.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          {
                            icon: Layers,
                            title: 'Unified Directory',
                            desc: `${TOOLS.length} practical utilities across 15 categories in one consistent workspace without switching sites.`,
                          },
                          {
                            icon: Cpu,
                            title: 'Browser-Native Speed',
                            desc: 'Built directly on HTML5 Canvas, Web Crypto, File APIs, and Three.js with zero server queues.',
                          },
                          {
                            icon: Sparkles,
                            title: 'Clean Distraction-Free UI',
                            desc: 'Monochrome high-contrast interface with light/dark themes, keyboard shortcuts, and mobile layouts.',
                          },
                          {
                            icon: HardDrive,
                            title: 'Portable Local Exports',
                            desc: 'Download outputs directly as PDF, PNG, SVG, CSV, JSON, STL, or ICS—and back up LocalStorage anytime.',
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.title}
                              className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] space-y-2.5"
                            >
                              <div className="w-9 h-9 rounded-xl bg-[#FFFFFF] dark:bg-[#090909] border border-black/10 dark:border-white/15 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
                              </div>
                              <h3 className="text-sm font-bold text-[#000000] dark:text-[#FFFFFF]">
                                {item.title}
                              </h3>
                              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {item.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* Section 8: Privacy & Local Processing */}
                  {isDefaultHome && (
                    <section
                      aria-labelledby="heading-privacy-local"
                      className="rounded-2xl bg-[#090909] text-[#FFFFFF] border border-white/10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                    >
                      <div className="space-y-2.5 max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400">
                          <ShieldCheck className="w-4 h-4 text-[#FFFFFF]" />
                          <span>Privacy & Local Processing</span>
                        </div>
                        <h2
                          id="heading-privacy-local"
                          className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFFFF]"
                        >
                          Your Files and Inputs Stay on Your Device.
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                          Asbily Tools executes calculations, PDF merges, image edits, QR scans, and cryptographic hashes inside your local browser sandbox—never on remote processing servers. Where tools save notes or ledgers in LocalStorage, you can inspect, export, or clear backups anytime.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleQuickToolClick('storage-viewer')}
                          className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] text-[#000000] text-xs font-semibold hover:bg-[#EDEDED] transition cursor-pointer"
                        >
                          Open Storage Backup Explorer
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenLegal('privacy')}
                          className="px-4 py-2.5 rounded-xl border border-white/20 text-[#FFFFFF] text-xs font-semibold hover:bg-white/10 transition cursor-pointer"
                        >
                          Read Privacy Policy
                        </button>
                      </div>
                    </section>
                  )}

                  {/* Section 9: Offline & PWA Information */}
                  {isDefaultHome && (
                    <section
                      aria-labelledby="heading-offline-pwa"
                      className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                    >
                      <div className="lg:col-span-8 space-y-2">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                          <WifiOff className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
                          <span>Offline & PWA Information</span>
                        </div>
                        <h2
                          id="heading-offline-pwa"
                          className="text-lg sm:text-xl font-bold text-[#000000] dark:text-[#FFFFFF]"
                        >
                          Install Asbily Tools for Cached Offline Access
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          First-time visits require an active internet connection so your browser can download and cache the app shell and bundled tool chunks. Once loaded—or installed via your browser&apos;s Add to Home Screen / Install prompt—compatible calculators, formatters, PDF generators, image tools, and 3D workspaces continue working without internet connectivity.
                        </p>
                      </div>
                      <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                        <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] text-xs">
                          <div className="font-semibold text-[#000000] dark:text-[#FFFFFF]">Browser-Dependent Features</div>
                          <div className="text-neutral-600 dark:text-neutral-400 mt-1">
                            Hardware permissions (camera QR scanner, microphone dictation, screen capture) and OS speech engines depend on your browser&apos;s native support.
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Section 10: Homepage Frequently Asked Questions */}
                  {isDefaultHome && (
                    <section aria-labelledby="heading-home-faq" className="space-y-5">
                      <div className="flex items-center justify-between pb-2.5 border-b border-black/10 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
                          <h2
                            id="heading-home-faq"
                            className="text-base sm:text-lg font-bold tracking-tight text-[#000000] dark:text-[#FFFFFF]"
                          >
                            Frequently Asked Questions
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenLegal('faq')}
                          className="text-xs font-semibold text-[#000000] dark:text-[#FFFFFF] hover:underline cursor-pointer"
                        >
                          View Full FAQ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            q: 'Do I need an account or subscription to use Asbily Tools?',
                            a: 'No. Every tool on tools.asbily.com opens directly in your browser without registration, login walls, or paywalls.',
                          },
                          {
                            q: 'Are uploaded files, PDFs, or text sent to any server?',
                            a: 'No. File parsing, image editing, PDF merging, cryptographic hashing, and 3D rendering run locally inside your browser.',
                          },
                          {
                            q: 'Will Asbily Tools work on my first visit without internet?',
                            a: 'No. Your browser must first load the website online so the Service Worker can cache the app shell and assets. After caching, compatible tools work offline.',
                          },
                          {
                            q: 'How safe is data saved inside LocalStorage?',
                            a: 'LocalStorage stays on your device, not on our servers, but clearing browser site data can erase it. Use JSON or CSV exports for permanent backups.',
                          },
                        ].map((item) => (
                          <div
                            key={item.q}
                            className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] space-y-1.5"
                          >
                            <h3 className="text-xs sm:text-sm font-bold text-[#000000] dark:text-[#FFFFFF]">
                              {item.q}
                            </h3>
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <div className="flex justify-center w-full max-w-full overflow-hidden">
                    <AdSlot slotName="Sponsored Recommendations" type="native" />
                  </div>
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

      <OfflineIndicator />
      <SwUpdateBanner />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
