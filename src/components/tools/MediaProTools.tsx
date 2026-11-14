import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Download, Play, Monitor, Video, AlertCircle } from 'lucide-react';

// -------------------------------------------------------------
// 1. Studio Voice Recorder & Live Waveform Visualizer
// -------------------------------------------------------------
export const VoiceRecorderTool: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animIdRef = useRef<number>(0);
  const timerRef = useRef<number>(0);
  const chunksRef = useRef<BlobPart[]>([]);

  const stopRecordingCleanup = () => {
    cancelAnimationFrame(animIdRef.current);
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
  };

  useEffect(() => {
    return () => stopRecordingCleanup();
  }, []);

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animIdRef.current = requestAnimationFrame(draw);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barW = (canvas.width / bufferLength) * 1.8;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barH = (dataArray[i] / 255) * canvas.height;
          ctx.fillStyle = '#4F46E5';
          ctx.fillRect(x, canvas.height - barH, barW - 1, barH);
          x += barW;
        }
      };
      draw();

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(blob));
        stopRecordingCleanup();
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      setAudioUrl(null);

      timerRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } catch {
      setError('Microphone permission denied or no audio input device detected.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500">
            <Mic className={`w-4 h-4 ${recording ? 'text-rose-500' : 'text-indigo-600'}`} />
            <span>{recording ? 'Recording Audio...' : 'Ready to Record'}</span>
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums">
            {formatDuration(seconds)}
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={680}
          height={110}
          className="w-full h-28 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800"
        />

        <div className="flex flex-wrap items-center gap-3">
          {!recording ? (
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Start Voice Recording</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Square className="w-4 h-4" />
              <span>Stop Recording</span>
            </button>
          )}
        </div>
      </div>

      {audioUrl && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <audio controls src={audioUrl} className="w-full sm:flex-1" />
          <a
            href={audioUrl}
            download={`asbily-voice-${Date.now()}.webm`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-semibold shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Audio</span>
          </a>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. Browser Screen & Mic Recorder (WebM Export)
// -------------------------------------------------------------
export const ScreenRecorderTool: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [includeMic, setIncludeMic] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamsRef = useRef<MediaStream[]>([]);
  const timerRef = useRef<number>(0);

  const stopAllStreams = () => {
    clearInterval(timerRef.current);
    streamsRef.current.forEach((s) => s.getTracks().forEach((t) => t.stop()));
    streamsRef.current = [];
  };

  useEffect(() => {
    return () => stopAllStreams();
  }, []);

  const startCapture = async () => {
    setError('');
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: true,
      });
      streamsRef.current.push(displayStream);

      const tracks: MediaStreamTrack[] = [...displayStream.getTracks()];

      if (includeMic) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamsRef.current.push(micStream);
          micStream.getAudioTracks().forEach((t) => tracks.push(t));
        } catch {
          // Proceed with screen only if mic denied
        }
      }

      const combined = new MediaStream(tracks);
      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(combined, { mimeType: 'video/webm' });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoUrl(URL.createObjectURL(blob));
        setRecording(false);
        stopAllStreams();
      };

      displayStream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== 'inactive') recorder.stop();
      };

      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      setVideoUrl(null);
      timerRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError('Screen capture was cancelled or is unsupported on this device/browser.');
    }
  };

  const stopCapture = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  };

  const fmt = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Monitor className="w-4 h-4 text-indigo-600" />
            <span>{recording ? 'Screen Recording Active' : 'Capture Screen, Window or Tab'}</span>
          </div>
          <div className="text-xl font-extrabold font-mono tabular-nums">{fmt(seconds)}</div>
        </div>

        <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={includeMic}
            disabled={recording}
            onChange={(e) => setIncludeMic(e.target.checked)}
            className="accent-indigo-600"
          />
          <span>Include Microphone Voiceover</span>
        </label>

        <div>
          {!recording ? (
            <button
              type="button"
              onClick={startCapture}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Start Screen Capture</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={stopCapture}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Square className="w-4 h-4" />
              <span>Stop & Save Video</span>
            </button>
          )}
        </div>
      </div>

      {videoUrl && (
        <div className="space-y-3">
          <video controls src={videoUrl} className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-black max-h-[420px]" />
          <div className="flex justify-end">
            <a
              href={videoUrl}
              download={`asbily-screen-${Date.now()}.webm`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Download .WebM Video</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
