"use client";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
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
import EquipmentTable from "../TableComponent/EquipmentTable";
import AddEquipmentModal from "../ModalComponent/AddEquipmentModal";
import SuccessSnackbar from "../Labraries/snackbar";
import { SnackbarProvider } from "notistack";
import ErrorSnackbar from "../Labraries/ErrorSnackbar";

export default function EquipmentComponent({ loading, setLoading }) {
  const [successful, setSuccessful] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEdit = (id) => {
    setEditItem(id);
    setOpen(true);
  };

  const handleDataRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1); // Increment to trigger refresh
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
        Amenities & Equipment
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
            sx={{color:'#212121', fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
          >
            Amenities & Equipment
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
          <Grid item>
            <SnackbarProvider maxSnack={3}>
              <AddEquipmentModal
                open={open}
                handleClose={handleClose}
                handleOpen={handleOpen}
                setSuccessful={setSuccessful}
                setError={setError}
                error={error}
                setLoading={setLoading}
                loading={loading}
                setEditItem={setEditItem}
                editItem={editItem}
                onRefresh={handleDataRefresh}
              />
            </SnackbarProvider>
          </Grid>
          <Grid item>
            <SnackbarProvider maxSnack={3}>
              <EquipmentTable
                setSuccessful={setSuccessful}
                setError={setError}
                error={error}
                setLoading={setLoading}
                loading={loading}
                handleEdit={handleEdit}
                refreshTrigger={refreshTrigger}
                onRefresh={handleDataRefresh}
              />
            </SnackbarProvider>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
