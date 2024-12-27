'use client';
import React, { useState } from "react";
import {CssBaseline, Grid, Divider, ToggleButtonGroup, ToggleButton, Box, Typography, LinearProgress} from '@mui/material';
import PropertyCard from "../components/HeroComponent/PropertyComponent";
import AppAppBar from "../components/LayoutComponent/Appbar";
import Hero from "../components/HeroComponent/Hero";
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from "../components/LayoutComponent/getLPTheme";
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import Footer from "../components/LayoutComponent/Footer";
// import dynamic from "next/dynamic";
// const Layout = dynamic(() => import('../../Proptack-website/components/Appbar'), {
//     ssr: false
//     }) 
// const theme = createTheme({
//   palette: {
//     primary: {
//       light: '#b6bdf1',  // Accent Color
//       main: '#8785d0',    // Primary Color
//       dark: '#6f6ab2',    // Darker Shade of Primary Color
//     },
//     secondary: {
//       main: '#f78028',    // Secondary Color
//     },
//     warning: {
//       main: '#a55555',    // Alert/Warn Color
//     },
//     background: {
//       default: '#eaeff1', // Neutral Color for backgrounds
//     },
//   },
// });
  

const properties = [
  {
    id: 1,
    name: "Modern Apartment",
    description: "A beautiful modern apartment in the heart of the city.",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    name: "Cozy House",
    description: "A cozy house perfect for families.",
    image: "https://via.placeholder.com/300",
  },
];


export default function Properties() {
  const [mode, setMode] = useState('light');
  const [activeTab, setActiveTab] = useState('/');
  const [loading, setLoading] = useState(false);
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };
  

  return (
    <ThemeProvider theme={showCustomTheme ? defaultTheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} activeTab={activeTab} setActiveTab={setActiveTab}/>
      {loading && <LinearProgress sx={{ color:"#673ab7", position: 'absolute',  zIndex: 0, top: 0, left: 0, right: 0, height: 4, borderRadius: '4px 4px 0 0' }} />}
      <PropertyCard loading={loading} setLoading={setLoading}/>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Grid container justifyContent="space-between" sx={{ padding: '0 20px' }}>
          <Grid item>
            {/* Add any content here */}
          </Grid>
          {/* <Grid item>
            <Chatbot />
          </Grid> */}
        </Grid>
       
      </Box>
      <Footer/>
    </ThemeProvider>
   
  );
} 