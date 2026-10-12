import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { Download, Upload, Camera, Wifi, Link, Mail, Phone, User, RefreshCw, AlertCircle } from 'lucide-react';

interface QrToolProps {
  toolId: string;
}

export const QrBarcodeTools: React.FC<QrToolProps> = ({ toolId }) => {
  if (toolId === 'qr-generator') return <QrGeneratorTool />;
  if (toolId === 'barcode-generator') return <BarcodeGeneratorTool />;
  if (toolId === 'qr-scanner') return <QrScannerTool />;

  return <div className="text-neutral-500">QR/Barcode tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Custom QR Code Generator
// -------------------------------------------------------------
const QrGeneratorTool: React.FC = () => {
  const [type, setType] = useState<'url' | 'text' | 'wifi' | 'email' | 'phone'>('url');
  const [url, setUrl] = useState('https://asbily.com/tools');
  const [text, setText] = useState('Hello from Asbily Free Tools!');

  // WiFi state
  const [ssid, setSsid] = useState('Office_WiFi');
  const [wifiPass, setWifiPass] = useState('Secret1234');
  const [encryption, setEncryption] = useState('WPA');

  // Email state
  const [emailTo, setEmailTo] = useState('support@asbily.com');
  const [subject, setSubject] = useState('Inquiry');

  // Phone state
  const [phone, setPhone] = useState('+1234567890');

  // Style state
  const [fgColor, setFgColor] = useState('#111111');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const qrPayload = (() => {
    if (type === 'url') return url;
    if (type === 'text') return text;
    if (type === 'wifi') return `WIFI:T:${encryption};S:${ssid};P:${wifiPass};;`;
    if (type === 'email') return `mailto:${emailTo}?subject=${encodeURIComponent(subject)}`;
    if (type === 'phone') return `tel:${phone}`;
    return url;
  })();

  useEffect(() => {
    if (!qrPayload) return;
    QRCode.toDataURL(qrPayload, {
      width: 400,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((data) => setQrDataUrl(data))
      .catch((err) => console.error(err));
  }, [qrPayload, fgColor, bgColor]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(['url', 'text', 'wifi', 'email', 'phone'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize flex items-center gap-1.5 ${
              type === t ? 'bg-[#111111] text-white dark:bg-white dark:text-black' : 'border border-neutral-200 dark:border-neutral-800'
            }`}
          >
            {t === 'url' && <Link className="w-3.5 h-3.5" />}
            {t === 'wifi' && <Wifi className="w-3.5 h-3.5" />}
            {t === 'email' && <Mail className="w-3.5 h-3.5" />}
            {t === 'phone' && <Phone className="w-3.5 h-3.5" />}
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {type === 'url' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Target Website URL</label>
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white dark:bg-neutral-950 text-sm" />
            </div>
          )}

          {type === 'text' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Plain Text</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full p-2.5 border rounded-lg bg-white dark:bg-neutral-950 text-sm" />
            </div>
          )}

          {type === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Network Name (SSID)</label>
                <input type="text" value={ssid} onChange={(e) => setSsid(e.target.value)} className="w-full p-2 border rounded text-sm bg-white dark:bg-neutral-950" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Password</label>
                <input type="text" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className="w-full p-2 border rounded text-sm bg-white dark:bg-neutral-950" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Encryption</label>
                <select value={encryption} onChange={(e) => setEncryption(e.target.value)} className="w-full p-2 border rounded text-xs bg-white dark:bg-neutral-950">
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>
            </div>
          )}

          {type === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Email Recipient</label>
                <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="w-full p-2 border rounded text-sm bg-white dark:bg-neutral-950" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Subject</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2 border rounded text-sm bg-white dark:bg-neutral-950" />
              </div>
            </div>
          )}

          {type === 'phone' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 border rounded-lg bg-white dark:bg-neutral-950 text-sm" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">QR Code Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-8 border rounded" />
                <span className="font-mono text-xs">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Background Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-8 border rounded" />
                <span className="font-mono text-xs">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Preview Card */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center">
          {qrDataUrl && (
            <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 mb-4 bg-white" />
          )}
          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download="asbily-qrcode.png"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-xs font-semibold"
            >
              <Download className="w-4 h-4" /> Download PNG
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Barcode Generator
// -------------------------------------------------------------
const BarcodeGeneratorTool: React.FC = () => {
  const [val, setVal] = useState('ASBILY-2026');
  const [format, setFormat] = useState<'CODE128' | 'EAN13' | 'CODE39'>('CODE128');
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !val) return;
    try {
      JsBarcode(svgRef.current, val, {
        format,
        lineColor: '#111111',
        width: 2,
        height: 60,
        displayValue: true,
      });
    } catch (e) {
      console.error(e);
    }
  }, [val, format]);

  const downloadBarcodePng = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `barcode-${val}.png`;
        a.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Barcode Value</label>
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full p-2.5 border rounded-lg bg-white dark:bg-neutral-950 font-mono text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase mb-1">Barcode Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value as any)} className="w-full p-2.5 border rounded-lg bg-white dark:bg-neutral-950 text-xs">
            <option value="CODE128">Code 128 (Standard)</option>
            <option value="CODE39">Code 39</option>
          </select>
        </div>
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 bg-white flex flex-col items-center justify-center">
        <svg ref={svgRef} className="max-w-full" />
      </div>

      <button
        onClick={downloadBarcodePng}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-sm font-semibold"
      >
        <Download className="w-4 h-4" /> Download Barcode PNG
      </button>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Camera & Image QR Scanner
// -------------------------------------------------------------
const QrScannerTool: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
        videoRef.current.play();
      }
      setScanning(true);
    } catch (err: any) {
      setCameraError(err.message || 'Camera permission denied or camera unavailable');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-6">
      <div className="text-xs text-neutral-500">
        Direct camera scanner runs purely inside your browser using HTML5 MediaDevices. No video footage is sent to any server.
      </div>

      {cameraError && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      <div className="max-w-md mx-auto border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900 aspect-video relative flex items-center justify-center">
        {scanning ? (
          <video ref={videoRef} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-6 text-neutral-400">
            <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <div className="text-xs">Camera preview is stopped</div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-3">
        {!scanning ? (
          <button
            onClick={startCamera}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#111111] text-white dark:bg-white dark:text-black rounded-lg text-sm font-semibold"
          >
            <Camera className="w-4 h-4" /> Start Camera Scanner
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold"
          >
            Stop Scanner
          </button>
        )}
      </div>
    </div>
  );
};
