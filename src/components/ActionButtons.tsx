import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EscapingDeclineButton } from './EscapingDeclineButton';

interface ActionButtonsProps {
  textSafeRef: React.RefObject<HTMLDivElement | null>;
  acceptButtonRef: React.RefObject<HTMLButtonElement | null>;
  onAccept: () => void;
}

export function ActionButtons({
  textSafeRef,
  acceptButtonRef,
  onAccept,
}: ActionButtonsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [escapeCount, setEscapeCount] = useState(0);

  return (
    <div className="mt-8 sm:mt-9">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <motion.button
          ref={acceptButtonRef}
          type="button"
          onClick={onAccept}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#134E3A] via-[#155942] to-[#12263A] text-[#FFFDF9] font-semibold text-base sm:text-[17px] shadow-[0_14px_30px_-8px_rgba(19,78,58,0.42)] hover:shadow-[0_18px_36px_-6px_rgba(19,78,58,0.5)] border border-[#C9A24D]/40 cursor-pointer whitespace-nowrap shrink-0 transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B88A3B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF9]"
        >
          <span>❤️ Jee Haan, Lunch Manzoor Hai</span>
        </motion.button>

        <EscapingDeclineButton
          textSafeRef={textSafeRef}
          acceptButtonRef={acceptButtonRef}
          onEscapeAttempt={setEscapeCount}
        />
      </div>

      {escapeCount >= 3 && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-xs sm:text-sm text-[#6B7280] italic"
        >
          {escapeCount >= 8
            ? 'Lagta hai system aur qismat dono lunch ke haq mein hain. 😄'
            : 'Sir, lagta hai yeh button bhi chahta hai ke aap lunch accept kar lein. 😌'}
        </motion.p>
      )}
    </div>
  );
}
