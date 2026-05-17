import { useCallback, useEffect, useRef, useState } from 'react';
import { createGameSocket } from '../sockets/socket.js';

export function useSocketRoom(profile, sounds) {
  const socketRef = useRef(null);
  const [state, setState] = useState(null);
  const [hand, setHand] = useState([]);
  const [playerId, setPlayerId] = useState(profile.playerId);
  const [error, setError] = useState('');
  const [remainingMs, setRemainingMs] = useState(0);
  const [turnRemainingMs, setTurnRemainingMs] = useState(0);
  const [events, setEvents] = useState([]);
  const [isDealing, setIsDealing] = useState(false);
  const dealTimerRef = useRef(null);

  useEffect(() => {
    const socket = createGameSocket({ roomId: profile.roomId, playerId: profile.playerId });
    socketRef.current = socket;

    const updateState = (payload) => {
      setState(payload);
      if (payload.playerId) {
        setPlayerId(payload.playerId);
        sessionStorage.setItem('br_playerId', payload.playerId);
        socket.auth = { roomId: payload.roomId || socket.auth?.roomId, playerId: payload.playerId };
      }
      if (payload.roomId) localStorage.setItem('br_roomId', payload.roomId);
      if (payload.hand) setHand(payload.hand);
    };

    socket.on('room_created', ({ roomId, playerId: id, room }) => {
      localStorage.setItem('br_roomId', roomId);
      sessionStorage.setItem('br_playerId', id);
      socket.auth = { roomId, playerId: id };
      setPlayerId(id);
      updateState(room);
    });
    socket.on('room_updated', updateState);
    socket.on('cards_distributed', (payload) => {
      updateState(payload);
      setIsDealing(true);
      clearTimeout(dealTimerRef.current);
      dealTimerRef.current = setTimeout(() => setIsDealing(false), 5000);
      sounds.deal();
    });
    socket.on('game_started', updateState);
    socket.on('turn_started', ({ deadline }) => {
      setRemainingMs(0);
      if (!deadline) setTurnRemainingMs(0);
    });
    socket.on('timer_update', ({ remainingMs: ms }) => {
      setRemainingMs(ms);
      if (ms > 0 && ms <= 3000) sounds.tick();
    });
    socket.on('turn_timer_update', ({ remainingMs: ms }) => {
      setTurnRemainingMs(ms);
      if (ms > 0 && ms <= 5000) sounds.tick();
    });
    socket.on('turn_skipped', ({ username }) => {
      setTurnRemainingMs(0);
      pushEvent(`${username} ran out of time. Turn passed.`);
    });
    socket.on('bluff_called', ({ callerName }) => {
      sounds.bluff();
      pushEvent(`${callerName} called BLUFF!`);
    });
    socket.on('bluff_result', (result) => {
      if (result?.message) pushEvent(result.message);
      sounds.reveal();
    });
    socket.on('player_won', ({ username, rank }) => {
      pushEvent(`${username} locked rank #${rank}`);
      sounds.victory();
    });
    socket.on('game_over', updateState);
    socket.on('error_message', ({ message }) => {
      setError(message);
      setTimeout(() => setError(''), 3500);
    });

    return () => {
      clearTimeout(dealTimerRef.current);
      socket.disconnect();
    };
  }, []);

  const pushEvent = (message) => {
    setEvents((items) => [{ id: crypto.randomUUID(), message }, ...items].slice(0, 5));
  };

  const emit = useCallback((event, payload) => {
    socketRef.current?.emit(event, payload);
  }, []);

  const createRoom = useCallback((username) => {
    localStorage.setItem('br_username', username);
    emit('create_room', { username });
  }, [emit, playerId]);

  const joinRoom = useCallback((username, roomId) => {
    localStorage.setItem('br_username', username);
    localStorage.setItem('br_roomId', roomId.toUpperCase());
    const existingPlayerId = sessionStorage.getItem('br_playerId') || playerId || '';
    emit('join_room', { username, roomId: roomId.toUpperCase(), playerId: existingPlayerId });
  }, [emit]);

  return {
    socket: socketRef.current,
    state,
    hand,
    playerId,
    error,
    remainingMs,
    turnRemainingMs,
    events,
    isDealing,
    createRoom,
    joinRoom,
    ready: (ready) => emit('player_ready', { ready }),
    startGame: () => emit('start_game'),
    playCards: (cardIds, claim) => emit('play_cards', { cardIds, claim }),
    callBluff: () => emit('call_bluff')
  };
}
