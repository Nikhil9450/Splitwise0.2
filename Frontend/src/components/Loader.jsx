import { Box, CircularProgress, Typography } from '@mui/material';

const LoaderOverlay = ({
  message = "Loading...",
  size = 40,
  thickness = 4,
  color = "#009F93",
  zIndex = 1300, // higher than MUI modals (default zIndex of modal is 1300)
  background = 'rgba(0, 0, 0, 0.82)', // translucent white background
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
      <CircularProgress size={size} thickness={thickness} sx={{ color: color }}/>
      <Typography variant="body2" mt={2} sx={{color:'white',fontFamily:'Montserrat, sans-serif',fontWeight:500}}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoaderOverlay;
