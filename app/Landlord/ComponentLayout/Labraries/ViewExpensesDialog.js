import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import {
  Home,
  Category,
  AttachMoney,
  CalendarToday,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { format, parseISO } from "date-fns";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function ViewExpensesDialog({
  open,
  handleClose,
  viewExpensesId,
}) {
  const [expensesDetails, setExpensesDetails] = useState([]);

  useEffect(() => {
    const fetchExpensesDetails = async () => {
      const userDataString = localStorage.getItem("userDetails");
      const userData = JSON.parse(userDataString);
      const accessToken = userData.accessToken;

      if (accessToken) {
        try {
          const response = await fetch(
            `${API_URL}/edit/${viewExpensesId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = await response.json();
          if (response.ok) {
            setExpensesDetails(data.data);
          } else {
            console.log(data.message);
          }
        } catch (error) {
          console.log("error");
        }
      } else {
        console.log("No Access Token Found!");
      }
    };
    fetchExpensesDetails();
  }, [viewExpensesId]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch (error) {
      console.log("Error formatting Date:", error);
      return dateString;
    }
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* 🔹 Premium Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #6C63FF, #8785d0)",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.2rem",
          textAlign: "center",
        }}
      >
        Expense Details
      </DialogTitle>

      {/* Close Button */}
      <IconButton
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          color: "white",
          transition: "0.3s",
          "&:hover": { transform: "rotate(90deg)", color: "#ffeb3b" },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers sx={{ backgroundColor: "#f4f7fc" }}>
        {expensesDetails && (
          <Box sx={{ p: 2 }}>
            {/* 🔹 Expenses Details Section */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 2,
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Grid container spacing={3}>
                {[
                  {
                    icon: <Home />,
                    label: "Unit Type",
                    value: expensesDetails.unit_type,
                  },
                  {
                    icon: <Category />,
                    label: "Category",
                    value: expensesDetails.category,
                  },
                  {
                    icon: <AttachMoney />,
                    label: "Amount",
                    value: `$${parseFloat(expensesDetails.amount).toFixed(2)}`,
                  },
                  {
                    icon: <CalendarToday />,
                    label: "Date",
                    value: formatDate(expensesDetails.expense_date),
                  },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {item.icon}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#5C6BC0", fontWeight: 600 }}
                        >
                          {item.label}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* 🔹 Description Section */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: "10px",
                background: "#ffffff",
                borderLeft: "5px solid #6C63FF",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: "#3949AB", fontWeight: 600 }}
              >
                Description:
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {expensesDetails.description}
              </Typography>
            </Paper>

            {/* 🔹 Images Section */}
            {expensesDetails.expenses_images &&
              expensesDetails.expenses_images.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#616161",
                      mb: 1,
                      display: "block",
                      fontWeight: 600,
                    }}
                  >
                    Receipts/Images
                  </Typography>
                  <Grid container spacing={2}>
                    {expensesDetails.expenses_images.map((image) => (
                      <Grid item xs={12} sm={6} key={image.id}>
                        <Paper
                          elevation={4}
                          sx={{
                            position: "relative",
                            paddingTop: "56.25%",
                            borderRadius: "10px",
                            overflow: "hidden",
                            "&:hover": {
                              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                            },
                          }}
                        >
                          <Image
                            src={`https://sorciproptrack.com/MaintenanceImages/${image.image_path}`}
                            alt="Expense receipt"
                            width={300}
                            height={300}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
          </Box>
        )}
      </DialogContent>

      {/* 🔹 Action Buttons */}
      <DialogActions sx={{ background: "#f4f7fc", p: 2 }}>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            backgroundColor: "#6C63FF",
            "&:hover": { backgroundColor: "#5C6BC0" },
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
