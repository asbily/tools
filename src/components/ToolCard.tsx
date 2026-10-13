import React, { useState } from 'react';
import {
  FileText,
  Type,
  AlignLeft,
  ListOrdered,
  SplitSquareVertical,
  BookOpen,
  Sparkles,
  Languages,
  Hash,
  MessageSquare,
  User,
  Pilcrow,
  Layout,
  Braces,
  Binary,
  Link,
  Code2,
  Table,
  FileCode,
  Database,
  CheckSquare,
  KeyRound,
  Fingerprint,
  ShieldAlert,
  Clock8,
  CalendarClock,
  Sigma,
  Send,
  PenTool,
  Palette,
  Search,
  Bot,
  FileSpreadsheet,
  Eye,
  Globe,
  Network,
  Target,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  Repeat,
  FileImage,
  Maximize2,
  SquareCode,
  Pipette,
  Stamp,
  EyeOff,
  Files,
  Receipt,
  FileCheck,
  FileSearch,
  Lock,
  Key,
  FileCheck2,
  FileLock,
  Calculator,
  Percent,
  TrendingUp,
  Calendar,
  Landmark,
  Zap,
  ArrowRightLeft,
  GraduationCap,
  Award,
  BookMarked,
  Quote,
  FileEdit,
  DollarSign,
  Building,
  Clock3,
  Timer,
  Dices,
  QrCode,
  ScanBarcode,
  Scan,
  Volume2,
  Mic,
  Monitor,
  HardDrive,
  Star,
  ArrowRight,
  Share2,
  Check,
  LucideIcon
} from 'lucide-react';
import { ToolItem } from '../types';

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Type,
  AlignLeft,
  ListOrdered,
  SplitSquareVertical,
  BookOpen,
  Sparkles,
  Languages,
  Hash,
  MessageSquare,
  User,
  Pilcrow,
  Layout,
  Braces,
  Binary,
  Link,
  Code2,
  Table,
  FileCode,
  Database,
  CheckSquare,
  KeyRound,
  Fingerprint,
  ShieldAlert,
  Clock8,
  CalendarClock,
  Sigma,
  Send,
  PenTool,
  Palette,
  Search,
  Bot,
  FileSpreadsheet,
  Eye,
  Globe,
  Network,
  Target,
  CheckCircle2,
  ShieldCheck,
  Sliders,
  Repeat,
  FileImage,
  Maximize2,
  SquareCode,
  Pipette,
  Stamp,
  EyeOff,
  Files,
  Receipt,
  FileCheck,
  FileSearch,
  Lock,
  Key,
  FileCheck2,
  FileLock,
  Calculator,
  Percent,
  TrendingUp,
  Calendar,
  Landmark,
  Zap,
  ArrowRightLeft,
  GraduationCap,
  Award,
  BookMarked,
  Quote,
  FileEdit,
  DollarSign,
  Building,
  Clock3,
  Timer,
  Dices,
  QrCode,
  ScanBarcode,
  Scan,
  Volume2,
  Mic,
  Monitor,
  HardDrive,
};

interface ToolCardProps {
  tool: ToolItem;
  onOpen: (tool: ToolItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  onShowToast?: (text: string) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onOpen,
  isFavorite,
  onToggleFavorite,
  onShowToast,
}) => {
  const IconComponent = ICON_MAP[tool.iconName] || FileText;
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = window.location.origin.includes('localhost') || window.location.origin.includes('run.app')
      ? window.location.origin
      : 'https://tools.asbily.com';
    const url = `${origin}/${tool.category}/${tool.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    if (onShowToast) {
      onShowToast(`Link copied: ${url}`);
    }
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      onClick={() => onOpen(tool)}
      className="group relative border border-neutral-200/90 dark:border-neutral-800/90 rounded-2xl p-5 bg-white dark:bg-[#0E0E10] hover:border-neutral-900 dark:hover:border-neutral-400 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
    >
      {/* Ambient background hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative z-10">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:scale-105 group-hover:border-neutral-400 dark:group-hover:border-neutral-600 transition shadow-xs">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              title="Copy link to this tool"
              aria-label="Copy tool link"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(tool.id);
                if (onShowToast) {
                  onShowToast(isFavorite ? `Removed from favorites` : `Saved to favorites`);
                }
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-label="Toggle favorite"
            >
              <Star
                className={`w-3.5 h-3.5 transition-transform ${
                  isFavorite ? 'text-amber-500 fill-amber-500 scale-110' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Metadata line */}
        <div className="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
            <span>{tool.categoryLabel}</span>
            <span>·</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">100% Client-Side</span>
          </div>

          {tool.popular && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60">
              <Sparkles className="w-2.5 h-2.5" /> Popular
            </span>
          )}
          {tool.isNew && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
              New
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-[#111111] dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition line-clamp-1">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
          {tool.shortDesc}
        </p>

        {/* Tags preview */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {tool.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="relative z-10 pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200">
        <span className="group-hover:underline">Launch Tool</span>
        <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition">
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition" />
        </div>
      </div>
    </div>
  );
};
