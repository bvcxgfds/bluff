import { suitColor, suitSymbol } from '../utils/cards.js';

export default function PlayingCard({ card }) {
  return (
    <span className={`playing-card ${suitColor(card.suit)}`}>
      <span>{card.rank}</span>
      <strong>{suitSymbol(card.suit)}</strong>
      <span>{card.rank}</span>
    </span>
  );
}
