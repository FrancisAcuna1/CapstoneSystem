import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Content() {
  return (
    <Paper sx={{ maxWidth: 936, margin: 'auto', overflow: 'hidden' }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon color="inherit" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search by email address, phone number, or user UID"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{ mr: 1 }}>
                Add user
              </Button>
              <Tooltip title="Reload">
                <IconButton>
                  <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
        No users for this project yet
      </Typography>
    </Paper>
  );
}{/*                         
  <Typography variant="h5" gutterBottom>
Lease Information
</Typography>
<Grid container spacing={2}>
<Grid item xs={6}>
<Typography variant="body1">
<strong>Lease Start Date:</strong> January 1, 2024
</Typography>
<Typography variant="body1" sx={{ mt: 1 }}>
<strong>Lease End Date:</strong> December 31, 2024
</Typography>
<Typography variant="body1" sx={{ mt: 1 }}>
<strong>Rent Due Date:</strong> 1st of Every Month
</Typography>
</Grid>
<Grid item xs={6}>
<Typography variant="body1">
<strong>Monthly Rent:</strong> $1,200
</Typography>
<Typography variant="body1" sx={{ mt: 1 }}>
<strong>Security Deposit:</strong> $2,400
</Typography>
<Typography variant="body1" sx={{ mt: 1 }}>
<strong>Move-in Date:</strong> January 1, 2024
</Typography>
</Grid>
</Grid> */}




          {/* <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                  <Typography variant="h5" letterSpacing={2} sx={{ ml: '0.3rem', mt: '0.1rem', fontSize: '24px', fontWeight: 540 }}>
                  Unit no. 1
                  </Typography>
                  <Typography variant="body1" letterSpacing={2} color="#f78028" sx={{ maxWidth: { xs: 225, lg: 125 }, ml: '0.3rem', mt: '0.1rem', fontSize: '15px', fontWeight: 540 }}>
                  Monthly Rate: ₱10,000.00
                  </Typography>
              </Grid>
              <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <img
                  src="/3Dnewbedroom.png"
                  style={{ width: '105px', height: 'auto', objectFit: 'contain' }}
                  alt="proptrack logo"
                  />
              </Grid>
          </Grid> */}

          {/* <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
              <Button href='/Dashboard/apartment/[id]/RegisterTenant' variant="contained" sx={{width: '100%', background: '#8785d0', '&:hover':{background: '#b6bdf1'}, mt: '2rem', mb: '-0.1rem', fontSize: 16, borderRadius: '12px'}} ><CreateOutlinedIcon sx={{mr:'0.2rem'}}/>Register New Tenant</Button>
          </Box> */}