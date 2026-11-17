import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, Plugin } from 'vite';
import { CATEGORIES, TOOLS } from './src/data/toolsData';
import { getToolGuide } from './src/data/toolGuides';

const SITE_ORIGIN = 'https://tools.asbily.com';
const OG_IMAGE_URL = `${SITE_ORIGIN}/og-image.png`;

const INFO_PAGES = [
  {
    id: 'about',
    label: 'About Us',
    title: 'About Asbily Tools — Asbily Platforms',
    description:
      'Learn about Asbily Tools by Asbily Platforms: local-first browser utilities engineered for everyday work with no account required.',
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy — Asbily Tools',
    description:
      'Read how Asbily Tools processes inputs locally in your browser, uses LocalStorage and Service Worker caching, and protects your privacy.',
  },
  {
    id: 'terms',
    label: 'Terms of Use',
    title: 'Terms of Use — Asbily Tools',
    description: 'Terms governing use of the browser-based utilities published on Asbily Tools.',
  },
  {
    id: 'disclaimer',
    label: 'Disclaimer',
    title: 'Disclaimer — Asbily Tools',
    description:
      'Important informational notice regarding financial, tax, land area, health, currency reference, and template outputs on Asbily Tools.',
  },
  {
    id: 'faq',
    label: 'Frequently Asked Questions',
    title: 'Frequently Asked Questions — Asbily Tools',
    description:
      'Answers about local processing, offline PWA behavior, LocalStorage backups, currency conversion, and privacy on Asbily Tools.',
  },
  {
    id: 'contact',
    label: 'Contact & Feedback',
    title: 'Contact & Feedback — Asbily Tools',
    description:
      'Compose feedback locally to copy, download, or send via email to contact@asbily.com.',
  },
];

const HOME_FAQS = [
  {
    q: 'Do I need an account or subscription to use Asbily Tools?',
    a: 'No. Every tool on tools.asbily.com opens directly in your browser without registration, login walls, or paywalls.',
  },
  {
    q: 'Are uploaded files, PDFs, or text sent to any server?',
    a: 'No. File parsing, image editing, PDF merging, cryptographic hashing, and 3D rendering run locally inside your browser.',
  },
  {
    q: 'Will Asbily Tools work on my first visit without internet?',
    a: 'No. Your browser must first load the website online so the Service Worker can cache the app shell and assets. After caching, compatible tools work offline.',
  },
  {
    q: 'How safe is data saved inside LocalStorage?',
    a: 'LocalStorage stays on your device, not on our servers, but clearing browser site data can erase it. Use JSON or CSV exports for permanent backups.',
  },
];

const PAGE_FAQ_ITEMS = [
  {
    q: 'Is Asbily Tools free and account-free?',
    a: 'Yes. Every utility in Asbily Tools is free to use directly in your browser without creating an account.',
  },
  {
    q: 'Does Asbily Tools work offline?',
    a: 'Initial access requires an internet connection to load and cache the application shell and bundled libraries. Once loaded or installed as a PWA, compatible client-side tools continue working offline.',
  },
  {
    q: 'Are my files or passwords uploaded anywhere?',
    a: 'No. File processing, PDF manipulation, image editing, 3D rendering, and cryptographic operations run locally inside your browser.',
  },
  {
    q: 'Is data saved in LocalStorage permanent?',
    a: 'No. Browser LocalStorage stays on your device, but clearing site data or switching browsers removes it. Use the JSON backup export in Browser Storage Explorer to keep safe copies.',
  },
  {
    q: 'How does the Currency Converter work without external APIs?',
    a: 'To protect privacy and work offline, it uses built-in reference rates and lets you enter and save exact custom exchange rates locally.',
  },
];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderRouteHtml(
  template: string,
  opts: {
    title: string;
    description: string;
    keywords: string;
    canonicalUrl: string;
    jsonLdGraph: Record<string, unknown>[];
    fallbackHtml: string;
  }
): string {
  const safeTitle = escapeHtml(opts.title);
  const safeDesc = escapeHtml(opts.description);
  const safeKeywords = escapeHtml(opts.keywords);
  const safeUrl = escapeHtml(opts.canonicalUrl);
  const jsonLdString = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': opts.jsonLdGraph,
  }).replace(/</g, '\\u003c');

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${safeTitle}</title>`);
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/>/i,
    () => `<meta name="description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+name="keywords"[\s\S]*?\/>/i,
    () => `<meta name="keywords" content="${safeKeywords}" />`
  );
  html = html.replace(
    /<link\s+rel="canonical"[\s\S]*?\/>/i,
    () => `<link rel="canonical" href="${safeUrl}" />`
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="en"[\s\S]*?\/>/i,
    () => `<link rel="alternate" hreflang="en" href="${safeUrl}" />`
  );
  html = html.replace(
    /<link\s+rel="alternate"\s+hreflang="x-default"[\s\S]*?\/>/i,
    () => `<link rel="alternate" hreflang="x-default" href="${safeUrl}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"[\s\S]*?\/>/i,
    () => `<meta property="og:url" content="${safeUrl}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"[\s\S]*?\/>/i,
    () => `<meta property="og:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/>/i,
    () => `<meta property="og:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"[\s\S]*?\/>/i,
    () => `<meta name="twitter:title" content="${safeTitle}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?\/>/i,
    () => `<meta name="twitter:description" content="${safeDesc}" />`
  );
  html = html.replace(
    /<script\s+id="asbily-jsonld"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    () => `<script id="asbily-jsonld" type="application/ld+json">${jsonLdString}</script>`
  );
  html = html.replace(
    /<div\s+id="root"><\/div>/i,
    () => `<div id="root">${opts.fallbackHtml}</div>`
  );
  return html;
}

interface SitemapUrlEntry {
  loc: string;
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: string;
  imageTitle?: string;
  imageCaption?: string;
}

function buildUrlsetXml(entries: SitemapUrlEntry[], lastmod: string): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries.map((entry) => {
      const lines = [
        '  <url>',
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
      ];
      if (entry.imageTitle) {
        lines.push('    <image:image>');
        lines.push(`      <image:loc>${escapeXml(OG_IMAGE_URL)}</image:loc>`);
        lines.push(`      <image:title>${escapeXml(entry.imageTitle)}</image:title>`);
        if (entry.imageCaption) {
          lines.push(`      <image:caption>${escapeXml(entry.imageCaption)}</image:caption>`);
        }
        lines.push('    </image:image>');
      }
      lines.push('  </url>');
      return lines.join('\n');
    }),
    '</urlset>',
    '',
  ].join('\n');
}

function asbilyStaticSeoAndPwaPlugin(): Plugin {
  return {
    name: 'asbily-static-seo-and-pwa',
    apply: 'build',
    closeBundle() {
      const rootDir = __dirname;
      const distDir = path.resolve(rootDir, 'dist');
      const publicDir = path.resolve(rootDir, 'public');
      const indexHtmlPath = path.join(distDir, 'index.html');

      if (!fs.existsSync(indexHtmlPath)) return;

      const template = fs.readFileSync(indexHtmlPath, 'utf8');
      const today = new Date().toISOString().slice(0, 10);

      const baseOrg = {
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: 'Asbily Platforms',
        url: 'https://asbily.com',
        logo: `${SITE_ORIGIN}/pwa-512x512.png`,
      };
      const baseSite = {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: 'Asbily Tools',
        description:
          'Free Tools. Simple Solutions. Browser-native utilities running locally on your device.',
        inLanguage: 'en',
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      };

      const pageSitemapEntries: SitemapUrlEntry[] = [
        {
          loc: `${SITE_ORIGIN}/`,
          changefreq: 'daily',
          priority: '1.0',
          imageTitle: 'Asbily Tools — Free Online Tools for Everyday Work',
          imageCaption: `${TOOLS.length} local-first browser tools across ${CATEGORIES.filter((c) => c.id !== 'all').length} categories by Asbily Platforms.`,
        },
      ];
      const toolSitemapEntries: SitemapUrlEntry[] = [];

      // 1. Enhance root dist/index.html with ItemList + FAQPage JSON-LD and rich crawlable fallback links
      const categoryLinksHtml = CATEGORIES.filter((c) => c.id !== 'all')
        .map(
          (c) =>
            `<li><a href="/${escapeHtml(c.id)}">${escapeHtml(c.name)}</a> — ${escapeHtml(c.description)}</li>`
        )
        .join('');
      const allToolLinksHtml = TOOLS.map(
        (t) =>
          `<li><a href="/${escapeHtml(t.category)}/${escapeHtml(t.id)}">${escapeHtml(t.name)}</a> (${escapeHtml(t.categoryLabel)}) — ${escapeHtml(t.shortDesc)}</li>`
      ).join('');
      const infoLinksHtml = INFO_PAGES.map(
        (p) => `<li><a href="/${escapeHtml(p.id)}">${escapeHtml(p.label)}</a></li>`
      ).join('');

      const rootHtml = renderRouteHtml(template, {
        title: 'Asbily Tools — Free Online Tools for Everyday Work',
        description:
          'Discover free, practical browser tools for productivity, business, development, PDF documents, images, 3D mockups, and daily tasks. Local-first processing with no account required.',
        keywords:
          'Asbily Tools, free online tools, browser utilities, PDF merge split, image compressor, background remover, JSON formatter, QR code generator, 3D mockup studio, calculators, developer tools',
        canonicalUrl: `${SITE_ORIGIN}/`,
        jsonLdGraph: [
          baseOrg,
          baseSite,
          {
            '@type': 'WebApplication',
            '@id': `${SITE_ORIGIN}/#webapp`,
            url: `${SITE_ORIGIN}/`,
            name: 'Asbily Tools',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'All modern web browsers',
            browserRequirements: 'Requires JavaScript',
            isAccessibleForFree: true,
            inLanguage: 'en',
            publisher: { '@id': `${SITE_ORIGIN}/#organization` },
          },
          {
            '@type': 'ItemList',
            name: 'Asbily Tools Categories',
            numberOfItems: CATEGORIES.filter((c) => c.id !== 'all').length,
            itemListElement: CATEGORIES.filter((c) => c.id !== 'all').map((c, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: c.name,
              url: `${SITE_ORIGIN}/${c.id}`,
            })),
          },
          {
            '@type': 'FAQPage',
            mainEntity: HOME_FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ],
        fallbackHtml: `<main style="max-width:960px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><h1>Asbily Tools — Essential Tools for Everyday Work</h1><p>Free Tools. Simple Solutions. ${TOOLS.length} local-first browser utilities across ${CATEGORIES.filter((c) => c.id !== 'all').length} categories by Asbily Platforms.</p><h2>Categories</h2><ul>${categoryLinksHtml}</ul><h2>All Browser Tools</h2><ul>${allToolLinksHtml}</ul><h2>Information</h2><ul>${infoLinksHtml}</ul></main>`,
      });
      fs.writeFileSync(indexHtmlPath, rootHtml, 'utf8');

      // 2. Prerender each category page -> dist/{cat}/index.html
      for (const cat of CATEGORIES) {
        if (cat.id === 'all') continue;
        const canonicalUrl = `${SITE_ORIGIN}/${cat.id}`;
        const catTools = TOOLS.filter((t) => t.category === cat.id);

        pageSitemapEntries.push({
          loc: canonicalUrl,
          changefreq: 'weekly',
          priority: '0.9',
          imageTitle: `${cat.name} — Asbily Tools`,
          imageCaption: cat.description,
        });

        const toolListHtml = catTools
          .map(
            (t) =>
              `<li><a href="/${escapeHtml(t.category)}/${escapeHtml(t.id)}">${escapeHtml(t.name)}</a> — ${escapeHtml(t.shortDesc)}</li>`
          )
          .join('');

        const catHtml = renderRouteHtml(template, {
          title: `${cat.name} — Free Online Tools | Asbily Tools`,
          description: `${cat.description}. Private client-side tools by Asbily Platforms.`,
          keywords: `${cat.name}, ${catTools.slice(0, 8).map((t) => t.name).join(', ')}, Asbily Tools`,
          canonicalUrl,
          jsonLdGraph: [
            baseOrg,
            baseSite,
            {
              '@type': 'CollectionPage',
              url: canonicalUrl,
              name: `${cat.name} — Asbily Tools`,
              description: cat.description,
              inLanguage: 'en',
              isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
            },
            {
              '@type': 'ItemList',
              name: `${cat.name} Directory`,
              numberOfItems: catTools.length,
              itemListElement: catTools.map((t, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: t.name,
                url: `${SITE_ORIGIN}/${t.category}/${t.id}`,
              })),
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Asbily Tools', item: `${SITE_ORIGIN}/` },
                { '@type': 'ListItem', position: 2, name: cat.name, item: canonicalUrl },
              ],
            },
          ],
          fallbackHtml: `<main style="max-width:960px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><nav><a href="/">Asbily Tools</a> / ${escapeHtml(cat.name)}</nav><h1>${escapeHtml(cat.name)}</h1><p>${escapeHtml(cat.description)}. Runs locally in your browser.</p><ul>${toolListHtml}</ul></main>`,
        });

        const outDir = path.join(distDir, cat.id);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), catHtml, 'utf8');
      }

      // 3. Prerender each tool page -> dist/{category}/{toolId}/index.html
      for (const tool of TOOLS) {
        const canonicalUrl = `${SITE_ORIGIN}/${tool.category}/${tool.id}`;
        const guide = getToolGuide(tool);
        const relatedTools = TOOLS.filter(
          (t) => t.category === tool.category && t.id !== tool.id
        ).slice(0, 4);

        toolSitemapEntries.push({
          loc: canonicalUrl,
          changefreq: 'monthly',
          priority: tool.popular || tool.isNew ? '0.9' : '0.8',
          imageTitle: `${tool.name} — Asbily Tools`,
          imageCaption: tool.shortDesc,
        });

        const stepsHtml = guide.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('');
        const examplesHtml = guide.examples.map((ex) => `<li>${escapeHtml(ex)}</li>`).join('');
        const faqsHtml = guide.faqs
          .map((f) => `<dt><strong>${escapeHtml(f.q)}</strong></dt><dd>${escapeHtml(f.a)}</dd>`)
          .join('');
        const relatedHtml = relatedTools
          .map(
            (rt) =>
              `<li><a href="/${escapeHtml(rt.category)}/${escapeHtml(rt.id)}">${escapeHtml(rt.name)}</a> — ${escapeHtml(rt.shortDesc)}</li>`
          )
          .join('');

        const toolGraph: Record<string, unknown>[] = [
          baseOrg,
          baseSite,
          {
            '@type': 'WebApplication',
            url: canonicalUrl,
            name: tool.name,
            description: tool.shortDesc,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'All modern web browsers',
            browserRequirements: 'Requires JavaScript',
            isAccessibleForFree: true,
            inLanguage: 'en',
            publisher: { '@id': `${SITE_ORIGIN}/#organization` },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Asbily Tools', item: `${SITE_ORIGIN}/` },
              {
                '@type': 'ListItem',
                position: 2,
                name: tool.categoryLabel,
                item: `${SITE_ORIGIN}/${tool.category}`,
              },
              { '@type': 'ListItem', position: 3, name: tool.name, item: canonicalUrl },
            ],
          },
        ];

        if (guide.steps.length > 0) {
          toolGraph.push({
            '@type': 'HowTo',
            name: `How to use ${tool.name}`,
            description: tool.shortDesc,
            step: guide.steps.map((stepText, idx) => ({
              '@type': 'HowToStep',
              position: idx + 1,
              text: stepText,
            })),
          });
        }

        if (guide.faqs.length > 0) {
          toolGraph.push({
            '@type': 'FAQPage',
            mainEntity: guide.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          });
        }

        const toolHtml = renderRouteHtml(template, {
          title: `${tool.name} — Free Online Tool | Asbily Tools`,
          description: `${tool.shortDesc} Runs locally in your browser with no server upload or account required.`,
          keywords: `${tool.name}, ${tool.categoryLabel}, ${tool.tags.join(', ')}, free online tool, Asbily Tools`,
          canonicalUrl,
          jsonLdGraph: toolGraph,
          fallbackHtml: `<main style="max-width:960px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><nav><a href="/">Asbily Tools</a> / <a href="/${escapeHtml(tool.category)}">${escapeHtml(tool.categoryLabel)}</a> / ${escapeHtml(tool.name)}</nav><h1>${escapeHtml(tool.name)}</h1><p>${escapeHtml(tool.shortDesc)}</p><h2>Usage Instructions</h2><ol>${stepsHtml}</ol><h2>Examples &amp; Tips</h2><ul>${examplesHtml}</ul><h2>Privacy &amp; Local Processing</h2><p>${escapeHtml(guide.privacyNote)}</p><h2>Frequently Asked Questions</h2><dl>${faqsHtml}</dl><h2>Related ${escapeHtml(tool.categoryLabel)} Tools</h2><ul>${relatedHtml}</ul></main>`,
        });

        const outDir = path.join(distDir, tool.category, tool.id);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), toolHtml, 'utf8');
      }

      // 4. Prerender public info pages -> dist/{info}/index.html
      for (const info of INFO_PAGES) {
        const canonicalUrl = `${SITE_ORIGIN}/${info.id}`;
        pageSitemapEntries.push({
          loc: canonicalUrl,
          changefreq: 'monthly',
          priority: '0.6',
        });

        const infoGraph: Record<string, unknown>[] = [
          baseOrg,
          baseSite,
          {
            '@type': 'WebPage',
            url: canonicalUrl,
            name: info.title,
            description: info.description,
            inLanguage: 'en',
            isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Asbily Tools', item: `${SITE_ORIGIN}/` },
              { '@type': 'ListItem', position: 2, name: info.label, item: canonicalUrl },
            ],
          },
        ];

        if (info.id === 'faq') {
          infoGraph.push({
            '@type': 'FAQPage',
            mainEntity: PAGE_FAQ_ITEMS.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          });
        }

        const infoHtml = renderRouteHtml(template, {
          title: info.title,
          description: info.description,
          keywords: `${info.label}, Asbily Tools, Asbily Platforms, local-first browser tools`,
          canonicalUrl,
          jsonLdGraph: infoGraph,
          fallbackHtml: `<main style="max-width:960px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><nav><a href="/">Asbily Tools</a> / ${escapeHtml(info.label)}</nav><h1>${escapeHtml(info.label)}</h1><p>${escapeHtml(info.description)}</p><ul>${infoLinksHtml}</ul></main>`,
        });

        const outDir = path.join(distDir, info.id);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), infoHtml, 'utf8');
      }

      // 5. Generate segmented XML sitemaps (sitemapindex + sitemap-pages.xml + sitemap-tools.xml)
      const sitemapIndexXml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <sitemap>',
        `    <loc>${SITE_ORIGIN}/sitemap-pages.xml</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
        '  <sitemap>',
        `    <loc>${SITE_ORIGIN}/sitemap-tools.xml</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '  </sitemap>',
        '</sitemapindex>',
        '',
      ].join('\n');

      const sitemapPagesXml = buildUrlsetXml(pageSitemapEntries, today);
      const sitemapToolsXml = buildUrlsetXml(toolSitemapEntries, today);

      for (const dir of [distDir, publicDir]) {
        fs.writeFileSync(path.join(dir, 'sitemap.xml'), sitemapIndexXml, 'utf8');
        fs.writeFileSync(path.join(dir, 'sitemap-pages.xml'), sitemapPagesXml, 'utf8');
        fs.writeFileSync(path.join(dir, 'sitemap-tools.xml'), sitemapToolsXml, 'utf8');
      }

      // 6. Inject built dist/assets/* into dist/sw.js precache list for offline PWA support
      const assetsDir = path.join(distDir, 'assets');
      const swDistPath = path.join(distDir, 'sw.js');
      if (fs.existsSync(assetsDir) && fs.existsSync(swDistPath)) {
        const assetFiles = fs
          .readdirSync(assetsDir)
          .filter((f) => /\.(js|mjs|css|svg|png|webp|woff2?)$/i.test(f))
          .map((f) => `/assets/${f}`);
        const swContent = fs.readFileSync(swDistPath, 'utf8');
        const injectedSw = swContent.replace(
          '/* __PRECACHE_ASSETS__ */ []',
          () => JSON.stringify(assetFiles)
        );
        fs.writeFileSync(swDistPath, injectedSw, 'utf8');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), asbilyStaticSeoAndPwaPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
