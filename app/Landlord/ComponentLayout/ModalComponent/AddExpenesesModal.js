"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
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
  FormHelperText,
  Autocomplete,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
  FormControlLabel,
  CircularProgress 
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Modal as BaseModal } from "@mui/base/Modal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RepeatIcon from "@mui/icons-material/Repeat";
import { styled, css, getValue } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
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
    border-radius: 12px;
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

const fetcher = async([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
  if(!response.ok){
    throw new Error(response.statusText)
  }
  return response.json()
}

const fetcherUnitList = async([url, token]) => {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  })
  if(!response.ok){
    throw new Error(response.statusText)
  }
  return response.json();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

export default function AddExpensesTransaction({
  open,
  handleOpen,
  handleClose,
  setLoading,
  loading,
  editItemId,
  onRefresh 
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [formError, setFormError] = useState({});
  const [selectedImage, setSelectedImage] = useState([]);
  const [deleteImage, setDeleteImage] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [expensesCategory, setExpensesCategory] = useState([]);
  const [formData, setFormData] = useState({
    unitId: "",
    type: "",
    amount: "",
    description: "",
    category: "",
    frequency: "",
    type_of_bills: "",
    startDate: null,
    endDate: null,
    includeWeekends: true,
  });

  const [manualData, setManualData] = useState({
    unitId: "",
    type: "",
    amount: "",
    category: "",
    type_of_bills: "",
    description: "",
    expenseDate: null,
  });

  console.log("tenant:", unitList);
  console.log(expensesCategory);
  console.log(formData);
  console.log(manualData);
  console.log(editItemId);
  console.log(selectedImage)

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    // Validation logic based on selected category
    if (expensesCategory === "recurring") {
      if (!formData.description) {
        tempErrors.description = "Description is required";
        isValid = false;
      }
      if (!formData.amount) {
        tempErrors.amount = "Amount is required";
        isValid = false;
      }
      if (!formData.startDate) {
        tempErrors.startDate = "Start date is required";
        isValid = false;
      }
      if (!formData.endDate) {
        tempErrors.endDate = "End date is required";
        isValid = false;

      } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        tempErrors.endDate = "End date must be after start date";
        isValid = false;

      }
      if (!formData.category) {
        tempErrors.category = "Transaction type is required";
        isValid = false;
      }
      if (!formData.frequency) {
        tempErrors.frequency = "Frequency type is required";
        isValid = false;
      }
      if (!formData.unitId) {
        tempErrors.unitId = "Unit type is required";
        isValid = false;
      }
      if (formData.category === "utility bill" && !formData.type_of_bills) {
        tempErrors.type_of_bills = "Type of bill is required";
        isValid = false;
      }
    }

    if (expensesCategory === "manual") {
      if (!manualData.description) {
        tempErrors.description = "Description is required";
        isValid = false;
      }
      if (!manualData.amount) {
        tempErrors.amount = "Amount is required";
        isValid = false;
      }
      if (!manualData.category) {
        tempErrors.category = "Transaction type is required";
        isValid = false;
      }
      if (!manualData.unitId) {
        tempErrors.unitId = "Unit type is required";
        isValid = false;
      }
      if (!manualData.expenseDate) {
        tempErrors.expenseDate = "Expense date is required";
        isValid = false;
      }
      if (manualData.category === "utility bill" && !manualData.type_of_bills) {
        tempErrors.type_of_bills = "Type of bill is required";
        isValid = false;
      }
    }

    setFormError(tempErrors);
    return isValid;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formError[name]) {
      setFormError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleManualChange = (event) => {
    const { name, value } = event.target;
    setManualData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formError[name]) {
      setFormError((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleExpenseTypeChange = (event, newExpenseType) => {
    if (newExpenseType !== null) {
      setExpensesCategory(newExpenseType);
      setFormError({});
    }
  };

  const getUserToken = () => {
    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;
    return accessToken;
  }

  const token = getUserToken();
  const {data:response, error} = useSWR(
    token && editItemId ? [`${API_URL}/edit/${editItemId}`, token] : null,
    fetcher, {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  )
  console.log(error)
  console.log(response?.data);
  useEffect(() => {
    if (response?.data) {
      const value = response?.data || '';
      setManualData({
        unitId: value?.unit_id,
        type: value?.unit_type,
        amount: value?.amount,
        category: value?.category,
        type_of_bills: value?.type_of_bills,
        description: value?.description,
        expenseDate: dayjs(value?.expense_date),
      })
      if (value?.expenses_images) {
        const existingImages = value.expenses_images.map((img) => ({
          id: img.id,
          path: img.image_path,
          preview: `https://sorciproptrack.com/MaintenanceImages/${img.image_path}`, // Adjust URL as needed
        }));
        setSelectedImage(existingImages);
      }
      setExpensesCategory(value.recurring === 1 ? 'recurring' : 'manual');
    }
  }, [response])

  const {data: unitResponse, error: unitError} = useSWR(
    token && [ `${API_URL}/get_all_property`, token] || null, 
    fetcherUnitList, {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  )
  console.log(unitError);
  useEffect(() => {
    if (unitResponse?.data) {
      const value = unitResponse?.data || '';
      setUnitList(value);
    }
  }, [unitResponse])
 


  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; 
    }

    setLoading(true);

    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData.accessToken;

    if (!accessToken) {
      console.log("No token Available");
      setLoading(false);
      return;
    }

    try {
      let endpoint, formValue, contentType;

      if (expensesCategory === "recurring") {
        // For recurring expenses
        formValue = JSON.stringify({
          unitId: formData.unitId,
          type: formData.type,
          category: formData.category,
          type_of_bills: formData.type_of_bills,
          amount: formData.amount,
          description: formData.description,
          frequency: formData.frequency,
          includeWeekends: formData.includeWeekends,
          startDate: dayjs(formData.startDate).format("MM/DD/YYYY"),
          endDate: dayjs(formData.endDate).format("MM/DD/YYYY"),
        });

        endpoint = `${API_URL}/generate_recurring_expenses`;
        contentType = "application/json";
      } else if (expensesCategory === "manual") {
        // For manual expenses
        const formatData = new FormData();
        formatData.append("unitId", manualData.unitId);
        formatData.append("type", manualData.type);
        formatData.append("category", manualData.category);
        formatData.append("type_of_bills", manualData.type_of_bills);
        formatData.append("amount", manualData.amount);
        formatData.append("description", manualData.description);
        formatData.append(
          "expenseDate",
          dayjs(manualData.expenseDate).format("MM/DD/YYYY")
        );

        if (selectedImage && selectedImage.length > 0) {
          selectedImage.forEach((image, index) => {
            if (image.file) {
              formatData.append(`images[${index}]`, image.file);
            }
          });
        }

        if (editItemId) {
          formatData.append("_method", "PUT");
        }
        formValue = formatData;
        endpoint = editItemId 
        ? `${API_URL}/update_expenses/${editItemId}`
        : `${API_URL}/store_expenses`;
        contentType = "multipart/form-data";
      }

      // // Ensure unitId is not empty
      // if (!formValue.get("unitId") && !JSON.parse(formValue).unitId) {
      //   setError("Unit ID is required");
      //   setLoading(false);
      //   return;
      // }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      };

      // Only set Content-Type if it's JSON
      if (contentType === "application/json") {
        headers["Content-Type"] = "application/json";
      }

      // const method = editItemId ? 'PUT' : 'POST';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: formValue,
      });

      const data = await response.json();

      if (response.ok) {
        enqueueSnackbar(data.message, {variant: 'success'}) 
        handleClose();
        onRefresh(); 
        setLoading(false);
        setSelectedImage([]);
        if (expensesCategory === "recurring") {
          setFormData({
            unitId: "",
            type: "",
            amount: "",
            category: "",
            type_of_bills: "",
            description: "",
            startDate: null,
            endDate: null,
            frequency: "",
            includeWeekends: false,
          });
          
        } else {
          setManualData({
            unitId: "",
            type: "",
            amount: "",
            category: "",
            type_of_bills: "",
            description: "",
            expenseDate: null,
          });
        }

        // handleClose();
      } else {
        enqueueSnackbar(data.message, {variant: 'error'}) 
        console.log(data.error)
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setLoading(false);
    }
  };




  const handleCheckBoxChange = () => {
    setFormData((prev) => ({
      ...prev,
      includeWeekends: false,
    }));
  };

  // Helper function to create unique IDs for units
  const createUniqueId = (unit, type) => `${type}-${unit.id}`;

  // Helper function to parse unique ID back to original values
  const parseUniqueId = (uniqueId) => {
    if (!uniqueId) return { type: null, originalId: null };
    const [type, id] = uniqueId.split("-");
    return { type, originalId: parseInt(id) };
  };

  // Transform the options to include unique IDs
  const options = unitList.flatMap((property) => [
    // Map apartments
    ...property.apartments.map((apartment) => ({
      uniqueId: createUniqueId(apartment, "apartment"),
      id: apartment.id,
      label: `${apartment.apartment_name} (${property.propertyname})`,
      propertyId: property.id,
      property_type: "Apartment",
      name: apartment.apartment_name,
      ...apartment,
    })),
    // Map boarding houses
    ...property.boarding_houses.map((boardingHouse) => ({
      uniqueId: createUniqueId(boardingHouse, "boarding"),
      id: boardingHouse.id,
      label: `${boardingHouse.boarding_house_name} (${property.propertyname})`,
      propertyId: property.id,
      property_type: "Boarding House",
      name: boardingHouse.boarding_house_name,
      ...boardingHouse,
    })),
  ]);

  const handleUnit = (selectedUnit) => {
    if (selectedUnit) {
      setFormData((prev) => ({
        ...prev,
        unitId: selectedUnit.id,
        type: selectedUnit.property_type,
        propertyId: selectedUnit.propertyId,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        unitId: "",
        type: "",
        propertyId: "",
      }));
    }

    setFormError((prev) => ({
      ...prev,
      unitId: "",
    }));
  };

  // Find current value using uniqueId for maintenance feee
  const currentValue =
    options.find(
      (option) =>
        option.id === formData.unitId && option.property_type === formData.type
    ) || null;

  //for munual data
  const handleManualUnit = (selectedUnit) => {
    if (selectedUnit) {
      setManualData((prev) => ({
        ...prev,
        unitId: selectedUnit.id,
        type: selectedUnit.property_type,
        propertyId: selectedUnit.propertyId,
      }));
    } else {
      setManualData((prev) => ({
        ...prev,
        unitId: "",
        type: "",
        propertyId: "",
      }));
    }

    setFormError((prev) => ({
      ...prev,
      unitId: "",
    }));
  };

  const manualCurrentValue =
    options.find(
      (option) =>
        option.id === manualData.unitId &&
        option.property_type === manualData.type
    ) || null;

  const handleDateChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear date error when user selects a date
    if (name === "startDate" && formError.startDate) {
      setFormError((prev) => ({
        ...prev,
        startDate: "",
      }));
    }
    if (name === "endDate" && formError.endDate) {
      setFormError((prev) => ({
        ...prev,
        endDate: "",
      }));
    }
  };

  const handleDateChangeManual = (name, value) => {
    setManualData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "expenseDate" && manualData.expenseDate) {
      setFormError((prev) => ({
        ...prev,
        dateExpense: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    console.log("Event target files:", e.target.files);

    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      console.log("Files array:", filesArray);

      const newPreviews = filesArray.map((file) => {
        console.log("Processing file:", file);
        return {
          file: file,
          name: file.name,
          preview: URL.createObjectURL(file),
        };
      });

      console.log("New previews:", newPreviews);

      setSelectedImage((prevImages) => {
        const currentImages = Array.isArray(prevImages) ? prevImages : [];
        return [...currentImages, ...newPreviews];
      });
    }
  };

  const handleRemoveImage = (index) => {
    const removedImageId = selectedImage[index]?.id; // Assuming existingImages is an array of images with their IDs
    if (removedImageId) {
      setDeleteImage((prev) => [...prev, removedImageId]); // Store the ID of the removed image
    }
    setSelectedImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          mb: 2,
          p: 1.1,
          mt: 0.7,
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        }}
      >
        <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
        Add Expenses
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          handleClose();
          setFormError({});
          setFormData({});
          setManualData({});
          setSelectedImage()
        }}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <ModalContent style={{ width: "90%", maxWidth: "820px" }}>
            <Typography
              variant="h4"
              letterSpacing={3}
              sx={{ fontSize: "20px" }}
            >
              Add Expenses
            </Typography>
            <Box onSubmit={handleSubmit} component="form" noValidate>
            
     
   
                <>
                  <ToggleButtonGroup
                    value={expensesCategory}
                    exclusive
                    onChange={handleExpenseTypeChange}
                    fullWidth
                    sx={{
                      "& .MuiToggleButton-root": {
                        textTransform: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 2,
                      },
                      "& .MuiToggleButton-root.Mui-selected": {
                        backgroundColor: "#263238",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#37474f",
                        },
                      },
                    }}
                  >
                    <ToggleButton value="manual">
                      <AttachMoneyIcon fontSize="small" />
                      Manual
                    </ToggleButton>
                    <ToggleButton disabled={editItemId} value="recurring">
                      <RepeatIcon fontSize="small" />
                      Recurring
                    </ToggleButton>
                  </ToggleButtonGroup>

                  {expensesCategory === "manual" && (
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                        sm={manualData.category === "utility bill" ? 4 : 6}
                        sx={{ mt: { xs: "2rem", lg: "2.8rem" } }}
                      >
                        <FormControl
                          fullWidth
                          required
                          error={Boolean(formError.unitId)}
                        >
                          <Autocomplete
                            id="tenant-autocomplete"
                            options={options}
                            getOptionLabel={(option) => option.label || ""}
                            value={manualCurrentValue}
                            onChange={(event, newValue) => {
                              handleManualUnit(newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Unit name"
                                required
                                error={Boolean(formError.unitId)}
                                helperText={formError.unitId}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: params.InputProps.endAdornment,
                                }}
                              />
                            )}
                            isOptionEqualToValue={(option, value) =>
                              option.uniqueId === value.uniqueId
                            }
                            renderOption={(props, option) => (
                              <li {...props} key={option.uniqueId}>
                                {option.label}
                              </li>
                            )}
                            autoComplete
                            autoHighlight
                            clearOnEscape
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={manualData.category === "utility bill" ? 4 : 6}
                        sx={{ mt: 5.6 }}
                      >
                        <FormControl
                          fullWidth
                          required
                          error={Boolean(formError.category)}
                        >
                          <InputLabel>Category</InputLabel>
                          <Select
                            label="Category"
                            name="category"
                            value={manualData?.category || ''}
                            onChange={handleManualChange}
                            required
                            error={Boolean(formError.category)}
                          >
                            <MenuItem value="maintenance fee">
                              Maintenance Fee
                            </MenuItem>
                            <MenuItem value="utility bill">
                              Utility Bill
                            </MenuItem>
                          </Select>
                          {formError.category && (
                            <FormHelperText>
                              {formError.category}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={manualData.category === "utility bill" ? 4 : 0}
                        sx={{ mt: 1.5 }}
                      >
                        <FormControl
                          fullWidth
                          required
                          error={Boolean(formError.type_of_bills)}
                          sx={{
                            display:
                              manualData.category === "utility bill"
                                ? "block"
                                : "none",
                            mt: manualData.category === "utility bill" ? 4 : -5,
                          }}
                        >
                          <InputLabel>Type of utitlity Bill</InputLabel>
                          <Select
                            label="Type of utitlity Bill"
                            name="type_of_bills"
                            value={manualData.type_of_bills || ''}
                            onChange={handleManualChange}
                            required
                            fullWidth
                            disabled={manualData.category !== "utility bill"}
                            error={Boolean(formError.type_of_bills)}
                          >
                            <MenuItem value="water bill">Water Bill</MenuItem>
                            <MenuItem value="electric Bill">
                              Electric Bill
                            </MenuItem>
                            <MenuItem value="wifi">Wifi</MenuItem>
                          </Select>
                          {formError.type_of_bills && (
                            <FormHelperText>
                              {formError.type_of_bills}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: -2 }}>
                        <TextField
                          required
                          type="number"
                          id="apartment-name"
                          label="Amount"
                          name="amount"
                          value={manualData.amount || ''}
                          onChange={handleManualChange}
                          margin="normal"
                          fullWidth
                          error={Boolean(formError.amount)}
                          helperText={formError.amount}
                          onKeyDown={(e) => {
                            // Prevent 'e', 'E', '+', and '-' from being entered
                            if (
                              e.key === "e" ||
                              e.key === "E" ||
                              e.key === "+" ||
                              e.key === "-"
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{ mt: { xs: "1rem", lg: "0rem" } }}
                      >
                        <LocalizationProvider
                          error={Boolean(formError.expenseDate)}
                          dateAdapter={AdapterDayjs}
                        >
                          <DatePicker
                            label="Expense Date"
                            name="expense Date"
                            sx={{ width: "100%" }}
                            value={manualData.expenseDate}
                            onChange={(newValue) =>
                              handleDateChangeManual("expenseDate", newValue)
                            }
                            fullWidth
                            error={Boolean(formError.expenseDate)} // Add error prop
                            slotProps={{
                              textField: {
                                error: Boolean(formError.expenseDate),
                                helperText: formError.expenseDate,
                                fullWidth: true,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>

                      <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                        <TextField
                          name="description"
                          label="Expenses Description"
                          multiline
                          rows={4}
                          value={manualData.description || ''}
                          error={Boolean(formError.description)}
                          helperText={formError.description}
                          onChange={handleManualChange}
                          required
                          fullWidth
                          inputProps={{ maxLength: 1000 }}
                          placeholder="Please describe the maintenance issue..."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {/* Information message */}
                        <Typography
                          variant="body1"
                          letterSpacing={1}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: "1.8rem",
                            fontSize: "15px",
                            color: "gray",
                          }}
                        >
                          <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                          Please Select Image
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            border: `2px dashed ${
                              formError.images ? "#d32f2f" : "#ccc"
                            }`,
                            borderRadius: "5px",
                            padding: "20px",
                            textAlign: "center",
                            width: "100%",
                            mt: 2,
                          }}
                        >
                          <Box sx={{ marginBottom: "-10px" }}>
                            {selectedImage && selectedImage.length > 0 ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 2,
                                }}
                              >
                                {selectedImage.map((image, index) => (
                                  <Box
                                    key={image.id || index}
                                    sx={{
                                      position: "relative",
                                      width: 100,
                                      height: 100,
                                      marginBottom: 2,
                                    }}
                                  >
                                    <Image
                                      src={
                                        image.preview ||
                                        `https://sorciproptrack.com/MaintenanceImages/${image.path}`
                                      }
                                      alt={image.name}
                                      width={500} // Add specific width
                                      height={300} // Add specific height
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        mt: 1,
                                        display: "block",
                                        maxWidth: "100%",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {image.name}
                                    </Typography>
                                    <IconButton
                                      onClick={() => handleRemoveImage(index)}
                                      sx={{
                                        position: "absolute",
                                        top: -8,
                                        right: -8,
                                        backgroundColor: "white",
                                        "&:hover": { backgroundColor: "white" },
                                      }}
                                    >
                                      <HighlightOffOutlinedIcon color="warning" />
                                    </IconButton>
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <Typography
                                variant="body1"
                                letterSpacing={1}
                                gutterBottom
                                sx={{ color: "gray" }}
                              >
                                Select Receipt Image, if any
                              </Typography>
                            )}
                            <IconButton component="label">
                              <CloudUploadOutlinedIcon fontSize="large" />
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.svg,"
                                name="image"
                                hidden
                                multiple
                                onChange={handleImageChange}
                              />
                            </IconButton>
                          </Box>
                          {formError.images && (
                            <FormHelperText
                              error
                              sx={{
                                display: "block",
                                textAlign: "center",
                                marginTop: 1,
                              }}
                            >
                              {formError.images}
                            </FormHelperText>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  )}

                  {expensesCategory === "recurring" && (
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                        sm={formData.category === "utility bill" ? 4 : 6}
                        sx={{ mt: { xs: "2rem", lg: "2.8rem" } }}
                      >
                        <FormControl
                          fullWidth
                          required
                          error={Boolean(formError.unitId)}
                        >
                          <Autocomplete
                            id="tenant-autocomplete"
                            options={options}
                            getOptionLabel={(option) => option.label || ""}
                            value={currentValue}
                            onChange={(event, newValue) => {
                              handleUnit(newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Unit name"
                                required
                                error={Boolean(formError.unitId)}
                                helperText={formError.unitId}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: params.InputProps.endAdornment,
                                }}
                              />
                            )}
                            isOptionEqualToValue={(option, value) =>
                              option.uniqueId === value.uniqueId
                            }
                            renderOption={(props, option) => (
                              <li {...props} key={option.uniqueId}>
                                {option.label}
                              </li>
                            )}
                            autoComplete
                            autoHighlight
                            clearOnEscape
                          />
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={formData.category === "utility bill" ? 4 : 6}
                        sx={{ mt: 5.7 }}
                      >
                        <FormControl
                          fullWidth
                          required
                          error={Boolean(formError.category)}
                        >
                          <InputLabel>Category</InputLabel>
                          <Select
                            label="Categoty"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            error={Boolean(formError.category)}
                          >
                            <MenuItem value="maintenance fee">
                              Maintenance Fee
                            </MenuItem>
                            <MenuItem value="utility bill">
                              Utility Bill
                            </MenuItem>
                          </Select>
                          {formError.category && (
                            <FormHelperText>
                              {formError.category}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={formData.category === "utility bill" ? 4 : 0}
                        sx={{ mt: 1.7 }}
                      >
                        <FormControl
                          fullWidth
                          required
                          error={Boolean(formError.category)}
                          sx={{
                            display:
                              formData.category === "utility bill"
                                ? "block"
                                : "none",
                            mt: formData.category === "utility bill" ? 4 : -5,
                          }}
                        >
                          <InputLabel>Type of utitlity Bill</InputLabel>
                          <Select
                            label="Type of utitlity Bill"
                            name="type_of_bills"
                            value={formData.type_of_bills}
                            onChange={handleChange}
                            required
                            fullWidth
                            disabled={formData.category !== "utility bill"}
                            error={Boolean(formError.type_of_bills)}
                          >
                            <MenuItem value="water bill">Water Bill</MenuItem>
                            <MenuItem value="electric Bill">
                              Electric Bill
                            </MenuItem>
                            <MenuItem value="wifi">Wifi</MenuItem>
                          </Select>
                          {formError.type_of_bills && (
                            <FormHelperText>
                              {formError.type_of_bills}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} sx={{ mt: -1 }}>
                        <FormControl
                          fullWidth
                          required
                          error={Boolean(formError.frequency)}
                        >
                          <InputLabel>Frequency</InputLabel>
                          <Select
                            label="Frequency"
                            name="frequency"
                            value={formData.frequency}
                            onChange={handleChange}
                            required
                            error={Boolean(formError.frequency)}
                          >
                            <MenuItem value="daily">Daily</MenuItem>
                            <MenuItem value="weekly">Weekly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="quarterly">Quarterly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                          </Select>
                          {formError.frequency && (
                            <FormHelperText>
                              {formError.frequency}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6} sx={{ mt: -3 }}>
                        <TextField
                          required
                          type="number"
                          id="apartment-name"
                          label="Amount"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          margin="normal"
                          fullWidth
                          error={Boolean(formError.amount)}
                          helperText={formError.amount}
                          onKeyDown={(e) => {
                            // Prevent 'e', 'E', '+', and '-' from being entered
                            if (
                              e.key === "e" ||
                              e.key === "E" ||
                              e.key === "+" ||
                              e.key === "-"
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Grid>
                      {/* {editItemId.length > 0 && (
                  <>
                    form
                  </>
                )} */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{ mt: { xs: "1rem", lg: "1rem" } }}
                      >
                        <LocalizationProvider
                          error={Boolean(formError.startDate)}
                          dateAdapter={AdapterDayjs}
                        >
                          <DatePicker
                            label="Start Date"
                            name="startDate"
                            sx={{ width: "100%" }}
                            value={formData.startDate}
                            onChange={(newValue) =>
                              handleDateChange("startDate", newValue)
                            }
                            fullWidth
                            disablePast
                            error={Boolean(formError.startDate)} // Add error pro
                            slotProps={{
                              textField: {
                                error: Boolean(formError.startDate),
                                helperText: formError.startDate,
                                fullWidth: true,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        sx={{ mt: { xs: "1rem", lg: "1rem" } }}
                      >
                        <LocalizationProvider
                          error={Boolean(formError.endDate)}
                          dateAdapter={AdapterDayjs}
                        >
                          <DatePicker
                            label="End Date"
                            name="endDate"
                            sx={{ width: "100%" }}
                            value={formData.endDate}
                            onChange={(newValue) =>
                              handleDateChange("endDate", newValue)
                            }
                            fullWidth
                            disablePast
                            error={Boolean(formError.endDate)} // Add error prop
                            slotProps={{
                              textField: {
                                error: Boolean(formError.endDate),
                                helperText: formError.endDate,
                                fullWidth: true,
                              },
                            }}
                          />
                        </LocalizationProvider>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          sx={{
                            "& .MuiFormControlLabel-label": {
                              fontSize: "0.9rem", // Adjust the size as needed
                              color: "rgba(0, 0, 0, 0.6)", // Optional: make it slightly lighter
                            },
                          }}
                          label="Select to exclude weekends from the recurrence."
                          control={
                            <Checkbox
                              color="primary"
                              onChange={handleCheckBoxChange}
                            />
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} sx={{ mt: 2 }}>
                        <TextField
                          name="description"
                          label="Expenses Description"
                          multiline
                          rows={4}
                          value={formData.description}
                          error={Boolean(formError.description)}
                          helperText={formError.description}
                          onChange={handleChange}
                          required
                          fullWidth
                          inputProps={{ maxLength: 1000 }}
                          placeholder="Please describe the maintenance issue..."
                        />
                      </Grid>
                    </Grid>
                  )}
                </>

              <Button
                variant="contained"
                type="submit"
                sx={{
                  width: "100%",
                  background: "#7e57c2",
                  "&:hover": { backgroundColor: "#9575cd" },
                  padding: "8px",
                  fontSize: "16px",
                  mt: 4,
                }}
              >
                {loading ? <CircularProgress/> : 'Submit'}
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
                  setManualData({});
                  setFormData({});
                  setFormError({});
                  setSelectedImage([]);
                  setExpensesCategory([])
                }}
              >
                Cancel
              </Button>
            </Box>
          </ModalContent>
        </Fade>
      </Modal>
    </Box>
  );
}
