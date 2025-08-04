import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { deleteFriendRequest,removeFriend,acceptFriendRequest } from '../../redux/friendList/friendlistSlice';
import {List,ListItem,ListItemText,IconButton,Grid,Box,Button,ListSubheader,Divider} from '@mui/material';
import SearchAccount from '../SearchAccount';
const FriendListContainer = (props) => {
        const [loading,setLoading]=useState(false);
        const {friends,sentRequests,recievedRequests} = useSelector((state)=>state.friendList)
        const dispatch= useDispatch();
  return (
    <Box sx={{height:'100%'}}>
        <Grid container spacing={2} sx={{height:'100%'}} direction="column">
            <Grid>
                <SearchAccount />
            </Grid>
            <Grid container spacing={2} size="grow" sx={{height:'100%'}} >
                <Grid size={{ xs: 12, md: 4 }}  sx={{border:'1px solid #82bdf7'}}>
                    <Box>
                        <List
                            sx={{ width: '100%', bgcolor: 'background.paper' }}
                            subheader={<ListSubheader sx={{bgcolor:'#dcedff',color:'#1976d2'}}>
                                            Friends         
                                        </ListSubheader>}
                        >
                            <Divider sx={{ borderColor: '#82bdf7' }} />

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
                        </List>                                               
                    </Box>
                </Grid>
                {/* <Grid size={{ xs: 12, md: 4 }} sx={{border:'1px solid #82bdf7'}} >
                    <Box>
                            <List
                                sx={{ width: '100%', bgcolor: 'background.paper' }}
                                subheader={<ListSubheader sx={{bgcolor:'#dcedff',color:'#1976d2'}}>Friend Request Sent</ListSubheader>}
                            >
                            <Divider sx={{ borderColor: '#82bdf7' }} />

                                {sentRequests.map((user)=>{
                                    return  <ListItem
                                            key={user.id}
                                            secondaryAction={
                                            <Box>
                                                <Button sx={{fontSize:'10px'}} color="error" variant="outlined" edge="end" aria-label="Cancel" onClick={() => dispatch(deleteFriendRequest(user._id))}>
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
                            </List>
                    </Box>        
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{border:'1px solid #82bdf7'}}>
                    <Box>
                        <List
                            sx={{ width: '100%', bgcolor: 'background.paper' }}
                            subheader={<ListSubheader sx={{bgcolor:'#dcedff',color:'#1976d2'}}>Friend Request Recieved</ListSubheader>}
                            >
                            <Divider sx={{ borderColor: '#82bdf7' }} />
                           
                                {recievedRequests.map((user)=>{
                                    return  <ListItem
                                        key={user.id}
                                        secondaryAction={
                                        <Box>
                                            <>
                                            <Button sx={{fontSize:'10px',marginRight:'5px'}} variant="outlined" edge="end" aria-label="Accept" onClick={() => dispatch(acceptFriendRequest(user._id))}>
                                                Accept
                                            </Button>
                                            <Button sx={{fontSize:'10px'}} color="error" variant="outlined" edge="end" aria-label="Delete" onClick={() => dispatch(deleteFriendRequest(user._id))}>
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
                                
                            </List>                    
                    </Box>
                </Grid> */}
            </Grid>
        </Grid>
    </Box>
  )
}

export default FriendListContainer