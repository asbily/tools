import React, { useState } from 'react';
import JSZip from 'jszip';
import { Upload, Download, Archive, FileText, Trash2, FolderOpen, Plus } from 'lucide-react';

interface ExtractedEntry {
  name: string;
  size: number;
  dir: boolean;
  entry: JSZip.JSZipObject;
}

export const ZipArchiveTool: React.FC = () => {
  const [mode, setMode] = useState<'create' | 'extract'>('create');

  // Create ZIP state
  const [filesToZip, setFilesToZip] = useState<File[]>([]);
  const [zipName, setZipName] = useState('asbily-bundle.zip');
  const [compressionLevel, setCompressionLevel] = useState(6);
  const [creating, setCreating] = useState(false);

  // Extract ZIP state
  const [archiveName, setArchiveName] = useState('');
  const [entries, setEntries] = useState<ExtractedEntry[]>([]);
  const [extractError, setExtractError] = useState('');

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setFilesToZip((prev) => [...prev, ...picked]);
  };

  const removeQueuedFile = (idx: number) => {
    setFilesToZip((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalInputBytes = filesToZip.reduce((acc, f) => acc + f.size, 0);

  const buildAndDownloadZip = async () => {
    if (filesToZip.length === 0) return;
    setCreating(true);
    try {
      const zip = new JSZip();
      for (const f of filesToZip) {
        const buffer = await f.arrayBuffer();
        zip.file(f.name, buffer);
      }
      const blob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: compressionLevel },
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setCreating(false);
    }
  };

  const handleOpenZip = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExtractError('');
    setArchiveName(file.name);
    try {
      const zip = await JSZip.loadAsync(await file.arrayBuffer());
      const list: ExtractedEntry[] = [];
      zip.forEach((relativePath, zipEntry) => {
        const internal = zipEntry as unknown as { _data?: { uncompressedSize?: number } };
        list.push({
          name: relativePath,
          size: internal._data?.uncompressedSize || 0,
          dir: zipEntry.dir,
          entry: zipEntry,
        });
      });
      setEntries(list);
    } catch {
      setExtractError('Could not parse this file. Please select a valid .zip archive.');
      setEntries([]);
    }
  };

  const downloadSingleEntry = async (item: ExtractedEntry) => {
    const blob = await item.entry.async('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.name.split('/').pop() || 'extracted-file';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="inline-flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => setMode('create')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            mode === 'create'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Create ZIP Archive
        </button>
        <button
          type="button"
          onClick={() => setMode('extract')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
            mode === 'extract'
              ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
              : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Inspect & Extract ZIP
        </button>
      </div>

      {mode === 'create' ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
                Output Archive Name
              </label>
              <input
                type="text"
                value={zipName}
                onChange={(e) => setZipName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">
                Compression Level ({compressionLevel})
              </label>
              <input
                type="range"
                min={1}
                max={9}
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(Number(e.target.value))}
                className="w-full accent-indigo-600 mt-2"
              />
            </div>
          </div>

          <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition">
            <Plus className="w-7 h-7 text-indigo-600 mb-2" />
            <span className="text-sm font-semibold">Add files to pack into ZIP</span>
            <span className="text-xs text-neutral-400 mt-1">Select documents, images, JSON, or folders locally</span>
            <input type="file" multiple onChange={handleAddFiles} className="hidden" />
          </label>

          {filesToZip.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>
                  {filesToZip.length} {filesToZip.length === 1 ? 'file' : 'files'} queued · Total {(totalInputBytes / 1024).toFixed(1)} KB
                </span>
                <button
                  type="button"
                  onClick={() => setFilesToZip([])}
                  className="text-rose-500 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                {filesToZip.map((f, idx) => (
                  <div key={`${f.name}-${idx}`} className="flex items-center justify-between px-4 py-2.5 text-xs bg-white dark:bg-neutral-950">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                      <span className="truncate font-medium">{f.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono tabular-nums text-neutral-400">
                        {(f.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQueuedFile(idx)}
                        className="text-neutral-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={buildAndDownloadZip}
                disabled={creating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <Archive className="w-4 h-4" />
                <span>{creating ? 'Compressing ZIP...' : 'Compress & Download .ZIP'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition">
            <FolderOpen className="w-7 h-7 text-indigo-600 mb-2" />
            <span className="text-sm font-semibold">{archiveName ? `Loaded: ${archiveName}` : 'Select a .ZIP file to inspect'}</span>
            <span className="text-xs text-neutral-400 mt-1">100% browser-based extraction</span>
            <input type="file" accept=".zip,application/zip" onChange={handleOpenZip} className="hidden" />
          </label>

          {extractError && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
              {extractError}
            </div>
          )}

          {entries.length > 0 && (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
              {entries.map((item) => (
                <div key={item.name} className="flex items-center justify-between px-4 py-2.5 text-xs bg-white dark:bg-neutral-950">
                  <div className="min-w-0 pr-3">
                    <div className="font-mono truncate">{item.name}</div>
                    {!item.dir && (
                      <div className="text-[11px] text-neutral-400 tabular-nums">
                        {(item.size / 1024).toFixed(1)} KB uncompressed
                      </div>
                    )}
                  </div>
                  {!item.dir && (
                    <button
                      type="button"
                      onClick={() => downloadSingleEntry(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-medium shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Extract</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
