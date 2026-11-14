import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Copy,
  Check,
  Search,
  Globe,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Bot,
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/toolsData';
import { ToolItem } from '../types';

interface SitemapViewProps {
  onBackToHome: () => void;
  onOpenTool: (tool: ToolItem) => void;
  onSelectCategory: (catId: string) => void;
  onShowToast: (msg: string) => void;
}

export const SitemapView: React.FC<SitemapViewProps> = ({
  onBackToHome,
  onOpenTool,
  onSelectCategory,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedXml, setCopiedXml] = useState(false);

  const copySitemapUrl = () => {
    navigator.clipboard.writeText('https://tools.asbily.com/sitemap.xml');
    setCopiedXml(true);
    onShowToast('Sitemap URL copied: https://tools.asbily.com/sitemap.xml');
    setTimeout(() => setCopiedXml(false), 2000);
  };

  const filteredCategories = CATEGORIES.filter((c) => c.id !== 'all')
    .map((cat) => {
      const toolsInCat = TOOLS.filter((t) => t.category === cat.id);
      const matchesSearch = toolsInCat.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return {
        category: cat,
        tools: searchQuery.trim() ? matchesSearch : toolsInCat,
      };
    })
    .filter((group) => !searchQuery.trim() || group.tools.length > 0);

  const totalIndexedTools = TOOLS.length;
  const totalCategories = CATEGORIES.filter((c) => c.id !== 'all').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
        <button
          onClick={onBackToHome}
          className="hover:text-[#000000] dark:hover:text-[#FFFFFF] transition flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="font-semibold text-[#000000] dark:text-[#FFFFFF]">Public Sitemap & Directory</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
              <span>100% Public Crawl & Indexing Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#000000] dark:text-[#FFFFFF]">
              Asbily Free Tools Public Sitemap
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Complete index of all {totalIndexedTools} production utilities across {totalCategories} specialized categories. Clean shareable URLs for every category, tool, and saved collection.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] hover:opacity-90 transition shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>View XML Sitemap</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-black/15 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#050505] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#EDEDED] dark:hover:bg-white/10 transition"
            >
              <Bot className="w-4 h-4" />
              <span>View Robots.txt</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <button
              onClick={copySitemapUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF] hover:bg-[#F6F6F6] dark:hover:bg-white/10 transition cursor-pointer"
            >
              {copiedXml ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedXml ? 'Copied!' : 'Copy XML URL'}</span>
            </button>
          </div>
        </div>

        {/* Technical Architecture Specs Bar */}
        <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#050505]">
            <div className="text-xl font-bold text-[#000000] dark:text-[#FFFFFF] tabular-nums">{totalIndexedTools}</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Total Live Tools</div>
          </div>
          <div className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#050505]">
            <div className="text-xl font-bold text-[#000000] dark:text-[#FFFFFF] tabular-nums">{totalCategories}</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Categories</div>
          </div>
          <div className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#050505]">
            <div className="text-xl font-bold text-[#000000] dark:text-[#FFFFFF] tabular-nums">100%</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Public Crawl Coverage</div>
          </div>
          <div className="p-3 rounded-xl bg-[#F6F6F6] dark:bg-[#050505]">
            <div className="text-xl font-bold text-[#000000] dark:text-[#FFFFFF]">Clean URLs</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">/category/tool-name</div>
          </div>
        </div>
      </div>

      {/* Live Search Within Sitemap */}
      <div className="relative mb-8">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter sitemap items by tool name, keyword, or category..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-[#000000] dark:text-[#FFFFFF] text-sm placeholder:text-neutral-400 focus:outline-none focus:border-[#000000] dark:focus:border-[#FFFFFF] transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categorized Tools Tree */}
      <div className="space-y-8">
        {filteredCategories.map(({ category, tools }) => (
          <div
            key={category.id}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#F6F6F6] dark:bg-[#050505] border border-black/10 dark:border-white/15 flex items-center justify-center font-bold text-[#000000] dark:text-[#FFFFFF]">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-[#000000] dark:text-[#FFFFFF]">
                      {category.name}
                    </h2>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      /{category.id}
                    </span>
                    <span className="text-xs text-neutral-400 font-normal">
                      · {tools.length} {tools.length === 1 ? 'tool' : 'tools'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {category.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectCategory(category.id)}
                className="self-start sm:self-auto text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-[#000000] dark:hover:text-[#FFFFFF] transition flex items-center gap-1 cursor-pointer"
              >
                <span>Browse category page</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => onOpenTool(tool)}
                  className="group p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] hover:bg-[#EDEDED] dark:hover:bg-white/10 transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-[#000000] dark:text-[#FFFFFF] flex items-center gap-1.5">
                        <span>{tool.name}</span>
                        {tool.popular && (
                          <span className="text-[10px] text-neutral-500 font-medium inline-flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            Popular
                          </span>
                        )}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {tool.shortDesc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                    <span className="truncate max-w-[200px]">
                      /{tool.category}/{tool.id}
                    </span>
                    <span className="group-hover:text-[#000000] dark:group-hover:text-[#FFFFFF]">
                      Open Tool →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SEO Notice */}
      <div className="mt-12 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] p-6 text-xs text-neutral-600 dark:text-neutral-400 space-y-3">
        <div className="flex items-center gap-2 font-bold text-[#000000] dark:text-[#FFFFFF] text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Google Search Console & SEO Crawler Instructions</span>
        </div>
        <p className="leading-relaxed">
          The public sitemap at <code className="px-1.5 py-0.5 rounded bg-[#EDEDED] dark:bg-white/10 font-mono text-[11px] text-[#000000] dark:text-[#FFFFFF]">https://tools.asbily.com/sitemap.xml</code> and robots configuration at <code className="px-1.5 py-0.5 rounded bg-[#EDEDED] dark:bg-white/10 font-mono text-[11px] text-[#000000] dark:text-[#FFFFFF]">https://tools.asbily.com/robots.txt</code> are live and publicly crawlable.
        </p>
      </div>
    </div>
  );
};
