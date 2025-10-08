import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

const Chat = ({ socketRef, userName }) => {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();
  const endRef = useRef(null);

  const sendMessage = () => {
    const text = inputRef.current.value.trim();
    if (!text) return;

    const messageData = { user: userName, text };
    socketRef.current.emit("sendMessage", messageData);
    inputRef.current.value = "";
  };

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socketRef.current.off("receiveMessage");
  }, [socketRef]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
 <div
    className="flex flex-col md:h-[calc(95vh-4rem)] bg-gray-900"
    style={{ height: "88dvh" }}
  >
      {/* Chat messages area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isMe = msg.user === userName;
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-full sm:max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-xl shadow-lg break-words ${
                  isMe
                    ? "bg-teal-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-tl-none"
                }`}
              >
                <div
                  className={`font-semibold text-xs mb-1 ${
                    isMe ? "text-teal-200" : "text-indigo-400"
                  }`}
                >
                  {isMe ? "You" : msg.user}
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t border-gray-700 bg-gray-950 flex-shrink-0">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Send a message..."
            className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400 text-sm sm:text-base"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!userName}
          />
          <button
            onClick={sendMessage}
            disabled={!userName}
            className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-500 transition duration-200 shadow-md hover:shadow-teal-500/50 disabled:bg-gray-700 disabled:text-gray-400 flex-shrink-0"
            aria-label="Send Message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
