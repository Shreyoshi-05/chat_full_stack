import React, { useState } from "react";
import "../css/left.css";
import { useEffect } from "react";
import { RiSearchAi2Line } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";
import { LuSettings } from "react-icons/lu";
import { Link } from "react-router-dom";
import { MdGroupAdd } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { LuLogOut } from "react-icons/lu";
import { AiFillSmile } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { Get } from "../assets/Get";


const LfHome = ({ userId, userDeatils, setFriendsId ,setProfile,profile,setAdd,setGropid}) => {
  const [search, setSearch] = useState("");
  const [allusers, setAllUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [group, setGroup] = useState([]);

  async function getAllUser(userId) {
    const ans =await Get(`${import.meta.env.VITE_BACKEND_URL}/user/all/${userId}`);
    // console.log(ans);
    setAllUsers(ans);
  }

  async function handelSearch() {
    const ans = await Get(`${import.meta.env.VITE_BACKEND_URL}/user/findByemail?email=${email}`);
    setFriendsId(ans?.id);
  }

  async function getGroupname() {
    const ans = await Get(`${import.meta.env.VITE_BACKEND_URL}/get/groups`);
    // console.log(ans);
    setGroup(ans);
  }

  async function getAllChats(id) {
    setGropid(id);
    const ans = await Get(`${import.meta.env.VITE_BACKEND_URL}/show/groups/messages/${id}`);
    console.log(ans);
  }

  useEffect(() => {
    // if(!userId) return;
    getAllUser(userId);
    getGroupname();
  }, []);

  // console.log(allusers);

  if(!allusers.length)return;

  return (
    <div className="left_home">
      {/* HEADER */}
      <div className="left_header">
        <div className="current_user">
          <img src="/dp.jpg" alt="profile" />

          <h3>{userDeatils?.name}</h3>
        </div>

        <div className="header_actions">
          <div className="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0} role="button" className=" m-1">
              <IoSettingsOutline size={20} />
            </div>
            <ul
              tabIndex={-1}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-32 p-2 shadow-sm"
            >
              <li style={{ padding: "0.3rem 0.8rem" }} onClick={() => setAdd(true)}>
                <a style={{ fontSize: "0.6rem" }}> <MdGroupAdd /> Add Group</a>
              </li>
              <li style={{ padding: "0.3rem 0.8rem" }} onClick={()=>setProfile(true)}>
                <a style={{ fontSize: "0.6rem" }}><AiFillSmile /> Profile</a>
              </li>
              <li style={{ padding: "0.3rem 0.8rem" }}>
                <Link to={"/"} style={{ fontSize: "0.6rem" }}>
                <LuLogOut />
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="search_section">
        <div className="search_box">
          {/* <span className="search_icon"></span> */}

          <input
            type="text"
            placeholder="Search user by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="add_chat" onClick={handelSearch}>
          <RiSearchAi2Line />
        </button>
      </div>

      {/* CHAT USERS */}
      <div className="chat_list">
        {allusers.map((user) => (
          <div
            className="chat_user"
            key={user.id}
            onClick={() => setFriendsId(user.otherUserId)}
          >
            <img src={"/dp3.jpg"} alt={user.name} className="chat_avatar" />

            <div className="chat_user_info">
              <h4>{user.name}</h4>

              <p>{user.chats}</p>
            </div>
          </div>
        ))}
        {group.map((user) => (
          <div
            className="chat_user"
            key={user.id}
            onClick={() => getAllChats(user.id)}
          >
            <img src={"/dp3.jpg"} alt={user.name} className="chat_avatar" />

            <div className="chat_user_info">
              <h4>{user.name}</h4>

              <p>{user.chats}</p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default LfHome;
