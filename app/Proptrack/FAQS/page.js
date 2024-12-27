"use client"
import React from "react";
import AppAppBar from "../components/LayoutComponent/Appbar";
import Hero from "../components/HeroComponent/Hero";
import PropTypes from 'prop-types';
import {CssBaseline, ToggleButtonGroup, ToggleButton, Box, Grid, Typography} from '@mui/material';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from "../components/LayoutComponent/getLPTheme";
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import ContactComponent from "../components/HeroComponent/FAQSComponent";
import Footer from "../components/LayoutComponent/Footer";
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
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <ContactComponent/>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Grid container justifyContent="space-between" sx={{ padding: '0 20px' }}>
          
          <Grid item>

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


// 'use client';
// import React from "react";
// import Typography from "@mui/material/Typography";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";


// export default function Contact() {
//   return (
//     <Layout>
//       <Typography variant="h3" gutterBottom>
//         Contact Us
//       </Typography>
//       <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
//         <TextField fullWidth label="Name" margin="normal" />
//         <TextField fullWidth label="Email" margin="normal" />
//         <TextField
//           fullWidth
//           label="Message"
//           multiline
//           rows={4}
//           margin="normal"
//         />
//         <Button variant="contained" color="primary" sx={{ mt: 2 }}>
//           Send Message
//         </Button>
//       </Box>
//     </Layout>
//   );
// }