import React from "react";
import "../css/right.css"


const RiHome = () => {
  return (
    <div className="right_home">

      {/* PROFILE */}
      <div className="right_profile">
        <img
          src="/dp.jpg"
          alt="profile"
          className="right_profile_img"
        />

        <h2>Maria Nelson</h2>

        <p>
          Grateful for every sunrise and sunset 🌅
        </p>
      </div>


      {/* OPTIONS */}
      <div className="right_options">

        <div className="option_item">
          <span>Chat settings</span>
          <span>⌃</span>
        </div>

        <div className="option_item">
          <span>Privacy & help</span>
          <span>⌃</span>
        </div>


        {/* SHARED PHOTOS */}
        <div className="option_item">
          <span>Shared photos</span>
          <span>⌄</span>
        </div>

        <div className="shared_list">

          <div className="shared_item">
            <img src="/shared1.jpg" alt="" />

            <span>photo_2026_1.png</span>

            <button>↓</button>
          </div>

          <div className="shared_item">
            <img src="/shared2.jpg" alt="" />

            <span>photo_2026_2.png</span>

            <button>↓</button>
          </div>

          <div className="shared_item">
            <img src="/shared3.jpg" alt="" />

            <span>photo_2026_3.png</span>

            <button>↓</button>
          </div>

          <div className="shared_item">
            <img src="/shared4.jpg" alt="" />

            <span>photo_2026_4.png</span>

            <button>↓</button>
          </div>

        </div>


        {/* SHARED FILES */}
        <div className="option_item">
          <span>Shared files</span>
          <span>⌃</span>
        </div>

      </div>


      {/* ACTION BUTTONS */}
      <div className="right_actions">

        <button className="block_btn">
          Block User
        </button>

        <button className="logout_btn">
          Logout
        </button>

      </div>

    </div>
  );
};

export default RiHome;