import { motion } from 'framer-motion';
import PlayingCard from './PlayingCard.jsx';

export default function Hand({ hand, selected, onToggle, disabled, hiddenCards = false }) {
  if (hiddenCards) {
    return (
      <div className="hand dealing-hand" aria-label="Your hand is being dealt">
        {Array.from({ length: Math.min(13, Math.max(8, hand.length || 8)) }).map((_, index) => (
          <motion.span
            key={index}
            className="hand-card card-back"
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0, rotate: (index - 6) * 0.8 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`hand ${disabled ? 'disabled' : ''}`} aria-label="Your hand">
      {hand.map((card, index) => (
        <motion.button
          layout
          key={card.id}
          className={`hand-card ${selected.includes(card.id) ? 'selected' : ''}`}
          onClick={() => onToggle(card.id)}
          initial={{ opacity: 0, y: 40, rotate: -5 }}
          animate={{ opacity: 1, y: selected.includes(card.id) ? -20 : 0, rotate: (index - hand.length / 2) * 0.8 }}
          whileTap={{ scale: 0.96 }}
          disabled={disabled}
          aria-pressed={selected.includes(card.id)}
        >
          <PlayingCard card={card} />
        </motion.button>
      ))}
    </div>
  );
}
