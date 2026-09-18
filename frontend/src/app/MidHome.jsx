import React, { useState } from "react";
import "../css/middle.css";
import { messages } from "../assets/message";
import { useEffect } from "react";
import { useRef } from "react";

const MidHome = ({ userId, friendsId }) => {
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const ws = useRef(null);

  async function handelSend() {
    try {
      // const ans = await fetch(
      //   `${import.meta.env.VITE_BACKEND_URL}/user/message`,
      //   {
      //     method: "post",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       senderId: userId,
      //       receiverId: friendsId,
      //       text,
      //     }),
      //   },
      // );
      // const data = await ans.json();
      // // console.log(data);

      // if(data.success){
      //   getAllChats(userId, friendsId);
      // }
      // console.log(ws);

      console.log("CURRENT STATE:", ws.current?.readyState);
      console.log("sender:", userId);
      console.log("receiver:", friendsId);

      if (ws.current?.readyState !== WebSocket.OPEN) {
        console.log("WebSocket is not connected");
        return;
      }

      const obj = {
        type: "message",
        senderId: userId,
        receiverId: friendsId,
        text,
      };

      console.log("SENDING:", obj);

      ws.current.send(JSON.stringify(obj));
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
    if (!userId || !friendsId) return;
    getAllChats(userId, friendsId);
  }, [userId, friendsId]);


  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_BACKEND_URL);

    ws.current = socket;

    socket.onopen = () => {
      // console.log("WEBSOCKET OPEN:", socket.readyState);

      socket.send(
        JSON.stringify({
          type: "register",
          userId,
        }),
      );
    };

    socket.onclose = (event) => {
      console.log("WEBSOCKET CLOSED");
      // console.log("readyState:", socket.readyState);
      // console.log("code:", event.code);
      // console.log("reason:", event.reason);
    };

    socket.onerror = (error) => {
      console.log("WEBSOCKET ERROR:", error);
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === "message") {
        const newMessage = response.data;

        const chat = {
          ...newMessage,
          type:
            Number(newMessage.senderId) === Number(userId)
              ? "sent"
              : "received",
        };

        setChats((previousChats) => [...previousChats, chat]);
      }
    };

    return () => {
      console.log("MidHome cleanup");

      if (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };
  }, [userId]);

  function getTime(time){
    if(!time) return;

    const date = new Date(time);
    const tt = date.toLocaleTimeString([],{
      hour: "2-digit",
      minute:"2-digit"
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

                <span className="message_time">{getTime(message.time)}</span>
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
