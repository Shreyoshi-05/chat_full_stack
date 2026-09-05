import React from 'react'
import LfHome from './LfHome'
import MidHome from './MidHome'
import RiHome from './RiHome'
import "../css/home.css"

const Home = () => {
  return (
    <div className="home_container">
      <LfHome />
      <MidHome />
      <RiHome />
    </div>
  )
}

export default Home