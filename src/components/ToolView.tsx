import React, { useState } from 'react';
import { ArrowLeft, Star, Share2, Check, ShieldCheck, HelpCircle, ChevronRight, Zap, RefreshCw, Bookmark } from 'lucide-react';
import { ToolItem } from '../types';
import { TOOLS } from '../data/toolsData';
import { TextTools } from './tools/TextTools';
import { SocialMediaTools } from './tools/SocialMediaTools';
import { DeveloperTools } from './tools/DeveloperTools';
import { WebsiteSeoTools } from './tools/WebsiteSeoTools';
import { ImageDesignTools } from './tools/ImageDesignTools';
import { PdfDocumentTools } from './tools/PdfDocumentTools';
import { SecurityPrivacyTools } from './tools/SecurityPrivacyTools';
import { CalculatorsTools } from './tools/CalculatorsTools';
import { StudentTools } from './tools/StudentTools';
import { BusinessProductivityTools } from './tools/BusinessProductivityTools';
import { QrBarcodeTools } from './tools/QrBarcodeTools';
import { MediaBrowserTools } from './tools/MediaBrowserTools';
import { ThreeDTools } from './tools/ThreeDTools';
import { ToolCard } from './ToolCard';
import { AdSlot } from './AdSlot';

interface ToolViewProps {
  tool: ToolItem;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectTool: (t: ToolItem) => void;
  favorites: string[];
  onShowToast?: (text: string) => void;
}

export const ToolView: React.FC<ToolViewProps> = ({
  tool,
  onBack,
  isFavorite,
  onToggleFavorite,
  onSelectTool,
  favorites,
  onShowToast,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = async () => {
    const base = window.location.origin && window.location.origin.startsWith('http')
      ? window.location.origin
      : 'https://tools.asbily.com';
    const url = `${base}/${tool.category}/${tool.id}`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedShare(true);
    if (onShowToast) {
      onShowToast(`Tool link copied: ${url}`);
    }
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Find related tools in same category
  const relatedTools = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 3);

  const renderToolComponent = () => {
    switch (tool.category) {
      case 'text':
        return <TextTools toolId={tool.id} />;
      case 'social':
        return <SocialMediaTools toolId={tool.id} />;
      case 'developer':
        return <DeveloperTools toolId={tool.id} />;
      case 'seo':
        return <WebsiteSeoTools toolId={tool.id} />;
      case 'image':
        return <ImageDesignTools toolId={tool.id} />;
      case 'pdf':
        return <PdfDocumentTools toolId={tool.id} />;
      case 'security':
        return <SecurityPrivacyTools toolId={tool.id} />;
      case 'calculator':
        return <CalculatorsTools toolId={tool.id} />;
      case 'student':
        return <StudentTools toolId={tool.id} />;
      case 'business':
      case 'productivity':
        return <BusinessProductivityTools toolId={tool.id} />;
      case 'qr':
        return <QrBarcodeTools toolId={tool.id} />;
      case '3d':
        return <ThreeDTools toolId={tool.id} />;
      case 'media':
        return <MediaBrowserTools toolId={tool.id} />;
      default:
        return <div className="text-neutral-500">Tool component coming soon.</div>;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-8 space-y-8 overflow-hidden">
      {/* Top Breadcrumb & Action Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800 w-full max-w-full">
        {/* Interactive Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <button
            onClick={onBack}
            className="hover:text-black dark:hover:text-white transition flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tools</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="uppercase text-[10px] tracking-wider text-neutral-400">
            {tool.categoryLabel}
          </span>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="text-neutral-900 dark:text-neutral-100 font-semibold truncate max-w-[150px] sm:max-w-none">
            {tool.name}
          </span>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onToggleFavorite(tool.id);
              if (onShowToast) {
                onShowToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition cursor-pointer ${
              isFavorite
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'text-amber-500 fill-amber-500' : 'text-neutral-400'
              }`}
            />
            <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition cursor-pointer text-neutral-700 dark:text-neutral-300"
          >
            {copiedShare ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5 text-neutral-400" />
            )}
            <span>{copiedShare ? 'Copied Link' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Tool Header Banner */}
      <div className="space-y-3 w-full max-w-full overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">{tool.categoryLabel}</span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side Private</span>
          </span>
          <span aria-hidden="true" className="opacity-40">·</span>
          <span className="font-mono text-neutral-400 dark:text-neutral-500">
            /{tool.category}/{tool.id}
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111111] dark:text-neutral-100 tracking-tight">
          {tool.name}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
          {tool.shortDesc}
        </p>
      </div>

      {/* Adsterra Top Responsive Header (728x90 Desktop / 320x50 Mobile) */}
      <AdSlot slotName="Sponsored Advertisement" type="responsive-header" />

      {/* Main Tool Interactive Workspace */}
      <div className="border border-neutral-200/90 dark:border-neutral-800/90 rounded-2xl p-4 sm:p-8 bg-white dark:bg-[#0E0E10] shadow-sm w-full max-w-full overflow-hidden">
        {renderToolComponent()}
      </div>

      {/* Adsterra Medium Rectangle (300x250) */}
      <div className="flex justify-center py-2 w-full max-w-full overflow-hidden">
        <AdSlot slotName="Sponsored Solution" type="300x250" />
      </div>

      {/* Privacy Guarantee & How it works box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl p-5 bg-neutral-50 dark:bg-neutral-900/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-neutral-100 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Browser-Sandboxed Privacy</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            All algorithms, hashes, conversions, and image compressions run strictly inside your local browser via modern Web APIs. No text or files are uploaded to remote servers.
          </p>
        </div>

        <div className="border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl p-5 bg-neutral-50 dark:bg-neutral-900/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-neutral-100 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-neutral-500" />
            <span>Installable & Offline Ready</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Asbily Free Tools is an installable Progressive Web App (PWA). Once loaded, core algorithms remain fully operational even without an active internet connection.
          </p>
        </div>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div className="pt-6 space-y-4">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            More {tool.categoryLabel} Tools
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
        </div>
      )}
    </div>
  );
};
