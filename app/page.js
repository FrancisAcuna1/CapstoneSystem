"use client"
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, CssBaseline, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Paperbase from './Dashboard/paperbased';
import HomePage from './Landlord/Home/page';

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box >
      <HomePage/>
      {/* <Paperbase/> */}
    </Box>
  );
}

export default App;
