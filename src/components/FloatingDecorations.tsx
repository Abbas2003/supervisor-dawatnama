import { motion, useReducedMotion } from 'motion/react';

interface FloatingItem {
  id: number;
  x: string;
  y: string;
  size: number;
  duration: number;
  delay: number;
  driftY: number;
  driftX: number;
  rotate: number;
  kind: 'diamond' | 'leaf' | 'ring' | 'utensil';
}

const DECORATIVE_ITEMS: FloatingItem[] = [
  { id: 1, x: '7%', y: '14%', size: 18, duration: 9, delay: 0, driftY: -18, driftX: 8, rotate: 18, kind: 'leaf' },
  { id: 2, x: '88%', y: '12%', size: 12, duration: 7.5, delay: 0.6, driftY: 16, driftX: -10, rotate: 45, kind: 'diamond' },
  { id: 3, x: '12%', y: '78%', size: 22, duration: 11, delay: 1.2, driftY: -20, driftX: 12, rotate: -15, kind: 'ring' },
  { id: 4, x: '90%', y: '74%', size: 20, duration: 10, delay: 0.4, driftY: -16, driftX: -8, rotate: 22, kind: 'leaf' },
  { id: 5, x: '22%', y: '42%', size: 10, duration: 8, delay: 1.5, driftY: 14, driftX: 6, rotate: 30, kind: 'diamond' },
  { id: 6, x: '78%', y: '44%', size: 16, duration: 9.5, delay: 0.8, driftY: -15, driftX: -9, rotate: -20, kind: 'utensil' },
  { id: 7, x: '48%', y: '8%', size: 11, duration: 8.5, delay: 1.8, driftY: 12, driftX: 8, rotate: 45, kind: 'diamond' },
  { id: 8, x: '52%', y: '90%', size: 18, duration: 10.5, delay: 0.3, driftY: -14, driftX: -6, rotate: 14, kind: 'ring' },
];

export function FloatingDecorations() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
    >
      {/* Subtle architectural frame hairline on desktop */}
      <div className="hidden lg:block fixed inset-6 border border-[#B88A3B]/15 rounded-3xl" />

      {DECORATIVE_ITEMS.map((item) => (
        <motion.div
          key={item.id}
          style={{ left: item.x, top: item.y }}
          className="absolute text-[#B88A3B]/25"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, item.driftY, 0],
                  x: [0, item.driftX, 0],
                  rotate: [0, item.rotate, 0],
                  opacity: [0.35, 0.7, 0.35],
                }
          }
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          {item.kind === 'diamond' && (
            <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L22 12L12 22L2 12L12 2Z" />
            </svg>
          )}
          {item.kind === 'leaf' && (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          )}
          {item.kind === 'ring' && (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
            >
              <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
          {item.kind === 'utensil' && (
            <svg
              width={item.size}
              height={item.size}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
              <path d="M7 2v20" />
              <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
