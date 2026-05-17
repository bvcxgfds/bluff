import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export default function TableCenter({ state, remainingMs, turnRemainingMs, canBluff, onBluff }) {
  const activeTimerMs = state.challengeOpen ? remainingMs : turnRemainingMs;
  const seconds = Math.ceil(activeTimerMs / 1000);
  const timerTotal = state.challengeOpen ? 7000 : 20000;
  const progress = activeTimerMs > 0 ? Math.max(0, Math.min(1, activeTimerMs / timerTotal)) : 0;
  const currentPlayer = state.players.find((player) => player.id === state.currentTurnPlayerId);
  const showTurnTimer = state.gameStarted && !state.challengeOpen && activeTimerMs > 0;

  return (
    <section className="table-center" aria-label="Center table">
      <div className="felt-ring">
        <motion.div className="pile" animate={{ rotate: state.centerPileCount * 3, scale: state.challengeOpen ? 1.06 : 1 }}>
          {Array.from({ length: Math.min(5, Math.max(1, state.centerPileCount || 1)) }).map((_, index) => (
            <span key={index} style={{ transform: `translate(${index * 5}px, ${index * -4}px) rotate(${index * 5 - 8}deg)` }} />
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {state.currentClaim ? (
            <motion.div key="claim" className="claim-callout" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <span>{state.currentClaim.username} claims</span>
              <strong>{state.currentClaim.quantity} x {state.currentClaim.rank}</strong>
            </motion.div>
          ) : showTurnTimer ? (
            <motion.div key="turn" className="claim-callout idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span>Turn</span>
              <strong>{currentPlayer?.username || 'Player'}</strong>
            </motion.div>
          ) : (
            <motion.div key="waiting" className="claim-callout idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span>Center pile</span>
              <strong>{state.centerPileCount} live</strong>
            </motion.div>
          )}
        </AnimatePresence>

        {(state.challengeOpen || showTurnTimer) && (
          <motion.div className={`timer-orbit ${state.challengeOpen ? 'bluff-timer' : 'turn-timer'}`} animate={{ scale: seconds <= (state.challengeOpen ? 3 : 5) ? [1, 1.07, 1] : 1 }} transition={{ repeat: Infinity, duration: 0.5 }}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="54" />
              <circle cx="60" cy="60" r="54" style={{ strokeDashoffset: 339 - 339 * progress }} />
            </svg>
            <strong>{seconds}</strong>
          </motion.div>
        )}
      </div>

      <button className="bluff-button" disabled={!canBluff} onClick={onBluff}>
        <ShieldAlert size={22} /> BLUFF!
      </button>
    </section>
  );
}
