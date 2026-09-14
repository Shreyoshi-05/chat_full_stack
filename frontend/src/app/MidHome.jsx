import React, { useState } from "react";
import "../css/middle.css";
import { messages } from "../assets/message";
import { useEffect } from "react";

const MidHome = ({ userId, friendsId }) => {
  const [text, setText] = useState("");
  const [chats ,setChats] = useState([]);


  async function handelSend() {
    try {
      const ans = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/message`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: userId,
            receiverId: friendsId,
            text,
          }),
        },
      );
      const data = await ans.json();
      // console.log(data);
      
      if(data.success){
        getAllChats(userId, friendsId);
      }
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

  useEffect(() => {
    getAllChats(userId, friendsId);
  }, [friendsId]);

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

                <span className="message_time">{message.createdAt}</span>
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
