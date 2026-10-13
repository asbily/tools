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
  Bot
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

  const filteredCategories = CATEGORIES.filter(c => c.id !== 'all').map(cat => {
    const toolsInCat = TOOLS.filter(t => t.category === cat.id);
    const matchesSearch = toolsInCat.filter(t => 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return {
      category: cat,
      tools: searchQuery.trim() ? matchesSearch : toolsInCat,
    };
  }).filter(group => !searchQuery.trim() || group.tools.length > 0);

  const totalIndexedTools = TOOLS.length;
  const totalCategories = CATEGORIES.filter(c => c.id !== 'all').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
        <button 
          onClick={onBackToHome}
          className="hover:text-black dark:hover:text-white transition flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">Public Sitemap & Directory</span>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Public Crawl & Indexing Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              Asbily Free Tools Public Sitemap
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Complete index of all {totalIndexedTools} production utilities across {totalCategories} specialized categories. Optimized for Googlebot, Bing, search engines, and visitors with priority URL routing.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>View XML Sitemap</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>View Robots.txt</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <button
              onClick={copySitemapUrl}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#18181B] text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
            >
              {copiedXml ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedXml ? 'Copied!' : 'Copy XML URL'}</span>
            </button>
          </div>
        </div>

        {/* Technical Architecture Specs Bar */}
        <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60">
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{totalIndexedTools}</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Total Live Tools</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60">
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{totalCategories}</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Categories</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60">
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
            <div className="text-[11px] text-neutral-500 dark:text-neutral-400">Public Crawl Coverage</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60">
            <div className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Clean URLs</div>
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
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] text-neutral-900 dark:text-neutral-100 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
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
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] p-6 shadow-sm"
          >
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {category.name}
                    </h2>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
                      /{category.id}
                    </span>
                    <span className="text-xs text-neutral-400 font-normal">
                      ({tools.length} {tools.length === 1 ? 'tool' : 'tools'})
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {category.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectCategory(category.id)}
                className="self-start sm:self-auto text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition flex items-center gap-1"
              >
                <span>Browse category page</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
              {tools.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => onOpenTool(tool)}
                  className="group p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 transition cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex items-center gap-1.5">
                        <span>{tool.name}</span>
                        {tool.popular && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-medium inline-flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            Popular
                          </span>
                        )}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {tool.shortDesc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span className="truncate max-w-[200px]">
                      /{tool.category}/{tool.id}
                    </span>
                    <span className="text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200">
                      Open Tool →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SEO & Search Engine Crawl Verification Notice */}
      <div className="mt-12 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#101012] p-6 text-xs text-neutral-600 dark:text-neutral-400 space-y-3">
        <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-neutral-100 text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Google Search Console & SEO Crawler Instructions</span>
        </div>
        <p className="leading-relaxed">
          The public sitemap at <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[11px] text-neutral-900 dark:text-neutral-100">https://tools.asbily.com/sitemap.xml</code> and robots configuration at <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-[11px] text-neutral-900 dark:text-neutral-100">https://tools.asbily.com/robots.txt</code> are live, publicly allowed (<code className="font-mono">Allow: /</code>), and served with exact XML MIME types and <code className="font-mono">X-Robots-Tag: all</code> headers.
        </p>
        <p className="leading-relaxed">
          If Google Search Console reports a historical date or cached attempt prior to the latest deployment, click the <strong>3-dot menu (⋮)</strong> next to the sitemap row in Google Search Console and select <strong>"Resubmit"</strong>, or enter <code className="font-mono">sitemap.xml</code> into the submission input. Googlebot will fetch the live file during its automated crawl pass.
        </p>
      </div>
    </div>
  );
};
