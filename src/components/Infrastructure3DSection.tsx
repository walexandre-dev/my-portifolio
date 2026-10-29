import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Server,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import { INFRA_STAGES, InfraStage } from '../data/portfolioData';
import { detectSoftwareWebGL, scheduleAfterDraw, disposeSceneHierarchy } from '../utils/webglUtils';

interface Infrastructure3DSectionProps {
  reducedMotion: boolean;
  onRequestService: (serviceName: string) => void;
}

export const Infrastructure3DSection: React.FC<Infrastructure3DSectionProps> = ({
  reducedMotion,
  onRequestService,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [rackExploded, setRackExploded] = useState<number>(0.15);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [webglReady, setWebglReady] = useState<boolean>(true);

  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const stepElementsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const requestRenderRef = useRef<(() => void) | null>(null);

  const activeStage: InfraStage = INFRA_STAGES[activeStepIndex] || INFRA_STAGES[0];

  const sceneStateRef = useRef({
    stepIndex: 0,
    exploded: 0.15,
    reducedMotion: false,
  });

  useEffect(() => {
    sceneStateRef.current.stepIndex = activeStepIndex;
    sceneStateRef.current.exploded = rackExploded;
    sceneStateRef.current.reducedMotion = reducedMotion;
    requestRenderRef.current?.();
  }, [activeStepIndex, rackExploded, reducedMotion]);

  // Initialize 3D Server Rack & Data Room Scene
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
      setWebglReady(false);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 520;
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.065);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 60);
    camera.position.set(...INFRA_STAGES[0].cameraPos);
    const lookTarget = new THREE.Vector3(...INFRA_STAGES[0].cameraTarget);
    camera.lookAt(lookTarget);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Warm/Cool Lighting
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.3);
    keyLight.position.set(5, 7, 6);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const backLight = new THREE.DirectionalLight(0x06b6d4, 1.5);
    backLight.position.set(-4.5, 4, -4);
    scene.add(backLight);

    // Materials
    const rackFrameMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.85,
      roughness: 0.28,
    });
    const serverChassisMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.35,
    });
    const highlightCyanMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.15,
    });
    const highlightBlueMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.55,
      roughness: 0.25,
      metalness: 0.2,
    });
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0b101b,
      metalness: 0.3,
      roughness: 0.8,
    });

    const infraRoot = new THREE.Group();
    scene.add(infraRoot);

    // 1. Raised Data Room Floor Platform
    const floorBase = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.1, 4.4), floorMat);
    floorBase.position.set(0, -0.05, 0);
    floorBase.receiveShadow = true;
    infraRoot.add(floorBase);

    const gridHelper = new THREE.GridHelper(5.4, 18, 0x06b6d4, 0x1e293b);
    gridHelper.position.set(0, 0.015, 0);
    infraRoot.add(gridHelper);

    // 2. 42U Main Rack Structural Frame (4 pillars + top/bottom frames)
    const rackGroup = new THREE.Group();
    infraRoot.add(rackGroup);

    const pillarGeo = new THREE.BoxGeometry(0.08, 2.8, 0.08);
    const pillarOffsets = [
      [-0.65, 1.4, -0.55],
      [0.65, 1.4, -0.55],
      [-0.65, 1.4, 0.55],
      [0.65, 1.4, 0.55],
    ];
    pillarOffsets.forEach(([px, py, pz]) => {
      const post = new THREE.Mesh(pillarGeo, rackFrameMat);
      post.position.set(px, py, pz);
      post.castShadow = true;
      rackGroup.add(post);
    });

    const topRoof = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.08, 1.22), rackFrameMat);
    topRoof.position.set(0, 2.82, 0);
    rackGroup.add(topRoof);

    // 3. Subsystem Groups (Animated via exploded slider & stage highlights)
    // A. UPS & Power Base (Stage 2)
    const upsGroup = new THREE.Group();
    upsGroup.position.set(0, 0.32, 0);
    rackGroup.add(upsGroup);
    const upsBox = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.38, 1.04), serverChassisMat);
    upsGroup.add(upsBox);
    const upsIndicator = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.06, 0.02), highlightCyanMat);
    upsIndicator.position.set(-0.28, 0.04, 0.53);
    upsGroup.add(upsIndicator);

    // B. SAN/NAS Storage Vault (Stage 6)
    const storageGroup = new THREE.Group();
    storageGroup.position.set(0, 0.88, 0);
    rackGroup.add(storageGroup);
    const storageChassis = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.44, 1.02), serverChassisMat);
    storageGroup.add(storageChassis);

    const caddyGeo = new THREE.BoxGeometry(0.14, 0.32, 0.03);
    const caddyInstanced = new THREE.InstancedMesh(caddyGeo, highlightBlueMat, 6);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 6; i++) {
      dummy.position.set(-0.45 + i * 0.18, 0, 0.52);
      dummy.updateMatrix();
      caddyInstanced.setMatrixAt(i, dummy.matrix);
    }
    caddyInstanced.instanceMatrix.needsUpdate = true;
    caddyInstanced.computeBoundingSphere();
    storageGroup.add(caddyInstanced);

    // C. Compute Blade Servers (Stage 3)
    const bladesGroup = new THREE.Group();
    bladesGroup.position.set(0, 1.56, 0);
    rackGroup.add(bladesGroup);
    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.2, 1.0), serverChassisMat);
      blade.position.set(0, (b - 1) * 0.25, 0);
      bladesGroup.add(blade);

      const led = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.03, 0.02), highlightCyanMat);
      led.position.set(0.38, (b - 1) * 0.25, 0.51);
      bladesGroup.add(led);
    }

    // D. Access Control & Firewall Appliance (Stage 5)
    const securityGroup = new THREE.Group();
    securityGroup.position.set(0, 2.12, 0);
    rackGroup.add(securityGroup);
    const fwChassis = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.18, 0.96), rackFrameMat);
    securityGroup.add(fwChassis);
    const fwStrip = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.04, 0.02), highlightCyanMat);
    fwStrip.position.set(0, 0, 0.49);
    securityGroup.add(fwStrip);

    // E. Network Core Switch & Patch Panel (Stage 4)
    const networkGroup = new THREE.Group();
    networkGroup.position.set(0, 2.48, 0);
    rackGroup.add(networkGroup);
    const switchMesh = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.22, 0.92), serverChassisMat);
    networkGroup.add(switchMesh);

    const portGeo = new THREE.BoxGeometry(0.04, 0.04, 0.02);
    const portsInstanced = new THREE.InstancedMesh(portGeo, highlightCyanMat, 16);
    for (let p = 0; p < 16; p++) {
      dummy.position.set(-0.48 + p * 0.064, 0.02, 0.47);
      dummy.updateMatrix();
      portsInstanced.setMatrixAt(p, dummy.matrix);
    }
    portsInstanced.instanceMatrix.needsUpdate = true;
    portsInstanced.computeBoundingSphere();
    networkGroup.add(portsInstanced);

    // 4. External Client Terminal & Structured Optical Conduits (Stage 7)
    const terminalGroup = new THREE.Group();
    terminalGroup.position.set(-1.75, 0, 0.35);
    infraRoot.add(terminalGroup);

    const deskPillar = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.95, 0.55), rackFrameMat);
    deskPillar.position.set(0, 0.475, 0);
    terminalGroup.add(deskPillar);

    const clientScreen = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.42, 0.04), highlightBlueMat);
    clientScreen.position.set(0, 1.22, 0);
    clientScreen.rotation.y = 0.35;
    terminalGroup.add(clientScreen);

    // Fiber Optic Conduits linking Switch <-> Terminal & Storage
    const fiberCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 2.48, 0.48),
      new THREE.Vector3(-0.85, 2.48, 0.65),
      new THREE.Vector3(-1.45, 1.2, 0.5),
      new THREE.Vector3(-1.75, 1.15, 0.35),
    ]);
    const fiberTube1 = new THREE.Mesh(
      new THREE.TubeGeometry(fiberCurve1, 32, 0.018, 8, false),
      highlightCyanMat
    );
    infraRoot.add(fiberTube1);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const targetCam = new THREE.Vector3();
    const targetLook = new THREE.Vector3();
    const frameHandle = { current: 0 };
    let lastTimeMs = performance.now();

    let renderBusy = false;
    let renderDirty = false;

    const getDt = () => {
      const now = performance.now();
      const dt = Math.min(Math.max((now - lastTimeMs) / 1000, 0.001), 0.1);
      lastTimeMs = now;
      return dt;
    };

    const stepScene = (dt: number) => {
      const st = sceneStateRef.current;
      const stageCfg = INFRA_STAGES[st.stepIndex] || INFRA_STAGES[0];

      targetCam.set(...stageCfg.cameraPos);
      targetLook.set(...stageCfg.cameraTarget);

      const lambda = isSoftwareGl ? 20 : 5.5;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCam.x, lambda, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCam.y, lambda, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCam.z, lambda, dt);

      lookTarget.x = THREE.MathUtils.damp(lookTarget.x, targetLook.x, lambda, dt);
      lookTarget.y = THREE.MathUtils.damp(lookTarget.y, targetLook.y, lambda, dt);
      lookTarget.z = THREE.MathUtils.damp(lookTarget.z, targetLook.z, lambda, dt);
      camera.lookAt(lookTarget);

      // Exploded pull-out of active subsystem
      const basePull = st.exploded * 0.42;
      const activeGroup = stageCfg.highlightGroup;

      upsGroup.position.z = THREE.MathUtils.damp(
        upsGroup.position.z,
        activeGroup === 'chassis' ? 0.35 + basePull : basePull * 0.3,
        lambda,
        dt
      );
      bladesGroup.position.z = THREE.MathUtils.damp(
        bladesGroup.position.z,
        activeGroup === 'blades' ? 0.38 + basePull : basePull * 0.5,
        lambda,
        dt
      );
      networkGroup.position.z = THREE.MathUtils.damp(
        networkGroup.position.z,
        activeGroup === 'network' ? 0.38 + basePull : basePull * 0.6,
        lambda,
        dt
      );
      securityGroup.position.z = THREE.MathUtils.damp(
        securityGroup.position.z,
        activeGroup === 'security' ? 0.38 + basePull : basePull * 0.45,
        lambda,
        dt
      );
      storageGroup.position.z = THREE.MathUtils.damp(
        storageGroup.position.z,
        activeGroup === 'storage' ? 0.38 + basePull : basePull * 0.35,
        lambda,
        dt
      );

      renderer.render(scene, camera);
    };

    const requestRender = () => {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameHandle.current = requestAnimationFrame(() => {
        renderDirty = false;
        stepScene(getDt());
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
      stepScene(getDt());
      animFrameId = requestAnimationFrame(gpuLoop);
    };

    if (isSoftwareGl) {
      requestRender();
    } else {
      animFrameId = requestAnimationFrame(gpuLoop);
    }

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
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

  const manualSelectLockRef = useRef<number>(0);

  // IntersectionObserver on stage cards so scrolling naturally updates the active 3D stage
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < manualSelectLockRef.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxAttr = entry.target.getAttribute('data-stage-index');
            if (idxAttr !== null) {
              const parsed = parseInt(idxAttr, 10);
              if (!Number.isNaN(parsed)) {
                setActiveStepIndex(parsed);
              }
            }
          }
        });
      },
      {
        rootMargin: '-25% 0px -45% 0px',
        threshold: 0.25,
      }
    );

    stepElementsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const selectStageAndSyncScroll = (idx: number) => {
    manualSelectLockRef.current = Date.now() + 900;
    setActiveStepIndex(idx);
    const targetCard = stepElementsRef.current[idx];
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      id="infraestrutura"
      aria-labelledby="infra-heading"
      className="relative border-t border-slate-800/80 bg-[#07090e] py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-medium text-cyan-400">
            04. Arquitetura de Servidores &amp; Topologia de Rede
          </p>
          <h2
            id="infra-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Implantação de infraestrutura em 7 etapas verificáveis.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Explore o ambiente tridimensional de servidores abaixo. Navegue pelas etapas ou role a
            página para inspecionar como cada camada — do dimensionamento elétrico e instalação de
            servidores até o controle de acesso e rotinas de backup — é planejada e documentada.
          </p>
        </div>

        {/* Interactive Split Layout: 3D Sticky Viewport + 7 Progressive Stage Cards */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left / Sticky 3D Server Room Viewport (7 Columns on Desktop) */}
          <div className="lg:sticky lg:top-24 lg:col-span-7">
            <div
              data-testid="infra-3d-viewport"
              data-active-stage={activeStage.step}
              className="relative h-[460px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#090d16] sm:h-[540px]"
            >
              {/* Top-left minimal spec header */}
              <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-xl border border-slate-800 bg-[#07090e]/95 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono font-semibold text-cyan-400">
                    Etapa {activeStage.index} de 07
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-200">{activeStage.title}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-400">{activeStage.subsystemLabel}</p>
              </div>

              {webglReady ? (
                <div
                  ref={canvasMountRef}
                  className="h-full w-full"
                  role="img"
                  aria-label={`Visualização 3D do rack de servidores focada na etapa ${activeStage.index}: ${activeStage.title}`}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <Server className="mb-3 h-12 w-12 text-cyan-400" />
                  <p className="font-display text-lg font-semibold text-white">
                    {activeStage.index}. {activeStage.title}
                  </p>
                  <p className="mt-1 max-w-md text-sm text-slate-400">
                    {activeStage.description}
                  </p>
                </div>
              )}

              {/* Unified Collapsible Bottom Control Dock */}
              <div className="absolute bottom-3 left-1/2 z-10 w-[94%] max-w-[580px] -translate-x-1/2">
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setDockCollapsed((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-t-lg border border-b-0 border-slate-800 bg-[#07090e]/95 px-3 py-1 text-xs font-medium text-slate-300 transition-colors hover:text-white whitespace-nowrap shrink-0"
                    aria-expanded={!dockCollapsed}
                  >
                    {dockCollapsed ? (
                      <>
                        <ChevronUp className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Mostrar Controles do Rack</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
                        <span>Ocultar Controles</span>
                      </>
                    )}
                  </button>
                </div>

                {!dockCollapsed && (
                  <div className="flex flex-col gap-2.5 rounded-xl border border-slate-800 bg-[#07090e]/95 p-3 shadow-xl sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          selectStageAndSyncScroll(
                            activeStepIndex > 0 ? activeStepIndex - 1 : INFRA_STAGES.length - 1
                          )
                        }
                        className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/50 hover:text-white whitespace-nowrap shrink-0"
                        aria-label="Etapa anterior de infraestrutura"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>

                      <div className="flex items-center gap-1 px-1">
                        {INFRA_STAGES.map((st, idx) => (
                          <button
                            key={st.step}
                            type="button"
                            onClick={() => selectStageAndSyncScroll(idx)}
                            className={`h-7 w-7 rounded-md font-mono text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                              idx === activeStepIndex
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                            aria-label={`Selecionar etapa ${st.index}: ${st.title}`}
                          >
                            {st.index}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          selectStageAndSyncScroll(
                            activeStepIndex < INFRA_STAGES.length - 1 ? activeStepIndex + 1 : 0
                          )
                        }
                        className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-500/50 hover:text-white whitespace-nowrap shrink-0"
                        aria-label="Próxima etapa de infraestrutura"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-800 pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-3">
                      <Sliders className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <label
                        htmlFor="infra-rack-explode"
                        className="text-xs text-slate-400 whitespace-nowrap shrink-0"
                      >
                        Módulos
                      </label>
                      <input
                        id="infra-rack-explode"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={rackExploded}
                        onChange={(e) => setRackExploded(parseFloat(e.target.value))}
                        className="h-1.5 w-20 cursor-pointer accent-cyan-400"
                        aria-label="Expandir gavetas do servidor 3D"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: 7 Progressive Narrative Stage Cards (5 Columns on Desktop) */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            {INFRA_STAGES.map((stage, idx) => {
              const isSelected = idx === activeStepIndex;
              return (
                <button
                  key={stage.step}
                  ref={(el) => {
                    stepElementsRef.current[idx] = el;
                  }}
                  type="button"
                  data-stage-index={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`group w-full rounded-2xl border p-6 text-left transition-all duration-200 focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                    isSelected
                      ? 'border-cyan-500/70 bg-[#0d1424] shadow-lg'
                      : 'border-slate-800/80 bg-[#0a0f1a]/80 hover:border-slate-700 hover:bg-[#0d1320]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-xs font-semibold text-cyan-400">
                      Etapa {stage.index}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      {stage.subsystemLabel}
                    </span>
                  </div>

                  <h3 className="mt-2 font-display text-xl font-semibold text-white">
                    {stage.index}. {stage.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {stage.description}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-slate-800/80 pt-4">
                    {stage.technicalChecklist.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}

            <div className="rounded-2xl border border-slate-800 bg-[#0b111e] p-6">
              <p className="text-sm text-slate-300">
                Precisa estruturar um servidor de arquivos, organizar o cabeamento/IP da rede local
                ou configurar rotinas automatizadas de backup?
              </p>
              <button
                type="button"
                onClick={() => onRequestService('Implantação de Servidores')}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-400 whitespace-nowrap shrink-0"
              >
                <span>Solicitar Avaliação de Infraestrutura</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
