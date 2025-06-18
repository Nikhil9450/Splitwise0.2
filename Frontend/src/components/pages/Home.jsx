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
  return (
<Box sx={{ height: '80vh', margin: '1rem 2rem', border: '1px solid #82bdf7' }}>
  <Grid container spacing={2} direction="column" sx={{ height: '100%' }}>
    
    <Grid xs={12} item md={12}>
      <Box sx={{ bgcolor: '#dcedff' }}>
        <ButtonGroup
          size="small"
          aria-label="small button group"
          sx={{ width: '100%', padding: '.6rem' }}
        >
          <Button
            variant={buttonType === 'groups' ? 'contained' : 'outlined'}
            onClick={() => handlePageChange('groups')}
          >
            Groups
          </Button>
          <Button
            variant={buttonType === 'expenses' ? 'contained' : 'outlined'}
            onClick={() => handlePageChange('expenses')}
          >
            Expenses
          </Button>
          <Button
            variant={buttonType === 'friends' ? 'contained' : 'outlined'}
            onClick={() => handlePageChange('friends')}
          >
            Friends
          </Button>
          <Button
            variant={buttonType === 'balances' ? 'contained' : 'outlined'}
            onClick={() => handlePageChange('balances')}
          >
            Balances
          </Button>
        </ButtonGroup>
        <Divider sx={{ borderColor: '#82bdf7' }} />
      </Box>
    </Grid>

    <Grid item xs={12} md={12}>
      <SearchAccount />
    </Grid>

    <Grid item xs={12} md={12} sx={{ flexGrow: 1, overflowY: 'auto' }}>
      <FriendListContainer />
    </Grid>

  </Grid>
</Box>

  )
}

export default Home