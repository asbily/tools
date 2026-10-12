import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Mic,
  Monitor,
  HardDrive,
  Copy,
  Check,
  Play,
  Pause,
  Square,
  Trash2,
  RefreshCw,
  Download,
  Activity,
  Cpu,
  Wifi,
  Battery,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  Globe
} from 'lucide-react';

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
// Component: Premium Text-to-Speech (TTS) Voice Studio
// -------------------------------------------------------------
const TextToSpeechTool: React.FC = () => {
  const [text, setText] = useState(
    'Welcome to Asbily Free Tools! Experience fast, private, and client-side online utilities built for maximum productivity.'
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) {
        // Prefer natural or default voice
        const def = v.find((voice) => voice.default) || v[0];
        setSelectedVoice(def.name);
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !text.trim()) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const chosen = voices.find((v) => v.name === selectedVoice);
    if (chosen) utter.voice = chosen;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = volume;

    utter.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utter.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const setPresetText = (preset: string) => {
    handleStop();
    setText(preset);
  };

  return (
    <div className="space-y-8">
      {/* Preset Phrases */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Presets:</span>
        <button
          onClick={() => setPresetText('Welcome to Asbily Free Tools! All calculations and tools run 100% inside your browser.')}
          className="px-2.5 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition"
        >
          English Welcome
        </button>
        <button
          onClick={() => setPresetText('আসসালামু আলাইকুম! আসবিলি ফ্রি টুলস এ আপনাকে স্বাগতম।')}
          className="px-2.5 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition"
        >
          বাংলা অভিবাদন
        </button>
        <button
          onClick={() => setPresetText('The quick brown fox jumps over the lazy dog. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.')}
          className="px-2.5 py-1 rounded-lg text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition"
        >
          Pronunciation Test
        </button>
      </div>

      {/* Main Text Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Script / Text to Speak
          </label>
          <div className="text-xs text-neutral-400 font-mono">
            {text.trim() ? text.trim().split(/\s+/).length : 0} words · {text.length} chars
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Type or paste the speech text here..."
          className="w-full p-4 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-950 text-sm leading-relaxed focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none"
        />
      </div>

      {/* Voice Selection & Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40">
        <div className="lg:col-span-1">
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Voice Actor / Locale
          </label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs bg-white dark:bg-neutral-950 font-medium"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            <span>Speed (Rate)</span>
            <span className="font-mono text-neutral-500">{rate}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full accent-neutral-900 dark:accent-white"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            <span>Pitch</span>
            <span className="font-mono text-neutral-500">{pitch}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.8}
            step={0.1}
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full accent-neutral-900 dark:accent-white"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            <span>Volume</span>
            <span className="font-mono text-neutral-500">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-neutral-900 dark:accent-white"
          />
        </div>
      </div>

      {/* Player Controller & Visualizer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800/90 bg-white dark:bg-[#0E0E10] shadow-sm">
        {/* Animated Soundwave */}
        <div className="flex items-center gap-1.5 h-8">
          {[40, 75, 55, 95, 30, 85, 60, 90, 45, 80, 50, 70].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                isPlaying
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-neutral-200 dark:bg-neutral-800'
              }`}
              style={{
                height: isPlaying ? `${Math.max(12, (h * (i % 2 === 0 ? 0.9 : 1.2)) % 32)}px` : '6px',
                animationDelay: `${i * 70}ms`
              }}
            />
          ))}
          <span className="text-xs font-semibold text-neutral-400 ml-2">
            {isPlaying ? 'Speaking...' : isPaused ? 'Paused' : 'Ready'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={handleSpeak}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume Speech' : 'Play Speech'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleStop}
            disabled={!isPlaying && !isPaused}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition disabled:opacity-40 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Real Live Speech-to-Text (Continuous Multi-language)
// -------------------------------------------------------------
const SpeechToTextTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [lang, setLang] = useState('en-US');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Your current browser does not support the Web Speech Recognition API. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event: any) => {
      let interimStr = '';
      let finalStr = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalStr += event.results[i][0].transcript + ' ';
        } else {
          interimStr += event.results[i][0].transcript;
        }
      }

      if (finalStr) {
        setTranscript((prev) => prev + finalStr);
      }
      setInterim(interimStr);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      if (event.error !== 'no-speech') {
        setError(`Microphone error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterim('');
    };

    recognitionRef.current = recognition;
  }, [lang]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    setError(null);

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = lang;
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        setError(err.message || 'Could not start microphone');
      }
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterim('');
  };

  const downloadText = () => {
    const fullText = (transcript + ' ' + interim).trim();
    if (!fullText) return;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asbily-speech-transcript.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const fullText = (transcript + (interim ? ' ' + interim : '')).trim();

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-neutral-500 uppercase">Input Language:</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            disabled={isListening}
            className="p-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs bg-white dark:bg-neutral-950 font-medium"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="bn-BD">বাংলা (বাংলাদেশ)</option>
            <option value="bn-IN">বাংলা (ভারত)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="es-ES">Español (Spanish)</option>
            <option value="ar-SA">العربية (Arabic)</option>
            <option value="fr-FR">Français (French)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleListening}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-[#111111] hover:bg-black text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-black'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isListening ? 'Stop Recording' : 'Start Speech to Text'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Transcript Display Window */}
      <div className="relative border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 bg-white dark:bg-[#0E0E10] min-h-[220px] flex flex-col justify-between shadow-sm">
        <div className="space-y-2">
          {fullText ? (
            <div className="text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed font-sans select-all whitespace-pre-wrap">
              <span>{transcript}</span>
              {interim && <span className="text-neutral-400 italic"> {interim}</span>}
            </div>
          ) : (
            <div className="text-neutral-400 text-xs italic flex items-center gap-2 py-8 justify-center">
              <Mic className="w-4 h-4 opacity-40" />
              <span>Click 'Start Speech to Text' and speak clearly into your microphone...</span>
            </div>
          )}
        </div>

        {/* Footer Stats & Action Buttons */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="font-mono text-neutral-400">
            {fullText ? fullText.split(/\s+/).length : 0} words · {fullText.length} characters
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCopy(fullText)}
              disabled={!fullText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={downloadText}
              disabled={!fullText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-40 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>

            <button
              onClick={clearTranscript}
              disabled={!fullText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-neutral-400 hover:text-red-500 disabled:opacity-30 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Deep Hardware & Browser Diagnostics Inspector
// -------------------------------------------------------------
const DeviceInspectorTool: React.FC<{ onCopy: (t: string) => void; copied: boolean }> = ({ onCopy, copied }) => {
  const [battery, setBattery] = useState<{ level: number; charging: boolean } | null>(null);
  const [network, setNetwork] = useState<{ type: string; downlink: number; rtt: number } | null>(null);
  const [gpu, setGpu] = useState<string>('Detecting...');

  useEffect(() => {
    // Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((b: any) => {
        setBattery({
          level: Math.round(b.level * 100),
          charging: b.charging,
        });
        b.onlevelchange = () => setBattery({ level: Math.round(b.level * 100), charging: b.charging });
        b.onchargingchange = () => setBattery({ level: Math.round(b.level * 100), charging: b.charging });
      }).catch(() => {});
    }

    // Network API
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      setNetwork({
        type: conn.effectiveType || 'Unknown',
        downlink: conn.downlink || 0,
        rtt: conn.rtt || 0,
      });
    }

    // WebGL GPU Renderer Detection
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          setGpu(renderer || 'Standard WebGL Hardware');
        } else {
          setGpu('WebGL Supported (Renderer Masked)');
        }
      } else {
        setGpu('WebGL Not Supported');
      }
    } catch {
      setGpu('Hardware Detection Restricted');
    }
  }, []);

  const specs = [
    { label: 'Screen Resolution', value: `${window.screen.width} × ${window.screen.height} px`, icon: Monitor },
    { label: 'Device Pixel Ratio (DPR)', value: `${window.devicePixelRatio}x Retina / HiDPI`, icon: Layers },
    { label: 'Viewport Inner Size', value: `${window.innerWidth} × ${window.innerHeight} px`, icon: Monitor },
    { label: 'Color Depth', value: `${window.screen.colorDepth}-bit High Color`, icon: Sparkles },
    { label: 'CPU Logical Cores', value: `${navigator.hardwareConcurrency || 'Unknown'} Cores`, icon: Cpu },
    { label: 'Device RAM (Approx)', value: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB RAM` : 'Protected / Unknown', icon: HardDrive },
    { label: 'GPU Graphics Card', value: gpu, icon: Activity },
    { label: 'Network Connection', value: network ? `${network.type.toUpperCase()} (~${network.downlink} Mbps, ${network.rtt}ms RTT)` : (navigator.onLine ? 'Online' : 'Offline'), icon: Wifi },
    { label: 'Battery Status', value: battery ? `${battery.level}% (${battery.charging ? 'Charging ⚡' : 'On Battery'})` : 'API Unavailable in Browser', icon: Battery },
    { label: 'Operating System & Platform', value: navigator.platform || 'Unknown OS', icon: Globe },
    { label: 'User Agent Language', value: navigator.language || 'en', icon: Info },
    { label: 'Max Touch Points', value: `${navigator.maxTouchPoints || 0} Touch Points`, icon: Monitor },
  ];

  const fullReport = specs.map((s) => `${s.label}: ${s.value}`).join('\n');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-neutral-500">
          Hardware and environment details queried strictly via client-side Web APIs without any tracker scripts.
        </div>
        <button
          onClick={() => onCopy(fullReport)}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Specs' : 'Copy System Report'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </div>
              <div className="text-sm font-semibold font-mono text-neutral-900 dark:text-neutral-100 break-words">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Storage & Cache Quota Inspector
// -------------------------------------------------------------
const StorageViewerTool: React.FC<{ onCopy: (t: string) => void }> = ({ onCopy }) => {
  const [estimate, setEstimate] = useState<{ usedMb: number; quotaMb: number; percent: number } | null>(null);
  const [localItems, setLocalItems] = useState<{ key: string; sizeKb: number; value: string }[]>([]);

  const loadStorage = () => {
    // Storage quota estimate
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then((est) => {
        const used = (est.usage || 0) / (1024 * 1024);
        const quota = (est.quota || 0) / (1024 * 1024);
        const pct = quota > 0 ? (used / quota) * 100 : 0;
        setEstimate({
          usedMb: parseFloat(used.toFixed(2)),
          quotaMb: parseFloat(quota.toFixed(0)),
          percent: parseFloat(pct.toFixed(2)),
        });
      });
    }

    // LocalStorage inventory
    const items: { key: string; sizeKb: number; value: string }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) {
        const val = localStorage.getItem(k) || '';
        const size = (val.length * 2) / 1024; // approx bytes in UTF-16
        items.push({
          key: k,
          sizeKb: parseFloat(size.toFixed(2)),
          value: val.length > 80 ? val.substring(0, 80) + '...' : val,
        });
      }
    }
    setLocalItems(items);
  };

  useEffect(() => {
    loadStorage();
  }, []);

  const deleteKey = (k: string) => {
    localStorage.removeItem(k);
    loadStorage();
  };

  const clearAllLocal = () => {
    if (confirm('Clear all localStorage items stored on this domain?')) {
      localStorage.clear();
      loadStorage();
    }
  };

  return (
    <div className="space-y-8">
      {/* Storage Estimate Quota Bar */}
      {estimate && (
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0E0E10] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
            <span>Browser Storage Quota</span>
            <span className="font-mono">{estimate.usedMb} MB used of {estimate.quotaMb} MB (~{estimate.percent}%)</span>
          </div>

          <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, Math.min(100, estimate.percent))}%` }}
            />
          </div>

          <div className="text-[11px] text-neutral-400">
            Calculated via W3C StorageManager API. Includes IndexedDB, CacheStorage, and Web Worker allocations.
          </div>
        </div>
      )}

      {/* LocalStorage Items Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            LocalStorage Items ({localItems.length})
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={loadStorage}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            {localItems.length > 0 && (
              <button
                onClick={clearAllLocal}
                className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {localItems.length > 0 ? (
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0E0E10]">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold uppercase">
                <tr>
                  <th className="p-3">Key Name</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Value Preview</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900 font-mono">
                {localItems.map((item) => (
                  <tr key={item.key} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50">
                    <td className="p-3 font-semibold text-neutral-800 dark:text-neutral-200">{item.key}</td>
                    <td className="p-3 text-neutral-400">{item.sizeKb} KB</td>
                    <td className="p-3 text-neutral-500 truncate max-w-xs">{item.value}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteKey(item.key)}
                        className="p-1 text-neutral-400 hover:text-red-500 transition"
                        title="Delete key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
            No localStorage entries found for this origin.
          </div>
        )}
      </div>
    </div>
  );
};
