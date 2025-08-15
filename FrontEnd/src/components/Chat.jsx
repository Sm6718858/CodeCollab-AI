import React, { useEffect, useRef, useState } from "react";
const Chat = ({ socketRef,userName}) => {
  const [messages, setMessages] = useState([]);
  const inputRef = useRef();

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
      console.log(messages);
      
    });

    

    return () => {
      socketRef.current.off("receiveMessage");
      socketRef.current.off("prevMessage");
    };
  });

  const endRef = useRef(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat">
      <h2>Chat Section</h2>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index}>
            <div ref={endRef} />
            <b className="userName">{msg.user}:</b> {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-bottom">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <img src="send_button.svg" className="send" onClick={sendMessage}></img>
      </div>
    </div>
  );
};

export default Chat;
