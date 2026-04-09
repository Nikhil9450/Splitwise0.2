import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {Box,Typography} from '@mui/material';
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
import TextField from '@mui/material/TextField';
import Loader from '../Loader';
const Profile = () => {
    const {isAuthenticated,status,user,userRole} = useSelector((state)=>state.auth)
    const dispatch = useDispatch();
    const paperStyle = {
                        display:'flex',
                        flexDirection:'column',
                        justifyContent:'center',
                        alignItems:'center',
                        height:'60vh'
                        }                    

  const editProfileDetails = (modalType) => {
    dispatch(openModal({
    modalType,
    modalProps: {
        title:'Edit Profile',
        name:user.name,
        email:user.email,
    }
    }));
  };

  return (
<Box
  sx={{
    minHeight: "100vh",
    bgcolor: "#DFE0DC",
    fontFamily: "Montserrat, sans-serif",
    display: "flex",
    justifyContent: "center",
  }}
>
  <Box
    sx={{
      width: "100%",
      maxWidth: "800px",
    }}
  >
    {/* PROFILE HEADER */}
    <Box
      sx={{
        bgcolor: "#25291C",
        color: "#DFE0DC",
        p: { xs: 3, md: 4 },
        textAlign: "center",
        mb: 3,
      }}
    >
      <Box
        sx={{
          height: 100,
          width: 100,
          borderRadius: "50%",
          bgcolor: "#DFE0DC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
          mb: 2,
        }}
      >
        <AccountCircleIcon sx={{ fontSize: 70, color: "#25291C" }} />
      </Box>

      <Typography
        sx={{
          fontSize: "1.2rem",
          fontWeight: 600,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {user.name}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.85rem",
          opacity: 0.8,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {user.email}
      </Typography>
    </Box>

    {/* DETAILS CARD */}
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "2rem",
        border: "1px solid #DFE0DC",
        overflow: "hidden",
        mx: { xs: 2, sm: 4, md: 6 },
        my: { xs: 3, md: 5 },
      }}
    >
      {[
        { label: "Name", value: user.name },
        { label: "Email", value: user.email },
        { label: "Password", value: "**********" },
        { label: "User Type", value: user.role },
      ].map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
            borderBottom:
              index !== 3 ? "1px solid #DFE0DC" : "none",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#9e9e9e",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {item.label}
          </Typography>

          <Typography
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#25291C",
              fontFamily: "Montserrat, sans-serif",
              mt: { xs: 0.5, sm: 0 },
            }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>

    {/* ACTIONS */}
    <Box
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
      }}
    >
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: "#129490",
          textTransform: "none",
          fontWeight: 600,
          fontFamily: "Montserrat, sans-serif",
          borderRadius: 2,
          py: 1.2,
          "&:hover": { bgcolor: "#0f7f7c" },
        }}
        onClick={() => editProfileDetails("EDIT_PROFILE")}
      >
        Edit Profile
      </Button>

      <Button
        fullWidth
        variant="outlined"
        sx={{
          borderColor: "#ED474A",
          color: "#ED474A",
          textTransform: "none",
          fontWeight: 600,
          fontFamily: "Montserrat, sans-serif",
          borderRadius: 2,
          py: 1.2,
          "&:hover": {
            borderColor: "#c93a3d",
            backgroundColor: "rgba(237,71,74,0.05)",
          },
        }}
      >
        Delete Account
      </Button>
    </Box>
  </Box>
</Box>
  )
}

export default Profile