import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact') => void;
  onSelectCategory: (cat: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onSelectCategory }) => {
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

          {/* Business & Daily Suites */}
          <div>
            <div className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-3">
              Business & Everyday
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button type="button" onClick={() => onSelectCategory('business')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Business, Payroll & Inventory
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('daily')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Everyday Life, Land & Khata
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('calculator')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Finance & Scientific Calculators
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('productivity')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Productivity & Time Tracking
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('qr')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  QR, Barcode & Payment Stands
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onSelectCategory('media')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  Audio, Media & Diagnostics
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Platform */}
          <div>
            <div className="text-xs font-semibold text-[#FFFFFF] uppercase tracking-wider mb-3">
              Asbily Platforms
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button type="button" onClick={() => onOpenLegal('about')} className="hover:text-[#FFFFFF] transition cursor-pointer">
                  About Us
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
