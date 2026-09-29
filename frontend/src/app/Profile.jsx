import React, { useState } from 'react'
import "../css/profile.css"
import { IoMdClose } from "react-icons/io";


const Profile = ({setProfile}) => {
  const [image, setImage] = useState("");
  const [name , setName] = useState("");
  console.log(name);


  return (
    <div className="profile_page">
      <div className="profile_card">
        <div className="profile_heading">
          <h3>Edit Profile</h3>
          <IoMdClose size={21} onClick={()=>setProfile(false)}/>
        </div>
        <p className="profile_subtitle">
          Update your photo and display name
        </p>

        <form className="profile_form">
          <div className="profile_photo_section">
            <img
              className="profile_photo"
              // src={userDeatils?.profileImage || "/default-avatar.png"}
              alt="Your profile"
            />

            <label className="profile_upload">
              Change photo
              <input type="file" accept="image/*" />
            </label>
          </div>

          <label className="profile_field">
            <span>Your name</span>
            <input
              type="text"
              name="name"
              // defaultValue={userDeatils?.name || ""}
              placeholder="Enter your name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </label>

          <button type="submit" className="profile_save">
            Save changes
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile