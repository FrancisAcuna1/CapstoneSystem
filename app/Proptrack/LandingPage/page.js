"use client"
import React from "react";
import { useState } from "react";
import AppAppBar from "../components/LayoutComponent/Appbar";
import Hero from "../components/HeroComponent/Hero";
import PropTypes from 'prop-types';
import {CssBaseline, ToggleButtonGroup, ToggleButton, Box, Grid, Typography, LinearProgress} from '@mui/material';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from "../components/LayoutComponent/getLPTheme";
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import Footer from "../components/LayoutComponent/Footer";
import FeatureComponent from "../components/HeroComponent/Feature";
import HowItWorksComponent from "../components/HeroComponent/HowItWorks";
// import Chatbot from "../../component/chatbot";


// function ToggleCustomTheme({ showCustomTheme, toggleCustomTheme }) {
//     return (
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           width: '100dvw',
//           position: 'fixed',
//           bottom: 24,
//         }}
//       >
//         <ToggleButtonGroup
//           color="primary"
//           exclusive
//           value={showCustomTheme}
//           onChange={toggleCustomTheme}
//           aria-label="Toggle design language"
//           sx={{
//             backgroundColor: 'background.default',
//             '& .Mui-selected': {
//               pointerEvents: 'none',
//             },
//           }}
//         >
//           <ToggleButton value={false}>Material Design 2</ToggleButton>
//         </ToggleButtonGroup>
//       </Box>
//     );
//   }
  
//   ToggleCustomTheme.propTypes = {
//     showCustomTheme: PropTypes.shape({
//       valueOf: PropTypes.func.isRequired,
//     }).isRequired,
//     toggleCustomTheme: PropTypes.func.isRequired,
//   };

export default function LandingPage() {
    const [mode, setMode] = React.useState('light');
    const [loading, setLoading] = useState(false);
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
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
      {loading && <LinearProgress sx={{ color:"#673ab7", position: 'absolute',  zIndex: 2100, top: 0, left: 0, right: 0, height: 4, borderRadius: '4px 4px 0 0' }} />}
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode}/>
      <Hero />
      <HowItWorksComponent/>
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