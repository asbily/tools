import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, Download, Play, RefreshCw, FileText, Code2, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { ZipArchiveTool } from './ZipArchiveTool';

interface DeveloperToolProps {
  toolId: string;
}

export const DeveloperTools: React.FC<DeveloperToolProps> = ({ toolId }) => {
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

  if (toolId === 'json-formatter') return <JsonFormatterTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  if (toolId === 'base64-tool') return <Base64Tool onCopy={copyText} copied={copied} />;
  if (toolId === 'url-encoder') return <UrlEncoderTool onCopy={copyText} copied={copied} />;
  if (toolId === 'html-entities') return <HtmlEntitiesTool onCopy={copyText} copied={copied} />;
  if (toolId === 'csv-json') return <CsvJsonTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  if (toolId === 'xml-yaml') return <XmlYamlTool onCopy={copyText} copied={copied} />;
  if (toolId === 'sql-formatter') return <SqlFormatterTool onCopy={copyText} copied={copied} />;
  if (toolId === 'regex-tester') return <RegexTesterTool onCopy={copyText} />;
  if (toolId === 'jwt-decoder') return <JwtDecoderTool onCopy={copyText} />;
  if (toolId === 'uuid-generator') return <UuidGeneratorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'hash-generator') return <HashGeneratorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'timestamp-converter') return <TimestampConverterTool onCopy={copyText} />;
  if (toolId === 'cron-explainer') return <CronExplainerTool onCopy={copyText} copied={copied} />;
  if (toolId === 'number-base') return <NumberBaseTool onCopy={copyText} />;
  if (toolId === 'curl-builder') return <CurlBuilderTool onCopy={copyText} copied={copied} />;
  if (toolId === 'markdown-editor') return <MarkdownEditorTool onCopy={copyText} onDownload={downloadFile} copied={copied} />;
  if (toolId === 'css-generators') return <CssGeneratorsTool onCopy={copyText} copied={copied} />;
  if (toolId === 'zip-archive-manager') return <ZipArchiveTool />;

  return <div className="text-neutral-500">Developer tool not found.</div>;
};

// -------------------------------------------------------------
// Component: JSON Formatter & Validator
// -------------------------------------------------------------
const JsonFormatterTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string, t?: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [input, setInput] = useState('{"name":"Asbily Free Tools","platform":"web","active":true,"features":["json","hash","converters"]}');
  const [indent, setIndent] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);

  const formatted = useMemo(() => {
    if (!input.trim()) {
      setError(null);
      return '';
    }
    try {
      const parsed = JSON.parse(input);
      setError(null);
      return JSON.stringify(parsed, null, indent);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
      return '';
    }
  }, [input, indent]);

  const minified = useMemo(() => {
    if (!input.trim()) return '';
    try {
      const parsed = JSON.parse(input);
      return JSON.stringify(parsed);
    } catch {
      return '';
    }
  }, [input]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Indentation:</label>
          <select
            value={indent}
            onChange={(e) => setIndent(parseInt(e.target.value))}
            className="text-xs p-1.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInput('{"user":{"id":101,"name":"Sarah Connor"},"roles":["admin","editor"],"status":"active"}')}
            className="text-xs px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400"
          >
            Sample JSON
          </button>
          <button
            onClick={() => setInput('')}
            className="text-xs px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 rounded-lg text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span><strong>JSON Syntax Error:</strong> {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Input JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={14}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Beautified Result
          </label>
          <textarea
            value={formatted}
            readOnly
            rows={14}
            placeholder="Formatted JSON will appear here..."
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onCopy(formatted)}
          disabled={!formatted}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          Copy Beautified
        </button>
        <button
          onClick={() => onCopy(minified)}
          disabled={!minified}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          <Copy className="w-4 h-4" />
          Copy Minified
        </button>
        <button
          onClick={() => onDownload(formatted, 'formatted.json', 'application/json')}
          disabled={!formatted}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          Download .json
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Base64 Encoder / Decoder
// -------------------------------------------------------------
const Base64Tool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('Welcome to Asbily Free Tools');
  const [error, setError] = useState<string | null>(null);

  const output = useMemo(() => {
    if (!input) {
      setError(null);
      return '';
    }
    try {
      if (mode === 'encode') {
        setError(null);
        // UTF-8 safe encode
        return btoa(unescape(encodeURIComponent(input)));
      } else {
        setError(null);
        return decodeURIComponent(escape(atob(input)));
      }
    } catch (err: any) {
      setError(err.message || 'Error processing Base64');
      return '';
    }
  }, [input, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
            mode === 'encode'
              ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          Text → Base64 Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
            mode === 'decode'
              ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          Base64 → Text Decode
        </button>
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 rounded-lg text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            {mode === 'encode' ? 'Raw Text' : 'Base64 Input'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
          </label>
          <textarea
            value={output}
            readOnly
            rows={8}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs"
          />
        </div>
      </div>

      <button
        onClick={() => onCopy(output)}
        disabled={!output}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        Copy Result
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: URL Encoder / Decoder
// -------------------------------------------------------------
const UrlEncoderTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [urlInput, setUrlInput] = useState('https://asbily.com/tools?query=free tools&category=web dev&lang=en');

  const { encoded, decoded, params } = useMemo(() => {
    try {
      const enc = encodeURI(urlInput);
      const dec = decodeURIComponent(urlInput);

      let parsedParams: [string, string][] = [];
      try {
        const u = new URL(urlInput);
        u.searchParams.forEach((val, key) => {
          parsedParams.push([key, val]);
        });
      } catch {
        // Not a full URL with scheme
      }

      return { encoded: enc, decoded: dec, params: parsedParams };
    } catch {
      return { encoded: '', decoded: '', params: [] };
    }
  }, [urlInput]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Enter URL or Query String
        </label>
        <textarea
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          rows={4}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Encoded URL</span>
            <button onClick={() => onCopy(encoded)} className="text-xs text-neutral-500 hover:text-black dark:hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-mono text-xs break-all text-neutral-800 dark:text-neutral-200">{encoded}</div>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Decoded URL</span>
            <button onClick={() => onCopy(decoded)} className="text-xs text-neutral-500 hover:text-black dark:hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-mono text-xs break-all text-neutral-800 dark:text-neutral-200">{decoded}</div>
        </div>
      </div>

      {params.length > 0 && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 text-xs font-semibold text-neutral-500 uppercase">
            Detected Query Parameters ({params.length})
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {params.map(([k, v], i) => (
              <div key={i} className="flex px-4 py-2 text-xs font-mono">
                <span className="w-1/3 font-semibold text-neutral-700 dark:text-neutral-300">{k}</span>
                <span className="w-2/3 text-neutral-600 dark:text-neutral-400 break-all">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: HTML Entities
// -------------------------------------------------------------
const HtmlEntitiesTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [input, setInput] = useState('<div class="tool">&copy; 2026 Asbily Platforms™</div>');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const result = useMemo(() => {
    if (mode === 'encode') {
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/©/g, '&copy;')
        .replace(/™/g, '&trade;');
    } else {
      const doc = new DOMParser().parseFromString(input, 'text/html');
      return doc.body.textContent || '';
    }
  }, [input, mode]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('encode')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
            mode === 'encode'
              ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          Characters → Entities Encode
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
            mode === 'decode'
              ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          Entities → Characters Decode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Output
          </label>
          <textarea
            value={result}
            readOnly
            rows={8}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs"
          />
        </div>
      </div>

      <button
        onClick={() => onCopy(result)}
        disabled={!result}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        Copy Entities
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: CSV to JSON & JSON to CSV
// -------------------------------------------------------------
const CsvJsonTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string, t?: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [direction, setDirection] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [csvText, setCsvText] = useState("id,name,role,department\n1,Alex Rivera,Tech Lead,Engineering\n2,Sofia Chen,Designer,Product\n3,Liam Vance,Writer,Marketing");
  const [jsonText, setJsonText] = useState('[\n  {"id":"1","name":"Alex Rivera","role":"Tech Lead","department":"Engineering"},\n  {"id":"2","name":"Sofia Chen","role":"Designer","department":"Product"}\n]');

  const convertedJson = useMemo(() => {
    if (direction !== 'csv-to-json') return '';
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) return '[]';
      const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
      const rows = lines.slice(1).map((line) => {
        const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] !== undefined ? values[i] : '';
        });
        return obj;
      });
      return JSON.stringify(rows, null, 2);
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }, [csvText, direction]);

  const convertedCsv = useMemo(() => {
    if (direction !== 'json-to-csv') return '';
    try {
      const arr = JSON.parse(jsonText);
      if (!Array.isArray(arr) || arr.length === 0) return '';
      const headers = Object.keys(arr[0]);
      const csvRows = [headers.join(',')];
      for (const item of arr) {
        const row = headers.map((h) => {
          const val = String(item[h] ?? '');
          return val.includes(',') ? `"${val}"` : val;
        });
        csvRows.push(row.join(','));
      }
      return csvRows.join('\n');
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
  }, [jsonText, direction]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setDirection('csv-to-json')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
            direction === 'csv-to-json'
              ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          CSV → JSON
        </button>
        <button
          onClick={() => setDirection('json-to-csv')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
            direction === 'json-to-csv'
              ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          JSON → CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            {direction === 'csv-to-json' ? 'Input CSV Text' : 'Input JSON Array'}
          </label>
          <textarea
            value={direction === 'csv-to-json' ? csvText : jsonText}
            onChange={(e) =>
              direction === 'csv-to-json' ? setCsvText(e.target.value) : setJsonText(e.target.value)
            }
            rows={12}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            {direction === 'csv-to-json' ? 'Converted JSON' : 'Converted CSV'}
          </label>
          <textarea
            value={direction === 'csv-to-json' ? convertedJson : convertedCsv}
            readOnly
            rows={12}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(direction === 'csv-to-json' ? convertedJson : convertedCsv)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          Copy Converted
        </button>
        <button
          onClick={() => {
            if (direction === 'csv-to-json') {
              onDownload(convertedJson, 'data.json', 'application/json');
            } else {
              onDownload(convertedCsv, 'data.csv', 'text/csv');
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          <Download className="w-4 h-4" />
          Download {direction === 'csv-to-json' ? '.json' : '.csv'}
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: XML / YAML / JSON Converter
// -------------------------------------------------------------
const XmlYamlTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy }) => {
  const [jsonInput, setJsonInput] = useState('{\n  "service": "Asbily Tools",\n  "version": 1.0,\n  "offline": true\n}');

  const xmlOutput = useMemo(() => {
    try {
      const obj = JSON.parse(jsonInput);
      const toXml = (o: any, root = 'root'): string => {
        let xml = `<${root}>\n`;
        for (const [k, v] of Object.entries(o)) {
          if (typeof v === 'object' && v !== null) {
            xml += `  ${toXml(v, k)}\n`;
          } else {
            xml += `  <${k}>${v}</${k}>\n`;
          }
        }
        xml += `</${root}>`;
        return xml;
      };
      return toXml(obj);
    } catch {
      return '<!-- Invalid JSON Input -->';
    }
  }, [jsonInput]);

  const yamlOutput = useMemo(() => {
    try {
      const obj = JSON.parse(jsonInput);
      const toYaml = (o: any, indent = 0): string => {
        let res = '';
        const spaces = ' '.repeat(indent);
        for (const [k, v] of Object.entries(o)) {
          if (typeof v === 'object' && v !== null) {
            res += `${spaces}${k}:\n${toYaml(v, indent + 2)}`;
          } else {
            res += `${spaces}${k}: ${v}\n`;
          }
        }
        return res;
      };
      return toYaml(obj);
    } catch {
      return '# Invalid JSON Input';
    }
  }, [jsonInput]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Source JSON
        </label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={6}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Generated XML</span>
            <button onClick={() => onCopy(xmlOutput)} className="text-xs text-neutral-500 hover:text-black dark:hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={xmlOutput}
            readOnly
            rows={8}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Generated YAML</span>
            <button onClick={() => onCopy(yamlOutput)} className="text-xs text-neutral-500 hover:text-black dark:hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={yamlOutput}
            readOnly
            rows={8}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: SQL Formatter & Beautifier
// -------------------------------------------------------------
const SqlFormatterTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [sql, setSql] = useState("select u.id, u.name, o.total from users u left join orders o on u.id = o.user_id where o.total > 100 and u.status = 'active' group by u.id order by o.total desc limit 10;");

  const formattedSql = useMemo(() => {
    if (!sql.trim()) return '';
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'JOIN',
      'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'UNION ALL',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'AND', 'OR', 'AS', 'IN', 'DISTINCT'
    ];

    let formatted = sql;
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, kw);
    });

    // Break lines before main clauses
    const breakClauses = ['FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'LEFT JOIN', 'INNER JOIN', 'JOIN', 'SET', 'VALUES'];
    breakClauses.forEach((cl) => {
      formatted = formatted.replace(new RegExp(`\\s+(${cl})\\b`, 'g'), '\n$1');
    });

    return formatted;
  }, [sql]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Raw SQL Query
          </label>
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Clean Formatted SQL
          </label>
          <textarea
            value={formattedSql}
            readOnly
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs"
          />
        </div>
      </div>

      <button
        onClick={() => onCopy(formattedSql)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        Copy Formatted SQL
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Regex Tester
// -------------------------------------------------------------
const RegexTesterTool: React.FC<{ onCopy: (t: string) => void }> = () => {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Send feedback to support@asbily.com or contact admin@example.org for inquiries.');

  const { matches, error } = useMemo(() => {
    try {
      const reg = new RegExp(pattern, flags);
      const m = Array.from(testString.matchAll(reg));
      return { matches: m, error: null };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  }, [pattern, flags, testString]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Regular Expression
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            Flags (g, i, m, s)
          </label>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900 rounded-lg text-xs">
          <strong>Regex Error:</strong> {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Test String
        </label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={6}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
        />
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900">
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Match Results: <strong>{matches.length}</strong> match{matches.length === 1 ? '' : 'es'} found
        </div>
        <div className="space-y-2">
          {matches.map((m, idx) => (
            <div key={idx} className="p-2 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 font-mono text-xs flex justify-between">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{m[0]}</span>
              <span className="text-neutral-400">index: {m.index}</span>
            </div>
          ))}
          {matches.length === 0 && !error && (
            <div className="text-xs text-neutral-400 italic">No matches for this pattern.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: JWT Decoder
// -------------------------------------------------------------
const JwtDecoderTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFzYmlseSBVc2VyIiwiYWRtaW4iOnRydWUsImlhdCI6MTc3MjgzNDY1NiwiZXhwIjoxNzg0OTI4MDAwfQ.signature-placeholder');

  const { header, payload, error } = useMemo(() => {
    if (!token.trim()) return { header: null, payload: null, error: null };
    try {
      const parts = token.trim().split('.');
      if (parts.length < 2) {
        return { header: null, payload: null, error: 'JWT must contain at least 2 parts separated by dots' };
      }
      const decodePart = (str: string) => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(json);
      };
      return {
        header: decodePart(parts[0]),
        payload: decodePart(parts[1]),
        error: null,
      };
    } catch (e: any) {
      return { header: null, payload: null, error: 'Could not decode JWT payload' };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Paste JWT Token (Encoded)
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          placeholder="eyJhbGciOi..."
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
        />
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900 rounded-lg text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Header</span>
            {header && (
              <button onClick={() => onCopy(JSON.stringify(header, null, 2))} className="text-xs text-neutral-500 hover:text-black dark:hover:text-white">
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <pre className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs min-h-[140px] overflow-auto">
            {header ? JSON.stringify(header, null, 2) : 'No header'}
          </pre>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Payload Claims</span>
            {payload && (
              <button onClick={() => onCopy(JSON.stringify(payload, null, 2))} className="text-xs text-neutral-500 hover:text-black dark:hover:text-white">
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <pre className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs min-h-[140px] overflow-auto">
            {payload ? JSON.stringify(payload, null, 2) : 'No payload'}
          </pre>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: UUID & GUID Generator
// -------------------------------------------------------------
const UuidGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id: string = crypto.randomUUID();
      if (noHyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  };

  useEffect(() => {
    generate();
  }, [count, uppercase, noHyphens]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Quantity:</label>
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16 p-1.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-xs text-center"
          />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-black dark:accent-white"
            />
            UPPERCASE
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={noHyphens}
              onChange={(e) => setNoHyphens(e.target.checked)}
              className="accent-black dark:accent-white"
            />
            Remove Hyphens
          </label>
          <button
            onClick={generate}
            className="px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </button>
        </div>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-800 font-mono text-xs">
        {uuids.map((id, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-neutral-950">
            <span className="text-[#111111] dark:text-neutral-100">{id}</span>
            <button
              onClick={() => onCopy(id)}
              className="text-neutral-400 hover:text-black dark:hover:text-white transition"
              title="Copy"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => onCopy(uuids.join('\n'))}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        Copy All ({uuids.length})
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Hash Generator (SHA-256, SHA-512, SHA-1)
// -------------------------------------------------------------
const HashGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy }) => {
  const [text, setText] = useState('Asbily Free Tools');
  const [hashes, setHashes] = useState<{ sha256: string; sha512: string; sha1: string; sha384: string }>({
    sha256: '',
    sha512: '',
    sha1: '',
    sha384: '',
  });

  useEffect(() => {
    const calc = async () => {
      const enc = new TextEncoder().encode(text);

      const bufferToHex = (buf: ArrayBuffer) =>
        Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

      const [s256, s512, s1, s384] = await Promise.all([
        crypto.subtle.digest('SHA-256', enc),
        crypto.subtle.digest('SHA-512', enc),
        crypto.subtle.digest('SHA-1', enc),
        crypto.subtle.digest('SHA-384', enc),
      ]);

      setHashes({
        sha256: bufferToHex(s256),
        sha512: bufferToHex(s512),
        sha1: bufferToHex(s1),
        sha384: bufferToHex(s384),
      });
    };
    calc();
  }, [text]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Input Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
        />
      </div>

      <div className="space-y-4">
        {[
          { label: 'SHA-256 (Recommended)', val: hashes.sha256 },
          { label: 'SHA-512', val: hashes.sha512 },
          { label: 'SHA-384', val: hashes.sha384 },
          { label: 'SHA-1 (Legacy)', val: hashes.sha1 },
        ].map((h) => (
          <div key={h.label} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h.label}</span>
              <button onClick={() => onCopy(h.val)} className="text-xs text-neutral-500 hover:text-black dark:hover:text-white">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="font-mono text-xs break-all text-[#111111] dark:text-neutral-100 select-all">
              {h.val}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Unix Timestamp & Epoch
// -------------------------------------------------------------
const TimestampConverterTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [inputEpoch, setInputEpoch] = useState(String(Math.floor(Date.now() / 1000)));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const convertedDate = useMemo(() => {
    const num = parseInt(inputEpoch);
    if (isNaN(num)) return null;
    const d = new Date(num * 1000);
    return {
      utc: d.toUTCString(),
      iso: d.toISOString(),
      local: d.toLocaleString(),
    };
  }, [inputEpoch]);

  return (
    <div className="space-y-6">
      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between">
        <div>
          <div className="text-xs text-neutral-500 uppercase font-semibold">Current Unix Epoch</div>
          <div className="text-2xl font-mono font-bold mt-1 text-[#111111] dark:text-neutral-100">{currentEpoch}</div>
        </div>
        <button
          onClick={() => setInputEpoch(String(currentEpoch))}
          className="text-xs px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 font-medium"
        >
          Use Current
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Timestamp in Seconds
        </label>
        <input
          type="text"
          value={inputEpoch}
          onChange={(e) => setInputEpoch(e.target.value)}
          className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-sm"
        />
      </div>

      {convertedDate && (
        <div className="space-y-3">
          <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <div className="text-xs text-neutral-400">Local Time:</div>
            <div className="font-mono text-sm font-semibold text-[#111111] dark:text-neutral-100">{convertedDate.local}</div>
          </div>
          <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <div className="text-xs text-neutral-400">UTC / GMT:</div>
            <div className="font-mono text-sm font-semibold text-[#111111] dark:text-neutral-100">{convertedDate.utc}</div>
          </div>
          <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <div className="text-xs text-neutral-400">ISO 8601:</div>
            <div className="font-mono text-sm font-semibold text-[#111111] dark:text-neutral-100">{convertedDate.iso}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Cron Expression Explainer & Builder
// -------------------------------------------------------------
const CronExplainerTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [cron, setCron] = useState('*/15 * * * *');

  const explanation = useMemo(() => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) return 'Invalid cron expression: must have exactly 5 parts (Minute Hour Dom Month Dow)';

    const [min, hr, dom, mon, dow] = parts;

    let desc = 'Runs ';
    if (min === '*' && hr === '*') desc += 'every minute';
    else if (min.startsWith('*/')) desc += `every ${min.replace('*/', '')} minutes`;
    else if (min === '0' && hr === '*') desc += 'at minute 0 of every hour';
    else if (min === '0' && hr === '0') desc += 'every day at midnight (00:00)';
    else desc += `at minute ${min}, hour ${hr}`;

    if (dom !== '*') desc += `, on day of month ${dom}`;
    if (mon !== '*') desc += `, in month ${mon}`;
    if (dow !== '*') desc += `, on day of week ${dow}`;

    return desc;
  }, [cron]);

  const presets = [
    { label: 'Every 5 mins', expr: '*/5 * * * *' },
    { label: 'Every hour', expr: '0 * * * *' },
    { label: 'Daily at midnight', expr: '0 0 * * *' },
    { label: 'Every Monday 9 AM', expr: '0 9 * * 1' },
    { label: 'Monthly on 1st', expr: '0 0 1 * *' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => setCron(p.expr)}
            className="text-xs px-2.5 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          5-Field Cron Expression
        </label>
        <input
          type="text"
          value={cron}
          onChange={(e) => setCron(e.target.value)}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-base"
        />
        <div className="flex justify-between text-[11px] text-neutral-400 mt-1 font-mono px-2">
          <span>minute</span>
          <span>hour</span>
          <span>day-of-month</span>
          <span>month</span>
          <span>day-of-week</span>
        </div>
      </div>

      <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
          Human Explanation
        </div>
        <div className="text-base font-medium text-[#111111] dark:text-neutral-100">{explanation}</div>
      </div>

      <button
        onClick={() => onCopy(cron)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        Copy Expression
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Number Base Converter
// -------------------------------------------------------------
const NumberBaseTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const [dec, setDec] = useState('255');

  const { bin, oct, hex } = useMemo(() => {
    const num = parseInt(dec, 10);
    if (isNaN(num)) return { bin: '', oct: '', hex: '' };
    return {
      bin: num.toString(2),
      oct: num.toString(8),
      hex: num.toString(16).toUpperCase(),
    };
  }, [dec]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
          Decimal (Base 10)
        </label>
        <input
          type="number"
          value={dec}
          onChange={(e) => setDec(e.target.value)}
          className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Binary (Base 2)</span>
            <button onClick={() => onCopy(bin)} className="text-xs text-neutral-400 hover:text-black dark:hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-[#111111] dark:text-neutral-100 break-all">{bin || '-'}</div>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Hex (Base 16)</span>
            <button onClick={() => onCopy(hex)} className="text-xs text-neutral-400 hover:text-black dark:hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-[#111111] dark:text-neutral-100 break-all">{hex || '-'}</div>
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Octal (Base 8)</span>
            <button onClick={() => onCopy(oct)} className="text-xs text-neutral-400 hover:text-black dark:hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-[#111111] dark:text-neutral-100 break-all">{oct || '-'}</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: API & cURL Request Builder
// -------------------------------------------------------------
const CurlBuilderTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('POST');
  const [url, setUrl] = useState('https://api.example.com/v1/items');
  const [headers, setHeaders] = useState('Content-Type: application/json\nAuthorization: Bearer token123');
  const [body, setBody] = useState('{\n  "title": "New Item",\n  "published": true\n}');

  const curlCommand = useMemo(() => {
    let cmd = `curl -X ${method} "${url}"`;
    const hLines = headers.split('\n').filter((h) => h.trim());
    hLines.forEach((h) => {
      cmd += ` \\\n  -H "${h.trim()}"`;
    });
    if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
      cmd += ` \\\n  -d '${body.replace(/\n/g, '')}'`;
    }
    return cmd;
  }, [method, url, headers, body]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-sm font-semibold"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Endpoint URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Headers (one per line)</label>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            rows={5}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Request Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">cURL Snippet</label>
        <pre className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto">
          {curlCommand}
        </pre>
      </div>

      <button
        onClick={() => onCopy(curlCommand)}
        className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        Copy cURL Command
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Markdown Editor & Live Preview
// -------------------------------------------------------------
const MarkdownEditorTool: React.FC<{
  onCopy: (t: string) => void;
  onDownload: (c: string, f: string) => void;
  copied: boolean;
}> = ({ onCopy, onDownload, copied }) => {
  const [md, setMd] = useState('# Asbily Free Tools\n\nWelcome to **Asbily Free Tools**, a suite of modern client-side utilities.\n\n### Key Features:\n- 100% Private (Runs in Browser)\n- Minimal Clean UI\n- High Performance\n\n```json\n{\n  "offline": true\n}\n```\n');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Markdown Source</label>
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            rows={14}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">Rendered Preview</label>
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900 min-h-[300px] text-sm prose dark:prose-invert">
            {md.split('\n').map((line, i) => {
              if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mb-2">{line.replace('# ', '')}</h1>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold mb-2">{line.replace('### ', '')}</h3>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{line.replace('- ', '')}</li>;
              if (line.trim() === '') return <br key={i} />;
              return <p key={i} className="mb-2">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(md)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          Copy Markdown
        </button>
        <button
          onClick={() => onDownload(md, 'document.md')}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          <Download className="w-4 h-4" />
          Download .md
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: CSS Gradient & Box Shadow Generator
// -------------------------------------------------------------
const CssGeneratorsTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy }) => {
  const [tab, setTab] = useState<'gradient' | 'shadow'>('gradient');

  // Gradient state
  const [gradAngle, setGradAngle] = useState(135);
  const [color1, setColor1] = useState('#111111');
  const [color2, setColor2] = useState('#4B5563');

  // Shadow state
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.15)');

  const gradientCss = `background: linear-gradient(${gradAngle}deg, ${color1}, ${color2});`;
  const shadowCss = `box-shadow: ${xOffset}px ${yOffset}px ${blur}px ${spread}px ${shadowColor};`;

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setTab('gradient')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
            tab === 'gradient'
              ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          CSS Gradient Generator
        </button>
        <button
          onClick={() => setTab('shadow')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg border transition ${
            tab === 'shadow'
              ? 'bg-[#111111] text-white border-[#111111] dark:bg-white dark:text-black dark:border-white'
              : 'border-neutral-200 dark:border-neutral-800'
          }`}
        >
          CSS Box Shadow Generator
        </button>
      </div>

      {tab === 'gradient' ? (
        <div className="space-y-6">
          <div
            className="w-full h-44 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-white font-semibold text-lg shadow-sm"
            style={{ background: `linear-gradient(${gradAngle}deg, ${color1}, ${color2})` }}
          >
            Live Gradient Preview
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Color 1</label>
              <div className="flex items-center gap-2">
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-10 h-10 border rounded cursor-pointer" />
                <input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Color 2</label>
              <div className="flex items-center gap-2">
                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-10 h-10 border rounded cursor-pointer" />
                <input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-xs" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Angle ({gradAngle}°)</label>
              <input type="range" min={0} max={360} value={gradAngle} onChange={(e) => setGradAngle(parseInt(e.target.value))} className="w-full accent-black dark:accent-white mt-2" />
            </div>
          </div>

          <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between font-mono text-xs">
            <span>{gradientCss}</span>
            <button onClick={() => onCopy(gradientCss)} className="text-neutral-500 hover:text-black dark:hover:text-white">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="h-44 flex items-center justify-center p-6 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
            <div
              className="w-48 h-24 bg-white dark:bg-neutral-950 rounded-lg flex items-center justify-center text-xs font-semibold"
              style={{ boxShadow: `${xOffset}px ${yOffset}px ${blur}px ${spread}px ${shadowColor}` }}
            >
              Shadow Object
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">X Offset ({xOffset}px)</label>
              <input type="range" min={-50} max={50} value={xOffset} onChange={(e) => setXOffset(parseInt(e.target.value))} className="w-full accent-black dark:accent-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Y Offset ({yOffset}px)</label>
              <input type="range" min={-50} max={50} value={yOffset} onChange={(e) => setYOffset(parseInt(e.target.value))} className="w-full accent-black dark:accent-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Blur ({blur}px)</label>
              <input type="range" min={0} max={100} value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full accent-black dark:accent-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Spread ({spread}px)</label>
              <input type="range" min={-30} max={30} value={spread} onChange={(e) => setSpread(parseInt(e.target.value))} className="w-full accent-black dark:accent-white" />
            </div>
          </div>

          <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 flex items-center justify-between font-mono text-xs">
            <span>{shadowCss}</span>
            <button onClick={() => onCopy(shadowCss)} className="text-neutral-500 hover:text-black dark:hover:text-white">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
