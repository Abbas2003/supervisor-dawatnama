import { useRef } from 'react';
import { motion } from 'motion/react';
import { ActionButtons } from './ActionButtons';
import { InvitationMessage } from './InvitationMessage';

interface InvitationCardProps {
  onAccept: () => void;
}

export function InvitationCard({ onAccept }: InvitationCardProps) {
  const textSafeRef = useRef<HTMLDivElement>(null);
  const acceptButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <motion.section
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, y: -20 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10"
    >
      <article className="relative paper-surface rounded-2xl border border-[#DFD5C2] shadow-[0_28px_70px_-18px_rgba(18,38,58,0.14)] px-6 py-8 sm:px-12 sm:py-12">
        {/* Corner Filigree Accents */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3.5 left-3.5 w-5 h-5 border-t border-l border-[#C9A24D]/55 rounded-tl-md"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3.5 right-3.5 w-5 h-5 border-t border-r border-[#C9A24D]/55 rounded-tr-md"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3.5 left-3.5 w-5 h-5 border-b border-l border-[#C9A24D]/55 rounded-bl-md"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3.5 right-3.5 w-5 h-5 border-b border-r border-[#C9A24D]/55 rounded-br-md"
        />

        {/* Quiet Unboxed Editorial Header Line */}
        <header className="text-center mb-6 pb-4 border-b border-[#EAE0CE]">
          <p className="text-xs sm:text-sm tracking-[0.08em] text-[#6D6252] font-medium">
            Dawatnama-e-Khaas &middot; Asatiza-e-Mohtaram
          </p>
        </header>

        <InvitationMessage textSafeRef={textSafeRef} />

        <ActionButtons
          textSafeRef={textSafeRef}
          acceptButtonRef={acceptButtonRef}
          onAccept={onAccept}
        />
      </article>
    </motion.section>
  );
}
