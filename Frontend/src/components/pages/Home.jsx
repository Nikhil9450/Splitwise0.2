import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { logout } from '../../redux/auth/authSlice'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
const Home = () => {
  const dispatch = useDispatch();
  const {isAuthenticated,status,user,userRole} = useSelector((state)=>state.auth)
  

  if(status===null){
    return <div> loading...</div>
  }
  return (
    <div>
      Home Page
    </div>
  )
}

export default Home