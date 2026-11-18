import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const FUNNY_MESSAGES = [
  'Sir, soch lein zara 😅',
  'Yeh option available nahi hai 😂',
  'Sir, lunch se bhaagna mana hai!',
  'Ek baar aur try karein 😌',
  'Almost... lekin nahi! 😂',
  'System keh raha hai: Lunch Accept Karein ❤️',
  'Sir please! 😭',
  'Decline button bhi sharma gaya 😂',
  'Is button ko bhi lunch pasand hai 🍽️',
];

const ASSIGNMENT_JOKE = 'Sir, itni koshish assignment mein bhi kar lete! 😂';
const INITIAL_LABEL = '😌 Nahi Sir, Is Baar Nahi';

interface EscapingDeclineButtonProps {
  textSafeRef: React.RefObject<HTMLDivElement | null>;
  acceptButtonRef: React.RefObject<HTMLButtonElement | null>;
  onEscapeAttempt?: (attempt: number) => void;
}

interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function getOverlapArea(a: Box, b: Box): number {
  const xOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const yOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return xOverlap * yOverlap;
}

function expandRect(rect: DOMRect, pad: number): Box {
  return {
    left: rect.left - pad,
    top: rect.top - pad,
    right: rect.right + pad,
    bottom: rect.bottom + pad,
  };
}

export function EscapingDeclineButton({
  textSafeRef,
  acceptButtonRef,
  onEscapeAttempt,
}: EscapingDeclineButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastEscapeTimeRef = useRef<number>(0);
  const attemptRef = useRef<number>(0);
  const usedMessagesRef = useRef<Set<string>>(new Set());

  const [hasEscaped, setHasEscaped] = useState(false);
  const [label, setLabel] = useState(INITIAL_LABEL);
  const [slotSize, setSlotSize] = useState<{ width: number; height: number } | null>(null);
  const [startOrigin, setStartOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pos, setPos] = useState<{ x: number; y: number; rotate: number }>({
    x: 0,
    y: 0,
    rotate: 0,
  });

  const pickNextLabel = useCallback((nextAttempt: number, currentLabel: string): string => {
    if (nextAttempt === 8 || (nextAttempt > 10 && nextAttempt % 5 === 0)) {
      return ASSIGNMENT_JOKE;
    }

    if (nextAttempt % 2 === 0 || nextAttempt === 1) {
      const available = FUNNY_MESSAGES.filter(
        (m) => m !== currentLabel && !usedMessagesRef.current.has(m)
      );
      const pool =
        available.length > 0
          ? available
          : FUNNY_MESSAGES.filter((m) => m !== currentLabel);

      if (available.length === 0) {
        usedMessagesRef.current.clear();
      }
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      usedMessagesRef.current.add(chosen);
      return chosen;
    }

    return currentLabel;
  }, []);

  const computeSafePosition = useCallback(
    (
      btnW: number,
      btnH: number,
      curX: number,
      curY: number,
      pointerX?: number,
      pointerY?: number
    ) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 16;

      const minX = margin;
      const maxX = Math.max(margin, vw - btnW - margin);
      const minY = margin;
      const maxY = Math.max(margin, vh - btnH - margin);

      const forbidden: Box[] = [];
      if (textSafeRef.current) {
        forbidden.push(expandRect(textSafeRef.current.getBoundingClientRect(), 14));
      }
      if (acceptButtonRef.current) {
        forbidden.push(expandRect(acceptButtonRef.current.getBoundingClientRect(), 14));
      }

      const candidates: Array<{ x: number; y: number; score: number }> = [];
      const samplePoints: Array<{ x: number; y: number }> = [
        // Structured edge, corner, and top/bottom band probes for tight mobile screens
        { x: minX, y: minY },
        { x: maxX, y: minY },
        { x: (minX + maxX) / 2, y: minY },
        { x: minX, y: maxY },
        { x: maxX, y: maxY },
        { x: (minX + maxX) / 2, y: maxY },
        { x: minX, y: (minY + maxY) / 2 },
        { x: maxX, y: (minY + maxY) / 2 },
        { x: minX + (maxX - minX) * 0.25, y: minY + 12 },
        { x: minX + (maxX - minX) * 0.75, y: minY + 12 },
        { x: minX + (maxX - minX) * 0.25, y: maxY - 12 },
        { x: minX + (maxX - minX) * 0.75, y: maxY - 12 },
      ];

      // Sample across the viewport plus directional jumps
      for (let i = 0; i < 60; i++) {
        samplePoints.push({
          x: minX + Math.random() * Math.max(1, maxX - minX),
          y: minY + Math.random() * Math.max(1, maxY - minY),
        });
      }

      for (const pt of samplePoints) {
        const rx = Math.min(maxX, Math.max(minX, pt.x));
        const ry = Math.min(maxY, Math.max(minY, pt.y));

        const box: Box = {
          left: rx,
          top: ry,
          right: rx + btnW,
          bottom: ry + btnH,
        };

        let overlap = 0;
        for (const f of forbidden) {
          overlap += getOverlapArea(box, f);
        }

        const centerX = rx + btnW / 2;
        const centerY = ry + btnH / 2;
        const distFromCurrent = Math.hypot(rx - curX, ry - curY);
        const distFromPointer =
          pointerX !== undefined && pointerY !== undefined
            ? Math.hypot(centerX - pointerX, centerY - pointerY)
            : distFromCurrent;

        // Heavily penalize any overlap with invitation text or accept button,
        // reward meaningful playful jumps away from pointer and previous spot.
        const jumpScore = Math.min(distFromCurrent, 360) + Math.min(distFromPointer, 320);
        const score = overlap === 0 ? 100000 + jumpScore : -overlap + jumpScore * 0.1;

        candidates.push({ x: rx, y: ry, score });
      }

      candidates.sort((a, b) => b.score - a.score);

      // Pick randomly from top 6 valid candidates so jumps feel spontaneous (left, right, up, down, diagonal)
      const zeroOverlap = candidates.filter((c) => c.score >= 100000);
      const pool =
        zeroOverlap.length > 0
          ? zeroOverlap.slice(0, Math.min(6, zeroOverlap.length))
          : candidates.slice(0, 3);
      const chosen = pool[Math.floor(Math.random() * pool.length)];

      const rotate =
        shouldReduceMotion
          ? 0
          : (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 6);

      return {
        x: Math.min(maxX, Math.max(minX, chosen.x)),
        y: Math.min(maxY, Math.max(minY, chosen.y)),
        rotate,
      };
    },
    [acceptButtonRef, shouldReduceMotion, textSafeRef]
  );

  const triggerEscape = useCallback(
    (pointerX?: number, pointerY?: number) => {
      const now = Date.now();
      if (now - lastEscapeTimeRef.current < 160) return;
      lastEscapeTimeRef.current = now;

      const el = buttonRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const nextAttempt = attemptRef.current + 1;
      attemptRef.current = nextAttempt;
      onEscapeAttempt?.(nextAttempt);

      const nextLabel = pickNextLabel(nextAttempt, label);
      const estimatedWidth = Math.min(
        window.innerWidth - 32,
        Math.max(rect.width, nextLabel.length * 8.6 + 46)
      );
      const estimatedHeight = Math.max(rect.height, 48);

      const curX = hasEscaped ? pos.x : rect.left;
      const curY = hasEscaped ? pos.y : rect.top;

      if (!hasEscaped) {
        setSlotSize({ width: rect.width, height: rect.height });
        setStartOrigin({ x: rect.left, y: rect.top });
        setHasEscaped(true);
      }

      const nextPos = computeSafePosition(
        estimatedWidth,
        estimatedHeight,
        curX,
        curY,
        pointerX,
        pointerY
      );

      setLabel(nextLabel);
      setPos(nextPos);
    },
    [computeSafePosition, hasEscaped, label, onEscapeAttempt, pickNextLabel, pos.x, pos.y]
  );

  // Re-clamp inside viewport whenever label width changes or window resizes
  useLayoutEffect(() => {
    if (!hasEscaped || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const margin = 16;
    const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
    const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
    const clampedX = Math.min(maxX, Math.max(margin, pos.x));
    const clampedY = Math.min(maxY, Math.max(margin, pos.y));

    if (Math.abs(clampedX - pos.x) > 1 || Math.abs(clampedY - pos.y) > 1) {
      setPos((prev) => ({ ...prev, x: clampedX, y: clampedY }));
    }
  }, [hasEscaped, label, pos.x, pos.y]);

  useEffect(() => {
    const handleResize = () => {
      if (!hasEscaped || !buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const margin = 16;
      const maxX = Math.max(margin, window.innerWidth - rect.width - margin);
      const maxY = Math.max(margin, window.innerHeight - rect.height - margin);
      setPos((prev) => ({
        ...prev,
        x: Math.min(maxX, Math.max(margin, prev.x)),
        y: Math.min(maxY, Math.max(margin, prev.y)),
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasEscaped]);

  // Desktop proximity detector so approaching the button slowly also triggers a smooth escape
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const buffer = 32;
      const nearHorizontally =
        e.clientX >= rect.left - buffer && e.clientX <= rect.right + buffer;
      const nearVertically =
        e.clientY >= rect.top - buffer && e.clientY <= rect.bottom + buffer;

      if (nearHorizontally && nearVertically) {
        triggerEscape(e.clientX, e.clientY);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [triggerEscape]);

  const buttonClasses =
    'inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#CFC3AD] bg-[#FBF9F5]/95 backdrop-blur-sm text-[#4A5562] font-medium text-sm sm:text-[15px] shadow-[0_8px_24px_-6px_rgba(18,38,58,0.16)] hover:border-[#B88A3B]/60 select-none cursor-pointer whitespace-nowrap max-w-[calc(100vw-32px)] truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A3B]';

  if (!hasEscaped) {
    return (
      <motion.button
        ref={buttonRef}
        type="button"
        onMouseEnter={(e) => triggerEscape(e.clientX, e.clientY)}
        onPointerDown={(e) => {
          e.preventDefault();
          triggerEscape(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          triggerEscape(touch?.clientX, touch?.clientY);
        }}
        onFocus={() => triggerEscape()}
        onClick={(e) => {
          e.preventDefault();
          triggerEscape();
        }}
        className={buttonClasses}
      >
        {label}
      </motion.button>
    );
  }

  return (
    <>
      {/* Preserve calm desktop spacing so Accept button doesn't jump beneath the cursor */}
      {slotSize && (
        <div
          aria-hidden="true"
          className="hidden sm:block shrink-0 pointer-events-none"
          style={{ width: slotSize.width, height: slotSize.height }}
        />
      )}

      <motion.button
        ref={buttonRef}
        type="button"
        initial={{ x: startOrigin.x, y: startOrigin.y, rotate: 0 }}
        animate={{ x: pos.x, y: pos.y, rotate: pos.rotate }}
        transition={
          shouldReduceMotion
            ? { duration: 0.1 }
            : {
                type: 'spring',
                stiffness: 380,
                damping: 24,
                mass: 0.78,
              }
        }
        onMouseEnter={(e) => triggerEscape(e.clientX, e.clientY)}
        onPointerDown={(e) => {
          e.preventDefault();
          triggerEscape(e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          triggerEscape(touch?.clientX, touch?.clientY);
        }}
        onFocus={() => triggerEscape()}
        onClick={(e) => {
          e.preventDefault();
          triggerEscape();
        }}
        style={{ position: 'fixed', top: 0, left: 0, zIndex: 50 }}
        className={buttonClasses}
      >
        {label}
      </motion.button>
    </>
  );
}
