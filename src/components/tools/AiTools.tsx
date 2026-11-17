import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  RefreshCw,
  FileText,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Image as ImageIcon,
  Wand2,
} from 'lucide-react';

interface AiToolProps {
  toolId: string;
}

export const AiTools: React.FC<AiToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (toolId === 'ai-text-generator') return <AiTextGeneratorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'ai-summarizer') return <AiSummarizerTool onCopy={copyText} copied={copied} />;
  if (toolId === 'ai-translator') return <AiTranslatorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'ai-writing-assistant') return <AiWritingAssistantTool onCopy={copyText} copied={copied} />;
  if (toolId === 'ai-grammar-checker') return <AiGrammarCheckerTool onCopy={copyText} copied={copied} />;
  if (toolId === 'ai-image-generator') return <AiImageGeneratorTool />;
  if (toolId === 'ai-code-assistant') return <AiCodeAssistantTool onCopy={copyText} copied={copied} />;

  return <div className="text-neutral-500">AI tool not found.</div>;
};

// -------------------------------------------------------------
// 1. Smart Text & Copy Generator
// -------------------------------------------------------------
const AiTextGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({
  onCopy,
  copied,
}) => {
  const [template, setTemplate] = useState<'blog' | 'product' | 'email' | 'faq' | 'social'>('blog');
  const [topic, setTopic] = useState('Local-first browser tools for privacy-focused teams');
  const [keywords, setKeywords] = useState('privacy, fast, browser-native, no account');
  const [tone, setTone] = useState<'professional' | 'friendly' | 'persuasive' | 'concise'>('professional');
  const [variantIndex, setVariantIndex] = useState(0);

  const generatedText = useMemo(() => {
    const cleanTopic = topic.trim() || 'your topic';
    const kwList = keywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const primaryKw = kwList[0] || 'efficiency';
    const secondaryKw = kwList[1] || 'reliability';

    const toneIntro =
      tone === 'friendly'
        ? `Let’s explore ${cleanTopic} in a clear, practical way.`
        : tone === 'persuasive'
          ? `Discover why ${cleanTopic} delivers measurable value around ${primaryKw} and ${secondaryKw}.`
          : tone === 'concise'
            ? `${cleanTopic}: focused on ${primaryKw} and ${secondaryKw}.`
            : `An overview of ${cleanTopic}, engineered around ${primaryKw} and ${secondaryKw}.`;

    const variations = [
      () => {
        if (template === 'blog') {
          return `# ${cleanTopic}\n\n${toneIntro}\n\n## Why It Matters Today\nModern workflows demand speed without compromising control. Focusing on ${primaryKw} helps teams reduce friction and stay productive every day.\n\n## Key Benefits\n${(kwList.length ? kwList : ['Speed', 'Clarity', 'Control']).map((k) => `- **${k.charAt(0).toUpperCase() + k.slice(1)}**: Built into daily execution without complex onboarding.`).join('\n')}\n\n## Practical Next Steps\nStart with one repeatable workflow, measure output quality, and iterate based on real results.`;
        }
        if (template === 'product') {
          return `**${cleanTopic}**\n\n${toneIntro}\n\nDesigned for users who value ${primaryKw} and ${secondaryKw}:\n- Instant setup with zero unnecessary steps\n- Consistent output ready for production use\n- Clean, distraction-free experience across desktop and mobile\n\nKeywords highlighted: ${kwList.join(', ') || 'quality, speed'}.`;
        }
        if (template === 'email') {
          return `Subject: Quick idea regarding ${cleanTopic}\n\nHi [Name],\n\n${toneIntro}\n\nIf ${primaryKw} and ${secondaryKw} are priorities for your team this quarter, I’d love to share a concise walkthrough tailored to your workflow.\n\nWould you be open to a quick 10-minute chat this week?\n\nBest regards,\n[Your Name]`;
        }
        if (template === 'faq') {
          return `## FAQ: ${cleanTopic}\n\n**Q: What makes ${cleanTopic} effective?**\nA: ${toneIntro} It prioritizes ${primaryKw} so users finish tasks faster.\n\n**Q: Who benefits most from this approach?**\nA: Creators, developers, students, and businesses needing dependable ${secondaryKw}.\n\n**Q: How do I get started?**\nA: Define your goal, apply ${kwList[0] || 'best practices'}, and export your final work cleanly.`;
        }
        return `${toneIntro}\n\nThree things worth keeping in mind for ${cleanTopic}:\n1. Prioritize ${primaryKw}\n2. Simplify around ${secondaryKw}\n3. Ship consistently\n\n${kwList.map((k) => `#${k.replace(/\s+/g, '')}`).join(' ')}`;
      },
      () => {
        return `## ${cleanTopic} — Structured Draft\n\n${toneIntro}\n\nCore Pillars:\n- **Foundation (${primaryKw})**: Keep workflows predictable and transparent.\n- **Execution (${secondaryKw})**: Remove extra steps so you focus on results.\n- **Outcome**: Better consistency across ${kwList.slice(0, 3).join(', ') || 'everyday tasks'}.\n\nSummary: Built for practical everyday impact.`;
      },
    ];

    return variations[variantIndex % variations.length]();
  }, [template, topic, keywords, tone, variantIndex]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Format
          </label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value as typeof template)}
            className="w-full px-3 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          >
            <option value="blog">Blog Article Draft</option>
            <option value="product">Product Description</option>
            <option value="email">Outreach Email</option>
            <option value="faq">FAQ Section</option>
            <option value="social">Social Media Post</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as typeof tone)}
            className="w-full px-3 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="persuasive">Persuasive</option>
            <option value="concise">Concise</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Keywords (comma separated)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Topic / Prompt
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic or headline..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
        />
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Generated Output (Local Draft Engine)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVariantIndex((v) => v + 1)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-xs font-medium hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch Variation</span>
            </button>
            <button
              type="button"
              onClick={() => onCopy(generatedText)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
        <textarea
          readOnly
          value={generatedText}
          rows={11}
          className="w-full p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-sm font-mono leading-relaxed"
        />
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Extractive Text Summarizer (TF-IDF Sentence Scoring)
// -------------------------------------------------------------
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this', 'that', 'these', 'those',
  'it', 'its', 'as', 'from', 'they', 'we', 'you', 'he', 'she', 'has', 'have', 'had', 'can',
  'will', 'would', 'should', 'could', 'not', 'no', 'so', 'if', 'about', 'into', 'than',
]);

const AiSummarizerTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({
  onCopy,
  copied,
}) => {
  const [input, setInput] = useState(
    'Local-first web applications execute user tasks directly inside the browser without transmitting sensitive files to remote servers. This architectural approach protects personal documents, accelerates processing speed, and removes login barriers. When combined with Progressive Web App caching, users can access calculators, document splitters, and text analyzers even on unreliable networks. Modern browser APIs including Canvas, Web Audio, and Web Crypto enable desktop-grade productivity tools inside a lightweight single tab.'
  );
  const [ratio, setRatio] = useState(40);
  const [bulletMode, setBulletMode] = useState(false);

  const result = useMemo(() => {
    const clean = input.trim();
    if (!clean) return { summary: '', sentencesCount: 0, keptCount: 0, wordsBefore: 0, wordsAfter: 0 };

    const sentences = clean
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?।])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);

    if (sentences.length <= 1) {
      const wc = clean.split(/\s+/).filter(Boolean).length;
      return { summary: clean, sentencesCount: sentences.length, keptCount: sentences.length, wordsBefore: wc, wordsAfter: wc };
    }

    const freq: Record<string, number> = {};
    const words = clean.toLowerCase().match(/[a-z\u0980-\u09FF0-9]+/g) || [];
    for (const w of words) {
      if (w.length > 2 && !STOP_WORDS.has(w)) {
        freq[w] = (freq[w] || 0) + 1;
      }
    }

    const scored = sentences.map((sentence, idx) => {
      const sWords = sentence.toLowerCase().match(/[a-z\u0980-\u09FF0-9]+/g) || [];
      let score = 0;
      for (const w of sWords) {
        score += freq[w] || 0;
      }
      const norm = sWords.length ? score / Math.sqrt(sWords.length) : 0;
      const positionBonus = idx === 0 ? 1.25 : idx === sentences.length - 1 ? 1.1 : 1;
      return { sentence, idx, score: norm * positionBonus };
    });

    const keepCount = Math.max(1, Math.min(sentences.length, Math.round((sentences.length * ratio) / 100)));
    const selected = [...scored]
      .sort((a, b) => b.score - a.score)
      .slice(0, keepCount)
      .sort((a, b) => a.idx - b.idx);

    const summary = bulletMode
      ? selected.map((s) => `• ${s.sentence}`).join('\n')
      : selected.map((s) => s.sentence).join(' ');

    return {
      summary,
      sentencesCount: sentences.length,
      keptCount: keepCount,
      wordsBefore: clean.split(/\s+/).filter(Boolean).length,
      wordsAfter: summary.split(/\s+/).filter(Boolean).length,
    };
  }, [input, ratio, bulletMode]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold">Summary Length: {ratio}%</label>
          <input
            type="range"
            min={15}
            max={80}
            step={5}
            value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))}
            className="w-36 accent-black dark:accent-white"
          />
        </div>
        <label className="inline-flex items-center gap-2 text-xs font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={bulletMode}
            onChange={(e) => setBulletMode(e.target.checked)}
            className="rounded accent-black dark:accent-white"
          />
          <span>Format as Key Bullet Points</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Source Text ({result.wordsBefore} words · {result.sentencesCount} sentences)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            placeholder="Paste an article, report, or essay to summarize..."
            className="w-full p-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Key Summary ({result.wordsAfter} words · {result.keptCount} sentences)
            </label>
            <button
              type="button"
              onClick={() => onCopy(result.summary)}
              className="inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={result.summary}
            rows={10}
            className="w-full p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-sm leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. Offline Phrase & Glossary Translator
// -------------------------------------------------------------
const PHRASE_DICT: { en: string; bn: string; es: string; fr: string; ar: string; hi: string }[] = [
  { en: 'hello', bn: 'হ্যালো / নমস্কার / সালাম', es: 'hola', fr: 'bonjour', ar: 'مرحبا', hi: 'नमस्ते' },
  { en: 'good morning', bn: 'শুভ সকাল', es: 'buenos días', fr: 'bonjour', ar: 'صباح الخير', hi: 'सुप्रभात' },
  { en: 'good night', bn: 'শুভ রাত্রি', es: 'buenas noches', fr: 'bonne nuit', ar: 'تصبح على خير', hi: 'शुभ रात्रि' },
  { en: 'thank you', bn: 'ধন্যবাদ', es: 'gracias', fr: 'merci', ar: 'شكرا لك', hi: 'धन्यवाद' },
  { en: 'how are you', bn: 'আপনি কেমন আছেন?', es: '¿cómo estás?', fr: 'comment allez-vous ?', ar: 'كيف حالك؟', hi: 'आप कैसे हैं?' },
  { en: 'i am fine', bn: 'আমি ভালো আছি', es: 'estoy bien', fr: 'je vais bien', ar: 'أنا بخير', hi: 'मैं ठीक हूँ' },
  { en: 'please', bn: 'দয়া করে', es: 'por favor', fr: "s'il vous plaît", ar: 'من فضلك', hi: 'कृपया' },
  { en: 'sorry', bn: 'দুঃখিত', es: 'lo siento', fr: 'désolé', ar: 'آسف', hi: 'माफ़ कीजिए' },
  { en: 'yes', bn: 'হ্যাঁ', es: 'sí', fr: 'oui', ar: 'نعم', hi: 'हाँ' },
  { en: 'no', bn: 'না', es: 'no', fr: 'non', ar: 'لا', hi: 'नहीं' },
  { en: 'welcome', bn: 'স্বাগতম', es: 'bienvenido', fr: 'bienvenue', ar: 'أهلا وسهلا', hi: 'स्वागत है' },
  { en: 'help', bn: 'সাহায্য', es: 'ayuda', fr: 'aide', ar: 'مساعدة', hi: 'मदद' },
  { en: 'water', bn: 'পানি / জল', es: 'agua', fr: 'eau', ar: 'ماء', hi: 'पानी' },
  { en: 'food', bn: 'খাবার', es: 'comida', fr: 'nourriture', ar: 'طعام', hi: 'खाना' },
  { en: 'time', bn: 'সময়', es: 'tiempo', fr: 'temps', ar: 'وقت', hi: 'समय' },
  { en: 'today', bn: 'আজ', es: 'hoy', fr: "aujourd'hui", ar: 'اليوم', hi: 'आज' },
  { en: 'tomorrow', bn: 'আগামীকাল', es: 'mañana', fr: 'demain', ar: 'غدا', hi: 'कल' },
  { en: 'work', bn: 'কাজ', es: 'trabajo', fr: 'travail', ar: 'عمل', hi: 'काम' },
  { en: 'business', bn: 'ব্যবসা', es: 'negocio', fr: 'entreprise', ar: 'عمل تجاري', hi: 'व्यापार' },
  { en: 'money', bn: 'টাকা / অর্থ', es: 'dinero', fr: 'argent', ar: 'مال', hi: 'पैसा' },
  { en: 'price', bn: 'দাম / মূল্য', es: 'precio', fr: 'prix', ar: 'سعر', hi: 'कीमत' },
  { en: 'free', bn: 'বিনামূল্যে / ফ্রি', es: 'gratis', fr: 'gratuit', ar: 'مجاني', hi: 'मुफ़्त' },
  { en: 'download', bn: 'ডাউনলোড', es: 'descargar', fr: 'télécharger', ar: 'تحميل', hi: 'डाउनलोड' },
  { en: 'privacy', bn: 'গোপনীয়তা', es: 'privacidad', fr: 'confidentialité', ar: 'الخصوصية', hi: 'गोपनीयता' },
  { en: 'fast', bn: 'দ্রুত', es: 'rápido', fr: 'rapide', ar: 'سريع', hi: 'तेज़' },
  { en: 'good', bn: 'ভালো', es: 'bueno', fr: 'bon', ar: 'جيد', hi: 'अच्छा' },
  { en: 'bad', bn: 'খারাপ', es: 'malo', fr: 'mauvais', ar: 'سيء', hi: 'बुरा' },
  { en: 'friend', bn: 'বন্ধু', es: 'amigo', fr: 'ami', ar: 'صديق', hi: 'दोस्त' },
  { en: 'love', bn: 'ভালোবাসা', es: 'amor', fr: 'amour', ar: 'حب', hi: 'प्यार' },
  { en: 'home', bn: 'বাড়ি', es: 'casa', fr: 'maison', ar: 'منزل', hi: 'घर' },
];

type LangCode = 'en' | 'bn' | 'es' | 'fr' | 'ar' | 'hi';

const AiTranslatorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({
  onCopy,
  copied,
}) => {
  const [sourceLang, setSourceLang] = useState<LangCode>('en');
  const [targetLang, setTargetLang] = useState<LangCode>('bn');
  const [text, setText] = useState('Hello, thank you! Welcome to free business tools.');

  const translated = useMemo(() => {
    const raw = text.trim();
    if (!raw) return '';
    if (sourceLang === targetLang) return raw;

    let out = raw;
    // Multi-word phrases first, sorted longest first
    const entries = [...PHRASE_DICT].sort(
      (a, b) => b[sourceLang].length - a[sourceLang].length
    );

    for (const entry of entries) {
      const srcVal = entry[sourceLang].split('/')[0].trim();
      const tgtVal = entry[targetLang].split('/')[0].trim();
      if (!srcVal) continue;
      const escaped = srcVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex =
        sourceLang === 'en' || sourceLang === 'es' || sourceLang === 'fr'
          ? new RegExp(`\\b${escaped}\\b`, 'gi')
          : new RegExp(escaped, 'gi');
      out = out.replace(regex, tgtVal);
    }
    return out;
  }, [text, sourceLang, targetLang]);

  const langs: { code: LangCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'bn', label: 'Bengali (বাংলা)' },
    { code: 'hi', label: 'Hindi (हिन्दी)' },
    { code: 'ar', label: 'Arabic (العربية)' },
    { code: 'es', label: 'Spanish (Español)' },
    { code: 'fr', label: 'French (Français)' },
  ];

  return (
    <div className="space-y-5">
      <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-xs text-neutral-600 dark:text-neutral-400">
        Runs 100% locally offline using built-in multi-language phrase and glossary mappings across English, Bengali, Hindi, Arabic, Spanish, and French without sending text to external translation servers.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            From Language
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value as LangCode)}
            className="w-full px-3 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          >
            {langs.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            To Language
          </label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value as LangCode)}
            className="w-full px-3 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          >
            {langs.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="Type words or common phrases..."
          className="w-full p-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
        />
        <div className="space-y-2">
          <textarea
            readOnly
            value={translated}
            rows={6}
            className="w-full p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-sm"
          />
          <button
            type="button"
            onClick={() => onCopy(translated)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5" />
          <span>Quick Phrase Glossary</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PHRASE_DICT.slice(0, 14).map((p) => (
            <button
              key={p.en}
              type="button"
              onClick={() => setText(p[sourceLang].split('/')[0].trim())}
              className="px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/15 text-xs hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer"
            >
              {p.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. Writing & Tone Rewriter Assistant
// -------------------------------------------------------------
const AiWritingAssistantTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({
  onCopy,
  copied,
}) => {
  const [text, setText] = useState(
    "I'm really sorry for the delay, but we're gonna ship the update very soon so you can basically test all features."
  );
  const [mode, setMode] = useState<'formal' | 'concise' | 'persuasive' | 'academic'>('formal');

  const rewritten = useMemo(() => {
    let out = text.trim();
    if (!out) return '';

    const contractions: [RegExp, string][] = [
      [/\bI'm\b/gi, 'I am'],
      [/\bwe're\b/gi, 'we are'],
      [/\byou're\b/gi, 'you are'],
      [/\bdon't\b/gi, 'do not'],
      [/\bcan't\b/gi, 'cannot'],
      [/\bwon't\b/gi, 'will not'],
      [/\bgonna\b/gi, 'going to'],
      [/\bwanna\b/gi, 'want to'],
    ];

    if (mode === 'formal' || mode === 'academic') {
      for (const [rx, rep] of contractions) out = out.replace(rx, rep);
      out = out
        .replace(/\b(really|very|basically|actually|literally|just)\s+/gi, '')
        .replace(/\bsorry for\b/gi, 'apologies for')
        .replace(/\bsoon\b/gi, 'shortly');
      if (mode === 'academic') {
        out = out.replace(/\bwe are going to\b/gi, 'the team intends to');
      }
    } else if (mode === 'concise') {
      out = out
        .replace(/\b(really|very|basically|actually|literally|in order to|due to the fact that)\s+/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    } else if (mode === 'persuasive') {
      out = out
        .replace(/\bcan\b/gi, 'will immediately')
        .replace(/\bupdate\b/gi, 'upgraded release');
    }

    return out.charAt(0).toUpperCase() + out.slice(1);
  }, [text, mode]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const outWords = rewritten.trim() ? rewritten.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'formal', label: 'Professional & Formal' },
            { id: 'concise', label: 'Short & Concise' },
            { id: 'persuasive', label: 'Persuasive Copy' },
            { id: 'academic', label: 'Academic Polish' },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              mode === m.id
                ? 'bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] border-[#000000] dark:border-[#FFFFFF]'
                : 'border-black/15 dark:border-white/15 hover:bg-[#F6F6F6] dark:hover:bg-white/10'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Original Draft ({wordCount} words)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full p-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Polished Rewrite ({outWords} words)
            </label>
            <button
              type="button"
              onClick={() => onCopy(rewritten)}
              className="inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={rewritten}
            rows={8}
            className="w-full p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-sm"
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. Grammar, Spelling & Style Checker
// -------------------------------------------------------------
const TYPO_MAP: Record<string, string> = {
  teh: 'the',
  recieve: 'receive',
  seperate: 'separate',
  occured: 'occurred',
  untill: 'until',
  wich: 'which',
  becuase: 'because',
  definately: 'definitely',
  goverment: 'government',
  enviroment: 'environment',
  managment: 'management',
  tommorow: 'tomorrow',
  accomodate: 'accommodate',
  adress: 'address',
  alot: 'a lot',
  sucess: 'success',
  persue: 'pursue',
  calender: 'calendar',
  langauge: 'language',
  documnet: 'document',
};

const AiGrammarCheckerTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({
  onCopy,
  copied,
}) => {
  const [text, setText] = useState(
    'this documnet has the the seperate adress recieve issue  and an university example .'
  );

  const analysis = useMemo(() => {
    const issues: { kind: string; found: string; suggestion: string }[] = [];
    let fixed = text;

    // 1. Repeated consecutive words
    const repeatMatches = text.match(/\b([a-zA-Z]+)\s+\1\b/gi);
    if (repeatMatches) {
      repeatMatches.forEach((m) => {
        const single = m.split(/\s+/)[0];
        issues.push({ kind: 'Repeated word', found: m, suggestion: single });
      });
      fixed = fixed.replace(/\b([a-zA-Z]+)\s+\1\b/gi, '$1');
    }

    // 2. Common typos
    Object.entries(TYPO_MAP).forEach(([wrong, right]) => {
      const rx = new RegExp(`\\b${wrong}\\b`, 'gi');
      if (rx.test(text)) {
        issues.push({ kind: 'Spelling', found: wrong, suggestion: right });
        fixed = fixed.replace(rx, right);
      }
    });

    // 3. Double spaces & space before punctuation
    if (/\s{2,}/.test(text)) {
      issues.push({ kind: 'Spacing', found: 'Multiple spaces', suggestion: 'Single space' });
      fixed = fixed.replace(/[ \t]{2,}/g, ' ');
    }
    if (/\s+([,.!?;:])/.test(text)) {
      issues.push({ kind: 'Punctuation', found: 'Space before punctuation', suggestion: 'Remove space' });
      fixed = fixed.replace(/\s+([,.!?;:])/g, '$1');
    }

    // 4. Lowercase sentence start
    if (/^[a-z]/.test(text.trim())) {
      issues.push({ kind: 'Capitalization', found: 'Lowercase start', suggestion: 'Capitalize first letter' });
      fixed = fixed.replace(/^(\s*)([a-z])/, (_, sp, ch) => `${sp}${ch.toUpperCase()}`);
    }

    // 5. Common a/an mismatches
    if (/\ba\s+[aeiouAEIOU](?!ni|ser|se\b|nit)/i.test(text)) {
      issues.push({ kind: 'Article', found: '"a" before vowel sound', suggestion: 'Check "an"' });
    }

    return { issues, fixed };
  }, [text]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Input Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full p-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
          <button
            type="button"
            onClick={() => setText(analysis.fixed)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Apply All Auto-Fixes</span>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Detected Issues ({analysis.issues.length})
            </span>
            <button
              type="button"
              onClick={() => onCopy(analysis.fixed)}
              className="inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Corrected' : 'Copy Corrected'}</span>
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {analysis.issues.length === 0 ? (
              <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>No common spelling, repeated word, spacing, or capitalization issues found.</span>
              </div>
            ) : (
              analysis.issues.map((item, idx) => (
                <div
                  key={`${item.kind}-${idx}`}
                  className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-semibold">{item.kind}:</span>{' '}
                    <span className="line-through text-neutral-500">{item.found}</span>
                  </div>
                  <span className="font-mono font-semibold">{item.suggestion}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. Local Procedural Prompt-to-Visual Canvas Generator
// -------------------------------------------------------------
const AiImageGeneratorTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prompt, setPrompt] = useState('Futuristic minimalist geometric horizon');
  const [style, setStyle] = useState<'cosmic' | 'monochrome' | 'sunset' | 'cyber' | 'bauhaus'>('cosmic');
  const [aspect, setAspect] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [seed, setSeed] = useState(42);
  const [overlayText, setOverlayText] = useState('');

  const dims = aspect === '16:9' ? { w: 1280, h: 720 } : aspect === '9:16' ? { w: 720, h: 1280 } : { w: 960, h: 960 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dims.w;
    canvas.height = dims.h;

    // Seeded PRNG based on prompt + seed
    let hash = seed;
    for (let i = 0; i < prompt.length; i++) {
      hash = (hash * 31 + prompt.charCodeAt(i)) >>> 0;
    }
    const rand = () => {
      hash = (1664525 * hash + 1013904223) >>> 0;
      return hash / 4294967296;
    };

    const palettes: Record<typeof style, string[]> = {
      cosmic: ['#070B19', '#1D2B64', '#4A00E0', '#8E2DE2', '#00D2FF'],
      monochrome: ['#050505', '#1C1C1C', '#404040', '#A3A3A3', '#FFFFFF'],
      sunset: ['#1A0933', '#6A0572', '#AB83A1', '#FF6B6B', '#FFD93D'],
      cyber: ['#090910', '#120458', '#FF007F', '#00F5D4', '#FEE440'],
      bauhaus: ['#F6F6F6', '#111111', '#D62828', '#F77F00', '#003049'],
    };

    const pal = palettes[style];
    const grad = ctx.createLinearGradient(0, 0, dims.w, dims.h);
    grad.addColorStop(0, pal[0]);
    grad.addColorStop(0.55, pal[1]);
    grad.addColorStop(1, pal[2]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, dims.w, dims.h);

    // Soft glowing orbs & mesh layers
    for (let i = 0; i < 14; i++) {
      const cx = rand() * dims.w;
      const cy = rand() * dims.h;
      const r = (0.12 + rand() * 0.35) * Math.min(dims.w, dims.h);
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      const col = pal[Math.floor(rand() * pal.length)];
      rg.addColorStop(0, col);
      rg.addColorStop(1, 'transparent');
      ctx.globalAlpha = 0.25 + rand() * 0.35;
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layered procedural waves / geometric shapes
    ctx.globalAlpha = 0.45;
    for (let w = 0; w < 6; w++) {
      ctx.strokeStyle = pal[w % pal.length];
      ctx.lineWidth = 2 + rand() * 6;
      ctx.beginPath();
      const baseY = (dims.h / 7) * (w + 1);
      for (let x = 0; x <= dims.w; x += 24) {
        const y = baseY + Math.sin(x * (0.004 + w * 0.001) + rand() * 0.2) * (35 + rand() * 45);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (style === 'bauhaus' || style === 'monochrome') {
      ctx.globalAlpha = 0.85;
      for (let g = 0; g < 8; g++) {
        ctx.fillStyle = pal[(g + 2) % pal.length];
        const size = 40 + rand() * 140;
        const x = rand() * (dims.w - size);
        const y = rand() * (dims.h - size);
        if (g % 2 === 0) {
          ctx.beginPath();
          ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, size, size);
        }
      }
    }

    // Optional typography overlay
    ctx.globalAlpha = 1;
    if (overlayText.trim()) {
      ctx.fillStyle = style === 'bauhaus' ? '#111111' : '#FFFFFF';
      ctx.font = `800 ${Math.round(dims.w * 0.055)}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(overlayText.trim(), dims.w / 2, dims.h / 2, dims.w * 0.86);
    }
  }, [prompt, style, aspect, seed, overlayText, dims.w, dims.h]);

  const downloadImage = (fmt: 'png' | 'webp') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL(`image/${fmt}`, 0.94);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asbily-visual-${seed}.${fmt}`;
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-xs text-neutral-600 dark:text-neutral-400">
        Generates high-resolution deterministic procedural artwork directly on your HTML5 Canvas from your text prompt, style palette, and seed—no cloud image server required.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Visual Prompt
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Optional Overlay Title
          </label>
          <input
            type="text"
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
            placeholder="e.g. Studio Poster"
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as typeof style)}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          <option value="cosmic">Cosmic Nebula</option>
          <option value="monochrome">Minimal Monochrome</option>
          <option value="sunset">Warm Sunset</option>
          <option value="cyber">Cyber Neon</option>
          <option value="bauhaus">Geometric Bauhaus</option>
        </select>

        <select
          value={aspect}
          onChange={(e) => setAspect(e.target.value as typeof aspect)}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          <option value="1:1">Square (1:1)</option>
          <option value="16:9">Landscape (16:9)</option>
          <option value="9:16">Portrait / Story (9:16)</option>
        </select>

        <button
          type="button"
          onClick={() => setSeed((s) => (s + 17) % 99999)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Seed (#{seed})</span>
        </button>

        <button
          type="button"
          onClick={() => downloadImage('png')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PNG</span>
        </button>
      </div>

      <div className="flex justify-center p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-[420px] rounded-xl shadow-md object-contain"
        />
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 7. Code Analyzer & Snippet Assistant
// -------------------------------------------------------------
const CODE_SNIPPETS: Record<string, string> = {
  'Fetch JSON with Error Handling': `async function fetchJson<T>(url: string): Promise<T> {\n  const res = await fetch(url);\n  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n  return (await res.json()) as T;\n}`,
  'React Debounce Hook': `import { useEffect, useState } from 'react';\n\nexport function useDebounce<T>(value: T, delay = 300): T {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const id = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(id);\n  }, [value, delay]);\n  return debounced;\n}`,
  'Python CSV Reader': `import csv\n\nwith open("data.csv", newline="", encoding="utf-8") as f:\n    rows = list(csv.DictReader(f))\nprint(f"Loaded {len(rows)} rows")`,
  'SQL Aggregation Query': `SELECT category, COUNT(*) AS total_items, ROUND(AVG(price), 2) AS avg_price\nFROM products\nWHERE active = true\nGROUP BY category\nORDER BY total_items DESC;`,
};

const AiCodeAssistantTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({
  onCopy,
  copied,
}) => {
  const [code, setCode] = useState(
    `var total = 0;\nfunction calculateTotal(items) {\n  for (var i = 0; i < items.length; i++) {\n    if (items[i].price == 0) continue;\n    total += items[i].price;\n  }\n  console.log(total);\n  return total;\n}`
  );

  const review = useMemo(() => {
    const warnings: string[] = [];
    const lines = code.split('\n');
    const fnCount = (code.match(/\bfunction\b|=>/g) || []).length;
    const importCount = (code.match(/^\s*(import|from|require)\b/gm) || []).length;

    if (/\bvar\b/.test(code)) warnings.push('Replace `var` with block-scoped `const` or `let`.');
    if (/[^=!]==[^=]/.test(code)) warnings.push('Prefer strict equality (`===`) over loose equality (`==`).');
    if (/console\.(log|debug)/.test(code)) warnings.push('Remove debug `console.log` statements before production.');
    if (/innerHTML\s*=/.test(code)) warnings.push('Avoid direct `innerHTML` assignment with untrusted strings (XSS risk).');

    return { lines: lines.length, fnCount, importCount, warnings };
  }, [code]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-neutral-500">Insert Template:</span>
        {Object.entries(CODE_SNIPPETS).map(([label, snippet]) => (
          <button
            key={label}
            type="button"
            onClick={() => setCode(snippet)}
            className="px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-xs font-medium hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              <span>Code Workspace</span>
            </span>
            <button
              type="button"
              onClick={() => onCopy(code)}
              className="inline-flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={11}
            spellCheck={false}
            className="w-full p-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono text-xs leading-relaxed"
          />
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
              <div className="text-[11px] text-neutral-500">Lines</div>
              <div className="text-lg font-bold tabular-nums">{review.lines}</div>
            </div>
            <div className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
              <div className="text-[11px] text-neutral-500">Functions</div>
              <div className="text-lg font-bold tabular-nums">{review.fnCount}</div>
            </div>
            <div className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
              <div className="text-[11px] text-neutral-500">Imports</div>
              <div className="text-lg font-bold tabular-nums">{review.importCount}</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider">Static Lint & Refactor Hints</div>
            {review.warnings.length === 0 ? (
              <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>No common anti-patterns detected in this snippet.</span>
              </div>
            ) : (
              <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                {review.warnings.map((w) => (
                  <li key={w} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
