import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, Monitor, HardDrive, Copy, Check, Play, Pause, Square, Trash2, RefreshCw } from 'lucide-react';

interface MediaToolProps {
  toolId: string;
}

export const MediaBrowserTools: React.FC<MediaToolProps> = ({ toolId }) => {
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (toolId === 'text-to-speech') return <TextToSpeechTool />;
  if (toolId === 'speech-to-text') return <SpeechToTextTool onCopy={copyText} copied={copied} />;
  if (toolId === 'device-inspector') return <DeviceInspectorTool onCopy={copyText} copied={copied} />;
  if (toolId === 'storage-viewer') return <StorageViewerTool onCopy={copyText} />;

  return <div className="text-neutral-500">Media tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Text-to-Speech (TTS) Voice Player
// -------------------------------------------------------------
const TextToSpeechTool: React.FC = () => {
  const [text, setText] = useState('Welcome to Asbily Free Tools. Experience fast, private, and client-side online utilities built for productivity.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) setSelectedVoice(v[0].name);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const chosen = voices.find((v) => v.name === selectedVoice);
    if (chosen) utter.voice = chosen;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.onend = () => setIsPlaying(false);
    utter.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1.5">Text to Read Aloud</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full p-3 border rounded-lg bg-white dark:bg-neutral-950 text-sm leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border rounded text-xs bg-white dark:bg-neutral-950"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex justify-between text-xs font-semibold text-neutral-500 uppercase mb-1">
            <span>Speed ({rate}x)</span>
          </div>
          <input type="range" min={0.5} max={2} step={0.1} value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full accent-black dark:accent-white" />
        </div>
        <div>
          <div className="flex justify-between text-xs font-semibold text-neutral-500 uppercase mb-1">
            <span>Pitch ({pitch})</span>
          </div>
          <input type="range" min={0.5} max={2} step={0.1} value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full accent-black dark:accent-white" />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={isPlaying ? handleStop : handleSpeak}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-sm font-semibold"
        >
          {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Stop Speech' : 'Play Voice'}
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Speech-to-Text Voice Dictation
// -------------------------------------------------------------
const SpeechToTextTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState('en-US');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setSupported(false);
      return;
    }
    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let current = '';
      for (let i = 0; i < event.results.length; i++) {
        current += event.results[i][0].transcript + ' ';
      }
      setTranscript(current.trim());
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!supported) {
    return (
      <div className="p-6 border border-amber-200 bg-amber-50 dark:bg-amber-950/20 rounded-xl text-xs text-amber-800 dark:text-amber-300">
        Web Speech Recognition is not supported by your current browser. Please try in Google Chrome, Microsoft Edge, or a Chromium-based browser.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select value={lang} onChange={(e) => setLang(e.target.value)} className="p-2 border rounded-lg text-xs bg-white dark:bg-neutral-950">
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="bn-BD">বাংলা (Bangladesh)</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
        </select>
        <button
          onClick={toggleListen}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
            isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-[#111111] text-white dark:bg-white dark:text-black'
          }`}
        >
          <Mic className="w-4 h-4" />
          {isListening ? 'Listening (Click to Stop)...' : 'Start Voice Dictation'}
        </button>
      </div>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Spoken words will appear here in real time..."
        rows={8}
        className="w-full p-4 border rounded-lg bg-white dark:bg-neutral-950 text-sm leading-relaxed"
      />

      <div className="flex gap-3">
        <button
          onClick={() => onCopy(transcript)}
          disabled={!transcript}
          className="inline-flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          Copy Transcript
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Device & Screen Diagnostic Inspector
// -------------------------------------------------------------
const DeviceInspectorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy }) => {
  const [info, setInfo] = useState<Record<string, string>>({});

  useEffect(() => {
    setInfo({
      'Screen Resolution': `${window.screen.width} × ${window.screen.height} px`,
      'Color Depth': `${window.screen.colorDepth}-bit`,
      'Device Pixel Ratio (DPR)': `${window.devicePixelRatio}x`,
      'Browser Viewport': `${window.innerWidth} × ${window.innerHeight} px`,
      'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      'System Language': navigator.language,
      'Online Status': navigator.onLine ? 'Connected (Online)' : 'Offline',
      'Cookies Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
      'CPU Logical Cores': `${navigator.hardwareConcurrency || 'Unknown'}`,
      'User Agent': navigator.userAgent,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(info).map(([key, val]) => (
          <div key={key} className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-3 bg-neutral-50 dark:bg-neutral-900">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">{key}</div>
            <div className="font-mono text-sm font-bold text-[#111111] dark:text-neutral-100 mt-1 break-all">{val}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => onCopy(JSON.stringify(info, null, 2))}
        className="inline-flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900"
      >
        <Copy className="w-4 h-4" /> Copy System Info JSON
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Browser Storage Explorer
// -------------------------------------------------------------
const StorageViewerTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const [storageItems, setStorageItems] = useState<{ key: string; value: string }[]>([]);

  const loadStorage = () => {
    const list: { key: string; value: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) {
        list.push({ key: k, value: localStorage.getItem(k) || '' });
      }
    }
    setStorageItems(list);
  };

  useEffect(() => {
    loadStorage();
  }, []);

  const deleteKey = (k: string) => {
    localStorage.removeItem(k);
    loadStorage();
  };

  const clearAll = () => {
    if (confirm('Clear all Asbily app local storage data?')) {
      localStorage.clear();
      loadStorage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-xs text-neutral-500">
          Inspect persistent variables stored by this web app in your browser LocalStorage ({storageItems.length} entries).
        </div>
        <div className="flex gap-2">
          <button onClick={loadStorage} className="p-1.5 border rounded hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={clearAll} className="px-3 py-1.5 border rounded text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium">
            Clear Storage
          </button>
        </div>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-800">
        {storageItems.length === 0 ? (
          <div className="p-6 text-center text-neutral-400 text-xs">No entries in browser LocalStorage.</div>
        ) : (
          storageItems.map((item) => (
            <div key={item.key} className="p-3 bg-white dark:bg-neutral-950 flex items-start justify-between gap-4">
              <div className="overflow-hidden">
                <div className="font-mono text-xs font-bold text-[#111111] dark:text-neutral-100">{item.key}</div>
                <div className="font-mono text-[11px] text-neutral-500 truncate max-w-lg mt-0.5">{item.value}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => onCopy(item.value)} className="p-1 text-neutral-400 hover:text-black dark:hover:text-white" title="Copy">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteKey(item.key)} className="p-1 text-neutral-400 hover:text-red-500" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
