import React from 'react'
import "./app.css"
import Signin from './app/Signin'
import { Route, Routes } from 'react-router-dom'
import Home from './app/Home'
import ForgotPass from './app/ForgotPass'

const App = () => {
  return (
    <div className="main_page">
      <div className="main_container">
        <Routes>
          <Route path="/" element={<Signin />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/forgotpass" element={<ForgotPass />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App;