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
import {CircularProgress,Typography} from '@mui/material';
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
<>
  {/* SEARCH BAR */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      mb:2,
      fontFamily: "Montserrat, sans-serif",
    }}
  >
    <Box
      sx={{
        width: "100%",
        maxWidth: "24rem",
        display: "flex",
        alignItems: "center",
        border: "1px solid #DFE0DC",
        borderRadius: "2rem",
        bgcolor: "#FFFFFF",
        px: 1,
        py: 1,
        border: '2px solid #25291C',
      }}
    >
      <input
        type="email"
        placeholder="Find user by email"
        style={{
          border: "none",
          outline: "none",
          background: "none",
          flex: 1,
          fontSize: "0.9rem",
          fontFamily: "Montserrat, sans-serif",
          color: "#25291C",
        }}
        onChange={(e) => setEmailToSearch(e.target.value)}
      />

      <IconButton
        onClick={searchUser}
        sx={{
          bgcolor: "#129490",
          borderRadius: "50%",
          width: 36,
          height: 36,
          "&:hover": { bgcolor: "#0f7f7c" },
        }}
      >
        {loading ? (
          <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
        ) : (
          <SearchIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
        )}
      </IconButton>
    </Box>
  </Box>

  {/* RESULT PANEL */}
  <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose}
    PaperProps={{
      elevation: 0,
      sx: {
        width: "24rem",
        mt: 1,
        borderRadius: "2rem",
        border: "1px solid #DFE0DC",
        bgcolor: "#FFFFFF",
        p: 1,
        fontFamily: "Montserrat, sans-serif",
      },
    }}
    transformOrigin={{ horizontal: "center", vertical: "top" }}
    anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
  >
    {User ? (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
        }}
      >
        {/* USER INFO */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              height: 40,
              width: 40,
              borderRadius: "50%",
              bgcolor: "#DFE0DC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              color: "#25291C",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {User.name?.charAt(0).toUpperCase()}
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "#25291C",
              }}
            >
              {User.name}
            </Typography>

            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "#9e9e9e",
              }}
            >
              {User.email}
            </Typography>
          </Box>
        </Box>

        {/* ACTION BUTTON */}
        <Box>
          {User.requestStatus === "incoming" && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                sx={{
                  bgcolor: "#129490",
                  borderRadius: "2rem",
                  textTransform: "none",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#0f7f7c" },
                }}
                onClick={() => dispatch(acceptFriendRequest(User.id))}
              >
                Accept
              </Button>

              <Button
                size="small"
                variant="outlined"
                sx={{
                  borderColor: "#ED474A",
                  color: "#ED474A",
                  borderRadius: "2rem",
                  textTransform: "none",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
                onClick={() => dispatch(deleteFriendRequest(User.id))}
              >
                Delete
              </Button>
            </Box>
          )}

          {User.requestStatus === "outgoing" && (
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderColor: "#ED474A",
                color: "#ED474A",
                borderRadius: "2rem",
                textTransform: "none",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
              onClick={() => dispatch(deleteFriendRequest(User.id))}
            >
              Cancel
            </Button>
          )}

          {User.requestStatus === "alreadyFriends" && (
            <Button
              size="small"
              variant="outlined"
              sx={{
                borderColor: "#ED474A",
                color: "#ED474A",
                borderRadius: "2rem",
                textTransform: "none",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
              onClick={() => dispatch(removeFriend(User.id))}
            >
              Remove
            </Button>
          )}

          {User.requestStatus === "none" && (
            <Button
              size="small"
              variant="contained"
              sx={{
                bgcolor: "#129490",
                borderRadius: "2rem",
                textTransform: "none",
                fontSize: "0.7rem",
                fontWeight: 600,
                "&:hover": { bgcolor: "#0f7f7c" },
              }}
              onClick={() => dispatch(sendFriendRequest(User.id))}
            >
              Add
            </Button>
          )}
        </Box>
      </Box>
    ) : (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography sx={{ fontSize: "0.85rem", color: "#9e9e9e" }}>
          User not found
        </Typography>
      </Box>
    )}
  </Menu>
</>
  )
}

export default SearchAccount