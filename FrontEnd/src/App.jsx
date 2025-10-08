import { useState, useEffect, useRef } from "react";
import "prismjs/themes/prism-tomorrow.css"; 
import { io } from "socket.io-client";
import axios from "axios";
import { Mic, MicOff, PhoneCall, PhoneMissed, Wifi, Code, Zap, MessageSquare, X, Download, Users, CornerDownLeft, Share2, Plus, LogIn } from 'lucide-react'; 

import useSocketListeners from "./hooks/useSocketListeners";
import CodeEditor from "./components/CodeEditor";
import ReviewPanel from "./components/ReviewPanel";
import CollaborationPanel from "./components/CollaborationPanel";
import ParticipantsList from "./components/ParticipantsList";
import SectionHeader from "./components/SectionHeader";
import { downloadReview } from "./utils/downloadReview";
import { Toaster } from "react-hot-toast";

import "highlight.js/styles/github-dark.css"; 
import Chat from "./components/Chat";

import useVoiceChat from "./hooks/useVoiceChat";

function App() {
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
        setShowChat(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 font-sans relative overflow-x-hidden">
            <Toaster position="top-center" reverseOrder={false} /> 
            
            {/* Enhanced Header */}
            <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 p-4 shadow-2xl shadow-slate-900/50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <Code size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                CodeCollab AI
                            </h1>
                            <p className="text-xs text-slate-400">Real-time collaborative coding</p>
                        </div>
                    </div>
                    <nav className="flex items-center space-x-4">
                        {isCollaborating && (
                            <div className="flex items-center space-x-3 bg-slate-700/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-600/50">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-green-400">LIVE</span>
                                </div>
                                <span className="text-sm font-medium text-slate-200">{roomName}</span>
                                <Users size={16} className="text-slate-400" />
                                <span className="text-sm text-slate-300">{participants.length}</span>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Global Error Banner */}
                {error && (
                    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-2xl flex items-center justify-center font-medium transition-all duration-300 transform scale-100 border border-red-400">
                        <Zap size={18} className="mr-3 text-red-200" />
                        {error}
                    </div>
                )}

                {/* Left Column: Code Editor & Collaboration */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                    {/* Collaboration Cards - Side by Side */}
                    {!isCollaborating && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Create New Room Card */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 shadow-2xl border border-slate-600/50 transition-all duration-300 hover:shadow-blue-500/20 hover:border-blue-500/30">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <Plus size={20} className="text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-200">Create New Room</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Session Name</label>
                                        <input
                                            type="text"
                                            value={sessionName}
                                            onChange={(e) => setSessionName(e.target.value)}
                                            placeholder="Enter session name"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={createCollaborationSession}
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
                                    >
                                        <Plus size={18} />
                                        <span>Create Session</span>
                                    </button>
                                </div>
                            </div>

                            {/* Join Existing Room Card */}
                            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 shadow-2xl border border-slate-600/50 transition-all duration-300 hover:shadow-green-500/20 hover:border-green-500/30">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <LogIn size={20} className="text-green-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-200">Join Existing Room</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Room ID</label>
                                        <input
                                            type="text"
                                            value={roomId}
                                            onChange={(e) => setRoomId(e.target.value)}
                                            placeholder="Enter room ID"
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <button
                                        onClick={joinCollaborationSession}
                                        className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-green-500/25 flex items-center justify-center space-x-2"
                                    >
                                        <LogIn size={18} />
                                        <span>Join Session</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Participants List */}
                    {isCollaborating && (
                        <ParticipantsList
                            roomName={roomName}
                            roomId={roomId}
                            socketRef={socketRef}
                            participants={participants}
                            showCopySuccess={showCopySuccess}
                            copyRoomId={copyRoomId}
                            leaveSession={leaveCollaborationSession}
                            className="bg-slate-800/80 rounded-2xl p-6 shadow-xl border border-slate-700/50"
                        />
                    )}

                    {/* Code Editor Section */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-200 flex items-center space-x-2">
                                <Code size={24} className="text-blue-400" />
                                <span>Code Editor</span>
                            </h2>
                            {isCollaborating && (
                                <div className="flex items-center space-x-2 text-sm text-slate-400">
                                    <Wifi size={16} className="text-green-400" />
                                    <span>Real-time sync active</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex-1 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden min-h-[500px]">
                            <CodeEditor code={code} onChange={handleCodeChange} />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col gap-4 sticky bottom-0 z-40 bg-slate-900/80 backdrop-blur-sm p-4 -mx-4 lg:mx-0 rounded-t-2xl border-t border-slate-700/50 lg:border-none">
                        {/* Voice Chat Controls */}
                        {isCollaborating && (
                            <div className="bg-slate-800 rounded-xl p-4 shadow-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                                    <button
                                        onClick={() => { startCall(); setIsVoiceConnected(true); }}
                                        disabled={isVoiceConnected}
                                        className="flex items-center justify-center flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-700 disabled:text-slate-400 text-white shadow-md hover:shadow-teal-500/40 active:scale-95"
                                    >
                                        <PhoneCall size={18} className="mr-2" />
                                        Start Voice
                                    </button>

                                    <button
                                        onClick={toggleMute}
                                        disabled={!isVoiceConnected}
                                        className={`flex items-center justify-center flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                            muted 
                                                ? "bg-red-600 hover:bg-red-500 shadow-red-500/40" 
                                                : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/40"
                                        } disabled:bg-slate-700 disabled:text-slate-400 text-white shadow-md active:scale-95`}
                                    >
                                        {muted ? <MicOff size={18} className="mr-2" /> : <Mic size={18} className="mr-2" />}
                                        {muted ? "Unmute" : "Mute"}
                                    </button>
                                    
                                    <button
                                        onClick={stopVoice}
                                        disabled={!isVoiceConnected}
                                        className="flex items-center justify-center flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 shadow-md active:scale-95"
                                    >
                                        <PhoneMissed size={18} className="mr-2" />
                                        Stop Voice
                                    </button>
                                </div>

                                {isVoiceConnected && (
                                    <div className="flex items-center text-teal-400 font-semibold text-sm">
                                        <Wifi size={18} className="mr-2 animate-pulse text-teal-300" />
                                        Voice Connected
                                    </div>
                                )}

                                <audio ref={localAudioRef} autoPlay muted className="hidden" />
                                <audio ref={remoteAudioRef} autoPlay className="hidden" />
                            </div>
                        )}

                        {/* AI Review Button */}
                        <button
                            onClick={reviewCode}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 transition-all duration-300 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-purple-500/40 active:scale-[0.98] flex items-center justify-center space-x-3 group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Zap size={24} className="text-yellow-300 group-hover:scale-110 transition-transform" />
                                    <span>
                                        {isCollaborating ? "Request Collaborative AI Review" : "Generate AI Review"}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Column: Review Panel */}
                <div className="w-full lg:w-1/2 lg:sticky lg:top-24 h-fit lg:h-[calc(100vh-8rem)] flex flex-col"> 
                    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl border border-slate-700/50 h-full flex flex-col">
                        {/* Review Panel Header */}
                        <div className="p-6 border-b border-slate-700/50 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <CornerDownLeft size={24} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-200">AI Code Review</h2>
                                        <p className="text-sm text-slate-400">Detailed feedback and suggestions</p>
                                    </div>
                                </div>
                                {review && (
                                    <button
                                        onClick={() => downloadReview(review)}
                                        className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors duration-200 text-slate-300 hover:text-white"
                                        title="Download Review"
                                    >
                                        <Download size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Review Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <ReviewPanel
                                isLoading={isLoading}
                                review={review}
                                isCollaborating={isCollaborating}
                                downloadReview={() => downloadReview(review)}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Enhanced Floating Chat Button */}
            {isCollaborating && (
                <button
                    onClick={() => setShowChat(true)}
                    className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-teal-500 to-green-600 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 transform active:scale-95 text-white shadow-teal-500/50 hover:shadow-teal-500/70 ${
                        showChat ? 'opacity-0 pointer-events-none' : '' 
                    }`}
                    aria-label="Open Chat"
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {/* Enhanced Chat Panel */}
            {isCollaborating && (
                <div
                    className={`fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 border-l border-teal-500/30 shadow-2xl z-[55] transition-transform duration-300 ease-in-out ${
                        showChat ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Chat Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-700 flex-shrink-0 bg-slate-800/80 backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-teal-500/20 rounded-lg">
                                    <MessageSquare size={20} className="text-teal-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200">Collaborative Chat</h3>
                                    <p className="text-xs text-slate-400">Real-time messaging</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowChat(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200"
                                aria-label="Close Chat"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Chat Content */}
                        <div className="flex-grow bg-slate-900/50"> 
                            <Chat socketRef={socketRef} userName={userName} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;