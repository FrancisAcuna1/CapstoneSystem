"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Grid,
  Fab,
  Paper,
  LinearProgress,
} from "@mui/material";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddPropertyModal from "../ModalComponent/AddPropertyModal";
import { styled, useTheme, css } from "@mui/system";
import { SnackbarProvider } from "notistack";
import SuccessSnackbar from "../Labraries/snackbar";
import ErrorSnackbar from "../Labraries/ErrorSnackbar";
import dynamic from "next/dynamic";

const ListofPropertyTable = dynamic(
  () => import("../TableComponent/ListofPropertyTable"),
  {
    ssr: false,
  }
);

const AddButton = styled(Fab)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable


export default function PropertyTypeComponent({
  propertyId,
  loading,
  setLoading,
}) {
  const router = useRouter();
  const [successful, setSuccessful] = useState(null);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [open, setOpen] = useState(false);
  const [propName, setPropName] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const id = propertyId;

  console.log("id:", id);
  console.log("Error:", error);
  console.log(propName);
  console.log(refreshTrigger);

  useEffect(() => {
    const fetchedPropertyName = async () => {
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;
      if (accessToken) {
        try {
          const response = await fetch(
            `${API_URL}/property_address/${propertyId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          if (response.ok) {
            setPropName(data.data);
          }
        } catch (error) {
          console.log("Error", error);
        }
      }
    };
    fetchedPropertyName();
  }, [setLoading, propertyId]);

  const handleDataRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEdit = (id, propertyType) => {
    console.log("Edit Property:", id);
    setSelectedProperty(propertyType);
    setEditItem(id);
    setOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto" }}>
      <Typography
        variant="h5"
        letterSpacing={3}
        sx={{ marginLeft: "5px", fontSize: "24px", fontWeight: "bold", mt: 5 }}
      >
        List of Rental Units - {propName.propertyname}
      </Typography>
      <Grid item xs={12} sx={{ marginLeft: "5px", mt: 2 }}>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<NavigateNextIcon sx={{ fontSize: "22px", ml:-0.6, mr:-0.6}}/>}
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
          <Link
            letterSpacing={2}
            underline="hover"
            color="inherit"
            href="/Landlord/Property"
          >
            Property
          </Link>
          <Typography
            letterSpacing={2}
            // color="text.primary"
            sx={{color:'#263238', fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
          >
            List of property
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
              <AddPropertyModal
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
                propertyId={propertyId}
                successful={successful}
                setSuccessful={setSuccessful}
                error={error}
                setError={setError}
                editItem={editItem}
                setEditItem={setEditItem}
                setSelectedProperty={setSelectedProperty}
                selectedProperty={selectedProperty}
                onRefresh={handleDataRefresh}
              />
            </SnackbarProvider>
          </Grid>

          <Grid Item>
            <SnackbarProvider maxSnack={3}>
              <ListofPropertyTable
                propertyId={propertyId}
                error={error}
                setError={setError}
                loading={loading}
                setLoading={setLoading}
                handleEdit={handleEdit}
                setSuccessful={setSuccessful}
                open={open}
                handleOpen={handleOpen}
                handleClose={handleClose}
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
