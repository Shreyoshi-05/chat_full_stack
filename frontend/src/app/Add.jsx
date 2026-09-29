import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import "../css/add.css";
import { Get, post } from "../assets/Get";
import toast, { Toaster } from 'react-hot-toast';

const Add = ({userId,setAdd}) => {
  const [ids, setIds] = useState([]);
  const [gname, setGname] = useState("");
  const [users, setUsers] = useState([]);

  async function getAllUser() {
    const ans = await Get(`${import.meta.env.VITE_BACKEND_URL}/user/addGroup`);
    // console.log(ans);
    setUsers(Array.isArray(ans) ? ans : []);
  }
  // console.log(users);

  useEffect(() => {
    getAllUser();
  }, []);

  function handleId(id) {
    setIds((current) => {
      return current.includes(id)
        ? current.filter((pre) => pre != id)
        : [...current, id];
    });
  }
  // console.log(ids);

  async function handleCreate() {
    if (!gname || ids.length === 0) {
      alert("Enter a group name and select at least one member.");
      return;
    }

    const ans = await post(`${import.meta.env.VITE_BACKEND_URL}/user/groups`,{
      ids,
      name:gname,
      userId
    });
    console.log(ans);
    if(ans.success){
      toast.success(ans.message)
    }else{
      toast.error(ans.message)
    }
    setAdd(false);
  }

  return (
    <div className="add container">
      <Toaster />
      <div className="add_content">
        <div className="inp_sec">
          <h3>Group Name:</h3>
          <input
            type="text"
            name=""
            id=""
            value={gname}
            onChange={(e) => setGname(e.target.value)}
          />
        </div>

        {/* <div className="inp_sec">
          <h3>Search by name:</h3>
          <input type="text" name="" id="" />
        </div> */}

        <div className="contacts">
          {users.map((item) => {
            return (
              <div className="individual_row" onClick={() => handleId(item.id)}>
                <div className="left_part">
                  <div className="profile">
                    <img
                      src={
                        item.profileImage ||
                        "https://i.pinimg.com/736x/de/bc/90/debc9002b84b67108c9db5de66d59036.jpg"
                      }
                      alt=""
                    />
                  </div>
                  <div className="details">
                    <h3>{item.name}</h3>
                    <p>{item.description || "no description yet"}</p>
                  </div>
                </div>

                {ids.includes(item.id) && (
                  <div className="right_part">
                    <IoCheckmarkDoneSharp />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="btn btn-info" onClick={handleCreate}>Create Group</button>
      </div>
    </div>
  );
};

export default Add;
