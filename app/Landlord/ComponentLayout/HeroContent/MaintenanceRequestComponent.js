"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  Link,
  Fade,
  Breadcrumbs,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RequestMaintenanceTable from "../TableComponent/RequestMaintenanceTable";
import SuccessSnackbar from "../Labraries/snackbar";
import ErrorSnackbar from "../Labraries/ErrorSnackbar";
import { SnackbarProvider } from "notistack";
import { useRouter } from "next/navigation";

export default function MaintenaceRequestComponent({ setLoading, loading }) {
  const [error, setError] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleDataRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1); 
  }, []);

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto" }}>
        <Typography
            variant="h5"
            letterSpacing={3}
            sx={{
            color: "#263238",
            marginLeft: "5px",
            fontSize: "24px",
            fontWeight: "bold",
            mt: 5,
            }}
        >
            Maintenance Request
        </Typography>
        <Grid item xs={12} sx={{ marginLeft: "5px", mt: 2 }}>
            <Breadcrumbs
            separator={
            <NavigateNextIcon sx={{ fontSize: "22px", ml: -0.6, mr: -0.6 }} />
            }
            aria-label="breadcrumb"
            sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
            >
            {/* <Typography color="inherit">Navigation</Typography> */}
            <Link
                letterSpacing={2}
                underline="hover"
                color="inherit"
                href="/Landlord/Home"
            >
                <HomeOutlinedIcon sx={{color:'#673ab7', mt:0.5}}/>
            </Link>
            <Typography
                letterSpacing={2}
                color="text.primary"
                sx={{color:'#212121', fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
            >
                Maintenance Request
            </Typography>
            </Breadcrumbs>
        </Grid>
        <Box sx={{ mt: "4rem" }}></Box>

        <Grid
            container
            spacing={1}
            sx={{ mt: "-0.9rem", display: "flex", justifyContent: " center" }}
        >
            <Grid item xs={12}>
                <Paper
                    elevation={2}
                    sx={{
                    maxWidth: { xs: 312, sm: 741, md: 940, lg: 1400 },
                    borderRadius: "8px",
                    marginTop: "2rem",
                    height: "auto",
                    borderTop: '4px solid', 
                    borderTopColor: '#7e57c2'
                    }}
                >
                <SnackbarProvider maxSnack={3}>
                <RequestMaintenanceTable
                    setLoading={setLoading}
                    loading={loading}
                    setError={setError}
                    setSuccessful={setSuccessful}
                    onRefresh={handleDataRefresh}
                    refreshTrigger={refreshTrigger}
                />
                </SnackbarProvider>
                </Paper>
            </Grid>
        </Grid>
    </Box>
  );
}
