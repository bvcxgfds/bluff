import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, LogIn, Plus } from 'lucide-react';

export default function HomePage({ room, profile, setProfile }) {
  const [username, setUsername] = useState(profile.username || '');
  const [roomCode, setRoomCode] = useState(profile.roomId || '');

  const canSubmit = username.trim().length >= 2;

  return (
    <main className="home-shell">
      <section className="home-hero">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="brand-lockup">
          <Crown aria-hidden="true" />
          <p>Bluff Royale</p>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          Fast lies, loud calls, one table.
        </motion.h1>
        <motion.form
          className="join-panel"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          onSubmit={(event) => event.preventDefault()}
        >
          <label>
            Display name
            <input
              value={username}
              maxLength={18}
              onChange={(event) => {
                setUsername(event.target.value);
                setProfile((current) => ({ ...current, username: event.target.value }));
              }}
              placeholder="Your chaos name"
            />
          </label>
          <label>
            Room code
            <input
              value={roomCode}
              maxLength={5}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
              placeholder="ABCDE"
            />
          </label>
          <div className="home-actions">
            <button disabled={!canSubmit} onClick={() => room.createRoom(username)}>
              <Plus size={18} /> Create room
            </button>
            <button disabled={!canSubmit || roomCode.length < 5} className="secondary" onClick={() => room.joinRoom(username, roomCode)}>
              <LogIn size={18} /> Join
            </button>
          </div>
          {room.error && <p className="error-pill" role="alert">{room.error}</p>}
        </motion.form>
      </section>
    </main>
  );
}
