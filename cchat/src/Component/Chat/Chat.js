import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;
const ENDPOINT = "http://localhost:5000";

const Chat = () => {
  const [id, setId] = useState("");
  const [messages, setMessages] = useState([]);

  const send = () => {
    const input = document.getElementById("chatInput");
    const message = input.value;

    if (message.trim()) {
      socket.emit("message", { message });
      input.value = "";
    }
  };

  // 🔹 Socket connection (runs ONCE)
  useEffect(() => {
  socket = socketIo(ENDPOINT);

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
    setId(socket.id);
  });

  socket.emit("joined", { user });

  socket.on("welcome", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  socket.on("userJoined", (data) => {
    setMessages((prev) => [...prev, data]);
  });
  socket.on("leave", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  socket.on("sendMessage", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  return () => {
    if (socket && socket.connected) {
    socket.disconnect();
  }
};

}, []);
 // ✅ EMPTY dependency

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header">
          <h2>C CHAT</h2>
          <a href="/">
            <img src={closeIcon} alt="Close" />
          </a>
        </div>

        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message
              key={i}
              user={item.id === id ? "You" : item.user}
              message={item.message}
              classs={item.id === id ? "right" : "left"}
            />
          ))}
        </ReactScrollToBottom>

        <div className="inputBox">
          <input
            onKeyPress={(e) => (e.key === "Enter" ? send() : null)}
            type="text"
            id="chatInput"
          />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
