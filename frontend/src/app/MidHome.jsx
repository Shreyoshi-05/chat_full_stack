import React, { useState } from "react";
import "../css/middle.css";
import { messages } from "../assets/message";
import { useEffect } from "react";
import { useRef } from "react";
import { io } from "socket.io-client";
import { Get } from "../assets/Get";

const MidHome = ({ userId, friendsId, groupId }) => {
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const [friendsDetails, setFriendsDetails] = useState();
  const [groupname, setGroupname] = useState();
  const [groupMessage, setGroupMessage] = useState([]);

  const ws = useRef(null);
  const friendsIdRef = useRef(friendsId);
  const groupRef = useRef(groupId);
  

  useEffect(() => {
    groupRef.current = groupId;
  }, [groupId]);


  async function handelSend() {
    if (!text.trim() || !userId || !friendsId) return;

    const roomId = [Number(userId), Number(friendsId)]
      .sort((a, b) => a - b)
      .join("_");
    try {
      const obj = {
        roomId,
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
    const ans = await Get(
      `${import.meta.env.VITE_BACKEND_URL}/chats/${userId}/${friendsId}`,
    );
    setChats(ans);
  }

  async function getFriendsDeatils(fId) {
    const ans = await Get(`${import.meta.env.VITE_BACKEND_URL}/details/${fId}`);
    setFriendsDetails(ans);
  }

  async function getAllGroupData(id) {
    const ans = await Get(
      `${import.meta.env.VITE_BACKEND_URL}/show/groups/messages/${id}`,
    );
    console.log(ans);
    setGroupMessage(Array.isArray(ans)?ans:[]);
  }

  async function getGroupName(groupId) {
    const ans = await Get(
      `${import.meta.env.VITE_BACKEND_URL}/get/group/name/${groupId}`,
    );
    setGroupname(ans);
  }

  async function sendGroupMessages() {
    const message = text.trim();

    if (!message || !userId || !groupId) return;

    ws.current.emit("sendGroupMessage", {
      groupId,
      senderId: userId,
      text: message,
    });
    setText("");
  }

  useEffect(() => {
    if (!groupId) return;

    getGroupName(groupId);
    getAllGroupData(groupId);
  }, [groupId]);

  useEffect(() => {
    friendsIdRef.current = friendsId;
  }, [friendsId]);

  useEffect(() => {
    if (!userId || !friendsId) return;

    console.log("USER:", userId);
    console.log("FRIEND:", friendsId);

    getAllChats(userId, friendsId);
    getFriendsDeatils(friendsId);

    if (ws.current?.connected) {
      ws.current.emit("join_room", {
        userId,
        friendsId,
      });
    }
  }, [userId, friendsId]);

  useEffect(() => {
    if (!userId) return;

    const socket = io(import.meta.env.VITE_WEBSOCKET_BACKEND_URL);

    ws.current = socket;

    socket.on("connect", () => {
      console.log("Socket.IO connected");
      socket.emit("register", userId);

      if (friendsIdRef.current) {
        socket.emit("join_room", {
          userId: userId,
          friendsId: friendsIdRef.current,
        });
      }

      if (groupRef.current) {
        socket.emit("join_group", {
          groupId: groupRef.current,
          userId,
        });
      }
    });

    socket.on("receiveMessage", (newMessage) => {
      console.log("newmessage", newMessage);

      const senderId = Number(newMessage.senderId);
      const receiverId = Number(newMessage.receiverId);
      const myId = Number(userId);
      const currentFriendId = Number(friendsIdRef.current);

      const belongsToCurrentChat =
        (senderId === myId && receiverId === currentFriendId) ||
        (senderId === currentFriendId && receiverId === myId);

      if (!belongsToCurrentChat) {
        return;
      }

      const chat = {
        ...newMessage,
        type: senderId === myId ? "sent" : "received",
      };

      setChats((previousChats) => [...previousChats, chat]);
    });

    socket.on("receiveGroupMessage", (newMessage) => {
      if (Number(newMessage.groupId) !== Number(groupRef.current)) return;

      setGroupMessage((previous) => [...previous, newMessage]);
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!groupId || !userId || !ws.current?.connected) return;

    ws.current.emit("join_group", { groupId, userId });
  }, [groupId, userId]);

  function getTime(time) {
    if (!time) return;

    const date = new Date(time);
    const tt = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return tt;
  }
  // console.log(groupMessage);

  return (
    <div className="mid_home">
      {/* ===== TOP HEADER ===== */}
      <div className="mid_top">
        <div className="mid_user">
          <img src="/dp3.jpg" alt="user" />

          <div className="mid_user_info">
            <h3>{friendsDetails?.name || groupname?.name}</h3>
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
        {(groupId ? groupMessage : chats).map((message) => (
          <div key={message.id} className={`message_row ${Number(message.senderId) === Number(userId) ? "sent" : "received"}`}>
            <div className="message_bubble">
              <p>{message.message||message.text}</p>

              <span className="message_time">
                {getTime(message.time || message.createdAt)}
              </span>
            </div>
          </div>
        ))}
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

        <button
          onClick={groupId ? sendGroupMessages : handelSend}
          className="send_btn"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default MidHome;
