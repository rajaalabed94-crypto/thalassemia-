import React, { useEffect, useRef } from 'react';
import { Language } from '../types';

interface HeroBloodstreamVisualProps {
  language: Language;
}

interface ParticlePoint {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  alpha: number;
  u: number;
}

interface CellCluster {
  particles: ParticlePoint[];
  cxRatio: number;
  cyRatio: number;
  baseRadiusRatio: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  floatSpeed: number;
  floatPhase: number;
  floatAmpX: number;
  floatAmpY: number;
  spinSpeedY: number;
  spinSpeedX: number;
}

// Deterministic pseudo-random helper for clean, repeatable organic distribution
function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generate mathematically accurate biconcave erythrocyte surface particles
function buildBiconcaveCellParticles(
  count: number,
  paletteType: 'main-mauve-beige' | 'small-crimson',
  seed: number
): ParticlePoint[] {
  const rand = seededRandom(seed);
  const particles: ParticlePoint[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  const mainMauveColors = ['#7D66A8', '#8F7AB8', '#A592C8', '#6B5494'];
  const mainBeigeColors = ['#E6D4BE', '#DCC6AC', '#EFE1CE', '#D2B99D'];
  const mainRedAccentColors = ['#C44B5E', '#B3364A'];

  const crimsonColors = ['#B93147', '#C94258', '#A42338', '#D65E72', '#8F1B2E'];

  for (let i = 0; i < count; i++) {
    // Bias slightly toward outer rim & central dimple for crisp sculptural silhouette
    const t = (i + 0.5) / count;
    // Smooth radial mapping so outer rim is well-defined and center has clear dimple
    const u = Math.min(0.995, Math.pow(t, 0.54));
    const angle = i * goldenAngle + (rand() - 0.5) * 0.14;

    // Evans & Fung biconcave red blood cell height profile
    const u2 = u * u;
    const u4 = u2 * u2;
    const base = Math.sqrt(Math.max(0, 1 - u2));
    const h = 0.48 * base * (0.207 + 2.003 * u2 - 1.123 * u4);

    // Alternate top and bottom surfaces, with slight organic jitter
    const side = i % 2 === 0 ? 1 : -1;
    const jitterR = (rand() - 0.5) * 0.025;
    const r = Math.max(0, Math.min(1, u + jitterR));

    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    const z = side * h + (rand() - 0.5) * 0.018;

    let color: string;
    let alpha: number;
    let size: number;

    if (paletteType === 'main-mauve-beige') {
      const accentRoll = rand();
      if (accentRoll < 0.032) {
        // Rare delicate crimson flecks
        color = mainRedAccentColors[Math.floor(rand() * mainRedAccentColors.length)];
        alpha = 0.72 + rand() * 0.22;
        size = 1.6 + rand() * 1.1;
      } else {
        // Center dimple & outer rim favor dusty mauve; raised ring blends mauve + warm beige
        const mauveBias = u < 0.32 ? 0.82 : u > 0.86 ? 0.65 : 0.44;
        if (rand() < mauveBias) {
          color = mainMauveColors[Math.floor(rand() * mainMauveColors.length)];
          alpha = (u < 0.3 ? 0.68 : 0.55) + rand() * 0.28;
        } else {
          color = mainBeigeColors[Math.floor(rand() * mainBeigeColors.length)];
          alpha = 0.65 + rand() * 0.28;
        }
        size = 1.45 + rand() * 1.35;
      }
    } else {
      color = crimsonColors[Math.floor(rand() * crimsonColors.length)];
      // Higher density / richness near rim and inner dimple
      const edgeFactor = u > 0.82 || u < 0.28 ? 0.82 : 0.65;
      alpha = edgeFactor + rand() * 0.18;
      size = 1.2 + rand() * 1.05;
    }

    particles.push({ x, y, z, size, color, alpha, u });
  }

  return particles;
}

export const HeroBloodstreamVisual: React.FC<HeroBloodstreamVisualProps> = ({ language }) => {
  const isAr = language === 'ar';
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseTargetRef.current = { x: nx, y: ny };
  };

  const handlePointerLeave = () => {
    mouseTargetRef.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Build exact cell clusters matching the approved generative particle sculpture
    const clusters: CellCluster[] = [
      // Main large central biconcave red blood cell (dusty mauve + warm beige)
      {
        particles: buildBiconcaveCellParticles(1950, 'main-mauve-beige', 101),
        cxRatio: 0.5,
        cyRatio: 0.52,
        baseRadiusRatio: 0.31,
        rotX: 0.64,
        rotY: -0.28,
        rotZ: -0.22,
        floatSpeed: 0.45,
        floatPhase: 0.0,
        floatAmpX: 4,
        floatAmpY: 7,
        spinSpeedY: 0.05,
        spinSpeedX: 0.025
      },
      // Upper-right smaller crimson particle RBC
      {
        particles: buildBiconcaveCellParticles(560, 'small-crimson', 202),
        cxRatio: 0.72,
        cyRatio: 0.30,
        baseRadiusRatio: 0.082,
        rotX: 0.82,
        rotY: -0.52,
        rotZ: 0.32,
        floatSpeed: 0.58,
        floatPhase: 1.4,
        floatAmpX: 5,
        floatAmpY: 6,
        spinSpeedY: -0.07,
        spinSpeedX: 0.04
      },
      // Lower-left smaller crimson particle RBC
      {
        particles: buildBiconcaveCellParticles(620, 'small-crimson', 303),
        cxRatio: 0.25,
        cyRatio: 0.76,
        baseRadiusRatio: 0.095,
        rotX: 0.76,
        rotY: 0.48,
        rotZ: -0.35,
        floatSpeed: 0.52,
        floatPhase: 2.7,
        floatAmpX: 5,
        floatAmpY: 6,
        spinSpeedY: 0.06,
        spinSpeedX: -0.03
      },
      // Lower-right smaller crimson particle RBC
      {
        particles: buildBiconcaveCellParticles(520, 'small-crimson', 404),
        cxRatio: 0.70,
        cyRatio: 0.83,
        baseRadiusRatio: 0.074,
        rotX: 0.68,
        rotY: -0.35,
        rotZ: 0.18,
        floatSpeed: 0.62,
        floatPhase: 4.1,
        floatAmpX: 4,
        floatAmpY: 5,
        spinSpeedY: -0.06,
        spinSpeedX: 0.035
      }
    ];

    let width = 800;
    let height = 460;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const updateCanvasSize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 460;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    updateCanvasSize();
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    resizeObserver.observe(container);

    let animationFrameId: number;
    const startTime = performance.now();

    const projectedBuffer: Array<{
      sx: number;
      sy: number;
      sz: number;
      r: number;
      color: string;
      alpha: number;
    }> = [];

    const renderFrame = (now: number) => {
      const elapsed = (now - startTime) * 0.001;

      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.05;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.05;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Warm clean alabaster-white background matching the screenshot
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.12,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72
      );
      bgGrad.addColorStop(0, '#FFFFFF');
      bgGrad.addColorStop(0.68, '#FFFEFC');
      bgGrad.addColorStop(1, '#FAF4EE');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft ambient shadow halo underneath central cell
      const minDim = Math.min(width, height);
      const isNarrow = width < 640;
      const scaleFactor = isNarrow ? minDim * 1.15 : Math.min(width * 0.58, height * 1.02);

      const haloGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.53,
        scaleFactor * 0.05,
        width * 0.5,
        height * 0.53,
        scaleFactor * 0.46
      );
      haloGrad.addColorStop(0, 'rgba(125, 102, 168, 0.06)');
      haloGrad.addColorStop(0.6, 'rgba(218, 198, 172, 0.04)');
      haloGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = haloGrad;
      ctx.fillRect(0, 0, width, height);

      projectedBuffer.length = 0;

      clusters.forEach((cluster, clusterIdx) => {
        const t = prefersReducedMotion ? 0 : elapsed * cluster.floatSpeed + cluster.floatPhase;
        const floatX = prefersReducedMotion ? 0 : Math.cos(t * 0.85) * cluster.floatAmpX;
        const floatY = prefersReducedMotion ? 0 : Math.sin(t) * cluster.floatAmpY;

        // Keep surrounding cells visible nicely on narrower mobile viewports too
        const cxRatio = isNarrow && clusterIdx > 0
          ? 0.5 + (cluster.cxRatio - 0.5) * 1.35
          : cluster.cxRatio;

        const cx = width * cxRatio + floatX + mouseCurrentRef.current.x * (clusterIdx === 0 ? 6 : 11);
        const cy = height * cluster.cyRatio + floatY + mouseCurrentRef.current.y * (clusterIdx === 0 ? 5 : 9);
        const radius = scaleFactor * cluster.baseRadiusRatio;

        const rx = cluster.rotX + (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.35 + cluster.floatPhase) * cluster.spinSpeedX) - mouseCurrentRef.current.y * 0.14;
        const ry = cluster.rotY + (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.28 + cluster.floatPhase) * 0.12 + elapsed * cluster.spinSpeedY) + mouseCurrentRef.current.x * 0.16;
        const rz = cluster.rotZ;

        const cosX = Math.cos(rx), sinX = Math.sin(rx);
        const cosY = Math.cos(ry), sinY = Math.sin(ry);
        const cosZ = Math.cos(rz), sinZ = Math.sin(rz);

        const sizeScale = Math.max(0.68, Math.min(1.15, width / 960));

        const pts = cluster.particles;
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];

          // Rotate Z
          const x1 = p.x * cosZ - p.y * sinZ;
          const y1 = p.x * sinZ + p.y * cosZ;
          const z1 = p.z;

          // Rotate Y
          const x2 = x1 * cosY + z1 * sinY;
          const y2 = y1;
          const z2 = -x1 * sinY + z1 * cosY;

          // Rotate X
          const x3 = x2;
          const y3 = y2 * cosX - z2 * sinX;
          const z3 = y2 * sinX + z2 * cosX;

          // Gentle perspective projection
          const perspective = 3.6 / (3.6 - z3 * 0.65);
          const sx = cx + x3 * radius * perspective;
          const sy = cy + y3 * radius * perspective;

          // Depth attenuation for realistic volumetric lighting
          const depthFactor = 0.72 + (z3 + 0.5) * 0.28;
          const particleRadius = p.size * perspective * sizeScale;
          const alpha = Math.max(0.25, Math.min(0.95, p.alpha * depthFactor));

          projectedBuffer.push({
            sx,
            sy,
            sz: z3 + (clusterIdx === 0 ? 0 : 0.2),
            r: particleRadius,
            color: p.color,
            alpha
          });
        }
      });

      // Painter's algorithm sort back-to-front for organic volumetric overlap
      projectedBuffer.sort((a, b) => a.sz - b.sz);

      for (let i = 0; i < projectedBuffer.length; i++) {
        const pt = projectedBuffer[i];
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.sx, pt.sy, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    animationFrameId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative w-full rounded-3xl overflow-hidden border border-[#EADFD5] shadow-xs bg-[#FFFCFA] min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] flex items-center justify-center select-none"
    >
      {/* Generative Particle Sculpture Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] block"
        aria-label={isAr ? 'المجسم الجزيئي لكرية الدم الحمراء' : 'Generative Red Blood Cell Particle Sculpture'}
      />

      {/* Minimal Top-Corner Identification Pill */}
      <div className="absolute top-4 start-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#EADFD5] shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C4667B] shrink-0" />
          <span className="text-xs font-bold text-[#1B1B3A]">
            {isAr ? 'المجسم الجزيئي • كرية الدم الحمراء' : 'Molecular Sculpture • Red Blood Cell'}
          </span>
        </div>
      </div>
    </div>
  );
};
