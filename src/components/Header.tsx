import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Star, Moon, Sun, MoreVertical, X, Shield, Info, HelpCircle, ArrowRight, Grid, Home, FileText, Mail } from 'lucide-react';
import { CATEGORIES } from '../data/toolsData';
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
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Close menu on Escape key press
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
    // Smooth scroll to tools grid after closing menu
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
    }, 100);
  };

  const handleFavoritesSelect = () => {
    setMenuOpen(false);
    onFavoritesClick();
    setTimeout(() => {
      const favSection = document.getElementById('favorites-section');
      if (favSection) {
        favSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        const grid = document.getElementById('tools-grid-section');
        grid?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);
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
      <header className="sticky top-0 z-40 bg-white/98 dark:bg-[#0B0B0C]/98 border-b border-neutral-200 dark:border-neutral-800 transition-colors w-full max-w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-4 overflow-hidden w-full max-w-full">
          {/* Brand & Logo */}
          <div
            onClick={handleHomeSelect}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink min-w-0"
          >
            {!logoFailed ? (
              <img
                src="/asbily.svg"
                alt="Asbily"
                onError={() => setLogoFailed(true)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain shrink-0"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-xs sm:text-sm shrink-0">
                A
              </div>
            )}
            <div className="min-w-0 truncate">
              <div className="flex items-center">
                <span className="font-bold text-xs sm:text-base tracking-tight text-[#111111] dark:text-neutral-100 group-hover:opacity-80 transition truncate">
                  Asbily Free Tools
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-neutral-400 font-medium tracking-wider uppercase truncate hidden xs:block">
                By Asbily Platforms
              </div>
            </div>
          </div>

          {/* Global Search Bar Trigger (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              onClick={onSearchClick}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-neutral-400 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <span>Search 40+ free browser tools...</span>
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-500">
                /
              </kbd>
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search icon (Mobile & Tablet) */}
            <button
              onClick={onSearchClick}
              className="md:hidden p-1.5 sm:p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition cursor-pointer"
              title="Search tools"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Favorites Button */}
            <button
              onClick={handleFavoritesSelect}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition text-neutral-700 dark:text-neutral-300 cursor-pointer"
              title="View saved favorites"
              aria-label="Favorites"
            >
              <Star className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-amber-500 fill-amber-500' : 'text-neutral-400'}`} />
              <span className="hidden sm:inline">Favorites</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 bg-neutral-100 dark:bg-neutral-800 rounded-full font-mono text-[10px]">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 sm:p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition cursor-pointer"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Dot Menu Button (3 Dots ⋮) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`p-1.5 sm:p-2 border rounded-lg transition cursor-pointer ${
                menuOpen
                  ? 'bg-[#111111] text-white dark:bg-white dark:text-black border-[#111111] dark:border-white'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              title="Open Navigation Menu"
              aria-label="Navigation Menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Drawer rendered into document.body via Portal to prevent any parent clipping */}
      {menuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
            {/* Backdrop: Clicking outside closes the menu */}
            <div
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/60 transition-opacity animate-in fade-in duration-200"
              aria-hidden="true"
            />

            {/* Full-Height Drawer Panel */}
            <div
              ref={menuRef}
              className="relative w-[85%] max-w-sm h-full max-h-screen bg-white dark:bg-[#0B0B0C] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 z-10"
            >
              {/* Drawer Top Section */}
              <div>
                {/* Header */}
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-[#0B0B0C]/95 backdrop-blur-xs z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black font-bold flex items-center justify-center text-xs">
                      A
                    </div>
                    <div>
                      <span className="font-bold text-sm text-[#111111] dark:text-neutral-100 block">
                        Asbily Navigation
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Fast access to all tools
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white transition cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Action Buttons */}
                <div className="p-3 border-b border-neutral-100 dark:border-neutral-900 grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={handleHomeSelect}
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 font-medium transition cursor-pointer text-left"
                  >
                    <Home className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={handleFavoritesSelect}
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 font-medium transition cursor-pointer text-left"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>Favorites ({favoritesCount})</span>
                  </button>
                  <button
                    onClick={handleSearchSelect}
                    className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 font-medium transition cursor-pointer col-span-2 text-left"
                  >
                    <Search className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Search 40+ Tools...</span>
                  </button>
                </div>

                {/* Tool Categories List */}
                <div className="p-4 space-y-1">
                  <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Tool Categories</span>
                    <span className="text-[9px] text-neutral-400 font-normal">Click to jump</span>
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full p-2.5 rounded-lg text-left text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#111111] text-white dark:bg-white dark:text-black font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Drawer Footer Information */}
              <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-2">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Information & Legal
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                  <button
                    onClick={() => handleLegalSelect('about')}
                    className="text-left hover:text-black dark:hover:text-white py-1 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Info className="w-3 h-3 text-neutral-400" />
                    <span>About Us</span>
                  </button>
                  <button
                    onClick={() => handleLegalSelect('privacy')}
                    className="text-left hover:text-black dark:hover:text-white py-1 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Shield className="w-3 h-3 text-neutral-400" />
                    <span>Privacy Policy</span>
                  </button>
                  <button
                    onClick={() => handleLegalSelect('terms')}
                    className="text-left hover:text-black dark:hover:text-white py-1 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-neutral-400" />
                    <span>Terms of Use</span>
                  </button>
                  <button
                    onClick={() => handleLegalSelect('disclaimer')}
                    className="text-left hover:text-black dark:hover:text-white py-1 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-neutral-400" />
                    <span>Disclaimer</span>
                  </button>
                  <button
                    onClick={() => handleLegalSelect('faq')}
                    className="text-left hover:text-black dark:hover:text-white py-1 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <HelpCircle className="w-3 h-3 text-neutral-400" />
                    <span>FAQ</span>
                  </button>
                  <button
                    onClick={() => handleLegalSelect('contact')}
                    className="text-left hover:text-black dark:hover:text-white py-1 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Mail className="w-3 h-3 text-neutral-400" />
                    <span>Contact</span>
                  </button>
                </div>
                <div className="text-[10px] text-neutral-400 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between">
                  <span>© {new Date().getFullYear()} Asbily Platforms</span>
                  <span className="font-medium text-neutral-500">Free Tools</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
