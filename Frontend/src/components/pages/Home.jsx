import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { logout } from '../../redux/auth/authSlice'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import Loader from '../Loader'
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
const Home = () => {
  // const dispatch = useDispatch();
  // const {isAuthenticated,status,user,userRole} = useSelector((state)=>state.auth)
  

  // if(status===null){
  //   return <div> loading...</div>
  // }
  const paperStyle={
    height:'100%',
    width:'80%',
    // overflowY:'scroll'
  }
  return (
    <div>
      <Box sx={{display:'flex',justifyContent:'space-evenly',margin:'1rem 2rem', height:'80vh',alignItems:'center'}}>
        <Paper sx={paperStyle}>
          <ButtonGroup size="large"  aria-label="Large button group" sx={{width:'100%'}}>
              <Button fullWidth key="one">One</Button>,
              <Button fullWidth key="two">Two</Button>,
              <Button fullWidth key="three">Three</Button>,
          </ButtonGroup>
        </Paper>
      </Box>
    </div>
  )
}

export default Home