import React from 'react';
import { motion } from 'motion/react';

interface InvitationMessageProps {
  textSafeRef: React.RefObject<HTMLDivElement | null>;
}

export function InvitationMessage({ textSafeRef }: InvitationMessageProps) {
  return (
    <div ref={textSafeRef} className="text-center">
      {/* Subtle Culinary Crest Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="mx-auto mb-5 w-16 h-16 rounded-full bg-[#F4EFE6] border border-[#DFD5C2] flex items-center justify-center text-[#134E3A]"
        aria-hidden="true"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 21h22" />
          <path d="M7 21a9 9 0 0 1 18 0" />
          <path d="M16 9v3" />
          <circle cx="16" cy="7.5" r="1.5" stroke="#B88A3B" />
          <path d="M9 24.5h14" stroke="#B88A3B" />
        </svg>
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="font-serif text-4xl sm:text-5xl font-bold text-[#12263A] tracking-tight leading-tight"
      >
        🍽️ Lunch Ki Dawat
      </motion.h1>

      {/* Hairline Ornament Divider */}
      <div className="flex items-center justify-center gap-3 my-5" aria-hidden="true">
        <span className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent to-[#C9A24D]" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#B88A3B]" />
        <span className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent to-[#C9A24D]" />
      </div>

      {/* Salutation */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.18 }}
        className="font-serif text-xl sm:text-2xl font-semibold text-[#134E3A] mb-5 leading-snug"
      >
        Mohtaram Sir Syed Hassan Zaidi aur Sir Adnan Ahmed,
      </motion.p>

      {/* Main Message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.24 }}
        className="space-y-4 text-[#2C3A47] text-[15.5px] sm:text-base leading-[1.75] max-w-xl mx-auto"
      >
        <p>
          Apki guidance, support aur encouragement ke liye dil se shukriya. University ke safar mein
          apki rehnumai hamesha qabil-e-qadr rahi hai.
        </p>

        <p>
          Isi appreciation ko officially celebrate karne ke liye socha ke ek achay se lunch ka
          intezam kiya jaye. 😄
        </p>

        <p className="font-serif text-xl sm:text-2xl font-semibold text-[#12263A] pt-2">
          To Sir, kya aap dono mere saath lunch par tashreef laayenge?
        </p>
      </motion.div>

      {/* Humorous Note (clean editorial framing without thick left borders) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="mt-6 max-w-lg mx-auto border-y border-[#E2D6BF] bg-[#F8F4EC]/75 px-5 py-3.5 rounded-lg"
      >
        <p className="text-sm sm:text-[15px] text-[#5B4B32] leading-relaxed italic">
          Note: Is invitation ke saath koi assignment, viva ya presentation attached nahi hai. Sirf
          lunch hai. 😂
        </p>
      </motion.div>
    </div>
  );
}
