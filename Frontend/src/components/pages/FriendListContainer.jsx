import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { deleteFriendRequest,removeFriend,acceptFriendRequest } from '../../redux/friendList/friendlistSlice';
import {List,ListItem,ListItemText,IconButton,Grid,Box,Button,ListSubheader,Divider,Typography} from '@mui/material';
import SearchAccount from '../SearchAccount';
const FriendListContainer = (props) => {
        const [loading,setLoading]=useState(false);
        const {friends,sentRequests,recievedRequests} = useSelector((state)=>state.friendList)
        const dispatch= useDispatch();
        const [activeTab, setActiveTab] = useState("friends");
  return (
<Box
  sx={{
    height: "100%",
    bgcolor: "#FCFAF9",
    p: 2,
    fontFamily: "Montserrat, sans-serif",
  }}
>
  {/* SEARCH */}
  {/* <Box
    sx={{
      mb: 2,
      border: "1px solid #DFE0DC",
      borderRadius: "2rem",
      bgcolor: "#FFFFFF",
      px: 2,
      py: 1.2,
    }}
  > */}
    <SearchAccount />
  {/* </Box> */}

    <Box
    sx={{

        bgcolor: "#FCFAF9",
        fontFamily: "Montserrat, sans-serif",
    }}
    >

    {/* TABS */}
    <Box
        sx={{
        display: "flex",
        gap: 1,
        mb: 2,
        p: 0.5,
        border: "1px solid #DFE0DC",
        borderRadius: "2rem",
        bgcolor: "#FFFFFF",
        }}
    >
        {[
        { key: "friends", label: "Friends" },
        { key: "received", label: "Received" },
        { key: "sent", label: "Sent" },
        ].map((tab) => {
        const isActive = activeTab === tab.key;

        return (
            <Box
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            sx={{
                flex: 1,
                textAlign: "center",
                py: 1,
                borderRadius: "2rem",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                bgcolor: isActive ? "#129490" : "transparent",
                color: isActive ? "#FFFFFF" : "#25291C",
            }}
            >
            {tab.label}
            </Box>
        );
        })}
    </Box>

    {/* CONTENT */}
    <Box
        sx={{
        border: "1px solid #DFE0DC",
        borderRadius: "2rem",
        bgcolor: "#FFFFFF",
        p: 1,
        }}
    >

        {/* FRIENDS */}
        {activeTab === "friends" &&
        friends.map((user) => (
            <Box
            key={user._id}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.5,
                mb: 1,
                border: "1px solid #DFE0DC",
                borderRadius: "2rem",
            }}
            >
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                <Box
                sx={{
                    height: 40,
                    width: 40,
                    borderRadius: "50%",
                    bgcolor: "#DFE0DC",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 600,
                    color: "#25291C",
                }}
                >
                {user.name?.charAt(0)}
                </Box>

                <Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {user.name}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#9e9e9e" }}>
                    {user.email}
                </Typography>
                </Box>
            </Box>

            <Button
                variant="outlined"
                sx={{
                borderColor: "#ED474A",
                color: "#ED474A",
                borderRadius: "2rem",
                textTransform: "none",
                fontSize: "0.75rem",
                }}
                onClick={() => dispatch(removeFriend(user._id))}
            >
                Remove
            </Button>
            </Box>
        ))}

        {/* RECEIVED */}
        {activeTab === "received" &&
        recievedRequests.map((user) => (
            <Box
            key={user._id}
            sx={{
                p: 1.5,
                mb: 1,
                border: "1px solid #DFE0DC",
                borderRadius: "2rem",
            }}
            >
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {user.name}
            </Typography>

            <Typography sx={{ fontSize: "0.75rem", color: "#9e9e9e", mb: 1 }}>
                {user.email}
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                fullWidth
                variant="contained"
                sx={{
                    bgcolor: "#129490",
                    borderRadius: "2rem",
                    textTransform: "none",
                    fontSize: "0.75rem",
                    "&:hover": { bgcolor: "#0f7f7c" },
                }}
                onClick={() => dispatch(acceptFriendRequest(user._id))}
                >
                Accept
                </Button>

                <Button
                fullWidth
                variant="outlined"
                sx={{
                    borderColor: "#ED474A",
                    color: "#ED474A",
                    borderRadius: "2rem",
                    textTransform: "none",
                    fontSize: "0.75rem",
                }}
                onClick={() => dispatch(deleteFriendRequest(user._id))}
                >
                Delete
                </Button>
            </Box>
            </Box>
        ))}

        {/* SENT */}
        {activeTab === "sent" &&
        sentRequests.map((user) => (
            <Box
            key={user._id}
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.5,
                mb: 1,
                border: "1px solid #DFE0DC",
                borderRadius: "2rem",
            }}
            >
            <Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {user.name}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#9e9e9e" }}>
                {user.email}
                </Typography>
            </Box>

            <Button
                variant="outlined"
                sx={{
                borderColor: "#ED474A",
                color: "#ED474A",
                borderRadius: "2rem",
                textTransform: "none",
                fontSize: "0.75rem",
                }}
                onClick={() => dispatch(deleteFriendRequest(user._id))}
            >
                Cancel
            </Button>
            </Box>
        ))}

        {/* EMPTY STATE */}
        {((activeTab === "friends" && friends.length === 0) ||
        (activeTab === "received" && recievedRequests.length === 0) ||
        (activeTab === "sent" && sentRequests.length === 0)) && (
        <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography sx={{ fontSize: "0.85rem", color: "#9e9e9e" }}>
            Nothing here yet
            </Typography>
        </Box>
        )}
    </Box>
    </Box>

</Box>
  )
}

export default FriendListContainer