"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Divider,
  Fade,
  TextField,
  Autocomplete,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, css } from "@mui/system";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import {
  WarningAmber as WarningAmberIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
  ReportTwoTone as ReportTwoToneIcon,
  EngineeringTwoTone as EngineeringTwoToneIcon,
} from "@mui/icons-material";
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

const DeleteTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#f44336", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const ColorButton = ({ selected, color, onClick }) => (
  <Button
    onClick={onClick}
    sx={{
      minWidth: "unset",
      width: 24,
      height: 24,
      borderRadius: "50%",
      padding: 0,
      backgroundColor: color,
      border: `2px solid ${selected ? "#1976d2" : "#e0e0e0"}`,
      marginRight: 1,
      marginBottom: 1,
      "&:hover": {
        backgroundColor: color,
      },
    }}
  />
);

const colors = [
  { id: "default", value: "#2196f3" },
  { id: "red", value: "#f44336" },
  { id: "purple", value: "#9c27b0" },
  { id: "indigo", value: "#c7d2fe" },
  { id: "yellow", value: "#fef08a" },
  { id: "orange", value: "#fed7aa" },
  { id: "gray", value: "#e5e7eb" },
  { id: "white", value: "#ffffff" },
  { id: "pink", value: "#e91e63" },
  { id: "green", value: "#bbf7d0" },
  { id: "blue", value: "#bfdbfe" },
  { id: "lavender", value: "#7e57c2" },
];

const textColors = [
  { id: "default", value: "#ffffff" },
  { id: "black", value: "#000000" },
  { id: "gray", value: "#6b7280" },
  { id: "silver", value: "#cbd5e1" },
  { id: "red", value: "#ef4444" },
  { id: "yellow", value: "#eab308" },
  { id: "green", value: "#22c55e" },
  { id: "blue", value: "#3b82f6" },
  { id: "indigo", value: "#6366f1" },
  { id: "purple", value: "#a855f7" },
  { id: "pink", value: "#ec4899" },
  { id: "orange", value: "#f97316" },
];

const fetcher = async([url, token]) => {
  console.log('Fetching URL:', url);
  console.log('With Token:', token);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  })
  if (!response.ok) {
    throw new Error('Failed to fetch schedule');
  }

  return response.json();
}

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable


export default function AddMaintenanceSchedule({
  open,
  handleOpen,
  handleClose,
  setSuccessful,
  setError,
  setLoading,
  loading,
  selectedScheduleId,
  isEditMode,
  initialDateSelection,
  onRefresh,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedBgColor, setSelectedBgColor] = useState("default");
  const [selectedTextColor, setSelectedTextColor] = useState("default");
  const [formError, setFormError] = useState({});
  const [selectedScheduleType, setSelectedScheduleType] = useState("");
  const [acceptedRequest, setAcceptedRequest] = useState([]);
  const [propertyList, setPropertyList] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    maintenance_id: "",
    title: "",
    status: "",
    start_date: null,
    end_date: null,
    is_reported: true,
  });

  const [manualData, setManualData] = useState({
    unitId: "",
    type: "",
    title: "",
    status: "",
    maintenance_task: "",
    description: "",
    start_date: null,
    end_date: null,
    is_reported: false,
  })
  console.log(acceptedRequest);
  console.log(scheduleData);
  console.log(manualData)
  console.log(selectedTextColor);
  console.log(selectedBgColor);
  console.log(selectedScheduleId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });

    setFormError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setManualData({
      ...manualData,
      [name]: value,
    });

    setFormError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if(selectedScheduleType === 'reported issue'){
      if (!scheduleData.maintenance_id) {
        tempErrors.maintenance_id = "Reported Issue is required";
        isValid = false;
      }
      if (!scheduleData.title) {
        tempErrors.title = "Title of Schedule is required";
        isValid = false;
      }
      if (!scheduleData.status) {
        tempErrors.status = "Status type is required";
        isValid = false;
      }
      // Check start_date
      if (!scheduleData.start_date || !scheduleData.start_date.$isDayjsObject) {
        tempErrors.start_date = "Start date is required";
        isValid = false;
      }
  
      // Check end_date
      if (!scheduleData.end_date || !scheduleData.end_date.$isDayjsObject) {
        tempErrors.end_date = "End date is required";
        isValid = false;
      }
  
      // Optional: Validate that end date is not before start date
      if (scheduleData.start_date && scheduleData.end_date) {
        if (scheduleData.end_date.isBefore(scheduleData.start_date)) {
          tempErrors.end_date = "End date must be after start date";
          isValid = false;
        }
      }
    }

    if(selectedScheduleType === 'create maintenance'){
      if (!manualData.unitId) {
        tempErrors.unitId = "Unit Name is required";
        isValid = false;
      }
      if (!manualData.description) {
        tempErrors.description = "Description is required";
        isValid = false;
      }
      if (!manualData.maintenance_task) {
        tempErrors.maintenance_task = "Maintenance Task is required";
        isValid = false;
      }
      if (!manualData.title) {
        tempErrors.title = "Title of Schedule is required";
        isValid = false;
      }
      if (!manualData.status) {
        tempErrors.status = "Status type is required";
        isValid = false;
      }
      // Check start_date
      if (!manualData.start_date || !manualData.start_date.$isDayjsObject) {
        tempErrors.start_date = "Start date is required";
        isValid = false;
      }
  
      // Check end_date
      if (!manualData.end_date || !manualData.end_date.$isDayjsObject) {
        tempErrors.end_date = "End date is required";
        isValid = false;
      }
  
      // Optional: Validate that end date is not before start date
      if (manualData.start_date && manualData.end_date) {
        if (manualData.end_date.isBefore(manualData.start_date)) {
          tempErrors.end_date = "End date must be after start date";
          isValid = false;
        }
      }
  
    }

    setFormError(tempErrors);
    return isValid;
  };

  useEffect(() => {
    const fethcedAccepted = async () => {
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;
      if (accessToken) {
        const response = await fetch(`${API_URL}/get_accepted`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          const filteredData = data.data.filter(issue => issue.is_schedule === 0);
          setAcceptedRequest(filteredData);
        } else {
          console.log("error", data.message);
        }
      } else {
        console.log("No access token found!");
      }
    };
    fethcedAccepted();
  }, []);

  useEffect(() => {
    const fetchedPropertyList = async() => {
      const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
      const userData = JSON.parse(userDataString); // parse the datastring into json
      const accessToken = userData.accessToken;
      if(accessToken){
        try{
          const response = await fetch(`${API_URL}/get_all_property`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            }
          })
          const data = await response.json()
          if(response.ok){
            console.log(data.data);
            setPropertyList(data.data);
          }else{
            console.log(data.error);
          }
        }catch(error){
          console.log(error);
        }
      }else{
        console.log('No access token!')
      }
    }
    fetchedPropertyList();
  }, [])

  const getUserToken = () => {
    const userDataString = localStorage.getItem('userDetails');
    const userData = JSON.parse(userDataString);
    return userData?.accessToken;
  };

  const {data: scheduleResponse, error} = useSWR(
    selectedScheduleId ?  [`${API_URL}/edit_schedule/${selectedScheduleId}`, getUserToken()] : null,
    fetcher, {
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      // Optional: retry only 3 times
      errorRetryCount: 3,
    }
  )

  console.log('Error to fetch: ', error)
  console.log(scheduleResponse?.data)
  console.log(acceptedRequest)
  useEffect(() => {
    if (scheduleResponse?.data) {
      const scheduleDetails = scheduleResponse.data;
      const startDate = dayjs(scheduleDetails.start_date) || null;
      const endDate = dayjs(scheduleDetails.end_date) || null;

      // Determine schedule type and set appropriate state
      if (scheduleDetails.is_reported_issue === 1) {
        setScheduleData({
          maintenance_id: scheduleDetails.maintenance_request_id || '',
          title: scheduleDetails.schedule_title || '',
          status: scheduleDetails.status || '',
          start_date: startDate || '',
          end_date: endDate || '',
          is_reported: true,
        });
        setAcceptedRequest(
          scheduleDetails?.maintenance_request 
            ? [scheduleDetails.maintenance_request] 
            : []
        )
      }

      if (scheduleDetails.is_reported_issue === 0) {
        setManualData({
          unitId: scheduleDetails.unit_id || '',
          type: scheduleDetails.unit_type || '',
          title: scheduleDetails.schedule_title || '',
          status: scheduleDetails.status || '',
          maintenance_task: scheduleDetails.maintenance_task || '',
          description: scheduleDetails.description || '',
          start_date: startDate || '',
          end_date: endDate,
          is_reported: false,
        });
      }

      // Set colors and schedule type
      const bgColorId =
        colors.find((c) => c.value === scheduleDetails.bg_color)?.id || 'default';
      const textColorId =
        textColors.find((c) => c.value === scheduleDetails.text_color)?.id || 'default';

      setSelectedTextColor(textColorId);
      setSelectedBgColor(bgColorId);
      setSelectedScheduleType(
        scheduleDetails.is_reported_issue === 1 ? 'reported issue' : 'create maintenance'
      );
    }
  }, [scheduleResponse]);


  // const resetForm = () => {
  //   setScheduleData({
  //     maintenance_id: "",
  //     title: "",
  //     status: "",
  //     start_date: null,
  //     end_date: null,
  //     textColor: "",
  //     bg_color: "",
  //     reported_issue: true,
  //   });
    
  //   setManualData({
  //     unitId: "",
  //     type: "",
  //     title: "",
  //     status: "",
  //     maintenance_task: "",
  //     description: "",
  //     start_date: null,
  //     end_date: null,
  //     is_reported: false,
  //   });
  // }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData?.accessToken;
    setLoading(true);

     // Determine which data to use based on the type
      const formData = selectedScheduleType === 'reported issue' 
      ? {
          ...scheduleData,
          is_reported: true,
          start_date: scheduleData.start_date
            ? dayjs(scheduleData.start_date).format("MM/DD/YYYY")
            : null,
          end_date: scheduleData.end_date
            ? dayjs(scheduleData.end_date).format("MM/DD/YYYY")
            : null,
          text_color: textColors.find((color) => color.id === selectedTextColor)?.value || textColors[0].value,
          bg_color: colors.find((color) => color.id === selectedBgColor)?.value || colors[0].value,
        }
      : {
          ...manualData,
          is_reported: false,
          start_date: manualData.start_date
            ? dayjs(manualData.start_date).format("MM/DD/YYYY")
            : null,
          end_date: manualData.end_date
            ? dayjs(manualData.end_date).format("MM/DD/YYYY")
            : null,
          text_color: textColors.find((color) => color.id === selectedTextColor)?.value || textColors[0].value,
          bg_color: colors.find((color) => color.id === selectedBgColor)?.value || colors[0].value,
      };
    console.log(formData);

    if (accessToken) {
      try {
        const url = selectedScheduleId
          ? `${API_URL}/update_schedule/${selectedScheduleId}`
          : `${API_URL}/add_schedule`;

        const method = selectedScheduleId ? "PUT" : "POST";

        const response = await fetch(url, {
          method: method,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
          onRefresh();
          enqueueSnackbar(data.message, { variant: "success" });
          setLoading(false);
          handleClose();
          setScheduleData({
            maintenance_id: "",
            title: "",
            status: "",
            start_date: null,
            end_date: null,
            textColor: "",
            bg_color: "",
            reported_issue: true,
          });
          
          setManualData({
            unitId: "",
            type: "",
            title: "",
            status: "",
            maintenance_task: "",
            description: "",
            start_date: null,
            end_date: null,
            is_reported: false,
          });
        } else {
          enqueueSnackbar(data.message, { variant: "error" });
          setLoading(false);
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
        console.log("Error to submit");
      }
    }
  };

  const handleAlertOpen = () => {
    setAlertDialogOpen(true);
    console.log(selectedScheduleId);
  };

  const handleAlertClose = () => {
    setAlertDialogOpen(false);
  };

  const handleDeleteSchedule = async () => {
    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData?.accessToken;
    setLoading(true);

    if (accessToken) {
      try {
        const response = await fetch(
          `${API_URL}/delete_schedule/${selectedScheduleId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          console.log(data.data);
          enqueueSnackbar(data.message, { variant: "success" });
          setLoading(false);
          onRefresh();
          handleAlertClose();
          handleClose();
          setScheduleData({
            maintenance_id: "",
            title: "",
            status: "",
            start_date: null,
            end_date: null,
            textColor: "",
            bg_color: "",
            reported_issue: true,
          });
          
          setManualData({
            unitId: "",
            type: "",
            title: "",
            status: "",
            maintenance_task: "",
            description: "",
            start_date: null,
            end_date: null,
            is_reported: false,
          });
        } else {
          enqueueSnackbar(data.message, { variant: "error" });
          handleAlertClose();
          handleClose();
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("No Accesstoken Found!");
    }
  };

  const handleScheduleType = (event, newScheduleType) => {
    if (newScheduleType !== null) {
      setSelectedScheduleType(newScheduleType);
      setFormError({});
    }
  };

  const handleReportedIssue = (selectedIssue) => {
    if (selectedIssue) {
      setScheduleData((prev) => ({
        ...prev,
        maintenance_id: selectedIssue.id, // Set tenant_id
      }));
    } else {
      setScheduleData((prev) => ({
        ...prev,
        maintenance_id: "",
      }));
    }
    setFormError((prev) => ({
      ...prev,
      maintenance_id: "",
    }));
  };

  const handleDateChange = (name, value) => {
    setScheduleData({
      ...scheduleData,
      [name]: value,
    });
    if (value) {
      setFormError((prev) => ({ ...prev, [name]: "" })); // Clear error if valid
    }
  };

  const handleDateChangeManual = (name, value) => {
    setManualData({
      ...manualData,
      [name]: value,
    })
    if(value){
      setFormError((prev) => ({ ...prev, [name]: "" })); // Clear
    }
  }


   // Helper function to create unique IDs for units
   const createUniqueId = (unit, type) => `${type}-${unit.id}`;

   // Transform the options to include unique IDs
   const options = propertyList.flatMap((property) => [
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

  const manualCurrentValue =
  options.find(
    (option) =>
      option.id === manualData.unitId &&
      option.property_type === manualData.type
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

  console.log(scheduleData.title);
  console.log(scheduleData.maintenance_id);
  console.log(scheduleData.status);
  console.log(selectedScheduleType);
  console.log(options)
  console.log(manualData)
  return (
    <Box sx={{ display: "flex", justifySelf: "end", mt: 1.5 }}>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          background: "primary",
          "&:hover": { backgroundColor: "#b6bdf1" },
          borderRadius: "15px",
          p: 1.1,
          mb: 2,
        }}
      >
        <AddCircleOutlineIcon sx={{ marginRight: 1 }} />
        {isEditMode ? "Edit Schedule" : "Add New Schedule"}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          handleClose();
          setScheduleData({
            maintenance_id: "",
            title: "",
            status: "",
            start_date: null,
            end_date: null,
          });
          setManualData({});
          setFormError({});
        }}
        closeAfterTransition
        slots={{ backdrop: StyledBackdrop }}
      >
        <Fade in={open}>
          <ModalContent
          style={{
            width: "90%",
            maxWidth: "600px",
            maxHeight: "85vh", // Set a maximum height for the modal
            overflowY: "auto", // Enable vertical scrolling if content overflows
            padding: "16px", // Optional padding for better spacing
          }}
          >
            <Typography
              variant="h1"
              letterSpacing={3}
              sx={{ fontSize: "20px" }}
            >
              {selectedScheduleId && selectedScheduleId
                ? "Edit Schedule"
                : "Add New Schedule"}
            </Typography>
            <Box onSubmit={handleSubmit} component="form" noValidate>
              <ToggleButtonGroup
                value={selectedScheduleType}
                exclusive
                onChange={handleScheduleType}
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
                <ToggleButton disabled={selectedScheduleId && selectedScheduleType === 'create maintenance'} value="reported issue">
                  <ReportTwoToneIcon fontSize="medium" />
                  Reported Issue
                </ToggleButton>
                <ToggleButton disabled={selectedScheduleId && selectedScheduleType === 'reported issue'} value="create maintenance">
                  <EngineeringTwoToneIcon fontSize="medium" />
                  Create Maintenance
                </ToggleButton>
              </ToggleButtonGroup>

              {selectedScheduleType === "reported issue" && (
                <>
                  <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    margin="normal"
                    name="title"
                    value={scheduleData.title || ""} // Remove 'habo kona'
                    onChange={handleChange}
                    error={Boolean(formError.title)}
                    helperText={formError.title}
                  />

                  <FormControl
                    fullWidth
                    required
                    error={Boolean(formError.maintenance_id)}
                    sx={{ mt: 1 }}
                  >
                    <Autocomplete
                      id="tenant-autocomplete"
                      options={acceptedRequest}
                      // getOptionLabel={(option) => `${option.reported_issue}` || ""}
                      getOptionLabel={(option) => {
                        return (
                          option.reported_issue || option.other_issue || ""
                        );
                      }}
                      value={
                        acceptedRequest.find(
                          (issue) => issue.id === scheduleData.maintenance_id
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        handleReportedIssue(newValue); // Pass the entire newValue
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Reported issue"
                          required
                          error={Boolean(formError.maintenance_id)}
                          helperText={formError.maintenance_id}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: params.InputProps.endAdornment,
                          }}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      } // Compare IDs
                      renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                          {option.reported_issue && (
                            <div>{option.reported_issue}</div>
                          )}
                          {option.other_issue && (
                            <div>{option.other_issue}</div>
                          )}
                        </li>
                      )}
                      autoComplete
                      autoHighlight
                      clearOnEscape
                    />
                  </FormControl>

                  <FormControl
                    error={Boolean(formError.status)}
                    fullWidth
                    margin="normal"
                    sx={{ mt: 2 }}
                  >
                    <InputLabel error={Boolean(formError.status)} required>
                      Status
                    </InputLabel>
                    <Select
                      error={Boolean(formError.status)}
                      label="Status"
                      name="status"
                      value={scheduleData.status || ""} // Add fallback
                      onChange={handleChange}
                      // disabled={scheduleData.status === 'Completed'}
                    >
                      <MenuItem value="To do">To Do</MenuItem>
                      <MenuItem value="In Progress" disabled={!selectedScheduleId}>
                        In Progress
                      </MenuItem>
                      <MenuItem value="Completed" disabled={!selectedScheduleId}>
                        Completed
                      </MenuItem>                
                    </Select>
                    {formError.status && (
                      <FormHelperText
                        error
                        sx={{
                          marginLeft: "14px",
                          marginRight: "14px",
                          fontSize: "0.75rem",
                        }}
                      >
                        {formError.status}
                      </FormHelperText>
                    )}
                  </FormControl>

                  {/* <FormControlLabel
                control={
                  <Switch
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    color="primary"
                  />
                }
                label="All day"
                sx={{ my: 2 }}
              /> */}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid container spacing={2} sx={{ mt: 0.4 }}>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="Start Date"
                          name="start_date"
                          sx={{ width: "100%" }}
                          value={scheduleData.start_date}
                          onChange={(newValue) =>
                            handleDateChange("start_date", newValue)
                          }
                          fullWidth
                          disablePast
                          error={Boolean(formError.start_date)}
                          slotProps={{
                            textField: {
                              error: Boolean(formError.start_date),
                              helperText: formError.start_date,
                              fullWidth: true,
                            },
                          }}
                          // renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          label="End Date"
                          name="end_date"
                          sx={{ width: "100%" }}
                          value={scheduleData.end_date}
                          onChange={(newValue) =>
                            handleDateChange("end_date", newValue)
                          }
                          fullWidth
                          disablePast
                          error={Boolean(formError.end_date)}
                          slotProps={{
                            textField: {
                              error: Boolean(formError.end_date),
                              helperText: formError.end_date,
                              fullWidth: true,
                            },
                          }}
                          // renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>
                </>
              )}

              {selectedScheduleType === "create maintenance" && (<>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  margin="normal"
                  name="title"
                  value={manualData.title || ""} // Remove 'habo kona'
                  onChange={handleManualChange}
                  error={Boolean(formError.title)}
                  helperText={formError.title}
                  sx={{mt:5}}
                />
                <FormControl
                  fullWidth
                  required
                  sx={{mt:1.5}}
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
                <TextField
                  fullWidth
                  label="Maintenance Task"
                  variant="outlined"
                  margin="normal"
                  name="maintenance_task"
                  value={manualData.maintenance_task || ""} // Remove 'habo kona'
                  onChange={handleManualChange}
                  sx={{mt:2.3}}
                  error={Boolean(formError.maintenance_task)}
                  helperText={formError.maintenance_task}
                />
                <FormControl
                  error={Boolean(formError.status)}
                  fullWidth
                  margin="normal"
                  sx={{ mt: 2 }}
                >
                  <InputLabel error={Boolean(formError.status)} required>
                    Status
                  </InputLabel>
                  <Select
                    error={Boolean(formError.status)}
                    label="Status"
                    name="status"
                    value={manualData.status || ""} // Add fallback
                    onChange={handleManualChange}
                  >
                    <MenuItem value="To do">To Do</MenuItem>
                    <MenuItem value="In Progress" disabled={!selectedScheduleId}>In Progress</MenuItem>
                    <MenuItem value="Completed" disabled={!selectedScheduleId}>Completed</MenuItem>
                  </Select>
                  {formError.status && (
                    <FormHelperText
                      error
                      sx={{
                        marginLeft: "14px",
                        marginRight: "14px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {formError.status}
                    </FormHelperText>
                  )}
                </FormControl>
                <TextField
                  name="description"
                  label="Issue Description"
                  multiline
                  rows={4}
                  value={manualData.description}
                  error={Boolean(formError.description)}
                  helperText={formError.description}
                  onChange={handleManualChange}
                  required
                  fullWidth
                  sx={{mt:2}}
                  inputProps={{ maxLength: 1000 }} 
                  placeholder="Please describe the maintenance issue..."
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2} sx={{ mt: 0.4 }}>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="Start Date"
                        name="start_date"
                        sx={{ width: "100%" }}
                        value={manualData.start_date}
                        onChange={(newValue) =>
                          handleDateChangeManual("start_date", newValue)
                        }
                        fullWidth
                        disablePast
                        error={Boolean(formError.start_date)}
                        slotProps={{
                          textField: {
                            error: Boolean(formError.start_date),
                            helperText: formError.start_date,
                            fullWidth: true,
                          },
                        }}
                        // renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DatePicker
                        label="End Date"
                        name="end_date"
                        sx={{ width: "100%" }}
                        value={manualData.end_date}
                        onChange={(newValue) =>
                          handleDateChangeManual("end_date", newValue)
                        }
                        fullWidth
                        disablePast
                        error={Boolean(formError.end_date)}
                        slotProps={{
                          textField: {
                            error: Boolean(formError.end_date),
                            helperText: formError.end_date,
                            fullWidth: true,
                          },
                        }}
                        // renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </>)}

              {selectedScheduleType !== "" && (
                <>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                      Background Color
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", mb: 2, mt: 2 }}
                    >
                      {colors.map((color) => (
                        <ColorButton
                          key={color.id}
                          color={color.value}
                          selected={selectedBgColor === color.id}
                          onClick={() => setSelectedBgColor(color.id)}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Text Color
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", mb: 2, mt: 2 }}
                    >
                      {textColors.map((color) => (
                        <ColorButton
                          key={color.id}
                          color={color.value}
                          selected={selectedTextColor === color.id}
                          onClick={() => setSelectedTextColor(color.id)}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 4,
                }}
              >
                {/* Left side: Delete button */}
                <Box>
                  {selectedScheduleId ? (
                    <DeleteTooltip title="Delete Schedule">
                      <IconButton
                        onClick={() => {
                          handleAlertOpen(selectedScheduleId);
                        }}
                      >
                        <DeleteIcon
                          fontSize="medium"
                          sx={{ color: "#f44336" }}
                        />
                      </IconButton>
                    </DeleteTooltip>
                  ) : null}
                </Box>

                {/* Right side: Add and Cancel buttons on the same line */}
                {selectedScheduleType !== "" && (
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {" "}
                    {/* Add gap for spacing between buttons */}
                    <Button
                      variant="outlined"
                      sx={{
                        fontSize: "14px", // Adjust font size for smaller size
                        borderRadius: "8px", // Optional: make corners slightly rounder
                        padding: "6px 12px", // Adjust padding for smaller size
                        color: "#000",
                        borderColor: "#000",
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                          borderColor: "#000",
                        },
                      }}
                      onClick={() => {
                        handleClose();
                        setScheduleData({});
                        setManualData({});
                        setFormError({});
                        setSelectedScheduleType('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        background: "primary",
                        "&:hover": { backgroundColor: "#b6bdf1" },
                        padding: "6px 12px", // Adjust padding for smaller size
                        fontSize: "14px", // Adjust font size for smaller size
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </ModalContent>
        </Fade>
      </Modal>
      <React.Fragment>
        <Dialog
          open={alertDialogOpen}
          onClose={handleAlertClose}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              pb: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <WarningAmberIcon color="error" />
              <Typography variant="h6" fontWeight="bold">
                Confirm Deletion
              </Typography>
            </Box>
            <IconButton onClick={handleAlertClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <DialogContent>
            <DialogContentText>
              Are you sure you want to remove this schedule?
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This action cannot be undone and will permanently delete the
                schedule information of a maintenance.
              </Typography>
            </DialogContentText>
          </DialogContent>

          <DialogActions sx={{ p: 2, pt: 0, mt: 2 }}>
            <Button onClick={handleAlertClose} color="inherit" variant="text">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSchedule}
              color="error"
              variant="contained"
              startIcon={<DeleteForeverIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Delete Schedule
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </Box>
  );
}
