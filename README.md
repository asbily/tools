# Asbily Free Tools — Free Tools. Simple Solutions.

**Publisher:** Asbily Platforms  
**Brand:** Asbily  
**Logo:** `asbily.svg`  
**Tagline:** Free Tools. Simple Solutions.  
**Website Language:** English  
**Audience:** Global users  
**Design Palette:** Minimal Pure White (`#FFFFFF`), Text (`#111111`), Secondary (`#666666`), Borders (`#E5E7EB`).

---

## 1. Project Overview & Architecture
**Asbily Free Tools** is a production-grade, all-in-one free online tools platform featuring 40+ client-side browser utilities for text manipulation, social media content generation, software development, search engine optimization (SEO), client-side image processing, PDF generation, security & cryptographic hashing, mathematical & financial calculators, student tools, business management, productivity tracking, QR/barcode generation, and media diagnostics.

### Key Architectural Standards
1. **100% Client-Side Privacy:** Sensitive operations (cryptographic hash generation, Web Crypto password generation, image compression, JSON parsing, file checksums) run locally inside the user's browser sandbox. No user files or passwords are submitted to remote servers.
2. **PWA & Offline Capable:** Equipped with `manifest.webmanifest`, service worker (`/sw.js`), and cache management.
3. **Responsive & Minimalist UI:** Conforms to anti-AI-slop discipline, zero static pills, clean borders, high-contrast typography, and light/dark theme toggle.
4. **AdSense Ready & Compliant:** Features dedicated, non-intrusive advertisement placement slots clearly designated as advertisement spaces without deceptive click incentives.

---

## 2. Directory Structure
```
/
├── asbily.svg                   # Brand mark logo (Root)
├── index.html                   # HTML5 Entry Point with SEO & Social Metadata
├── metadata.json                # Project identity & capability manifest
├── package.json                 # Dependency manifest
├── tsconfig.json                # TypeScript compilation config
├── vite.config.ts               # Vite bundler configuration
├── README.md                    # Complete documentation & deployment guide
├── public/
│   ├── asbily.svg               # Static SVG logo
│   ├── manifest.webmanifest     # PWA Web App Manifest
│   └── sw.js                    # Progressive Web App Service Worker
└── src/
    ├── index.css                # Tailwind CSS v4 layers & dark mode config
    ├── main.tsx                 # React DOM mount entry
    ├── types.ts                 # TypeScript type interfaces & category definitions
    ├── App.tsx                  # Core state, hash-based router, navigation & layout
    ├── data/
    │   └── toolsData.ts         # Central registry of all tools, tags, icons & metadata
    └── components/
        ├── Header.tsx           # Brand header with logo fallback, search & theme toggle
        ├── Hero.tsx             # Hero banner with tagline, search bar & category filters
        ├── ToolCard.tsx         # Minimalist responsive tool card with favorites bookmarking
        ├── ToolView.tsx         # Detailed tool workspace with breadcrumbs & related tools
        ├── AdSlot.tsx           # Compliant AdSense placeholder container
        ├── SearchModal.tsx      # Instant search dialog with keyboard navigation (Press '/')
        ├── LegalModal.tsx       # About, Privacy Policy, Terms, Disclaimer, FAQ & Contact
        ├── Footer.tsx           # Brand footer, copyright & directory links
        └── tools/
            ├── TextTools.tsx             # 8 Text & Unicode utilities
            ├── SocialMediaTools.tsx      # 5 Social Media hashtag & caption tools
            ├── DeveloperTools.tsx        # 17 Developer, JSON, SQL & crypto utilities
            ├── WebsiteSeoTools.tsx       # 9 SEO, Meta tags, Robots, Sitemaps & checklists
            ├── ImageDesignTools.tsx      # 9 Client-side Canvas image & palette tools
            ├── PdfDocumentTools.tsx      # 5 jsPDF invoice, quotation & document utilities
            ├── SecurityPrivacyTools.tsx  # 5 Web Crypto passwords, entropy & checksum tools
            ├── CalculatorsTools.tsx      # 7 Safe scientific, finance & unit converters
            ├── StudentTools.tsx          # 5 GPA, exam, flashcard & citation generators
            ├── BusinessProductivityTools.tsx # 7 Invoices, agendas, todos, pomodoro & timers
            ├── QrBarcodeTools.tsx        # 3 Multi-format QR, barcode & camera scanners
            └── MediaBrowserTools.tsx     # 4 Speech synthesis, dictation & device inspectors
```

---

## 3. Implemented Tools Directory (Total: 40+ Interactive Tools)

| Category | Tool Name | Key Functionality |
| :--- | :--- | :--- |
| **Text Tools** | Word & Character Counter | Words, characters, sentences, lines, reading time |
| | Case Converter | UPPERCASE, lowercase, Title, camelCase, snake_case |
| | Text Cleaner & Formatter | Strip extra spaces, blank lines, tabs, HTML tags |
| | Duplicate Line Remover | Deduplicate & sort alphabetically (A-Z, Z-A, reverse) |
| | Text Diff Comparison | Side-by-side line comparison with added/removed highlights |
| | Lorem Ipsum Generator | Paragraphs, sentences, word count presets |
| | Fancy Unicode Text | Bold, italic, monospace, cursive, double-struck, bubble |
| | Bangla Unicode Cleaner | Sanitize ZWJ/ZWNJ (\u200C/\u200D), broken Bijoy artifacts, Dari spacing |
| **Social Media** | Hashtag Generator | Instagram, TikTok, Facebook, YouTube, LinkedIn; English & Bangla |
| | Caption & Post Ideas | Viral hooks, educational frameworks, storytelling templates |
| | Bio & Headline Generator | Punchy bios for LinkedIn, X (Twitter), and Instagram |
| | Social Post Formatter | Non-collapsing line breaks (Braille blank space) for Instagram |
| | Image Dimensions Guide | 2026 standard dimensions with blank PNG template generator |
| **Developer Tools** | JSON Formatter & Validator | 2/4 space beautify, minifier, syntax error line detection |
| | Base64 Encoder / Decoder | UTF-8 safe encode/decode, data URI support |
| | URL Encoder / Decoder | RFC 3986 encoding & query parameter breakdown |
| | HTML Entities Tool | Entity encoding & decoding (&amp;, &lt;, &gt;) |
| | CSV to JSON & JSON to CSV | RFC 4180 parsing, table view, download CSV and JSON |
| | XML / YAML / JSON | Structured cross-format tree translation |
| | SQL Formatter | Capitalize SQL keywords, clause line-breaking |
| | Regex Tester | Real-time flags (g, i, m, s), capture groups, match index |
| | JWT Token Decoder | Local decoding of JWT header & payload without server transmission |
| | UUID & GUID Generator | Cryptographically secure v4 UUIDs individually or in bulk |
| | Crypto Hash Generator | Web Crypto API SHA-256, SHA-512, SHA-384, SHA-1 |
| | Unix Timestamp / Epoch | Live epoch clock, human date to epoch & vice versa |
| | Cron Expression Explainer | 5-field cron parser with plain English translation |
| | Number Base Converter | Binary, Octal, Decimal, Hexadecimal simultaneous conversion |
| | API / cURL Builder | Construct GET/POST/PUT/DELETE requests with headers & body |
| | Markdown Editor | Live split-pane preview, markdown styling, export |
| | CSS Gradient & Shadows | Interactive visual sliders, live box preview, copy CSS |
| **Website & SEO** | Meta Tag Generator | Title, description, keywords, Open Graph, Twitter Card, Google SERP preview |
| | Robots.txt Generator | User-agents, Allow/Disallow directives, sitemap links |
| | XML Sitemap Generator | Multiple URLs, changefreq, priority, export sitemap.xml |
| | Social Card Previewer | Visual card simulation for Facebook, LinkedIn, X |
| | Canonical & Hreflang | Self-referential canonical tags and multi-language links |
| | Schema.org JSON-LD | Organization, Article, FAQPage structured data |
| | UTM Campaign Builder | URL builder with utm_source, medium, campaign, term |
| | SEO & Launch Checklist | 12-point interactive audit with progress tracking |
| | Security Headers Advisor | Content-Security-Policy, HSTS, X-Frame-Options snippets |
| **Image & Design** | Image Compressor | Canvas-based quality slider, format selection, file size savings |
| | Image Format Converter | Convert between PNG, JPEG, and WebP client-side |
| | Image to Base64 | Convert image to Data URI & CSS background snippet |
| | SVG to PNG Rasterizer | Vector SVG code/file to crisp PNG at 1x, 2x, 4x scale |
| | Favicon Generator | 16x16, 32x32, 48x48, 180x180 icons with HTML tags |
| | Color Palette Extractor | Sample dominant colors from uploaded photos |
| | Image Watermark Tool | Custom text watermark with opacity, position, and font size |
| | Color Picker & Contrast | Hex/RGB/HSL picker with WCAG AA and AAA accessibility checker |
| **PDF & Documents**| Multiple Images to PDF | Combine photos into paginated PDF via jsPDF |
| | Text to PDF | Formatted notes and documents to clean PDF |
| | Invoice Generator | Professional invoices with taxes, discounts & PDF download |
| | Quotation Maker | Project estimates with scope, validity, and PDF export |
| | PDF Inspector | Check file size, MIME type, and local metadata |
| **Security & Privacy**| Password Generator | Web Crypto random values, configurable length, ambiguous filter |
| | Password Strength Meter | Entropy in bits, brute-force estimate, vulnerability checklist |
| | Passphrase Generator | Multi-word memorable diceware passphrases |
| | File Checksum Verifier | Compute SHA-256 and SHA-1 of local files to check authenticity |
| | Privacy Policy Generator | Standard compliant policy template in Markdown |
| **Calculators** | Scientific Calculator | Safe math evaluator without eval() with trig, powers & roots |
| | Percentage & Discount | What is X% of Y, % change, discounts, savings |
| | Profit & Margin | Gross profit, markup %, and margin % calculator |
| | Age & Date Difference | Exact age in years, months, days, and birthday countdown |
| | Loan & EMI Estimator | Monthly EMI, total interest, and payout breakdown |
| | Electricity Cost | Wattage, hours/day, kWh rate, daily/monthly/annual bill |
| | Unit Converter | Length, Weight, Temperature, Data Storage, Speed, Time |
| **Student Tools** | GPA & CGPA Calculator | Semester GPA and cumulative CGPA on 4.0 grading scale |
| | Exam Marks & Percentage | Percentage score, letter grade bands, and performance remarks |
| | Digital Flashcards | Interactive study cards with question flip, next, shuffle |
| | Citation Generator | APA 7th, MLA 9th, Chicago, Harvard formatting |
| | Quick Study Notes | Auto-saved distraction-free scratchpad in LocalStorage |
| **Business & Prod** | Expense Tracker | Log income and expenses with balance calculation & storage |
| | Business Name Generator | Keyword-driven brand ideas by style |
| | Meeting Agenda Maker | Time-boxed agendas with objectives, owners, and export |
| | Focus To-Do List | Task priorities, completion status, and LocalStorage persistence |
| | Pomodoro Timer | 25m work, 5m short break, 15m long break with Web Audio chime |
| | Stopwatch | Precision millisecond stopwatch with lap tracking |
| | Random Choice Picker | Pick single winner or divide lists into balanced teams |
| **QR & Barcodes** | Custom QR Generator | URL, Text, Wi-Fi, Email, Phone with color styling & PNG export |
| | Barcode Generator | Code 128 and Code 39 1D barcodes via JsBarcode |
| | Camera QR Scanner | Real-time device camera scanning via HTML5 MediaDevices |
| **Media & Browser** | Text to Speech (TTS) | Web Speech API speech synthesis with voice, pitch, and speed controls |
| | Speech to Text (STT) | Voice dictation with real-time transcript via Web Speech API |
| | Device Diagnostic | Screen resolution, DPR, viewport, user-agent, memory |
| | Storage Explorer | Inspect, copy, and clear LocalStorage keys |

---

## 4. Deployment Instructions

### A. Deploy to Vercel (Recommended)
1. Push project to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Asbily Free Tools"
   git remote add origin https://github.com/your-username/asbily-free-tools.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### B. Deploy to Cloudflare Pages
1. In Cloudflare Dashboard, navigate to **Compute (Workers & Pages)** → **Pages** → **Connect to Git**.
2. Select repository and choose framework preset: **Vite**.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Click **Save and Deploy**.

### C. Deploy to GitHub Pages
1. In `vite.config.ts`, set `base: '/asbily-free-tools/'` (if hosted on project subpath).
2. Run `npm run build`.
3. Deploy the contents of the `dist/` folder to the `gh-pages` branch.

### D. Setup on Android Phone via Termux
1. Install **Termux** from F-Droid.
2. Update packages and install Node.js and Git:
   ```bash
   pkg update && pkg upgrade -y
   pkg install nodejs git -y
   ```
3. Clone or create the project folder:
   ```bash
   git clone https://github.com/your-username/asbily-free-tools.git
   cd asbily-free-tools
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Test locally:
   ```bash
   npm run dev
   ```
6. Open your mobile browser and navigate to `http://localhost:3000`.

---

## 5. Security & Privacy Guarantees
- No third-party analytical cookies or intrusive tracker scripts.
- No remote storage of generated passwords, hashes, tokens, or documents.
- Web Crypto API is used for high-entropy pseudorandom generation.
- Full compliance with Google AdSense content and layout policies.

---

© 2026 **Asbily Platforms**. All rights reserved.
