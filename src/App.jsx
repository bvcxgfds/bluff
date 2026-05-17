import { useMemo, useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import GamePage from './pages/GamePage.jsx';
import { useSocketRoom } from './hooks/useSocketRoom.js';
import { useSound } from './hooks/useSound.js';

export default function App() {
  const [profile, setProfile] = useState(() => ({
    username: localStorage.getItem('br_username') || '',
    roomId: localStorage.getItem('br_roomId') || '',
    playerId: sessionStorage.getItem('br_playerId') || ''
  }));
  const sounds = useSound();
  const room = useSocketRoom(profile, sounds);

  const connectedProfile = useMemo(() => ({
    ...profile,
    playerId: room.playerId || profile.playerId,
    roomId: room.state?.roomId || profile.roomId
  }), [profile, room.playerId, room.state?.roomId]);

  if (!room.state) {
    return <HomePage room={room} profile={profile} setProfile={setProfile} />;
  }

  return <GamePage room={room} profile={connectedProfile} setProfile={setProfile} sounds={sounds} />;
}
