import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Star, Moon, Sun, MoreVertical, X, Shield, Info, HelpCircle, ArrowRight, Home, FileText, Mail } from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import { ToolCategory } from '../types';

interface HeaderProps {
  onSearchClick: () => void;
  favoritesCount: number;
  onFavoritesClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenLegal: (tab: 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact') => void;
  selectedCategory: ToolCategory;
  onSelectCategory: (cat: ToolCategory) => void;
  onHomeClick: () => void;
  onOpenSitemap?: () => void;
  isSavedPage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  favoritesCount,
  onFavoritesClick,
  darkMode,
  onToggleDarkMode,
  onOpenLegal,
  selectedCategory,
  onSelectCategory,
  onHomeClick,
  onOpenSitemap,
  isSavedPage = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateHeader = () => {
      const currentY = window.scrollY || window.pageYOffset || 0;
      setIsScrolled(currentY > 12);

      if (menuOpen || currentY < 48) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current + 6) {
        setIsVisible(false);
      } else if (currentY < lastScrollY.current - 6) {
        setIsVisible(true);
      }

      lastScrollY.current = currentY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      setIsVisible(true);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const handleCategorySelect = (catId: ToolCategory) => {
    setMenuOpen(false);
    onSelectCategory(catId);
    setTimeout(() => {
      const section = document.getElementById('tools-grid-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
  };

  const handleHomeSelect = () => {
    setMenuOpen(false);
    onHomeClick();
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 80);
  };

  const handleFavoritesSelect = () => {
    setMenuOpen(false);
    onFavoritesClick();
  };

  const handleSearchSelect = () => {
    setMenuOpen(false);
    setTimeout(() => {
      onSearchClick();
    }, 100);
  };

  const handleLegalSelect = (tab: 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact') => {
    setMenuOpen(false);
    setTimeout(() => {
      onOpenLegal(tab);
    }, 100);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-[rgba(255,255,255,0.94)] dark:bg-[rgba(9,9,9,0.94)] backdrop-blur-md border-b border-black/10 dark:border-white/10 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        } ${isScrolled ? 'shadow-sm dark:shadow-black/40' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-8 w-full">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={handleHomeSelect}
            className="flex items-center gap-2.5 cursor-pointer select-none whitespace-nowrap shrink-0 text-left"
          >
            {!logoFailed ? (
              <img
                src="/asbily.svg"
                alt="Asbily"
                onError={() => setLogoFailed(true)}
                className="w-7 h-7 rounded-lg object-contain shrink-0 dark:invert"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] font-bold flex items-center justify-center text-xs shrink-0">
                A
              </div>
            )}
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-[#000000] dark:text-[#FFFFFF] whitespace-nowrap shrink-0">
              Asbily Tools
            </span>
          </button>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <button
              type="button"
              onClick={handleHomeSelect}
              className={`hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !isSavedPage && selectedCategory === 'all' ? 'text-[#000000] dark:text-[#FFFFFF] font-semibold' : ''
              }`}
            >
              All Tools
            </button>
            <button
              type="button"
              onClick={() => handleCategorySelect('3d')}
              className={`hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !isSavedPage && selectedCategory === '3d' ? 'text-[#000000] dark:text-[#FFFFFF] font-semibold' : ''
              }`}
            >
              3D Studio
            </button>
            <button
              type="button"
              onClick={() => handleCategorySelect('pdf')}
              className={`hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !isSavedPage && selectedCategory === 'pdf' ? 'text-[#000000] dark:text-[#FFFFFF] font-semibold' : ''
              }`}
            >
              PDF Tools
            </button>
            <button
              type="button"
              onClick={handleFavoritesSelect}
              className={`inline-flex items-center gap-1.5 hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isSavedPage ? 'text-[#000000] dark:text-[#FFFFFF] font-semibold' : ''
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-[#000000] fill-[#000000] dark:text-[#FFFFFF] dark:fill-[#FFFFFF]' : ''}`} />
              <span>Saved ({favoritesCount})</span>
            </button>
            {onOpenSitemap && (
              <button
                type="button"
                onClick={() => {
                  onOpenSitemap();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Directory
              </button>
            )}
          </nav>

          {/* Zone 3: Quick Actions & Drawer */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleFavoritesSelect}
              className={`md:hidden p-2 border rounded-lg transition cursor-pointer shrink-0 flex items-center gap-1 text-xs font-semibold ${
                isSavedPage
                  ? 'border-[#000000] bg-[#000000] text-[#FFFFFF] dark:border-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000]'
                  : 'border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF]'
              }`}
              title="Open Saved Tools"
              aria-label="Saved Tools"
            >
              <Star className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-current' : ''}`} />
              <span className="tabular-nums">{favoritesCount}</span>
            </button>

            <button
              type="button"
              onClick={onSearchClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#000000] hover:bg-[#090909] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] dark:text-[#000000] text-xs font-semibold transition whitespace-nowrap shrink-0 cursor-pointer"
              aria-label="Search tools"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono bg-white/15 dark:bg-black/15 rounded">
                /
              </kbd>
            </button>

            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 border border-black/15 dark:border-white/15 rounded-lg text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer shrink-0"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-2 border rounded-lg transition cursor-pointer shrink-0 ${
                menuOpen
                  ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] border-[#000000] dark:border-[#FFFFFF]'
                  : 'border-black/15 dark:border-white/15 text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10'
              }`}
              title="Open Navigation Menu"
              aria-label="Navigation Menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Navigation Drawer */}
      {menuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
            <div
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 transition-opacity"
              aria-hidden="true"
            />

            <div
              ref={menuRef}
              className="relative w-[85%] max-w-sm h-full max-h-screen bg-[#FFFFFF] dark:bg-[#090909] border-l border-black/10 dark:border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
            >
              <div>
                <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between sticky top-0 bg-[rgba(255,255,255,0.94)] dark:bg-[rgba(9,9,9,0.94)] backdrop-blur-xs z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] font-bold flex items-center justify-center text-xs">
                      A
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#000000] dark:text-[#FFFFFF] block">
                        Asbily Tools
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {TOOLS.length} Browser Utilities
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg border border-black/10 dark:border-white/15 text-neutral-500 hover:text-[#000000] dark:hover:text-[#FFFFFF] transition cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 border-b border-black/10 dark:border-white/10 grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleHomeSelect}
                    className="p-2.5 rounded-lg border border-black/10 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#050505] hover:bg-[#EDEDED] dark:hover:bg-white/10 flex items-center gap-2 font-medium transition cursor-pointer text-left text-[#000000] dark:text-[#FFFFFF]"
                  >
                    <Home className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFavoritesSelect}
                    className="p-2.5 rounded-lg border border-black/10 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#050505] hover:bg-[#EDEDED] dark:hover:bg-white/10 flex items-center gap-2 font-medium transition cursor-pointer text-left text-[#000000] dark:text-[#FFFFFF]"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>Saved ({favoritesCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSearchSelect}
                    className="p-2.5 rounded-lg border border-black/10 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#050505] hover:bg-[#EDEDED] dark:hover:bg-white/10 flex items-center gap-2 font-medium transition cursor-pointer col-span-2 text-left text-[#000000] dark:text-[#FFFFFF]"
                  >
                    <Search className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Search {TOOLS.length} Tools...</span>
                  </button>
                </div>

                <div className="p-4 space-y-1">
                  <div className="text-[11px] font-semibold text-neutral-500 mb-2 flex items-center justify-between">
                    <span>Categories</span>
                    <span>Select to filter</span>
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full p-2.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                        !isSavedPage && selectedCategory === cat.id
                          ? 'bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-[#F6F6F6] dark:hover:bg-white/10'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] space-y-2">
                <div className="text-[11px] font-semibold text-neutral-500 mb-1">
                  Platform & Legal
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <button type="button" onClick={() => handleLegalSelect('about')} className="text-left hover:text-[#000000] dark:hover:text-[#FFFFFF] py-1 flex items-center gap-1.5 transition cursor-pointer">
                    <Info className="w-3 h-3 text-neutral-400" /><span>About Us</span>
                  </button>
                  <button type="button" onClick={() => handleLegalSelect('privacy')} className="text-left hover:text-[#000000] dark:hover:text-[#FFFFFF] py-1 flex items-center gap-1.5 transition cursor-pointer">
                    <Shield className="w-3 h-3 text-neutral-400" /><span>Privacy</span>
                  </button>
                  <button type="button" onClick={() => handleLegalSelect('terms')} className="text-left hover:text-[#000000] dark:hover:text-[#FFFFFF] py-1 flex items-center gap-1.5 transition cursor-pointer">
                    <FileText className="w-3 h-3 text-neutral-400" /><span>Terms</span>
                  </button>
                  <button type="button" onClick={() => handleLegalSelect('disclaimer')} className="text-left hover:text-[#000000] dark:hover:text-[#FFFFFF] py-1 flex items-center gap-1.5 transition cursor-pointer">
                    <FileText className="w-3 h-3 text-neutral-400" /><span>Disclaimer</span>
                  </button>
                  <button type="button" onClick={() => handleLegalSelect('faq')} className="text-left hover:text-[#000000] dark:hover:text-[#FFFFFF] py-1 flex items-center gap-1.5 transition cursor-pointer">
                    <HelpCircle className="w-3 h-3 text-neutral-400" /><span>FAQ</span>
                  </button>
                  <button type="button" onClick={() => handleLegalSelect('contact')} className="text-left hover:text-[#000000] dark:hover:text-[#FFFFFF] py-1 flex items-center gap-1.5 transition cursor-pointer">
                    <Mail className="w-3 h-3 text-neutral-400" /><span>Contact</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenSitemap?.();
                    }}
                    className="text-left hover:text-[#000000] dark:hover:text-[#FFFFFF] py-1 flex items-center gap-1.5 transition cursor-pointer text-[#000000] dark:text-[#FFFFFF] font-medium"
                  >
                    <FileText className="w-3 h-3" /><span>Sitemap Hub</span>
                  </button>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener"
                    className="text-left hover:text-[#000000] dark:hover:text-[#FFFFFF] py-1 flex items-center gap-1.5 transition text-neutral-600 dark:text-neutral-400"
                  >
                    <Shield className="w-3 h-3 text-neutral-400" /><span>Robots.txt</span>
                  </a>
                </div>
                <div className="text-[11px] text-neutral-500 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                  <span>© {new Date().getFullYear()} Asbily Platforms</span>
                  <span>Client-Side</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
