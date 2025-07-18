import { useEffect } from 'react';

export default function useSocketListeners({
  socketRef,
  setCode,
  setReview,
  setParticipants,
  setRoomName,
  setError,
  setIsLoading,
  setIsCollaborating
}) {
  useEffect(() => {
    const socket = socketRef.current;

    socket.on('codeUpdate', ({ code }) => setCode(code));

    socket.on('reviewResult', ({ review, error }) => {
      setIsLoading(false);
      setError('');
      setReview(error ? `Error: ${error}` : review);
    });

    socket.on('participantJoined', ({ newParticipant, participants }) => {
      setParticipants(participants);
      if (newParticipant.id !== socket.id) {
        setError(`${newParticipant.name} joined the session`);
        setTimeout(() => setError(''), 3000);
      }
    });

    socket.on('participantLeft', ({ leftParticipant, participants, newOwnerId }) => {
      setParticipants(participants);
      setError(`${leftParticipant.name} left the session`);
      setTimeout(() => setError(''), 3000);
      if (newOwnerId === socket.id) {
        setError(`You are now the room owner`);
        setTimeout(() => setError(''), 3000);
      }
    });

    socket.on('roomJoined', ({ code, participants, roomName }) => {
      setCode(code || '');
      setParticipants(participants);
      setRoomName(roomName);
      setIsCollaborating(true);
      setError('');
    });

    socket.on('roomClosed', ({ reason }) => {
      setIsCollaborating(false);
      setError(`Room closed: ${reason}`);
    });

    socket.on('error', ({ message }) => {
      setError(message);
      setTimeout(() => setError(''), 3000);
    });

    return () => socket.disconnect();
  }, []);
}
