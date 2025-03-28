"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
  IconButton,
  Alert,
  Stack,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  Checkbox,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { styled, css } from "@mui/material/styles";
import { Modal as BaseModal } from "@mui/base/Modal";
import dayjs from "dayjs";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Image from "next/image";
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

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  300: "#B0B8C4",
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
  background-color: rgba(0, 0, 0, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
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
    border-radius: 18px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};
    width: 100%;
    max-width: 5000px;
    max-height: 90vh; /* Ensures it does not overflow vertically */
    overflow-y: auto; /* Adds scrolling if content is too large */

    @media (min-width: 600px) {
      width: 400px;
      padding: 20px; /* Adjust padding for larger screens */
    }

    @media (max-width: 600px) {
      width: 95%; /* Adjusts the width for mobile screens */
      padding: 16px; /* Reduce padding for smaller screens */
    }
  `
);
// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 830,
  margin: "0 auto",
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

// checkbox style
const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: "#f5f8fa",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#ebf1f5",
    ...theme.applyStyles("dark", {
      backgroundColor: "#30404d",
    }),
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "rgba(206,217,224,.5)",
    ...theme.applyStyles("dark", {
      background: "rgba(57,75,89,.5)",
    }),
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 0 1px rgb(16 22 26 / 40%)",
    backgroundColor: "#394b59",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))",
  }),
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#137cbd",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

const ISSUE_CATEGORIES = {
  "Plumbing Issues": [
    "Leaking pipes",
    "Clogged drains",
    "Clogged toilet",
    "Low water pressure",
    "Broken or malfunctioning faucets",
    //   'Water heater issues'
  ],
  "Electrical Issues": [
    "Power outages or tripped circuit breakers",
    "Faulty wiring or exposed wires",
    "Malfunctioning electrical outlets or switches",
    "Flickering lights",
    "Broken light fixtures",
    "Burnt-out light bulb",
  ],
  // 'HVAC Issues': [
  //   'Air conditioning not working',
  //   'Heater not working',
  //   'Uneven heating or cooling in rooms',
  //   'Air filter replacement',
  // ],
  "Structural Issues": [
    "Cracked or damaged walls",
    "Roof leaks",
    "Broken windows or doors",
    "Water damage or mold",
    "Damaged flooring",
  ],
  "Water Supply Issues": [
    "Water leaks in walls or ceilings",
    "Water discoloration",
    "Overflowing toilets or drains",
    "Malfunctioning water meter",
  ],
  // 'Internet and Cable Issues': [
  //   'Slow or no internet connection',
  //   'Damaged cables or modem'
  // ]
};

const fetcher = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const fetcherUnitInfo = async ([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json();
};

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable
const API_URL_IMG = process.env.NEXT_PUBLIC_API_URL_IMG;

export default function RequestMaintenanceForm({
  setLoading,
  loading,
  setError,
  setSuccessful,
  open,
  handleClose,
  handleOpen,
  editId,
  setEditId,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [deleteImage, setDeleteImage] = useState([]);
  const [specificIssues, setSpecificIssues] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);
  const [unitInformation, setUnitInformation] = useState([]);
  const [selectedItem, setSelectedItem] = useState(""); // Now only storing single item
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    tenant_id: parseInt(userId),
    // unit_type: "",
    otherissues: "",
    item_name: "",
    issue_description: "",
    date_reported: null,
    status: "Pending",
    urgency: "",
  });

  console.log(editId);
  console.log(parseInt(userId));
  console.log(formData);
  console.log(selectedItem);
  console.log(selectedImage);
  console.log("unitInfo;", unitInformation);
  console.log("inclusions:", unitInformation?.rented_unit?.inclusions);
  console.log(deleteImage);
  console.log(loading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      tenant_id: parseInt(userId) || "",
      // unit_type: unitInformation?.rented_unit_type || "",
      otherissues: "",
      item_name: "",
      issue_description: "",
      issue_category: "",
      specific_issue: "",
      date_reported: dayjs().format("MM/DD/YYYY"),
      status: "Pending",
      is_schedule: false,
    });
    setSelectedImage([]); // Correctly reset to empty array
    setSelectedItem(""); // Clear all errors
    setDeleteImage([]); // Reset delete image array
  };

  useEffect(() => {
    const userDataString = localStorage.getItem("userDetails");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserId(userData?.user?.id || null);
      setAccessToken(userData?.accessToken || null);
    }
  }, []);

  const {
    data: responseUnitinfo,
    error: errorUnitInfo,
    isLoading: isLoadingUnitInfo,
  } = useSWR(
    accessToken && userId
      ? [`${API_URL}/tenant_unit_info/${userId}`, accessToken]
      : null,
    fetcherUnitInfo,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  );

  useEffect(() => {
    if (responseUnitinfo) {
      setUnitInformation(responseUnitinfo?.data || "");
      setLoading(false);
    } else if (isLoadingUnitInfo) {
      setLoading(true);
    }
  }, [responseUnitinfo, isLoadingUnitInfo, setLoading]);

  const {
    data: responseEdit,
    error: editError,
    isLoading: isLoadingEdit,
  } = useSWR(
    accessToken && editId
      ? [`${API_URL}/edit_request/${editId}`, accessToken]
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
  console.log(responseEdit);
  useEffect(() => {
    if (responseEdit) {
      const data = responseEdit?.data || "";
      if (data) {
        setFormData({
          tenant_id: data.tenant_id || "",
          otherissues: data.other_issue || "",
          item_name: data.reported_issue || "others", // Ensure this is set correctly
          issue_description: data.issue_description || "",
          status: data.status || "pending", // Default to pending if not set
          date_reported: dayjs(data.date_reported),
        });
        setSelectedItem(data.reported_issue || "others"); // Set selected item
      }
      if (data?.maintenance_images) {
        // Create preview URLs for existing images
        const imagesWithPreview = data.maintenance_images.map((image) => ({
          id: image.id,
          maintenance_id: image.maintenance_id,
          expenses_id: image.expenses_id,
          image_path: image.image_path,
          preview: `${API_URL_IMG}/MaintenanceImages/${image.image_path}`, // Create a preview URL
        }));

        setSelectedImage(imagesWithPreview);
      }
    }
  }, [responseEdit]);

  console.log(formData);
  console.log(editId);
  // {
  //   tenant_id: 10,
  //   otherissues: '',
  //   item_name: '',
  //   issue_description: '',
  //   date_reported: '12/17/2024',
  //   status: 'Pending',
  //   unit_type: 'Boarding House'
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (accessToken) {
      try {
        let hasErrors = false;
        let newErrors = {};

        // Validation checks
        if (!formData.tenant_id) {
          hasErrors = true;
          newErrors.tenant_id = "Tenant is required!";
        }
        if (!formData.item_name) {
          hasErrors = true;
          newErrors.item_name = "Item is required!";
        }
        if (formData.item_name === "others" && !formData.otherissues) {
          hasErrors = true;
          newErrors.otherissues = "Other issues description is required!";
        }
        if (!formData.urgency) {
          hasErrors = true;
          newErrors.urgency = "Urgency level is required!";
        }
        if (!formData.issue_description) {
          hasErrors = true;
          newErrors.issue_description = "Issue Description is required!";
        }
        if (!selectedImage || selectedImage.length === 0) {
          hasErrors = true;
          newErrors.images = "At least one image is required";
        }

        if (hasErrors) {
          setErrors(newErrors);
          setLoading(false);
          return;
        }

        console.log(formData);
        const formDataToSubmit = new FormData();
        formDataToSubmit.append("tenant_id", formData.tenant_id || "");
        formDataToSubmit.append(
          "reported_issue",
          formData.item_name === "others" ? "" : formData.item_name || ""
        );
        formDataToSubmit.append("otherissues", formData.otherissues || "");
        formDataToSubmit.append(
          "issue_description",
          formData.issue_description || ""
        );
        formDataToSubmit.append(
          "date_reported",
          dayjs(formData.date_reported).format("MM/DD/YYYY")
        );
        formDataToSubmit.append("status", "Pending");
        formDataToSubmit.append("urgency", formData.urgency);
        formDataToSubmit.append(
          "unitName",
          unitInformation.rented_unit.boarding_house_name ||
            unitInformation.rented_unit.apartment_name ||
            ""
        ); //for notication unit name purpose

        if (selectedImage && selectedImage.length > 0) {
          selectedImage.forEach((image, index) => {
            if (image.file) {
              formDataToSubmit.append(`images[${index}]`, image.file);
            }
          });
        }
        if (deleteImage && deleteImage.length > 0) {
          deleteImage.forEach((imageId, index) => {
            formDataToSubmit.append(`remove_images[${index}]`, imageId);
          });
        }

        if (editId) {
          formDataToSubmit.append("_method", "PUT");
        }
        setLoading(true);
        const endPoint = editId
          ? `${API_URL}/update_request/${editId}`
          : `${API_URL}/requestmaintenance`;

        const response = await fetch(endPoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          body: formDataToSubmit,
        });
        //`http://127.0.0.1:8000/api/requestmaintenance`
        const data = await response.json();
        if (response.ok) {
          resetForm(); // Reset the form after successful submission
          enqueueSnackbar(data.message, { variant: "success" });
          setLoading(false);
          handleClose();
          setEditId(null);
        } else {
          setLoading(false);
          enqueueSnackbar(data.message, { variant: "error" });
          console.log(data.message); // for duplicate entry
          console.log(data.error);
          setEditId(null);
        }
      } catch (error) {
        setLoading(false);
        setError(
          "Failed to submit maintenance request. Please try again.",
          error
        );
      }
    } else {
      setError("You must be logged in to submit a maintenance request.");
    }
  };

  // this code for automatic date generator
  useEffect(() => {
    const currentDate = dayjs().format("MM/DD/YYYY");
    setFormData((prevFormData) => ({
      ...prevFormData,
      date_reported: currentDate,
    }));
  }, []);

  useEffect(() => {
    if (unitInformation) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        tenant_id: unitInformation.tenant_id,
        unit_type: unitInformation.rented_unit_type,
      }));
    }
  }, [unitInformation]);

  const handleInclusionChange = (itemName) => {
    setSelectedItem(itemName); // Update the selected item
    if (itemName !== "others") {
      setFormData((prev) => ({
        ...prev,
        item_name: itemName, // Store the selected item name
        otherissues: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        item_name: itemName, // Store the selected item name
      }));
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      item_name: "", // Clear the error message for item_name
    }));
    setSpecificIssues([]); // Clear any specific issues if applicable
  };

  // const handleCategoryChange = (category) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     issue_category: category,
  //     specific_issue: '' // Reset specific issue
  //   }));

  //   // Update specific issues
  //   setSpecificIssues(ISSUE_CATEGORIES[category] || []);
  // };

  // Helper function to generate numbered items based on quantity
  const generateNumberedItems = (inclusion) => {
    const items = [];
    for (let i = 1; i <= inclusion.quantity; i++) {
      items.push({
        key: `${inclusion.equipment.name}-${i}`,
        label: `${inclusion.equipment.name} ${i}`,
        name: `${inclusion.equipment.name} ${i}`,
      });
    }
    return items;
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      // Create preview URLs for new files
      const newPreviews = filesArray.map((file) => ({
        file: file,
        name: file.name,
        preview: URL.createObjectURL(file),
      }));
      setSelectedImage((prevImages) => {
        // Ensure prevImages is always an array using nullish coalescing
        // const currentImages = prevImages ?? [];
        const currentImages = Array.isArray(prevImages) ? prevImages : [];
        return [...currentImages, ...newPreviews];
      });
      // setSelectedImage((prevImages) => [...prevImages, ...filesArray]);
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      images: "",
    }));
  };

  const handleRemoveImage = (index) => {
    const removedImageId = selectedImage[index]?.id;
    if (removedImageId) {
      setDeleteImage((prev) => [...prev, removedImageId]);
    }
    setSelectedImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ display: "flex", justifySelf: "end", mt: 1.5 }}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          background: "#673ab7",
          "&:hover": { backgroundColor: "#7e57c2" },
          borderRadius: "15px",
          p: 1.1,
          mb: 2,
        }}
      >
        <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
        Add Maintenance Request
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={() => {
          if (false) return;
          handleClose();
          setErrors({});
          setSelectedItem([]);
          setSelectedImage([]);
          setEditId(null);
          resetForm();
        }}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            overflowY: "auto",
            maxHeight: "80vh", // Max height for mobile
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="h1"
            letterSpacing={3}
            sx={{ fontSize: "20px", mt: 0.2 }}
          >
            {editId ? "Edit Request Maintenance" : "Add Request Maintenance"}
          </Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            overflow: "auto", // Allow scrolling for the content
            scrollbarWidth: "none", // Hide scrollbar in Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Hide scrollbar in Chrome/Safari
            },
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Unit Type Section */}

            {/* Inclusions Section */}
            {unitInformation?.rented_unit?.inclusions && (
              <Box sx={{ mb: 3 }}>
                {/* <TextField
                  labelId="unit-type-label"
                  name="unit_type"
                  value={formData.unit_type}
                  label="Unit Type"
                  onChange={handleChange}
                  required
                  fullWidth
                  error={Boolean(errors.unit_type)}
                  aria-readonly
                  InputProps={{
                    readOnly: true
                  }}
                  sx={{mt:3}}
                  /> */}
                <Box>
                  {errors.tenant_id && (
                    <FormHelperText error sx={{ fontSize: "13px" }}>
                      {errors.tenant_id}
                    </FormHelperText>
                  )}
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "#666",
                    mb: 2,
                    mt: 1,
                  }}
                >
                  <InfoOutlinedIcon sx={{ mr: 1, color: "primary.main" }} />
                  Select Items Needing Maintenance
                </Typography>
                <FormControl fullWidth error={Boolean(errors.item_name)}>
                  <InputLabel id="select-item-label">Select Item</InputLabel>
                  <Select
                    labelId="select-item-label"
                    id="select-item"
                    label="Select Item"
                    value={selectedItem} // The selected value
                    onChange={(e) => handleInclusionChange(e.target.value)}
                    sx={{
                      "&:focus": { borderColor: "primary.main" },
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select an item</em>
                    </MenuItem>
                    {unitInformation.rented_unit.inclusions.map((inclusion) => {
                      const numberedItems = generateNumberedItems(inclusion);

                      return numberedItems.map((item) => (
                        <MenuItem key={item.key} value={item.name}>
                          {item.label}
                        </MenuItem>
                      ));
                    })}
                    <MenuItem value="others">others</MenuItem>
                  </Select>
                  {errors.item_name && (
                    <FormHelperText error sx={{ fontSize: "13px" }}>
                      {errors.item_name}
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            )}
            {/* Other Issues TextField */}
            {formData?.item_name === "others" && (
              <>
                <TextField
                  label="Other Issues"
                  placeholder="specify the other issue"
                  variant="outlined"
                  name="otherissues"
                  value={formData.otherissues || ""}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(errors.otherissues)}
                  helperText={errors.otherissues}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                    },
                  }}
                />
                <FormHelperText sx={{ fontSize: "14px", mt: 0.4, mb: 3 }}>
                  ex: switch, plumbing etc.
                </FormHelperText>
              </>
            )}

            {/* urgency */}
            <FormControl
              fullWidth
              error={Boolean(errors.urgency)}
              sx={{ mt: 2, mb: 2 }}
            >
              <InputLabel>Select urgency</InputLabel>
              <Select
                labelId="select urgency"
                id="urgency"
                label="Select urgency"
                value={formData.urgency} // The selected value
                onChange={handleChange}
                name="urgency"
                sx={{
                  "&:focus": { borderColor: "primary.main" },
                }}
              >
                <MenuItem disabled value="">
                  <em>Select an urgency level</em>
                </MenuItem>
                <MenuItem value="Low">
                  <div>
                    <strong style={{ color: "#4caf50" }}>Low</strong>
                    <p
                      style={{
                        fontSize: "0.85em",
                        color: "#757575",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <InfoOutlinedIcon sx={{ mr: 1, color: "#757575" }} />{" "}
                      Non-critical issues that can be addressed within 48-72
                      hours.
                    </p>
                  </div>
                </MenuItem>
                <MenuItem value="Medium">
                  <div>
                    <strong style={{ color: "#fdd835" }}>Medium</strong>
                    <p
                      style={{
                        fontSize: "0.85em",
                        color: "#757575",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <InfoOutlinedIcon sx={{ mr: 1, color: "#757575" }} />{" "}
                      Important issues that need attention within 24 hours.
                    </p>
                  </div>
                </MenuItem>
                <MenuItem value="High">
                  <div>
                    <strong style={{ color: "#f44336" }}>High</strong>
                    <p
                      style={{
                        fontSize: "0.85em",
                        color: "#757575",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <InfoOutlinedIcon sx={{ mr: 1, color: "#757575" }} />{" "}
                      Critical issues requiring immediate attention. Response
                      expected within 2-4 hours.
                    </p>
                  </div>
                </MenuItem>
              </Select>
              {errors.urgency && (
                <FormHelperText error sx={{ fontSize: "13px" }}>
                  {errors.urgency}
                </FormHelperText>
              )}
            </FormControl>

            {/* Issue Description */}
            <TextField
              name="issue_description"
              label="Issue Description"
              multiline
              rows={4}
              value={formData.issue_description || ""}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ maxLength: 1000 }}
              placeholder="Please describe the maintenance issue..."
              error={Boolean(errors.issue_description)}
              helperText={errors.issue_description}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                },
              }}
            />

            {/* Image Upload Section */}
            <Box
              sx={{
                border: `2px dashed ${errors.images ? "#d32f2f" : "#ccc"}`,
                borderRadius: "12px",
                padding: "2rem",
                textAlign: "center",
                backgroundColor: "white",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  mb: 2,
                }}
              >
                <InfoOutlinedIcon sx={{ mr: 1, color: "primary.main" }} />
                Select or Upload Image as Evidence
              </Typography>

              {selectedImage && selectedImage.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "center",
                  }}
                >
                  {selectedImage.map((image, index) => (
                    <Box
                      key={image.id || index}
                      sx={{
                        position: "relative",
                        width: 120,
                        height: 120,
                      }}
                    >
                      <Image
                        src={
                          image.preview ||
                          `${API_URL_IMG}/MaintenanceImages/${image.path}`
                        }
                        alt={image.name}
                        width={500}
                        height={300}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          backgroundColor: "white",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          "&:hover": { backgroundColor: "white" },
                        }}
                      >
                        <HighlightOffOutlinedIcon color="error" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: "#999", mb: 2 }}>
                  Drag and drop images or click to upload
                </Typography>
              )}

              <IconButton
                component="label"
                sx={{
                  mt: 2,
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                <CloudUploadOutlinedIcon />
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  name="image"
                  hidden
                  multiple
                  onChange={handleImageChange}
                />
              </IconButton>
              {errors.images && (
                <FormHelperText
                  error
                  sx={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 1,
                  }}
                >
                  {errors.images}
                </FormHelperText>
              )}
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.1,
                textTransform: "none",
                fontSize: "1.1rem",
              }}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </Button>

            <Button
              variant="outlined"
              disabled={loading}
              sx={{
                fontSize: "1.1rem", // Adjust font size for smaller size
                borderRadius: "8px", // Optional: make corners slightly rounder
                py: 1, // Adjust padding for smaller size
                color: "#000",
                width: "100%",
                mt: 1,
                borderColor: "#000",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  borderColor: "#000",
                },
              }}
              onClick={() => {
                handleClose();
                setErrors({});
                setSelectedItem([]);
                setSelectedImage([]);
                setEditId(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
