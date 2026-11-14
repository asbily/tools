import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Box, Layers, Sparkles, ArrowRight, RotateCw } from 'lucide-react';

interface HeroScene3DProps {
  darkMode: boolean;
  onLaunch3DStudio?: () => void;
}

type ScenePreset = 'crystal' | 'torus' | 'lattice';

export const HeroScene3D: React.FC<HeroScene3DProps> = ({ darkMode, onLaunch3DStudio }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [preset, setPreset] = useState<ScenePreset>('crystal');
  const [webglFailed, setWebglFailed] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const presetRef = useRef<ScenePreset>(preset);
  const darkRef = useRef<boolean>(darkMode);

  useEffect(() => {
    presetRef.current = preset;
  }, [preset]);

  useEffect(() => {
    darkRef.current = darkMode;
  }, [darkMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 360;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    // Three-point studio lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 1.1);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x6366f1, 2.0);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // Root interactive group
    const group = new THREE.Group();
    scene.add(group);

    // Materials
    const coreMat = new THREE.MeshStandardMaterial({
      color: darkRef.current ? 0x1e293b : 0x0f172a,
      roughness: 0.22,
      metalness: 0.78,
      flatShading: true,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      roughness: 0.25,
      metalness: 0.6,
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: darkRef.current ? 0x818cf8 : 0x4f46e5,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    });

    const ringMat = new THREE.MeshStandardMaterial({
      color: darkRef.current ? 0x94a3b8 : 0x64748b,
      roughness: 0.35,
      metalness: 0.85,
    });

    // Presets meshes
    const crystalGeo = new THREE.IcosahedronGeometry(1.18, 0);
    const crystalMesh = new THREE.Mesh(crystalGeo, coreMat);

    const torusGeo = new THREE.TorusKnotGeometry(0.88, 0.28, 128, 24);
    const torusMesh = new THREE.Mesh(torusGeo, accentMat);

    const latticeBoxGeo = new THREE.BoxGeometry(1.55, 1.55, 1.55, 3, 3, 3);
    const latticeMesh = new THREE.Mesh(latticeBoxGeo, coreMat);

    const shellGeo = new THREE.IcosahedronGeometry(1.58, 1);
    const shellMesh = new THREE.Mesh(shellGeo, wireMat);

    const orbitRingGeo = new THREE.TorusGeometry(1.88, 0.022, 16, 100);
    const orbitRing = new THREE.Mesh(orbitRingGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2.6;
    orbitRing.rotation.y = Math.PI / 8;

    const orbitRing2Geo = new THREE.TorusGeometry(2.15, 0.015, 16, 100);
    const orbitRing2 = new THREE.Mesh(orbitRing2Geo, ringMat);
    orbitRing2.rotation.x = -Math.PI / 3.2;
    orbitRing2.rotation.z = Math.PI / 5;

    // Small orbiting satellite nodes
    const satGroup = new THREE.Group();
    const satGeo = new THREE.OctahedronGeometry(0.11, 0);
    const satPositions: [number, number, number][] = [
      [1.88, 0, 0],
      [-1.88, 0, 0],
      [0, 0, 2.15],
    ];
    satPositions.forEach(([x, y, z]) => {
      const m = new THREE.Mesh(satGeo, accentMat);
      m.position.set(x, y, z);
      satGroup.add(m);
    });

    group.add(crystalMesh, torusMesh, latticeMesh, shellMesh, orbitRing, orbitRing2, satGroup);

    // Pointer interaction for tactile 3D dragging & parallax
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetRotX = 0.25;
    let targetRotY = 0.4;
    let currentRotX = 0.25;
    let currentRotY = 0.4;

    const canvas = renderer.domElement;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        targetRotY += dx * 0.01;
        targetRotX += dy * 0.01;
        prevX = e.clientX;
        prevY = e.clientY;
      } else {
        const rect = canvas.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 0.45;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 0.35;
        targetRotX = ny + 0.2;
        targetRotY += nx * 0.015;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // ignore if already released
      }
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Sync theme colors
      coreMat.color.setHex(darkRef.current ? 0x1e293b : 0x0f172a);
      wireMat.color.setHex(darkRef.current ? 0x818cf8 : 0x4f46e5);
      ringMat.color.setHex(darkRef.current ? 0x94a3b8 : 0x475569);

      // Sync active geometry visibility
      const activePreset = presetRef.current;
      crystalMesh.visible = activePreset === 'crystal';
      torusMesh.visible = activePreset === 'torus';
      latticeMesh.visible = activePreset === 'lattice';

      if (!prefersReducedMotion && !isDragging) {
        targetRotY += 0.0045;
      }

      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      group.rotation.x = currentRotX;
      group.rotation.y = currentRotY;

      if (!prefersReducedMotion) {
        shellMesh.rotation.y = -elapsed * 0.18;
        orbitRing.rotation.z = elapsed * 0.25;
        orbitRing2.rotation.y = -elapsed * 0.2;
        satGroup.rotation.y = elapsed * 0.45;
        satGroup.rotation.x = Math.sin(elapsed * 0.5) * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);

      crystalGeo.dispose();
      torusGeo.dispose();
      latticeBoxGeo.dispose();
      shellGeo.dispose();
      orbitRingGeo.dispose();
      orbitRing2Geo.dispose();
      satGeo.dispose();
      coreMat.dispose();
      accentMat.dispose();
      wireMat.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[360px] rounded-2xl border border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 dark:from-zinc-900/90 dark:via-zinc-950 dark:to-indigo-950/25 overflow-hidden flex flex-col justify-between select-none">
      {/* Subtle architectural perspective floor grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Top HUD Controls */}
      <div className="relative z-10 flex items-center justify-between gap-2 p-3 sm:p-4">
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800">
          {([
            { id: 'crystal', label: 'Crystal' },
            { id: 'torus', label: 'Torus' },
            { id: 'lattice', label: 'Cube' },
          ] as const).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPreset(item.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition whitespace-nowrap shrink-0 cursor-pointer ${
                preset === item.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-zinc-400 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/70 dark:border-zinc-800 whitespace-nowrap shrink-0">
          <RotateCw className="w-3 h-3" />
          <span>Drag to Orbit</span>
        </span>
      </div>

      {/* WebGL Canvas Mount or Fallback */}
      {webglFailed || contextLost ? (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2">
          <Box className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
          <div className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
            Interactive 3D Workspace Ready
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs">
            Launch 3D Mockup Studio or 3D Geometry Exporter to render and export high-resolution 3D assets.
          </p>
        </div>
      ) : (
        <div
          ref={mountRef}
          className="relative z-10 flex-1 w-full h-full min-h-[220px] cursor-grab active:cursor-grabbing touch-none"
          aria-label="Interactive 3D Geometric Viewport"
        />
      )}

      {/* Bottom HUD Bar */}
      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between gap-2 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-zinc-950/90 dark:via-zinc-950/50 dark:to-transparent">
        <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-2 truncate">
          <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="truncate">WebGL 3D Mockups & STL Studio</span>
        </div>

        {onLaunch3DStudio && (
          <button
            type="button"
            onClick={onLaunch3DStudio}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open 3D Studio</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
