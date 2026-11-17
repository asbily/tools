import React, { useState, useMemo } from 'react';
import { Copy, Check, Download, Hash, Sparkles, Sliders, ExternalLink, Bookmark, Info } from 'lucide-react';
import { UsernameGeneratorTool, SocialImageResizerTool } from './ExtraSuiteTools';

interface SocialMediaToolProps {
  toolId: string;
}

export const SocialMediaTools: React.FC<SocialMediaToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (toolId === 'hashtag-generator') {
    return <HashtagGeneratorTool onCopy={copyText} copied={copied} />;
  }

  if (toolId === 'caption-post-ideas') {
    return <CaptionGeneratorTool onCopy={copyText} copied={copied} />;
  }

  if (toolId === 'bio-generator') {
    return <BioGeneratorTool onCopy={copyText} copied={copied} />;
  }

  if (toolId === 'post-formatter') {
    return <PostFormatterTool onCopy={copyText} copied={copied} />;
  }

  if (toolId === 'social-image-guide') {
    return <SocialImageGuideTool onCopy={copyText} />;
  }

  if (toolId === 'username-generator') {
    return <UsernameGeneratorTool />;
  }

  if (toolId === 'social-image-resizer') {
    return <SocialImageResizerTool />;
  }

  return <div className="text-neutral-500">Tool component not found.</div>;
};

// -------------------------------------------------------------
// Component: Social Media Hashtag Generator
// -------------------------------------------------------------
const HashtagGeneratorTool: React.FC<{
  onCopy: (t: string) => void;
  copied: boolean;
}> = ({ onCopy, copied }) => {
  const [platform, setPlatform] = useState<'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'linkedin'>('instagram');
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [tagCount, setTagCount] = useState(15);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Platform specific prefix / constraints
  const platformBestPractices: Record<string, { recommended: string; desc: string }> = {
    instagram: { recommended: '10–15 tags', desc: 'Mix of broad niche and focused micro-community hashtags.' },
    facebook: { recommended: '2–5 tags', desc: 'Minimal high-relevance hashtags inside post copy.' },
    tiktok: { recommended: '4–8 tags', desc: 'Key category keywords (#fyp, sound/challenge niche, topic).' },
    youtube: { recommended: '3–5 tags', desc: 'Key tags for description and video search indexing.' },
    linkedin: { recommended: '3–5 tags', desc: 'Industry keywords, professional topics, and work themes.' },
  };

  // Curated topic vocabulary clusters for reliable client-side generation
  const topicBankEN: Record<string, string[]> = {
    tech: ['tech', 'technology', 'innovation', 'coding', 'developer', 'software', 'programming', 'webdev', 'ai', 'startups', 'saas', 'engineering', 'futureofwork', 'cloud', 'cybersecurity'],
    business: ['business', 'entrepreneur', 'marketing', 'growth', 'smallbusiness', 'leadership', 'strategy', 'success', 'founder', 'sales', 'branding', 'finance', 'management'],
    fitness: ['fitness', 'workout', 'health', 'gym', 'motivation', 'fitlife', 'bodybuilding', 'nutrition', 'training', 'healthyhabits', 'wellness', 'cardio', 'lifestyle'],
    photography: ['photography', 'photooftheday', 'photographer', 'streetphotography', 'visualsoflife', 'portrait', 'camera', 'lensculture', 'composition', 'artofvisuals', 'aesthetic'],
    travel: ['travel', 'wanderlust', 'adventure', 'travelgram', 'explore', 'vacation', 'backpacking', 'nature', 'travelblogger', 'beautifuldestinations', 'tourism'],
    food: ['foodie', 'instafood', 'yummy', 'delicious', 'foodporn', 'recipe', 'cooking', 'chef', 'homemade', 'foodblogger', 'streetfood', 'healthyfood'],
    education: ['education', 'learning', 'students', 'knowledge', 'studygram', 'studywithme', 'studymotivation', 'academics', 'university', 'edutech', 'examtips'],
  };

  const topicBankBN: Record<string, string[]> = {
    tech: ['প্রযুক্তি', 'টেকনোলোজি', 'বাংলাদেশটেক', 'প্রোগ্রামিং', 'ওয়েবডিভেলপমেন্ট', 'সফটওয়্যার', 'তথ্যপ্রযুক্তি', 'ফ্রিল্যান্সিং', 'ডিজিটালবাংলাদেশ', 'আইটিসেক্টর'],
    business: ['ব্যবসা', 'উদ্যোক্তা', 'বিজনেস', 'স্টার্টআপ', 'মার্কেটিং', 'অর্থনীতি', 'সাফল্য', 'ব্যবসাআইডিয়া', 'বাণিজ্য', 'অনলাইনবিজনেস'],
    fitness: ['ব্যায়াম', 'সুস্থতা', 'ফিটনেস', 'স্বাস্থ্যটিপস', 'যোগব্যায়াম', 'ডায়েট', 'স্বাস্থ্যকরজীবন', 'পুষ্টি'],
    food: ['খাবার', 'রেসিপি', 'বাংলাখাবার', 'রান্নাঘর', 'ভোজনরসিক', 'স্বাদ', 'বিরিয়ানি', 'মিষ্টি', 'বাঙালিয়ানা', 'হোমমেড'],
    travel: ['ভ্রমণ', 'ট্যুর', 'বাংলাদেশভ্রমণ', 'প্রকৃতি', 'ভ্রমণপিপাসু', 'সেন্টমার্টিন', 'কক্সবাজার', 'সিলেট', 'সাজেক'],
    education: ['শিক্ষা', 'পড়াশোনা', 'জ্ঞান', 'পরীক্ষাপ্রস্তুতি', 'বিশ্ববিদ্যালয়', 'বিসিএসপ্রস্তুতি', 'স্কুলকলেজ'],
  };

  const generatedTags = useMemo(() => {
    const rawClean = topic.trim().toLowerCase().replace(/[^a-z0-9\u0980-\u09FF\s]/g, '');
    const tokens = rawClean.split(/\s+/).filter(Boolean);

    let pool: string[] = [];

    if (language === 'bn') {
      // Find matching bangla clusters
      let matched = false;
      for (const [key, list] of Object.entries(topicBankBN)) {
        if (tokens.some((t) => key.includes(t) || t.includes(key))) {
          pool.push(...list);
          matched = true;
        }
      }
      if (!matched) {
        // Fallback bangla generic pool
        pool = ['বাংলাদেশ', 'বাংলা', 'লাইফস্টাইল', 'ইনস্পিরেশন', 'শেয়ারকরুন', 'পপুলার', 'আজকেরপোস্ট', 'ট্রেন্ডিংটপিক'];
      }
    } else {
      // Find matching english clusters
      let matched = false;
      for (const [key, list] of Object.entries(topicBankEN)) {
        if (tokens.some((t) => key.includes(t) || t.includes(key))) {
          pool.push(...list);
          matched = true;
        }
      }
      if (!matched) {
        // Build customized hashtags from user topic keywords
        pool = [
          ...tokens,
          ...tokens.map((t) => `${t}daily`),
          ...tokens.map((t) => `${t}tips`),
          ...tokens.map((t) => `${t}life`),
          ...tokens.map((t) => `best${t}`),
          'trending',
          'explorepage',
          'instadaily',
          'creator',
          'community',
        ];
      }
    }

    // Add user topic directly as clean hashtag
    if (tokens.length > 0) {
      const topicTag = tokens.join('');
      if (topicTag && !pool.includes(topicTag)) {
        pool.unshift(topicTag);
      }
    }

    // Platform specific modifier tags
    if (platform === 'tiktok') {
      pool.push('fyp', 'foryoupage', 'tiktoktrending');
    } else if (platform === 'linkedin') {
      pool = pool.filter((t) => !['fyp', 'foryoupage', 'instadaily'].includes(t));
      pool.push('networking', 'industryinsights', 'professionalgrowth');
    } else if (platform === 'youtube') {
      pool.push('shorts', 'youtubevideo', 'subscribenow');
    }

    // Deduplicate & take requested count
    const unique = Array.from(new Set(pool)).slice(0, tagCount);
    return unique.map((t) => (t.startsWith('#') ? t : `#${t}`));
  }, [topic, language, platform, tagCount]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const activeTags = selectedTags.length > 0 ? selectedTags : generatedTags;
  const tagString = activeTags.join(' ');
  const tagWithLineBreaks = '.\n.\n.\n' + activeTags.join(' ');

  return (
    <div className="space-y-6">
      {/* Platform & Language Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Target Social Platform
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {(['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`py-2 px-3 text-xs font-medium rounded-lg border transition capitalize ${
                  platform === p
                    ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-[#F6F6F6] dark:hover:bg-[#090909]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[11px] text-neutral-500">
            Recommended: <strong>{platformBestPractices[platform].recommended}</strong> — {platformBestPractices[platform].desc}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Language
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition ${
                language === 'en'
                  ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('bn')}
              className={`py-2 px-3 text-xs font-medium rounded-lg border transition ${
                language === 'bn'
                  ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              বাংলা (Bengali)
            </button>
          </div>
        </div>
      </div>

      {/* Topic input and count slider */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Topic or Keyword (e.g. tech, fitness, travel, food, business)
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setSelectedTags([]);
            }}
            placeholder={language === 'bn' ? 'যেমন: ভ্রমণ, ফ্রিল্যান্সিং, খাবার, প্রযুক্তি...' : 'e.g. web developer, startup founder, gym workout...'}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs text-neutral-500 mb-1">
            <span>Hashtag Count</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{tagCount} tags</span>
          </div>
          <input
            type="range"
            min={5}
            max={30}
            value={tagCount}
            onChange={(e) => setTagCount(parseInt(e.target.value))}
            className="w-full accent-black dark:accent-white"
          />
        </div>
      </div>

      {/* Notice about genuine algorithmic clustering */}
      <div className="flex items-start gap-2 p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400">
        <Info className="w-4 h-4 shrink-0 text-neutral-500 mt-0.5" />
        <div>
          <strong>Algorithmic Niche Generator:</strong> Tags are dynamically organized based on topic taxonomy and platform ranking criteria. No fake live trend claims without authentic platform credentials.
        </div>
      </div>

      {/* Generated Tags Box */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-950">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Generated Tags ({activeTags.length} active)
            {selectedTags.length > 0 && <span className="ml-2 text-neutral-400">(custom selection)</span>}
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-xs text-neutral-500 hover:text-black dark:hover:text-white underline"
            >
              Reset to all
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {generatedTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2.5 py-1.5 rounded border transition cursor-pointer select-none ${
                  selectedTags.length === 0 || isSelected
                    ? 'border-neutral-300 dark:border-neutral-700 bg-[#EDEDED] dark:bg-neutral-800 text-[#000000] dark:text-[#FFFFFF]'
                    : 'border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCopy(tagString)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-[#F6F6F6] dark:hover:bg-[#090909] transition"
        >
          {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
          Copy All ({activeTags.length})
        </button>
        <button
          onClick={() => onCopy(tagWithLineBreaks)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          <Copy className="w-4 h-4" />
          Copy with Dot Spacing
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Social Caption & Post Ideas
// -------------------------------------------------------------
const CaptionGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy }) => {
  const [topic, setTopic] = useState('Productivity tips for remote workers');
  const [tone, setTone] = useState<'hook' | 'educational' | 'story' | 'short'>('hook');

  const templates: Record<string, { title: string; hook: string; body: string; cta: string }> = {
    hook: {
      title: 'High-Engagement Viral Hook',
      hook: `Most people get ${topic} completely wrong. Here is what actually works:`,
      body: `1. Stop overcomplicating the fundamentals.\n2. Consistency beats intensity every single time.\n3. Track simple metrics that move the needle.\n\nOnce you dial this in, you will notice a 10x shift in results.`,
      cta: `What is your biggest obstacle with this right now? Drop a comment below! 👇`,
    },
    educational: {
      title: 'Step-by-Step Educational Breakdown',
      hook: `The ultimate cheat-sheet on ${topic}:`,
      body: `Here are 3 actionable frameworks you can implement today:\n\n▸ Framework 1: Audit where your energy goes\n▸ Framework 2: Automate repetitive workflows\n▸ Framework 3: Protect deep focus blocks\n\nSave this post so you can reference it when planning your week! 📌`,
      cta: `Share this with someone who needs to hear it today!`,
    },
    story: {
      title: 'Personal Story & Lesson',
      hook: `Two years ago, I had zero clue how to navigate ${topic}...`,
      body: `I tried following every popular trend, burnt out, and almost gave up.\n\nThen I realized something crucial: simple routines done repeatedly outperform sophisticated systems that are too hard to maintain.\n\nIf you are in the middle of this journey, keep showing up.`,
      cta: `Have you ever felt like giving up right before a breakthrough? Let's connect.`,
    },
    short: {
      title: 'Punchy Micro-Post / X (Twitter)',
      hook: `Quick reminder about ${topic}:`,
      body: `You don't need another tool.\nYou need less friction and more execution.\n\nStart small today.`,
      cta: `Retweet if you agree! 🔁`,
    },
  };

  const current = templates[tone];
  const fullPost = `${current.hook}\n\n${current.body}\n\n${current.cta}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Post Subject / Main Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Format Style
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
          >
            <option value="hook">Viral Hook & List</option>
            <option value="educational">Educational Framework</option>
            <option value="story">Personal Narrative</option>
            <option value="short">Short Punchy Post</option>
          </select>
        </div>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          Generated Post Template ({current.title})
        </div>
        <pre className="font-sans whitespace-pre-wrap text-sm text-[#000000] dark:text-[#FFFFFF] leading-relaxed">
          {fullPost}
        </pre>
      </div>

      <button
        onClick={() => onCopy(fullPost)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        <Copy className="w-4 h-4" />
        Copy Formatted Post
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Profile Bio Generator
// -------------------------------------------------------------
const BioGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy }) => {
  const [role, setRole] = useState('Full Stack Software Engineer');
  const [niche, setNiche] = useState('React, Node.js & Cloud Architecture');
  const [cta, setCta] = useState('Building modern web apps at Asbily');

  const bios = [
    {
      title: 'Minimal & Punchy (Instagram / Threads)',
      text: `${role} ⚡\nHelping teams scale with ${niche}.\n${cta} 👇\nasbily.com`,
      limit: 150,
    },
    {
      title: 'Professional Headline (LinkedIn)',
      text: `${role} | Specializing in ${niche} | ${cta}`,
      limit: 220,
    },
    {
      title: 'Creator & Founder Bio (X / Twitter)',
      text: `Building the future of web tools. ${role}. Passionate about ${niche}. DMs open for collaborations. ${cta}.`,
      limit: 160,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Your Role / Identity
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Niche / Value Proposition
          </label>
          <input
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Call to Action / Project
          </label>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        {bios.map((b) => {
          const charLen = b.text.length;
          const isOver = charLen > b.limit;
          return (
            <div key={b.title} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {b.title}
                </span>
                <span className={`text-xs font-mono ${isOver ? 'text-[#000000] dark:text-[#FFFFFF] font-bold underline decoration-dashed' : 'text-neutral-400'}`}>
                  {charLen} / {b.limit} chars
                </span>
              </div>
              <pre className="font-sans whitespace-pre-wrap text-sm text-[#000000] dark:text-[#FFFFFF] mb-3">
                {b.text}
              </pre>
              <button
                onClick={() => onCopy(b.text)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded hover:bg-white dark:hover:bg-neutral-800"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Bio
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Social Post Formatter
// -------------------------------------------------------------
const PostFormatterTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [rawText, setRawText] = useState('Line 1 of my post\n\nLine 2 with clean spacing\n\n- Point 1\n- Point 2\n\nCall to action at the end.');

  const formatted = useMemo(() => {
    // Inserts zero-width or clean non-collapsing breaks
    return rawText
      .split('\n')
      .map((line) => (line.trim() === '' ? '⠀' : line)) // Braille blank character prevents Instagram paragraph collapse
      .join('\n');
  }, [rawText]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Draft Post
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Non-Collapsing Formatted Post
          </label>
          <textarea
            value={formatted}
            readOnly
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-sm"
          />
        </div>
      </div>

      <button
        onClick={() => onCopy(formatted)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-[#F6F6F6] dark:hover:bg-[#090909] transition"
      >
        {copied ? <Check className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" /> : <Copy className="w-4 h-4" />}
        Copy Formatted Post
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Social Media Image Dimensions Guide
// -------------------------------------------------------------
const SocialImageGuideTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const dimensions = [
    { platform: 'Instagram', name: 'Square Feed Post', ratio: '1:1', size: '1080 × 1080 px' },
    { platform: 'Instagram', name: 'Portrait Feed Post', ratio: '4:5', size: '1080 × 1350 px' },
    { platform: 'Instagram', name: 'Story / Reel', ratio: '9:16', size: '1080 × 1920 px' },
    { platform: 'YouTube', name: 'Channel Banner', ratio: '16:9', size: '2560 × 1440 px' },
    { platform: 'YouTube', name: 'Video Thumbnail', ratio: '16:9', size: '1280 × 720 px' },
    { platform: 'Facebook', name: 'Shared Post / Link', ratio: '1.91:1', size: '1200 × 630 px' },
    { platform: 'Facebook', name: 'Page Cover Photo', ratio: '16:9', size: '820 × 312 px' },
    { platform: 'LinkedIn', name: 'Personal Profile Banner', ratio: '4:1', size: '1584 × 396 px' },
    { platform: 'LinkedIn', name: 'Post Image', ratio: '1.91:1', size: '1200 × 627 px' },
    { platform: 'X / Twitter', name: 'Header Banner', ratio: '3:1', size: '1500 × 500 px' },
    { platform: 'TikTok', name: 'Video / Story Canvas', ratio: '9:16', size: '1080 × 1920 px' },
  ];

  const downloadBlankTemplate = (w: number, h: number, name: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${name} (${w}×${h}px)`, w / 2, h / 2);
      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#525252';
      ctx.fillText('Asbily Tools Canvas Template', w / 2, h / 2 + 50);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-template.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-xs text-neutral-500">
        Latest standard dimensions for optimal rendering without compression blur or unwanted edge cropping.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dimensions.map((item, idx) => {
          const [width, height] = item.size.replace(' px', '').split(' × ').map(Number);
          return (
            <div
              key={idx}
              className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-[#F6F6F6] dark:bg-[#090909] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  <span>{item.platform}</span>
                  <span className="font-mono">{item.ratio}</span>
                </div>
                <div className="font-medium text-[#000000] dark:text-[#FFFFFF] text-sm mb-2">
                  {item.name}
                </div>
                <div className="text-xl font-bold font-mono text-[#000000] dark:text-[#FFFFFF] mb-4">
                  {item.size}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => onCopy(item.size)}
                  className="flex-1 text-xs py-1.5 px-2 border border-neutral-200 dark:border-neutral-800 rounded hover:bg-white dark:hover:bg-neutral-800 flex items-center justify-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Size
                </button>
                <button
                  onClick={() => downloadBlankTemplate(width, height, `${item.platform} ${item.name}`)}
                  className="text-xs py-1.5 px-2 border border-neutral-200 dark:border-neutral-800 rounded hover:bg-white dark:hover:bg-neutral-800 flex items-center justify-center gap-1"
                  title="Download blank PNG canvas template"
                >
                  <Download className="w-3.5 h-3.5" />
                  PNG Template
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
