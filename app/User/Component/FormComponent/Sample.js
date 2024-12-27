"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Fade,
  TextField,
  CircularProgress,
  Autocomplete,
  Select,
  MenuItem,
  Menu,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PropTypes from "prop-types";
import { styled, css } from "@mui/system";
import { useSnackbar } from "notistack";
import useSWR from "swr";

const Backdrop = React.forwardRef((props, ref) => {
  const { open, ...other } = props;
  return (
    <Fade in={open}>
      <div ref={ref} {...other} />
    </Fade>
  );
});
Backdrop.displayName = "Backdrop";
// Backdrop.propTypes = {
//   open: PropTypes.bool,
// };

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

const TriggerButton = styled(Button)(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? blue[300] : blue[200]};
      outline: none;
    }
  `
);

const fetcher = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to Fetch Equipment");
  }
  return response.json();
};
export default function Sample({
  open,
  handleOpen,
  handleClose,
  setLoading,
  loading,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [equipment, setEquipment] = useState({
    name: "",
    category: "",
    location: "",
    issues: [],
  });

  const [categories] = useState([
    { id: 1, name: "Electrical" },
    { id: 2, name: "Plumbing" },
    { id: 3, name: "HVAC" },
    { id: 4, name: "Appliances" },
  ]);

  const [issueTemplates] = useState({
    Electrical: ["Faulty Outlet", "Lighting Problem", "Wiring Issue"],
    Plumbing: ["Leaky Pipe", "Clogged Drain", "Water Pressure"],
    HVAC: ["No Cooling", "No Heating", "Strange Noise"],
    Appliances: ["Not Working", "Inefficient", "Unusual Sound"],
  });

  const [selectedCategories, setSelectedCategories] = useState([""]);

  const handleCategoryChange = (index, value) => {
    if (selectedCategories.includes(value)) {
        prompt('Enter a new issue type:');
        return; // Prevent duplicate selection
    }

    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = value;
    setSelectedCategories(newSelectedCategories);

    // Ensure equipment.issues is always an array
    const newIssues = Array.isArray(equipment.issues)
      ? [...equipment.issues]
      : [];
    if (!newIssues[index]) {
      newIssues[index] = { type: [], category: value }; // Initialize issues for this category
    }
    setEquipment((prev) => ({ ...prev, issues: newIssues }));
  };

  const handleAddCategory = () => {
    setSelectedCategories((prev) => [...prev, '']);
    // setSelectedCategories((prev) => [...prev, categories[0].name]); // Default to the first category
  };

  const handleRemoveCategory = (index) => {
    // Prevent removal of the default category (index 0)
    if (index === 0) return;
    const newSelectedCategories = selectedCategories.filter(
      (_, i) => i !== index
    );
    setSelectedCategories(newSelectedCategories);

    const newIssues = equipment.issues.filter((_, i) => i !== index);
    setEquipment((prev) => ({ ...prev, issues: newIssues }));
  };

  const handleIssueChange = (index, newIssues) => {
    const updatedIssues = [...equipment.issues];
    updatedIssues[index] = { ...updatedIssues[index], type: newIssues };
    setEquipment((prev) => ({ ...prev, issues: updatedIssues }));
  };

//   const handleAddIssue = (categoryIndex) => {
//     const newIssues = [...equipment.issues];
//     newIssues[categoryIndex] = {
//       type: [],
//       category: selectedCategories[categoryIndex],
//     };
//     setEquipment((prev) => ({ ...prev, issues: newIssues }));
//   };

//   const handleRemoveIssue = (categoryIndex, issueIndex) => {
//     const updatedIssues = [...equipment.issues];
//     updatedIssues[categoryIndex].type.splice(issueIndex, 1); // Remove issue from the category
//     setEquipment((prev) => ({ ...prev, issues: updatedIssues }));
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData.accessToken;

    if (accessToken) {
      try {
        let hasErrors = false;
        let newErrors = {};

        if (!equipment.name) {
          hasErrors = true;
          newErrors.name = "Name of equipment is required";
        } else if (equipment.name.length < 2) {
          hasErrors = true;
          newErrors.name =
            "Name of equipment must be at least 2 characters long";
        }

        if (hasErrors) {
          setLoading(false);
          return;
        }

        const method = "POST";
        const endpoint = "http://127.0.0.1:8000/api/store_inclusion";

        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          body: JSON.stringify(equipment),
        });

        const data = await response.json();

        if (response.ok) {
          enqueueSnackbar(data.message, { variant: "success" });
          handleClose();
        } else {
          enqueueSnackbar(data.message, { variant: "error" });
        }
      } catch (error) {
        console.error("Error to Submit", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ borderRadius: "10px", p: 1.1, mb: 2 }}
      >
        <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
        Add New Equipment
      </Button>
      <Modal
        aria-labelledby="equipment-maintenance-modal"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              width: "95%",
              maxWidth: "800px",
              maxHeight: "90vh",
              backgroundColor: "background.paper",
              borderRadius: "16px",
              boxShadow: 24,
              p: 4,
              overflow: "auto",
              position: "relative",
            }}
          >
            <Typography
              variant="h5"
              component="h5"
              sx={{
                mb: 3,
                fontWeight: 550,
                color: "#263238",
                textAlign: "start",
                letterSpacing: 1,
              }}
            >
              Add New Equipment
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              {/* Equipment Name Input */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  Equipment Details:
                </Typography>
                <TextField
                  fullWidth
                  label="Equipment Name"
                  variant="outlined"
                  value={equipment.name}
                  onChange={(e) =>
                    setEquipment((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Box>

              {/* Category and Issues Sections */}
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  mt: 5,
                  fontWeight: 600,
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <AssessmentOutlinedIcon sx={{ mr: 1, color: "primary.main" }} />
                Maintenance category section for{" "}
                <span style={{ color: "#263238", marginLeft: "6px" }}>
                  {equipment?.name}
                </span>
              </Typography>
              {selectedCategories.map((category, categoryIndex) => (
                <Box key={categoryIndex} sx={{ mb: 4 }}>
                  {/* Category Selection */}
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4} sx={{mt:1}}>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, marginBottom: "8px", fontSize:'16px' }}
                        >
                            Select Category Issue:
                        </Typography>
                        <Select
                          fullWidth
                          //   label="Select Category"
                          value={category}
                          onChange={(e) =>
                            handleCategoryChange(categoryIndex, e.target.value)
                          }
                          displayEmpty
                          required
                          sx={{
                            borderRadius: "8px",
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Category
                          </MenuItem>
                          {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{mt:{xs:"none", sm:4.2}}}>
                        {/* <Typography 
                            variant="subtitle1" 
                            sx={{ 
                                mb: 1, 
                                fontWeight: 600,
                                color: 'text.secondary'
                            }}
                            >
                            Identify Issues for {category}
                            </Typography> */}
                        <Autocomplete
                          multiple
                          fullWidth
                          value={equipment.issues[categoryIndex]?.type || []}
                          onChange={(e, newValue) =>
                            handleIssueChange(categoryIndex, newValue)
                          }
                          options={issueTemplates[category] || []}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Issue Types"
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                },
                              }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={1} sx={{mt:4.2}}>
                        <IconButton
                          onClick={handleAddCategory}
                          sx={{
                            backgroundColor: "#d1c4e9",
                            color: "#5e35b1",
                            "&:hover": {
                              backgroundColor: "primary.main",
                              color: "white",
                            },
                          }}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Grid>
                      <Grid item xs={1} sx={{mt:4.2}}>
                        <IconButton
                          onClick={() => handleRemoveCategory(categoryIndex)}
                          sx={{
                            backgroundColor: "#ffcdd2",
                            color: "#d32f2f",
                            "&:hover": {
                              backgroundColor: "error.main",
                              color: "white",
                            },
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Issues Selection */}

                  <Divider sx={{ my: 3, borderColor: "divider" }} />
                </Box>
              ))}

              {/* Submit Button */}
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    borderRadius: "12px",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  Save Equipment
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    fontSize: "16px",
                    marginTop: "10px",
                    borderRadius: "10px",
                    padding: "10px",
                    color: "#000",
                    borderColor: "#000",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      borderColor: "#000",
                    },
                  }}
                  onClick={() => {
                    handleClose();
                    // setAddEquipment({});
                    // setEditItem(null);
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
