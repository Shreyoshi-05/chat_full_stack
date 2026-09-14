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

  useEffect(() => {
    const chatuser = JSON.parse(localStorage.getItem("chatuser"));

    const userId = chatuser?.data?.id;
    if (userId) {
      setUserId(userId);
    }
  }, []);

  // console.log(userId,friendsId)

  return (
    <div className="home_container">
      <LfHome
        userId={userId}
        setUserId={setUserId}
        setFriendsId={setFriendsId}
      />
      <MidHome userId={userId} friendsId={friendsId} />
      <RiHome friendsId={friendsId} />
    </div>
  );
};

export default Home;
