import React, { useState } from "react";
import "../css/signin.css";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const [signUpinput, setSignupInput] = useState({
    name: "",
    phone: "",
    email: "",
    pass: "",
  });

  const [signinInput, setSigninInput] = useState({
    email: "",
    pass: "",
  });
  const nav = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const ans = await fetch("http://localhost:3003/user/signup", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signUpinput),
      });

      const data = await ans.json();
      return toast.success(data.message);
      setSignupInput(() => ({
        name: "",
        phone: "",
        email: "",
        pass: "",
      }));
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const ans = await fetch("http://localhost:3003/user/signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinInput),
      });

      const data = await ans.json();

      if(data.success){
        toast.success(data.message);
      }else{
        toast.error(data.message);
      }
      
      localStorage.setItem("chatuser", JSON.stringify(data));
      console.log(data);

      setSigninInput(() => ({
        email: "",
        pass: "",
      }));
      
      if(data.success){
        nav("/home");
      }

    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <div className="signin_page">
      <Toaster />
      <form onSubmit={handleSignin} className="sn_container">
        <h2>Welcome Back</h2>
        <input
          type="email"
          placeholder="Email.."
          value={signinInput.email}
          onChange={(e) =>
            setSigninInput((pre) => ({ ...pre, email: e.target.value }))
          }
          required
        />
        <input
          type="password"
          placeholder="Password.."
          value={signinInput.pass}
          onChange={(e) =>
            setSigninInput((pre) => ({ ...pre, pass: e.target.value }))
          }
          required
        />
        <span>
          <Link to={"/forgotpass"}>Forgot password?</Link>
        </span>
        <button type="submit">Sign In</button>
      </form>

      <form onSubmit={handleSignUp} className="sn_container">
        <h2>Create an Account</h2>
        <input
          type="text"
          placeholder="Username.."
          value={signUpinput.name}
          onChange={(e) =>
            setSignupInput((pre) => ({ ...pre, name: e.target.value }))
          }
          required
        />
        <input
          type="email"
          placeholder="Email.."
          value={signUpinput.email}
          onChange={(e) =>
            setSignupInput((pre) => ({ ...pre, email: e.target.value }))
          }
          required
        />
        <input
          type="phone"
          placeholder="Phone.."
          value={signUpinput.phone}
          onChange={(e) =>
            setSignupInput((pre) => ({ ...pre, phone: e.target.value }))
          }
          required
        />
        <input
          type="password"
          placeholder="Password.."
          value={signUpinput.pass}
          onChange={(e) =>
            setSignupInput((pre) => ({ ...pre, pass: e.target.value }))
          }
          required
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
