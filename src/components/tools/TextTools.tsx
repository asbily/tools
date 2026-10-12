import React, { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, Download, ArrowRight, Sparkles } from 'lucide-react';

interface TextToolProps {
  toolId: string;
}

export const TextTools: React.FC<TextToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 1. Word & Character Counter
  if (toolId === 'word-counter') {
    return <WordCounterTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  }

  // 2. Case Converter
  if (toolId === 'case-converter') {
    return <CaseConverterTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  }

  // 3. Text Cleaner & Formatter
  if (toolId === 'text-cleaner') {
    return <TextCleanerTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  }

  // 4. Duplicate Line Remover & Sorter
  if (toolId === 'duplicate-remover') {
    return <DuplicateRemoverTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  }

  // 5. Text Diff
  if (toolId === 'text-diff') {
    return <TextDiffTool onCopy={copyText} />;
  }

  // 6. Lorem Ipsum Generator
  if (toolId === 'lorem-ipsum') {
    return <LoremIpsumTool onCopy={copyText} copied={copied} />;
  }

  // 7. Fancy Text Generator
  if (toolId === 'fancy-text') {
    return <FancyTextTool onCopy={copyText} copied={copied} />;
  }

  // 8. Bangla Unicode Cleaner
  if (toolId === 'bangla-unicode-cleaner') {
    return <BanglaUnicodeCleanerTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  }

  return <div className="text-neutral-500">Tool component not found.</div>;
};

// -------------------------------------------------------------
// Component: Word Counter
// -------------------------------------------------------------
const WordCounterTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const raw = text;
    const trimmed = raw.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const characters = raw.length;
    const charactersNoSpaces = raw.replace(/\s/g, '').length;
    const lines = raw ? raw.split(/\r\n|\r|\n/).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    const readingTimeMin = (words / 200).toFixed(1);
    const speakingTimeMin = (words / 130).toFixed(1);

    return {
      words,
      characters,
      charactersNoSpaces,
      lines,
      sentences,
      paragraphs,
      readingTimeMin,
      speakingTimeMin,
    };
  }, [text]);

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 uppercase tracking-wider">Words</div>
          <div className="text-2xl font-bold text-[#111111] dark:text-neutral-100 mt-1">{stats.words}</div>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 uppercase tracking-wider">Characters</div>
          <div className="text-2xl font-bold text-[#111111] dark:text-neutral-100 mt-1">{stats.characters}</div>
          <div className="text-xs text-neutral-400 mt-0.5">{stats.charactersNoSpaces} without spaces</div>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 uppercase tracking-wider">Sentences</div>
          <div className="text-2xl font-bold text-[#111111] dark:text-neutral-100 mt-1">{stats.sentences}</div>
          <div className="text-xs text-neutral-400 mt-0.5">{stats.lines} lines · {stats.paragraphs} paras</div>
        </div>
        <div className="border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-900">
          <div className="text-xs text-neutral-500 uppercase tracking-wider">Reading Time</div>
          <div className="text-2xl font-bold text-[#111111] dark:text-neutral-100 mt-1">~{stats.readingTimeMin} m</div>
          <div className="text-xs text-neutral-400 mt-0.5">~{stats.speakingTimeMin} m speaking</div>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here to analyze..."
          rows={10}
          className="w-full p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-[#111111] dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-y"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => onCopy(text)}
          disabled={!text}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy Text'}
        </button>
        <button
          onClick={() => onDownload(text, 'word-count-analysis.txt')}
          disabled={!text}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          Download .txt
        </button>
        <button
          onClick={() => setText('')}
          disabled={!text}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition disabled:opacity-40"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Case Converter
// -------------------------------------------------------------
const CaseConverterTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [input, setInput] = useState('');

  const toTitleCase = (str: string) =>
    str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase()
      )
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toSnakeCase = (str: string) =>
    str
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '')
      .toLowerCase();

  const toKebabCase = (str: string) =>
    str
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .toLowerCase();

  const toConstantCase = (str: string) =>
    str
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\w_]/g, '')
      .toUpperCase();

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toAlternatingCase = (str: string) =>
    str
      .split('')
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join('');

  const conversions = [
    { label: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { label: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { label: 'Title Case', fn: toTitleCase },
    { label: 'Sentence case', fn: toSentenceCase },
    { label: 'camelCase', fn: toCamelCase },
    { label: 'snake_case', fn: toSnakeCase },
    { label: 'kebab-case', fn: toKebabCase },
    { label: 'CONSTANT_CASE', fn: toConstantCase },
    { label: 'aLtErNaTiNg cAsE', fn: toAlternatingCase },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-neutral-700 dark:text-neutral-300">
          Source Text
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste or write text to convert into multiple cases..."
          rows={5}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-[#111111] dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setInput('The quick brown fox jumps over the lazy dog')}
          className="text-xs px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 rounded text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        >
          Load Example
        </button>
        <button
          onClick={() => setInput('')}
          className="text-xs px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conversions.map((conv) => {
          const transformed = input ? conv.fn(input) : '';
          return (
            <div
              key={conv.label}
              className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {conv.label}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onCopy(transformed)}
                    disabled={!transformed}
                    className="p-1 text-neutral-500 hover:text-black dark:hover:text-white transition disabled:opacity-30"
                    title="Copy"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="font-mono text-sm text-[#111111] dark:text-neutral-100 break-words line-clamp-3 min-h-[3rem]">
                {transformed || <span className="text-neutral-400 italic font-sans text-xs">Output preview...</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Text Cleaner
// -------------------------------------------------------------
const TextCleanerTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [text, setText] = useState('');
  const [cleanOptions, setCleanOptions] = useState({
    removeExtraSpaces: true,
    removeBlankLines: true,
    trimLines: true,
    stripHtml: false,
    removeTabs: true,
    removeNumbers: false,
  });

  const cleanedText = useMemo(() => {
    let result = text;
    if (cleanOptions.stripHtml) {
      result = result.replace(/<[^>]*>/g, '');
    }
    if (cleanOptions.removeTabs) {
      result = result.replace(/\t/g, ' ');
    }
    if (cleanOptions.removeExtraSpaces) {
      result = result.replace(/[ ]{2,}/g, ' ');
    }
    if (cleanOptions.trimLines) {
      result = result
        .split('\n')
        .map((l) => l.trim())
        .join('\n');
    }
    if (cleanOptions.removeBlankLines) {
      result = result
        .split('\n')
        .filter((l) => l.trim().length > 0)
        .join('\n');
    }
    if (cleanOptions.removeNumbers) {
      result = result.replace(/[0-9]/g, '');
    }
    return result;
  }, [text, cleanOptions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        {Object.entries(cleanOptions).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={val}
              onChange={(e) =>
                setCleanOptions((prev) => ({ ...prev, [key]: e.target.checked }))
              }
              className="accent-black dark:accent-white rounded"
            />
            {key === 'removeExtraSpaces' && 'Remove Extra Spaces'}
            {key === 'removeBlankLines' && 'Remove Blank Lines'}
            {key === 'trimLines' && 'Trim Each Line'}
            {key === 'stripHtml' && 'Strip HTML Tags'}
            {key === 'removeTabs' && 'Convert Tabs to Spaces'}
            {key === 'removeNumbers' && 'Remove Numbers'}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Original Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text with messy spaces, HTML tags, or empty lines..."
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-[#111111] dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Cleaned Result
          </label>
          <textarea
            value={cleanedText}
            readOnly
            placeholder="Cleaned output will appear here..."
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-[#111111] dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none font-mono text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => onCopy(cleanedText)}
          disabled={!cleanedText}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy Cleaned'}
        </button>
        <button
          onClick={() => onDownload(cleanedText, 'cleaned-text.txt')}
          disabled={!cleanedText}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          Download .txt
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Duplicate Line Remover & Sorter
// -------------------------------------------------------------
const DuplicateRemoverTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [input, setInput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc' | 'reverse'>('none');

  const { output, originalCount, cleanCount, removedCount } = useMemo(() => {
    if (!input) {
      return { output: '', originalCount: 0, cleanCount: 0, removedCount: 0 };
    }
    const lines = input.split(/\r\n|\r|\n/);
    const originalCount = lines.length;

    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLines.push(line);
      }
    }

    if (sortOrder === 'asc') {
      uniqueLines.sort((a, b) => a.localeCompare(b));
    } else if (sortOrder === 'desc') {
      uniqueLines.sort((a, b) => b.localeCompare(a));
    } else if (sortOrder === 'reverse') {
      uniqueLines.reverse();
    }

    return {
      output: uniqueLines.join('\n'),
      originalCount,
      cleanCount: uniqueLines.length,
      removedCount: originalCount - uniqueLines.length,
    };
  }, [input, caseSensitive, sortOrder]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="flex items-center gap-4 text-xs">
          <div>Original: <strong>{originalCount}</strong> lines</div>
          <div>Unique: <strong>{cleanCount}</strong> lines</div>
          <div className="text-emerald-600 dark:text-emerald-400">
            Removed: <strong>{removedCount}</strong> duplicates
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="accent-black dark:accent-white"
            />
            Case Sensitive
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs p-1.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
          >
            <option value="none">No Sorting</option>
            <option value="asc">Sort A → Z</option>
            <option value="desc">Sort Z → A</option>
            <option value="reverse">Reverse Order</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Input List (One item per line)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Apple\nBanana\nApple\nOrange\nBanana"
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-[#111111] dark:text-neutral-100 font-mono text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Deduplicated & Sorted List
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="Unique lines will appear here..."
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-[#111111] dark:text-neutral-100 font-mono text-sm placeholder:text-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(output)}
          disabled={!output}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          Copy Unique Lines
        </button>
        <button
          onClick={() => onDownload(output, 'unique-lines.txt')}
          disabled={!output}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          Download .txt
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Text Diff
// -------------------------------------------------------------
const TextDiffTool: React.FC<{ onCopy: (t: string) => void }> = () => {
  const [textA, setTextA] = useState('Line 1: Hello World\nLine 2: Asbily Free Tools\nLine 3: Fast & Minimal\nLine 4: Client Side');
  const [textB, setTextB] = useState('Line 1: Hello World\nLine 2: Asbily Free Tools v2.0\nLine 3: Fast & Minimal\nLine 4: 100% Client Side Private\nLine 5: New Feature Added');

  const diffResult = useMemo(() => {
    const linesA = textA.split(/\r\n|\r|\n/);
    const linesB = textB.split(/\r\n|\r|\n/);

    const maxLen = Math.max(linesA.length, linesB.length);
    const rows = [];

    for (let i = 0; i < maxLen; i++) {
      const a = linesA[i];
      const b = linesB[i];

      let type: 'same' | 'modified' | 'added' | 'removed' = 'same';
      if (a === undefined && b !== undefined) type = 'added';
      else if (a !== undefined && b === undefined) type = 'removed';
      else if (a !== b) type = 'modified';

      rows.push({ lineNum: i + 1, a: a || '', b: b || '', type });
    }
    return rows;
  }, [textA, textB]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Original Text (A)
          </label>
          <textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            rows={6}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Changed Text (B)
          </label>
          <textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            rows={6}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-sm"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Line-by-Line Comparison
          </span>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Added / Modified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Removed
            </span>
          </div>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-x-auto text-xs font-mono">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <th className="p-2 text-left w-12 text-neutral-400">#</th>
                <th className="p-2 text-left w-1/2 border-r border-neutral-200 dark:border-neutral-800">
                  Original
                </th>
                <th className="p-2 text-left w-1/2">Changed</th>
              </tr>
            </thead>
            <tbody>
              {diffResult.map((row) => {
                const isDiff = row.type !== 'same';
                return (
                  <tr
                    key={row.lineNum}
                    className={`border-b border-neutral-100 dark:border-neutral-900 ${
                      row.type === 'modified'
                        ? 'bg-amber-50/60 dark:bg-amber-950/20'
                        : row.type === 'added'
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20'
                        : row.type === 'removed'
                        ? 'bg-red-50/60 dark:bg-red-950/20'
                        : ''
                    }`}
                  >
                    <td className="p-2 text-neutral-400 select-none">{row.lineNum}</td>
                    <td className="p-2 border-r border-neutral-200 dark:border-neutral-800 break-all">
                      {row.a}
                    </td>
                    <td className="p-2 break-all">{row.b}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Lorem Ipsum Generator
// -------------------------------------------------------------
const LoremIpsumTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({
  onCopy,
  copied,
}) => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);

  const LOREM_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
    'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui',
    'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generated = useMemo(() => {
    const makeSentence = () => {
      const len = Math.floor(Math.random() * 8) + 8;
      const words = [];
      for (let i = 0; i < len; i++) {
        const w = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
        words.push(w);
      }
      const s = words.join(' ');
      return s.charAt(0).toUpperCase() + s.slice(1) + '.';
    };

    const makeParagraph = () => {
      const sentenceCount = Math.floor(Math.random() * 4) + 4;
      const sentences = [];
      for (let i = 0; i < sentenceCount; i++) {
        sentences.push(makeSentence());
      }
      return sentences.join(' ');
    };

    if (type === 'words') {
      const res = [];
      for (let i = 0; i < count; i++) {
        res.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      return res.join(' ');
    }

    if (type === 'sentences') {
      const res = [];
      for (let i = 0; i < count; i++) {
        res.push(makeSentence());
      }
      return res.join(' ');
    }

    // paragraphs
    const paras = [];
    for (let i = 0; i < count; i++) {
      paras.push(makeParagraph());
    }
    let full = paras.join('\n\n');
    if (startWithLorem && !full.startsWith('Lorem ipsum dolor sit amet')) {
      full = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + full;
    }
    return full;
  }, [count, type, startWithLorem]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Quantity:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 p-1.5 border border-neutral-200 dark:border-neutral-800 rounded text-sm bg-white dark:bg-neutral-950 text-center"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Unit:</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="p-1.5 border border-neutral-200 dark:border-neutral-800 rounded text-sm bg-white dark:bg-neutral-950"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="accent-black dark:accent-white"
          />
          Start with "Lorem ipsum..."
        </label>
      </div>

      <textarea
        value={generated}
        readOnly
        rows={10}
        className="w-full p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed"
      />

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(generated)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          Copy Dummy Text
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Fancy Unicode Text
// -------------------------------------------------------------
const FancyTextTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy }) => {
  const [text, setText] = useState('Asbily Free Tools');

  const charMaps: Record<string, [string, string]> = {
    bold: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵'],
    italic: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻'],
    monospace: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿'],
    doubleStruck: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', '𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡'],
    bubble: ['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨'],
  };

  const transform = (input: string, style: keyof typeof charMaps) => {
    const [from, to] = charMaps[style];
    const toArr = Array.from(to);
    return input
      .split('')
      .map((ch) => {
        const idx = from.indexOf(ch);
        return idx !== -1 && toArr[idx] ? toArr[idx] : ch;
      })
      .join('');
  };

  const styles = [
    { label: 'Sans-Serif Bold', fn: (s: string) => transform(s, 'bold') },
    { label: 'Sans-Serif Italic', fn: (s: string) => transform(s, 'italic') },
    { label: 'Monospace Code', fn: (s: string) => transform(s, 'monospace') },
    { label: 'Double Struck (Blackboard)', fn: (s: string) => transform(s, 'doubleStruck') },
    { label: 'Circled / Bubble', fn: (s: string) => transform(s, 'bubble') },
    { label: 'Strikethrough', fn: (s: string) => s.split('').join('\u0336') + '\u0336' },
    { label: 'Underline', fn: (s: string) => s.split('').join('\u0332') + '\u0332' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1.5">Input Text</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something to see fancy fonts..."
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {styles.map((st) => {
          const styled = text ? st.fn(text) : '';
          return (
            <div
              key={st.label}
              className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3.5 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between gap-3"
            >
              <div className="overflow-hidden">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  {st.label}
                </div>
                <div className="text-base text-[#111111] dark:text-neutral-100 truncate">
                  {styled || <span className="text-neutral-400 text-xs">Preview...</span>}
                </div>
              </div>
              <button
                onClick={() => onCopy(styled)}
                disabled={!styled}
                className="shrink-0 p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-white dark:hover:bg-neutral-800 transition disabled:opacity-40"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Bangla Unicode Cleaner & Normalizer
// -------------------------------------------------------------
const BanglaUnicodeCleanerTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [input, setInput] = useState('');
  const [removeZwnj, setRemoveZwnj] = useState(true);
  const [removeZwj, setRemoveZwj] = useState(true);
  const [fixDariSpaces, setFixDariSpaces] = useState(true);
  const [normalizeDigits, setNormalizeDigits] = useState(false);

  const cleaned = useMemo(() => {
    let res = input;

    // Remove Zero-Width Non-Joiner (U+200C)
    if (removeZwnj) {
      res = res.replace(/\u200C/g, '');
    }

    // Remove Zero-Width Joiner (U+200D) where safe
    if (removeZwj) {
      // Keep ZWJ if part of Khanda Ta (ৎ: \u09CE or \u09a4\u09cd\u200d) or Ya-phala (\u09cd\u200d\u09af)
      // Otherwise strip orphan ZWJs
      res = res.replace(/([^\u09cd])\u200d/g, '$1');
    }

    // Fix space before Bengali Dari (।)
    if (fixDariSpaces) {
      res = res.replace(/\s+([।!?])/g, '$1');
    }

    // Bengali to English digits or vice-versa
    if (normalizeDigits) {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      bnDigits.forEach((bn, idx) => {
        res = res.replaceAll(bn, String(idx));
      });
    }

    // Remove multiple consecutive spaces
    res = res.replace(/[ ]{2,}/g, ' ');

    return res;
  }, [input, removeZwnj, removeZwj, fixDariSpaces, normalizeDigits]);

  return (
    <div className="space-y-6">
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 space-y-2">
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          Bangla Normalization Options
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeZwnj}
              onChange={(e) => setRemoveZwnj(e.target.checked)}
              className="accent-black dark:accent-white"
            />
            Remove Zero-Width Non-Joiner (ZWNJ / \u200C)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeZwj}
              onChange={(e) => setRemoveZwj(e.target.checked)}
              className="accent-black dark:accent-white"
            />
            Sanitize orphan Zero-Width Joiner (ZWJ / \u200D)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={fixDariSpaces}
              onChange={(e) => setFixDariSpaces(e.target.checked)}
              className="accent-black dark:accent-white"
            />
            Fix Spacing before Dari (দাঁড়ির আগের ফাঁকা দূর করুন)
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={normalizeDigits}
              onChange={(e) => setNormalizeDigits(e.target.checked)}
              className="accent-black dark:accent-white"
            />
            Convert Bangla numerals (০-৯) to Standard (0-9)
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Original Bangla Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="এখানে বাংলা টেক্সট পেস্ট করুন (যেমন: অভ্র বা ইউনিকোডের ভাঙ্গা লেখা)..."
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-[#111111] dark:text-neutral-100 text-sm placeholder:text-neutral-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Normalized & Cleaned Bangla
          </label>
          <textarea
            value={cleaned}
            readOnly
            placeholder="পরিষ্কার টেক্সট এখানে প্রদর্শিত হবে..."
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-[#111111] dark:text-neutral-100 text-sm placeholder:text-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(cleaned)}
          disabled={!cleaned}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          Copy Cleaned Bangla
        </button>
        <button
          onClick={() => onDownload(cleaned, 'bangla-cleaned.txt')}
          disabled={!cleaned}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          Download .txt
        </button>
      </div>
    </div>
  );
};
