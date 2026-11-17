import React, { useState, useMemo, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { jsPDF } from 'jspdf';
import {
  Copy,
  Check,
  Download,
  Upload,
  RefreshCw,
  Wifi,
  Link as LinkIcon,
  Camera,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Activity,
  ShieldCheck,
  Receipt,
  Percent,
  Sliders,
} from 'lucide-react';

// =============================================================
// 1. Character Counter (Text)
// =============================================================
export const CharacterCounterTool: React.FC = () => {
  const [text, setText] = useState(
    'Asbily Tools delivers fast, privacy-first browser utilities directly on your device.'
  );

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?।]+/).filter((s) => s.trim()).length : 0;
    const bytes = new TextEncoder().encode(text).length;
    return { chars, charsNoSpaces, words, lines, sentences, bytes };
  }, [text]);

  const limits = [
    { label: 'SEO Meta Title', max: 60 },
    { label: 'Instagram Bio', max: 150 },
    { label: 'SEO Meta Description', max: 160 },
    { label: 'SMS Segment', max: 160 },
    { label: 'X / Twitter Post', max: 280 },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Characters', val: stats.chars },
          { label: 'No Spaces', val: stats.charsNoSpaces },
          { label: 'Words', val: stats.words },
          { label: 'Lines', val: stats.lines },
          { label: 'Sentences', val: stats.sentences },
          { label: 'UTF-8 Bytes', val: stats.bytes },
        ].map((item) => (
          <div
            key={item.label}
            className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]"
          >
            <div className="text-[11px] text-neutral-500">{item.label}</div>
            <div className="text-xl font-bold tabular-nums">{item.val}</div>
          </div>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Type or paste text to count characters..."
        className="w-full p-4 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm leading-relaxed"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {limits.map((lim) => {
          const pct = Math.min(100, Math.round((stats.chars / lim.max) * 100));
          const over = stats.chars > lim.max;
          return (
            <div
              key={lim.label}
              className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] space-y-1.5"
            >
              <div className="flex justify-between text-[11px] font-semibold">
                <span>{lim.label}</span>
                <span className="tabular-nums">
                  {stats.chars}/{lim.max}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all ${over ? 'bg-red-500' : 'bg-[#000000] dark:bg-[#FFFFFF]'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// =============================================================
// 2. Dedicated Image Resizer (Image)
// =============================================================
export const ImageResizerTool: React.FC = () => {
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [origDims, setOrigDims] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('resized-image');

  const renderResized = (imgSrc: string, w: number, h: number, fmt: typeof format) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, w);
      canvas.height = Math.max(1, h);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (fmt === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setOutUrl(canvas.toDataURL(fmt, 0.92));
    };
    img.src = imgSrc;
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        setOrigDims({ w: img.naturalWidth, h: img.naturalHeight });
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        setSrcUrl(dataUrl);
        renderResized(dataUrl, img.naturalWidth, img.naturalHeight, format);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const updateW = (val: number) => {
    const clean = Math.max(1, val || 1);
    setWidth(clean);
    let nextH = height;
    if (lockAspect && origDims.w > 0) {
      nextH = Math.max(1, Math.round((clean / origDims.w) * origDims.h));
      setHeight(nextH);
    }
    if (srcUrl) renderResized(srcUrl, clean, nextH, format);
  };

  const updateH = (val: number) => {
    const clean = Math.max(1, val || 1);
    setHeight(clean);
    let nextW = width;
    if (lockAspect && origDims.h > 0) {
      nextW = Math.max(1, Math.round((clean / origDims.h) * origDims.w));
      setWidth(nextW);
    }
    if (srcUrl) renderResized(srcUrl, nextW, clean, format);
  };

  const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/webp' ? 'webp' : 'png';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        <div className="flex items-center gap-2 text-xs">
          <span>W:</span>
          <input
            type="number"
            min={1}
            max={8000}
            value={width}
            onChange={(e) => updateW(Number(e.target.value))}
            className="w-20 px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]"
          />
          <span>× H:</span>
          <input
            type="number"
            min={1}
            max={8000}
            value={height}
            onChange={(e) => updateH(Number(e.target.value))}
            className="w-20 px-2.5 py-1.5 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909]"
          />
        </div>

        <label className="inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={lockAspect}
            onChange={(e) => setLockAspect(e.target.checked)}
            className="rounded accent-black dark:accent-white"
          />
          <span>Lock Ratio</span>
        </label>

        <select
          value={format}
          onChange={(e) => {
            const f = e.target.value as typeof format;
            setFormat(f);
            if (srcUrl) renderResized(srcUrl, width, height, f);
          }}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPG</option>
          <option value="image/webp">WEBP</option>
        </select>
      </div>

      {origDims.w > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500">Quick Scale:</span>
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => {
                const nw = Math.max(1, Math.round((origDims.w * pct) / 100));
                const nh = Math.max(1, Math.round((origDims.h * pct) / 100));
                setWidth(nw);
                setHeight(nh);
                if (srcUrl) renderResized(srcUrl, nw, nh, format);
              }}
              className="px-2.5 py-1 rounded-lg border border-black/15 dark:border-white/15 hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer"
            >
              {pct}%
            </button>
          ))}
        </div>
      )}

      {outUrl && (
        <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 space-y-3 text-center">
          <img src={outUrl} alt="Resized preview" className="max-h-80 mx-auto rounded-lg object-contain" />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/10 dark:border-white/10 text-xs">
            <span className="text-neutral-500">
              Original: {origDims.w}×{origDims.h} → Output: {width}×{height} px
            </span>
            <a
              href={outUrl}
              download={`${fileName}-${width}x${height}.${ext}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .{ext.toUpperCase()}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================
// 3. HTML Formatter, CSS Minifier & JS Minifier (Developer)
// =============================================================
export const CodeMinifyFormatTool: React.FC<{ mode: 'html' | 'css' | 'js' }> = ({ mode }) => {
  const defaults = {
    html: '<div class="card"><h2>Title</h2><p>Hello <strong>Asbily</strong></p></div>',
    css: '/* Main card */\n.card {\n  display: flex;\n  padding: 16px;\n  color: #000000;\n}\n',
    js: '// Calculate sum\nfunction add(a, b) {\n  const result = a + b;\n  return result;\n}\n',
  };
  const [input, setInput] = useState(defaults[mode]);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const runBeautify = () => {
    if (mode === 'html') {
      const tokens = input.replace(/>\s+</g, '><').trim().split(/(<[^>]+>)/g).filter(Boolean);
      let indent = 0;
      const lines: string[] = [];
      const selfClosing = /^<(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)\b/i;
      for (const tok of tokens) {
        if (/^<\//.test(tok)) {
          indent = Math.max(0, indent - 1);
          lines.push('  '.repeat(indent) + tok);
        } else if (/^</.test(tok) && !/\/>$/.test(tok) && !selfClosing.test(tok) && !/^<!/.test(tok)) {
          lines.push('  '.repeat(indent) + tok);
          indent++;
        } else {
          lines.push('  '.repeat(indent) + tok);
        }
      }
      setOutput(lines.join('\n'));
    } else if (mode === 'css') {
      const formatted = input
        .replace(/\s*\{\s*/g, ' {\n  ')
        .replace(/;\s*/g, ';\n  ')
        .replace(/\s*\}\s*/g, '\n}\n\n')
        .replace(/\n  \n\}/g, '\n}')
        .trim();
      setOutput(formatted);
    } else {
      setOutput(
        input
          .replace(/;\s*/g, ';\n')
          .replace(/\{\s*/g, ' {\n  ')
          .replace(/\s*\}/g, '\n}')
          .trim()
      );
    }
  };

  const runMinify = () => {
    if (mode === 'html') {
      setOutput(input.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim());
    } else if (mode === 'css') {
      setOutput(
        input
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s*([{}:;,])\s*/g, '$1')
          .replace(/;}/g, '}')
          .replace(/\s{2,}/g, ' ')
          .trim()
      );
    } else {
      // Preserve quoted string & template literals while stripping comments & extra whitespace
      const stripped = input.replace(/(['"`])(?:\\.|(?!\1).)*\1|\/\*[\s\S]*?\*\/|\/\/.*$/gm, (m, q) =>
        q ? m : ''
      );
      setOutput(
        stripped
          .replace(/\s*\n\s*/g, ' ')
          .replace(/\s*([=+\-*/{}();,:<>!&|?])\s*/g, '$1')
          .replace(/\s{2,}/g, ' ')
          .trim()
      );
    }
  };

  const savings =
    input.length > 0 && output.length > 0
      ? Math.round(((input.length - output.length) / input.length) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {mode === 'html' ? (
          <>
            <button
              type="button"
              onClick={runBeautify}
              className="px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
            >
              Format / Beautify HTML
            </button>
            <button
              type="button"
              onClick={runMinify}
              className="px-4 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
            >
              Minify HTML
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={runMinify}
              className="px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
            >
              Minify {mode.toUpperCase()}
            </button>
            <button
              type="button"
              onClick={runBeautify}
              className="px-4 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
            >
              Beautify {mode.toUpperCase()}
            </button>
          </>
        )}
        {output && (
          <span className="text-xs text-neutral-500 ml-auto tabular-nums">
            {input.length} B → {output.length} B ({savings >= 0 ? `${savings}% saved` : `+${Math.abs(savings)}%`})
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={11}
          spellCheck={false}
          className="w-full p-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono text-xs"
        />
        <div className="space-y-2">
          <textarea
            readOnly
            value={output}
            rows={11}
            spellCheck={false}
            placeholder="Output will appear here..."
            className="w-full p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] font-mono text-xs"
          />
          {output && (
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Result'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================
// 4. WiFi QR, URL QR & Barcode Reader (QR & Barcode)
// =============================================================
export const WifiQrTool: React.FC = () => {
  const [ssid, setSsid] = useState('Asbily_Studio_WiFi');
  const [password, setPassword] = useState('Connect2026');
  const [auth, setAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [hidden, setHidden] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  const payload = `WIFI:T:${auth};S:${ssid};P:${auth === 'nopass' ? '' : password};H:${hidden ? 'true' : 'false'};;`;

  useEffect(() => {
    QRCode.toDataURL(payload, { width: 520, margin: 2 }).then(setQrUrl).catch(() => {});
  }, [payload]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Network Name (SSID)</label>
          <input
            type="text"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
        </div>
        {auth !== 'nopass' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={auth}
            onChange={(e) => setAuth(e.target.value as typeof auth)}
            className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
          >
            <option value="WPA">WPA / WPA2 / WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Open Network</option>
          </select>
          <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
            <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
            <span>Hidden SSID</span>
          </label>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] flex flex-col items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <Wifi className="w-4 h-4" />
          <span>Scan to Join: {ssid || 'Wi-Fi'}</span>
        </div>
        {qrUrl && <img src={qrUrl} alt="WiFi QR" className="w-56 h-56 rounded-xl bg-white p-2" />}
        {qrUrl && (
          <a
            href={qrUrl}
            download={`wifi-${ssid || 'network'}.png`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download WiFi QR</span>
          </a>
        )}
      </div>
    </div>
  );
};

export const UrlQrTool: React.FC = () => {
  const [url, setUrl] = useState('https://tools.asbily.com');
  const [fg, setFg] = useState('#000000');
  const [bg, setBg] = useState('#FFFFFF');
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    if (!url.trim()) return;
    QRCode.toDataURL(url.trim(), {
      width: 560,
      margin: 2,
      color: { dark: fg, light: bg },
    })
      .then(setQrUrl)
      .catch(() => {});
  }, [url, fg, bg]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Destination URL</span>
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <label className="inline-flex items-center gap-2">
            <span>Foreground:</span>
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="w-8 h-8 cursor-pointer" />
          </label>
          <label className="inline-flex items-center gap-2">
            <span>Background:</span>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-8 h-8 cursor-pointer" />
          </label>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] flex flex-col items-center gap-4">
        {qrUrl && <img src={qrUrl} alt="URL QR Code" className="w-56 h-56 rounded-xl" />}
        {qrUrl && (
          <a
            href={qrUrl}
            download="url-qr-code.png"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PNG</span>
          </a>
        )}
      </div>
    </div>
  );
};

export const BarcodeReaderTool: React.FC = () => {
  const [results, setResults] = useState<{ format: string; value: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scanningCam, setScanningCam] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopCam = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanningCam(false);
  };

  useEffect(() => () => stopCam(), []);

  const decodeSource = async (source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
    const found: { format: string; value: string }[] = [];
    const BarcodeDet = (window as unknown as { BarcodeDetector?: new (opts?: { formats: string[] }) => { detect: (s: CanvasImageSource) => Promise<{ format: string; rawValue: string }[]> } }).BarcodeDetector;

    if (BarcodeDet) {
      try {
        const detector = new BarcodeDet({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'itf', 'qr_code'],
        });
        const detected = await detector.detect(source);
        for (const item of detected) {
          found.push({ format: item.format.toUpperCase(), value: item.rawValue });
        }
      } catch {
        // Fallback below
      }
    }

    if (found.length === 0) {
      const canvas = document.createElement('canvas');
      const w = source instanceof HTMLVideoElement ? source.videoWidth : source.width;
      const h = source instanceof HTMLVideoElement ? source.videoHeight : source.height;
      if (w > 0 && h > 0) {
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(source, 0, 0, w, h);
          const imgData = ctx.getImageData(0, 0, w, h);
          const qr = jsQR(imgData.data, w, h);
          if (qr) found.push({ format: 'QR_CODE', value: qr.data });
        }
      }
    }
    return found;
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = async () => {
        const res = await decodeSource(img);
        if (res.length === 0) {
          setError('No readable barcode or QR code detected in this image. Ensure sharp lighting and focus.');
        }
        setResults(res);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const startCam = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setScanningCam(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const tick = async () => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          const res = await decodeSource(videoRef.current);
          if (res.length > 0) {
            setResults(res);
            stopCam();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError('Camera permission denied or unavailable.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload Barcode Image</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        <button
          type="button"
          onClick={scanningCam ? stopCam : startCam}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>{scanningCam ? 'Stop Camera' : 'Scan with Camera'}</span>
        </button>
      </div>

      {scanningCam && (
        <video ref={videoRef} playsInline muted className="w-full max-w-md rounded-xl border border-black/15 mx-auto" />
      )}

      {error && <div className="p-3 rounded-xl border border-black/20 text-xs">{error}</div>}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div
              key={`${r.value}-${i}`}
              className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-[10px] font-mono uppercase text-neutral-500">{r.format}</div>
                <div className="text-sm font-bold break-all">{r.value}</div>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(r.value)}
                className="px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =============================================================
// 5. SEO & Website Tools (URL Checker, Status, Keywords, Perf)
// =============================================================
export const UrlCheckerTool: React.FC = () => {
  const [rawUrl, setRawUrl] = useState('https://tools.asbily.com/pdf/pdf-merge-split?utm_source=demo&utm_medium=social#workspace');

  const parsed = useMemo(() => {
    try {
      const u = new URL(rawUrl.trim());
      const cleanParams = new URLSearchParams(u.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'].forEach((k) =>
        cleanParams.delete(k)
      );
      const cleanUrl = `${u.origin}${u.pathname}${cleanParams.toString() ? `?${cleanParams.toString()}` : ''}${u.hash}`;
      const issues: string[] = [];
      if (u.protocol !== 'https:') issues.push('Not using HTTPS protocol.');
      if (/[A-Z]/.test(u.pathname)) issues.push('Uppercase characters in pathname (prefer lowercase SEO slugs).');
      if (u.pathname.includes('_')) issues.push('Underscores in URL path (hyphens `-` are preferred for SEO).');
      if (u.pathname.length > 75) issues.push('Long URL path (>75 chars).');

      return {
        valid: true,
        protocol: u.protocol,
        host: u.hostname,
        pathname: u.pathname,
        params: Array.from(u.searchParams.entries()),
        hash: u.hash,
        cleanUrl,
        issues,
      };
    } catch {
      return { valid: false };
    }
  }, [rawUrl]);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={rawUrl}
        onChange={(e) => setRawUrl(e.target.value)}
        placeholder="Paste full URL (including https://)..."
        className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono text-xs sm:text-sm"
      />
      {!parsed.valid ? (
        <div className="p-4 rounded-xl border border-black/20 text-xs">Invalid URL syntax. Include scheme such as https://</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {[
              { k: 'Protocol', v: parsed.protocol },
              { k: 'Hostname', v: parsed.host },
              { k: 'Pathname', v: parsed.pathname },
              { k: 'Hash Fragment', v: parsed.hash || '(none)' },
            ].map((item) => (
              <div key={item.k} className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
                <div className="text-neutral-500">{item.k}</div>
                <div className="font-mono font-semibold break-all mt-0.5">{item.v}</div>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 space-y-2 text-xs">
            <div className="font-bold">Tracking-Free Canonical URL</div>
            <div className="font-mono break-all text-neutral-600 dark:text-neutral-300">{parsed.cleanUrl}</div>
          </div>
          <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 space-y-2 text-xs">
            <div className="font-bold">SEO Hygiene Checks</div>
            {parsed.issues && parsed.issues.length === 0 ? (
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /><span>Clean HTTPS SEO-friendly URL structure.</span></div>
            ) : (
              <ul className="list-disc pl-4 space-y-1">
                {parsed.issues?.map((i) => <li key={i}>{i}</li>)}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const WebsiteStatusCheckerTool: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('https://tools.asbily.com');
  const [testing, setTesting] = useState(false);
  const [report, setReport] = useState<{ ok: boolean; latencyMs: number; note: string } | null>(null);

  const checkReachability = async () => {
    setTesting(true);
    setReport(null);
    const start = performance.now();
    try {
      const normalized = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
      await fetch(normalized, { mode: 'no-cors', cache: 'no-store' });
      const latencyMs = Math.round(performance.now() - start);
      setReport({
        ok: true,
        latencyMs,
        note: 'Browser network probe completed (CORS-restricted third-party hosts return opaque reachability timing without exposing remote HTTP status codes).',
      });
    } catch {
      const latencyMs = Math.round(performance.now() - start);
      setReport({
        ok: false,
        latencyMs,
        note: 'Browser could not reach host (DNS/TLS error, offline, or blocked by host security policy).',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] text-xs text-neutral-600 dark:text-neutral-400">
        Runs directly from your browser using a client-side reachability & latency probe without external monitoring APIs.
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          type="url"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          className="flex-1 min-w-[220px] px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
        />
        <button
          type="button"
          onClick={checkReachability}
          disabled={testing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
        >
          <Globe className="w-4 h-4" />
          <span>{testing ? 'Probing...' : 'Check Reachability'}</span>
        </button>
      </div>
      {report && (
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] space-y-1.5 text-xs">
          <div className="font-bold flex items-center gap-2">
            {report.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{report.ok ? `Reachable (${report.latencyMs} ms)` : `Unreachable (${report.latencyMs} ms)`}</span>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400">{report.note}</p>
        </div>
      )}
    </div>
  );
};

export const KeywordAnalysisTool: React.FC = () => {
  const [text, setText] = useState(
    'Free online PDF tools and free image compressor tools help creators finish everyday browser tasks faster. Local browser tools protect privacy.'
  );

  const analysis = useMemo(() => {
    const words = text.toLowerCase().match(/[a-z\u0980-\u09FF0-9]+/g) || [];
    const total = words.length;
    const stop = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'are', 'was', 'your', 'you', 'can', 'in', 'on', 'to', 'of', 'a']);
    const counts1: Record<string, number> = {};
    const counts2: Record<string, number> = {};

    const cleanWords = words.filter((w) => w.length > 2 && !stop.has(w));
    for (let i = 0; i < cleanWords.length; i++) {
      counts1[cleanWords[i]] = (counts1[cleanWords[i]] || 0) + 1;
      if (i < cleanWords.length - 1) {
        const bi = `${cleanWords[i]} ${cleanWords[i + 1]}`;
        counts2[bi] = (counts2[bi] || 0) + 1;
      }
    }

    const top1 = Object.entries(counts1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([kw, count]) => ({ kw, count, density: total ? ((count / total) * 100).toFixed(1) : '0.0' }));
    const top2 = Object.entries(counts2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([kw, count]) => ({ kw, count, density: total ? ((count / total) * 100).toFixed(1) : '0.0' }));

    return { total, unique: Object.keys(counts1).length, top1, top2 };
  }, [text]);

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="w-full p-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
      />
      <div className="text-xs text-neutral-500">
        Total words: <strong>{analysis.total}</strong> · Unique meaningful keywords: <strong>{analysis.unique}</strong>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider">Top 1-Word Keywords</div>
          {analysis.top1.map((item) => (
            <div key={item.kw} className="flex justify-between text-xs py-1 border-b border-black/5 dark:border-white/5">
              <span className="font-medium">{item.kw}</span>
              <span className="font-mono">{item.count}× ({item.density}%)</span>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider">Top 2-Word Phrases</div>
          {analysis.top2.map((item) => (
            <div key={item.kw} className="flex justify-between text-xs py-1 border-b border-black/5 dark:border-white/5">
              <span className="font-medium">{item.kw}</span>
              <span className="font-mono">{item.count}× ({item.density}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const WebsitePerformanceCheckerTool: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState(
    '<!doctype html><html><head><title>Page</title><script src="app.js"></script></head><body><h1>Hello</h1><img src="hero.png" /></body></html>'
  );

  const navStats = useMemo(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (!nav) return null;
    return {
      ttfb: Math.max(0, Math.round(nav.responseStart - nav.requestStart)),
      domReady: Math.max(0, Math.round(nav.domContentLoadedEventEnd - nav.startTime)),
      load: Math.max(0, Math.round(nav.loadEventEnd - nav.startTime)),
      resources: performance.getEntriesByType('resource').length,
    };
  }, []);

  const htmlAudit = useMemo(() => {
    const bytes = new TextEncoder().encode(htmlInput).length;
    const tags = (htmlInput.match(/<[a-zA-Z][^>]*>/g) || []).length;
    const scripts = (htmlInput.match(/<script\b/gi) || []).length;
    const imgsNoLazy = (htmlInput.match(/<img(?![^>]*loading=)[^>]*>/gi) || []).length;
    const hasViewport = /name=["']viewport["']/i.test(htmlInput);
    return { bytes, tags, scripts, imgsNoLazy, hasViewport };
  }, [htmlInput]);

  return (
    <div className="space-y-5">
      {navStats && (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Current Browser Navigation Timing</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'TTFB', val: `${navStats.ttfb} ms` },
              { label: 'DOM Ready', val: `${navStats.domReady} ms` },
              { label: 'Page Load', val: `${navStats.load} ms` },
              { label: 'Loaded Resources', val: String(navStats.resources) },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
                <div className="text-[11px] text-neutral-500">{s.label}</div>
                <div className="text-lg font-bold tabular-nums">{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Inspect HTML Document Source
        </label>
        <textarea
          value={htmlInput}
          onChange={(e) => setHtmlInput(e.target.value)}
          rows={6}
          className="w-full p-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono text-xs"
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-black/10 dark:border-white/10">HTML Weight: <strong>{(htmlAudit.bytes / 1024).toFixed(2)} KB</strong></div>
          <div className="p-3 rounded-xl border border-black/10 dark:border-white/10">DOM Elements: <strong>{htmlAudit.tags}</strong></div>
          <div className="p-3 rounded-xl border border-black/10 dark:border-white/10">Script Tags: <strong>{htmlAudit.scripts}</strong></div>
          <div className="p-3 rounded-xl border border-black/10 dark:border-white/10">Viewport Meta: <strong>{htmlAudit.hasViewport ? 'Present' : 'Missing'}</strong></div>
        </div>
      </div>
    </div>
  );
};

// =============================================================
// 6. Security: Random String & API Token Generator
// =============================================================
export const RandomStringGeneratorTool: React.FC = () => {
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(5);
  const [charsetType, setCharsetType] = useState<'alnum' | 'hex' | 'base64url'>('alnum');
  const [strings, setStrings] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generate = () => {
    const sets = {
      alnum: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      hex: '0123456789abcdef',
      base64url: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    };
    const chars = sets[charsetType];
    const out: string[] = [];
    for (let c = 0; c < count; c++) {
      const buf = new Uint32Array(length);
      crypto.getRandomValues(buf);
      let s = '';
      for (let i = 0; i < length; i++) {
        s += chars[buf[i] % chars.length];
      }
      out.push(s);
    }
    setStrings(out);
  };

  useEffect(() => {
    generate();
  }, [length, count, charsetType]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
        <div className="flex items-center gap-2 text-xs">
          <span>Length: {length}</span>
          <input type="range" min={8} max={128} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-28 accent-black dark:accent-white" />
        </div>
        <select
          value={charsetType}
          onChange={(e) => setCharsetType(e.target.value as typeof charsetType)}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          <option value="alnum">Alphanumeric (A-Z, a-z, 0-9)</option>
          <option value="hex">Hexadecimal (0-9, a-f)</option>
          <option value="base64url">URL-Safe Token</option>
        </select>
        <select
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          <option value={1}>1 String</option>
          <option value={5}>5 Strings</option>
          <option value={10}>10 Strings</option>
        </select>
        <button
          type="button"
          onClick={generate}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>
      </div>

      <div className="space-y-2">
        {strings.map((s, idx) => (
          <div
            key={`${s}-${idx}`}
            className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] flex items-center justify-between gap-3"
          >
            <code className="font-mono text-xs break-all flex-1">{s}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(s);
                setCopiedIdx(idx);
                setTimeout(() => setCopiedIdx(null), 1500);
              }}
              className="px-3 py-1 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer shrink-0"
            >
              {copiedIdx === idx ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Generated locally using browser Web Crypto (`crypto.getRandomValues`).</span>
      </div>
    </div>
  );
};

// =============================================================
// 7. Social Media: Username Generator & Interactive Image Resizer
// =============================================================
export const UsernameGeneratorTool: React.FC = () => {
  const [keyword, setKeyword] = useState('asbily');
  const [style, setStyle] = useState<'creator' | 'tech' | 'brand' | 'minimal'>('creator');
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const handles = useMemo(() => {
    const clean = keyword.trim().toLowerCase().replace(/[^a-z0-9]/g, '') || 'creator';
    const suffixes: Record<typeof style, string[]> = {
      creator: ['creates', 'studio', 'daily', 'hub', 'media', 'vibes', 'hq', 'live', 'official', 'clips'],
      tech: ['dev', 'labs', 'code', 'stack', 'tech', 'builds', 'sys', 'io', 'cloud', 'apps'],
      brand: ['co', 'hq', 'works', 'group', 'digital', 'global', 'pro', 'craft', 'collective', 'store'],
      minimal: ['', 'x', '_', '.', '01', '99', 'real', 'the', 'hey', 'its'],
    };
    const list = suffixes[style].flatMap((s) =>
      s === ''
        ? [`@${clean}`]
        : s === 'the' || s === 'hey' || s === 'its'
          ? [`@${s}${clean}`, `@${s}.${clean}`]
          : [`@${clean}${s}`, `@${clean}_${s}`, `@${clean}.${s}`]
    );
    return Array.from(new Set(list)).slice(0, 18);
  }, [keyword, style]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter your name or niche..."
          className="flex-1 min-w-[200px] px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
        />
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value as typeof style)}
          className="px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          <option value="creator">Creator Style</option>
          <option value="tech">Developer / Tech</option>
          <option value="brand">Brand / Studio</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {handles.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(h);
              setCopiedName(h);
              setTimeout(() => setCopiedName(null), 1500);
            }}
            className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] hover:border-[#000000] dark:hover:border-[#FFFFFF] flex items-center justify-between text-xs font-mono cursor-pointer transition"
          >
            <span className="font-semibold">{h}</span>
            <span className="text-neutral-500">{copiedName === h ? 'Copied' : 'Copy'}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const SocialImageResizerTool: React.FC = () => {
  const presets = [
    { id: 'ig-sq', label: 'Instagram Post (1080×1080)', w: 1080, h: 1080 },
    { id: 'ig-port', label: 'Instagram Portrait (1080×1350)', w: 1080, h: 1350 },
    { id: 'ig-story', label: 'Story / Reel / TikTok (1080×1920)', w: 1080, h: 1920 },
    { id: 'yt-thumb', label: 'YouTube Thumbnail (1280×720)', w: 1280, h: 720 },
    { id: 'li-banner', label: 'LinkedIn Banner (1584×396)', w: 1584, h: 396 },
    { id: 'x-header', label: 'X / Twitter Header (1500×500)', w: 1500, h: 500 },
  ];
  const [preset, setPreset] = useState(presets[0]);
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [bgColor, setBgColor] = useState('#090909');
  const [srcUrl, setSrcUrl] = useState<string | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);

  const renderPreset = (url: string, p: typeof preset, fit: typeof fitMode, bg: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = p.w;
      canvas.height = p.h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, p.w, p.h);

      const scale =
        fit === 'cover'
          ? Math.max(p.w / img.naturalWidth, p.h / img.naturalHeight)
          : Math.min(p.w / img.naturalWidth, p.h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (p.w - dw) / 2;
      const dy = (p.h - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      setOutUrl(canvas.toDataURL('image/png'));
    };
    img.src = url;
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const u = reader.result as string;
      setSrcUrl(u);
      renderPreset(u, preset, fitMode, bgColor);
    };
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload Photo</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        <select
          value={preset.id}
          onChange={(e) => {
            const p = presets.find((x) => x.id === e.target.value) || presets[0];
            setPreset(p);
            if (srcUrl) renderPreset(srcUrl, p, fitMode, bgColor);
          }}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>

        <select
          value={fitMode}
          onChange={(e) => {
            const m = e.target.value as typeof fitMode;
            setFitMode(m);
            if (srcUrl) renderPreset(srcUrl, preset, m, bgColor);
          }}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs"
        >
          <option value="cover">Fill / Crop to Frame</option>
          <option value="contain">Fit Entire Image + Padding</option>
        </select>

        {fitMode === 'contain' && (
          <input
            type="color"
            value={bgColor}
            onChange={(e) => {
              setBgColor(e.target.value);
              if (srcUrl) renderPreset(srcUrl, preset, fitMode, e.target.value);
            }}
            className="w-8 h-8 rounded cursor-pointer"
          />
        )}
      </div>

      {outUrl && (
        <div className="p-4 rounded-2xl border border-black/10 dark:border-white/10 text-center space-y-3">
          <img src={outUrl} alt="Social resized" className="max-h-80 mx-auto rounded-lg object-contain" />
          <a
            href={outUrl}
            download={`${preset.id}-${preset.w}x${preset.h}.png`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {preset.w}×{preset.h} PNG</span>
          </a>
        </div>
      )}
    </div>
  );
};

// =============================================================
// 8. Business: Receipt Generator (PDF) & Tax Calculator
// =============================================================
export const ReceiptGeneratorTool: React.FC = () => {
  const [businessName, setBusinessName] = useState('Asbily Studio');
  const [customerName, setCustomerName] = useState('Tariq Hasan');
  const [receiptNo, setReceiptNo] = useState('RCP-2026-014');
  const [paymentMethod, setPaymentMethod] = useState('bKash / Bank Transfer');
  const [description, setDescription] = useState('Web Design & Optimization Package');
  const [amount, setAmount] = useState(12500);
  const [currency, setCurrency] = useState('BDT');

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a5' });
    doc.setFontSize(16);
    doc.text(businessName || 'Payment Receipt', 14, 18);
    doc.setFontSize(10);
    doc.text(`OFFICIAL PAYMENT RECEIPT · ${receiptNo}`, 14, 26);
    doc.line(14, 30, 134, 30);
    doc.text(`Date: ${new Date().toISOString().slice(0, 10)}`, 14, 38);
    doc.text(`Received From: ${customerName}`, 14, 45);
    doc.text(`Payment Method: ${paymentMethod}`, 14, 52);
    doc.line(14, 58, 134, 58);
    doc.setFontSize(11);
    doc.text(`Item: ${description}`, 14, 68);
    doc.setFontSize(14);
    doc.text(`Amount Paid: ${currency} ${amount.toLocaleString()}`, 14, 80);
    doc.setFontSize(10);
    doc.text('Status: PAID IN FULL', 14, 92);
    doc.save(`${receiptNo.toLowerCase()}.pdf`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <input
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Business / Issuer Name"
          className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
        />
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Payer / Customer Name"
          className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={receiptNo}
            onChange={(e) => setReceiptNo(e.target.value)}
            placeholder="Receipt #"
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            placeholder="Payment Method"
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
        </div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item / Service Description"
          className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          >
            <option value="BDT">BDT (৳)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-black/15 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#050505] flex flex-col justify-between space-y-5">
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-base">{businessName}</span>
            <span className="font-mono px-2 py-0.5 rounded bg-[#000000] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:text-[#000000] font-bold">
              PAID
            </span>
          </div>
          <div className="text-neutral-500 font-mono">{receiptNo}</div>
          <div className="pt-2 border-t border-black/10 dark:border-white/10 space-y-1">
            <div>Customer: <strong>{customerName}</strong></div>
            <div>Method: <strong>{paymentMethod}</strong></div>
            <div>Item: <strong>{description}</strong></div>
          </div>
          <div className="pt-3 text-xl font-extrabold tabular-nums">
            {currency} {amount.toLocaleString()}
          </div>
        </div>

        <button
          type="button"
          onClick={downloadPdf}
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
        >
          <Receipt className="w-4 h-4" />
          <span>Download Official Receipt PDF</span>
        </button>
      </div>
    </div>
  );
};

export const TaxCalculatorTool: React.FC = () => {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(15);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  const calc = useMemo(() => {
    const cleanAmt = Math.max(0, amount || 0);
    const cleanRate = Math.max(0, rate || 0);
    if (mode === 'exclusive') {
      const tax = cleanAmt * (cleanRate / 100);
      return { net: cleanAmt, tax, gross: cleanAmt + tax };
    }
    const net = cleanAmt / (1 + cleanRate / 100);
    return { net, tax: cleanAmt - net, gross: cleanAmt };
  }, [amount, rate, mode]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5" />
            <span>Tax / VAT Rate (%)</span>
          </label>
          <input
            type="number"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Calculation Mode</span>
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          >
            <option value="exclusive">Add Tax (Net → Gross)</option>
            <option value="inclusive">Extract Tax (Gross → Net)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Net Amount (Pre-Tax)', val: calc.net.toFixed(2) },
          { label: `Tax Amount (${rate}%)`, val: calc.tax.toFixed(2) },
          { label: 'Gross Total (After Tax)', val: calc.gross.toFixed(2) },
        ].map((box) => (
          <div
            key={box.label}
            className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]"
          >
            <div className="text-xs text-neutral-500">{box.label}</div>
            <div className="text-2xl font-extrabold tabular-nums mt-1">{box.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
