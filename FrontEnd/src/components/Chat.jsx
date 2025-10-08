import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

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

      if (msg.user !== userName) {
        toast.success(`💬 New message from ${msg.user}`, {
          position: "top-right",
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "10px",
            padding: "10px 15px",
          },
          iconTheme: {
            primary: "#14b8a6",
            secondary: "#fff",
          },
        });
      }
    });

    return () => {
      socketRef.current.off("receiveMessage");
    };
  }, [socketRef, userName]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full md:h-[90vh] bg-gray-900 rounded-none md:rounded-xl overflow-hidden shadow-2xl">
      
      {/* Scrollable Chat Section */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.map((msg, index) => {
          const isMe = msg.user === userName;
          return (
            <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] sm:max-w-sm md:max-w-md p-3 rounded-xl shadow-lg ${
                  isMe
                    ? "bg-teal-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-tl-none"
                } transition-all duration-300 transform hover:scale-[1.01]`}
              >
                <div
                  className={`font-semibold text-xs mb-1 ${
                    isMe ? "text-teal-200" : "text-indigo-400"
                  }`}
                >
                  {isMe ? "You" : msg.user}
                </div>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="p-3 md:p-4 border-t border-gray-700 flex-shrink-0 bg-gray-950">
        <div className="flex space-x-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Send a message..."
            className="flex-grow bg-gray-800 text-white px-4 py-2 md:py-3 rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors placeholder-gray-400 text-sm"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={!userName}
          />
          <button
            onClick={sendMessage}
            disabled={!userName}
            className="p-3 bg-teal-600 text-white rounded-full hover:bg-teal-500 transition-all duration-200 shadow-md hover:shadow-teal-500/50 disabled:bg-gray-700 disabled:text-gray-400 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;