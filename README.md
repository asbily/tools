# Asbily Tools — Free Tools. Simple Solutions.

**Publisher:** Asbily Platforms  
**Product:** Asbily Tools  
**Production Website:** [https://tools.asbily.com](https://tools.asbily.com)  
**Main Website:** [https://asbily.com](https://asbily.com)  
**Repository:** [https://github.com/asbily/tools](https://github.com/asbily/tools)  
**Tagline:** Free Tools. Simple Solutions.

---

## 1. Overview & Local-First Architecture

**Asbily Tools** is a local-first, privacy-focused suite of **111 browser-native utilities across 15 categories**. Every tool executes directly on the user's device using standard browser APIs and locally bundled JavaScript libraries.

### Core Architectural Guarantees
- **100% Local Processing:** Text transforms, image compression/cutouts, PDF merging/splitting, QR generation/scanning, cryptographic hashing, WebGL 3D mockups, and calculators run inside the user's browser sandbox with zero file uploads or external processing APIs.
- **Zero External Runtime Dependencies:** No analytics scripts, no third-party ad networks, no remote font CDNs, and no external exchange-rate or backend API calls.
- **No Account Required:** Open and use every tool immediately without registration, paywalls, or cloud lock-in.
- **PWA & Cached Offline Support:** Includes a valid `manifest.webmanifest`, compliant PNG/maskable icons, offline fallback page (`/offline.html`), update banner, and a Service Worker (`/sw.js`) that precaches built static assets. Note: first-time visits require an active internet connection so the browser can load and cache the application; once cached, compatible tools operate offline.
- **Crawlable Static SEO Output:** During `npm run build`, Vite generates valid `/sitemap.xml` (133 canonical URLs) and static prerendered HTML files with unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph, Twitter Card, and Schema.org JSON-LD for the homepage, 15 categories, 111 tools, and 6 public information pages (`/about`, `/privacy`, `/terms`, `/disclaimer`, `/faq`, `/contact`).

---

## 2. Categories & Tool Count (111 Registered Tools)

| Category Route | Suite Name | Count | Highlights |
| :--- | :--- | :---: | :--- |
| `/3d` | **3D Studio** | 2 | WebGL 3D Mockup Studio, PBR Geometry Viewer & STL Export |
| `/text` | **Text Tools** | 8 | Word Counter, Case Converter, Cleaner, Deduplicator, Diff, Lorem Ipsum, Fancy Unicode, Bangla Cleaner |
| `/social` | **Social Media** | 5 | Hashtags, Caption Ideas, Bio Generator, Non-Collapsing Formatter, Canvas Dimensions |
| `/developer` | **Developer Tools** | 18 | JSON, Base64, URL, HTML Entities, CSV/JSON, XML/YAML, SQL, Regex, JWT, UUID, SHA Hashes, Epoch, Cron, Base Converter, cURL/fetch Builder, Markdown, CSS Shadows, ZIP Archiver |
| `/seo` | **SEO & Web** | 9 | Meta Tags, Robots.txt, Sitemap.xml, Social Card Preview, Canonical/Hreflang, Schema JSON-LD, UTM Builder, Launch Checklist, Security Headers |
| `/image` | **Image & Design** | 10 | Cropper/Rotator, BG Color Remover, Resizer, Compressor, Converter, Base64, SVG-to-PNG, Favicon Pack, Palette Extractor, Watermark |
| `/pdf` | **PDF & Documents** | 7 | PDF Merge & Split, Page Rotate/Organizer, Resume/CV PDF Builder, Images to PDF, Text to PDF, Invoice, Quotation |
| `/security` | **Security & Privacy** | 5 | Web Crypto Password Generator, Strength Meter, Passphrase, File SHA Checksum, Policy Template |
| `/calculator` | **Calculators & Units** | 10 | Currency & Custom Rate Converter, BMI/BMR/TDEE, Tax & Discount Split, Scientific, Percentage, Profit/Margin, Age/Date, Loan/EMI, Electricity, Unit Converter |
| `/student` | **Student Tools** | 5 | GPA/CGPA, Exam Marks, Flashcards, APA/MLA Citations, Quick Study Notes |
| `/business` | **Business & Enterprise** | 9 | Payroll & Salary Slip, PO & Delivery Challan, Inventory & SKU, Freelance Contract & NDA, Break-Even & Profit, Budget Planner, Expense Tracker, Business Names, Agenda Maker |
| `/daily` | **Everyday & Daily Life** | 6 | Land Area (Shotok/Katha/Bigha), Digital Khata Ledger, Transparent E-Signature, Trip Split, Bills & Warranty ICS Reminders, Cooking/Fuel Utilities |
| `/productivity` | **Productivity** | 7 | World Clock & Meeting Planner, Habit Streak Tracker, Typing WPM Test, Focus To-Do, Pomodoro Timer, Stopwatch, Random Picker |
| `/qr` | **QR & Barcodes** | 4 | Product & Payment QR Stand, Custom QR Generator, Barcode Generator, Camera QR Scanner |
| `/media` | **Media & Browser** | 6 | Voice Memo Recorder, Screen & Audio Recorder, Text-to-Speech, Speech-to-Text, Device Diagnostic, LocalStorage Backup Explorer |

*(Note: Category totals above sum cleanly across all 111 registered entries in `src/data/toolsData.ts`.)*

---

## 3. Local Development & Build

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Run TypeScript check
npm run lint

# Build production bundle + static SEO prerender + sitemap.xml + SW precache
npm run build

# Preview production bundle locally
npm run preview
```

---

## 4. Search Engine Verification & Indexing Checklist

After deploying `dist/` to `https://tools.asbily.com`:
1. Confirm `https://tools.asbily.com/robots.txt` and `https://tools.asbily.com/sitemap.xml` return HTTP 200.
2. Add your Google Search Console (`google-site-verification`) or Bing Webmaster (`msvalidate.01`) verification meta tags in `index.html` (placeholder comments included) or DNS TXT records.
3. Submit `https://tools.asbily.com/sitemap.xml` inside Google Search Console and Bing Webmaster Tools.

---

© 2026 **Asbily Platforms**. All rights reserved.
