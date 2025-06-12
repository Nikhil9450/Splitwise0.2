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

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      {/* <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography> */}
      <Typography
            variant="h6"
            component={Link} to="/"
            sx={{ my:2, textDecoration:'none',lineHeight:'3'}}
          >
            Home
          </Typography>
      <Divider />
      <List>
        {/* <ListItem key="Home" disablePadding>
        <ListItemButton component={Link} to="/" sx={{ textAlign: 'center' }}>
            <ListItemText primary="Home" />
        </ListItemButton>
        </ListItem> */}
        {userRole === 'admin' && (
        <ListItem key="Admin" disablePadding>
            <ListItemButton sx={{ textAlign: 'start' }}>
              <ListItemText primary="Admin Dashboard" />
            </ListItemButton>
          </ListItem>
          )
        }
        <ListItem key="Other Item" disablePadding>
            <ListItemButton sx={{ textAlign: 'start' }}>
                <ListItemText primary="Other Items" />
            </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link} to="/"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' },textDecoration:'none',color:'white' }}
          >
            Home
          </Typography>
          <Box sx={{ml:'auto', display: { xs: 'block', sm: 'block' } }}>
            {/* <Button key="Home" sx={{ color: '#fff' }} component={Link} to="/">
                Home
            </Button> */}

            <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ color: 'white' }}
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

      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        
      </nav>
      <Box component="main" sx={{ pt: 10, px: 3 }}>
      </Box>
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
