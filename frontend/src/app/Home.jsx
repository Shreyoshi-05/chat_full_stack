import React from "react";
import LfHome from "./LfHome";
import MidHome from "./MidHome";
import RiHome from "./RiHome";
import "../css/home.css";
import { useState } from "react";
import { useEffect } from "react";
import Profile from "./Profile";
import Add from "./Add";
import { Get } from "../assets/Get.js";
// import Get from "../assets/Get.js";

const Home = () => {
  const [friendsId, setFriendsId] = useState();
  const [userId, setUserId] = useState();
  const [userDeatils, setUserDeatalis] = useState();
  const [profile, setProfile] = useState(false);
  const [add , setAdd] = useState(false);
  const [groupId, setGropid] = useState();

  async function getUserDetails(uid) {
    const ans = await Get(`${import.meta.env.VITE_BACKEND_URL}/user/details/${uid}`);
    setUserDeatalis(ans);
  }

  useEffect(() => {
    const chatuser = JSON.parse(localStorage.getItem("chatuser"));

    const userId = chatuser?.data?.id;
    if (userId) {
      setUserId(userId);
      getUserDetails(userId);
    }
  }, []);

  // console.log(add)

  return (
    <div className="home_container">
          <LfHome
            userId={userId}
            userDeatils={userDeatils}
            setFriendsId={setFriendsId}
            setProfile={setProfile}
            profile={profile}
            setAdd={setAdd}
            setGropid={setGropid}
          />

          {groupId||friendsId ? (
            <>
              <MidHome userId={userId} friendsId={friendsId} groupId={groupId}/>

              <RiHome friendsId={friendsId} groupId={groupId}/>
            </>
          ) : (
            <div className="no_chat_selected">
              <div className="no_chat_content">
                <div className="no_chat_icon">💬</div>

                <h2>Your Messages</h2>

                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}

          

          {profile && <div className="profile_page"><Profile setProfile={setProfile}/></div> }
          {add && <Add userId={userId} setAdd={setAdd}/>}
    </div>
  );
};

export default Home;
