import React, { useState, useRef } from 'react';
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
  Box,
  Layers,
  Archive,
  Crop,
  Scissors,
  Combine,
  Briefcase,
  Coins,
  HeartPulse,
  Split,
  Flame,
  Keyboard,
  AudioLines,
  Video,
  LucideIcon,
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
  Box,
  Layers,
  Archive,
  Crop,
  Scissors,
  Combine,
  Briefcase,
  Coins,
  HeartPulse,
  Split,
  Flame,
  Keyboard,
  AudioLines,
  Video,
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
  const [tiltStyle, setTiltStyle] = useState<{ transform: string; sheen: string }>({
    transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
    sheen: 'opacity-0',
  });
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !cardRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 8;
    setTiltStyle({
      transform: `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`,
      sheen: 'opacity-100',
    });
  };

  const handlePointerLeave = () => {
    setTiltStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      sheen: 'opacity-0',
    });
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const base = window.location.origin && window.location.origin.startsWith('http')
      ? window.location.origin
      : 'https://tools.asbily.com';
    const url = `${base}/${tool.category}/${tool.id}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedLink(true);
    if (onShowToast) {
      onShowToast(`Share link copied: ${url}`);
    }
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onOpen(tool)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ transform: tiltStyle.transform }}
      className="card-3d-tilt group relative border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-[#111114] hover:border-indigo-500/70 dark:hover:border-indigo-400/70 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle 3D specular highlight */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-slate-500/[0.04] transition-opacity duration-200 pointer-events-none ${tiltStyle.sheen}`}
      />

      <div className="relative z-10">
        {/* Top Row: 3D-elevated Icon & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 border border-slate-200/90 dark:border-zinc-700/80 flex items-center justify-center text-slate-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-colors shadow-xs">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
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
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(tool.id);
                if (onShowToast) {
                  onShowToast(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
                }
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
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

        {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-slate-600 dark:text-zinc-300">{tool.categoryLabel}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Client-Side</span>
          </div>

          {tool.isNew ? (
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
              New
            </span>
          ) : tool.popular ? (
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
              Popular
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="font-bold text-[15px] text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
          {tool.shortDesc}
        </p>

        {/* Quiet Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400 dark:text-zinc-500 font-mono truncate">
            {tool.tags.slice(0, 3).map((tag, idx) => (
              <React.Fragment key={tag}>
                {idx > 0 && <span aria-hidden="true" className="opacity-40">/</span>}
                <span className="truncate">{tag}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="relative z-10 pt-3.5 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-zinc-200">
        <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          Open Tool
        </span>
        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-zinc-800/80 flex items-center justify-center text-slate-500 dark:text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
