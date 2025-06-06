import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { logout } from '../../redux/auth/authSlice'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
const Home = () => {
  const dispatch = useDispatch();
  const {isAuthenticated,status,user,userRole} = useSelector((state)=>state.auth)
  useEffect(()=>{
   console.log("isAuthenticated,status---->",  isAuthenticated,status)
   console.log("user------>",user)
   console.log("userRole------->",userRole);
  },[isAuthenticated,status,user])
  
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
      {/* {user?.role === 'admin' && ( */}
      <Link to="/admin/dashboard" >Admin Dashboard</Link>
      {/* )}   */}
      {/* <AdminDashboard/>   */}
    </div>
  )
}

export default Home