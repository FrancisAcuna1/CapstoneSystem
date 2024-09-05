"use client"
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, CssBaseline, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Paperbase from './Dashboard/paperbased';
import HomePage from './Landlord/Home/page';
import LoginPage from './Authentication/Login/page';
import '/app/style.css';


function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
   
    <Box  className='body'>
    
      <LoginPage/>
    

      {/* <HomePage/> */}
      {/* <Paperbase/> */}
    </Box>
  );
}

export default App;
