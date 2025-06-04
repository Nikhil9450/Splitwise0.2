import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
// import {useNavigate } from 'react-router-dom'
import { logout } from '../../redux/auth/authSlice'
import { useSelector,useDispatch } from 'react-redux'

const Home = () => {
  const dispatch = useDispatch();
  const {isAuthenticated,status} = useSelector((state)=>state.auth)
  // const navigate = useNavigate();



  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      window.location.reload(); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if(status===null){
    return <div> loading...</div>
  }
  return (
    <div>
      Home Page
      <button  onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home