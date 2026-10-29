import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Layers, Cpu, Network, Monitor } from 'lucide-react';
import { detectSoftwareWebGL, scheduleAfterDraw, disposeSceneHierarchy } from '../utils/webglUtils';

export type HeroCameraPreset = 'overview' | 'workstation' | 'server';

interface HeroScene3DProps {
  mouseNorm: { x: number; y: number };
  scrollOffset: number;
  reducedMotion: boolean;
}

const CAMERA_PRESETS: Record<
  HeroCameraPreset,
  { pos: [number, number, number]; target: [number, number, number]; label: string }
> = {
  overview: {
    pos: [0.3, 1.55, 4.65],
    target: [0, 0.85, 0],
    label: 'Conjunto Completo',
  },
  workstation: {
    pos: [-0.75, 1.45, 3.25],
    target: [-0.45, 1.05, 0],
    label: 'Estação & Código',
  },
  server: {
    pos: [1.65, 1.4, 3.35],
    target: [1.05, 0.95, 0],
    label: 'Servidor & Rede',
  },
};

function createCodeMonitorTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Deep slate IDE background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, 1024, 512);

    // Top bar
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 1024, 44);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 44, 1024, 2);

    // Window buttons
    ctx.fillStyle = '#334155';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(28 + i * 20, 22, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Left sidebar
    ctx.fillStyle = '#0d1320';
    ctx.fillRect(0, 46, 180, 466);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(180, 46, 2, 466);

    // Sidebar directory entries
    const files = ['server.py', 'schema.sql', 'network.conf', 'backup_job.py', 'App.tsx'];
    ctx.font = '600 16px monospace';
    files.forEach((f, idx) => {
      ctx.fillStyle = idx === 0 ? '#06b6d4' : '#64748b';
      ctx.fillText(f, 24, 92 + idx * 36);
    });

    // Code lines in main editor
    const codeLines = [
      { indent: 0, color: '#38bdf8', width: 220 },
      { indent: 24, color: '#94a3b8', width: 340 },
      { indent: 48, color: '#e2e8f0', width: 290 },
      { indent: 48, color: '#06b6d4', width: 380 },
      { indent: 24, color: '#94a3b8', width: 190 },
      { indent: 0, color: '#38bdf8', width: 260 },
      { indent: 24, color: '#e2e8f0', width: 320 },
      { indent: 24, color: '#06b6d4', width: 270 },
    ];
    codeLines.forEach((line, idx) => {
      const y = 86 + idx * 42;
      ctx.fillStyle = '#334155';
      ctx.font = '14px monospace';
      ctx.fillText(String(idx + 1).padStart(2, '0'), 204, y + 12);

      ctx.fillStyle = line.color;
      ctx.fillRect(244 + line.indent, y, line.width, 14);
    });

    // Right telemetry/architecture panel
    ctx.fillStyle = '#0d1526';
    ctx.fillRect(720, 68, 276, 416);
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.strokeRect(720, 68, 276, 416);

    // Network topology nodes inside panel
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(770, 160);
    ctx.lineTo(858, 120);
    ctx.lineTo(940, 160);
    ctx.lineTo(858, 220);
    ctx.closePath();
    ctx.stroke();

    const pts = [
      [770, 160],
      [858, 120],
      [940, 160],
      [858, 220],
    ];
    pts.forEach(([px, py]) => {
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // SQL / Server bars
    for (let b = 0; b < 4; b++) {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(748, 280 + b * 42, 220, 22);
      ctx.fillStyle = b % 2 === 0 ? '#06b6d4' : '#3b82f6';
      ctx.fillRect(748, 280 + b * 42, 140 + (b * 23) % 70, 22);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = maxAnisotropy;
  texture.needsUpdate = true;
  return texture;
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({
  mouseNorm,
  scrollOffset,
  reducedMotion,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const [activePreset, setActivePreset] = useState<HeroCameraPreset>('overview');
  const [explodedFactor, setExplodedFactor] = useState<number>(0.25);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    scrollOffset: 0,
    preset: 'overview' as HeroCameraPreset,
    exploded: 0.25,
    reducedMotion: false,
  });

  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    stateRef.current.mouseX = mouseNorm.x;
    stateRef.current.mouseY = mouseNorm.y;
    stateRef.current.scrollOffset = scrollOffset;
    stateRef.current.preset = activePreset;
    stateRef.current.exploded = explodedFactor;
    stateRef.current.reducedMotion = reducedMotion;
    requestRenderRef.current?.();
  }, [mouseNorm.x, mouseNorm.y, scrollOffset, activePreset, explodedFactor, reducedMotion]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.085);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
    camera.position.set(...CAMERA_PRESETS.overview.pos);
    const currentLookTarget = new THREE.Vector3(...CAMERA_PRESETS.overview.target);
    camera.lookAt(currentLookTarget);

    // Studio Environment Reflection (RoomEnvironment + PMREMGenerator)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Balanced 3-Point Studio Lighting with Warm/Cool Contrast
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(4.5, 6.5, 5.0);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      const d = 3.5;
      keyLight.shadow.camera.left = -d;
      keyLight.shadow.camera.right = d;
      keyLight.shadow.camera.top = d;
      keyLight.shadow.camera.bottom = -d;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 18;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.65);
    rimLight.position.set(-4.0, 3.5, -3.5);
    scene.add(rimLight);

    // Root Composite Group (11 distinct procedural sub-parts)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    // Materials with calibrated roughness/metalness differences (>= 0.25 delta)
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x161f30,
      metalness: 0.85,
      roughness: 0.24,
    });
    const matteChassisMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.35,
      roughness: 0.72,
    });
    const brushedSilverMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2,
    });
    const cyanAccentMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.1,
    });
    const floatingLayerMat = new THREE.MeshPhysicalMaterial({
      color: 0x0ea5e9,
      metalness: 0.1,
      roughness: 0.15,
      transmission: isSoftwareGl ? 0 : 0.75,
      transparent: true,
      opacity: isSoftwareGl ? 0.32 : 0.88,
      clearcoat: 1.0,
    });

    // 1. Studio Pedestal Platform & Contact Shadow Grounding
    const pedestalGeo = new THREE.CylinderGeometry(2.35, 2.5, 0.08, 48);
    const pedestalMesh = new THREE.Mesh(pedestalGeo, matteChassisMat);
    pedestalMesh.position.set(0, 0.04, 0);
    pedestalMesh.receiveShadow = true;
    rootGroup.add(pedestalMesh);

    const ringGeo = new THREE.RingGeometry(2.22, 2.26, 64);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(0, 0.082, 0);
    rootGroup.add(ringMesh);

    // 2. Workstation Group (Monitor + Stand + Screen + Keyboard)
    const workstationGroup = new THREE.Group();
    workstationGroup.position.set(-0.48, 0.08, 0);
    rootGroup.add(workstationGroup);

    // Monitor Base & Arm
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.04, 0.48), darkMetalMat);
    standBase.position.set(0, 0.02, 0.05);
    workstationGroup.add(standBase);

    const standNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.72, 20), brushedSilverMat);
    standNeck.position.set(0, 0.38, -0.08);
    standNeck.rotation.x = -0.08;
    workstationGroup.add(standNeck);

    // Monitor Chassis
    const monitorFrame = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.12, 0.07), darkMetalMat);
    monitorFrame.position.set(0, 1.02, 0);
    monitorFrame.castShadow = true;
    workstationGroup.add(monitorFrame);

    // Procedural Code Screen Texture
    const screenTexture = createCodeMonitorTexture(maxAniso);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: screenTexture,
      roughness: 0.18,
      metalness: 0.05,
      emissive: 0x0c192c,
      emissiveIntensity: 0.35,
    });
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.94, 1.01), screenMat);
    screenMesh.position.set(0, 1.02, 0.037);
    workstationGroup.add(screenMesh);

    // Keyboard Deck & Instanced Keycaps
    const keyboardDeck = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.035, 0.38), darkMetalMat);
    keyboardDeck.position.set(0, 0.02, 0.56);
    keyboardDeck.rotation.x = 0.06;
    workstationGroup.add(keyboardDeck);

    const keyGeo = new THREE.BoxGeometry(0.065, 0.02, 0.065);
    const keycapInstanced = new THREE.InstancedMesh(keyGeo, matteChassisMat, 36);
    const dummy = new THREE.Object3D();
    let kIdx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 12; c++) {
        dummy.position.set(-0.48 + c * 0.086, 0.045, 0.45 + r * 0.095);
        dummy.rotation.x = 0.06;
        dummy.updateMatrix();
        keycapInstanced.setMatrixAt(kIdx++, dummy.matrix);
      }
    }
    keycapInstanced.instanceMatrix.needsUpdate = true;
    keycapInstanced.computeBoundingSphere();
    workstationGroup.add(keycapInstanced);

    // 3. Modular Tower/Blade Server Node (Right side of composition)
    const serverGroup = new THREE.Group();
    serverGroup.position.set(1.12, 0.08, -0.05);
    rootGroup.add(serverGroup);

    const serverTower = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.48, 0.88), matteChassisMat);
    serverTower.position.set(0, 0.74, 0);
    serverTower.castShadow = true;
    serverGroup.add(serverTower);

    const serverTrim = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.5, 0.04), darkMetalMat);
    serverTrim.position.set(0, 0.75, 0.43);
    serverGroup.add(serverTrim);

    // 4 Drive Bays on the Server Front
    for (let b = 0; b < 4; b++) {
      const bay = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.18, 0.03), brushedSilverMat);
      bay.position.set(0, 1.22 - b * 0.25, 0.455);
      serverGroup.add(bay);

      const ledBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.035), cyanAccentMat);
      ledBar.position.set(0.16, 1.22 - b * 0.25, 0.462);
      serverGroup.add(ledBar);
    }

    // 4. Floating Interface & Code Layers (Responds to Exploded View Slider)
    const floatingUiGroup = new THREE.Group();
    workstationGroup.add(floatingUiGroup);

    const uiLayer1 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.46, 0.018), floatingLayerMat);
    uiLayer1.position.set(-0.52, 1.16, 0.34);
    floatingUiGroup.add(uiLayer1);

    const uiLayer2 = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.38, 0.018), floatingLayerMat);
    uiLayer2.position.set(0.54, 0.88, 0.48);
    floatingUiGroup.add(uiLayer2);

    // 5. Network Conduit Tubes & Orbital Nodes connecting Workstation <-> Server
    const curvePoints = [
      new THREE.Vector3(-0.48, 0.95, -0.05),
      new THREE.Vector3(0.32, 1.35, -0.35),
      new THREE.Vector3(1.12, 1.05, -0.05),
    ];
    const conduitCurve = new THREE.CatmullRomCurve3(curvePoints);
    const conduitGeo = new THREE.TubeGeometry(conduitCurve, 28, 0.018, 8, false);
    const conduitMesh = new THREE.Mesh(conduitGeo, cyanAccentMat);
    rootGroup.add(conduitMesh);

    // Orbital Ring & Instanced Network Particles
    const orbitGroup = new THREE.Group();
    orbitGroup.position.set(0.25, 1.05, 0);
    rootGroup.add(orbitGroup);

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.88, 0.008, 12, 64),
      cyanAccentMat
    );
    orbitRing.rotation.x = Math.PI / 2.25;
    orbitRing.rotation.y = 0.22;
    orbitGroup.add(orbitRing);

    const particleGeo = new THREE.OctahedronGeometry(0.038, 0);
    const particlesMesh = new THREE.InstancedMesh(particleGeo, cyanAccentMat, 24);
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 1.75 + (i % 3) * 0.22;
      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.35,
        Math.sin(angle) * radius
      );
      dummy.scale.setScalar(0.75 + (i % 3) * 0.2);
      dummy.updateMatrix();
      particlesMesh.setMatrixAt(i, dummy.matrix);
    }
    particlesMesh.instanceMatrix.needsUpdate = true;
    particlesMesh.computeBoundingSphere();
    orbitGroup.add(particlesMesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pre-allocated vectors for zero-GC render loop
    const targetCamPos = new THREE.Vector3();
    const targetLookPos = new THREE.Vector3();
    const frameHandle = { current: 0 };
    const startTimeMs = performance.now();
    let lastTimeMs = startTimeMs;

    let renderBusy = false;
    let renderDirty = false;

    const getTiming = () => {
      const now = performance.now();
      const dt = Math.min(Math.max((now - lastTimeMs) / 1000, 0.001), 0.1);
      lastTimeMs = now;
      const elapsed = (now - startTimeMs) / 1000;
      return { dt, elapsed };
    };

    const stepScene = (dt: number, elapsed: number) => {
      const st = stateRef.current;
      const presetCfg = CAMERA_PRESETS[st.preset];

      const pointerX = st.reducedMotion ? 0 : st.mouseX * 0.45;
      const pointerY = st.reducedMotion ? 0 : st.mouseY * 0.28;
      const scrollShiftY = st.reducedMotion ? 0 : Math.min(0.45, st.scrollOffset * 0.0006);

      targetCamPos.set(
        presetCfg.pos[0] + pointerX,
        presetCfg.pos[1] - pointerY + scrollShiftY,
        presetCfg.pos[2]
      );
      targetLookPos.set(...presetCfg.target);

      const dampLambda = isSoftwareGl ? 18 : 6.5;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.x, dampLambda, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.y, dampLambda, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.z, dampLambda, dt);

      currentLookTarget.x = THREE.MathUtils.damp(currentLookTarget.x, targetLookPos.x, dampLambda, dt);
      currentLookTarget.y = THREE.MathUtils.damp(currentLookTarget.y, targetLookPos.y, dampLambda, dt);
      currentLookTarget.z = THREE.MathUtils.damp(currentLookTarget.z, targetLookPos.z, dampLambda, dt);
      camera.lookAt(currentLookTarget);

      // Exploded view separation for floating layers
      const zSpread = 0.2 + st.exploded * 0.55;
      uiLayer1.position.z = THREE.MathUtils.damp(uiLayer1.position.z, zSpread, dampLambda, dt);
      uiLayer2.position.z = THREE.MathUtils.damp(uiLayer2.position.z, zSpread * 1.35, dampLambda, dt);

      if (!st.reducedMotion) {
        orbitGroup.rotation.y = elapsed * 0.16 + st.mouseX * 0.25;
        rootGroup.rotation.y = THREE.MathUtils.damp(
          rootGroup.rotation.y,
          st.mouseX * 0.18,
          dampLambda,
          dt
        );
      }

      renderer.render(scene, camera);
    };

    // On software WebGL, render on demand with afterDraw pacing so headless screenshots never stall
    const requestRender = () => {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameHandle.current = requestAnimationFrame(() => {
        renderDirty = false;
        const { dt, elapsed } = getTiming();
        stepScene(dt, elapsed);
        const done = () => {
          renderBusy = false;
          if (renderDirty) requestRender();
        };
        if (isSoftwareGl) {
          scheduleAfterDraw(renderer, done, frameHandle);
        } else {
          done();
        }
      });
    };

    requestRenderRef.current = requestRender;

    let animFrameId = 0;
    const gpuLoop = () => {
      const { dt, elapsed } = getTiming();
      stepScene(dt, elapsed);
      animFrameId = requestAnimationFrame(gpuLoop);
    };

    if (isSoftwareGl) {
      requestRender();
    } else {
      animFrameId = requestAnimationFrame(gpuLoop);
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (isSoftwareGl) requestRender();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      cancelAnimationFrame(frameHandle.current);
      clearTimeout(frameHandle.current);
      requestRenderRef.current = null;
      disposeSceneHierarchy(scene);
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div
        data-testid="hero-3d-fallback"
        className="relative flex h-[460px] w-full flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#0b101b] p-8 text-center"
      >
        <Monitor className="mb-4 h-12 w-12 text-cyan-400" />
        <h3 className="font-display text-lg font-semibold text-slate-100">
          Arquitetura de Software &amp; Infraestrutura de Servidores
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-400">
          Visualização esquemática ativa para compatibilidade com seu dispositivo.
        </p>
      </div>
    );
  }

  return (
    <div
      data-testid="hero-3d-viewport"
      data-active-preset={activePreset}
      className="relative h-[460px] w-full overflow-hidden rounded-2xl border border-slate-800/90 bg-[#090d16] sm:h-[520px]"
    >
      {/* Top-Left Spec Label (Zero Viewport Occlusion) */}
      <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-2.5 rounded-lg border border-slate-800 bg-[#07090e]/90 px-3.5 py-2 text-xs text-slate-300">
        <span className="font-mono font-medium text-cyan-400">Ambiente 3D Interativo</span>
        <span aria-hidden="true" className="text-slate-600">·</span>
        <span className="text-slate-300">{CAMERA_PRESETS[activePreset].label}</span>
      </div>

      {/* Dedicated Empty Ref Container for WebGL Canvas */}
      <div
        ref={canvasMountRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        aria-label="Composição tridimensional interativa representando estação de desenvolvimento de software, camadas de código e servidor de rede"
        role="img"
      />

      {/* Unified Collapsible Bottom Control Dock (Follows Three.js Skill Section 5) */}
      <div className="absolute bottom-3 left-1/2 z-10 w-[96%] max-w-[600px] -translate-x-1/2">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setHudCollapsed((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-t-lg border border-b-0 border-slate-800 bg-[#07090e]/95 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-400 whitespace-nowrap shrink-0"
            aria-expanded={!hudCollapsed}
            aria-label={hudCollapsed ? 'Mostrar controles da cena 3D' : 'Ocultar controles da cena 3D'}
          >
            {hudCollapsed ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 text-cyan-400" />
                <span>Mostrar Controles 3D</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
                <span>Ocultar Controles</span>
              </>
            )}
          </button>
        </div>

        {!hudCollapsed && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-[#07090e]/95 px-3 py-2.5 shadow-xl">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActivePreset('overview')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activePreset === 'overview'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Visão Geral</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePreset('workstation')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activePreset === 'workstation'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>Código &amp; UI</span>
              </button>
              <button
                type="button"
                onClick={() => setActivePreset('server')}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activePreset === 'server'
                    ? 'bg-cyan-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                <span>Servidor &amp; Rede</span>
              </button>
            </div>

            <div className="flex items-center gap-2 border-slate-800/80 sm:border-l sm:pl-2.5">
              <Network className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <label htmlFor="hero-exploded-slider" className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                Camadas
              </label>
              <input
                id="hero-exploded-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explodedFactor}
                onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
                className="h-1.5 w-16 cursor-pointer accent-cyan-400"
                aria-label="Controlar separação das camadas de interface 3D"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
