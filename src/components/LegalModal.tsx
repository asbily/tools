import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, HelpCircle, Mail, Info, Check, Copy, Download, ExternalLink } from 'lucide-react';

export type LegalTab = 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact';

interface LegalModalProps {
  initialTab?: LegalTab;
  isOpen: boolean;
  onClose: () => void;
}

export const LegalContent: React.FC<{ activeTab: LegalTab }> = ({ activeTab }) => {
  const [contactName, setContactName] = useState('');
  const [contactTopic, setContactTopic] = useState('Tool Improvement / Bug Report');
  const [contactMessage, setContactMessage] = useState('');
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const formattedFeedback = [
    `Asbily Tools — User Feedback`,
    `Topic: ${contactTopic}`,
    `From: ${contactName.trim() || 'Anonymous User'}`,
    `Date: ${new Date().toISOString().slice(0, 10)}`,
    ``,
    contactMessage.trim() || '(Write your message above)',
  ].join('\n');

  const mailtoHref = `mailto:contact@asbily.com?subject=${encodeURIComponent(
    `[Asbily Tools] ${contactTopic}`
  )}&body=${encodeURIComponent(formattedFeedback)}`;

  const handleCopyFeedback = () => {
    if (!contactMessage.trim()) return;
    navigator.clipboard?.writeText(formattedFeedback).catch(() => {});
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2200);
  };

  const handleDownloadFeedback = () => {
    if (!contactMessage.trim()) return;
    const blob = new Blob([formattedFeedback], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asbily-tools-feedback-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (activeTab === 'about') {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#000000] dark:text-[#FFFFFF]">About Asbily Tools</h2>
        <p>
          <strong>Asbily Tools</strong> (<a href="https://tools.asbily.com" className="underline">tools.asbily.com</a>) is a practical browser-based utility suite created and published by <strong>Asbily Platforms</strong> (<a href="https://asbily.com" className="underline">asbily.com</a>).
        </p>
        <p>
          Guided by our principle — <em>Free Tools. Simple Solutions.</em> — Asbily Tools brings together everyday calculators, document converters, image processors, developer formatters, SEO helpers, QR generators, and 3D utilities in a single clean interface.
        </p>
        <div className="border border-black/10 dark:border-white/10 rounded-xl p-4 bg-[#F6F6F6] dark:bg-[#050505] space-y-2">
          <div className="font-semibold text-[#000000] dark:text-[#FFFFFF]">Architectural Commitments</div>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Local-First Processing:</strong> Tools execute directly inside your browser using HTML5 Canvas, Web Crypto, WebGL, and locally bundled libraries.</li>
            <li><strong>No Account Required:</strong> Open any utility immediately without registration, paywalls, or sign-in walls.</li>
            <li><strong>User-Controlled Data:</strong> Export your work as PDF, PNG, SVG, CSV, JSON, or TXT directly to your device.</li>
          </ul>
        </div>
      </div>
    );
  }

  if (activeTab === 'privacy') {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#000000] dark:text-[#FFFFFF]">Privacy Policy</h2>
        <p>
          This Privacy Policy explains how <strong>Asbily Tools</strong> (published by <strong>Asbily Platforms</strong>) handles information when you use <strong>tools.asbily.com</strong>.
        </p>

        <div className="space-y-2">
          <h3 className="font-bold text-[#000000] dark:text-[#FFFFFF]">1. Local Device Processing</h3>
          <p>
            Tool inputs, uploaded files, images, PDFs, text, passwords, hashes, and calculations are processed locally inside your web browser. Asbily Tools does not operate an application backend server to upload, inspect, or store the documents or inputs you process in our tools.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-[#000000] dark:text-[#FFFFFF]">2. Browser Storage (LocalStorage & Cache API)</h3>
          <p>
            Certain tools and preferences (such as theme selection, saved tool bookmarks, recently used tools, study notes, habit trackers, ledgers, and custom exchange rate overrides) store data in your browser&apos;s <strong>LocalStorage</strong> on your device. Offline assets are cached locally using the browser&apos;s <strong>Service Worker Cache API</strong>; user files and sensitive tool outputs are not cached by the Service Worker.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-[#000000] dark:text-[#FFFFFF]">3. Cookies, Advertising & Third-Party Requests</h3>
          <p>
            To keep Asbily Tools free to use without paywalls, the site displays clearly labeled banner, native, social bar, partner links, and periodic popunder advertisements (capped at a 20-minute interval) served via Adsterra (<span className="font-mono">profitableratecpmnetwork.com</span> / <span className="font-mono">highrevenueformat.com</span>). These advertising scripts may set standard cookies or receive standard browser request metadata according to their own privacy policies. Your actual files, documents, text, passwords, and calculations processed inside our tools are never shared with advertising partners. Standard static hosting infrastructure may also generate routine edge access logs.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-[#000000] dark:text-[#FFFFFF]">4. Data Retention, Exports & Deletion</h3>
          <p>
            LocalStorage is not permanent storage: clearing your browser site data, using private browsing mode, or uninstalling your browser can permanently remove saved tool records. You can inspect, export a JSON backup, restore, or delete stored keys anytime using the <strong>Browser Storage Explorer</strong> tool or your browser settings.
          </p>
        </div>
      </div>
    );
  }

  if (activeTab === 'terms') {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#000000] dark:text-[#FFFFFF]">Terms of Use</h2>
        <p>
          By accessing and using Asbily Tools, you agree to use the utilities responsibly and in accordance with applicable local and international laws.
        </p>
        <p>
          All utilities are provided free of charge for personal, educational, and commercial workflows on an &quot;as is&quot; and &quot;as available&quot; basis without express or implied warranties of uninterrupted availability or fitness for a specific regulated purpose.
        </p>
        <p>
          You retain full ownership and responsibility for any files, documents, designs, or outputs you create or process on your device using Asbily Tools.
        </p>
      </div>
    );
  }

  if (activeTab === 'disclaimer') {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#000000] dark:text-[#FFFFFF]">Disclaimer</h2>
        <p>
          Calculations, templates, and reference data provided by Asbily Tools — including loan/EMI estimates, tax/VAT breakdowns, land area conversions, currency reference conversions, BMI/BMR/TDEE health figures, contract/NDA templates, and SEO checklists — are intended for general informational and productivity purposes only.
        </p>
        <p>
          They do not constitute certified legal, financial, tax, medical, or regulatory advice. Always verify critical figures and legal documents with a qualified professional before relying on them for official filings or binding agreements.
        </p>
      </div>
    );
  }

  if (activeTab === 'faq') {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#000000] dark:text-[#FFFFFF]">Frequently Asked Questions</h2>
        <div className="space-y-2.5">
          {[
            {
              q: 'Is Asbily Tools free and account-free?',
              a: 'Yes. Every utility in Asbily Tools is free to use directly in your browser without creating an account.',
            },
            {
              q: 'Does Asbily Tools work offline?',
              a: 'Initial access requires an internet connection to load and cache the application shell and bundled libraries. Once loaded (or installed as a PWA), compatible client-side tools continue working offline.',
            },
            {
              q: 'Are my files or passwords uploaded anywhere?',
              a: 'No. File processing, PDF manipulation, image editing, 3D rendering, and cryptographic operations run locally inside your browser.',
            },
            {
              q: 'Is data saved in LocalStorage permanent?',
              a: 'No. Browser LocalStorage stays on your device, but clearing site data or switching browsers removes it. Use the JSON backup export in Browser Storage Explorer to keep safe copies.',
            },
            {
              q: 'How does the Currency Converter work without external APIs?',
              a: 'To protect privacy and work offline, it uses built-in reference rates and lets you enter and save exact custom exchange rates locally.',
            },
          ].map((item) => (
            <div key={item.q} className="p-3.5 border border-black/10 dark:border-white/10 rounded-xl bg-[#F6F6F6] dark:bg-[#050505]">
              <div className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{item.q}</div>
              <div className="mt-1 text-neutral-600 dark:text-neutral-400">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-[#000000] dark:text-[#FFFFFF]">Contact & Feedback</h2>
      <p>
        We welcome bug reports, usability suggestions, and tool improvement ideas for Asbily Tools.
      </p>
      <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-neutral-600 dark:text-neutral-400 leading-relaxed">
        <strong>Local-Only Notice:</strong> Asbily Tools does not run a backend contact server, so submitting a form here is <strong>not automatic</strong>. Compose your message below, then copy it, download a text file, or open your email app to send it directly to <span className="font-mono text-[#000000] dark:text-[#FFFFFF]">contact@asbily.com</span>.
      </div>

      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="contact-name" className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
              Your Name (Optional)
            </label>
            <input
              id="contact-name"
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your name"
              className="w-full p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-white dark:bg-neutral-950 text-xs text-[#000000] dark:text-[#FFFFFF]"
            />
          </div>
          <div>
            <label htmlFor="contact-topic" className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
              Topic
            </label>
            <select
              id="contact-topic"
              value={contactTopic}
              onChange={(e) => setContactTopic(e.target.value)}
              className="w-full p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-white dark:bg-neutral-950 text-xs text-[#000000] dark:text-[#FFFFFF]"
            >
              <option value="Tool Improvement / Bug Report">Tool Improvement / Bug Report</option>
              <option value="New Tool Suggestion">New Tool Suggestion</option>
              <option value="Accessibility / Mobile Issue">Accessibility / Mobile Issue</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
            Message
          </label>
          <textarea
            id="contact-message"
            rows={4}
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            placeholder="Describe the tool, expected behavior, or suggestion..."
            className="w-full p-2.5 border border-black/15 dark:border-white/15 rounded-lg bg-white dark:bg-neutral-950 text-xs text-[#000000] dark:text-[#FFFFFF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopyFeedback}
            disabled={!contactMessage.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            {copiedFeedback ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFeedback ? 'Feedback Copied' : 'Copy Feedback'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFeedback}
            disabled={!contactMessage.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10 disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>

          <a
            href={mailtoHref}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open Email App</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  );
};

export const LegalModal: React.FC<LegalModalProps> = ({ initialTab = 'about', isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Asbily Tools Information and Policies"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFFFF] dark:bg-[#090909] border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#000000] dark:text-[#FFFFFF]">Asbily Tools</span>
            <span className="text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 uppercase tracking-wider">By Asbily Platforms</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 px-4 gap-1 text-xs font-medium no-scrollbar">
          {[
            { id: 'about', label: 'About Us', icon: Info },
            { id: 'privacy', label: 'Privacy Policy', icon: Shield },
            { id: 'terms', label: 'Terms of Use', icon: FileText },
            { id: 'disclaimer', label: 'Disclaimer', icon: FileText },
            { id: 'faq', label: 'FAQ', icon: HelpCircle },
            { id: 'contact', label: 'Contact', icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id as LegalTab)}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#000000] dark:border-[#FFFFFF] text-[#000000] dark:text-[#FFFFFF] font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
          <LegalContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};
