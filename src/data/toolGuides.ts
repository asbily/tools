import { ToolItem } from '../types';

export interface ToolGuide {
  steps: string[];
  examples: string[];
  privacyNote: string;
  faqs: { q: string; a: string }[];
}

const SPECIFIC_GUIDES: Record<string, Partial<ToolGuide>> = {
  'json-formatter': {
    steps: [
      'Paste or type raw JSON data into the input editor.',
      'Choose Format (2 spaces or 4 spaces), Minify, or Validate.',
      'Review any syntax error message with exact line/column hints if invalid.',
      'Copy the formatted output or download it as a .json file.',
    ],
    examples: [
      'Beautify minified API payloads for debugging.',
      'Validate configuration files before committing to a repository.',
    ],
  },
  'curl-builder': {
    steps: [
      'Select an HTTP method (GET, POST, PUT, PATCH, DELETE) and enter your target endpoint URL.',
      'Add any custom headers or query parameters needed for the request.',
      'Provide a JSON request body when sending POST, PUT, or PATCH payloads.',
      'Switch between cURL and JavaScript fetch() output and copy the generated snippet.',
    ],
    examples: [
      'Generate a ready-to-run terminal cURL command for local testing.',
      'Note: Asbily Tools generates request code locally and does not send network requests to external endpoints.',
    ],
  },
  'currency-converter': {
    steps: [
      'Enter the amount you want to convert and select source and target currencies.',
      'Use built-in reference rates or enter an exact custom bank/exchange rate override.',
      'Click "Save Rate Locally" if you want your custom rate remembered in browser storage.',
      'Copy the formatted conversion summary or reset to default reference rates anytime.',
    ],
    examples: [
      'Convert USD to BDT using your bank\'s exact card settlement rate.',
      'Compare equivalent values across multiple major currencies offline.',
    ],
  },
  '3d-mockup-studio': {
    steps: [
      'Upload a screenshot or image, or customize the built-in typography card.',
      'Choose a 3D form factor (Slab, Box, or Frame), surface finish, and background.',
      'Drag directly inside the viewport or adjust Pitch, Yaw, and Camera Zoom sliders.',
      'Export a high-resolution PNG render directly from your browser\'s WebGL canvas.',
    ],
    examples: [
      'Create transparent product showcase renders for documentation or portfolios.',
      'Preview app interfaces at clean isometric angles without desktop 3D software.',
    ],
  },
  '3d-geometry-viewer': {
    steps: [
      'Select a parametric 3D mesh (Torus Knot, Geodesic, Cube, Octahedron, or Cylinder).',
      'Adjust albedo color, metalness, roughness, and wireframe preview settings.',
      'Orbit the model with mouse or touch drag.',
      'Export a PNG render or generate an ASCII .STL file for 3D printing and CAD workflows.',
    ],
    examples: [
      'Export a Torus Knot .STL mesh for slicer testing.',
      'Inspect PBR surface roughness and metalness responses in real time.',
    ],
  },
  'storage-viewer': {
    steps: [
      'Inspect browser storage quota and review keys saved under LocalStorage for this origin.',
      'Export a full JSON backup before clearing browser site data or switching devices.',
      'Restore an earlier JSON backup file locally to recover saved notes or preferences.',
      'Delete individual keys or clear all stored items after confirming.',
    ],
    examples: [
      'Back up saved tools, study notes, khata ledgers, and custom preferences to a .json file.',
    ],
  },
};

const CATEGORY_DEFAULTS: Record<string, ToolGuide> = {
  '3d': {
    steps: [
      'Configure your geometry, texture, or uploaded image in the control panel.',
      'Orbit and inspect the 3D scene directly inside the WebGL viewport.',
      'Export high-resolution PNG renders or .STL mesh files locally.',
    ],
    examples: [
      'Render clean product mockups or export 3D-printable geometry without uploading assets.',
    ],
    privacyNote: 'All WebGL rendering, texture mapping, and STL mesh serialization execute locally in your browser GPU/CPU memory.',
    faqs: [
      { q: 'Are uploaded screenshots sent to a server?', a: 'No. Uploaded images are read via local Object URLs inside your browser and never transmitted anywhere.' },
      { q: 'Does 3D Studio work on mobile devices?', a: 'Yes. Touch drag rotation and responsive controls work on modern mobile browsers that support WebGL.' },
    ],
  },
  text: {
    steps: [
      'Paste or type your text into the input area.',
      'Select your transformation, formatting, or comparison option.',
      'Review live metrics or output, then copy or clear with one click.',
    ],
    examples: [
      'Clean copied text from PDFs, normalize Bangla Unicode, or compare two drafts side-by-side.',
    ],
    privacyNote: 'Your text never leaves your device. All string processing runs instantaneously in browser memory.',
    faqs: [
      { q: 'Is there a character limit?', a: 'There is no artificial server limit; performance depends only on your device memory.' },
      { q: 'Can I use text tools offline?', a: 'Yes. Once Asbily Tools is loaded and cached by the Service Worker, text utilities work offline.' },
    ],
  },
  social: {
    steps: [
      'Enter your topic, niche, or draft post copy.',
      'Select your target platform and preferred tone or formatting style.',
      'Copy the generated hashtags, bio, or formatted post directly to your clipboard.',
    ],
    examples: [
      'Preserve clean paragraph breaks on Instagram or check headline character limits before posting.',
    ],
    privacyNote: 'Templates and formatting run locally with zero account login or social API connection.',
    faqs: [
      { q: 'Do I need to connect my social media account?', a: 'No. Asbily Tools never asks for social logins or API tokens.' },
    ],
  },
  developer: {
    steps: [
      'Enter or paste your code, structured data, or files into the workspace.',
      'Run the formatting, encoding, validation, or archive action.',
      'Inspect any validation feedback, then copy or download the processed output.',
    ],
    examples: [
      'Validate JSON payloads, decode JWT claims locally, test RegExp patterns, or pack .zip archives.',
    ],
    privacyNote: 'Tokens, hashes, source code, and archives are processed strictly inside your local browser sandbox.',
    faqs: [
      { q: 'Is it safe to decode JWTs or hash text here?', a: 'Yes. Decoding and Web Crypto hashing happen locally in browser memory with zero network transmission.' },
    ],
  },
  seo: {
    steps: [
      'Fill in your page title, description, URLs, or structured schema fields.',
      'Inspect live previews and character counts to verify search snippet formatting.',
      'Copy the generated HTML, XML, or robots.txt code or download the file directly.',
    ],
    examples: [
      'Build a valid sitemap.xml, Open Graph tags, or Schema.org JSON-LD snippet before launch.',
    ],
    privacyNote: 'All markup and configuration files are generated locally in your browser without crawling external sites.',
    faqs: [
      { q: 'Does generating a sitemap guarantee search indexing?', a: 'No. Generating valid metadata and sitemaps prepares your site for crawlers, but indexing always depends on each search engine.' },
    ],
  },
  image: {
    steps: [
      'Select an image file from your device (or paste SVG code where supported).',
      'Adjust compression quality, dimensions, crop, watermark, or color tolerance.',
      'Preview the processed result locally and download in PNG, JPEG, or WebP format.',
    ],
    examples: [
      'Compress large photos before uploading or remove solid backgrounds for transparent PNG logos.',
    ],
    privacyNote: 'Images are processed strictly using the HTML5 Canvas API on your device and are never uploaded to any server.',
    faqs: [
      { q: 'Are my photos uploaded to the cloud?', a: 'No. Image resizing, filtering, cropping, and conversion happen completely inside your local browser.' },
    ],
  },
  pdf: {
    steps: [
      'Select local PDF files, images, or fill in your document/invoice/resume fields.',
      'Arrange pages, rotation angles, or layout preferences.',
      'Generate and download the final PDF directly to your device.',
    ],
    examples: [
      'Merge multi-page PDFs, split specific page ranges, or export an ATS-friendly resume PDF.',
    ],
    privacyNote: 'PDF generation and manipulation run client-side via locally bundled libraries (pdf-lib and jsPDF).',
    faqs: [
      { q: 'Can I edit confidential documents safely?', a: 'Yes. Documents stay inside your device memory and are never transmitted over the network.' },
    ],
  },
  security: {
    steps: [
      'Configure length, character sets, or select a local file for checksum verification.',
      'Generate credentials using the browser\'s cryptographically secure Web Crypto API.',
      'Copy your generated output or compare SHA hashes locally.',
    ],
    examples: [
      'Verify downloaded software SHA-256 checksums or generate high-entropy passphrases offline.',
    ],
    privacyNote: 'Uses window.crypto.getRandomValues and crypto.subtle.digest locally. Nothing is logged or transmitted.',
    faqs: [
      { q: 'Are generated passwords saved anywhere?', a: 'No. Passwords exist only in your current screen session until you clear or leave the page.' },
    ],
  },
  calculator: {
    steps: [
      'Enter your numeric values and choose units, currency, or calculation mode.',
      'Review the real-time breakdown and formula summary.',
      'Copy the result or reset fields to start a new calculation.',
    ],
    examples: [
      'Estimate loan EMI schedules, compute profit margins, or convert measurements offline.',
    ],
    privacyNote: 'All calculations execute deterministically in browser JavaScript with zero server round-trips.',
    faqs: [
      { q: 'Are financial and health results certified advice?', a: 'No. Results are provided for informational and planning purposes only.' },
    ],
  },
  student: {
    steps: [
      'Add your courses, marks, flashcards, or citation details.',
      'Review calculated GPA/percentages or formatted bibliography output.',
      'Copy, export, or save your study notes locally in browser storage.',
    ],
    examples: [
      'Track semester CGPA, practice flashcards, or format APA/MLA citations.',
    ],
    privacyNote: 'Study notes and decks stored locally remain in your browser storage; export backups before clearing site data.',
    faqs: [
      { q: 'Is LocalStorage permanent?', a: 'No. Clearing browser cache/site data can erase locally saved notes, so export important work regularly.' },
    ],
  },
  business: {
    steps: [
      'Enter company, employee, inventory, or project line-item details.',
      'Preview formatted calculations, payslips, POs, or financial break-even curves.',
      'Download official PDFs or CSV spreadsheets directly to your device.',
    ],
    examples: [
      'Generate A4 salary slips, track warehouse SKUs, or export attendance timesheets as CSV.',
    ],
    privacyNote: 'Business records and generated PDFs stay on your device. No financial or HR data is sent to any server.',
    faqs: [
      { q: 'Where are saved inventory or ledger items stored?', a: 'They are stored in your browser\'s LocalStorage on this device. Use CSV/JSON exports for backups.' },
    ],
  },
  daily: {
    steps: [
      'Enter measurements, ledger entries, signature strokes, or upcoming renewal dates.',
      'Review automatic calculations or visual previews.',
      'Export CSV, PNG, SVG, or .ICS calendar files directly to your device.',
    ],
    examples: [
      'Convert Shotok/Katha/Bigha land units, draw transparent e-signatures, or export bill reminders to your calendar.',
    ],
    privacyNote: 'Personal ledgers, signatures, and reminders remain private on your device.',
    faqs: [
      { q: 'How do I keep my Khata or bill records safe long-term?', a: 'Export CSV or JSON backups from the tool or Browser Storage Explorer periodically.' },
    ],
  },
  productivity: {
    steps: [
      'Set up your tasks, habits, timer duration, or timezone cities.',
      'Track progress interactively inside your browser.',
      'Use export or reset controls to manage your local workspace.',
    ],
    examples: [
      'Run Pomodoro focus sessions, find overlapping meeting hours across timezones, or test typing WPM.',
    ],
    privacyNote: 'Tasks, habits, and personal bests are saved locally in your browser without requiring an account.',
    faqs: [
      { q: 'Can I sync tasks across devices?', a: 'Because Asbily Tools is 100% local-first with no cloud accounts, data stays on the current browser. You can export/import JSON backups in Storage Explorer.' },
    ],
  },
  qr: {
    steps: [
      'Select QR content type (URL, Wi-Fi, vCard, or Payment/Product Invoice) or barcode standard.',
      'Enter your data, customize monochrome styling, and verify the live scan preview.',
      'Download high-resolution PNGs, print receipt stands, or scan codes with your camera.',
    ],
    examples: [
      'Generate Wi-Fi access QR codes for guests or create printable payment stand cards locally.',
    ],
    privacyNote: 'QR encoding and camera/image decoding run entirely locally via bundled JavaScript libraries.',
    faqs: [
      { q: 'Does the camera scanner upload video frames?', a: 'No. Video frames are decoded locally on an in-memory canvas via jsQR.' },
    ],
  },
  media: {
    steps: [
      'Grant microphone or screen-capture permission when prompted by your browser (only for recording/dictation).',
      'Use playback, voice settings, or diagnostic inspection controls.',
      'Download recorded audio/video files or JSON storage backups locally.',
    ],
    examples: [
      'Record quick voice memos, capture screen tutorials as WebM, or back up your LocalStorage workspace.',
    ],
    privacyNote: 'Audio, speech, and screen recordings are captured locally using browser MediaRecorder and Web Speech APIs.',
    faqs: [
      { q: 'Does speech recognition work in every browser?', a: 'Web Speech API support varies by browser and operating system; modern Chromium browsers provide the broadest support.' },
    ],
  },
  ai: {
    steps: [
      'Enter your topic, draft text, prompt, or code snippet in the workspace.',
      'Select your preferred tone, language, style, or analysis mode.',
      'Review the generated output, apply quick edits or fixes, and copy or download locally.',
    ],
    examples: [
      'Summarize long articles offline with TF-IDF scoring, check grammar typos, or render procedural Canvas artwork.',
    ],
    privacyNote: 'All text generation, summarization, translation, grammar checks, and Canvas rendering execute locally in your browser with zero external AI API calls.',
    faqs: [
      { q: 'Does this send my text or prompts to an external AI server?', a: 'No. Every AI utility here runs deterministically inside your local browser memory and works offline once cached.' },
      { q: 'Do I need an API key?', a: 'No API key or account is required.' },
    ],
  },
  converter: {
    steps: [
      'Drop or choose a local file (PNG, JPG, WebP, MP4, WAV, CSV, JSON, or TXT) from your device.',
      'Select your desired output quality, bitrate, or formatting options.',
      'Convert in-browser and download the converted file immediately.',
    ],
    examples: [
      'Transcode WAV/MP4 audio to MP3 offline, batch-convert PNG/JPG/WebP images, or export TXT notes to PDF.',
    ],
    privacyNote: 'All file transcoding and document exports run client-side via Canvas, Web Audio API, jsPDF, and bundled encoders without uploading files.',
    faqs: [
      { q: 'Are large video or audio files uploaded anywhere?', a: 'Never. Decoding and MP3 encoding happen completely inside your browser memory.' },
    ],
  },
};

export function getToolGuide(tool: ToolItem): ToolGuide {
  const base = CATEGORY_DEFAULTS[tool.category] || CATEGORY_DEFAULTS.developer;
  const override = SPECIFIC_GUIDES[tool.id];
  if (!override) return base;
  return {
    steps: override.steps || base.steps,
    examples: override.examples || base.examples,
    privacyNote: override.privacyNote || base.privacyNote,
    faqs: override.faqs || base.faqs,
  };
}
