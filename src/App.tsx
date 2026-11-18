/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { CelebrationScreen } from './components/CelebrationScreen';
import { FloatingDecorations } from './components/FloatingDecorations';
import { InvitationCard } from './components/InvitationCard';
import { InvitationIntro } from './components/InvitationIntro';

type Stage = 'intro' | 'invitation' | 'celebration';

export default function App() {
  const [stage, setStage] = useState<Stage>('intro');

  return (
    <div className="relative min-h-[100dvh] w-full linen-backdrop flex flex-col justify-between overflow-x-hidden">
      <FloatingDecorations />

      {/* Quiet Editorial Top Margin Label */}
      <header className="relative z-10 w-full pt-6 sm:pt-8 px-6 text-center">
        <p className="text-xs sm:text-sm tracking-[0.08em] text-[#6D6252]/90 font-medium">
          Sir Syed Hassan Zaidi &middot; Sir Adnan Ahmed
        </p>
      </header>

      {/* Main Centered Stage */}
      <main className="relative z-10 flex-1 flex items-center justify-center w-full py-4 sm:py-6">
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <InvitationIntro key="intro" onOpen={() => setStage('invitation')} />
          )}

          {stage === 'invitation' && (
            <InvitationCard key="invitation" onAccept={() => setStage('celebration')} />
          )}

          {stage === 'celebration' && (
            <CelebrationScreen
              key="celebration"
              onReplayInvitation={() => setStage('invitation')}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="relative z-10 w-full pb-5 pt-2 px-6 text-center">
        <p className="text-xs text-[#6D6252]/80 tracking-wide">
          Pur-khuloos Ehtiram aur Shukriya ke Saath &middot; Apka Shagird
        </p>
      </footer>
    </div>
  );
}
