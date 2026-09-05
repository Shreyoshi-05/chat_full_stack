import React from "react";
import "../css/middle.css";
import { messages } from "../assets/message";

const MidHome = () => {
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
          {messages.map((message) => (
            <div key={message.id} className={`message_row ${message.type}`}>
              <div className="message_bubble">
                <p>{message.text}</p>

                <span className="message_time">{message.time}</span>
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
          <input type="text" placeholder="Type a message" />

          <button className="emoji_btn">😊</button>
        </div>

        <button className="send_btn">➤</button>
      </div>
    </div>
  );
};

export default MidHome;
