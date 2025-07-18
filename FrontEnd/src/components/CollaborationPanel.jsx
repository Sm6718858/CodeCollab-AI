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
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">
        Start or Join Collaboration
      </h3>

      {/* Your Name */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-300">Your Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Create New Session */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">Create New Session</label>
        <input
          type="text"
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          placeholder="Enter session name"
          className="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={createSession}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          Create Session
        </button>
      </div>

      {/* Divider */}
      <div className="relative text-center">
        <span className="text-gray-400 px-3 bg-gray-800 relative z-10">OR</span>
        <div className="absolute left-0 right-0 top-1/2 border-t border-gray-700 -z-10"></div>
      </div>

      {/* Join Existing Session */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-300">Join Existing Session</label>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
          className="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={joinSession}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          Join Session
        </button>
      </div>
    </div>
  );
}
