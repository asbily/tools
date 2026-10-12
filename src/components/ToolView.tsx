import React, { useState } from 'react';
import { ArrowLeft, Star, Share2, Check, ShieldCheck, HelpCircle } from 'lucide-react';
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
import { ToolCard } from './ToolCard';
import { AdSlot } from './AdSlot';

interface ToolViewProps {
  tool: ToolItem;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectTool: (t: ToolItem) => void;
  favorites: string[];
}

export const ToolView: React.FC<ToolViewProps> = ({
  tool,
  onBack,
  isFavorite,
  onToggleFavorite,
  onSelectTool,
  favorites,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#tool=${tool.id}`;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
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
      case 'media':
        return <MediaBrowserTools toolId={tool.id} />;
      default:
        return <div className="text-neutral-500">Tool component coming soon.</div>;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-8 space-y-8 overflow-hidden">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800 w-full max-w-full">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition" />
          <span>Back to All Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(tool.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition cursor-pointer"
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition cursor-pointer"
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
      <div className="space-y-2 w-full max-w-full overflow-hidden">
        <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          {tool.categoryLabel} Utility
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] dark:text-neutral-100">
          {tool.name}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-3xl">
          {tool.shortDesc}
        </p>
      </div>

      {/* Adsterra Top Responsive Header (728x90 Desktop / 320x50 Mobile) */}
      <AdSlot slotName="Sponsored Advertisement" type="responsive-header" />

      {/* Main Tool Interactive Workspace */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-8 bg-white dark:bg-neutral-950 shadow-xs w-full max-w-full overflow-hidden">
        {renderToolComponent()}
      </div>

      {/* Adsterra Medium Rectangle (300x250 / Highest CPM below tool action) */}
      <div className="flex justify-center py-2">
        <AdSlot slotName="Sponsored" type="300x250" />
      </div>

      {/* Privacy Guarantee & How it works box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50 dark:bg-neutral-900 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-neutral-100 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Client-Side Privacy</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            All algorithms, hashes, conversions, and image compressions run strictly inside your local browser sandbox via modern Web APIs. No sensitive text or uploaded files are sent to remote servers.
          </p>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-neutral-50 dark:bg-neutral-900 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111] dark:text-neutral-100 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-neutral-500" />
            <span>Offline Capable</span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Asbily Free Tools is an installable Progressive Web App (PWA). Once loaded, core tools remain fully operational even if your internet connection is momentarily interrupted.
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
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
