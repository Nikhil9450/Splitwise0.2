import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { logout } from '../../redux/auth/authSlice'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import SearchAccount from '../SearchAccount'
import Loader from '../Loader'
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import FriendListContainer from '../FriendListContainer';
import Grid from '@mui/material/Grid';

const Home = () => {
  // const dispatch = useDispatch();
  // const {isAuthenticated,status,user,userRole} = useSelector((state)=>state.auth)
  const [buttonType,setButtonType]=useState("groups")
  const {friends,sentRequests,recievedRequests} = useSelector((state)=>state.friendList)

  // if(status===null){
  //   return <div> loading...</div>
  // }
  const handlePageChange= async (pageName)=>{
           setButtonType(pageName);
           switch (pageName){
            case 'friends':
              console.log(friends,sentRequests,recievedRequests)
            break;
            default:  
              console.log("inside the default")
           }
  }
  const paperStyle={
    height:'100%',
    width:'100%',
    // padding:'1rem',
    backgroundColor:'#f5f5f5'
    // overflowY:'scroll'
  }
  return (
    <div>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <Box sx={{display:'flex',justifyContent:'space-evenly',margin:'1rem 2rem', height:'80vh',alignItems:'center'}}>
              <Paper elevation='0' sx={paperStyle}>
              <Box sx={{bgcolor:'#dcedff'}}>
                <ButtonGroup size="large"   aria-label="Large button group" sx={{width:'100%',margin:'.6rem'}}>
                    <Button  variant={(buttonType==='groups')?"contained":"outlined"} key="groups" onClick={()=>handlePageChange("groups")}>Groups</Button>,
                    <Button  variant={(buttonType==='expenses')?"contained":"outlined"} key="expenses" onClick={()=>handlePageChange("expenses")}>Expenses</Button>,
                    <Button  variant={(buttonType==='friends')?"contained":"outlined"} key="friends" onClick={()=>handlePageChange("friends")}>Friends</Button>,
                    <Button  variant={(buttonType==='balances')?"contained":"outlined"} key="balances" onClick={()=>handlePageChange("balances")}>Balances</Button>,
                </ButtonGroup>
              </Box>
                {/* <Divider /> */}
                <SearchAccount/>
                <FriendListContainer/>
              </Paper>
            </Box>
          </Grid>
        </Grid>
    </div>
  )
}

export default Home