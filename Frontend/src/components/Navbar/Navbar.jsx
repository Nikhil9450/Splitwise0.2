import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import { Link ,useLocation } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import { useEffect } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { motion } from "framer-motion";

const iconAnimation = {
  whileHover: { scale: 1.15 },
  whileTap: { scale: 0.9 },
  transition: { type: "spring", stiffness: 300 }
};
function DrawerAppBar() {

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/groups", icon: <GroupIcon /> },
    // { path: "/balances", icon: <AccountBalanceWalletIcon /> },
    { path: "/friends", icon: <PersonAddIcon /> },
    { path: "/admin/dashboard", icon: <DashboardIcon /> },
    { path: "/profile", icon: <PersonIcon /> },
    // { path: "/activity", icon: <NotificationsIcon /> }
  ];
  const {isAuthenticated,status,user,userRole} = useSelector((state)=>state.auth)

  useEffect(()=>{
   console.log("isAuthenticated,status---->",  isAuthenticated,status)
   console.log("user------>",user)
   console.log("userRole------->",userRole);
  },[isAuthenticated,status,user])
  useEffect(() => {
    console.log("AppBar mounted");
  }, []);

return (
<AppBar
  position="fixed"
  sx={{
    top: "auto",
    bottom: 16,
    left: 0,
    right: 0,
    margin: "0 auto",
    width: "calc(100% - 32px)",
    maxWidth: "420px",
    borderRadius: "2rem",
    bgcolor: "#25291C",
    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    zIndex: 1300,
    backdropFilter: "blur(10px)",
  }}
>
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        minHeight: "65px",
        px: 1,
      }}
    >
      {navItems.map((item) => (
        <motion.div key={item.path} style={{ position: "relative" }}>

          {/* Active pill */}
          {isActive(item.path) && (
            <motion.div
              layoutId="activeTab"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "#ffffff20",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}

          <motion.div {...iconAnimation}>
            <IconButton component={Link} to={item.path}>
              <Avatar
                sx={{
                  height: { xs: "2.6rem", sm: "3rem" },
                  width: { xs: "2.6rem", sm: "3rem" },
                  bgcolor: isActive(item.path) ? "#fff" : "#DFE0DC",
                  transform: isActive(item.path)
                    ? "scale(1.1)"
                    : "scale(1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 0 15px rgba(223,224,220,0.6)",
                  },
                }}
              >
                {React.cloneElement(item.icon, {
                  sx: { color: "#25291C" },
                })}
              </Avatar>
            </IconButton>
          </motion.div>

        </motion.div>
      ))}
    </Toolbar>
  </AppBar>
);
}
DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
