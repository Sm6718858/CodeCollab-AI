import { useState, useEffect, useRef } from 'react';
import 'prismjs/themes/prism-tomorrow.css';
import { io } from 'socket.io-client';
import axios from 'axios';

import useSocketListeners from './hooks/useSocketListeners';
import CodeEditor from './components/CodeEditor';
import ReviewPanel from './components/ReviewPanel';
import CollaborationPanel from './components/CollaborationPanel';
import ParticipantsList from './components/ParticipantsList';
import SectionHeader from './components/SectionHeader';
import { downloadReview } from './utils/downloadReview';


import 'highlight.js/styles/github-dark.css';

function App() {
  const [code, setCode] = useState(`function sum() { return 1 + 1 }`);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCollaborating, setIsCollaborating] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [userName, setUserName] = useState('');
  const [participants, setParticipants] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [error, setError] = useState('');
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(`${import.meta.env.VITE_API_BASE_URL}`);
  }, []);

  useSocketListeners({
    socketRef,
    setCode,
    setReview,
    setParticipants,
    setRoomName,
    setError,
    setIsLoading,
    setIsCollaborating,
  });

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (isCollaborating) {
      socketRef.current.emit('codeChange', { roomId, code: newCode });
    }
  };

  const reviewCode = async () => {
    setIsLoading(true);
    setReview('');
    setError('');
    try {
      if (isCollaborating) {
        socketRef.current.emit('requestReview', { roomId });
      } else {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/ai/get-review`, { code });
        setReview(res.data);
      }
    } catch (err) {
      setReview(` Error: ${err.message || 'Could not generate content'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const createCollaborationSession = () => {
    if (!sessionName.trim()) return setError('Please enter a session name');
    if (!userName.trim()) return setError('Please enter your name');
    setError('');
    socketRef.current.emit('createRoom', {
      name: sessionName,
      userName: userName.trim(),
    });
    socketRef.current.once('roomCreated', ({ roomId, participants }) => {
      setRoomId(roomId);
      setParticipants(participants);
      setRoomName(sessionName);
      setIsCollaborating(true);
      setShowCopySuccess(false);
    });
  };

  const joinCollaborationSession = () => {
    if (!roomId.trim()) return setError('Please enter a room ID');
    if (!userName.trim()) return setError('Please enter your name');
    setError('');
    socketRef.current.emit('joinRoom', {
      roomId: roomId.trim(),
      userName: userName.trim(),
    });
  };

  const leaveCollaborationSession = () => {
    setIsCollaborating(false);
    setRoomId('');
    setParticipants([]);
    setRoomName('');
    setError('You left the collaboration session');
    setTimeout(() => setError(''), 3000);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
      {error && (
        <div className="bg-red-600 text-white px-4 py-2 rounded-md text-center font-semibold mb-4 w-full">
          {error}
        </div>
      )}

      <div className="w-full lg:w-2/3 flex flex-col gap-4">
        <SectionHeader
          iconPath="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3"
          title="Code Editor or FAQ by AI"
          subtitle="Write or paste your code OR Ask any question (with @)"
        />

        {isCollaborating && (
          <ParticipantsList
            roomName={roomName}
            roomId={roomId}
            socketRef={socketRef}
            participants={participants}
            showCopySuccess={showCopySuccess}
            copyRoomId={copyRoomId}
            leaveSession={leaveCollaborationSession}
          />
        )}

        <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden border border-gray-800">
          <CodeEditor code={code} onChange={handleCodeChange} />
        </div>

        {!isCollaborating && (
          <div className="bg-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
            <CollaborationPanel
              userName={userName}
              setUserName={setUserName}
              sessionName={sessionName}
              setSessionName={setSessionName}
              roomId={roomId}
              setRoomId={setRoomId}
              createSession={createCollaborationSession}
              joinSession={joinCollaborationSession}
            />
          </div>
        )}

        <button
          onClick={reviewCode}
          disabled={isLoading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 transition-all duration-300 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : isCollaborating ? (
            'Request Collaborative Review'
          ) : (
            'Review Code'
          )}
        </button>
      </div>

      <div className="w-full lg:w-1/3">
        <ReviewPanel
          isLoading={isLoading}
          review={review}
          isCollaborating={isCollaborating}
          downloadReview={() => downloadReview(review)}
        />
      </div>
    </main>
  );
}

export default App;
