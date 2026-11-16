import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';
import { LegalTab } from './LegalModal';
import { ToolCategory } from '../types';

interface FooterProps {
  onOpenLegal: (tab: LegalTab) => void;
  onSelectCategory: (cat: ToolCategory) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onSelectCategory }) => {
  const handleCategoryLink = (e: React.MouseEvent<HTMLAnchorElement>, cat: ToolCategory) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      onSelectCategory(cat);
    }
  };

  const handleLegalLink = (e: React.MouseEvent<HTMLAnchorElement>, tab: LegalTab) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      onOpenLegal(tab);
    }
  };

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
                Asbily Tools
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Free Tools. Simple Solutions. Local-first browser utilities built and maintained by{' '}
              <a
                href="https://asbily.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#FFFFFF] underline decoration-white/30 hover:decoration-white"
              >
                Asbily Platforms
              </a>
              .
            </p>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFFFFF]" />
              <span>100% Local-First · No External Tracking</span>
            </div>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#FFFFFF]" />
              <a href="https://tools.asbily.com" className="hover:text-[#FFFFFF] transition">
                https://tools.asbily.com
              </a>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <div className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-3">
              Tool Suites
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              {[
                { id: '3d' as ToolCategory, label: '3D & Spatial Studio' },
                { id: 'text' as ToolCategory, label: 'Text & Unicode Tools' },
                { id: 'developer' as ToolCategory, label: 'Developer JSON & Crypto' },
                { id: 'seo' as ToolCategory, label: 'SEO & Meta Tag Generators' },
                { id: 'image' as ToolCategory, label: 'Image Compressor & Editors' },
                { id: 'pdf' as ToolCategory, label: 'PDF Merge, Split & CV' },
              ].map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/${cat.id}`}
                    onClick={(e) => handleCategoryLink(e, cat.id)}
                    className="hover:text-[#FFFFFF] transition"
                  >
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business & Daily Suites */}
          <div>
            <div className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-3">
              Business & Everyday
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              {[
                { id: 'business' as ToolCategory, label: 'Business, Payroll & Inventory' },
                { id: 'daily' as ToolCategory, label: 'Everyday Life, Land & Khata' },
                { id: 'calculator' as ToolCategory, label: 'Finance & Scientific Calculators' },
                { id: 'productivity' as ToolCategory, label: 'Productivity & Time Tracking' },
                { id: 'qr' as ToolCategory, label: 'QR, Barcode & Payment Stands' },
                { id: 'media' as ToolCategory, label: 'Audio, Media & Diagnostics' },
              ].map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/${cat.id}`}
                    onClick={(e) => handleCategoryLink(e, cat.id)}
                    className="hover:text-[#FFFFFF] transition"
                  >
                    {cat.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Platform */}
          <div>
            <div className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-3">
              Asbily Platforms
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              {[
                { id: 'about' as LegalTab, label: 'About Us' },
                { id: 'privacy' as LegalTab, label: 'Privacy Policy' },
                { id: 'terms' as LegalTab, label: 'Terms of Use' },
                { id: 'disclaimer' as LegalTab, label: 'Disclaimer' },
                { id: 'faq' as LegalTab, label: 'Frequently Asked Questions' },
                { id: 'contact' as LegalTab, label: 'Contact & Feedback' },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`/${item.id}`}
                    onClick={(e) => handleLegalLink(e, item.id)}
                    className="hover:text-[#FFFFFF] transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/sitemap.xml" className="hover:text-[#FFFFFF] transition">
                  XML Sitemap
                </a>
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
            © {new Date().getFullYear()} Asbily Platforms. All rights reserved. Product: Asbily Tools.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Local-First Browser Execution · No Server Uploads</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
