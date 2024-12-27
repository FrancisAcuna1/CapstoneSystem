"use client";

import * as React from "react";
import { useState } from "react";
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
import StatusTable from "../TableComponent/StatusTable";
import StatusCards from "../Labraries/StatusCards";

export default function StatusComponent({ setLoading, loading }) {
    return (
        <Box sx={{ maxWidth: 1400, margin: "auto" }}>
        <Typography
            variant="h5"
            letterSpacing={3}
            sx={{ marginLeft: "5px", fontSize: "24px", fontWeight: "bold", mt: 5 }}
        >
            Maintenance Status
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
                Status
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
            <StatusCards setLoading={setLoading} loading={loading} />
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
                borderTop: "4px solid",
                borderTopColor: "#7e57c2",
                }}
            >
                <StatusTable setLoading={setLoading} loading={loading} />
            </Paper>
            </Grid>
        </Grid>
        </Box>
    );
}
