import React from 'react';
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
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onOpen,
  isFavorite,
  onToggleFavorite,
}) => {
  const IconComponent = ICON_MAP[tool.iconName] || FileText;

  return (
    <div
      onClick={() => onOpen(tool)}
      className="group relative border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 bg-white dark:bg-neutral-950 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xs"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:scale-105 transition">
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(tool.id);
              }}
              className="p-1.5 rounded-md text-neutral-400 hover:text-amber-500 transition"
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 ${
                  isFavorite ? 'text-amber-500 fill-amber-500' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title & Category */}
        <div className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 mb-1">
          {tool.categoryLabel}
        </div>
        <h3 className="font-bold text-base text-[#111111] dark:text-neutral-100 group-hover:text-black dark:group-hover:text-white transition line-clamp-1">
          {tool.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
          {tool.shortDesc}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-900 flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-neutral-200">
        <span>Open Tool</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition text-neutral-400 group-hover:text-black dark:group-hover:text-white" />
      </div>
    </div>
  );
};
