import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import jsQR from 'jsqr';
import {
  Download,
  Upload,
  Camera,
  Wifi,
  Link,
  Mail,
  Phone,
  User,
  RefreshCw,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Sparkles,
  QrCode as QrIcon,
  Barcode as BarcodeIcon,
  Scan,
  Maximize2,
  FileText,
  MessageSquare,
  MapPin,
  Palette
} from 'lucide-react';

import { ProductPaymentQrTool } from './ProductPaymentQrTool';

interface QrToolProps {
  toolId: string;
}

export const QrBarcodeTools: React.FC<QrToolProps> = ({ toolId }) => {
  if (toolId === 'qr-generator') return <QrGeneratorTool />;
  if (toolId === 'product-payment-qr') return <ProductPaymentQrTool />;
  if (toolId === 'barcode-generator') return <BarcodeGeneratorTool />;
  if (toolId === 'qr-scanner') return <QrScannerTool />;

  return <div className="text-neutral-500">QR/Barcode tool not found.</div>;
};

// -------------------------------------------------------------
// Component: Premium Custom QR Code Generator
// -------------------------------------------------------------
const QrGeneratorTool: React.FC = () => {
  const [type, setType] = useState<'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard'>('url');
  const [url, setUrl] = useState('https://asbily.com');
  const [text, setText] = useState('Hello from Asbily Free Tools!');

  // WiFi state
  const [ssid, setSsid] = useState('Home_WiFi_5G');
  const [wifiPass, setWifiPass] = useState('SuperSecret2026');
  const [encryption, setEncryption] = useState('WPA');
  const [hidden, setHidden] = useState(false);

  // Email state
  const [emailTo, setEmailTo] = useState('contact@asbily.com');
  const [subject, setSubject] = useState('Inquiry about Tools');
  const [emailBody, setEmailBody] = useState('Hi team, I would like to learn more.');

  // Phone state
  const [phone, setPhone] = useState('+8801700000000');

  // SMS state
  const [smsPhone, setSmsPhone] = useState('+8801700000000');
  const [smsBody, setSmsBody] = useState('Hello! I sent this via Asbily QR Code.');

  // vCard state
  const [vcardName, setVcardName] = useState('Alex Morgan');
  const [vcardOrg, setVcardOrg] = useState('Tech Solutions Ltd');
  const [vcardEmail, setVcardEmail] = useState('alex@techsolutions.com');
  const [vcardPhone, setVcardPhone] = useState('+14155552671');
  const [vcardUrl, setVcardUrl] = useState('https://techsolutions.com');

  // Design state
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [ecc, setEcc] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [size, setSize] = useState<number>(600);
  const [margin, setMargin] = useState<number>(2);

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Payload computation
  const qrPayload = (() => {
    if (type === 'url') return url;
    if (type === 'text') return text;
    if (type === 'wifi') return `WIFI:T:${encryption};S:${ssid};P:${wifiPass};H:${hidden ? 'true' : 'false'};;`;
    if (type === 'email') return `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    if (type === 'phone') return `tel:${phone}`;
    if (type === 'sms') return `smsto:${smsPhone}:${smsBody}`;
    if (type === 'vcard') {
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nORG:${vcardOrg}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nURL:${vcardUrl}\nEND:VCARD`;
    }
    return url;
  })();

  useEffect(() => {
    if (!qrPayload) return;
    QRCode.toDataURL(qrPayload, {
      width: size,
      margin: margin,
      errorCorrectionLevel: ecc,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [qrPayload, fgColor, bgColor, ecc, size, margin]);

  const copyQrImage = async () => {
    if (!qrDataUrl) return;
    try {
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy payload text
      navigator.clipboard.writeText(qrPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadSvg = () => {
    if (!qrPayload) return;
    QRCode.toString(qrPayload, {
      type: 'svg',
      margin: margin,
      errorCorrectionLevel: ecc,
      color: { dark: fgColor, light: bgColor }
    }, (err, string) => {
      if (err) return console.error(err);
      const blob = new Blob([string], { type: 'image/svg+xml;charset=utf-8' });
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = `asbily-qr-${type}.svg`;
      a.click();
      URL.revokeObjectURL(dlUrl);
    });
  };

  return (
    <div className="space-y-8">
      {/* Type Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
        {[
          { id: 'url', label: 'Website URL', icon: Link },
          { id: 'text', label: 'Plain Text', icon: FileText },
          { id: 'wifi', label: 'WiFi Network', icon: Wifi },
          { id: 'email', label: 'Email', icon: Mail },
          { id: 'phone', label: 'Phone Call', icon: Phone },
          { id: 'sms', label: 'SMS Message', icon: MessageSquare },
          { id: 'vcard', label: 'Contact Card', icon: User },
        ].map((item) => {
          const Icon = item.icon;
          const active = type === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setType(item.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                active
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Content Configuration
            </h3>

            {type === 'url' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Destination URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none"
                  />
                  <Link className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                </div>
              </div>
            )}

            {type === 'text' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Text Message</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  placeholder="Enter any note, code, or information..."
                  className="w-full p-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none"
                />
              </div>
            )}

            {type === 'wifi' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={ssid}
                    onChange={(e) => setSsid(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Password</label>
                    <input
                      type="text"
                      value={wifiPass}
                      onChange={(e) => setWifiPass(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Security Type</label>
                    <select
                      value={encryption}
                      onChange={(e) => setEncryption(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                    >
                      <option value="WPA">WPA / WPA2 / WPA3 (Default)</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None (Open Network)</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600 dark:text-neutral-400 pt-1">
                  <input
                    type="checkbox"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                    className="rounded text-neutral-900"
                  />
                  <span>Hidden Network (Hidden SSID)</span>
                </label>
              </div>
            )}

            {type === 'email' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">To Email</label>
                  <input
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Pre-filled Body</label>
                  <textarea
                    rows={2}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                  />
                </div>
              </div>
            )}

            {type === 'phone' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Phone Number (with Country Code)</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full pl-9 pr-3 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-sm font-mono"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                </div>
              </div>
            )}

            {type === 'sms' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Recipient Number</label>
                  <input
                    type="tel"
                    value={smsPhone}
                    onChange={(e) => setSmsPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">SMS Message</label>
                  <textarea
                    rows={2}
                    value={smsBody}
                    onChange={(e) => setSmsBody(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                  />
                </div>
              </div>
            )}

            {type === 'vcard' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={vcardName}
                      onChange={(e) => setVcardName(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={vcardOrg}
                      onChange={(e) => setVcardOrg(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={vcardPhone}
                      onChange={(e) => setVcardPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={vcardEmail}
                      onChange={(e) => setVcardEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={vcardUrl}
                    onChange={(e) => setVcardUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm bg-white dark:bg-neutral-950"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Styling & Fine-tuning */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <Palette className="w-3.5 h-3.5" />
              <span>Design & Error Correction</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Foreground Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-24 px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-24 px-2 py-1.5 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Error Correction Level
                </label>
                <select
                  value={ecc}
                  onChange={(e) => setEcc(e.target.value as any)}
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs bg-white dark:bg-neutral-950"
                >
                  <option value="L">Level L (~7% recovery)</option>
                  <option value="M">Level M (~15% recovery)</option>
                  <option value="Q">Level Q (~25% recovery)</option>
                  <option value="H">Level H (~30% high resilience)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Margin / Quiet Zone
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs bg-white dark:bg-neutral-950"
                >
                  <option value={1}>Compact (1 module)</option>
                  <option value={2}>Standard (2 modules)</option>
                  <option value={4}>Wide (4 modules)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right QR Preview & Action Area */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full p-8 rounded-3xl border border-neutral-200/90 dark:border-neutral-800/90 bg-[#FFFFFF] dark:bg-[#090909] shadow-sm flex flex-col items-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Real-time High-Resolution Preview
            </span>

            {/* QR Card Container */}
            <div
              className="p-5 rounded-2xl shadow-inner border border-neutral-100 dark:border-neutral-800/80 mb-6 flex items-center justify-center transition-all"
              style={{ backgroundColor: bgColor }}
            >
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Generated QR Code"
                  className="w-56 h-56 object-contain rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-neutral-400 text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Content summary */}
            <div className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-200/70 dark:border-neutral-800/70 mb-6 text-left">
              <div className="text-[10px] uppercase font-bold text-neutral-400 mb-0.5">Payload Preview:</div>
              <div className="font-mono text-xs text-neutral-800 dark:text-neutral-200 truncate select-all">
                {qrPayload}
              </div>
            </div>

            {/* Download and Copy Action Buttons */}
            <div className="w-full space-y-2.5">
              <div className="grid grid-cols-2 gap-2 w-full">
                {qrDataUrl && (
                  <a
                    href={qrDataUrl}
                    download={`asbily-qr-${type}.png`}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-[#000000] hover:bg-[#090909] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] dark:text-[#000000] rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </a>
                )}

                <button
                  onClick={downloadSvg}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl text-xs font-bold transition border border-neutral-200 dark:border-neutral-800 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SVG</span>
                </button>
              </div>

              <button
                onClick={copyQrImage}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
                    <span className="text-[#000000] dark:text-[#FFFFFF] font-bold">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Copy QR / Data to Clipboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Premium Barcode Generator (Multi-Format, Custom Height/Width)
// -------------------------------------------------------------
const BarcodeGeneratorTool: React.FC = () => {
  const [val, setVal] = useState('ASBILY-2026-PRO');
  const [format, setFormat] = useState<'CODE128' | 'EAN13' | 'UPC' | 'CODE39' | 'ITF14' | 'pharmacode'>('CODE128');
  const [barWidth, setBarWidth] = useState<number>(2);
  const [barHeight, setBarHeight] = useState<number>(75);
  const [displayValue, setDisplayValue] = useState<boolean>(true);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !val.trim()) return;
    setError(null);
    try {
      JsBarcode(svgRef.current, val.trim(), {
        format,
        lineColor,
        background: bgColor,
        width: barWidth,
        height: barHeight,
        displayValue,
        fontSize: 14,
        margin: 12,
      });
    } catch (e: any) {
      setError(e.message || 'Invalid barcode input for selected format');
    }
  }, [val, format, barWidth, barHeight, displayValue, lineColor, bgColor]);

  const downloadBarcodePng = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 20;
      canvas.height = img.height + 20;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 10, 10);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `barcode-${val}-${format}.png`;
        a.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const copySvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    navigator.clipboard.writeText(svgData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Barcode Specifications
            </h3>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Barcode Value / Serial
              </label>
              <input
                type="text"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="Enter numbers or text..."
                className="w-full px-3.5 py-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 font-mono text-sm focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white outline-none"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                {format === 'EAN13' && 'Note: EAN-13 expects exactly 12 or 13 digits.'}
                {format === 'UPC' && 'Note: UPC expects 11 or 12 digits.'}
                {format === 'CODE128' && 'Supports all alphanumeric ASCII characters.'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Symbology / Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-xs font-semibold"
                >
                  <option value="CODE128">Code 128 (Universal Logistics)</option>
                  <option value="CODE39">Code 39 (Industrial & Military)</option>
                  <option value="EAN13">EAN-13 (Global Retail Products)</option>
                  <option value="UPC">UPC-A (North American Retail)</option>
                  <option value="ITF14">ITF-14 (Packaging & Shipping)</option>
                  <option value="pharmacode">Pharmacode (Pharmaceutical)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bar Width (Resolution)
                </label>
                <select
                  value={barWidth}
                  onChange={(e) => setBarWidth(Number(e.target.value))}
                  className="w-full p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-950 text-xs font-semibold"
                >
                  <option value={1}>1px (Compact)</option>
                  <option value={2}>2px (Standard)</option>
                  <option value={3}>3px (High Density)</option>
                  <option value={4}>4px (Extra Wide)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bar Height: {barHeight}px
                </label>
                <input
                  type="range"
                  min={40}
                  max={140}
                  step={5}
                  value={barHeight}
                  onChange={(e) => setBarHeight(Number(e.target.value))}
                  className="w-full accent-neutral-900 dark:accent-white"
                />
              </div>

              <div className="flex items-center pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={displayValue}
                    onChange={(e) => setDisplayValue(e.target.checked)}
                    className="rounded text-neutral-900"
                  />
                  <span>Show Human Readable Text</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Bars Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-10 h-8 rounded border p-0.5 bg-white cursor-pointer"
                  />
                  <span className="font-mono text-xs">{lineColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-8 rounded border p-0.5 bg-white cursor-pointer"
                  />
                  <span className="font-mono text-xs">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barcode Output Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full p-8 rounded-3xl border border-neutral-200/90 dark:border-neutral-800/90 bg-[#FFFFFF] dark:bg-[#090909] shadow-sm flex flex-col items-center text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Vector Barcode Preview
            </span>

            {error ? (
              <div className="w-full p-4 mb-6 rounded-xl border border-black/20 bg-[#F6F6F6] dark:bg-[#090909] dark:border-white/20 text-[#000000] dark:text-[#FFFFFF] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : (
              <div
                className="w-full p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800/80 mb-6 flex items-center justify-center overflow-x-auto shadow-inner"
                style={{ backgroundColor: bgColor }}
              >
                <svg ref={svgRef} className="max-w-full" />
              </div>
            )}

            <div className="w-full grid grid-cols-2 gap-2.5">
              <button
                onClick={downloadBarcodePng}
                disabled={!!error}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#000000] hover:bg-[#090909] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] dark:text-[#000000] rounded-xl text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>

              <button
                onClick={copySvg}
                disabled={!!error}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl text-xs font-bold transition border border-neutral-200 dark:border-neutral-800 disabled:opacity-50 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#000000] dark:text-[#FFFFFF]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SVG</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Component: Real QR Code Scanner (Live Camera + Image File Decoding via jsQR)
// -------------------------------------------------------------
const QrScannerTool: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningRef = useRef(false);

  const stopCamera = () => {
    scanningRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setScanning(false);
  };

  // Scan frame from video feed continuously
  const scanVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || !scanningRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState >= video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data) {
          setScannedResult(code.data);
          stopCamera();
          return;
        }
      }
    }
    animFrameRef.current = requestAnimationFrame(scanVideoFrame);
  };

  const startCamera = async () => {
    setCameraError(null);
    setScannedResult(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      streamRef.current = media;
      if (videoRef.current) {
        videoRef.current.srcObject = media;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }
      scanningRef.current = true;
      setScanning(true);
      animFrameRef.current = requestAnimationFrame(scanVideoFrame);
    } catch (err: any) {
      stopCamera();
      setCameraError(err.message || 'Camera permission denied or camera device unavailable');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Handle uploaded image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setCameraError(null);
    setScannedResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            setScannedResult(code.data);
          } else {
            setCameraError('No QR code detected in the selected image. Please try a clearer photo or higher resolution file.');
          }
        }
        setIsProcessingFile(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyResult = () => {
    if (!scannedResult) return;
    navigator.clipboard.writeText(scannedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrl = scannedResult && /^https?:\/\//i.test(scannedResult.trim());

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Upload or Camera Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="text-xs text-neutral-600 dark:text-neutral-400">
          Scan QR codes directly with your device webcam / phone camera or upload any image file. Runs 100% locally.
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 hover:bg-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer transition shadow-xs">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload QR Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {cameraError && (
        <div className="p-4 rounded-xl border border-black/20 bg-[#F6F6F6] dark:bg-[#090909] dark:border-white/20 text-[#000000] dark:text-[#FFFFFF] text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Camera Live Viewfinder */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-black aspect-video flex items-center justify-center shadow-lg">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${scanning ? 'block' : 'hidden'}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Viewfinder Target Reticle Overlay */}
        {scanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-[#FFFFFF]/80 rounded-2xl relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#FFFFFF] rounded-tl -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#FFFFFF] rounded-tr -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#FFFFFF] rounded-bl -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#FFFFFF] rounded-br -mb-1 -mr-1"></div>
            </div>
          </div>
        )}

        {!scanning && (
          <div className="text-center p-8 text-neutral-400 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 mx-auto flex items-center justify-center">
              <Camera className="w-6 h-6 text-neutral-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-200">Camera is paused</div>
              <div className="text-xs text-neutral-500 mt-0.5">Click below to activate your camera and scan instantly</div>
            </div>
          </div>
        )}
      </div>

      {/* Camera Controls */}
      <div className="flex justify-center gap-3">
        {!scanning ? (
          <button
            onClick={startCamera}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#000000] hover:bg-[#090909] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] dark:text-[#000000] rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Start Live Camera Scanner</span>
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#000000] hover:bg-[#090909] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] dark:text-[#000000] rounded-xl text-xs font-bold transition shadow-sm cursor-pointer border border-black/15 dark:border-white/15"
          >
            <span>Stop Camera</span>
          </button>
        )}
      </div>

      {/* Scanned Result Card */}
      {scannedResult && (
        <div className="p-6 rounded-3xl border border-black/15 dark:border-white/15 bg-[#F6F6F6] dark:bg-[#090909] space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#000000] dark:text-[#FFFFFF]">
              <Check className="w-4 h-4" />
              <span>QR Code Decoded Successfully</span>
            </div>
            {isUrl && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDEDED] dark:bg-neutral-800 text-[#000000] dark:text-[#FFFFFF] font-bold uppercase">
                Web Link
              </span>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#000000] border border-black/10 dark:border-white/10 font-mono text-sm text-[#000000] dark:text-[#FFFFFF] break-all select-all">
            {scannedResult}
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              onClick={copyResult}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#000000] hover:bg-[#090909] text-[#FFFFFF] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] dark:text-[#000000] rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Content</span>
                </>
              )}
            </button>

            {isUrl && (
              <a
                href={scannedResult}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open URL in New Tab</span>
              </a>
            )}

            <button
              onClick={() => setScannedResult(null)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition cursor-pointer ml-auto"
            >
              Clear Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
