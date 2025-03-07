"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Skeleton,
  Grid,
  Chip,
  Card,
  CardMedia,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { green, orange, red } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningOutlinedIcon from "@mui/icons-material/WarningOutlined";
import { format, parseISO } from "date-fns";
import { styled, css } from "@mui/material/styles";
import { useSnackbar } from "notistack";
import useSWR from "swr";

const UrgencyCard = styled(Box)(({ theme, level }) => ({
  backgroundColor:
    level === "Low" ? green[50] : level === "Medium" ? orange[50] : red[50],
  borderRadius: "8px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  // alignItems: 'center',
  // justifyContent: 'center',
  border: `1px solid ${
    level === "Low" ? green[500] : level === "Medium" ? orange[500] : red[500]
  }`,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
  },
}));

const fetcher = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable
const API_URL_IMG = process.env.NEXT_PUBLIC_API_URL_IMG;

const MaintenanceRequestDialog = ({
  open,
  handleClose,
  scroll = "paper",
  loading,
  setLoading,
  viewId,
}) => {
  const [userToken, setUserToken] = useState([]);
  const [viewAccepted, setViewAccepted] = useState([]);

  console.log(viewId);
  console.log(viewAccepted);
  console.log(loading);
  useEffect(() => {
    const userDataString = localStorage.getItem("userDetails");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserToken(userData?.accessToken || null);
    }
  }, []);

  const {
    data: response,
    error,
    isLoading,
  } = useSWR(
    userToken && viewId
      ? [`${API_URL}/view_accepted_request/${viewId}`, userToken]
      : null,
    fetcher,
    {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );

  console.log(error);
  useEffect(() => {
    if (response?.data) {
      const details = response?.data || "";
      setViewAccepted(details);
      setLoading(false);
    } else if (isLoading) {
      setLoading(true);
    } else if (error) {
      setLoading(false);
    }
  }, [response, error, isLoading, setLoading]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return null;
    }

    try {
      const parseDate = parseISO(dateString);
      return format(parseDate, "MMM d, yyyy");
    } catch (error) {
      console.log("Error formating Date:", error);
      return dateString;
    }
  };
  console.log("Images:", viewAccepted?.maintenance_images);

  const images =
    (viewAccepted?.maintenance_images && viewAccepted?.maintenance_images) ||
    [];
  console.log("images:", images);
  const imageBaseUrl = `${API_URL_IMG}/MaintenanceImages/`; // Adjust this based on your API endpoint

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll={scroll}
      maxWidth="md"
      fullWidth
      aria-labelledby="maintenance-request-dialog"
    >
      <DialogTitle className="bg-blue-50">
        <div className="flex justify-between items-center">
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              component="div"
              letterSpacing={1}
              sx={{ color: "#263238", fontSize: "22px", fontWeight: "500" }}
            >
              Maintenance Request Details
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                "&:hover": { backgroundColor: "#263238" },
                height: "35px",
                width: "35px",
              }}
            >
              <CloseIcon
                sx={{
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "rotate(90deg)", color: "#fefefe" },
                }}
              />
            </IconButton>
          </Box>
          <Chip
            label={viewAccepted?.status?.toUpperCase()}
            sx={{
              backgroundColor:
                viewAccepted?.status === "Pending"
                  ? "#f39c12" // Yellow for Pending
                  : viewAccepted?.status === "Accepted"
                  ? "#4caf50" // Green for Accepted
                  : viewAccepted?.status === "Rejected"
                  ? "#e53935"
                  : "#ffb300", // Red for Cancelled (default)
              color: "white",
            }}
            size="small"
          />
        </div>
      </DialogTitle>

      <DialogContent dividers={scroll === "paper"}>
        {loading ? (
          <Box className="space-y-4">
            <Skeleton animation="wave" height={60} />
            <Skeleton animation="wave" height={40} />
            <Skeleton animation="wave" height={100} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Skeleton animation="wave" height={200} />
              </Grid>
              <Grid item xs={6}>
                <Skeleton animation="wave" height={200} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box className="space-y-6">
            <UrgencyCard level={viewAccepted.urgency_level} sx={{ mb: 4 }}>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "start", fontSize: "15px" }}
              >
                Urgency Level:
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "18px",
                  fontWeight: 600,
                  mt: 1,
                  color:
                    viewAccepted.urgency_level === "Low"
                      ? "#2e7d32"
                      : viewAccepted.urgency_level === "Medium"
                      ? "#f57c00"
                      : "#d32f2f",
                }}
              >
                {viewAccepted.urgency_level === "Low" ? (
                  <CheckCircleOutlineIcon
                    sx={{ color: "#2e7d32", fontSize: "1.3rem", mr: 1 }}
                  />
                ) : viewAccepted.urgency_level === "Medium" ? (
                  <ErrorOutlineIcon
                    sx={{ color: "#f57c00", fontSize: "1.3rem", mr: 1 }}
                  />
                ) : (
                  <WarningOutlinedIcon
                    sx={{ color: "#d32f2f", fontSize: "1.3rem", mr: 1 }}
                  />
                )}
                {viewAccepted.urgency_level} Priority
              </Typography>
              <Typography>
                {viewAccepted.urgency_level === "Low" ? (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "15px",
                      color: "#616161",
                    }}
                  >
                    <InfoOutlinedIcon
                      sx={{ mr: 1, color: "#757575", fontSize: "18px" }}
                    />
                    Non-critical issues that can be addressed within 48-72 hours
                  </p>
                ) : viewAccepted.urgency_level === "Medium" ? (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "15px",
                      color: "#616161",
                    }}
                  >
                    <InfoOutlinedIcon
                      sx={{ mr: 1, color: "#757575", fontSize: "18px" }}
                    />
                    Important issues that need attention within 24 hours.
                  </p>
                ) : (
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "15px",
                      color: "#616161",
                    }}
                  >
                    <InfoOutlinedIcon
                      sx={{ mr: 1, color: "#757575", fontSize: "18px" }}
                    />
                    Critical issues requiring immediate attention. Response
                    expected within 2-4 hours.
                  </p>
                )}
              </Typography>
            </UrgencyCard>
            {/* Tenant Information */}
            <Box
              sx={{
                backgroundColor: "#ffffff",
                padding: "2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="body2"
                color="#424242"
                sx={{
                  fontWeight: 600,
                  fontSize: "1rem",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                MAINTENANCE DETAILS:
              </Typography>

              {/* Date Reported */}
              <Box display="flex" alignItems="center" marginBottom="1.5rem">
                <Typography
                  variant="body1"
                  fontSize={{ xs: "1rem", lg: "1.1rem" }}
                  sx={{
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    color: "#424242",
                  }}
                >
                  <CalendarMonthIcon
                    sx={{
                      marginRight: "0.8rem",
                      fontSize: "1.2rem",
                      color: "#757575",
                    }}
                  />
                  Date Reported:
                </Typography>
                <Typography
                  variant="body1"
                  fontSize={{ xs: "1rem", lg: "1.1rem" }}
                  sx={{ fontWeight: "500", ml: 0.8, color: "#616161" }}
                >
                  {formatDate(viewAccepted?.date_reported)}
                </Typography>
              </Box>

              {/* Date Approval or Rejection */}
              {viewAccepted.status === "Accepted" ? (
                <Box display="flex" alignItems="center" marginBottom="1.5rem">
                  <Typography
                    variant="body1"
                    fontSize={{ xs: "1rem", lg: "1.1rem" }}
                    sx={{
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      color: "#424242",
                    }}
                  >
                    <CalendarMonthIcon
                      sx={{
                        marginRight: "0.8rem",
                        fontSize: "1.2rem",
                        color: "#757575",
                      }}
                    />
                    Date Approval:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontSize={{ xs: "1rem", lg: "1.1rem" }}
                    sx={{ fontWeight: "500", ml: 0.8, color: "#616161" }}
                  >
                    {formatDate(viewAccepted?.updated_at)}
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" marginBottom="1.5rem">
                  <Typography
                    variant="body1"
                    fontSize={{ xs: "1rem", lg: "1.1rem" }}
                    sx={{
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      color: "#424242",
                    }}
                  >
                    <CalendarMonthIcon
                      sx={{
                        marginRight: "0.8rem",
                        fontSize: "1.2rem",
                        color: "#757575",
                      }}
                    />
                    Date Rejected:
                  </Typography>
                  <Typography
                    variant="body1"
                    fontSize={{ xs: "1rem", lg: "1.1rem" }}
                    sx={{ fontWeight: "500", ml: 0.8, color: "#616161" }}
                  >
                    {formatDate(viewAccepted?.updated_at)}
                  </Typography>
                </Box>
              )}

              {/* Reported Issue Section */}
              <Box sx={{ marginTop: "1.5rem" }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "#424242",
                    marginBottom: "0.5rem",
                  }}
                >
                  Reported Issue:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "1rem", color: "#616161" }}
                >
                  {viewAccepted?.other_issue ||
                    viewAccepted?.reported_issue ||
                    "No reported issue"}
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Box sx={{ marginTop: "2rem" }}>
              <Typography
                variant="subtitle1"
                color="#424242"
                sx={{
                  fontWeight: 550,
                  fontSize: "0.9rem",
                  marginBottom: "0.5rem",
                }}
                gutterBottom
              >
                DESCRIPTION:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: "#eceff1",
                  padding: "1rem",
                  borderRadius: "8px",
                  color: "#424242",
                }}
              >
                {viewAccepted?.issue_description}
              </Typography>

              {viewAccepted?.remarks && (
                <Box>
                  <Typography
                    variant="subtitle1"
                    color="#424242"
                    sx={{
                      fontWeight: 550,
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                      mt: 3,
                      color: "red",
                    }}
                    gutterBottom
                  >
                    Remarks:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      backgroundColor: "#ffebee",
                      padding: "1rem",
                      borderRadius: "8px",
                      color: "#424242",
                    }}
                  >
                    {viewAccepted?.remarks}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Images */}
            {viewAccepted?.maintenance_images &&
              viewAccepted.maintenance_images.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="#424242"
                    sx={{ mt: 5, fontWeight: "550", fontSize: "0.9rem" }}
                    gutterBottom
                  >
                    ATTACHED IMAGES
                  </Typography>
                  <Grid container spacing={2}>
                    {viewAccepted.maintenance_images.map((image, index) => (
                      <Grid item xs={12} sm={6} key={image.id}>
                        <Card className="relative">
                          <CardMedia
                            component="img"
                            height="300"
                            image={`${imageBaseUrl}${image.image_path}`}
                            alt={`Maintenance Image ${index + 1}`}
                            className="object-cover h-48 w-full"
                          />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
          </Box>
        )}
      </DialogContent>

      <DialogActions className="bg-gray-50">
        <Button
          color="primary"
          variant="contained"
          onClick={() => handleClose()}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaintenanceRequestDialog;
