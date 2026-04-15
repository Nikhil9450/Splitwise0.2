import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link ,useLocation } from 'react-router-dom';
import { Menu,MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { logout } from '../../redux/auth/authSlice';
import Paper from '@mui/material/Paper';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import { useEffect } from 'react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { closeModal ,openModal} from '../../redux/modal/modalSlice';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Stack from '@mui/material/Stack';
import { motion } from "framer-motion";
const drawerWidth = 240;

const MotionBox = motion(Box);
const MotionAppBar = motion(AppBar);
const iconAnimation = {
  whileHover: { scale: 1.15 },
  whileTap: { scale: 0.9 },
  transition: { type: "spring", stiffness: 300 }
};
function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/groups", icon: <GroupIcon /> },
    // { path: "/balances", icon: <AccountBalanceWalletIcon /> },
    { path: "/friends", icon: <PersonAddIcon /> },
    { path: "/admin/dashboard", icon: <DashboardIcon /> },
    { path: "/profile", icon: <PersonIcon /> },
  ];
  const {isAuthenticated,status,user,userRole} = useSelector((state)=>state.auth)
  const { isOpen, modalType, modalProps } = useSelector((state) => state.modal);

  useEffect(()=>{
   console.log("isAuthenticated,status---->",  isAuthenticated,status)
   console.log("user------>",user)
   console.log("userRole------->",userRole);
  },[isAuthenticated,status,user])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      window.location.reload(); 
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // const container = window !== undefined ? () => window().document.body : undefined;
  
  // console.log("container--------->", container);
return (
  <MotionAppBar
    position="fixed" // ✅ IMPORTANT
    // initial={{ y: 100, opacity: 0 }}
    // animate={{ y: 0, opacity: 1 }}
    // transition={{ type: "spring", stiffness: 120 }}
    sx={{
      position: "fixed",
      top: "auto",
      bottom: 16, // better spacing

      left: 0,
      right: 0,
      margin: "0 auto",   // ✅ center properly

      width: "calc(100% - 32px)", // ✅ prevents overflow
      maxWidth: "420px",          // ✅ keeps it nice on bigger screens

      borderRadius: "2rem",
      bgcolor: "#25291C",
      boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      zIndex: 1300,

      backdropFilter: "blur(10px)", // optional premium look
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
  </MotionAppBar>
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
