
import { Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Groups from './groups'
const Home = () => {
  return (
      <Box sx={{ height: '80vh', margin: '1rem 2rem', border: '1px solid #82bdf7' }}>
        <Grid container spacing={2} direction="column" sx={{ height: '100%',flexWrap:'nowrap',display:{xs:'none',sm:'block'} }}>
          <Grid >
            <Box sx={{ bgcolor: '#dcedff' }}>
              <Divider sx={{ borderColor: '#82bdf7' }} />
            </Box>
          </Grid>
          <Grid size="grow" sx={{height:'80%',margin:'1rem'}}>
                <Groups />
          </Grid>
        </Grid>  
      </Box>

  )
}

export default Home