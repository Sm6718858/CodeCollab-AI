export default function ParticipantsList({
  roomName,
  roomId,
  socketRef,
  participants,
  showCopySuccess,
  copyRoomId,
  leaveSession,
}) {
  const isOwner = participants.some(
    (p) => p.id === socketRef.current?.id && p.isOwner
  );

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4 space-y-4 shadow-md">
      {/* Room Info Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white">{roomName}</h3>

        <div className="flex flex-col md:flex-row md:items-center md:gap-3 gap-1 text-sm text-gray-300">
          <span className="break-all">Room ID: {roomId}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyRoomId}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Copy
            </button>
            {showCopySuccess && (
              <span className="text-green-400 font-medium">Copied!</span>
            )}
          </div>
        </div>

        {isOwner && (
          <span className="inline-block bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-md">
            You are the Owner 👑
          </span>
        )}
      </div>

      {/* Participants List */}
      <div className="space-y-2">
        <h4 className="text-md font-semibold text-gray-200">
          Participants ({participants.length})
        </h4>
zz
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {participants.map((p) => (
            <div
              key={p.id}
              className={`bg-gray-700 px-3 py-2 rounded-md text-sm text-white flex justify-between items-center ${
                p.id === socketRef.current?.id ? "border border-blue-500" : ""
              }`}
            >
              <span>
                {p.name} {p.id === socketRef.current?.id && "(You)"}
              </span>
              {p.isOwner && <span className="text-yellow-400">👑</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Leave Button */}
      <button
        onClick={leaveSession}
        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition"
      >
        Leave Session
      </button>
    </div>
  );
}
