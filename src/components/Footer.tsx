import React from 'react';
import { ShieldCheck, FileText, Bot, ExternalLink, Globe } from 'lucide-react';
import { TOOLS } from '../data/toolsData';

interface FooterProps {
  onOpenLegal: (tab: 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact') => void;
  onSelectCategory: (cat: any) => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onSelectCategory, onOpenSitemap }) => {
  return (
    <footer className="border-t border-white/10 bg-[#050505] text-[#FFFFFF] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/asbily.svg"
                alt="Asbily"
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                className="w-6 h-6 rounded invert"
              />
              <span className="font-bold text-base text-[#FFFFFF]">
                Asbily Free Tools
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Free Tools. Simple Solutions. All-in-one suite of modern, lightning-fast, and completely private browser utilities engineered by <strong className="text-[#FFFFFF]">Asbily Platforms</strong>.
            </p>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFFFFF]" />
              <span>Zero server logging · 100% Client-Side</span>
            </div>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FFFFFF]" />
              <span>Domain Priority: https://tools.asbily.com</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <div className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-3">
              Tool Suites
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button type="button" onClick={() => onSelectCategory('3d')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  3D & Spatial Studio
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('text')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Text & Unicode Tools
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('developer')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Developer JSON & Crypto
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('seo')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  SEO & Meta Tag Generators
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('image')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Image Compressor & Editors
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('pdf')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  PDF Merge, Split & CV
                </button>
              </li>
            </ul>
          </div>

          {/* Sitemaps & Public SEO Architecture */}
          <div>
            <div className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-3">
              <span>Public Sitemap & Robots</span>
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={onOpenSitemap}
                  className="hover:text-[#FFFFFF] transition flex items-center gap-1.5 font-medium text-[#EDEDED] cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#FFFFFF]" />
                  <span>Interactive HTML Sitemap Hub</span>
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-[#FFFFFF] transition flex items-center gap-1.5"
                >
                  <span>XML Sitemap (/sitemap.xml)</span>
                  <span className="text-[10px] font-mono text-[#EDEDED]">· {TOOLS.length} Tools</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener"
                  className="hover:text-[#FFFFFF] transition flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Robots.txt (/robots.txt)</span>
                  <span className="text-[10px] font-mono text-[#EDEDED]">· Allow: /</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li className="pt-1 text-[11px] text-neutral-500 leading-relaxed">
                Googlebot & Bingbot 100% crawl authorized with clean URL routing.
              </li>
            </ul>
          </div>

          {/* Legal & Platform */}
          <div>
            <div className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-3">
              Company & Legal
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button type="button" onClick={() => onOpenLegal('about')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  About Asbily Platforms
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenLegal('privacy')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenLegal('terms')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Terms of Use
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenLegal('disclaimer')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Disclaimer
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenLegal('faq')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenLegal('contact')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Contact & Feedback
                </button>
              </li>
              <li>
                <a
                  href="https://www.profitableratecpmnetwork.com/u3eqn3p98?key=2892f9f26e049737ea673e48542cacd6"
                  target="_blank"
                  rel="noopener sponsored"
                  className="text-neutral-400 hover:text-[#FFFFFF] transition inline-flex items-center gap-1"
                >
                  <span>Featured Partner Deals</span>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono">· Ad</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Asbily Platforms. All rights reserved. Brand: Asbily.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Client-Side · Zero Data Stored</span>
            <span className="text-neutral-700">|</span>
            <a href="/sitemap.xml" className="hover:text-[#FFFFFF] hover:underline">XML Sitemap</a>
            <span className="text-neutral-700">|</span>
            <a href="/robots.txt" className="hover:text-[#FFFFFF] hover:underline">Robots.txt</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
