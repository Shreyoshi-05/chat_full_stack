import React, { useState } from "react";
import "../css/signin.css";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../assets/Get";

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
    const ans = await post("http://localhost:3003/user/signup", signUpinput);
      return toast.success(ans.message);
      setSignupInput(() => ({
        name: "",
        phone: "",
        email: "",
        pass: "",
      }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const ans = await post("http://localhost:3003/user/signin", signinInput);

    if (ans.success) {
      toast.success(ans.message);
    } else {
      toast.error(ans.message);
    }

    localStorage.setItem("chatuser", JSON.stringify(ans));
    console.log(ans);

    setSigninInput(() => ({
      email: "",
      pass: "",
    }));

    if (ans.success) {
      nav("/home");
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
