import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Mic, MicOff, Play, Volume2 } from 'lucide-react';
import { RANKS } from '../utils/cards.js';
import { useVoiceChat } from '../hooks/useVoiceChat.js';
import PlayerStrip from '../components/PlayerStrip.jsx';
import TableCenter from '../components/TableCenter.jsx';
import Hand from '../components/Hand.jsx';
import EventFeed from '../components/EventFeed.jsx';
import DealingOverlay from '../components/DealingOverlay.jsx';

export default function GamePage({ room, profile, sounds }) {
  const state = room.state;
  const me = state.players.find((player) => player.id === room.playerId);
  const [selected, setSelected] = useState([]);
  const [rank, setRank] = useState('A');
  const voice = useVoiceChat({ roomId: state.roomId, playerId: room.playerId, username: me?.username || profile.username });

  const isMyTurn = state.currentTurnPlayerId === room.playerId && !state.challengeOpen && state.gameStarted && !room.isDealing;
  const canBluff = state.challengeOpen && state.currentClaim?.playerId !== room.playerId && !me?.rank && !room.isDealing;

  useEffect(() => {
    const onKey = (event) => {
      if (event.key.toLowerCase() === 'b' && canBluff) room.callBluff();
      if (event.key === 'Enter' && isMyTurn && selected.length) play();
      if (event.key.toLowerCase() === 'm') voice.toggleMute();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canBluff, isMyTurn, selected, voice]);

  const claimText = useMemo(() => {
    const plural = selected.length === 1 ? '' : 's';
    return `${selected.length || 0} ${rank}${plural}`;
  }, [selected.length, rank]);

  function toggleCard(cardId) {
    if (!isMyTurn) return;
    setSelected((cards) => cards.includes(cardId) ? cards.filter((id) => id !== cardId) : [...cards, cardId]);
  }

  function play() {
    if (!selected.length) return;
    sounds.place();
    room.playCards(selected, { rank, quantity: selected.length });
    setSelected([]);
  }

  return (
    <main className="game-shell">
      <header className="topbar">
        <div>
          <span className="kicker">Room</span>
          <button className="room-code" onClick={() => navigator.clipboard?.writeText(state.roomId)} aria-label="Copy room code">
            {state.roomId} <Copy size={16} />
          </button>
        </div>
      {/*  <div className="topbar-actions">
          <span className={`voice-status ${voice.status.replace(/\s+/g, '-')}`} title={voice.error || voice.status}>
            {voice.status}
            {voice.error && <small>{voice.error}</small>}
          </span>
          <button className="icon-button" onClick={voice.toggleMute} aria-label={voice.muted ? 'Unmute microphone' : 'Mute microphone'}>
            {voice.muted ? <MicOff size={19} /> : <Mic size={19} />}
          </button>
        </div> */}
      </header>

      <PlayerStrip players={state.players} currentTurnPlayerId={state.currentTurnPlayerId} speakers={voice.speakers} selfId={room.playerId} />

      <section className="arena">
        <TableCenter state={state} remainingMs={room.remainingMs} turnRemainingMs={room.turnRemainingMs} canBluff={canBluff} onBluff={room.callBluff} />
        <EventFeed events={room.events} />
      </section>

      <section className="controls-dock" aria-label="Player actions">
        {!state.gameStarted && (
          <div className="lobby-bar">
            <div>
              <strong>{state.players.length}/4 minimum</strong>
              <span>{me?.isHost ? 'Start when four players are connected.' : 'Waiting for host to start.'}</span>
            </div>
            {me?.isHost && (
              <button disabled={state.players.filter((player) => player.connected).length < 4} onClick={room.startGame}>
                <Play size={18} /> Start game
              </button>
            )}
          </div>
        )}

        {state.gameStarted && !room.isDealing && (
          <div className="claim-bar">
            <label>
              Claim
              <select value={rank} onChange={(event) => setRank(event.target.value)} disabled={!isMyTurn}>
                {RANKS.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <div className="claim-preview">{claimText}</div>
            <button disabled={!isMyTurn || selected.length < 1} onClick={play}>Throw cards</button>
          </div>
        )}

        <Hand hand={room.hand} selected={selected} onToggle={toggleCard} disabled={!isMyTurn || room.isDealing} hiddenCards={room.isDealing} />
      </section>

      <AnimatePresence>
        {room.isDealing && <DealingOverlay />}
        {room.error && (
          <motion.div className="toast" role="alert" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}>
            <Volume2 size={18} /> {room.error}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
