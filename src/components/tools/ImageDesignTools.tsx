import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Copy, Check, Download, Upload, Sliders, Image as ImageIcon, Pipette, Eye, RefreshCw, ZoomIn } from 'lucide-react';
import { ImageEditorProTool, BgColorRemoverTool } from './ImageProTools';

interface ImageToolProps {
  toolId: string;
}

export const ImageDesignTools: React.FC<ImageToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (toolId === 'image-compressor') return <ImageCompressorTool />;
  if (toolId === 'image-converter') return <ImageConverterTool />;
  if (toolId === 'image-base64') return <ImageBase64Tool onCopy={copyText} copied={copied} />;
  if (toolId === 'svg-to-png') return <SvgToPngTool />;
  if (toolId === 'favicon-generator') return <FaviconGeneratorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'palette-extractor') return <PaletteExtractorTool onCopy={copyText} />;
  if (toolId === 'watermark-tool') return <WatermarkTool />;
  if (toolId === 'color-picker') return <ColorPickerTool onCopy={copyText} />;
  if (toolId === 'image-editor-pro') return <ImageEditorProTool />;
  if (toolId === 'bg-color-remover') return <BgColorRemoverTool />;

  return <div className="text-neutral-500">Image tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Image Compressor & Resizer
// -------------------------------------------------------------
const ImageCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(75);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/webp');
  const [maxWidth, setMaxWidth] = useState(1920);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setOriginalSize(f.size);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const processImage = () => {
    if (!preview) return;
    const img = new Image();
    img.src = preview;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedSize(blob.size);
              const resultUrl = URL.createObjectURL(blob);
              setCompressedUrl(resultUrl);
            }
          },
          format,
          quality / 100
        );
      }
    };
  };

  useEffect(() => {
    if (preview) {
      processImage();
    }
  }, [preview, quality, format, maxWidth]);

  const savings = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {!preview ? (
        <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
          <Upload className="w-8 h-8 text-neutral-400 mb-2" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Click to upload image or drag and drop</span>
          <span className="text-xs text-neutral-400 mt-1">JPEG, PNG, WEBP up to 25MB (Processed 100% locally)</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <div>
              <div className="flex justify-between text-xs font-semibold text-neutral-500 uppercase mb-1">
                <span>Quality ({quality}%)</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full accent-black dark:accent-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full p-1.5 border border-neutral-200 dark:border-neutral-800 rounded text-xs bg-white dark:bg-neutral-950"
              >
                <option value="image/webp">WEBP (Best compression)</option>
                <option value="image/jpeg">JPEG (Standard)</option>
                <option value="image/png">PNG (Lossless)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Max Width (px)</label>
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1920)}
                className="w-full p-1.5 border border-neutral-200 dark:border-neutral-800 rounded text-xs bg-white dark:bg-neutral-950"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg">
            <div className="flex items-center gap-6 text-xs">
              <div>Original: <strong>{(originalSize / 1024).toFixed(1)} KB</strong></div>
              <div>Compressed: <strong>{(compressedSize / 1024).toFixed(1)} KB</strong></div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                Saved: {savings}%
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900">
                Change Photo
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
              {compressedUrl && (
                <a
                  href={compressedUrl}
                  download={`compressed-image.${format.split('/')[1]}`}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#111111] text-white dark:bg-white dark:text-black rounded text-xs font-medium hover:opacity-90"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center min-h-[220px]">
              <img src={preview} alt="Original" className="max-h-64 object-contain rounded" />
            </div>
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-2 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center min-h-[220px]">
              {compressedUrl && <img src={compressedUrl} alt="Compressed" className="max-h-64 object-contain rounded" />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Image Format Converter
// -------------------------------------------------------------
const ImageConverterTool: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  useEffect(() => {
    if (!preview) return;
    const img = new Image();
    img.src = preview;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const mime = `image/${targetFormat}`;
        canvas.toBlob((blob) => {
          if (blob) {
            setConvertedUrl(URL.createObjectURL(blob));
          }
        }, mime);
      }
    };
  }, [preview, targetFormat]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Select Image
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-500 uppercase">Convert to:</span>
          {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setTargetFormat(fmt)}
              className={`px-3 py-1.5 text-xs font-medium rounded uppercase ${
                targetFormat === fmt
                  ? 'bg-[#111111] text-white dark:bg-white dark:text-black'
                  : 'border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {convertedUrl && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center">
          <img src={convertedUrl} alt="Converted" className="max-h-72 object-contain rounded mb-4" />
          <a
            href={convertedUrl}
            download={`converted-image.${targetFormat}`}
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download Converted .{targetFormat.toUpperCase()}
          </a>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Image to Base64 & Data URI
// -------------------------------------------------------------
const ImageBase64Tool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [base64, setBase64] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = () => {
        setBase64(String(reader.result));
      };
      reader.readAsDataURL(f);
    }
  };

  const cssSnippet = `background-image: url('${base64}');`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Image to Base64
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
        {base64 && (
          <button
            onClick={() => setBase64('')}
            className="text-xs text-red-500 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
          Base64 Data URI
        </label>
        <textarea
          value={base64}
          onChange={(e) => setBase64(e.target.value)}
          placeholder="Paste Base64 data URI (data:image/...) or upload above..."
          rows={8}
          className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
        />
      </div>

      {base64 && (
        <div className="space-y-4">
          <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500 uppercase mb-1">
              <span>CSS Background Snippet</span>
              <button onClick={() => onCopy(cssSnippet)} className="text-neutral-500 hover:text-black dark:hover:text-white">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <pre className="font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">{cssSnippet}</pre>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onCopy(base64)}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              Copy Base64 String
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: SVG to PNG Rasterizer
// -------------------------------------------------------------
const SvgToPngTool: React.FC = () => {
  const [svgCode, setSvgCode] = useState('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">\n  <circle cx="50" cy="50" r="45" fill="#111111"/>\n  <polygon points="50,20 62,68 38,68" fill="#FFFFFF"/>\n</svg>');
  const [scale, setScale] = useState(2);
  const [pngUrl, setPngUrl] = useState<string | null>(null);

  const rasterize = () => {
    try {
      const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = (img.width || 200) * scale;
        canvas.height = (img.height || 200) * scale;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((b) => {
            if (b) {
              setPngUrl(URL.createObjectURL(b));
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch {
      // invalid svg
    }
  };

  useEffect(() => {
    rasterize();
  }, [svgCode, scale]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1.5">SVG Code</label>
          <textarea
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            rows={10}
            className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 font-mono text-xs"
          />
        </div>
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase mb-3">Rendered PNG Preview</div>
          {pngUrl ? (
            <img src={pngUrl} alt="Rasterized" className="max-h-48 object-contain rounded border border-neutral-200 dark:border-neutral-800 bg-white" />
          ) : (
            <div className="text-xs text-neutral-400">Loading preview...</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-neutral-500 uppercase">Scale Factor:</span>
          {[1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => setScale(s)}
              className={`px-3 py-1.5 rounded font-semibold ${
                scale === s ? 'bg-[#111111] text-white dark:bg-white dark:text-black' : 'border border-neutral-200 dark:border-neutral-800'
              }`}
            >
              {s}x ({s * 100}%)
            </button>
          ))}
        </div>

        {pngUrl && (
          <a
            href={pngUrl}
            download="vector-raster.png"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium ml-auto"
          >
            <Download className="w-4 h-4" />
            Download PNG
          </a>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Favicon & Web Icon Pack Generator
// -------------------------------------------------------------
const FaviconGeneratorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [icons, setIcons] = useState<{ size: number; url: string }[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setSourceImage(url);
    }
  };

  useEffect(() => {
    if (!sourceImage) return;
    const sizes = [16, 32, 48, 180];
    const generated: { size: number; url: string }[] = [];

    const img = new Image();
    img.src = sourceImage;
    img.onload = () => {
      sizes.forEach((s) => {
        const canvas = document.createElement('canvas');
        canvas.width = s;
        canvas.height = s;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, s, s);
          generated.push({ size: s, url: canvas.toDataURL('image/png') });
        }
      });
      setIcons(generated);
    };
  }, [sourceImage]);

  const htmlHeadTags = `<!-- Favicon & Touch Icons -->
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;

  return (
    <div className="space-y-6">
      <label className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 inline-flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Upload Icon Source Photo
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>

      {icons.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {icons.map((ic) => (
              <div key={ic.size} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center">
                <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">{ic.size} × {ic.size}</div>
                <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded mb-3">
                  <img src={ic.url} alt={`${ic.size}px icon`} style={{ width: ic.size > 64 ? 56 : ic.size, height: ic.size > 64 ? 56 : ic.size }} />
                </div>
                <a
                  href={ic.url}
                  download={`favicon-${ic.size}x${ic.size}.png`}
                  className="text-xs px-2.5 py-1 border border-neutral-200 dark:border-neutral-800 rounded hover:bg-white dark:hover:bg-neutral-800 flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Download
                </a>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500 uppercase mb-1">
              <span>HTML Header Links</span>
              <button onClick={() => onCopy(htmlHeadTags)} className="text-neutral-500 hover:text-black dark:hover:text-white">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <pre className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
              {htmlHeadTags}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Image Color Palette Extractor
// -------------------------------------------------------------
const PaletteExtractorTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const [colors, setColors] = useState<string[]>(['#111111', '#4B5563', '#9CA3AF', '#E5E7EB', '#FFFFFF']);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImageSrc(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 60;
      canvas.height = 60;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 60, 60);
        const data = ctx.getImageData(0, 0, 60, 60).data;
        const colorCounts: Record<string, number> = {};

        for (let i = 0; i < data.length; i += 16) {
          const r = Math.round(data[i] / 32) * 32;
          const g = Math.round(data[i + 1] / 32) * 32;
          const b = Math.round(data[i + 2] / 32) * 32;
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sorted = Object.entries(colorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([c]) => c);

        if (sorted.length > 0) setColors(sorted);
      }
    };
  };

  return (
    <div className="space-y-6">
      <label className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 inline-flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Upload Photo to Extract Palette
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        {colors.map((c) => (
          <div key={c} className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden bg-white dark:bg-neutral-950">
            <div className="h-20 w-full" style={{ backgroundColor: c }} />
            <div className="p-2 flex items-center justify-between text-xs font-mono">
              <span>{c}</span>
              <button onClick={() => onCopy(c)} className="text-neutral-400 hover:text-black dark:hover:text-white">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Image Watermark Tool
// -------------------------------------------------------------
const WatermarkTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [text, setText] = useState('© Asbily Platforms');
  const [opacity, setOpacity] = useState(60);
  const [fontSize, setFontSize] = useState(32);
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left' | 'center'>('bottom-right');
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setImageSrc(URL.createObjectURL(f));
  };

  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);

        ctx.globalAlpha = opacity / 100;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${fontSize}px sans-serif`;

        let x = canvas.width - ctx.measureText(text).width - 30;
        let y = canvas.height - 30;

        if (position === 'center') {
          x = (canvas.width - ctx.measureText(text).width) / 2;
          y = canvas.height / 2;
        } else if (position === 'bottom-left') {
          x = 30;
          y = canvas.height - 30;
        }

        // Drop shadow for contrast
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.fillText(text, x, y);

        canvas.toBlob((blob) => {
          if (blob) setWatermarkedUrl(URL.createObjectURL(blob));
        }, 'image/png');
      }
    };
  }, [imageSrc, text, opacity, fontSize, position]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 inline-flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Select Base Image
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Watermark Text</label>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full p-1.5 border border-neutral-200 dark:border-neutral-800 rounded text-xs bg-white dark:bg-neutral-950" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Position</label>
          <select value={position} onChange={(e) => setPosition(e.target.value as any)} className="w-full p-1.5 border border-neutral-200 dark:border-neutral-800 rounded text-xs bg-white dark:bg-neutral-950">
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-left">Bottom Left</option>
            <option value="center">Center</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Opacity ({opacity}%)</label>
          <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full accent-black dark:accent-white" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Font Size ({fontSize}px)</label>
          <input type="range" min={14} max={80} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-black dark:accent-white" />
        </div>
      </div>

      {watermarkedUrl && (
        <div className="flex flex-col items-center">
          <img src={watermarkedUrl} alt="Watermarked" className="max-h-80 object-contain rounded border border-neutral-200 dark:border-neutral-800 mb-4" />
          <a
            href={watermarkedUrl}
            download="watermarked-image.png"
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Download Watermarked Image
          </a>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Component: Color Picker & WCAG Contrast Checker
// -------------------------------------------------------------
const ColorPickerTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const [textColor, setTextColor] = useState('#111111');
  const [bgColor, setBgColor] = useState('#FFFFFF');

  const getLuminance = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  const contrast = useMemo(() => {
    try {
      const l1 = getLuminance(textColor);
      const l2 = getLuminance(bgColor);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return parseFloat(ratio.toFixed(2));
    } catch {
      return 1;
    }
  }, [textColor, bgColor]);

  const passesAA = contrast >= 4.5;
  const passesAAA = contrast >= 7.0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Foreground (Text) Color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-12 h-10 border rounded cursor-pointer" />
            <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-sm uppercase" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Background Color</label>
          <div className="flex items-center gap-3">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 border rounded cursor-pointer" />
            <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-sm uppercase" />
          </div>
        </div>
      </div>

      <div className="p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 transition" style={{ backgroundColor: bgColor, color: textColor }}>
        <h3 className="text-xl font-bold mb-2">Sample Typography Heading</h3>
        <p className="text-sm leading-relaxed">
          The quick brown fox jumps over the lazy dog. Testing readable contrast ratio for inclusive accessibility standards.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">Contrast Ratio</div>
          <div className="text-2xl font-bold font-mono mt-1">{contrast} : 1</div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">WCAG AA (Normal)</div>
          <div className={`text-sm font-bold mt-2 ${passesAA ? 'text-emerald-600' : 'text-red-500'}`}>
            {passesAA ? 'PASSED (≥ 4.5)' : 'FAILED'}
          </div>
        </div>
        <div className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-center">
          <div className="text-xs font-semibold text-neutral-500 uppercase">WCAG AAA (Enhanced)</div>
          <div className={`text-sm font-bold mt-2 ${passesAAA ? 'text-emerald-600' : 'text-amber-500'}`}>
            {passesAAA ? 'PASSED (≥ 7.0)' : 'FAILED (< 7.0)'}
          </div>
        </div>
      </div>
    </div>
  );
};
