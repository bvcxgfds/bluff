export const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

export function suitSymbol(suit) {
  return {
    spades: '♠',
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣'
  }[suit] || '?';
}

export function suitColor(suit) {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black';
}
