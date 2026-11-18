import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface InvitationIntroProps {
  onOpen: () => void;
}

export function InvitationIntro({ onOpen }: InvitationIntroProps) {
  const [isOpening, setIsOpening] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    window.setTimeout(
      () => {
        onOpen();
      },
      shouldReduceMotion ? 120 : 620
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -16 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Envelope Wrapper */}
      <div className="relative paper-surface rounded-2xl border border-[#DFD5C2] shadow-[0_24px_60px_-15px_rgba(18,38,58,0.14)] overflow-hidden">
        {/* Top Envelope Flap */}
        <motion.div
          animate={
            isOpening
              ? { y: -42, opacity: 0.25, scaleY: 0.88 }
              : { y: 0, opacity: 1, scaleY: 1 }
          }
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-gradient-to-b from-[#12263A] to-[#1A3550] text-[#FBF9F5] px-6 sm:px-10 pt-8 pb-10 text-center origin-top"
        >
          {/* Delicate Gold Trim */}
          <div className="absolute inset-x-6 top-3 h-px bg-gradient-to-r from-transparent via-[#C9A24D]/60 to-transparent" />

          {/* Unboxed Editorial Kicker */}
          <p className="text-xs sm:text-sm tracking-[0.08em] text-[#E8DCC4]/90 font-medium mb-3">
            Khaas Dawatnama &middot; Ehtiram ke Saath
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-[2.65rem] font-semibold tracking-tight text-[#FFFDF9] leading-tight">
            Assalam-o-Alaikum Sir! 👋
          </h1>

          {/* Gold Wax Crest */}
          <motion.div
            animate={
              isOpening
                ? { scale: 1.15, opacity: 0, rotate: -12 }
                : shouldReduceMotion
                  ? undefined
                  : { y: [0, -3, 0] }
            }
            transition={
              isOpening
                ? { duration: 0.35 }
                : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
            }
            className="mx-auto mt-6 -mb-16 w-16 h-16 rounded-full bg-gradient-to-br from-[#D6B15E] via-[#B88A3B] to-[#8C6520] shadow-[0_8px_20px_rgba(18,38,58,0.3)] border-2 border-[#F7EDD7]/70 flex items-center justify-center relative z-20"
            aria-hidden="true"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFDF9"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 17h18" />
              <path d="M5 17a7 7 0 0 1 14 0" />
              <path d="M12 7v3" />
              <circle cx="12" cy="6" r="1" fill="#FFFDF9" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Envelope Body */}
        <motion.div
          animate={isOpening ? { y: 12, opacity: 0.7 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="px-6 sm:px-12 pt-14 pb-10 sm:pb-12 text-center"
        >
          <p className="text-xs sm:text-sm tracking-[0.08em] text-[#134E3A] font-semibold mb-2">
            Bara-e-Mohtaram Asatiza
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#12263A] leading-snug">
            Sir Syed Hassan Zaidi &amp; Sir Adnan Ahmed
          </h2>

          <div className="w-20 h-px bg-[#C9A24D]/60 mx-auto my-5" />

          <p className="text-[#3C4A57] text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            Ek khaas dawat hai... aur is dawat ko reject karna technically possible nahi hai. 😌
          </p>

          <div className="mt-8 flex justify-center">
            <motion.button
              type="button"
              onClick={handleOpenClick}
              disabled={isOpening}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              animate={
                shouldReduceMotion || isOpening
                  ? undefined
                  : {
                      boxShadow: [
                        '0 10px 25px -5px rgba(19, 78, 58, 0.25)',
                        '0 16px 32px -4px rgba(19, 78, 58, 0.38)',
                        '0 10px 25px -5px rgba(19, 78, 58, 0.25)',
                      ],
                    }
              }
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#134E3A] to-[#12263A] text-[#FFFDF9] font-semibold text-base sm:text-lg tracking-wide cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF9] whitespace-nowrap shrink-0 transition-colors"
            >
              <span>📩 Dawat Kholein</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
