import React, { useState } from "react";
import "../css/middle.css";
import { messages } from "../assets/message";
import { useEffect } from "react";
import { useRef } from "react";
import { io } from "socket.io-client";
import { Get, post } from "../assets/Get";
import { MdAutoFixHigh } from "react-icons/md";
import { MdOutlineAutoAwesome } from "react-icons/md";
import { FaMagic } from "react-icons/fa";

const MidHome = ({ userId, friendsId, groupId }) => {
  const [text, setText] = useState("");
  const [chats, setChats] = useState([]);
  const [friendsDetails, setFriendsDetails] = useState();
  const [groupname, setGroupname] = useState();
  const [groupMessage, setGroupMessage] = useState([]);

  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const mediaInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [gptAns, setGptAns] = useState([]);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    // console.log(file);
    if (file) setSelectedFile(file);

    setShowAttachments(false);
    e.target.value = ""; // Allows selecting the same file again.
  }

  async function uploadMedia() {
    if (!selectedFile || !userId || (!groupId && !friendsId)) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("senderId", userId);
    if (groupId) {
      formData.append("groupId", groupId);
    } else {
      formData.append("receiverId", friendsId);
    }

    setUploading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/media/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const ans = await response.json();
      console.log(ans);

      if (!response.ok || !ans.success) {
        throw new Error(ans.message || "Upload failed");
      }

      const newMessage = ans.data;

      if (groupId) {
        setGroupMessage((pre) => [...pre, newMessage]);
      } else {
        setChats((pre) => [...pre, newMessage]);
      }

      setSelectedFile(null);
      setText("");
    } catch (error) {
      console.log(error.message);
    } finally {
      setUploading(false);
    }
  }

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
    setGroupMessage(Array.isArray(ans) ? ans : []);
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

  async function hendleGenerate(params) {
    let mess = groupId ? groupMessage : chats;
    let newMess = mess.slice(-5).map((mm) => {
      return {
        text: mm.message ?? mm.text ?? "",
        type:
          mm.type ??
          (String(mm.senderId) === String(userId) ? "sent" : "received"),
      };
    });

    // console.log(JSON.stringify(newMess));

    try {
      const ans = await post(
        `${import.meta.env.VITE_BACKEND_URL}/generate/message`,
        newMess,
      );
      // console.log(ans);

      if (!Array.isArray(ans)) {
        throw new Error("The backend did not return suggestions");
      }

      setGptAns(ans);
    } catch (error) {
      console.log(error.message);
    }
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

      // setChats((previousChats) => [...previousChats, chat]);
      setChats((previous) =>
        previous.some((item) => Number(item.id) === Number(newMessage.id))
          ? previous
          : [...previous, newMessage],
      );
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
          <div
            key={message.id}
            className={`message_row ${Number(message.senderId) === Number(userId) ? "sent" : "received"}`}
          >
            <div className="message_bubble">
              {message.fileUrl &&
                (message.fileType?.startsWith("image/") ? (
                  <img
                    src={message.fileUrl}
                    alt={message.fileName || "Attachment"}
                    style={{
                      maxWidth: "240px",
                      maxHeight: "300px",
                      borderRadius: "10px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <a
                    href={message.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📎 {message.fileName || "Open attachment"}
                  </a>
                ))}

              {(message.message || message.text) && (
                <p>{message.message || message.text}</p>
              )}

              <span className="message_time">
                {getTime(message.time || message.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== BOTTOM INPUT ===== */}
      {selectedFile && (
        <div className="selected_file">
          <span>📎 {selectedFile.name}</span>

          <button type="button" onClick={() => setSelectedFile(null)}>
            ✕
          </button>
        </div>
      )}
      <div className="mid_bottom">
        {/* <input type="file" onChange={handelChangeFile}/> */}
        <div className="attachment_picker">
          <button
            type="button"
            onClick={() => setShowAttachments((previous) => !previous)}
          >
            📎
          </button>

          {showAttachments && (
            <div className="attachment_menu">
              <button
                type="button"
                onClick={() => mediaInputRef.current?.click()}
              >
                🖼 Photos & Videos
              </button>

              <button
                type="button"
                onClick={() => documentInputRef.current?.click()}
              >
                📄 Documents
              </button>
            </div>
          )}

          <input
            ref={mediaInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleFileSelect}
          />

          <input
            ref={documentInputRef}
            type="file"
            hidden
            onChange={handleFileSelect}
          />
        </div>

        <div className="message_input">
          <button className="emoji_btn">😊</button>
          <input
            type="text"
            required
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="dropdown dropdown-top dropdown-end">
            <button type="button" className="btn m-1" onClick={hendleGenerate}>
              <FaMagic />
            </button>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              {gptAns.map((item) => {
                return (
                  <li style={{ padding: "0.3rem 0.8rem" }}>
                    <a
                      onClick={() => setText(item)}
                      style={{ padding: "0.5rem 0.5rem" }}
                    >
                      {item}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* <button className="emoji_btn" onClick={hendleGenerate}><FaMagic /></button> */}
          {/* <button className="emoji_btn"><MdAutoFixHigh /></button> */}
        </div>

        {/* <button
          onClick={groupId ? sendGroupMessages : handelSend}
          className="send_btn"
        >
          ➤
        </button> */}
        <button
          onClick={
            selectedFile
              ? uploadMedia
              : groupId
                ? sendGroupMessages
                : handelSend
          }
          disabled={uploading}
          className="send_btn"
        >
          {uploading ? "Uploading…" : "➤"}
        </button>
      </div>
    </div>
  );
};

export default MidHome;
