import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact') => void;
  onSelectCategory: (cat: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onSelectCategory }) => {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0B0B0C] mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/asbily.svg"
                alt="Asbily"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                className="w-6 h-6 rounded"
              />
              <span className="font-bold text-base text-[#111111] dark:text-neutral-100">
                Asbily Free Tools
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
              Free Tools. Simple Solutions. All-in-one suite of modern, lightning-fast, and completely private browser utilities engineered by <strong>Asbily Platforms</strong>.
            </p>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero server logging · 100% Client-Side Architecture</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-3">
              Tool Suites
            </div>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <li>
                <button onClick={() => onSelectCategory('text')} className="hover:text-black dark:hover:text-white transition">
                  Text & Unicode Tools
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('social')} className="hover:text-black dark:hover:text-white transition">
                  Social Media Hashtag Generator
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('developer')} className="hover:text-black dark:hover:text-white transition">
                  Developer JSON & Crypto
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('seo')} className="hover:text-black dark:hover:text-white transition">
                  SEO & Meta Tag Generators
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('image')} className="hover:text-black dark:hover:text-white transition">
                  Image Compressor & Converters
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('pdf')} className="hover:text-black dark:hover:text-white transition">
                  PDF & Commercial Invoices
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Platform */}
          <div>
            <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-3">
              Company & Legal
            </div>
            <ul className="space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
              <li>
                <button onClick={() => onOpenLegal('about')} className="hover:text-black dark:hover:text-white transition">
                  About Asbily Platforms
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-black dark:hover:text-white transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-black dark:hover:text-white transition">
                  Terms of Use
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('disclaimer')} className="hover:text-black dark:hover:text-white transition">
                  Disclaimer
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('faq')} className="hover:text-black dark:hover:text-white transition">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('contact')} className="hover:text-black dark:hover:text-white transition">
                  Contact & Feedback
                </button>
              </li>
              <li>
                <a
                  href="https://www.profitableratecpmnetwork.com/u3eqn3p98?key=2892f9f26e049737ea673e48542cacd6"
                  target="_blank"
                  rel="noopener sponsored"
                  className="text-neutral-500 hover:text-black dark:hover:text-white transition inline-flex items-center gap-1"
                >
                  <span>Featured Partner Deals</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-400 uppercase font-mono">Ad</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div>
            © {new Date().getFullYear()} Asbily Platforms. All rights reserved. Brand: Asbily.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Designed for fast, secure productivity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
