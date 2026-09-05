import React from 'react'
import "./app.css"
import Signin from './app/Signin'
import { Route, Routes } from 'react-router-dom'
import Home from './app/Home'

const App = () => {
  return (
    <div className="main_page">
      <div className="main_container">
        <Routes>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App