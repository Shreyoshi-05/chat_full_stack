import React from "react";
import LfHome from "./LfHome";
import MidHome from "./MidHome";
import RiHome from "./RiHome";
import "../css/home.css";
import { useState } from "react";
import { useEffect } from "react";


const Home = () => {
  const [friendsId, setFriendsId] = useState();
  const [userId, setUserId] = useState();
  const [userDeatils, setUserDeatalis] = useState()

  async function getUserDetails(uid) {
    try {
      const app = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/details/${uid}`);
      const data = await app.json();
      // console.log(data);
      setUserDeatalis(data.data);

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const chatuser = JSON.parse(localStorage.getItem("chatuser"));

    const userId = chatuser?.data?.id;
    if (userId) {
      setUserId(userId);
      getUserDetails(userId)
    }
  }, []);

  // useEffect(()=>{
  //   const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_BACKEND_URL);
  //   ws.onopen = () => {
  //     console.log("connected");

  //     ws.send(JSON.stringify({
  //       type:"register",
  //       userId
  //     }))
  //   }
  // },[userId]);

  // console.log(userId,friendsId)

  return (
    <div className="home_container">

    <LfHome
      userId={userId}
      userDeatils={userDeatils}
      setFriendsId={setFriendsId}
    />

    {friendsId ? (
      <>
        <MidHome
          userId={userId}
          friendsId={friendsId}
        />

        <RiHome
          friendsId={friendsId}
        />
      </>
    ) : (
      <div className="no_chat_selected">
        <div className="no_chat_content">

          <div className="no_chat_icon">
            💬
          </div>

          <h2>Your Messages</h2>

          <p>
            Select a conversation to start chatting
          </p>

        </div>
      </div>
    )}

  </div>
  );
};

export default Home;
