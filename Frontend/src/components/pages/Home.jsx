import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import {useNavigate } from 'react-router-dom'



const Home = () => {
  const [isLoggedIn,setIsLoggedIn]= useState(null)
  const navigate = useNavigate();

  useEffect(()=>{
    isLoggedIn ? navigate('/'):navigate('/signin')
  },[isLoggedIn])


  const handleLogout =()=>{
    axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
      .then((data) => {
        setIsLoggedIn(data.loggedIn)
        // optionally redirect or update state
        console.log('Logged out');
      }).catch((error)=>{
        console.log('Error in logout');
      });
  }

  return (
    <div>
      Home Page
      <button  onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home