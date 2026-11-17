import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { Upload, Download, AlertTriangle, Copy, Check, FileText, Image as ImageIcon, Layers } from 'lucide-react';

// Bundle PDF.js worker locally for offline PWA & zero external CDN requests
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// -------------------------------------------------------------
// 1. PDF Compressor (Lossless Structure or Raster Downscale)
// -------------------------------------------------------------
export const PdfCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'lossless' | 'raster'>('raster');
  const [jpegQuality, setJpegQuality] = useState(68);
  const [renderScale, setRenderScale] = useState(1.25);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleCompress = async (selected?: File) => {
    const target = selected || file;
    if (!target) return;
    setProcessing(true);
    setProgress(10);
    setError(null);

    try {
      const bytes = await target.arrayBuffer();

      if (mode === 'lossless') {
        const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        srcDoc.setTitle('');
        srcDoc.setAuthor('');
        srcDoc.setSubject('');
        srcDoc.setKeywords([]);
        srcDoc.setCreator('Asbily Tools');
        srcDoc.setProducer('Asbily Tools');
        const outBytes = await srcDoc.save({ useObjectStreams: true, addDefaultPage: false });
        const blob = new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' });
        setOutputUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setOutputSize(blob.size);
        setProgress(100);
      } else {
        const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
        const pageCount = pdf.numPages;
        let doc: jsPDF | null = null;

        for (let p = 1; p <= pageCount; p++) {
          const page = await pdf.getPage(p);
          const viewport = page.getViewport({ scale: renderScale });
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.floor(viewport.width));
          canvas.height = Math.max(1, Math.floor(viewport.height));
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;

          const imgData = canvas.toDataURL('image/jpeg', jpegQuality / 100);
          const mmW = viewport.width * 0.264583;
          const mmH = viewport.height * 0.264583;
          const orient = mmW > mmH ? 'landscape' : 'portrait';

          if (!doc) {
            doc = new jsPDF({ orientation: orient, unit: 'mm', format: [mmW, mmH] });
          } else {
            doc.addPage([mmW, mmH], orient);
          }
          doc.addImage(imgData, 'JPEG', 0, 0, mmW, mmH, undefined, 'FAST');
          setProgress(Math.round((p / pageCount) * 95));
        }

        if (!doc) throw new Error('PDF contains no readable pages.');
        const blob = doc.output('blob');
        setOutputUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setOutputSize(blob.size);
        setProgress(100);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to compress PDF.');
    } finally {
      setProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    handleCompress(f);
    e.target.value = '';
  };

  const savedPercent =
    file && outputSize > 0 ? Math.round(((file.size - outputSize) / file.size) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Select PDF File</span>
          <input type="file" accept="application/pdf,.pdf" onChange={handleFileUpload} className="hidden" />
        </label>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'lossless' | 'raster')}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          <option value="raster">Strong Compression (Scan/Image Optimization)</option>
          <option value="lossless">Lossless Object Stream Optimization</option>
        </select>

        {mode === 'raster' && (
          <>
            <div className="flex items-center gap-2 text-xs">
              <span>Quality: {jpegQuality}%</span>
              <input
                type="range"
                min={35}
                max={92}
                value={jpegQuality}
                onChange={(e) => setJpegQuality(Number(e.target.value))}
                className="w-24 accent-black dark:accent-white"
              />
            </div>
            <select
              value={renderScale}
              onChange={(e) => setRenderScale(Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs"
            >
              <option value={1}>1.0x Resolution</option>
              <option value={1.25}>1.25x Balanced</option>
              <option value={1.5}>1.5x Sharp</option>
            </select>
          </>
        )}

        {file && (
          <button
            type="button"
            onClick={() => handleCompress()}
            disabled={processing}
            className="px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold hover:bg-[#FFFFFF] dark:hover:bg-white/10 cursor-pointer"
          >
            Re-Compress
          </button>
        )}
      </div>

      {processing && (
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold">
          Compressing PDF locally... {progress}%
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-black/20 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {file && outputUrl && !processing && (
        <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-sm font-bold">{file.name}</div>
            <div className="text-xs text-neutral-500">
              Original: {(file.size / 1024).toFixed(1)} KB → Compressed: {(outputSize / 1024).toFixed(1)} KB{' '}
              ({savedPercent >= 0 ? `${savedPercent}% smaller` : 'already optimized'})
            </div>
          </div>
          <a
            href={outputUrl}
            download={`compressed-${file.name}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold"
          >
            <Download className="w-4 h-4" />
            <span>Download Compressed PDF</span>
          </a>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. PDF to Image Converter (PNG / JPG + ZIP Export)
// -------------------------------------------------------------
export const PdfToImageTool: React.FC = () => {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [scale, setScale] = useState(1.5);
  const [pages, setPages] = useState<{ pageNum: number; dataUrl: string }[]>([]);
  const [fileName, setFileName] = useState('document');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setFileName(file.name.replace(/\.pdf$/i, ''));
    setLoading(true);
    setError(null);
    setPages([]);

    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const rendered: { pageNum: number; dataUrl: string }[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.floor(viewport.width));
        canvas.height = Math.max(1, Math.floor(viewport.height));
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        rendered.push({
          pageNum: i,
          dataUrl: canvas.toDataURL(mime, 0.92),
        });
      }
      setPages(rendered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render PDF pages.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAllZip = async () => {
    if (!pages.length) return;
    const zip = new JSZip();
    const ext = format === 'png' ? 'png' : 'jpg';
    for (const p of pages) {
      const base64 = p.dataUrl.split(',')[1];
      zip.file(`${fileName}-page-${p.pageNum}.${ext}`, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}-images.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Select PDF File</span>
          <input type="file" accept="application/pdf,.pdf" onChange={handleUpload} className="hidden" />
        </label>

        <select
          value={format}
          onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          <option value="png">PNG (Lossless)</option>
          <option value="jpeg">JPG (Compact)</option>
        </select>

        <select
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
        >
          <option value={1}>1x Standard</option>
          <option value={1.5}>1.5x Sharp</option>
          <option value={2}>2x High-DPI</option>
        </select>

        {pages.length > 1 && (
          <button
            type="button"
            onClick={downloadAllZip}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Download All ({pages.length}) as ZIP</span>
          </button>
        )}
      </div>

      {loading && <div className="text-xs font-medium text-neutral-500">Rendering PDF pages locally...</div>}
      {error && (
        <div className="p-3 rounded-xl border border-black/20 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {pages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((p) => (
            <div
              key={p.pageNum}
              className="p-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] space-y-2.5"
            >
              <img
                src={p.dataUrl}
                alt={`Page ${p.pageNum}`}
                className="w-full rounded-lg border border-black/10 dark:border-white/10 object-contain max-h-64"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">Page {p.pageNum}</span>
                <a
                  href={p.dataUrl}
                  download={`${fileName}-page-${p.pageNum}.${format === 'png' ? 'png' : 'jpg'}`}
                  className="inline-flex items-center gap-1 font-semibold hover:underline"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Save .{format.toUpperCase()}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 3. PDF Multi-Format Converter (PDF -> TXT/MD & TXT/CSV -> PDF)
// -------------------------------------------------------------
export const PdfConverterTool: React.FC = () => {
  const [direction, setDirection] = useState<'pdf-to-text' | 'text-to-pdf'>('pdf-to-text');
  const [extractedText, setExtractedText] = useState('');
  const [sourceName, setSourceName] = useState('document');
  const [copied, setCopied] = useState(false);
  const [draftText, setDraftText] = useState('Enter text, Markdown notes, or structured content to export as PDF.');
  const [error, setError] = useState<string | null>(null);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setSourceName(file.name.replace(/\.pdf$/i, ''));
    setError(null);

    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data }).promise;
      const pageTexts: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        const line = tc.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
        pageTexts.push(`--- Page ${i} ---\n${line}`);
      }
      setExtractedText(pageTexts.join('\n\n'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to extract text from PDF.');
    }
  };

  const downloadTxt = (ext: 'txt' | 'md') => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sourceName}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const createPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(draftText || '', 180);
    let y = 18;
    for (const l of lines) {
      if (y > 280) {
        doc.addPage();
        y = 18;
      }
      doc.text(l, 15, y);
      y += 6;
    }
    doc.save('converted-document.pdf');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDirection('pdf-to-text')}
          className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
            direction === 'pdf-to-text'
              ? 'bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] border-[#000000] dark:border-[#FFFFFF]'
              : 'border-black/15 dark:border-white/15'
          }`}
        >
          PDF to Text / Markdown
        </button>
        <button
          type="button"
          onClick={() => setDirection('text-to-pdf')}
          className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer ${
            direction === 'text-to-pdf'
              ? 'bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] border-[#000000] dark:border-[#FFFFFF]'
              : 'border-black/15 dark:border-white/15'
          }`}
        >
          Text / Notes to PDF
        </button>
      </div>

      {direction === 'pdf-to-text' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload PDF</span>
              <input type="file" accept="application/pdf,.pdf" onChange={handlePdfUpload} className="hidden" />
            </label>
            {extractedText && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(extractedText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1800);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadTxt('txt')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadTxt('md')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .MD</span>
                </button>
              </>
            )}
          </div>
          {error && <div className="text-xs p-3 rounded-xl border border-black/20">{error}</div>}
          <textarea
            readOnly
            value={extractedText}
            rows={11}
            placeholder="Upload any selectable-text PDF to extract its contents..."
            className="w-full p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] font-mono text-xs"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            rows={11}
            className="w-full p-4 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
          />
          <button
            type="button"
            onClick={createPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Convert & Download PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};
