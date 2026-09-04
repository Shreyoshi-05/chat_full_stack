import React from 'react'
import "../css/signin.css"

const Signin = () => {
  return (
    <div className="signin_page">
      <div className="sn_container">
        <h2>Welcome Back</h2>
        <input type="email" placeholder='Email..' required/>
        <input type="password" placeholder='Password..' required/>
        <button>Sign In</button>
      </div>

      <div className="sn_container">
        <h2>Create an Account</h2>
        <input type="text" placeholder='Username..' required/>
        <input type="email" placeholder='Email..' required/>
        <input type="password" placeholder='Password..' required/>
        <button>Sign In</button>
      </div>
    </div>
  )
}

export default Signin