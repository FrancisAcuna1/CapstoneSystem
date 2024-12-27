"use client";
import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Link,
  Breadcrumbs,
  Divider,
  Skeleton,
  Avatar,
  TextField,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import RequestMaintenanceForm from "../FormComponent/RequestMaitenanceForm";
import SuccessSnackbar from "../../../Landlord/ComponentLayout/Labraries/snackbar";
import ErrorSnackbar from "../../../Landlord/ComponentLayout/Labraries/ErrorSnackbar";
import { SnackbarProvider } from "notistack";
import RequestMaintenanceTable from "../TableComponent/RequestMaintenanceTable";

export default function RequestMaintenanceComponent({ loading, setLoading }) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [editId, setEditId] = useState([]);

    console.log(editId);
    console.log(loading)
    const handleDataRefresh = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = (info) => {
        setEditId(info);
        setOpen(true);
    };
    return (
        <>
        <Box sx={{ maxWidth: 1400, margin: "auto" }}>
            <Typography
            variant="h5"
            letterSpacing={3}
            sx={{
                marginLeft: "1px",
                fontSize: "24px",
                fontWeight: "bold",
                mt: 5,
            }}
            >
            Request Maintenace
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
                href="/User/Home"
                >
               <HomeOutlinedIcon sx={{color:'#673ab7', mt:0.5}}/>
                </Link>
                <Typography
                letterSpacing={2}
                color="text.primary"
                sx={{ fontSize: { xs: "14px", sm: "15px", md: "15px" } }}
                >
                Request Maintenace
                </Typography>
            </Breadcrumbs>
            </Grid>
            <Box sx={{ mt: "4rem" }}></Box>
            <Grid
            container
            spacing={1}
            sx={{ mt: "-0.9rem", display: "flex", justifyContent: " center" }}
            >
            <Grid item xs={12} sm={6} md={4} lg={12}>
                <SnackbarProvider maxSnack={3}>
                <RequestMaintenanceForm
                    setLoading={setLoading}
                    setError={setError}
                    error={error}
                    setSuccessful={setSuccessful}
                    successful={successful}
                    onRefresh={handleDataRefresh}
                    open={open}
                    handleClose={handleClose}
                    handleOpen={handleOpen}
                    editId={editId}
                    setEditId={setEditId}
                />
                </SnackbarProvider>
            </Grid>
            <Grid item xs={12}>
                <Paper
                elevation={2}
                sx={{
                    maxWidth: { xs: 312, sm: 741, md: 940, lg: 1400 },
                    padding: "1rem 0rem 0rem 0rem",
                    borderRadius: "8px",
                    marginTop: "2rem",
                    height: "auto",
                }}
                >
                <SnackbarProvider maxSnack={3}>
                    <RequestMaintenanceTable
                    setLoading={setLoading}
                    loading={loading}
                    onRefresh={handleDataRefresh}
                    refreshTrigger={refreshTrigger}
                    handleEdit={handleEdit}
                    />
                </SnackbarProvider>
                </Paper>
            </Grid>
            </Grid>
        </Box>
        </>
    );
}
