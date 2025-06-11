import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoaderOverlay = ({
//   message = "Loading...",
  size = 40,
  thickness = 4,
  color = "primary",
  zIndex = 1300, // higher than MUI modals (default zIndex of modal is 1300)
  background = 'rgba(255, 255, 255, 0.7)', // translucent white background
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex,
      }}
    >
      <CircularProgress size={size} thickness={thickness} color={color} />
      <Typography variant="body2" mt={2} color="textSecondary">
        {/* {message} */}
      </Typography>
    </Box>
  );
};

export default LoaderOverlay;
