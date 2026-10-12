import React, { useState, useEffect } from 'react';
import { X, Shield, FileText, HelpCircle, Mail, Info, Check } from 'lucide-react';

interface LegalModalProps {
  initialTab?: 'about' | 'privacy' | 'terms' | 'disclaimer' | 'faq' | 'contact';
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ initialTab = 'about', isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#111111] dark:text-neutral-100">Asbily Platforms</span>
            <span className="text-neutral-400">·</span>
            <span className="text-xs text-neutral-500 uppercase tracking-wider">Information & Policies</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex overflow-x-auto border-b border-neutral-200 dark:border-neutral-800 px-4 gap-1 text-xs font-medium">
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
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'border-[#111111] dark:border-white text-[#111111] dark:text-white font-semibold'
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
          {activeTab === 'about' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111] dark:text-neutral-100">About Asbily Free Tools</h3>
              <p>
                <strong>Asbily Free Tools</strong> is an all-in-one suite of modern web utilities created and maintained by <strong>Asbily Platforms</strong>.
              </p>
              <p>
                Our mission is straightforward: <em>Free Tools. Simple Solutions.</em> We believe that essential utility tools—from JSON formatters to image compressors, calculators, and hashtag generators—should be fast, clean, and completely private.
              </p>
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900 space-y-1">
                <div className="font-semibold text-neutral-900 dark:text-neutral-100">Core Principles:</div>
                <div>• <strong>Privacy First:</strong> Operations occur locally in your browser.</div>
                <div>• <strong>Zero Friction:</strong> No paywalls, no required sign-ups, no invasive popups.</div>
                <div>• <strong>High Performance:</strong> Optimized JavaScript and Web Crypto APIs.</div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111] dark:text-neutral-100">Privacy Policy</h3>
              <p>
                At Asbily Free Tools (published by Asbily Platforms), user privacy is paramount.
              </p>
              <p>
                <strong>Client-Side Execution:</strong> All document conversions, hash computations, password generations, and image processing run entirely on your local device using standard HTML5 and JavaScript browser APIs. Your files, passwords, or texts are never uploaded to any remote backend server.
              </p>
              <p>
                <strong>Cookies & Local Storage:</strong> We only store non-sensitive application preferences in your browser's local storage (such as saved bookmarks, dark mode preference, and focus notes). No sensitive personal records are ever stored.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111] dark:text-neutral-100">Terms of Use</h3>
              <p>
                By accessing Asbily Free Tools, you agree to use our platform in compliance with applicable local and international laws.
              </p>
              <p>
                Our tools are provided on an "as is" and "as available" basis without warranties of any kind. You may use our tools for personal, educational, or commercial projects freely.
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111] dark:text-neutral-100">Disclaimer</h3>
              <p>
                The information and calculations provided on Asbily Free Tools (including loan calculations, tax estimations, and SEO checklists) are intended for educational and general informational purposes only. They do not constitute certified legal, financial, or tax advice.
              </p>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111] dark:text-neutral-100">Frequently Asked Questions</h3>
              <div className="space-y-2">
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Is Asbily Free Tools really 100% free?</div>
                  <div className="mt-1 text-neutral-500">Yes! Every utility on Asbily Free Tools is free for everyone worldwide with zero hidden costs.</div>
                </div>
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Does it work offline?</div>
                  <div className="mt-1 text-neutral-500">Yes! As a Progressive Web App (PWA), once loaded or installed on your device, client-side tools continue functioning even without an active internet connection.</div>
                </div>
                <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Are my files uploaded to your servers?</div>
                  <div className="mt-1 text-neutral-500">No. Files, images, and text are processed strictly inside your local browser instance via HTML5 Canvas and Web Crypto.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#111111] dark:text-neutral-100">Contact & Feedback</h3>
              <p>We welcome suggestions for new tools, bug reports, and partnership inquiries from the global community.</p>

              {feedbackSent ? (
                <div className="p-4 border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Thank you! Your feedback has been received and saved locally.</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-neutral-950 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-neutral-950 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Message or Tool Request</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Share your suggestion or report a problem..."
                      className="w-full p-2 border rounded bg-white dark:bg-neutral-950 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-xs font-semibold"
                  >
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
