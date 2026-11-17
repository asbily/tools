import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Mp3Encoder } from '@breezystack/lamejs';
import { Upload, Download, Copy, Check, RefreshCw, AlertTriangle, Music, FileText } from 'lucide-react';

interface FileConverterProps {
  toolId: string;
}

export const FileConverterTools: React.FC<FileConverterProps> = ({ toolId }) => {
  if (toolId === 'png-to-jpg') return <ImageFormatQuickTool mode="png-to-jpg" />;
  if (toolId === 'jpg-to-png') return <ImageFormatQuickTool mode="jpg-to-png" />;
  if (toolId === 'webp-converter') return <ImageFormatQuickTool mode="webp" />;
  if (toolId === 'mp4-to-mp3') return <AudioToMp3Tool mode="mp4" />;
  if (toolId === 'wav-to-mp3') return <AudioToMp3Tool mode="wav" />;
  if (toolId === 'csv-to-json-file') return <CsvJsonFileTool mode="csv-to-json" />;
  if (toolId === 'json-to-csv-file') return <CsvJsonFileTool mode="json-to-csv" />;
  if (toolId === 'txt-to-pdf-file') return <TxtToPdfFileTool />;

  return <div className="text-neutral-500">Converter tool not found.</div>;
};

// -------------------------------------------------------------
// 1. PNG <-> JPG <-> WEBP Converter
// -------------------------------------------------------------
const ImageFormatQuickTool: React.FC<{ mode: 'png-to-jpg' | 'jpg-to-png' | 'webp' }> = ({ mode }) => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number>(0);
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [targetMime, setTargetMime] = useState<'image/webp' | 'image/png' | 'image/jpeg'>(
    mode === 'png-to-jpg' ? 'image/jpeg' : mode === 'jpg-to-png' ? 'image/png' : 'image/webp'
  );
  const [converting, setConverting] = useState(false);

  const convertFile = (file: File, mime: 'image/webp' | 'image/png' | 'image/jpeg', q: number, bg: string) => {
    setConverting(true);
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setConverting(false);
          return;
        }
        if (mime === 'image/jpeg') {
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setOutputUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return URL.createObjectURL(blob);
              });
              setOutputSize(blob.size);
            }
            setConverting(false);
          },
          mime,
          mime === 'image/png' ? undefined : q / 100
        );
      };
      img.src = reader.result as string;
      setSourcePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSourceFile(file);
    convertFile(file, targetMime, quality, bgColor);
    e.target.value = '';
  };

  const ext = targetMime === 'image/jpeg' ? 'jpg' : targetMime === 'image/png' ? 'png' : 'webp';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Select Image</span>
          <input
            type="file"
            accept={mode === 'png-to-jpg' ? 'image/png,image/*' : mode === 'jpg-to-png' ? 'image/jpeg,image/*' : 'image/*'}
            onChange={handleUpload}
            className="hidden"
          />
        </label>

        {mode === 'webp' && (
          <select
            value={targetMime}
            onChange={(e) => {
              const m = e.target.value as typeof targetMime;
              setTargetMime(m);
              if (sourceFile) convertFile(sourceFile, m, quality, bgColor);
            }}
            className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs font-semibold"
          >
            <option value="image/webp">Convert to WEBP</option>
            <option value="image/png">WEBP to PNG</option>
            <option value="image/jpeg">WEBP to JPG</option>
          </select>
        )}

        {targetMime !== 'image/png' && (
          <div className="flex items-center gap-2 text-xs">
            <span>Quality: {quality}%</span>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => {
                const q = Number(e.target.value);
                setQuality(q);
                if (sourceFile) convertFile(sourceFile, targetMime, q, bgColor);
              }}
              className="w-28 accent-black dark:accent-white"
            />
          </div>
        )}

        {targetMime === 'image/jpeg' && (
          <label className="inline-flex items-center gap-2 text-xs">
            <span>Alpha Fill:</span>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => {
                const c = e.target.value;
                setBgColor(c);
                if (sourceFile) convertFile(sourceFile, targetMime, quality, c);
              }}
              className="w-7 h-7 rounded border border-black/15 cursor-pointer"
            />
          </label>
        )}
      </div>

      {sourceFile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 space-y-2">
            <div className="text-xs font-semibold text-neutral-500">
              Original: {sourceFile.name} ({(sourceFile.size / 1024).toFixed(1)} KB)
            </div>
            {sourcePreview && (
              <img src={sourcePreview} alt="Source" className="max-h-64 mx-auto rounded-lg object-contain" />
            )}
          </div>
          <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>
                Converted .{ext.toUpperCase()} ({(outputSize / 1024).toFixed(1)} KB)
              </span>
              {outputUrl && !converting && (
                <a
                  href={outputUrl}
                  download={`${sourceFile.name.replace(/\.[^.]+$/, '')}.${ext}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .{ext.toUpperCase()}</span>
                </a>
              )}
            </div>
            {outputUrl && (
              <img src={outputUrl} alt="Converted" className="max-h-64 mx-auto rounded-lg object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. MP4 / WAV to Real MP3 Encoder (Web Audio API + @breezystack/lamejs)
// -------------------------------------------------------------
function floatTo16BitPCM(input: Float32Array): Int16Array {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

const AudioToMp3Tool: React.FC<{ mode: 'mp4' | 'wav' }> = ({ mode }) => {
  const [file, setFile] = useState<File | null>(null);
  const [kbps, setKbps] = useState(192);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [mp3Url, setMp3Url] = useState<string | null>(null);
  const [mp3Size, setMp3Size] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    e.target.value = '';

    setFile(selected);
    setError(null);
    setProcessing(true);
    setProgress(5);

    try {
      const arrayBuf = await selected.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const audioBuffer = await ctx.decodeAudioData(arrayBuf);
      await ctx.close();

      setDuration(audioBuffer.duration);
      const channels = Math.min(2, audioBuffer.numberOfChannels || 1);
      const sampleRate = audioBuffer.sampleRate;
      const left = floatTo16BitPCM(audioBuffer.getChannelData(0));
      const right = channels > 1 ? floatTo16BitPCM(audioBuffer.getChannelData(1)) : undefined;

      const encoder = new Mp3Encoder(channels, sampleRate, kbps);
      const mp3Chunks: BlobPart[] = [];
      const blockSize = 1152;
      const total = left.length;

      for (let i = 0; i < total; i += blockSize) {
        const leftSlice = left.subarray(i, i + blockSize);
        const rightSlice = right ? right.subarray(i, i + blockSize) : undefined;
        const encoded = encoder.encodeBuffer(leftSlice, rightSlice);
        if (encoded.length > 0) {
          mp3Chunks.push(new Uint8Array(encoded));
        }
        if (i % (blockSize * 80) === 0) {
          setProgress(Math.min(95, Math.round((i / total) * 90) + 5));
          await new Promise((r) => setTimeout(r, 0));
        }
      }

      const tail = encoder.flush();
      if (tail.length > 0) {
        mp3Chunks.push(new Uint8Array(tail));
      }

      const blob = new Blob(mp3Chunks, { type: 'audio/mp3' });
      setMp3Url((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
      setMp3Size(blob.size);
      setProgress(100);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Could not decode audio stream (${err.message}). Verify the file contains a valid audio track supported by your browser.`
          : 'Failed to convert file to MP3.'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505]">
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>{mode === 'mp4' ? 'Select MP4 / Video File' : 'Select WAV Audio File'}</span>
          <input
            type="file"
            accept={mode === 'mp4' ? 'video/mp4,video/webm,audio/*,.mp4,.m4a' : 'audio/wav,.wav,audio/*'}
            onChange={handleConvert}
            className="hidden"
          />
        </label>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold">MP3 Bitrate:</span>
          <select
            value={kbps}
            onChange={(e) => setKbps(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-semibold"
          >
            <option value={128}>128 kbps</option>
            <option value={192}>192 kbps</option>
            <option value={256}>256 kbps</option>
            <option value={320}>320 kbps</option>
          </select>
        </div>
      </div>

      {processing && (
        <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span>Encoding MP3 locally in browser...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[#000000] dark:bg-[#FFFFFF] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl border border-black/20 dark:border-white/20 bg-[#F6F6F6] dark:bg-[#050505] text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {mp3Url && file && !processing && (
        <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#FFFFFF] dark:bg-[#090909] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-sm font-bold flex items-center gap-2">
                <Music className="w-4 h-4" />
                <span>{file.name.replace(/\.[^.]+$/, '')}.mp3</span>
              </div>
              <div className="text-xs text-neutral-500">
                Duration: {duration.toFixed(1)}s · MP3 Size: {(mp3Size / 1024).toFixed(1)} KB ({kbps} kbps)
              </div>
            </div>
            <a
              href={mp3Url}
              download={`${file.name.replace(/\.[^.]+$/, '')}.mp3`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Download MP3</span>
            </a>
          </div>
          <audio controls src={mp3Url} className="w-full" />
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 3. CSV <-> JSON Quick File Converter
// -------------------------------------------------------------
const CsvJsonFileTool: React.FC<{ mode: 'csv-to-json' | 'json-to-csv' }> = ({ mode }) => {
  const [input, setInput] = useState(
    mode === 'csv-to-json'
      ? 'name,role,city\nAmina,Designer,Dhaka\nRafi,Engineer,Chattogram'
      : '[\n  { "name": "Amina", "role": "Designer", "city": "Dhaka" },\n  { "name": "Rafi", "role": "Engineer", "city": "Chattogram" }\n]'
  );
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError(null);
    try {
      if (mode === 'csv-to-json') {
        const lines = input.trim().split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) throw new Error('Provide a header row and at least one data row.');
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const rows = lines.slice(1).map((line) => {
          const vals = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = vals[i] ?? '';
          });
          return obj;
        });
        setOutput(JSON.stringify(rows, null, 2));
      } else {
        const parsed = JSON.parse(input);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        if (!arr.length || typeof arr[0] !== 'object' || arr[0] === null) {
          throw new Error('JSON must be an object or array of objects.');
        }
        const headers = Array.from(new Set(arr.flatMap((r) => Object.keys(r as Record<string, unknown>))));
        const csvLines = [
          headers.join(','),
          ...arr.map((row) =>
            headers
              .map((h) => {
                const v = String((row as Record<string, unknown>)[h] ?? '');
                return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
              })
              .join(',')
          ),
        ];
        setOutput(csvLines.join('\n'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    }
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    f.text().then((txt) => setInput(txt));
    e.target.value = '';
  };

  const downloadOutput = () => {
    if (!output) return;
    const ext = mode === 'csv-to-json' ? 'json' : 'csv';
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer hover:bg-[#F6F6F6] dark:hover:bg-white/10">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload .{mode === 'csv-to-json' ? 'csv' : 'json'} File</span>
          <input type="file" accept={mode === 'csv-to-json' ? '.csv,text/csv' : '.json,application/json'} onChange={uploadFile} className="hidden" />
        </label>
        <button
          type="button"
          onClick={convert}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Convert Now</span>
        </button>
      </div>

      {error && <div className="p-3 rounded-xl border border-black/20 text-xs">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
          className="w-full p-3.5 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] font-mono text-xs"
        />
        <div className="space-y-2">
          <textarea
            readOnly
            value={output}
            rows={10}
            placeholder="Converted output will appear here..."
            className="w-full p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-[#F6F6F6] dark:bg-[#050505] font-mono text-xs"
          />
          {output && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={downloadOutput}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .{mode === 'csv-to-json' ? 'json' : 'csv'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. TXT to PDF Quick File Converter
// -------------------------------------------------------------
const TxtToPdfFileTool: React.FC = () => {
  const [title, setTitle] = useState('Document Export');
  const [content, setContent] = useState('Paste plain text or upload a .txt file to convert it directly into a clean A4 PDF.');
  const [fontSize, setFontSize] = useState(11);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setTitle(f.name.replace(/\.[^.]+$/, ''));
    f.text().then((t) => setContent(t));
    e.target.value = '';
  };

  const exportPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    doc.setFontSize(16);
    doc.text(title || 'Document', 15, 18);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(content || '', 180);
    let y = 28;
    for (const line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 18;
      }
      doc.text(line, 15, y);
      y += fontSize * 0.45 + 1.5;
    }
    doc.save(`${(title || 'document').toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-black/15 dark:border-white/15 text-xs font-semibold cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload .TXT File</span>
          <input type="file" accept=".txt,text/plain" onChange={handleUpload} className="hidden" />
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="PDF Title"
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs"
        />
        <select
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="px-3 py-2 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-xs"
        >
          <option value={10}>10 pt</option>
          <option value={11}>11 pt</option>
          <option value={12}>12 pt</option>
          <option value={14}>14 pt</option>
        </select>
        <button
          type="button"
          onClick={exportPdf}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#FFFFFF] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Download PDF</span>
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
        className="w-full p-4 rounded-xl border border-black/15 dark:border-white/15 bg-[#FFFFFF] dark:bg-[#090909] text-sm"
      />
    </div>
  );
};
