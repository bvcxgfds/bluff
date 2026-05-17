import { motion } from 'framer-motion';

const packetCards = Array.from({ length: 9 });
const dealtCards = Array.from({ length: 20 });

export default function DealingOverlay() {
  return (
    <motion.div
      className="dealing-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-live="polite"
    >
      <div className="dealing-stage">
        <div className="shuffle-table" aria-hidden="true">
          <motion.div
            className="shuffle-packet left-packet"
            animate={{
              x: [-78, -26, -58, -8, -72],
              y: [0, -10, 8, -4, 0],
              rotate: [-15, -5, -18, -2, -15]
            }}
            transition={{ duration: 2.15, repeat: Infinity, ease: 'easeInOut' }}
          >
            {packetCards.map((_, index) => <span key={index} style={{ '--i': index }} />)}
          </motion.div>

          <motion.div
            className="shuffle-packet right-packet"
            animate={{
              x: [78, 26, 58, 8, 72],
              y: [0, 10, -8, 4, 0],
              rotate: [15, 5, 18, 2, 15]
            }}
            transition={{ duration: 2.15, repeat: Infinity, ease: 'easeInOut' }}
          >
            {packetCards.map((_, index) => <span key={index} style={{ '--i': index }} />)}
          </motion.div>

          <motion.div
            className="shuffle-flash"
            animate={{ opacity: [0, 0.6, 0, 0.45, 0], scale: [0.8, 1.08, 0.92, 1.14, 0.8] }}
            transition={{ duration: 2.15, repeat: Infinity, ease: 'easeOut' }}
          />
        </div>

        {dealtCards.map((_, index) => {
          const angle = (Math.PI * 2 * index) / dealtCards.length;
          const distanceX = 148 + (index % 4) * 10;
          const distanceY = 86 + (index % 3) * 8;
          return (
          <motion.span
            key={index}
            className="dealing-card"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.82 }}
            animate={{
              x: [0, Math.cos(angle) * 34, Math.cos(angle) * distanceX],
              y: [0, Math.sin(angle) * 18 - 20, Math.sin(angle) * distanceY],
              rotate: [0, index % 2 ? -18 : 18, index * 13 - 110],
              opacity: [0, 0, 1, 1, 0.15],
              scale: [0.82, 0.9, 1, 1, 0.96]
            }}
            transition={{
              duration: 1.85,
              delay: 1.05 + index * 0.055,
              repeat: Infinity,
              repeatDelay: 1.35,
              ease: 'easeOut'
            }}
          />
          );
        })}
        <motion.strong animate={{ scale: [1, 1.04, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
          Shuffling deck
        </motion.strong>
      </div>
    </motion.div>
  );
}
