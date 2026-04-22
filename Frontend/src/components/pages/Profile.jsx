import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { openModal } from '../../redux/modal/modalSlice';
import { logout } from '../../redux/auth/authSlice';
import { motion } from 'framer-motion';
import { fetchUserDetails } from '../../redux/user/userSlice';
const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(()=>{
    console.log("User in profile page------>",user)
  },[user])
  const editProfileDetails = () => {
    dispatch(
      openModal({
        modalType: 'EDIT_PROFILE',
        modalProps: {
          title: 'Edit Profile',
          name: user.name,
          email: user.email,
        },
      })
    );
  };

  const changePassword = () => {
    dispatch(
      openModal({
        modalType: 'CHANGE_PASSWORD',
        modalProps: {
          title: 'Change Password',
        },
      })
    );
  };
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      window.location.reload();
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const InfoRow = ({ label, value }) => (
    <Box display="flex" justifyContent="space-between">
      <Typography fontSize="0.75rem" color="gray" sx={{fontFamily: 'Montserrat, sans-serif',fontWeight: 600}}>
        {label}
      </Typography>
      <Typography fontSize="0.85rem" fontWeight={500} sx={{fontFamily: 'Montserrat, sans-serif',}}>
        {value}
      </Typography>
    </Box>
  );

  return (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    style={{
      height:'100%',
    }}
  >
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        fontFamily: 'Montserrat, sans-serif',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        p: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 420,
          bgcolor: 'transparent',
          borderRadius: '2rem',
          p: 3,
          // border: '1px solid #e0e0e0',
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={2}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto',
              bgcolor: '#25291C',
              fontSize: '2rem',
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || (
              <AccountCircleIcon />
            )}
          </Avatar>

          <Typography sx={{fontFamily: 'Montserrat, sans-serif',}} mt={1} fontWeight={600} fontSize="1.1rem">
            {user?.name}
          </Typography>

          <Typography sx={{fontFamily: 'Montserrat, sans-serif',fontWeight:500}}   fontSize="0.8rem" color="gray">
            {user?.email}
          </Typography>

          <Chip
            label={user?.role}
            size="small"
            sx={{ mt: 1, bgcolor: '#e0e0e0' }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Info Section */}
        <Box display="flex" flexDirection="column" gap={1}>
          <InfoRow  label="Full Name" value={user?.name} />
          <InfoRow  label="Email" value={user?.email} />
          <InfoRow  label="Role" value={user?.role} />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box display="flex" flexDirection="column" gap={1} justifyContent="start" alignItems="start">
          <Button
            variant="text"
            onClick={editProfileDetails}
            sx={{
              // borderRadius: '2rem',
              textTransform: 'none',
              fontFamily: 'Montserrat, sans-serif',
              color:'#007f76'
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="text"
            onClick={changePassword}
            sx={{
              // borderRadius: '2rem',
              textTransform: 'none',
              // bgcolor: '#25291C',
              fontFamily: 'Montserrat, sans-serif',
              color:'#007f76'
            }}
          >
            Change Password
          </Button>
          <Button
            variant="text"
            color="error"
            sx={{ borderRadius: '2rem', textTransform: 'none', fontFamily: 'Montserrat, sans-serif', color:'#007f76' }}
          >
            Delete Account
          </Button>

          <Button
            variant="text"
            onClick={handleLogout}
            sx={{ textTransform: 'none', color: '#ff7c72', fontFamily: 'Montserrat, sans-serif' }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  </motion.div>
  );
};

export default Profile;
