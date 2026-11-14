import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Download,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Sliders,
  Pipette,
  RefreshCw,
} from 'lucide-react';

// -------------------------------------------------------------
// 1. Photo Crop, Rotate & Filter Studio
// -------------------------------------------------------------
export const ImageEditorProTool: React.FC = () => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [aspect, setAspect] = useState<'free' | '1:1' | '16:9' | '4:5' | '9:16'>('free');
  const [cropZoom, setCropZoom] = useState(100);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [exportFormat, setExportFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    const im = new Image();
    im.onload = () => setImgObj(im);
    im.src = url;
  };

  const resetAll = () => {
    setAspect('free');
    setCropZoom(100);
    setOffsetX(0);
    setOffsetY(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
  };

  const renderToCanvas = (canvas: HTMLCanvasElement, scaleMultiplier = 1) => {
    if (!imgObj) return;
    const isRotated90 = Math.abs(rotation % 180) === 90;
    const baseW = isRotated90 ? imgObj.height : imgObj.width;
    const baseH = isRotated90 ? imgObj.width : imgObj.height;

    let targetW = baseW;
    let targetH = baseH;

    if (aspect !== 'free') {
      const [aw, ah] = aspect.split(':').map(Number);
      const targetRatio = aw / ah;
      if (baseW / baseH > targetRatio) {
        targetH = baseH;
        targetW = Math.round(baseH * targetRatio);
      } else {
        targetW = baseW;
        targetH = Math.round(baseW / targetRatio);
      }
    }

    canvas.width = Math.max(1, Math.round(targetW * scaleMultiplier));
    canvas.height = Math.max(1, Math.round(targetH * scaleMultiplier));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px)`;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    const zoomFactor = cropZoom / 100;
    const drawW = imgObj.width * scaleMultiplier * zoomFactor;
    const drawH = imgObj.height * scaleMultiplier * zoomFactor;
    const panX = (offsetX / 100) * canvas.width;
    const panY = (offsetY / 100) * canvas.height;

    ctx.drawImage(imgObj, -drawW / 2 + panX, -drawH / 2 + panY, drawW, drawH);
    ctx.restore();
  };

  useEffect(() => {
    if (!imgObj || !canvasRef.current) return;
    const previewScale = Math.min(1, 760 / Math.max(imgObj.width, imgObj.height));
    renderToCanvas(canvasRef.current, previewScale);
  }, [imgObj, aspect, cropZoom, offsetX, offsetY, rotation, flipH, flipV, brightness, contrast, saturate, grayscale, sepia, blur]);

  const handleDownload = () => {
    if (!imgObj) return;
    const outCanvas = document.createElement('canvas');
    renderToCanvas(outCanvas, 1);
    const ext = exportFormat.split('/')[1];
    outCanvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `asbily-edited.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      exportFormat,
      0.94
    );
  };

  return (
    <div className="space-y-6">
      {!imgSrc ? (
        <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
          <Upload className="w-8 h-8 text-indigo-600 mb-2" />
          <span className="text-sm font-semibold">Upload a photo to crop, rotate & enhance</span>
          <span className="text-xs text-neutral-400 mt-1">100% browser Canvas processing — PNG, JPEG, WebP</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3 text-xs">
              <div className="font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5" />
                <span>Crop & Transform</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {(['free', '1:1', '16:9', '4:5', '9:16'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspect(r)}
                    className={`py-1.5 rounded font-semibold border cursor-pointer ${
                      aspect === r
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  className="py-2 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                  title="Rotate Left 90°"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="py-2 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                  title="Rotate Right 90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFlipH((f) => !f)}
                  className={`py-2 rounded border flex items-center justify-center cursor-pointer ${
                    flipH
                      ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950'
                  }`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setFlipV((f) => !f)}
                  className={`py-2 rounded border flex items-center justify-center cursor-pointer ${
                    flipV
                      ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950'
                  }`}
                  title="Flip Vertical"
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Crop Zoom</span>
                  <span className="font-mono tabular-nums">{cropZoom}%</span>
                </div>
                <input type="range" min={100} max={250} value={cropZoom} onChange={(e) => setCropZoom(Number(e.target.value))} className="w-full accent-indigo-600" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block mb-1">Pan X</span>
                  <input type="range" min={-50} max={50} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                <div>
                  <span className="block mb-1">Pan Y</span>
                  <input type="range" min={-50} max={50} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-2.5 text-xs">
              <div className="font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Color & Light Filters</span>
              </div>
              {[
                { label: 'Brightness', val: brightness, set: setBrightness, min: 40, max: 180, unit: '%' },
                { label: 'Contrast', val: contrast, set: setContrast, min: 40, max: 180, unit: '%' },
                { label: 'Saturation', val: saturate, set: setSaturate, min: 0, max: 200, unit: '%' },
                { label: 'Grayscale', val: grayscale, set: setGrayscale, min: 0, max: 100, unit: '%' },
                { label: 'Sepia', val: sepia, set: setSepia, min: 0, max: 100, unit: '%' },
                { label: 'Blur', val: blur, set: setBlur, min: 0, max: 12, unit: 'px' },
              ].map((ctrl) => (
                <div key={ctrl.label}>
                  <div className="flex justify-between mb-0.5">
                    <span>{ctrl.label}</span>
                    <span className="font-mono tabular-nums">{ctrl.val}{ctrl.unit}</span>
                  </div>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    value={ctrl.val}
                    onChange={(e) => ctrl.set(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetAll}
                className="flex-1 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
              >
                Reset Edits
              </button>
              <label className="flex-1 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-center hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer">
                New Photo
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 checkerboard-bg flex items-center justify-center min-h-[360px] max-h-[520px] overflow-hidden">
              <canvas ref={canvasRef} className="max-w-full max-h-[460px] object-contain shadow-md rounded" />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'image/png' | 'image/jpeg' | 'image/webp')}
                className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-950 text-xs font-medium"
              >
                <option value="image/png">PNG (Lossless)</option>
                <option value="image/jpeg">JPEG (Compact)</option>
                <option value="image/webp">WebP (Modern Web)</option>
              </select>

              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Full-Resolution Image</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -------------------------------------------------------------
// 2. Background Color Remover (Click-to-Remove Transparent PNG)
// -------------------------------------------------------------
export const BgColorRemoverTool: React.FC = () => {
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  const [targetColor, setTargetColor] = useState<[number, number, number]>([255, 255, 255]);
  const [tolerance, setTolerance] = useState(34);
  const [feather, setFeather] = useState(14);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      // Sample top-left pixel automatically as initial background color
      const tmp = document.createElement('canvas');
      tmp.width = im.width;
      tmp.height = im.height;
      const tctx = tmp.getContext('2d');
      if (tctx) {
        tctx.drawImage(im, 0, 0);
        const px = tctx.getImageData(0, 0, 1, 1).data;
        setTargetColor([px[0], px[1], px[2]]);
      }
      setImgObj(im);
    };
    im.src = url;
  };

  useEffect(() => {
    if (!imgObj || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = imgObj.width;
    canvas.height = imgObj.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(imgObj, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const [tr, tg, tb] = targetColor;
    const maxDist = tolerance * 2.55;
    const featherRange = feather * 2.55;

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - tr;
      const dg = data[i + 1] - tg;
      const db = data[i + 2] - tb;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);

      if (dist <= maxDist) {
        data[i + 3] = 0;
      } else if (dist <= maxDist + featherRange && featherRange > 0) {
        const ratio = (dist - maxDist) / featherRange;
        data[i + 3] = Math.round(data[i + 3] * ratio);
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }, [imgObj, targetColor, tolerance, feather]);

  const handleCanvasPick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imgObj || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * imgObj.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * imgObj.height);

    const tmp = document.createElement('canvas');
    tmp.width = imgObj.width;
    tmp.height = imgObj.height;
    const ctx = tmp.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(imgObj, 0, 0);
    const px = ctx.getImageData(Math.max(0, x), Math.max(0, y), 1, 1).data;
    setTargetColor([px[0], px[1], px[2]]);
  };

  const downloadPng = () => {
    if (!canvasRef.current) return;
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'asbily-transparent-cutout.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const hexColor =
    '#' +
    targetColor
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

  return (
    <div className="space-y-6">
      {!imgObj ? (
        <label className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition">
          <Upload className="w-8 h-8 text-indigo-600 mb-2" />
          <span className="text-sm font-semibold">Upload logo, signature, or product photo</span>
          <span className="text-xs text-neutral-400 mt-1">Click any background color to make it 100% transparent</span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Pipette className="w-3.5 h-3.5" />
                  <span>Target Color</span>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span
                    className="w-5 h-5 rounded border border-neutral-300"
                    style={{ backgroundColor: hexColor }}
                  />
                  <span>{hexColor}</span>
                </div>
              </div>
              <p className="text-neutral-500">
                Tip: Click directly on the preview image to sample any background color you want removed.
              </p>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Color Tolerance</span>
                  <span className="font-mono tabular-nums">{tolerance}%</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={100}
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Edge Smoothness</span>
                  <span className="font-mono tabular-nums">{feather}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTargetColor([255, 255, 255])}
                className="flex-1 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
              >
                Pick White
              </button>
              <label className="flex-1 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-center hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer">
                Change Image
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 checkerboard-bg flex items-center justify-center min-h-[340px] max-h-[480px] overflow-hidden">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasPick}
                title="Click to sample background color"
                className="max-w-full max-h-[440px] object-contain cursor-crosshair"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={downloadPng}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Transparent PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
