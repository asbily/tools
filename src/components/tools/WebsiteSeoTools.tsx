import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Eye, ExternalLink, CheckCircle2, Shield, Globe, Search, Share2 } from 'lucide-react';

interface SeoToolProps {
  toolId: string;
}

export const WebsiteSeoTools: React.FC<SeoToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (content: string, filename: string, type = 'text/plain') => {
    const blob = new Blob([content], { type: `${type};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (toolId === 'meta-tag-generator') return <MetaTagGeneratorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'robots-txt') return <RobotsTxtTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  if (toolId === 'sitemap-generator') return <SitemapGeneratorTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  if (toolId === 'og-preview') return <OgPreviewTool />;
  if (toolId === 'canonical-hreflang') return <CanonicalHreflangTool onCopy={copyText} copied={copied} />;
  if (toolId === 'schema-generator') return <SchemaGeneratorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'utm-builder') return <UtmBuilderTool onCopy={copyText} copied={copied} />;
  if (toolId === 'seo-audit') return <SeoAuditTool onCopy={copyText} />;
  if (toolId === 'security-headers') return <SecurityHeadersTool onCopy={copyText} />;

  return <div className="text-neutral-500">SEO tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Meta Tag & Open Graph Generator
// -------------------------------------------------------------
const MetaTagGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [title, setTitle] = useState('Asbily Free Tools — Free Tools. Simple Solutions.');
  const [description, setDescription] = useState('All-in-one free online tools platform for text, social media, developer utilities, SEO, images, and productivity by Asbily Platforms.');
  const [keywords, setKeywords] = useState('free tools, developer tools, hashtag generator, image compressor, json formatter');
  const [url, setUrl] = useState('https://asbily.com/tools');
  const [image, setImage] = useState('https://asbily.com/og-banner.png');
  const [author, setAuthor] = useState('Asbily Platforms');

  const metaHtml = useMemo(() => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${url}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${image}">`;
  }, [title, description, keywords, author, url, image]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-neutral-500 uppercase">Page Title</span>
              <span className={`font-mono ${title.length > 60 ? 'text-[#000000] dark:text-[#FFFFFF] font-bold' : 'text-neutral-400'}`}>
                {title.length} / 60 chars
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-neutral-500 uppercase">Meta Description</span>
              <span className={`font-mono ${description.length > 160 ? 'text-[#000000] dark:text-[#FFFFFF] font-bold' : 'text-neutral-400'}`}>
                {description.length} / 160 chars
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Keywords</label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Canonical URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">OG Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Live Search & Social Preview */}
        <div className="space-y-4">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Google SERP Preview</div>
          <div className="border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg bg-white dark:bg-neutral-950">
            <div className="text-xs text-neutral-500 truncate mb-0.5">{url}</div>
            <div className="text-base text-[#000000] dark:text-[#FFFFFF] hover:underline font-medium line-clamp-1 cursor-pointer">
              {title}
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
              {description}
            </div>
          </div>

          <div className="text-xs font-semibold text-neutral-500 uppercase">Generated HTML Tags</div>
          <textarea
            value={metaHtml}
            readOnly
            rows={8}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs"
          />
        </div>
      </div>

      <button
        onClick={() => onCopy(metaHtml)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
        Copy Meta Tags
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Robots.txt Generator
// -------------------------------------------------------------
const RobotsTxtTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [sitemapUrl, setSitemapUrl] = useState('https://asbily.com/sitemap.xml');
  const [disallows, setDisallows] = useState('/admin/\n/api/\n/private/');
  const [crawlDelay, setCrawlDelay] = useState(1);
  const [allowAll, setAllowAll] = useState(true);

  const content = useMemo(() => {
    let out = '# Robots.txt generated by Asbily Free Tools\nUser-agent: *\n';
    if (allowAll) {
      out += 'Allow: /\n';
    }
    const lines = disallows.split('\n').filter((l) => l.trim());
    lines.forEach((l) => {
      out += `Disallow: ${l.trim()}\n`;
    });
    if (crawlDelay > 0) {
      out += `Crawl-delay: ${crawlDelay}\n`;
    }
    if (sitemapUrl) {
      out += `\nSitemap: ${sitemapUrl}\n`;
    }
    return out;
  }, [sitemapUrl, disallows, crawlDelay, allowAll]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Sitemap URL</label>
            <input
              type="text"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Disallowed Paths (one per line)</label>
            <textarea
              value={disallows}
              onChange={(e) => setDisallows(e.target.value)}
              rows={4}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={allowAll}
                onChange={(e) => setAllowAll(e.target.checked)}
                className="accent-black dark:accent-white"
              />
              Allow all other pages (Allow: /)
            </label>
            <div className="flex items-center gap-2 text-xs">
              <span>Crawl Delay:</span>
              <input
                type="number"
                min={0}
                max={60}
                value={crawlDelay}
                onChange={(e) => setCrawlDelay(parseInt(e.target.value) || 0)}
                className="w-16 p-1 border border-neutral-200 dark:border-neutral-800 rounded text-center"
              />
              <span>sec</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Output robots.txt</label>
          <textarea
            value={content}
            readOnly
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(content)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
          Copy robots.txt
        </button>
        <button
          onClick={() => onDownload(content, 'robots.txt')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          <Download className="w-4 h-4" />
          Download robots.txt
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: XML Sitemap Generator
// -------------------------------------------------------------
const SitemapGeneratorTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string, t?: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [urls, setUrls] = useState('https://asbily.com\nhttps://asbily.com/tools\nhttps://asbily.com/about\nhttps://asbily.com/contact');
  const [freq, setFreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');

  const sitemapXml = useMemo(() => {
    const list = urls.split('\n').filter((u) => u.trim());
    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    list.forEach((url) => {
      xml += `  <url>\n    <loc>${url.trim()}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    });
    xml += `</urlset>`;
    return xml;
  }, [urls, freq, priority]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">URLs List (one per line)</label>
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              rows={8}
              className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Change Frequency</label>
              <select
                value={freq}
                onChange={(e) => setFreq(e.target.value)}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-xs"
              >
                <option value="always">Always</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-xs"
              >
                <option value="1.0">1.0 (Highest)</option>
                <option value="0.8">0.8 (Default)</option>
                <option value="0.5">0.5 (Normal)</option>
                <option value="0.3">0.3 (Low)</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Generated sitemap.xml</label>
          <textarea
            value={sitemapXml}
            readOnly
            rows={12}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(sitemapXml)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
          Copy XML
        </button>
        <button
          onClick={() => onDownload(sitemapXml, 'sitemap.xml', 'application/xml')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          <Download className="w-4 h-4" />
          Download sitemap.xml
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Social Card Link Previewer
// -------------------------------------------------------------
const OgPreviewTool: React.FC = () => {
  const [title, setTitle] = useState('Asbily Free Tools — Free Tools. Simple Solutions.');
  const [desc, setDesc] = useState('Explore fast, modern, client-side online tools for text, development, design, and SEO.');
  const [site, setSite] = useState('asbily.com');
  const [imgUrl, setImgUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Headline Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Domain Name</label>
          <input
            type="text"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
      </div>

      <div className="max-w-xl mx-auto border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-950 shadow-sm">
        <div className="h-52 bg-neutral-200 dark:bg-neutral-800 overflow-hidden relative">
          <img
            src={imgUrl}
            alt="OG Preview"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{site}</div>
          <div className="text-base font-bold text-[#000000] dark:text-[#FFFFFF] mt-1 line-clamp-2">{title}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{desc}</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Canonical & Hreflang Helper
// -------------------------------------------------------------
const CanonicalHreflangTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [baseUrl, setBaseUrl] = useState('https://asbily.com/tools');
  const [languages, setLanguages] = useState([
    { code: 'en', url: 'https://asbily.com/tools' },
    { code: 'bn', url: 'https://asbily.com/bn/tools' },
    { code: 'es', url: 'https://asbily.com/es/tools' },
    { code: 'x-default', url: 'https://asbily.com/tools' },
  ]);

  const tags = useMemo(() => {
    let out = `<!-- Canonical URL -->\n<link rel="canonical" href="${baseUrl}" />\n\n<!-- Multi-Language Alternates (hreflang) -->\n`;
    languages.forEach((l) => {
      out += `<link rel="alternate" hreflang="${l.code}" href="${l.url}" />\n`;
    });
    return out;
  }, [baseUrl, languages]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Primary Canonical URL</label>
        <input
          type="text"
          value={baseUrl}
          onChange={(e) => setBaseUrl(e.target.value)}
          className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
        />
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900 font-mono text-xs">
        <pre className="whitespace-pre-wrap text-[#000000] dark:text-[#FFFFFF]">{tags}</pre>
      </div>

      <button
        onClick={() => onCopy(tags)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
        Copy Canonical & Hreflang Tags
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Schema.org JSON-LD Generator
// -------------------------------------------------------------
const SchemaGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [schemaType, setSchemaType] = useState<'Organization' | 'Article' | 'FAQPage'>('Organization');
  const [name, setName] = useState('Asbily Platforms');
  const [url, setUrl] = useState('https://asbily.com');

  const jsonLd = useMemo(() => {
    let data: any = {};
    if (schemaType === 'Organization') {
      data = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name,
        url,
        logo: `${url}/asbily.svg`,
        sameAs: ['https://twitter.com/asbily', 'https://linkedin.com/company/asbily'],
      };
    } else if (schemaType === 'Article') {
      data = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: name,
        url,
        datePublished: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Asbily Platforms',
        },
      };
    } else if (schemaType === 'FAQPage') {
      data = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Are Asbily Free Tools completely free to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, all tools run 100% in your browser for free with no account required.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are my files and data private?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, processing is performed client-side without uploading your files to remote servers.',
            },
          },
        ],
      };
    }
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
  }, [schemaType, name, url]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Schema Type</label>
          <select
            value={schemaType}
            onChange={(e) => setSchemaType(e.target.value as any)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
          >
            <option value="Organization">Organization</option>
            <option value="Article">Article</option>
            <option value="FAQPage">FAQ Page</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Name / Headline</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
      </div>

      <pre className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs overflow-auto">
        {jsonLd}
      </pre>

      <button
        onClick={() => onCopy(jsonLd)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
        Copy JSON-LD Script
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: UTM Campaign Link Builder
// -------------------------------------------------------------
const UtmBuilderTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [website, setWebsite] = useState('https://asbily.com/tools');
  const [source, setSource] = useState('newsletter');
  const [medium, setMedium] = useState('email');
  const [campaign, setCampaign] = useState('launch_2026');
  const [content, setContent] = useState('cta_button');

  const utmUrl = useMemo(() => {
    try {
      const u = new URL(website);
      if (source) u.searchParams.set('utm_source', source);
      if (medium) u.searchParams.set('utm_medium', medium);
      if (campaign) u.searchParams.set('utm_campaign', campaign);
      if (content) u.searchParams.set('utm_content', content);
      return u.toString();
    } catch {
      return website;
    }
  }, [website, source, medium, campaign, content]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Website URL *</label>
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Campaign Source (e.g. google, twitter) *</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Campaign Medium (e.g. cpc, email, banner)</label>
          <input
            type="text"
            value={medium}
            onChange={(e) => setMedium(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Campaign Name</label>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
      </div>

      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="text-xs font-semibold text-neutral-500 uppercase mb-1">Complete UTM URL</div>
        <div className="font-mono text-xs break-all text-[#000000] dark:text-[#FFFFFF]">{utmUrl}</div>
      </div>

      <button
        onClick={() => onCopy(utmUrl)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
        Copy Tracked Link
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: SEO & Launch Audit Checklist
// -------------------------------------------------------------
const SeoAuditTool: React.FC<{ onCopy: (t: string) => void }> = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'Unique Title Tag (50-60 characters) with target keyword', checked: true },
    { id: 2, text: 'Meta Description (140-160 characters) with clear call to action', checked: true },
    { id: 3, text: 'Self-referencing canonical URL tag configured', checked: true },
    { id: 4, text: 'Open Graph (og:title, og:image, og:description) cards present', checked: true },
    { id: 5, text: 'Robots.txt file configured and crawlable', checked: true },
    { id: 6, text: 'Sitemap.xml generated and submitted to Google Search Console', checked: false },
    { id: 7, text: 'Mobile responsive viewport tag (<meta name="viewport">)', checked: true },
    { id: 8, text: 'SSL / HTTPS encryption enabled with HSTS header', checked: true },
    { id: 9, text: 'Favicon & Apple touch icon present and linked in HTML head', checked: true },
    { id: 10, text: 'Structured Data / Schema.org JSON-LD implemented and validated', checked: false },
    { id: 11, text: 'Image ALT attributes present on all critical content graphics', checked: false },
    { id: 12, text: 'Clean URL hierarchy without deep query pollution', checked: true },
  ]);

  const toggle = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="space-y-6">
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="flex items-center justify-between text-xs font-semibold uppercase mb-2">
          <span>SEO Launch Readiness</span>
          <span className="font-mono">{progressPercent}% ({completedCount} / {items.length} Passed)</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
          <div className="bg-[#000000] dark:bg-[#FFFFFF] h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item.id}
            onClick={() => toggle(item.id)}
            className="flex items-start gap-3 p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => {}}
              className="mt-0.5 accent-black dark:accent-white"
            />
            <span className={`text-xs ${item.checked ? 'text-neutral-900 dark:text-neutral-100 font-medium' : 'text-neutral-500'}`}>
              {item.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Security Headers & Safety Advisor
// -------------------------------------------------------------
const SecurityHeadersTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const headers = [
    {
      name: 'Content-Security-Policy (CSP)',
      val: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
      desc: 'Guards against Cross-Site Scripting (XSS) and malicious script injection.',
    },
    {
      name: 'Strict-Transport-Security (HSTS)',
      val: 'max-age=63072000; includeSubDomains; preload',
      desc: 'Forces browser to only connect via secure HTTPS.',
    },
    {
      name: 'X-Frame-Options',
      val: 'SAMEORIGIN',
      desc: 'Prevents clickjacking attacks by controlling iframe embedding.',
    },
    {
      name: 'X-Content-Type-Options',
      val: 'nosniff',
      desc: 'Prevents MIME-type sniffing of executable formats.',
    },
    {
      name: 'Referrer-Policy',
      val: 'strict-origin-when-cross-origin',
      desc: 'Protects user privacy when navigating outbound external links.',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500">
        Standard security response headers to harden your web server against common injection and framing exploits.
      </div>

      <div className="space-y-3">
        {headers.map((h) => (
          <div key={h.name} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3.5 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#000000] dark:text-[#FFFFFF]">{h.name}</span>
              <button onClick={() => onCopy(`${h.name}: ${h.val}`)} className="text-xs text-neutral-400 hover:text-black dark:hover:text-white">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-mono text-xs text-neutral-600 dark:text-neutral-300 break-all bg-white dark:bg-neutral-950 p-2 rounded border border-neutral-200 dark:border-neutral-800 my-1">
              {h.val}
            </div>
            <div className="text-[11px] text-neutral-500">{h.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
