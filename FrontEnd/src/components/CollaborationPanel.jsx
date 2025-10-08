export default function CollaborationPanel({
    userName,
    setUserName,
    sessionName,
    setSessionName,
    roomId,
    setRoomId,
    createSession,
    joinSession,
}) {
    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold text-indigo-400 border-b border-gray-700 pb-3">
                Session Control
            </h3>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Your Collaborator Name</label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner transition-colors"
                />
            </div>

            <div className="flex flex-col gap-3 p-4 bg-gray-900 rounded-xl border border-gray-700 shadow-lg">
                <label className="text-md font-semibold text-indigo-400">Create New Session</label>
                <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="Enter session name (e.g., 'Project Alpha Review')"
                    className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    onClick={createSession}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-indigo-500/50"
                >
                    Create & Start Session
                </button>
            </div>

            <div className="relative text-center my-6">
                <span className="text-slate-400 text-sm px-4 bg-gray-800 relative z-10 rounded-full font-medium">
                    OR
                </span>
                <div className="absolute left-0 right-0 top-1/2 border-t border-gray-700 -z-10"></div>
            </div>

            <div className="flex flex-col gap-3 p-4 bg-gray-900 rounded-xl border border-gray-700 shadow-lg">
                <label className="text-md font-semibold text-teal-400">Join Existing Session</label>
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Paste Room ID here"
                    className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                    onClick={joinSession}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-bold transition-all duration-200 shadow-md hover:shadow-teal-500/50"
                >
                    Join Session
                </button>
            </div>
        </div>
    );
}