"use client";
import React, { useState, useCallback} from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  Link,
  Breadcrumbs,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SuccessSnackbar from "../Labraries/snackbar";
import { SnackbarProvider } from "notistack";
import ErrorSnackbar from "../Labraries/ErrorSnackbar";
import AddScheduleModal from "../ModalComponent/AddMaintenanceSchedule";
import dynamic from "next/dynamic";
const Fullcalendar = dynamic(() => import("../Labraries/CalendarComponent"), {
  ssr: false,
});

export default function ScheduleComponent({ loading, setLoading }) {
  const [open, setOpen] = useState(false);
  const [successful, setSuccessful] = useState(null);
  const [error, setError] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);



  const handleDataRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1); 
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedScheduleId(null);
  };

  const handleEventClick = (clickInfo) => {
    const scheduleId = clickInfo.event.id;
    setSelectedScheduleId(scheduleId);
    setIsEditMode(true);
    handleOpen();
  };

  console.log(selectedScheduleId);
  console.log(isEditMode);

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto" }}>
      <Typography
        variant="h5"
        letterSpacing={3}
        sx={{ marginLeft: "5px", fontSize: "24px", fontWeight: "bold", mt: 5 }}
      >
        Schedule of All Maintenance
      </Typography>
      <Grid item xs={12} sx={{ marginLeft: "5px", mt: 2 }}>
        <Breadcrumbs
        separator={
          <NavigateNextIcon sx={{ fontSize: "22px", ml: -0.6, mr: -0.6 }} />
          }
          aria-label="breadcrumb"
          sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
        >
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
            sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
          >
            Maintenance Schedule
          </Typography>
        </Breadcrumbs>
      </Grid>
      <Box sx={{ mt: "4rem" }}></Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            style={{
              "@media (max-width: 100px)": { width: "auto" },
              padding: "25px",
              marginTop: "15px",
              borderRadius: "15px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: {
                  xs: "start",
                  sm: "space-between",
                  lg: "space-between",
                },
              }}
            >
              <Grid item>
                <Typography
                  variant="h6"
                  letterSpacing={1}
                  gutterBottom
                  sx={{ fontWeight: 550, marginLeft: "5px", mt: 1, mb: 1 }}
                >
                  Maintenance Calendar
                </Typography>
              </Grid>
              <Grid item>
                {/* modal dini */}
                <SnackbarProvider maxSnack={3}>
                  <AddScheduleModal
                    handleOpen={handleOpen}
                    open={open}
                    handleClose={handleClose}
                    setSuccessful={setSuccessful}
                    setError={setError}
                    setLoading={setLoading}
                    loading={loading}
                    setSelectedScheduleId={setSelectedScheduleId}
                    selectedScheduleId={selectedScheduleId}
                    onRefresh={handleDataRefresh}
                  />
                </SnackbarProvider>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 2 }} />
            <SnackbarProvider maxSnack={3}>
              <Fullcalendar
                handleOpen={handleOpen}
                handleClose={handleClose}
                open={open}
                setSuccessful={setSuccessful}
                setError={setError}
                setLoading={setLoading}
                loading={loading}
                handleEventClick={handleEventClick}
                refreshTrigger={refreshTrigger}
                onRefresh={handleDataRefresh}
              />
            </SnackbarProvider>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
