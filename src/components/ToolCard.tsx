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
  FileSignature,
  Package,
  Scale,
  Car,
  Utensils,
  BellRing,
  ClipboardList,
  BarChart3,
  Wallet,
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
  FileSignature,
  Package,
  Scale,
  Car,
  Utensils,
  BellRing,
  ClipboardList,
  BarChart3,
  Wallet,
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

  const toolHref = `/${tool.category}/${tool.id}`;

  const handleAnchorOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      onOpen(tool);
    }
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ transform: tiltStyle.transform }}
      className="card-3d-tilt group relative border border-black/10 dark:border-white/10 rounded-2xl p-5 bg-[#FFFFFF] dark:bg-[#090909] hover:border-[#000000] dark:hover:border-[#FFFFFF] hover:shadow-xl hover:shadow-black/5 flex flex-col justify-between overflow-hidden"
    >
      {/* Subtle 3D specular highlight */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[#F6F6F6]/80 via-transparent to-[#EDEDED]/40 dark:from-white/[0.04] dark:via-transparent dark:to-white/[0.02] transition-opacity duration-200 pointer-events-none ${tiltStyle.sheen}`}
      />

      <div className="relative z-10">
        {/* Top Row: Icon Link & Action Buttons */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <a
            href={toolHref}
            onClick={handleAnchorOpen}
            aria-label={`Open ${tool.name}`}
            className="w-11 h-11 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/15 flex items-center justify-center text-[#000000] dark:text-[#FFFFFF] group-hover:bg-[#000000] group-hover:text-[#FFFFFF] dark:group-hover:bg-[#FFFFFF] dark:group-hover:text-[#000000] transition-colors"
          >
            <IconComponent className="w-5 h-5" />
          </a>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-lg text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer"
              title="Copy link to this tool"
              aria-label="Copy tool link"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
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
                  onShowToast(isFavorite ? 'Removed from saved' : 'Saved to your collection');
                }
              }}
              className="p-2 rounded-lg text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer"
              title={isFavorite ? 'Remove from saved' : 'Save tool'}
              aria-label="Toggle saved tool"
            >
              <Star
                className={`w-3.5 h-3.5 transition-transform ${
                  isFavorite ? 'text-[#000000] fill-[#000000] dark:text-[#FFFFFF] dark:fill-[#FFFFFF] scale-110' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Clean Unboxed Metadata Line (Zero-Pill Discipline) */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300">{tool.categoryLabel}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Client-Side</span>
          </div>

          {tool.isNew ? (
            <span className="text-[11px] font-semibold text-[#000000] dark:text-[#FFFFFF] shrink-0">
              New
            </span>
          ) : tool.popular ? (
            <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">
              Popular
            </span>
          ) : null}
        </div>

        <a href={toolHref} onClick={handleAnchorOpen} className="block group/link focus:outline-none">
          {/* Title */}
          <h3 className="font-bold text-[15px] text-[#000000] dark:text-[#FFFFFF] group-hover/link:underline transition-colors line-clamp-1">
            {tool.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
            {tool.shortDesc}
          </p>
        </a>

        {/* Quiet Tags */}
        {tool.tags && tool.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-neutral-400 dark:text-neutral-500 font-mono truncate">
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
      <a
        href={toolHref}
        onClick={handleAnchorOpen}
        className="relative z-10 pt-3.5 mt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-semibold text-[#000000] dark:text-[#FFFFFF]"
      >
        <span>Open Tool</span>
        <div className="w-7 h-7 rounded-lg bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/15 flex items-center justify-center text-[#000000] dark:text-[#FFFFFF] group-hover:bg-[#000000] group-hover:text-[#FFFFFF] dark:group-hover:bg-[#FFFFFF] dark:group-hover:text-[#000000] transition-colors">
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </a>
    </article>
  );
};
