import { motion } from 'framer-motion';

export default function PlayerStrip({ players, currentTurnPlayerId, speakers, selfId }) {
  return (
    <section className="player-strip" aria-label="Players">
      {players.map((player) => (
        <motion.article
          layout
          key={player.id}
          className={`player-card ${currentTurnPlayerId === player.id ? 'active-turn' : ''} ${!player.connected ? 'offline' : ''}`}
        >
          <img src={player.avatar} alt="" />
          <div>
            <strong>{player.username}{player.id === selfId ? ' you' : ''}</strong>
            <span>{player.rank ? `Rank #${player.rank}` : `${player.cardCount} cards`}</span>
          </div>
          {player.isHost && <small>HOST</small>}
          <span className={`speaker-dot ${speakers.has(player.id) ? 'speaking' : ''}`} aria-label={speakers.has(player.id) ? 'Speaking' : 'Not speaking'} />
        </motion.article>
      ))}
    </section>
  );
}
