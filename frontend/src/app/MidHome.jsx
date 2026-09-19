import React, { useState } from "react";
import "../css/middle.css";
import { messages } from "../assets/message";
import { useEffect } from "react";
import { useRef } from "react";
import { io } from "socket.io-client";

const MidHome = ({ userId, friendsId }) => {
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const ws = useRef(null);

  async function handelSend() {
    try {

      const obj = {
        type: "message",
        senderId: userId,
        receiverId: friendsId,
        text,
      };

      console.log("SENDING:", obj);

      // ws.current.send(JSON.stringify(obj));
      ws.current.emit("sendMessage", obj);

      setText("");
    } catch (error) {
      console.log(error.message);
    }
  }

  async function getAllChats(userId, friendsId) {
    try {
      const ans = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/chats/${userId}/${friendsId}`,
      );
      const data = await ans.json();
      // console.log(data);
      setChats(data.data);
    } catch (error) {
      console.log(error.message);
    }
  }
  console.log(chats);

  useEffect(() => {
    if (!userId || !friendsId) return;
    getAllChats(userId, friendsId);
  }, [userId, friendsId]);

  useEffect(() => {

  if (!userId) return;

  const socket = io(
    import.meta.env.VITE_WEBSOCKET_BACKEND_URL
  );

  ws.current = socket;

  socket.on("connect", () => {
    console.log("Socket.IO connected");
    socket.emit("register", userId);
  });

  socket.on("receiveMessage", (newMessage) => {
    const chat = {
      ...newMessage,
      type:
        Number(newMessage.senderId) === Number(userId)
          ? "sent"
          : "received",
    };

    setChats((previousChats) => [
      ...previousChats,
      chat
    ]);

  });

  socket.on("disconnect", () => {
    console.log("Socket.IO disconnected");
  });

  return () => {
    socket.disconnect();
  };

}, [userId]);
  

  function getTime(time) {
    if (!time) return;

    const date = new Date(time);
    const tt = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return tt;
  }

  return (
    <div className="mid_home">
      {/* ===== TOP HEADER ===== */}
      <div className="mid_top">
        <div className="mid_user">
          <img src="/dp3.jpg" alt="user" />

          <div className="mid_user_info">
            <h3>Maria Nelson</h3>
            <p>Grateful for every sunrise and sunset</p>
          </div>
        </div>

        <div className="mid_icons">
          <button>📞</button>
          <button>📹</button>
          <button>ⓘ</button>
        </div>
      </div>

      {/* ===== MIDDLE CHAT AREA ===== */}
      <div className="mid_messages">
        <div className="mid_messages">
          {chats.map((message) => (
            <div key={message.id} className={`message_row ${message.type}`}>
              <div className="message_bubble">
                <p>{message.message}</p>

                <span className="message_time">{getTime(message.time || message.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== BOTTOM INPUT ===== */}
      <div className="mid_bottom">
        <div className="bottom_icons">
          <button>🖼</button>
          <button>📷</button>
          <button>🎤</button>
        </div>

        <div className="message_input">
          <input
            type="text"
            required
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button className="emoji_btn">😊</button>
        </div>

        <button onClick={handelSend} className="send_btn">
          ➤
        </button>
      </div>
    </div>
  );
};

export default MidHome;
