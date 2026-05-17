import { useEffect, useMemo, useRef, useState } from 'react';
import { Room, RoomEvent, createLocalAudioTrack } from 'livekit-client';
import { SERVER_URL } from '../sockets/socket.js';

export function useVoiceChat({ roomId, playerId, username }) {
  const [voiceRoom, setVoiceRoom] = useState(null);
  const [muted, setMuted] = useState(false);
  const [speakers, setSpeakers] = useState(new Set());
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const localTrackRef = useRef(null);

  useEffect(() => {
    if (!roomId || !playerId || !username) return;
    let mounted = true;
    let room;

    async function connectVoice() {
      try {
        setStatus('connecting');
        setError('');
        const params = new URLSearchParams({ roomId, playerId, username });
        const response = await fetch(`${SERVER_URL}/api/livekit/token?${params}`);
        if (!response.ok) throw new Error('Voice token unavailable');
        const { token, url } = await response.json();
        if (!url) throw new Error('LiveKit URL missing');

        room = new Room({ adaptiveStream: true, dynacast: true });
        room.on(RoomEvent.ActiveSpeakersChanged, (activeSpeakers) => {
          setSpeakers(new Set(activeSpeakers.map((participant) => participant.identity)));
        });

        await room.connect(url, token, { autoSubscribe: true });
        if (!mounted) return;

        setVoiceRoom(room);
        setStatus('connected');

        try {
          const track = await createLocalAudioTrack({ echoCancellation: true, noiseSuppression: true });
          await room.localParticipant.publishTrack(track);
          localTrackRef.current = track;
          if (mounted) setMuted(false);
        } catch (micError) {
          console.warn('Microphone unavailable', micError);
          if (mounted) {
            setMuted(true);
            setStatus('mic blocked');
            setError('Allow microphone access for voice chat');
          }
        }
      } catch (error) {
        console.warn(error);
        setStatus('offline');
        setError(error.message || 'Voice connection failed');
      }
    }

    connectVoice();

    return () => {
      mounted = false;
      localTrackRef.current?.stop();
      localTrackRef.current = null;
      room?.disconnect();
    };
  }, [roomId, playerId, username]);

  const controls = useMemo(() => ({
    muted,
    status,
    error,
    speakers,
    toggleMute: async () => {
      if (!voiceRoom) return;
      const next = !muted;
      try {
        if (next) {
          await localTrackRef.current?.mute();
          setMuted(true);
          setStatus('muted');
        } else {
          if (!localTrackRef.current) {
            const track = await createLocalAudioTrack({ echoCancellation: true, noiseSuppression: true });
            await voiceRoom.localParticipant.publishTrack(track);
            localTrackRef.current = track;
          }

          await localTrackRef.current.unmute();
          setMuted(false);
          setStatus('connected');
        }
        setError('');
      } catch (micError) {
        console.warn('Microphone toggle failed', micError);
        setMuted(true);
        setStatus('mic blocked');
        setError('Allow microphone access for voice chat');
      }
    }
  }), [voiceRoom, muted, status, error, speakers]);

  return controls;
}
