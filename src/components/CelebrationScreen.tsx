import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface CelebrationScreenProps {
  onReplayInvitation: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle';
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  left: string;
  duration: number;
  delay: number;
  driftX: number;
  scale: number;
}

const CELEBRATION_COLORS = ['#134E3A', '#12263A', '#C9A24D', '#D97706', '#BE123C', '#2E7D63'];

const FLOATING_EMOJIS: FloatingEmoji[] = [
  { id: 1, emoji: '❤️', left: '8%', duration: 5.5, delay: 0.1, driftX: 20, scale: 1.1 },
  { id: 2, emoji: '🍽️', left: '16%', duration: 6.2, delay: 0.4, driftX: -18, scale: 1.0 },
  { id: 3, emoji: '🍛', left: '26%', duration: 5.8, delay: 0.8, driftX: 24, scale: 1.15 },
  { id: 4, emoji: '💖', left: '36%', duration: 6.6, delay: 0.2, driftX: -22, scale: 0.95 },
  { id: 5, emoji: '🍰', left: '48%', duration: 5.4, delay: 0.6, driftX: 16, scale: 1.1 },
  { id: 6, emoji: '🥘', left: '60%', duration: 6.4, delay: 0.3, driftX: -20, scale: 1.05 },
  { id: 7, emoji: '❤️', left: '72%', duration: 5.9, delay: 0.7, driftX: 18, scale: 1.15 },
  { id: 8, emoji: '☕', left: '82%', duration: 6.1, delay: 0.5, driftX: -15, scale: 1.0 },
  { id: 9, emoji: '✨', left: '91%', duration: 5.2, delay: 0.9, driftX: 14, scale: 1.05 },
  { id: 10, emoji: '🍽️', left: '12%', duration: 6.8, delay: 1.5, driftX: -12, scale: 0.95 },
  { id: 11, emoji: '💖', left: '42%', duration: 6.0, delay: 1.8, driftX: 22, scale: 1.05 },
  { id: 12, emoji: '🍰', left: '76%', duration: 6.5, delay: 1.3, driftX: -16, scale: 1.0 },
];

export function CelebrationScreen({ onReplayInvitation }: CelebrationScreenProps) {
  const shouldReduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const [burstKey, setBurstKey] = useState(0);

  const spawnCelebration = useCallback(() => {
    if (shouldReduceMotion) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const next: Particle[] = [];

    // Confetti shower from top corners and center
    for (let i = 0; i < 110; i++) {
      const originX = vw * (0.15 + Math.random() * 0.7);
      const originY = vh * (0.15 + Math.random() * 0.25);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      const speed = 4 + Math.random() * 9;
      next.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 5 + Math.random() * 5,
        color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
        alpha: 1,
        decay: 0.007 + Math.random() * 0.006,
        gravity: 0.16,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.18,
        shape: 'rect',
      });
    }

    // Three small firework starbursts
    const fireworkCenters = [
      { cx: vw * 0.22, cy: vh * 0.24 },
      { cx: vw * 0.78, cy: vh * 0.22 },
      { cx: vw * 0.5, cy: vh * 0.16 },
    ];

    for (const { cx, cy } of fireworkCenters) {
      const color = CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)];
      for (let i = 0; i < 34; i++) {
        const angle = (Math.PI * 2 * i) / 34 + (Math.random() - 0.5) * 0.12;
        const speed = 2.2 + Math.random() * 4.5;
        next.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2.5 + Math.random() * 2.5,
          color: i % 3 === 0 ? '#C9A24D' : color,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.008,
          gravity: 0.05,
          rotation: 0,
          rotationSpeed: 0,
          shape: 'circle',
        });
      }
    }

    particlesRef.current = [...particlesRef.current, ...next];
  }, [shouldReduceMotion]);

  useEffect(() => {
    spawnCelebration();
    const t1 = window.setTimeout(spawnCelebration, 750);
    return () => window.clearTimeout(t1);
  }, [burstKey, spawnCelebration]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const list = particlesRef.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.985;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y > window.innerHeight + 40) {
          list.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size * 0.32, p.size, p.size * 0.64);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [shouldReduceMotion]);

  return (
    <>
      {/* Full-viewport Confetti & Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40"
      />

      {/* Floating Hearts & Food Emojis */}
      {!shouldReduceMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 overflow-hidden z-30"
        >
          {FLOATING_EMOJIS.map((item) => (
            <motion.div
              key={`${burstKey}-${item.id}`}
              style={{ left: item.left, bottom: '-48px' }}
              className="absolute text-2xl sm:text-3xl select-none"
              initial={{ y: 0, x: 0, opacity: 0, scale: item.scale * 0.8 }}
              animate={{
                y: '-112vh',
                x: [0, item.driftX, -item.driftX * 0.5, 0],
                opacity: [0, 0.95, 0.9, 0],
                scale: [item.scale * 0.8, item.scale, item.scale * 0.95],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            >
              {item.emoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* Acceptance Card */}
      <motion.section
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -16 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      >
        <article className="relative paper-surface rounded-2xl border border-[#DFD5C2] shadow-[0_28px_70px_-18px_rgba(19,78,58,0.18)] px-6 py-9 sm:px-12 sm:py-12 text-center">
          {/* Corner Filigree Accents */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 left-3.5 w-5 h-5 border-t border-l border-[#C9A24D]/65 rounded-tl-md"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 right-3.5 w-5 h-5 border-t border-r border-[#C9A24D]/65 rounded-tr-md"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3.5 left-3.5 w-5 h-5 border-b border-l border-[#C9A24D]/65 rounded-bl-md"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3.5 right-3.5 w-5 h-5 border-b border-r border-[#C9A24D]/65 rounded-br-md"
          />

          <p className="text-xs sm:text-sm tracking-[0.08em] text-[#134E3A] font-semibold mb-3">
            Dawat Manzoor &middot; Tehzeeb-o-Khushi
          </p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-[#12263A] leading-tight"
          >
            🎉 Wah Sir! Kya Baat Hai! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
            className="mt-3 font-serif text-2xl sm:text-3xl font-semibold text-[#134E3A]"
          >
            Lunch officially confirm ho gaya! 🍽️❤️
          </motion.p>

          <div className="flex items-center justify-center gap-3 my-6" aria-hidden="true">
            <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C9A24D]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#B88A3B]" />
            <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C9A24D]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.45 }}
            className="space-y-4 text-[#2C3A47] text-[15.5px] sm:text-base leading-[1.75] max-w-xl mx-auto"
          >
            <p className="font-semibold text-[#12263A] text-base sm:text-lg">
              Sir Syed Hassan Zaidi aur Sir Adnan Ahmed, aap dono ka bohat shukriya!
            </p>

            <p>
              Ab ek achay se lunch, thori si guftagu aur bohat sari achi yaadein banengi. 😊
            </p>

            <div className="border-y border-[#E2D6BF] bg-[#F8F4EC]/80 px-5 py-3.5 rounded-lg my-4">
              <p className="text-sm sm:text-[15px] text-[#5B4B32] italic">
                Promise: Is lunch mein koi surprise quiz, viva ya assignment nahi hoga. 😂
              </p>
            </div>

            <p>
              Bas khana hoga, baatein hongi aur hopefully dessert bhi hoga! 🍰
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-7 font-serif text-xl sm:text-2xl italic font-medium text-[#134E3A]"
          >
            Looking forward to having a wonderful time with you both, Sir. ❤️
          </motion.p>

          <div className="mt-8 pt-6 border-t border-[#EAE0CE] flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setBurstKey((k) => k + 1);
                spawnCelebration();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#134E3A] text-[#FFFDF9] text-sm font-semibold hover:bg-[#0F3F2E] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A3B]"
            >
              Dobara Jashn Manayein ✨
            </button>
            <button
              type="button"
              onClick={onReplayInvitation}
              className="px-5 py-2.5 rounded-xl border border-[#DFD5C2] bg-[#FBF9F5] text-[#12263A] text-sm font-medium hover:border-[#B88A3B] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A3B]"
            >
              Dawatnama Dobara Dekhein
            </button>
          </div>
        </article>
      </motion.section>
    </>
  );
}
