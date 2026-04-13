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
import FriendListContainer from './FriendListContainer';
import Grid from '@mui/material/Grid';
import Groups from './groups'
// import { motion } from "motion/react";
import * as motion from "motion/react-client"
const Home = () => {
  return (
      <Box sx={{ height: '80vh', margin: '1rem 2rem', border: '1px solid #82bdf7' }}>
        <Grid container spacing={2} direction="column" sx={{ height: '100%',flexWrap:'nowrap',display:{xs:'none',sm:'block'} }}>
          <Grid >
            <Box sx={{ bgcolor: '#dcedff' }}>
              <Divider sx={{ borderColor: '#82bdf7' }} />
            </Box>
          </Grid>
          <Grid size="grow" sx={{height:'80%',margin:'1rem'}}>
                <Groups />
          </Grid>
        </Grid>  
      </Box>

  )
}

export default Home