import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, Plugin } from 'vite';
import { CATEGORIES, TOOLS } from './src/data/toolsData';

const SITE_ORIGIN = 'https://tools.asbily.com';

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderRouteHtml(
  template: string,
  opts: {
    title: string;
    description: string;
    canonicalUrl: string;
    jsonLdGraph: Record<string, unknown>[];
    fallbackHtml: string;
  }
): string {
  const safeTitle = escapeHtml(opts.title);
  const safeDesc = escapeHtml(opts.description);
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
    /<link\s+rel="canonical"[\s\S]*?\/>/i,
    () => `<link rel="canonical" href="${safeUrl}" />`
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
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      };

      const sitemapEntries: { loc: string; changefreq: string; priority: string }[] = [
        { loc: `${SITE_ORIGIN}/`, changefreq: 'weekly', priority: '1.0' },
      ];

      // 1. Add crawlable semantic fallback inside root dist/index.html
      const categoryLinksHtml = CATEGORIES.filter((c) => c.id !== 'all')
        .map(
          (c) =>
            `<li><a href="/${escapeHtml(c.id)}">${escapeHtml(c.name)}</a> — ${escapeHtml(c.description)}</li>`
        )
        .join('');
      const rootFallback = `<main style="max-width:960px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><h1>Asbily Tools — Essential Tools for Everyday Work</h1><p>Free Tools. Simple Solutions. ${TOOLS.length} local-first browser utilities across 15 categories by Asbily Platforms.</p><ul>${categoryLinksHtml}</ul></main>`;
      const enhancedRootHtml = template.replace(
        /<div\s+id="root"><\/div>/i,
        () => `<div id="root">${rootFallback}</div>`
      );
      fs.writeFileSync(indexHtmlPath, enhancedRootHtml, 'utf8');

      // 2. Prerender each category page -> dist/{cat}/index.html
      for (const cat of CATEGORIES) {
        if (cat.id === 'all') continue;
        const canonicalUrl = `${SITE_ORIGIN}/${cat.id}`;
        sitemapEntries.push({ loc: canonicalUrl, changefreq: 'weekly', priority: '0.85' });

        const catTools = TOOLS.filter((t) => t.category === cat.id);
        const toolListHtml = catTools
          .map(
            (t) =>
              `<li><a href="/${escapeHtml(t.category)}/${escapeHtml(t.id)}">${escapeHtml(t.name)}</a> — ${escapeHtml(t.shortDesc)}</li>`
          )
          .join('');

        const catHtml = renderRouteHtml(template, {
          title: `${cat.name} — Free Online Tools | Asbily Tools`,
          description: `${cat.description}. Private client-side tools by Asbily Platforms.`,
          canonicalUrl,
          jsonLdGraph: [
            baseOrg,
            baseSite,
            {
              '@type': 'CollectionPage',
              url: canonicalUrl,
              name: `${cat.name} — Asbily Tools`,
              description: cat.description,
              isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
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
        sitemapEntries.push({ loc: canonicalUrl, changefreq: 'monthly', priority: '0.8' });

        const toolHtml = renderRouteHtml(template, {
          title: `${tool.name} — Free Online Tool | Asbily Tools`,
          description: `${tool.shortDesc} Runs locally in your browser with no server upload or account required.`,
          canonicalUrl,
          jsonLdGraph: [
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
          ],
          fallbackHtml: `<main style="max-width:960px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><nav><a href="/">Asbily Tools</a> / <a href="/${escapeHtml(tool.category)}">${escapeHtml(tool.categoryLabel)}</a> / ${escapeHtml(tool.name)}</nav><h1>${escapeHtml(tool.name)}</h1><p>${escapeHtml(tool.shortDesc)}</p><p>100% local-first browser processing by Asbily Platforms.</p></main>`,
        });

        const outDir = path.join(distDir, tool.category, tool.id);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), toolHtml, 'utf8');
      }

      // 4. Prerender public info pages -> dist/{info}/index.html
      for (const info of INFO_PAGES) {
        const canonicalUrl = `${SITE_ORIGIN}/${info.id}`;
        sitemapEntries.push({ loc: canonicalUrl, changefreq: 'monthly', priority: '0.6' });

        const infoHtml = renderRouteHtml(template, {
          title: info.title,
          description: info.description,
          canonicalUrl,
          jsonLdGraph: [
            baseOrg,
            baseSite,
            {
              '@type': 'WebPage',
              url: canonicalUrl,
              name: info.title,
              description: info.description,
              isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Asbily Tools', item: `${SITE_ORIGIN}/` },
                { '@type': 'ListItem', position: 2, name: info.label, item: canonicalUrl },
              ],
            },
          ],
          fallbackHtml: `<main style="max-width:960px;margin:0 auto;padding:32px 16px;font-family:system-ui,sans-serif"><nav><a href="/">Asbily Tools</a> / ${escapeHtml(info.label)}</nav><h1>${escapeHtml(info.label)}</h1><p>${escapeHtml(info.description)}</p></main>`,
        });

        const outDir = path.join(distDir, info.id);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), infoHtml, 'utf8');
      }

      // 5. Write valid sitemap.xml to dist/ and public/
      const sitemapXml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...sitemapEntries.map(
          (entry) =>
            `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
        ),
        '</urlset>',
        '',
      ].join('\n');

      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
      fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');

      // 6. Inject built dist/assets/* into dist/sw.js precache list for offline PWA support
      const assetsDir = path.join(distDir, 'assets');
      const swDistPath = path.join(distDir, 'sw.js');
      if (fs.existsSync(assetsDir) && fs.existsSync(swDistPath)) {
        const assetFiles = fs
          .readdirSync(assetsDir)
          .filter((f) => /\.(js|css|svg|png|webp|woff2?)$/i.test(f))
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
