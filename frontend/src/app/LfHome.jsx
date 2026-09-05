import React, { useState } from "react";
import "../css/left.css"


const users = [
  {
    id: 1,
    name: "Maria Nelson",
    message: "looks good",
    image: "/dp3.jpg",
  },
  {
    id: 2,
    name: "Ashley Harris",
    message: "lucky you",
    image: "/dp3.jpg",
  },
  {
    id: 3,
    name: "Andrew Wilson",
    message: "same here.",
    image: "/dp3.jpg",
  },
  {
    id: 4,
    name: "Jennifer Brown",
    message: "wait a second",
    image: "/dp3.jpg",
  },
  {
    id: 5,
    name: "Edward Davis",
    message: "how's it going?",
    image: "/dp3.jpg",
  },
  {
    id: 6,
    name: "Karen Wilson",
    message: "i hear you",
    image: "/dp3.jpg",
  },
];

const LfHome = () => {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="left_home">

      {/* HEADER */}
      <div className="left_header">

        <div className="current_user">
          <img src="/dp.jpg" alt="profile" />

          <h3>John Smith</h3>
        </div>

        <div className="header_actions">
          <button>•••</button>
          <button>▣</button>
          <button>✎</button>
        </div>

      </div>


      {/* SEARCH */}
      <div className="search_section">

        <div className="search_box">
          <span className="search_icon">⌕</span>

          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="add_chat">
          +
        </button>

      </div>


      {/* CHAT USERS */}
      <div className="chat_list">

        {filteredUsers.map((user) => (
          <div className="chat_user" key={user.id}>

            <img
              src={user.image}
              alt={user.name}
              className="chat_avatar"
            />

            <div className="chat_user_info">

              <h4>{user.name}</h4>

              <p>{user.message}</p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default LfHome;