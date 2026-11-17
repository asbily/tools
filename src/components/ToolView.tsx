import React, { Suspense, lazy, useState } from 'react';
import {
  ArrowLeft,
  Star,
  Share2,
  Check,
  ShieldCheck,
  HelpCircle,
  ChevronRight,
  RotateCcw,
  BookOpen,
  Lightbulb,
  WifiOff,
} from 'lucide-react';
import { ToolCategory, ToolItem } from '../types';
import { TOOLS } from '../data/toolsData';
import { getToolGuide } from '../data/toolGuides';
import { ToolCard } from './ToolCard';
import { AdSlot } from './AdSlot';

const TextTools = lazy(() => import('./tools/TextTools').then((m) => ({ default: m.TextTools })));
const SocialMediaTools = lazy(() => import('./tools/SocialMediaTools').then((m) => ({ default: m.SocialMediaTools })));
const DeveloperTools = lazy(() => import('./tools/DeveloperTools').then((m) => ({ default: m.DeveloperTools })));
const WebsiteSeoTools = lazy(() => import('./tools/WebsiteSeoTools').then((m) => ({ default: m.WebsiteSeoTools })));
const ImageDesignTools = lazy(() => import('./tools/ImageDesignTools').then((m) => ({ default: m.ImageDesignTools })));
const PdfDocumentTools = lazy(() => import('./tools/PdfDocumentTools').then((m) => ({ default: m.PdfDocumentTools })));
const SecurityPrivacyTools = lazy(() => import('./tools/SecurityPrivacyTools').then((m) => ({ default: m.SecurityPrivacyTools })));
const CalculatorsTools = lazy(() => import('./tools/CalculatorsTools').then((m) => ({ default: m.CalculatorsTools })));
const StudentTools = lazy(() => import('./tools/StudentTools').then((m) => ({ default: m.StudentTools })));
const BusinessProductivityTools = lazy(() =>
  import('./tools/BusinessProductivityTools').then((m) => ({ default: m.BusinessProductivityTools }))
);
const QrBarcodeTools = lazy(() => import('./tools/QrBarcodeTools').then((m) => ({ default: m.QrBarcodeTools })));
const MediaBrowserTools = lazy(() => import('./tools/MediaBrowserTools').then((m) => ({ default: m.MediaBrowserTools })));
const ThreeDTools = lazy(() => import('./tools/ThreeDTools').then((m) => ({ default: m.ThreeDTools })));
const DailyLifeTools = lazy(() => import('./tools/DailyLifeTools').then((m) => ({ default: m.DailyLifeTools })));
const AiTools = lazy(() => import('./tools/AiTools').then((m) => ({ default: m.AiTools })));
const FileConverterTools = lazy(() =>
  import('./tools/FileConverterTools').then((m) => ({ default: m.FileConverterTools }))
);

interface ToolViewProps {
  tool: ToolItem;
  onBack: () => void;
  onSelectCategory?: (category: ToolCategory) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectTool: (t: ToolItem) => void;
  favorites: string[];
  onShowToast?: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const ToolView: React.FC<ToolViewProps> = ({
  tool,
  onBack,
  onSelectCategory,
  isFavorite,
  onToggleFavorite,
  onSelectTool,
  favorites,
  onShowToast,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [workspaceKey, setWorkspaceKey] = useState(0);

  const guide = getToolGuide(tool);

  const handleShare = async () => {
    const base =
      window.location.origin && window.location.origin.startsWith('http')
        ? window.location.origin
        : 'https://tools.asbily.com';
    const url = `${base}/${tool.category}/${tool.id}`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedShare(true);
    if (onShowToast) {
      onShowToast(`Tool link copied: ${url}`, 'success');
    }
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleResetWorkspace = () => {
    setWorkspaceKey((prev) => prev + 1);
    onShowToast?.(`${tool.name} reset to initial defaults`, 'info');
  };

  // Find related tools in same category
  const relatedTools = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 3);

  const renderToolComponent = () => {
    switch (tool.category) {
      case 'text':
        return <TextTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'social':
        return <SocialMediaTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'developer':
        return <DeveloperTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'seo':
        return <WebsiteSeoTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'image':
        return <ImageDesignTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'pdf':
        return <PdfDocumentTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'security':
        return <SecurityPrivacyTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'calculator':
        return <CalculatorsTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'student':
        return <StudentTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'business':
      case 'productivity':
        return <BusinessProductivityTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'daily':
        return <DailyLifeTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'qr':
        return <QrBarcodeTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case '3d':
        return <ThreeDTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'media':
        return <MediaBrowserTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'ai':
        return <AiTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      case 'converter':
        return <FileConverterTools key={`${tool.id}-${workspaceKey}`} toolId={tool.id} />;
      default:
        return <div className="text-neutral-500">Tool module unavailable.</div>;
    }
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 py-8 overflow-x-clip xl:grid xl:grid-cols-[176px_minmax(0,1fr)_176px] xl:gap-6 xl:items-start">
      <aside className="hidden xl:flex flex-col items-center sticky top-24">
        <AdSlot slotName="Sponsored Skyscraper" type="160x600" />
      </aside>

      <div className="w-full max-w-5xl mx-auto space-y-8 overflow-hidden">
        {/* Top Breadcrumb & Action Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-black/10 dark:border-white/10 w-full max-w-full">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tools</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <button
              type="button"
              onClick={() => (onSelectCategory ? onSelectCategory(tool.category) : onBack())}
              className="uppercase text-[11px] tracking-wider hover:text-[#000000] dark:hover:text-[#FFFFFF] transition cursor-pointer"
            >
              {tool.categoryLabel}
            </button>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span className="text-[#000000] dark:text-[#FFFFFF] font-semibold truncate max-w-[150px] sm:max-w-none">
              {tool.name}
            </span>
          </nav>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetWorkspace}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black/15 dark:border-white/15 rounded-lg text-xs font-medium hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer text-[#000000] dark:text-[#FFFFFF]"
              title="Reset workspace inputs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleFavorite(tool.id);
                if (onShowToast) {
                  onShowToast(isFavorite ? 'Removed from saved' : 'Saved to your collection', 'info');
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition cursor-pointer ${
                isFavorite
                  ? 'bg-[#000000] dark:bg-[#FFFFFF] border-[#000000] dark:border-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000]'
                  : 'border-black/15 dark:border-white/15 hover:bg-[#F6F6F6] dark:hover:bg-white/10 text-[#000000] dark:text-[#FFFFFF]'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isFavorite ? 'fill-current' : 'text-neutral-500'
                }`}
              />
              <span>{isFavorite ? 'Saved' : 'Save'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-black/15 dark:border-white/15 rounded-lg text-xs font-medium hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer text-[#000000] dark:text-[#FFFFFF]"
            >
              {copiedShare ? (
                <Check className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-neutral-500" />
              )}
              <span>{copiedShare ? 'Copied Link' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Tool Header Banner */}
        <div className="space-y-3 w-full max-w-full overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{tool.categoryLabel}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1 text-[#000000] dark:text-[#FFFFFF]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Local-First Browser Execution</span>
            </span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="font-mono text-neutral-500 dark:text-neutral-400">
              /{tool.category}/{tool.id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#000000] dark:text-[#FFFFFF] tracking-tight">
            {tool.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
            {tool.shortDesc}
          </p>
        </div>

        <AdSlot slotName="Sponsored Advertisement" type="responsive-header" />

        {/* Main Tool Interactive Workspace */}
        <section
          aria-label={`${tool.name} Workspace`}
          className="border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-8 bg-[#FFFFFF] dark:bg-[#090909] shadow-sm w-full max-w-full overflow-hidden"
        >
          <Suspense
            fallback={
              <div className="py-12 text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Loading {tool.name} workspace...
              </div>
            }
          >
            {renderToolComponent()}
          </Suspense>
        </section>

        <div className="flex justify-center py-2 w-full max-w-full overflow-hidden">
          <AdSlot slotName="Sponsored Solution" type="300x250" />
        </div>

      {/* Usage Instructions & Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-[#FFFFFF] dark:bg-[#090909] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#000000] dark:text-[#FFFFFF] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <h2>Usage Instructions</h2>
          </div>
          <ol className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed list-decimal pl-4">
            {guide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-[#FFFFFF] dark:bg-[#090909] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#000000] dark:text-[#FFFFFF] uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <h2>Examples & Tips</h2>
          </div>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed list-disc pl-4">
            {guide.examples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Privacy Notice & Offline Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-[#F6F6F6] dark:bg-[#050505] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#000000] dark:text-[#FFFFFF] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <h2>Privacy & Local Processing</h2>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {guide.privacyNote}
          </p>
        </section>

        <section className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-[#F6F6F6] dark:bg-[#050505] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#000000] dark:text-[#FFFFFF] uppercase tracking-wider">
            <WifiOff className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <h2>Offline Support (PWA)</h2>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Asbily Tools is an installable Progressive Web App. First-time access requires an internet connection to load and cache required assets; once cached, compatible tools remain usable offline.
          </p>
        </section>
      </div>

      {/* Tool FAQs */}
      {guide.faqs.length > 0 && (
        <section className="border border-black/10 dark:border-white/10 rounded-xl p-5 bg-[#FFFFFF] dark:bg-[#090909] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#000000] dark:text-[#FFFFFF] uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guide.faqs.map((faq) => (
              <div
                key={faq.q}
                className="p-3.5 rounded-lg border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] space-y-1"
              >
                <div className="text-xs font-semibold text-[#000000] dark:text-[#FFFFFF]">
                  {faq.q}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Related {tool.categoryLabel} Tools
            </h2>
            {onSelectCategory && (
              <button
                type="button"
                onClick={() => onSelectCategory(tool.category)}
                className="text-xs font-semibold text-[#000000] dark:text-[#FFFFFF] hover:underline cursor-pointer"
              >
                View all in {tool.categoryLabel}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((rt) => (
              <ToolCard
                key={rt.id}
                tool={rt}
                onOpen={(t) => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  onSelectTool(t);
                }}
                isFavorite={favorites.includes(rt.id)}
                onToggleFavorite={onToggleFavorite}
                onShowToast={onShowToast}
              />
            ))}
          </div>
        </section>
      )}

        <AdSlot slotName="Sponsored Recommendations" type="native" />
      </div>

      <aside className="hidden xl:flex flex-col items-center sticky top-24">
        <AdSlot slotName="Sponsored Sidebar" type="160x300" />
      </aside>
    </div>
  );
};
