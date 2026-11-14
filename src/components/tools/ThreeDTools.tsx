import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Download,
  Upload,
  RotateCcw,
  Box,
  Layers,
  Sliders,
  Eye,
  Play,
  Pause,
  Image as ImageIcon,
  FileCode2,
} from 'lucide-react';

interface ThreeDToolProps {
  toolId: string;
}

export const ThreeDTools: React.FC<ThreeDToolProps> = ({ toolId }) => {
  if (toolId === '3d-mockup-studio') return <ThreeDMockupStudio />;
  if (toolId === '3d-geometry-viewer') return <ThreeDGeometryStudio />;
  return <div className="text-neutral-500">3D tool not found.</div>;
};

// -------------------------------------------------------------
// Tool 1: 3D Device & Product Mockup Studio (Real WebGL + PNG Export)
// -------------------------------------------------------------
const ThreeDMockupStudio: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState('Asbily Pro Studio');
  const [cardSubtitle, setCardSubtitle] = useState('100% Client-Side 3D Mockup');
  const [cardAccent, setCardAccent] = useState('#FFFFFF');
  const [shapeMode, setShapeMode] = useState<'slab' | 'box' | 'poster'>('slab');
  const [finish, setFinish] = useState<'glossy' | 'matte' | 'metallic'>('glossy');
  const [bgTheme, setBgTheme] = useState<'transparent' | 'light' | 'dark' | 'gray'>('dark');
  const [rotX, setRotX] = useState(-14);
  const [rotY, setRotY] = useState(24);
  const [zoom, setZoom] = useState(4.6);
  const [autoSpin, setAutoSpin] = useState(false);

  const stateRef = useRef({ rotX, rotY, zoom, autoSpin });
  useEffect(() => {
    stateRef.current = { rotX, rotY, zoom, autoSpin };
  }, [rotX, rotY, zoom, autoSpin]);

  // Generate dynamic canvas texture when no image is uploaded
  const createCanvasTexture = (title: string, subtitle: string, accent: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 1024, 640);
      grad.addColorStop(0, '#090909');
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 640);

      // Subtle architectural grid
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1024; x += 64) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 640);
        ctx.stroke();
      }
      for (let y = 0; y < 640; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Accent top bar
      ctx.fillStyle = accent;
      ctx.fillRect(64, 64, 96, 8);

      // Title & subtitle
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 64px system-ui, -apple-system, sans-serif';
      ctx.fillText(title.slice(0, 26), 64, 240);

      ctx.fillStyle = '#EDEDED';
      ctx.font = '500 30px system-ui, -apple-system, sans-serif';
      ctx.fillText(subtitle.slice(0, 44), 64, 305);

      // Card footer mockup line
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(64, 490);
      ctx.lineTo(960, 490);
      ctx.stroke();

      ctx.fillStyle = '#A3A3A3';
      ctx.font = '600 22px monospace';
      ctx.fillText('3D RENDERED IN BROWSER · ZERO SERVER UPLOAD', 64, 545);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || 640, container.clientHeight || 420);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      40,
      (container.clientWidth || 640) / (container.clientHeight || 420),
      0.1,
      100
    );
    camera.position.set(0, 0, zoom);
    cameraRef.current = camera;

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 5);
    const fill = new THREE.DirectionalLight(0xededed, 1.1);
    fill.position.set(-5, -2, 3);
    const rim = new THREE.DirectionalLight(0xffffff, 1.5);
    rim.position.set(0, 4, -5);
    scene.add(ambient, key, fill, rim);

    const group = new THREE.Group();
    scene.add(group);
    meshGroupRef.current = group;

    // Drag to rotate directly on canvas
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const canvas = renderer.domElement;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      setRotY((y) => Math.max(-180, Math.min(180, Math.round(y + dx * 0.45))));
      setRotX((x) => Math.max(-85, Math.min(85, Math.round(x + dy * 0.45))));
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);

    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (stateRef.current.autoSpin) {
        setRotY((prev) => (prev >= 180 ? -180 : prev + 0.4));
      }
      group.rotation.x = THREE.MathUtils.degToRad(stateRef.current.rotX);
      group.rotation.y = THREE.MathUtils.degToRad(stateRef.current.rotY);
      camera.position.z = stateRef.current.zoom;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      renderer.dispose();
    };
  }, []);

  // Rebuild geometry & texture whenever user changes upload, text, shape, finish, or bg
  useEffect(() => {
    const group = meshGroupRef.current;
    const scene = sceneRef.current;
    if (!group || !scene) return;

    // Background
    if (bgTheme === 'transparent') scene.background = null;
    else if (bgTheme === 'light') scene.background = new THREE.Color('#FFFFFF');
    else if (bgTheme === 'dark') scene.background = new THREE.Color('#090909');
    else if (bgTheme === 'gray') scene.background = new THREE.Color('#EDEDED');

    // Dispose old children
    while (group.children.length > 0) {
      const obj = group.children[0] as THREE.Mesh;
      group.remove(obj);
      obj.geometry?.dispose();
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material?.dispose();
    }

    const applyGeometry = (tex: THREE.Texture, aspect: number) => {
      textureRef.current?.dispose();
      textureRef.current = tex;

      const roughness = finish === 'glossy' ? 0.12 : finish === 'matte' ? 0.78 : 0.25;
      const metalness = finish === 'metallic' ? 0.75 : finish === 'glossy' ? 0.15 : 0.05;

      const edgeMat = new THREE.MeshStandardMaterial({
        color: finish === 'metallic' ? 0xd4d4d4 : 0x090909,
        roughness: 0.3,
        metalness: 0.75,
      });

      const frontMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness,
        metalness,
      });

      const clampedAspect = Math.max(0.5, Math.min(2.2, aspect || 1.6));
      const h = 1.9;
      const w = h * clampedAspect;

      if (shapeMode === 'slab') {
        const geo = new THREE.BoxGeometry(w, h, 0.14);
        const mesh = new THREE.Mesh(geo, [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, edgeMat]);
        group.add(mesh);
      } else if (shapeMode === 'box') {
        const geo = new THREE.BoxGeometry(Math.min(w, 2.2), 2.1, 1.35);
        const mesh = new THREE.Mesh(geo, [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, frontMat]);
        group.add(mesh);
      } else {
        const geo = new THREE.PlaneGeometry(w, h);
        const frontPlane = new THREE.Mesh(geo, frontMat);
        frontPlane.position.z = 0.02;
        const frameGeo = new THREE.BoxGeometry(w + 0.14, h + 0.14, 0.03);
        const frameMesh = new THREE.Mesh(frameGeo, edgeMat);
        group.add(frameMesh, frontPlane);
      }
    };

    if (imageUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(imageUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        const img = tex.image as HTMLImageElement;
        const aspect = img && img.height ? img.width / img.height : 1.6;
        applyGeometry(tex, aspect);
      });
    } else {
      const tex = createCanvasTexture(cardTitle, cardSubtitle, cardAccent);
      applyGeometry(tex, 1.6);
    }
  }, [imageUrl, cardTitle, cardSubtitle, cardAccent, shapeMode, finish, bgTheme]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const handleExportPng = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `asbily-3d-mockup-${shapeMode}.png`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Controls */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              1. Artwork / Screenshot
            </div>
            <label className="w-full py-2.5 px-3 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#090909] hover:border-[#000000] dark:hover:border-[#FFFFFF] transition flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer">
              <Upload className="w-4 h-4 text-[#000000] dark:text-[#FFFFFF]" />
              <span>{imageUrl ? 'Replace Image' : 'Upload Screenshot / Logo'}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="w-full text-xs text-neutral-500 hover:text-[#000000] dark:hover:text-[#FFFFFF] underline cursor-pointer"
              >
                Use Custom Text Card Instead
              </button>
            )}

            {!imageUrl && (
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  value={cardTitle}
                  onChange={(e) => setCardTitle(e.target.value)}
                  placeholder="Card headline..."
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-[#090909] text-xs"
                />
                <input
                  type="text"
                  value={cardSubtitle}
                  onChange={(e) => setCardSubtitle(e.target.value)}
                  placeholder="Card subtitle..."
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-[#090909] text-xs"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Accent Color</span>
                  <input
                    type="color"
                    value={cardAccent}
                    onChange={(e) => setCardAccent(e.target.value)}
                    className="w-8 h-6 rounded border-0 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-[#F6F6F6] dark:bg-[#050505] space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              2. 3D Object & Material
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {([
                { id: 'slab', label: '3D Slab' },
                { id: 'box', label: '3D Box' },
                { id: 'poster', label: 'Frame' },
              ] as const).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShapeMode(s.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    shapeMode === s.id
                      ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                      : 'bg-[#FFFFFF] dark:bg-[#090909] border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {([
                { id: 'glossy', label: 'Glossy' },
                { id: 'matte', label: 'Matte' },
                { id: 'metallic', label: 'Metallic' },
              ] as const).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFinish(f.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    finish === f.id
                      ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                      : 'bg-[#FFFFFF] dark:bg-[#090909] border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Pitch (X): {rotX}°</span>
                <span className="text-neutral-500">Yaw (Y): {Math.round(rotY)}°</span>
              </div>
              <input
                type="range"
                min={-65}
                max={65}
                value={rotX}
                onChange={(e) => setRotX(Number(e.target.value))}
                className="w-full accent-[#000000] dark:accent-[#FFFFFF]"
              />
              <input
                type="range"
                min={-180}
                max={180}
                value={rotY}
                onChange={(e) => setRotY(Number(e.target.value))}
                className="w-full accent-[#000000] dark:accent-[#FFFFFF]"
              />
              <div className="flex justify-between">
                <span className="text-neutral-500">Camera Zoom</span>
                <span className="font-mono tabular-nums">{zoom.toFixed(1)}m</span>
              </div>
              <input
                type="range"
                min={2.8}
                max={7.5}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#000000] dark:accent-[#FFFFFF]"
              />
            </div>

            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {(['transparent', 'dark', 'light', 'gray'] as const).map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setBgTheme(bg)}
                  className={`py-1 rounded text-[11px] font-medium capitalize border cursor-pointer ${
                    bgTheme === bg
                      ? 'bg-[#000000] text-[#FFFFFF] border-[#000000] dark:bg-[#FFFFFF] dark:text-[#000000] dark:border-[#FFFFFF]'
                      : 'bg-[#FFFFFF] dark:bg-[#090909] border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {bg === 'transparent' ? 'Alpha' : bg}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAutoSpin((s) => !s)}
              className="flex-1 py-2.5 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
            >
              {autoSpin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{autoSpin ? 'Pause Spin' : 'Auto Spin'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRotX(-14);
                setRotY(24);
                setZoom(4.6);
                setAutoSpin(false);
              }}
              className="py-2.5 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
              title="Reset angle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right 3D Viewport */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div
            className={`relative w-full h-[380px] sm:h-[460px] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden ${
              bgTheme === 'transparent' ? 'checkerboard-bg' : ''
            }`}
          >
            <div
              ref={containerRef}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
            />
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/55 text-white text-[11px] font-medium backdrop-blur-xs pointer-events-none">
              Drag directly on the 3D scene to rotate angle
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-neutral-500">
              Supports transparent PNG export for landing pages, App Store frames & social posts.
            </div>
            <button
              type="button"
              onClick={handleExportPng}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#000000] hover:bg-[#090909] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export High-Res PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Tool 2: 3D Geometry Studio & STL Exporter
// -------------------------------------------------------------
const ThreeDGeometryStudio: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const [shape, setShape] = useState<'torusKnot' | 'icosahedron' | 'cube' | 'octahedron' | 'cylinder'>('torusKnot');
  const [color, setColor] = useState('#EDEDED');
  const [metalness, setMetalness] = useState(0.55);
  const [roughness, setRoughness] = useState(0.25);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [vertexCount, setVertexCount] = useState(0);
  const [triangleCount, setTriangleCount] = useState(0);

  const autoRotateRef = useRef(autoRotate);
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth || 640, container.clientHeight || 420);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090909');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, (container.clientWidth || 640) / (container.clientHeight || 420), 0.1, 100);
    camera.position.set(0, 0.5, 4.4);
    cameraRef.current = camera;

    const grid = new THREE.GridHelper(10, 20, 0x525252, 0x262626);
    grid.position.y = -1.65;
    scene.add(grid);

    const amb = new THREE.AmbientLight(0xffffff, 0.75);
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(4, 6, 4);
    const rim = new THREE.DirectionalLight(0xededed, 1.4);
    rim.position.set(-4, 2, -4);
    scene.add(amb, key, rim);

    let dragging = false;
    let px = 0;
    let py = 0;
    const canvas = renderer.domElement;
    const onDown = (e: PointerEvent) => {
      dragging = true;
      px = e.clientX;
      py = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || !meshRef.current) return;
      meshRef.current.rotation.y += (e.clientX - px) * 0.01;
      meshRef.current.rotation.x += (e.clientY - py) * 0.01;
      px = e.clientX;
      py = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);

    const ro = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    ro.observe(container);

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (meshRef.current && autoRotateRef.current && !dragging) {
        meshRef.current.rotation.y += 0.008;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (meshRef.current) {
      scene.remove(meshRef.current);
      meshRef.current.geometry.dispose();
      (meshRef.current.material as THREE.Material).dispose();
    }

    let geo: THREE.BufferGeometry;
    if (shape === 'torusKnot') geo = new THREE.TorusKnotGeometry(0.95, 0.3, 140, 24);
    else if (shape === 'icosahedron') geo = new THREE.IcosahedronGeometry(1.25, 1);
    else if (shape === 'cube') geo = new THREE.BoxGeometry(1.7, 1.7, 1.7, 2, 2, 2);
    else if (shape === 'octahedron') geo = new THREE.OctahedronGeometry(1.3, 0);
    else geo = new THREE.CylinderGeometry(0.95, 0.95, 1.8, 32);

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness,
      roughness,
      wireframe,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    meshRef.current = mesh;

    const pos = geo.getAttribute('position');
    setVertexCount(pos ? pos.count : 0);
    const idx = geo.getIndex();
    setTriangleCount(idx ? idx.count / 3 : pos ? Math.floor(pos.count / 3) : 0);
  }, [shape, color, metalness, roughness, wireframe]);

  const exportPng = () => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    const url = rendererRef.current.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `asbily-3d-${shape}.png`;
    a.click();
  };

  // Real ASCII STL mesh generator for 3D printing / CAD import
  const exportStl = () => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const nonIndexed = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry;
    const pos = nonIndexed.getAttribute('position');
    let stl = `solid asbily_${shape}\n`;
    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 3) {
      vA.fromBufferAttribute(pos, i);
      vB.fromBufferAttribute(pos, i + 1);
      vC.fromBufferAttribute(pos, i + 2);
      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      cb.cross(ab).normalize();
      stl += `  facet normal ${cb.x.toFixed(6)} ${cb.y.toFixed(6)} ${cb.z.toFixed(6)}\n`;
      stl += `    outer loop\n`;
      stl += `      vertex ${vA.x.toFixed(6)} ${vA.y.toFixed(6)} ${vA.z.toFixed(6)}\n`;
      stl += `      vertex ${vB.x.toFixed(6)} ${vB.y.toFixed(6)} ${vB.z.toFixed(6)}\n`;
      stl += `      vertex ${vC.x.toFixed(6)} ${vC.y.toFixed(6)} ${vC.z.toFixed(6)}\n`;
      stl += `    endloop\n`;
      stl += `  endfacet\n`;
    }
    stl += `endsolid asbily_${shape}\n`;

    const blob = new Blob([stl], { type: 'model/stl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asbily-${shape}.stl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">Geometry Mesh</div>
            <div className="grid grid-cols-2 gap-1.5">
              {([
                { id: 'torusKnot', label: 'Torus Knot' },
                { id: 'icosahedron', label: 'Geodesic' },
                { id: 'cube', label: 'Cube' },
                { id: 'octahedron', label: 'Octahedron' },
                { id: 'cylinder', label: 'Cylinder' },
              ] as const).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setShape(item.id)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                    shape === item.id
                      ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black'
                      : 'bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 space-y-3 text-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">PBR Surface Material</div>
            <div className="flex items-center justify-between">
              <span>Base Albedo Color</span>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-6 rounded cursor-pointer border-0"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Metalness</span>
                <span className="font-mono tabular-nums">{metalness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={metalness}
                onChange={(e) => setMetalness(Number(e.target.value))}
                className="w-full accent-[#000000] dark:accent-[#FFFFFF]"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Roughness</span>
                <span className="font-mono tabular-nums">{roughness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.05}
                value={roughness}
                onChange={(e) => setRoughness(Number(e.target.value))}
                className="w-full accent-[#000000] dark:accent-[#FFFFFF]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} className="accent-[#000000] dark:accent-[#FFFFFF]" />
                <span>Wireframe Mesh</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} className="accent-[#000000] dark:accent-[#FFFFFF]" />
                <span>Auto Rotate</span>
              </label>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs flex justify-between font-mono tabular-nums">
            <span>Vertices: <strong>{vertexCount}</strong></span>
            <span>Triangles: <strong>{triangleCount}</strong></span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <div className="w-full h-[380px] sm:h-[440px] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-[#090909]">
            <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={exportPng}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs font-semibold hover:bg-[#F6F6F6] dark:hover:bg-white/10 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Export PNG Render</span>
            </button>
            <button
              type="button"
              onClick={exportStl}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#000000] hover:bg-[#090909] dark:bg-[#FFFFFF] dark:hover:bg-[#EDEDED] text-[#FFFFFF] dark:text-[#000000] text-xs font-semibold cursor-pointer"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Export .STL (3D Print)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
