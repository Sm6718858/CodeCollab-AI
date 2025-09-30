import { useState, useEffect, useRef } from "react";
import "prismjs/themes/prism-tomorrow.css"; 
import { io } from "socket.io-client";
import axios from "axios";
import { Mic, MicOff, PhoneCall, PhoneMissed, Wifi, Code, Zap, MessageSquare, X, Download } from 'lucide-react'; 

import useSocketListeners from "./hooks/useSocketListeners";
import CodeEditor from "./components/CodeEditor";
import ReviewPanel from "./components/ReviewPanel";
import CollaborationPanel from "./components/CollaborationPanel";
import ParticipantsList from "./components/ParticipantsList";
import SectionHeader from "./components/SectionHeader";
import { downloadReview } from "./utils/downloadReview";

import "highlight.js/styles/github-dark.css"; 
import Chat from "./components/Chat";

import useVoiceChat from "./hooks/useVoiceChat";

function App() {
    // --- State Initialization (UNCHANGED) ---
    const [code, setCode] = useState(`function sum() { return 1 + 1 }`);
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCollaborating, setIsCollaborating] = useState(false);
    const [roomId, setRoomId] = useState("");
    const [sessionName, setSessionName] = useState("");
    const [userName, setUserName] = useState("");
    const [participants, setParticipants] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [error, setError] = useState("");
    const [showCopySuccess, setShowCopySuccess] = useState(false);
    
    const [showChat, setShowChat] = useState(false);

    const socketRef = useRef(null);
    const { localAudioRef, remoteAudioRef, startCall } = useVoiceChat(socketRef, roomId);
    const [muted, setMuted] = useState(false);
    const [isVoiceConnected, setIsVoiceConnected] = useState(false);

    const toggleMute = () => {
        if (localAudioRef.current && localAudioRef.current.srcObject) {
            const audioTracks = localAudioRef.current.srcObject.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = !audioTracks[0].enabled;
                setMuted(!audioTracks[0].enabled);
            }
        }
    };
    const stopVoice = () => {
        if (localAudioRef.current && localAudioRef.current.srcObject) {
            localAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
            localAudioRef.current.srcObject = null;
        }
        if (remoteAudioRef.current && remoteAudioRef.current.srcObject) {
            remoteAudioRef.current.srcObject.getTracks().forEach(track => track.stop());
            remoteAudioRef.current.srcObject = null;
        }
        setIsVoiceConnected(false);
    };

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
            socketRef.current.emit("codeChange", { roomId, code: newCode });
        }
    };

    const reviewCode = async () => {
        setIsLoading(true);
        setReview("");
        setError("");
        try {
            if (isCollaborating) {
                socketRef.current.emit("requestReview", { roomId });
            } else {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/ai/get-review`,
                    { code }
                );
                setReview(res.data);
            }
        } catch (err) {
            setReview(` Error: ${err.message || "Could not generate content"}`);
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
        if (!sessionName.trim()) return setError("Please enter a session name");
        if (!userName.trim()) return setError("Please enter your name");
        setError("");
        socketRef.current.emit("createRoom", {
            name: sessionName,
            userName: userName.trim(),
        });
        socketRef.current.once("roomCreated", ({ roomId, participants }) => {
            setRoomId(roomId);
            setParticipants(participants);
            setRoomName(sessionName);
            setIsCollaborating(true);
            setShowCopySuccess(false);
        });
    };

    const joinCollaborationSession = () => {
        if (!roomId.trim()) return setError("Please enter a room ID");
        if (!userName.trim()) return setError("Please enter your name");
        setError("");
        socketRef.current.emit("joinRoom", {
            roomId: roomId.trim(),
            userName: userName.trim(),
        });
    };

    const leaveCollaborationSession = () => {
        stopVoice();
        setIsCollaborating(false);
        setRoomId("");
        setParticipants([]);
        setRoomName("");
        setError("You left the collaboration session");
        setTimeout(() => setError(""), 3000);
        setShowChat(false); // Hide chat panel on leaving
    };

    return (
        <div className="min-h-screen bg-gray-950 text-slate-100 font-sans relative overflow-x-hidden"> 
            
            <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 p-4 shadow-xl">
                <div className="max-w-8xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
                        CodeCollab - AI
                    </h1>
                    <nav className="flex items-center space-x-4">
                        {isCollaborating && (
                            <span className="text-xs font-medium text-teal-400 flex items-center bg-gray-800 p-2 rounded-full px-3">
                                <Wifi size={14} className="mr-1.5" />
                                LIVE SESSION: {roomName}
                            </span>
                        )}
                        {/* <button
                            onClick={() => window.open('https://github.com/your-repo', '_blank')}
                            className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors hidden sm:block"
                        >
                            Documentation
                        </button> */}
                    </nav>
                </div>
            </header>

            <main className="max-w-8xl mx-auto p-4 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-8">

                {error && (
                    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-red-700 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center justify-center font-medium transition-all duration-300 transform scale-100 hover:scale-[1.01]">
                        <Zap size={20} className="mr-3" />
                        {error}
                    </div>
                )}

                <div className="w-full lg:w-3/5 xl:w-2/3 flex flex-col gap-6">

                    <SectionHeader
                        icon={<Code size={28} className="text-indigo-400" />}
                        title="Collaborative Code Editor"
                        subtitle="Write, paste your code, or ask AI a question (use @ prefix)"
                    />

                    {!isCollaborating && (
                        <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 transition-all duration-300 hover:shadow-indigo-900/50">
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

                    {isCollaborating && (
                        <ParticipantsList
                            roomName={roomName}
                            roomId={roomId}
                            socketRef={socketRef}
                            participants={participants}
                            showCopySuccess={showCopySuccess}
                            copyRoomId={copyRoomId}
                            leaveSession={leaveCollaborationSession}
                            className="bg-gray-800 rounded-xl p-4 shadow-2xl border border-gray-700"
                        />
                    )}

                    <div className="code-editor-wrapper bg-[#0f0f1a] rounded-xl shadow-2xl border border-gray-700 overflow-hidden h-full min-h-[500px]">
                        <CodeEditor code={code} onChange={handleCodeChange} />
                    </div>

                    <div className="flex flex-col gap-4">
                        
                        {isCollaborating && (
                            <div className="bg-gray-800 rounded-xl p-4 shadow-xl border border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                                    
                                    <button
                                        onClick={() => { startCall(); setIsVoiceConnected(true); }}
                                        disabled={isVoiceConnected}
                                        className="flex items-center justify-center flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-400 text-white shadow-md hover:shadow-teal-500/40"
                                    >
                                        <PhoneCall size={18} className="mr-2" />
                                        Start Voice
                                    </button>

                                    <button
                                        onClick={toggleMute}
                                        disabled={!isVoiceConnected}
                                        className={`flex items-center justify-center flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${muted ? "bg-red-600 hover:bg-red-500 shadow-red-500/40" : "bg-yellow-600 hover:bg-yellow-500 shadow-yellow-500/40"} disabled:bg-gray-700 disabled:text-gray-400 text-white shadow-md`}
                                    >
                                        {muted ? <MicOff size={18} className="mr-2" /> : <Mic size={18} className="mr-2" />}
                                        {muted ? "Unmute" : "Mute"}
                                    </button>
                                    
                                    <button
                                        onClick={stopVoice}
                                        disabled={!isVoiceConnected}
                                        className="flex items-center justify-center flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-gray-300 shadow-md"
                                    >
                                        <PhoneMissed size={18} className="mr-2" />
                                        Stop Voice
                                    </button>
                                </div>

                                {isVoiceConnected && (
                                    <div className="flex items-center text-teal-400 font-semibold text-sm mt-2 sm:mt-0">
                                        <Wifi size={18} className="mr-2 animate-pulse" />
                                        Connected
                                    </div>
                                )}

                                <audio ref={localAudioRef} autoPlay muted className="hidden" />
                                <audio ref={remoteAudioRef} autoPlay className="hidden" />
                            </div>
                        )}

                        <button
                            onClick={reviewCode}
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-400 transition-all duration-300 text-white px-6 py-4 rounded-xl font-extrabold text-xl shadow-2xl hover:shadow-indigo-500/60 active:scale-[0.99] flex items-center justify-center space-x-3"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : isCollaborating ? (
                                <>
                                    <Zap size={24} />
                                    <span>Request Collaborative AI Review</span>
                                </>
                            ) : (
                                <>
                                    <Zap size={24} />
                                    <span>Generate AI Review</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>

                <div className="w-full lg:w-2/5 xl:w-1/3 lg:sticky lg:top-[6rem] h-full lg:h-[calc(100vh-8rem)]"> 
                    <ReviewPanel
                        isLoading={isLoading}
                        review={review}
                        isCollaborating={isCollaborating}
                        downloadReview={() => downloadReview(review)}
                        className="h-full overflow-y-auto bg-gray-800 rounded-xl shadow-2xl border border-gray-700"
                    />
                </div>
            </main>

            {isCollaborating && (
                <button
                    onClick={() => setShowChat(true)}
                    className={`fixed bottom-8 right-8 z-50 p-4 bg-teal-600 rounded-2xl shadow-2xl transition-all duration-300 hover:bg-teal-500 hover:scale-[1.05] transform active:scale-95 text-white shadow-teal-500/50 ${
                        showChat ? 'opacity-0 pointer-events-none' : '' 
                    }`}
                    aria-label="Toggle Chat"
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {isCollaborating && (
                <div
                    className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-900 border-l border-teal-700 shadow-2xl z-[55] transition-transform duration-300 ease-in-out ${
                        showChat ? 'translate-x-0' : 'translate-x-full'
                    } sm:w-96`} 
                >
                    {/* Use flex-col and h-full to manage vertical layout */}
                    <div className="flex flex-col h-full">
                        
                        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0 bg-gray-950">
                            <h3 className="text-xl font-bold text-teal-400">Collaborative Chat</h3>
                            <button
                                onClick={() => setShowChat(false)}
                                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-gray-800 transition-colors"
                                aria-label="Close Chat"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-grow"> 
                            <Chat socketRef={socketRef} userName={userName} />
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
}

export default App;