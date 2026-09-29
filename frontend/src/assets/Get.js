import React from 'react'

export const Get = async(url) => {
  try {
      const ans = await fetch(url);
      const data = await ans.json();
      // console.log(data.data);
      // setAllUsers(data.data);
      return data?.data;
    } catch (error) {
      // console.log(error.message);
      return error.message;
    }
}

export const post = async(url,data) => {
    const ans = await fetch(url, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const fans = await ans.json();
      return fans;
}

// export default {Get,post}