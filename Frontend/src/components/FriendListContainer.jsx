import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { deleteFriendRequest,removeFriend,acceptFriendRequest } from '../redux/friendList/friendlistSlice';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
const FriendListContainer = (props) => {
        const [loading,setLoading]=useState(false);
        const {friends,sentRequests,recievedRequests} = useSelector((state)=>state.friendList)
        const dispatch= useDispatch();
  return (
    <Grid container spacing={2} sx={{margin:'0rem 1rem',height:'95%'}}>
        <Grid size={{ xs: 12, md: 4 }}  sx={{border:'1px solid #82bdf7'}}>
            <Box>
                {friends.map((user)=>{
                    return  <ListItem
                            key={user.id}
                            secondaryAction={
                            <Box>                        
                                <Button sx={{fontSize:'10px'}} color="error" variant="outlined" edge="end" aria-label="remove friend" onClick={() => dispatch(removeFriend(user._id))}>
                                {/* <DeleteIcon /> */}
                                Remove Friend
                                </Button>
                            </Box>
                            }
                        >
                            <ListItemText   
                            primaryTypographyProps={{ fontSize: '13px' }}
                            secondaryTypographyProps={{ fontSize: '12px', color: 'text.secondary' }} 
                            primary={user.name} 
                            secondary={user.email} />
                        </ListItem>
                })}
            </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{border:'1px solid #82bdf7'}} >
            <Box>
                {sentRequests.map((user)=>{
                    return  <ListItem
                            key={user.id}
                            secondaryAction={
                            <Box>
                                <Button sx={{fontSize:'10px'}} color="error" variant="outlined" edge="end" aria-label="Cancel" onClick={() => dispatch(deleteFriendRequest(user._id))}>
                                {/* <DeleteIcon /> */}
                                    Cancel Request
                                </Button>
                            </Box>
                            }
                        >
                            <ListItemText   
                            primaryTypographyProps={{ fontSize: '13px' }}
                            secondaryTypographyProps={{ fontSize: '12px', color: 'text.secondary' }} 
                            primary={user.name} 
                            secondary={user.email} />
                        </ListItem>
                })}
            </Box>        
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{border:'1px solid #82bdf7'}}>
            <Box>
                {recievedRequests.map((user)=>{
                    return  <ListItem
                        key={user.id}
                        secondaryAction={
                        <Box>
                            <>
                            <Button sx={{fontSize:'10px',marginRight:'5px'}} variant="outlined" edge="end" aria-label="Accept" onClick={() => dispatch(acceptFriendRequest(user._id))}>
                                {/* <PersonAddIcon /> */}
                                Accept
                            </Button>
                            <Button sx={{fontSize:'10px'}} color="error" variant="outlined" edge="end" aria-label="Delete" onClick={() => dispatch(deleteFriendRequest(user._id))}>
                                {/* <DeleteIcon /> */}
                                Delete
                            </Button>
                            </>
                        </Box>
                        }
                    >
                        <ListItemText   
                        primaryTypographyProps={{ fontSize: '13px' }}
                        secondaryTypographyProps={{ fontSize: '12px', color: 'text.secondary' }} 
                        primary={user.name} 
                        secondary={user.email} />
                    </ListItem>
                })}
            </Box>
        </Grid>
    </Grid>
  )
}

export default FriendListContainer