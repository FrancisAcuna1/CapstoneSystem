"use client"
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppAppBar from "../../../../components/LayoutComponent/Appbar";
import PropTypes from 'prop-types';
import {CssBaseline, ToggleButtonGroup, ToggleButton, Box, Grid, Typography} from '@mui/material';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from "../../../../components/LayoutComponent/getLPTheme";
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import BoardingHouseGallery from "@/app/Proptrack/components/HeroComponent/BoardingHouseGalleryComponent";
import CustomAppBar from "../../../../components/LayoutComponent/ImageGalleryAppbar";
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

export default function GalleryPage() {
    const params = useParams();
    const boardinghouseId = params.boardinghouseId;
    const propsId = params.id;
    const [loading, setLoading] = useState(false);
    console.log('id:', boardinghouseId);
    console.log('prop:', propsId);
    const [mode, setMode] = React.useState('light');
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
      {/* <AppAppBar mode={mode} toggleColorMode={toggleColorMode} /> */}
      <CustomAppBar  mode={mode} toggleColorMode={toggleColorMode} />
      <BoardingHouseGallery
        loading={loading}
        setLoading={setLoading}
        boardinghouseId={boardinghouseId}
        propsId={propsId}
      />
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
      
    </ThemeProvider>
    );

}