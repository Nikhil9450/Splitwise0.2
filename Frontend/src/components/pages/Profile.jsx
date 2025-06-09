import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { openModal,closeModal } from '../../redux/modal/modalSlice';
const Profile = () => {
    const {isAuthenticated,status,user,userRole} = useSelector((state)=>state.auth)
    const dispatch = useDispatch();
    const paperStyle = {
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',
                        bgcolor:'#f5f5f5',
                        height:'60vh'
                        }
  const handleClick = () => {
    dispatch(openModal({
      modalHeader: "Delete Item",
      modalBody: "Are you sure you want to delete this?",
      modalFooter: (
        <>
          <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
          <Button onClick={() => console.log("Delete")} color="error">Delete</Button>
        </>
      )
    }));
  };

  return (
    <div>
        <Box sx={{ flexGrow: 1,padding:'5rem 12rem' }}>
        <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={paperStyle} elevation={0} >
                   <AccountCircleIcon sx={{height:'10rem',width:'10rem',color:'lightgray'}}/>
                   <Button onClick={handleClick}>Open Modal</Button>
                </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Paper sx={paperStyle} elevation={0} >
                    <List sx={{ 
                        width: '100%', 
                        maxWidth: 360, 
                        bgcolor: 'background.paper',
                        height:'100%',display:'flex',
                        flexDirection:'column',
                        justifyContent:'space-between' 
                        }}>
                        <ListItem
                            secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <ModeEditIcon />
                            </IconButton>
                            }
                        >
                            <ListItemText primary="Your Name" secondary={user.name} />
                        </ListItem>
                        <ListItem
                             secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <ModeEditIcon />
                            </IconButton>
                            }
                        >                       

                            <ListItemText primary="Your Email" secondary={user.email} />
                        </ListItem>
                        <ListItem
                            secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                                <ModeEditIcon />
                            </IconButton>
                            }
                        >
                            <ListItemText primary="Password" secondary='**********' />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="User Type" secondary={user.role} />
                        </ListItem>
                        <ListItem>
                             <Button variant="outlined">Delete Your Account</Button>
                        </ListItem>
                    </List>                
                </Paper>
            </Grid>
            {/* <Grid size={{ xs: 6, md: 4 }}>
                <Paper sx={paperStyle} elevation={0} >
                
                </Paper>            
            </Grid>
            <Grid size={{ xs: 6, md: 8 }}>
                <Paper sx={paperStyle} elevation={0} >
                
                </Paper>            
            </Grid> */}
        </Grid>
        </Box>
    </div>
  )
}

export default Profile