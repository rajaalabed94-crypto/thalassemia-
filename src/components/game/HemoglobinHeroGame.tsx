import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  X, 
  Shield, 
  Sparkles, 
  Heart, 
  Zap, 
  Award, 
  ChevronRight,
  BookOpen,
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Language } from '../../types';

interface HemoglobinHeroGameProps {
  language: Language;
  onClose: () => void;
  onNavigateToSupport?: () => void;
  embedded?: boolean;
}

// Procedural Web Audio Synthesizer
class GameAudio {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    // Lazy initialize on first interaction
  }

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playO2Pickup() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playChelation() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(329.63, now); // E4
    osc.frequency.linearRampToValueAtTime(659.25, now + 0.2); // E5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playTransfusion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.2);
    });
  }

  public playHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.2, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  }
}

// Medical Educational Tips unlocked through play
const EDUCATIONAL_FACTS = [
  {
    titleAr: 'ما هو الهيموجلوبين؟',
    textAr: 'الهيموجلوبين هو البروتين المسؤول عن حمل الأكسجين في خلايا الدم الحمراء إلى جميع أعضاء الجسم.',
    titleEn: 'What is Hemoglobin?',
    textEn: 'Hemoglobin is the oxygen-carrying protein inside red blood cells supplying vital body organs.'
  },
  {
    titleAr: 'سبب الإجهاد وضيق التنفس',
    textAr: 'في الثلاسيميا، ينخفض عدد كريات الدم الحمراء ويقل الهيموجلوبين، مما يقلل وصول الأكسجين للأنسجة ويسبب التعب والضيق.',
    titleEn: 'Origin of Fatigue',
    textEn: 'Low hemoglobin reduces oxygen delivery to tissues, triggering chronic fatigue and shortness of breath.'
  },
  {
    titleAr: 'دور أدوية طرد وسحب الحديد',
    textAr: 'نقل الدم المتكرر يسبب تراكم الحديد في الجسم؛ تعمل أدوية طرد الحديد على حماية القلب والكبد من أي ضرر.',
    titleEn: 'Iron Chelation Therapy',
    textEn: 'Chelation medications bind excess iron from repeat transfusions, protecting the heart and liver.'
  },
  {
    titleAr: 'الفحص الطبي قبل الزواج',
    textAr: 'الفحص الشامل قبل الزواج يحد من ولادة أطفال مصابين بالثلاسيميا عبر اكتشاف حاملي الصفة الوراثية مبكراً.',
    titleEn: 'Premarital Screening',
    textEn: 'Comprehensive premarital testing halts inheritance cycles by identifying healthy trait carriers.'
  }
];

export const HemoglobinHeroGame: React.FC<HemoglobinHeroGameProps> = ({
  language,
  onClose,
  onNavigateToSupport,
  embedded = false
}) => {
  const isAr = language === 'ar';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game Shell States: 'title' | 'playing' | 'paused' | 'gameover' | 'victory'
  const [gameState, setGameState] = useState<'title' | 'playing' | 'paused' | 'gameover' | 'victory'>('title');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('thal_game_highscore') || '0', 10);
  });
  const [oxygenLevel, setOxygenLevel] = useState<number>(100);
  const [chelationCharges, setChelationCharges] = useState<number>(3);
  const [deliveredOrgans, setDeliveredOrgans] = useState<number>(0);
  const [currentFactIndex, setCurrentFactIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Audio Synth Instance
  const audioRef = useRef<GameAudio>(new GameAudio());

  // Game Engine Internal Variables Ref
  const engineRef = useRef({
    animationFrameId: 0,
    lastTime: 0,
    width: 800,
    height: 500,
    // Player RBC
    player: {
      x: 120,
      y: 250,
      vx: 0,
      vy: 0,
      radius: 22,
      oxygen: 100,
      chelationActive: false,
      chelationTimer: 0,
      invulnerableTimer: 0,
    },
    // Input state
    keys: {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      KeyW: false,
      KeyS: false,
      KeyA: false,
      KeyD: false,
      Space: false,
    },
    // Game entities
    o2Pickups: [] as Array<{ x: number; y: number; radius: number; speed: number; pulse: number }>,
    ironCrystals: [] as Array<{ x: number; y: number; radius: number; speed: number; rot: number; rotSpeed: number }>,
    bloodBoosts: [] as Array<{ x: number; y: number; radius: number; speed: number }>,
    particles: [] as Array<{ x: number; y: number; vx: number; vy: number; color: string; life: number; maxLife: number; size: number }>,
    organsDelivered: 0,
    targetOrgans: 3,
    score: 0,
    chelationCharges: 3,
    spawnTimer: 0,
    screenShake: 0,
    isPaused: false,
    isOver: false,
  });

  // Toggle Mute
  const toggleMute = () => {
    setIsMuted(prev => {
      audioRef.current.isMuted = !prev;
      return !prev;
    });
  };

  // Trigger Chelation Shield
  const activateChelationShield = useCallback(() => {
    const engine = engineRef.current;
    if (engine.chelationCharges > 0 && !engine.player.chelationActive && !engine.isOver) {
      engine.chelationCharges -= 1;
      setChelationCharges(engine.chelationCharges);
      engine.player.chelationActive = true;
      engine.player.chelationTimer = 4.0; // 4 seconds of shield
      audioRef.current.playChelation();

      // Emit protective pulse particles
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        engine.particles.push({
          x: engine.player.x,
          y: engine.player.y,
          vx: Math.cos(angle) * 160,
          vy: Math.sin(angle) * 160,
          color: '#38bdf8',
          life: 0.5,
          maxLife: 0.5,
          size: 4
        });
      }
    }
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }

      const engine = engineRef.current;

      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'title') {
          startGame();
          return;
        } else if (gameState === 'playing') {
          activateChelationShield();
        }
      }

      if (
        (e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') &&
        gameState === 'playing'
      ) {
        e.preventDefault();
      }

      if (e.code === 'Escape') {
        if (gameState === 'playing') {
          setGameState('paused');
          engine.isPaused = true;
        } else if (gameState === 'paused') {
          setGameState('playing');
          engine.isPaused = false;
        }
      }

      if (e.code in engine.keys) {
        // @ts-expect-error key index
        engine.keys[e.code] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (e.code in engine.keys) {
        // @ts-expect-error key index
        engine.keys[e.code] = false;
      }
    };

    const handleBlur = () => {
      // Clear keys on window blur as per game guidelines
      const engine = engineRef.current;
      Object.keys(engine.keys).forEach(k => {
        // @ts-expect-error key index
        engine.keys[k] = false;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameState, activateChelationShield]);

  // Main Game Loop Initialization
  const startGame = () => {
    const engine = engineRef.current;
    engine.player.x = 120;
    engine.player.y = 250;
    engine.player.vx = 0;
    engine.player.vy = 0;
    engine.player.oxygen = 100;
    engine.player.chelationActive = false;
    engine.player.chelationTimer = 0;
    engine.player.invulnerableTimer = 0;

    engine.o2Pickups = [];
    engine.ironCrystals = [];
    engine.bloodBoosts = [];
    engine.particles = [];
    engine.organsDelivered = 0;
    engine.score = 0;
    engine.chelationCharges = 3;
    engine.spawnTimer = 0;
    engine.screenShake = 0;
    engine.isPaused = false;
    engine.isOver = false;

    setScore(0);
    setOxygenLevel(100);
    setChelationCharges(3);
    setDeliveredOrgans(0);
    setCurrentFactIndex(0);
    setGameState('playing');
  };

  // Main Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      engineRef.current.width = rect.width;
      engineRef.current.height = rect.height;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const engine = engineRef.current;
    engine.lastTime = performance.now();

    const renderLoop = (timestamp: number) => {
      const rawDt = (timestamp - engine.lastTime) / 1000;
      engine.lastTime = timestamp;
      const dt = Math.min(rawDt, 0.05); // Clamp dt to max 0.05s as per guidelines

      const w = engine.width;
      const h = engine.height;

      // Update simulation if playing
      if (gameState === 'playing' && !engine.isPaused && !engine.isOver) {
        
        // 1. Oxygen drains slowly over time
        engine.player.oxygen -= dt * 3.5;
        if (engine.player.oxygen <= 0) {
          engine.player.oxygen = 0;
          engine.isOver = true;
          setGameState('gameover');
          audioRef.current.playHit();
        }
        setOxygenLevel(Math.round(engine.player.oxygen));

        // 2. Player Input Acceleration
        const p = engine.player;
        const speed = 360;
        let moveX = 0;
        let moveY = 0;

        if (engine.keys.ArrowUp || engine.keys.KeyW) moveY -= 1;
        if (engine.keys.ArrowDown || engine.keys.KeyS) moveY += 1;
        if (engine.keys.ArrowLeft || engine.keys.KeyA) moveX -= 1;
        if (engine.keys.ArrowRight || engine.keys.KeyD) moveX += 1;

        // Normalize diagonal
        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.7071;
          moveY *= 0.7071;
        }

        p.vx += (moveX * speed - p.vx) * 10 * dt;
        p.vy += (moveY * speed - p.vy) * 10 * dt;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Bound player in viewport
        p.x = Math.max(p.radius + 10, Math.min(w - p.radius - 10, p.x));
        p.y = Math.max(p.radius + 10, Math.min(h - p.radius - 10, p.y));

        // Timers
        if (p.chelationTimer > 0) {
          p.chelationTimer -= dt;
          if (p.chelationTimer <= 0) {
            p.chelationActive = false;
          }
        }

        if (p.invulnerableTimer > 0) {
          p.invulnerableTimer -= dt;
        }

        if (engine.screenShake > 0) {
          engine.screenShake = Math.max(0, engine.screenShake - dt * 25);
        }

        // 3. Spawning System
        engine.spawnTimer += dt;
        if (engine.spawnTimer > 0.85) {
          engine.spawnTimer = 0;

          // Spawn Oxygen Packets (O2)
          if (Math.random() < 0.75) {
            engine.o2Pickups.push({
              x: w + 30,
              y: 50 + Math.random() * (h - 100),
              radius: 14,
              speed: 130 + Math.random() * 80,
              pulse: 0
            });
          }

          // Spawn Iron Crystal Hazards
          if (Math.random() < 0.65) {
            engine.ironCrystals.push({
              x: w + 40,
              y: 50 + Math.random() * (h - 100),
              radius: 16,
              speed: 150 + Math.random() * 90,
              rot: Math.random() * Math.PI,
              rotSpeed: (Math.random() - 0.5) * 4
            });
          }

          // Rare Blood Transfusion Boost
          if (Math.random() < 0.15) {
            engine.bloodBoosts.push({
              x: w + 30,
              y: 80 + Math.random() * (h - 160),
              radius: 18,
              speed: 110
            });
          }
        }

        // 4. Update O2 Pickups
        for (let i = engine.o2Pickups.length - 1; i >= 0; i--) {
          const item = engine.o2Pickups[i];
          item.x -= item.speed * dt;
          item.pulse += dt * 4;

          // Collision with Player
          const dist = Math.hypot(p.x - item.x, p.y - item.y);
          if (dist < p.radius + item.radius) {
            // Collect O2
            engine.o2Pickups.splice(i, 1);
            p.oxygen = Math.min(100, p.oxygen + 18);
            engine.score += 50;
            setScore(engine.score);
            audioRef.current.playO2Pickup();

            // Particles
            for (let k = 0; k < 12; k++) {
              const ang = Math.random() * Math.PI * 2;
              engine.particles.push({
                x: item.x,
                y: item.y,
                vx: Math.cos(ang) * (60 + Math.random() * 80),
                vy: Math.sin(ang) * (60 + Math.random() * 80),
                color: '#38bdf8',
                life: 0.4,
                maxLife: 0.4,
                size: 3
              });
            }

            // Organ Delivery Progress
            if (engine.score % 250 === 0 && engine.organsDelivered < engine.targetOrgans) {
              engine.organsDelivered += 1;
              setDeliveredOrgans(engine.organsDelivered);
              setCurrentFactIndex(engine.organsDelivered % EDUCATIONAL_FACTS.length);
              audioRef.current.playVictory();

              // Check victory condition (all 3 vital organs oxygenated!)
              if (engine.organsDelivered >= engine.targetOrgans) {
                engine.isOver = true;
                setGameState('victory');
                if (engine.score > highScore) {
                  setHighScore(engine.score);
                  localStorage.setItem('thal_game_highscore', engine.score.toString());
                }
              }
            }
          } else if (item.x < -40) {
            engine.o2Pickups.splice(i, 1);
          }
        }

        // 5. Update Iron Crystals Hazards
        for (let i = engine.ironCrystals.length - 1; i >= 0; i--) {
          const iron = engine.ironCrystals[i];
          iron.x -= iron.speed * dt;
          iron.rot += iron.rotSpeed * dt;

          // Collision with Player
          const dist = Math.hypot(p.x - iron.x, p.y - iron.y);
          if (dist < p.radius + iron.radius) {
            // If Chelation shield active -> neutralize iron!
            if (p.chelationActive) {
              engine.ironCrystals.splice(i, 1);
              engine.score += 100;
              setScore(engine.score);
              audioRef.current.playChelation();

              // Iron vaporized particles
              for (let k = 0; k < 16; k++) {
                const ang = Math.random() * Math.PI * 2;
                engine.particles.push({
                  x: iron.x,
                  y: iron.y,
                  vx: Math.cos(ang) * (80 + Math.random() * 120),
                  vy: Math.sin(ang) * (80 + Math.random() * 120),
                  color: '#f59e0b',
                  life: 0.5,
                  maxLife: 0.5,
                  size: 3
                });
              }
            } else if (p.invulnerableTimer <= 0) {
              // Damage hit!
              engine.ironCrystals.splice(i, 1);
              p.oxygen = Math.max(0, p.oxygen - 22);
              p.invulnerableTimer = 1.2;
              engine.screenShake = 12;
              audioRef.current.playHit();

              if (p.oxygen <= 0) {
                engine.isOver = true;
                setGameState('gameover');
              }
            }
          } else if (iron.x < -40) {
            engine.ironCrystals.splice(i, 1);
          }
        }

        // 6. Update Blood Transfusion Boosts
        for (let i = engine.bloodBoosts.length - 1; i >= 0; i--) {
          const boost = engine.bloodBoosts[i];
          boost.x -= boost.speed * dt;

          const dist = Math.hypot(p.x - boost.x, p.y - boost.y);
          if (dist < p.radius + boost.radius) {
            engine.bloodBoosts.splice(i, 1);
            p.oxygen = 100;
            engine.chelationCharges = Math.min(5, engine.chelationCharges + 1);
            setChelationCharges(engine.chelationCharges);
            engine.score += 150;
            setScore(engine.score);
            audioRef.current.playTransfusion();

            for (let k = 0; k < 20; k++) {
              const ang = Math.random() * Math.PI * 2;
              engine.particles.push({
                x: boost.x,
                y: boost.y,
                vx: Math.cos(ang) * 140,
                vy: Math.sin(ang) * 140,
                color: '#ef4444',
                life: 0.6,
                maxLife: 0.6,
                size: 4
              });
            }
          } else if (boost.x < -40) {
            engine.bloodBoosts.splice(i, 1);
          }
        }

        // 7. Update Particles
        for (let i = engine.particles.length - 1; i >= 0; i--) {
          const pt = engine.particles[i];
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.life -= dt;
          if (pt.life <= 0) {
            engine.particles.splice(i, 1);
          }
        }
      }

      // ==========================================
      // RENDERING SECTION (Clean 60 FPS Canvas)
      // ==========================================
      ctx.save();

      // Camera Shake
      if (engine.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * engine.screenShake;
        const shakeY = (Math.random() - 0.5) * engine.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Biological Bloodstream Ambient Background
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#380B10');
      bgGrad.addColorStop(0.5, '#4F1018');
      bgGrad.addColorStop(1, '#270508');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Flowing Capillary Wave Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 3;
      const timeSec = timestamp * 0.001;
      for (let y = 60; y < h; y += 90) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= w; x += 30) {
          const sinY = y + Math.sin(x * 0.01 + timeSec * 2) * 18;
          ctx.lineTo(x, sinY);
        }
        ctx.stroke();
      }

      // 2. Draw O2 Pickups
      engine.o2Pickups.forEach(o2 => {
        const pulseR = o2.radius + Math.sin(o2.pulse) * 2;
        ctx.save();
        // Glow
        const grad = ctx.createRadialGradient(o2.x, o2.y, 2, o2.x, o2.y, pulseR + 8);
        grad.addColorStop(0, '#38bdf8');
        grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o2.x, o2.y, pulseR + 8, 0, Math.PI * 2);
        ctx.fill();

        // Core O2 Bubble
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(o2.x, o2.y, pulseR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('O₂', o2.x, o2.y);
        ctx.restore();
      });

      // 3. Draw Iron Crystals (Sharp jagged hazards)
      engine.ironCrystals.forEach(iron => {
        ctx.save();
        ctx.translate(iron.x, iron.y);
        ctx.rotate(iron.rot);

        ctx.fillStyle = '#78350f';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;

        ctx.beginPath();
        const spikes = 6;
        for (let s = 0; s < spikes; s++) {
          const ang = (s / spikes) * Math.PI * 2;
          const r = s % 2 === 0 ? iron.radius : iron.radius * 0.55;
          const sx = Math.cos(ang) * r;
          const sy = Math.sin(ang) * r;
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 8px Cairo, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Fe⁺', 0, 0);
        ctx.restore();
      });

      // 4. Draw Blood Transfusion Boosts
      engine.bloodBoosts.forEach(boost => {
        ctx.save();
        ctx.fillStyle = '#dc2626';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(boost.x, boost.y, boost.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+', boost.x, boost.y);
        ctx.restore();
      });

      // 5. Draw Particles
      engine.particles.forEach(pt => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 6. Draw Player (Biconcave Red Blood Cell)
      const p = engine.player;
      ctx.save();
      ctx.translate(p.x, p.y);

      // Invulnerability flash
      if (p.invulnerableTimer > 0 && Math.floor(timestamp / 70) % 2 === 0) {
        ctx.globalAlpha = 0.4;
      }

      // Chelation Shield Aura
      if (p.chelationActive) {
        ctx.save();
        const auraPulse = Math.sin(timestamp * 0.01) * 3;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, p.radius + 12 + auraPulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
        ctx.beginPath();
        ctx.arc(0, 0, p.radius + 12 + auraPulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Outer Red Blood Cell Circle
      const rbcGrad = ctx.createRadialGradient(-4, -4, 4, 0, 0, p.radius);
      rbcGrad.addColorStop(0, '#f87171');
      rbcGrad.addColorStop(0.6, '#dc2626');
      rbcGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = rbcGrad;
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Biconcave Inner Indentation
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * 0.52, 0, Math.PI * 2);
      ctx.fill();

      // Hemoglobin Molecule Indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Hb', 0, 0);

      ctx.restore();
      ctx.restore();

      engine.animationFrameId = requestAnimationFrame(renderLoop);
    };

    engine.animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(engine.animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameState]);

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing' || engineRef.current.isPaused || engineRef.current.isOver) return;
    if (e.pointerType === 'mouse' && e.buttons === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;
    const p = engineRef.current.player;
    p.x += (targetX - p.x) * 0.25;
    p.y += (targetY - p.y) * 0.25;
  };

  return (
    <div
      className={
        embedded
          ? 'relative w-full h-[72vh] min-h-[540px] max-h-[780px] rounded-3xl overflow-hidden border border-[#EADFD5] shadow-xl bg-slate-950 flex flex-col font-sans select-none animate-in fade-in'
          : 'fixed inset-0 z-50 bg-slate-950 flex flex-col font-sans select-none overflow-hidden animate-in fade-in'
      }
    >
      
      {/* Perimeter Top Status Cluster (Unobstructed Low-Occlusion HUD) */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 py-3 bg-slate-900/80 backdrop-blur-md border-b border-white/10 text-white">
        
        {/* Left cluster: Game Title & Close */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isAr ? 'خروج من اللعبة' : 'Exit Game'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-xs shadow-md">
              Hb
            </div>
            <div>
              <span className="text-xs font-black block tracking-wide">
                {isAr ? 'بطل الهيموجلوبين' : 'Hemoglobin Hero'}
              </span>
              <span className="text-[10px] text-[#E4D7FC] font-bold">
                {isAr ? 'رحلة خلايا الدم والأكسجين' : 'Bloodstream & O₂ Quest'}
              </span>
            </div>
          </div>
        </div>

        {/* Center cluster: HUD Metrics */}
        {gameState === 'playing' && (
          <div className="flex items-center gap-4 sm:gap-8">
            
            {/* Oxygen Saturation Gauge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-sky-400">O₂</span>
              <div className="w-24 sm:w-36 bg-slate-800 h-2.5 rounded-full overflow-hidden border border-white/20">
                <div 
                  className={`h-full transition-all duration-200 ${
                    oxygenLevel > 50 ? 'bg-sky-400' : oxygenLevel > 25 ? 'bg-purple-400' : 'bg-red-500 animate-pulse'
                  }`}
                  style={{ width: `${oxygenLevel}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold tabular-nums">
                {oxygenLevel}%
              </span>
            </div>

            {/* Iron Chelation Shields */}
            <div className="flex items-center gap-1.5" title={isAr ? 'أدوية طرد الحديد (اضغط مسافة)' : 'Iron Chelation Shield (Space)'}>
              <Shield className="w-4 h-4 text-[#E4D7FC]" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full border ${
                      i <= chelationCharges 
                        ? 'bg-[#634B8F] border-[#E4D7FC]' 
                        : 'bg-transparent border-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Organs Saved */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-black text-emerald-400">
              <Heart className="w-4 h-4 fill-emerald-400" />
              <span>{isAr ? 'الأعضاء المُغذاة:' : 'Organs:'} {deliveredOrgans}/3</span>
            </div>

            {/* Score */}
            <div className="font-mono text-sm font-black text-[#E4D7FC] tabular-nums">
              {score} PTS
            </div>
          </div>
        )}

        {/* Right cluster: Controls & Audio */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title={isMuted ? (isAr ? 'تشغيل الصوت' : 'Unmute') : (isAr ? 'كتم الصوت' : 'Mute')}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Playfield Canvas Container */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerMove={handleCanvasPointerMove}
          onPointerDown={handleCanvasPointerMove}
          className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        />

        {/* 1. Title Screen Modal */}
        {gameState === 'title' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs text-white">
            <div className="max-w-lg w-full bg-slate-900/90 border border-white/20 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
              
              {/* Bespoke Title Lockup */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-black border border-red-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'لعبة تفاعلية تعليمية توعوية' : 'Interactive Educational Simulation'}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                  {isAr ? 'بطل الهيموجلوبين' : 'Hemoglobin Hero'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-sm mx-auto">
                  {isAr 
                    ? 'قُد كريات الدم الحمراء، انقل الأكسجين للأعضاء الحيوية، واطرد تراكمات الحديد لحماية القلب والكبد!' 
                    : 'Pilot red blood cells, deliver oxygen packets, and activate iron-chelation shields!'}
                </p>
              </div>

              {/* Game Mechanics Brief */}
              <div className="grid grid-cols-3 gap-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="w-7 h-7 rounded-full bg-sky-500 text-white font-black mx-auto flex items-center justify-center text-[10px]">O₂</div>
                  <strong className="block text-white text-[11px]">{isAr ? 'اجمع الأكسجين' : 'Collect O₂'}</strong>
                  <span className="text-[10px] text-slate-400">{isAr ? 'يزيل الإجهاد وضيق التنفس' : 'Replenishes stamina'}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="w-7 h-7 rounded-full bg-[#634B8F] text-[#E4D7FC] font-black mx-auto flex items-center justify-center text-[10px]">Fe</div>
                  <strong className="block text-white text-[11px]">{isAr ? 'اطرد الحديد' : 'Shield Fe'}</strong>
                  <span className="text-[10px] text-slate-400">{isAr ? 'اضغط مسافة للدرع' : 'Press Space'}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <div className="w-7 h-7 rounded-full bg-red-600 text-white font-black mx-auto flex items-center justify-center text-[10px]">+</div>
                  <strong className="block text-white text-[11px]">{isAr ? 'نقل الدم' : 'Transfusion'}</strong>
                  <span className="text-[10px] text-slate-400">{isAr ? 'يعيد الشحن بالكامل' : '100% Boost'}</span>
                </div>
              </div>

              {/* Start Button CTA */}
              <div className="space-y-3">
                <button
                  onClick={startGame}
                  className="w-full py-4 rounded-2xl bg-[#9E1B28] hover:bg-[#B3202E] text-white font-black text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-[#E4D7FC]/30"
                >
                  <Play className="w-5 h-5 fill-white ltr:translate-x-0.5 rtl:-translate-x-0.5" />
                  <span>{isAr ? 'ابدأ اللعبة (اضغط مسافة)' : 'Start Game (Press Space)'}</span>
                </button>

                {/* Control-hint Line as per guidelines */}
                <p className="text-[11px] text-slate-400 font-mono">
                  {isAr 
                    ? 'التحكم: الأسهم أو WASD للتحرك · مسافة للدرع · Esc للإيقاف' 
                    : 'Controls: WASD Move · Space Shield · Esc Pause'}
                </p>
              </div>

              {highScore > 0 && (
                <div className="pt-2 border-t border-slate-800 text-xs text-[#E4D7FC] font-mono">
                  {isAr ? 'أعلى رقم قياسي:' : 'High Score:'} {highScore} PTS
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. Victory Modal */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs text-white">
            <div className="max-w-md w-full bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                  {isAr ? 'أحسنت صنعاً يا بطل!' : 'Mission Accomplished!'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'تمت تغذية جميع الأعضاء بنجاح!' : 'All Vital Organs Oxygenated!'}
                </h2>
                <p className="text-xs text-slate-300">
                  {isAr 
                    ? 'لقد خففت أعراض الإجهاد وضيق التنفس وحميت الجسم من أضرار تراكم الحديد.' 
                    : 'You alleviated fatigue and breathlessness while protecting organs from iron overload.'}
                </p>
              </div>

              {/* Fact Card */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-left rtl:text-right space-y-1">
                <span className="text-[11px] font-black text-[#E4D7FC] block">
                  {EDUCATIONAL_FACTS[currentFactIndex].titleAr}
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {EDUCATIONAL_FACTS[currentFactIndex].textAr}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={startGame}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isAr ? 'العب مجدداً' : 'Play Again'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'إنهاء' : 'Exit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Game Over Modal */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs text-white">
            <div className="max-w-md w-full bg-slate-900 border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
              
              <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 mx-auto flex items-center justify-center">
                <Heart className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-red-400 tracking-wider">
                  {isAr ? 'نفد الأكسجين وتراكم الحديد' : 'Oxygen Depleted'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'محاولة جيدة يا بطل!' : 'Good Effort!'}
                </h2>
                <p className="text-xs text-slate-300">
                  {isAr 
                    ? 'في الثلاسيميا، يحتاج المريض إلى التزام مستمر بنقل الدم الدوري وأدوية طرد الحديد للحفاظ على عافيته.' 
                    : 'Patients maintain their health through regular transfusions and daily iron chelation.'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={startGame}
                  className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isAr ? 'إعادة المحاولة' : 'Try Again'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'خروج' : 'Exit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Pause Modal */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs text-white">
            <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 text-center space-y-5 animate-in zoom-in-95">
              <h3 className="text-xl font-black text-white">
                {isAr ? 'اللعبة متوقفة مؤقتاً' : 'Game Paused'}
              </h3>
              
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    engineRef.current.isPaused = false;
                    setGameState('playing');
                  }}
                  className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs cursor-pointer"
                >
                  {isAr ? 'استئناف اللعب' : 'Resume'}
                </button>
                <button
                  onClick={startGame}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  {isAr ? 'إعادة تشغيل' : 'Restart'}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white font-bold text-xs cursor-pointer"
                >
                  {isAr ? 'خروج' : 'Exit Game'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile On-Screen Action Button for Shield */}
        {gameState === 'playing' && (
          <div className="sm:hidden absolute bottom-5 right-5 rtl:right-auto rtl:left-5 z-20">
            <button
              onClick={activateChelationShield}
              className="w-16 h-16 rounded-full bg-[#634B8F] text-white font-black text-xs shadow-2xl flex flex-col items-center justify-center border-2 border-[#E4D7FC] active:scale-90"
            >
              <Shield className="w-5 h-5 text-[#E4D7FC]" />
              <span className="text-[9px] font-black">{isAr ? 'درع' : 'Shield'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
