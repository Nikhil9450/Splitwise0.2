import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/material';
import axios from 'axios';
import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import Divider from '@mui/material/Divider';
// import Typography from '@mui/material/Typography';
// import Tooltip from '@mui/material/Tooltip';
// import PersonAdd from '@mui/icons-material/PersonAdd';
// import Settings from '@mui/icons-material/Settings';
// import Logout from '@mui/icons-material/Logout';
// import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { deleteFriendRequest,removeFriend,acceptFriendRequest,sendFriendRequest } from '../redux/friendList/friendlistSlice';
import {CircularProgress} from '@mui/material';
const SearchAccount = () => {
    const [emailToSearch,setEmailToSearch] =useState(null)
    const [anchorEl, setAnchorEl] = useState(null);
    const [User,setUser]= useState(null);
    const [loading,setLoading]=useState(false)
    const dispatch = useDispatch()
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const searchUser =async(event)=>{
        const anchor = event.currentTarget; 
        console.log("emailToSearch----------->",emailToSearch);
        setLoading(true);
        try{
            const user= await axios.get('http://localhost:5000/findUser',{
                params:{email:emailToSearch},
                withCredentials:true
            })
            setLoading(false);
            setUser(user.data);
            setAnchorEl(anchor);

            console.log("searched user---------->", user.data); 
        }catch(error){
            setLoading(false);
            setUser(null);
            console.log("error in finding user--->",error)
        }
    }
    useEffect(()=>{
        console.log("User----------->",User)
    },[User])

  return (
    <div>

        <Box sx={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'end',margin:'1rem'}} >
            <Box sx={{padding:'0.3rem 0.3rem 0.3rem 1rem;',border:'1px solid #1976d2',borderRadius:'2rem',width:'20rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <input type='email' placeholder='Find user by email'  style={{border:'none',background:'none',outline: 'none',fontSize:'1rem',color:'#1976d2', width:'100%'}} onChange={(event)=>setEmailToSearch(event.target.value)}/>
                <IconButton
                    onClick={searchUser}
                    size="small"
                    sx={{bgcolor:'#1976d2' ,'&:hover': {bgcolor: '#115293'}}}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                   {loading
                   ?<CircularProgress size={24}  sx={{color:'white'}} />
                   :<SearchIcon size={24}  sx={{color:'white'}}/>
                   }
                   {/* <CircularProgress size={24}  sx={{color:'white'}} /> */}
                </IconButton>
            </Box>
        </Box>
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
            paper: {
                elevation: 0,
                sx: {
                width:'20rem',
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                },
                '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                },
                },
            },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {
            User ? (
            <ListItem
                secondaryAction={
                <Box>
                    {
                    User.requestStatus === "incoming" && (
                        <>
                        <Button sx={{fontSize:'10px',marginRight:'5px'}} variant="outlined" edge="end" aria-label="Accept" onClick={() => dispatch(acceptFriendRequest(User.id))}>
                            {/* <PersonAddIcon /> */}
                            Accept
                        </Button>
                        <Button sx={{fontSize:'10px'}} color="error" variant="outlined" edge="end" aria-label="Delete" onClick={() => dispatch(deleteFriendRequest(User.id))}>
                            {/* <DeleteIcon /> */}
                            Delete
                        </Button>
                        </>
                    )
                    }

                    {
                        User.requestStatus === "outgoing" && (
                        <Button sx={{fontSize:'10px'}} color="error" variant="outlined" edge="end" aria-label="Cancel" onClick={() => dispatch( deleteFriendRequest(User.id))}>
                        {/* <DeleteIcon /> */}
                            Cancel Request
                        </Button>
                    )
                    }

                    {
                        User.requestStatus === "alreadyFriends" && (
                            <Button sx={{fontSize:'10px'}} color="error" variant="outlined" edge="end" aria-label="remove friend" onClick={() =>dispatch( removeFriend(User.id))}>
                            {/* <DeleteIcon /> */}
                            Remove Friend
                            </Button>
                        )
                    }

                    {
                        User.requestStatus === "none" && (
                            <Button sx={{fontSize:'10px'}} variant="outlined" edge="end" aria-label="Send" onClick={() => dispatch(sendFriendRequest(User.id))}>
                            {/* <PersonAddIcon /> */}
                            Add Friend
                            </Button>
                        )
                    }
                </Box>
                }
            >
                <ListItemText   
                primaryTypographyProps={{ fontSize: '13px' }}
                secondaryTypographyProps={{ fontSize: '12px', color: 'text.secondary' }} 
                primary={User.name} 
                secondary={User.email} />
            </ListItem>
            ) : (
            <ListItem>
                <ListItemText primary="User not found." />
            </ListItem>
            )
        }
        </List>
      </Menu>
    </div>
  )
}

export default SearchAccount