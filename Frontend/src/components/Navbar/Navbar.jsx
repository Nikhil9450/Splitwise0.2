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
import { Link } from 'react-router-dom';
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
const drawerWidth = 240;



function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);


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
    <Box sx={{ display: 'flex',mb:{xs:0,sm:10} }}>
      <CssBaseline />
      <AppBar component="nav"  sx={{     
                                    mt:{xs:10,sm:0},                       
                                    top: { xs: 'auto', sm: 0 },
                                    bottom: { xs: 0, sm: 'auto' },
                                  }}>
        <Toolbar sx={{display:'flex',justifyContent:'space-around',alignItems:'center'}}>
          <Typography
            variant="h6"
            component={Link} to="/"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' },textDecoration:'none',color:'white' }}
          >
            Home
          </Typography>
          {/* <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}> */}
            <IconButton aria-label="group" size="small" component={Link} to="/groups">
              <GroupIcon fontSize="small" />
            </IconButton>

            <IconButton aria-label="balances" size="small" component={Link} to="/balances">
              <AccountBalanceWalletIcon fontSize="small" />
            </IconButton> 

            <IconButton aria-label="friends" size="small" component={Link} to="/friends">
              <PersonAddIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="hero" size="small" component={Link} to="/hero">
              Hero
            </IconButton>
          {/* </Stack> */}
          <Box sx={{display: { xs: 'block', sm: 'block' } }}> 
            <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ color: 'white',display:{xs:'none',sm:'flex'} }}
            >
              
            <Avatar sx={{bgcolor:'white' ,color:'grey'}}><PersonIcon sx={{fontSize:'xx-large'}}/></Avatar>

            <Box sx={{flexDirection:'column',justifyContent:'center',alignItems:'start',ml:'10px',display: { xs: 'none', sm: 'flex' },}}>
              <Typography variant="body2" gutterBottom sx={{ display: 'block' ,marginBottom:'-3px',fontSize:'12px'}}>
                {user && user.name}
              </Typography>
              <Typography variant="caption" gutterBottom sx={{ display: 'block',textTransform:'none',marginBottom:'0px' }}>
                {user && user.email}
              </Typography>
            </Box>
            </Button>

            <IconButton aria-label="delete" size="small" onClick={handleClick} sx={{fontSize:'small',display:{xs:'block',sm:'none'}}}>
              <PersonIcon fontSize="small" />
            </IconButton> 
            <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
                list: {
                'aria-labelledby': 'basic-button',
                },
            }}
            >
            <Box
              sx={{
                display: {xs:'none',sm:'flex'},
                flexWrap: 'wrap',
                '& > :not(style)': {
                  m: 2,
                  width: 300,
                  height: 150,
                  bgcolor:'#e6e6e6',
                  borderRadius:'20px',
                },
              }}
            >
              <Paper elevation={0} 
                sx={{
                  display:'flex',
                  flexDirection:'column',
                  justifyContent:'center',
                  alignItems:'center'
                }}>
                <Avatar sx={{bgcolor:'white' ,color:'#eaeaea', width: 56, height: 56,mb:'5px'}}><PersonIcon sx={{fontSize:'xx-large'}}/></Avatar>

                <Typography variant="body2" gutterBottom sx={{ display: 'block' ,marginBottom:'-3px',color:'#5d5d5d'}}>
                  {user && user.name}
                </Typography>
                <Typography variant="caption" gutterBottom sx={{ display: 'block',color:'#5d5d5d' }}>
                  {user && user.email}
                </Typography>
              </Paper>
            </Box>
            <Divider sx={{display:{xs:'none',sm:'block'}}}/>
              {userRole === 'admin' && (
                <MenuItem key="Admin" sx={{ color:'#767676',fontSize:'14px' }} component={Link} to="/admin/dashboard">
                 <DashboardIcon sx={{marginRight:'1rem'}}/> Admin Dashboard
                </MenuItem>
              )}
              <MenuItem sx={{color:'#767676',fontSize:'14px'}} component={Link} to="/profile"><AccountCircleIcon sx={{marginRight:'1rem'}}/>Your Account</MenuItem>
              <MenuItem
                sx={{ color: '#767676', fontSize: '14px' }}
                onClick={() => {
                  console.log("Opening Create Group modal...");
                  dispatch(openModal({
                    modalType: 'CREATE_GROUP',
                    modalProps: {
                      title: 'Create group',
                    }
                  }));
                }}
              >
                <GroupAddIcon sx={{ marginRight: '1rem' }} />
                Create Group
              </MenuItem>
              <MenuItem sx={{color:'#767676',fontSize:'14px'}} onClick={handleLogout}><LogoutIcon sx={{marginRight:'1rem'}}/>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
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
