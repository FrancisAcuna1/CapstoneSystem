"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Divider,
  Paper,
  IconButton,
  InputAdornment,
  Avatar,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  InputBase,
  Grid,
  Chip,
  Button,
  Menu,
  MenuItem, 
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha, useTheme, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import TuneIcon from "@mui/icons-material/Tune";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import Checkbox from "@mui/material/Checkbox";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { useSnackbar } from "notistack";
import * as XLSX from "xlsx";
import { format, parseISO } from "date-fns";
import useSWR from "swr";
import dynamic from "next/dynamic";
import NoResultUI from "../Labraries/NoResults";
const MaintenanceRequestDialog = dynamic( () => import("../Labraries/ViewMaintenanceRequestDialog"),{ ssr: false,});




const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(2),
    width: "100%",
  },
  border: `1px solid ${alpha(theme.palette.common.black, 0.5)}`, // Border color
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: alpha(theme.palette.common.black, 0.5), // Icon color
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(0.7, 1, 0.7, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
    color: theme.palette.common.black, // Text color
    fontSize: "14px",
  },
}));

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
  letterSpacing: "2px",
  fontSize: "15px",
  color: "#263238",
});

const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? alpha(theme.palette.primary.main, 0.2)
    : "inherit", // Apply background color if selected
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1), // Lighter on hover
  },
  color: "#263238",
}));

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#e57373", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const AcceptToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#4caf50", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const ViewToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#2196f3", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});

const GeneralTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#263238", // Background color of the tooltip
    color: "#ffffff", // Text color
    borderRadius: "4px",
  },
});


const fetcher = async([url, token]) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  if(!response.ok){
    throw new Error(response.statusText)
  }
  return response.json()
}


const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable


export default function MaintenanceRequestTable({
  loading,
  setLoading,
  refreshTrigger,
  onRefresh
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [selectedItem, setSelectedItem] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [selectedCategory, setSelectedCategory] = useState("Pending");
  const [maintenanceRequest, setMaintenanceRequest] = useState([]);
  const [viewRequest, setViewRequest] = useState([]);

  const categories = ["All", "Pending", "Rejected", "Accepted", "Cancelled"];

  console.log("data:", maintenanceRequest);
  console.log(selectedCategory);

  const getUserToken = () => {
    const userDataString = localStorage.getItem('userDetails');
    const userData = JSON.parse(userDataString);
    const accessToken = userData.accessToken; // Access token
    return accessToken;
  }
  const token = getUserToken();
  const endPoint = selectedCategory === 'All'
    ? `${API_URL}/maintenance_request_list`
    : `${API_URL}/filter_maintenance/${selectedCategory}`;

  const {data: response, error, isLoading} = useSWR(
    token && [endPoint, token] || null,
    fetcher,{
      refreshInterval: 1000,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      errorRetryCount: 3,
      onLoadingSlow: () => setLoading(true),
    }
  )

  useEffect(() => {
    if(response?.data){
      const details = response?.data;
      console.log(details);
      setMaintenanceRequest(details)
      setLoading(false);
    }else if(isLoading){
      setLoading(true);
    }
  }, [response, isLoading, setLoading])


  const fetchedViewRequest = async (id) => {
    const userDataString = localStorage.getItem("userDetails");
    const userData = JSON.parse(userDataString);
    const accessToken = userData.accessToken;
    setLoading(true);

    if (accessToken) {
      try {
        const response = await fetch(
          `${API_URL}/view_request/${id}`,
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
          console.log("data:", data.data);
          setViewRequest(data.data);
          setLoading(false);
        } else {
          console.log("Error fetching user data:", data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    } else {
      console.log("No user Found");
      setLoading(false);
    }
  };

  console.log(selectedItem)


  // filter
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryChange = (category) => {
    // const category = event.target.value;
    setSelectedCategory(category);
    setAnchorEl(null);
  };
  //end code

  //this code is for diaglog
  const handleClickOpen = async (id) => {
    await fetchedViewRequest(id);
    setOpen(true);
    // setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedRequests = React.useMemo(() => {
    if (!sortConfig.key) return maintenanceRequest;

    return [...maintenanceRequest].sort((a, b) => {
      // Helper function to get nested property value safely
      const getNestedValue = (obj, key) => {
        const keys = key.split(".");
        return keys.reduce(
          (acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined),
          obj
        );
      };

      let aValue, bValue;

      switch (sortConfig.key) {
        case "tenant_name":
          aValue = `${a.tenant?.firstname || ""} ${
            a.tenant?.lastname || ""
          }`.trim();
          bValue = `${b.tenant?.firstname || ""} ${
            b.tenant?.lastname || ""
          }`.trim();
          break;
        case "location":
          aValue = a.tenant?.rental_agreement?.[0]?.rented_unit
            ? `${a.tenant.rental_agreement[0].rented_unit.building_no} ${a.tenant.rental_agreement[0].rented_unit.street}`
            : "";
          bValue = b.tenant?.rental_agreement?.[0]?.rented_unit
            ? `${b.tenant.rental_agreement[0].rented_unit.building_no} ${b.tenant.rental_agreement[0].rented_unit.street}`
            : "";
          break;
        case "date_reported":
          aValue = new Date(a.date_reported || 0);
          bValue = new Date(b.date_reported || 0);
          break;
        case "property_type":
          aValue = `${a.maintenanceRequest?.unit_type || ""} ${
            a.maintenanceRequest?.unit_type || ""
          }`.trim();
          bValue = `${b.maintenanceRequest?.unit_type || ""} ${
            b.maintenanceRequest?.unit_type || ""
          }`.trim();
          break;
        case "reported_issue":
          aValue = [
            a.reported_issue || "", 
            a.other_issue || ""
          ].join(" ").trim().toLowerCase();
          
          bValue = [
            b.reported_issue || "", 
            b.other_issue || ""
          ].join(" ").trim().toLowerCase();
          
          break;
        default:
          aValue = getNestedValue(a, sortConfig.key) || "";
          bValue = getNestedValue(b, sortConfig.key) || "";
      }

      // Handle string comparisons
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle numeric and date comparisons
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [maintenanceRequest, sortConfig]);

  console.log("data:", maintenanceRequest);
  const filteredRequests = sortedRequests.filter((request) => {
    const searchStr = searchTerm.toLowerCase();
    const tenantName =
      `${request.tenant?.firstname} ${request.tenant?.lastname}`.toLowerCase();

    // Get unit info from rental agreement
    const unitInfo = request.tenant?.rental_agreement?.[0]?.rented_unit;

    const issues = request?.reported_issue?.toLowerCase();
    const otherissue = request?.other_issue?.toLowerCase();
    const apartment = request?.tenant?.rental_agreement?.rented_unit?.apartment_name?.toLowerCase();
    const boardinghouse = request?.tenant?.rental_agreement[0]?.rented_unit?.boarding_house_name?.toLowerCase();
    const property_Type = request?.tenant?.rental_agreement[0]?.rented_unit_type?.toLowerCase();
    const description = request.issue_description?.toLowerCase();
    const status = request?.status?.toLowerCase();
    const urgency_level = request?.urgency_level.toLowerCase();
    const date = request?.date_reported;
    const formatedDate = formatDate(date);
    return (
      status?.includes(searchStr) ||
      urgency_level?.includes(searchStr) ||
      issues?.includes(searchStr) ||
      otherissue?.includes(searchStr) ||
      formatedDate?.toLowerCase().includes(searchStr) ||
      property_Type?.includes(searchStr) ||
      description.includes(searchStr) ||
      tenantName.includes(searchStr) ||
      apartment?.includes(searchStr) ||
      boardinghouse?.includes(searchStr) ||
      request.tenant?.contact?.includes(searchStr) ||
      unitInfo?.building_no?.toLowerCase().includes(searchStr) ||
      unitInfo?.street?.toLowerCase().includes(searchStr) ||
      unitInfo?.barangay?.toLowerCase().includes(searchStr) ||
      unitInfo?.municipality?.toLowerCase().includes(searchStr)
    );
  });

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedItem(maintenanceRequest.map((n) => n.id));
    } else {
      setSelectedItem([]);
    }
  };

  const handleCheckBoxChange = (event, id) => {
    const selectedIndex = selectedItem.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedItem, id];
    } else {
      newSelected = selectedItem.filter((item) => item !== id);
    }
    setSelectedItem(newSelected);
  };

  const handleExportToExcel = () => {
    const exportData = maintenanceRequest.map((request) => ({
      "Item Name": request.item_name,
      "Unit Name":
        request.tenant?.rental_agreement[0]?.rented_unit?.apartment_name,
      "Issue Description": request.issue_description,
      "Date Reported": request.date_reported,
      "Tenant Name": `${request.tenant?.firstname} ${request.tenant?.lastname}`,
      Contact: request.tenant?.contact,
      Status: request.status,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Maintenance Requests");
    XLSX.writeFile(wb, "maintenance_requests.xlsx");
  };

  const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ maxWidth: 1400, margin: "auto" }}>
      <Grid
        container
        spacing={1}
        sx={{ mt: "-0.9rem", display: "flex", justifyContent: " center" }}
      >
        <Grid item xs={12}>
          <Box
            elevation={3}
            sx={{
              maxWidth: {
                xs: 312,
                sm: 767,
                md: 1000,
                lg: 1400,
                borderRadius: "12px",
                
              },
              
            }}
          >
            {/* <Box sx={{maxWidth: { xs: 312, sm: 767,  md: 1000, lg: 1400}}}> */}
            <TableContainer>
              <Toolbar
                sx={[
                  {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                  },
                ]}
              >
                
                <Typography
                sx={{
                  flex: "1 1 100%",
                  mt: "0.4rem",
                  mb: "0.4rem",
                  fontSize: {
                    xs: "18px",
                    sm: "18px",
                    md: "18px",
                    lg: "22px",
                  },
                }}
                variant="h6"
                id="tableTitle"
                component="div"
                letterSpacing={2}
              >
                List of Maintenance Request
                </Typography>
            
               
          
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    mt: "1rem",
                    mb: "0.5rem",
                  }}
                >
                  <Search value={searchTerm} onChange={handleSearchChange}>
                    <SearchIconWrapper>
                      <SearchIcon fontSize="small" />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ "aria-label": "search" }}
                    />
                  </Search>
                  <GeneralTooltip title="Filter Table">
                    <IconButton
                      onClick={handleMenuOpen}
                      sx={{ ml: "-0.5rem", mr: "0.6rem" }}
                    >
                      <TuneIcon fontSize="medium" />
                    </IconButton>
                  </GeneralTooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem
                        key={category}
                        selected={category === selectedCategory}
                        onClick={() => handleCategoryChange(category)}
                      >
                        {category}
                      </MenuItem>
                    ))}
                  </Menu>
                  {/* <GeneralTooltip title="Download file">
                    <IconButton
                      sx={{ ml: "-0.5rem", mr: "0.6rem" }}
                      onClick={handleExportToExcel}
                    >
                      <CloudDownloadOutlinedIcon fontSize="medium" />
                    </IconButton>
                  </GeneralTooltip> */}
                </Box>
             
              </Toolbar>
              <Table size="medium" sx={{ mt: 2 }}>
                <TableHead sx={{ backgroundColor: "whitesmoke", p: 2 }}>
                  <TableRow>
                    {/* <StyledTableCell>
                      <Checkbox
                        color="primary"
                        onChange={handleSelectAllClick}
                        indeterminate={
                          selectedItem.length > 0 &&
                          selectedItem.length < maintenanceRequest.length
                        }
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                        // checked={isSelected}
                        // inputProps={{
                        // 'aria-labelledby': labelId,
                        // }}
                      />
                    </StyledTableCell> */}
                    <StyledTableCell
                      onClick={() => handleSort("date_reported")}
                    >
                      Date Reported{" "}
                      {sortConfig.key === "date_reported" &&
                        (sortConfig.direction === "asc" ? (
                          <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                          />
                        ) : (
                          <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell
                      sx={{ width: "220px" }}
                      onClick={() => handleSort("location")}
                    >
                      Location{" "}
                      {sortConfig.key === "location" &&
                        (sortConfig.direction === "asc" ? (
                          <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                          />
                        ) : (
                          <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell
                      onClick={() => handleSort("property_type")}
                    >
                      Property Name{" "}
                      {sortConfig.key === "property_type" &&
                        (sortConfig.direction === "asc" ? (
                          <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                          />
                        ) : (
                          <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell onClick={() => handleSort("tenant_name")}>
                      Tenant Name{" "}
                      {sortConfig.key === "tenant_name" &&
                        (sortConfig.direction === "asc" ? (
                          <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                            color="#bdbdbd"
                          />
                        ) : (
                          <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    
                    <StyledTableCell
                      onClick={() => handleSort("reported_issue")}
                    >
                      Issues Type{" "}
                      {sortConfig.key === "reported_issue" &&
                        (sortConfig.direction === "asc" ? (
                          <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                          />
                        ) : (
                          <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>

                    <StyledTableCell
                      onClick={() => handleSort("reported_issue")}
                    >
                      Urgency Level{" "}
                      {sortConfig.key === "reported_issue" &&
                        (sortConfig.direction === "asc" ? (
                          <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                          />
                        ) : (
                          <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>

                    <StyledTableCell
                      sx={{ width: "200px" }}
                      onClick={() => handleSort("issue_description")}
                    >
                      Description{" "}
                      {sortConfig.key === "issue_description" &&
                        (sortConfig.direction === "asc" ? (
                          <NorthIcon
                            fontSize="extrasmall"
                            justifyContent="center"
                          />
                        ) : (
                          <SouthIcon fontSize="extrasmall" />
                        ))}
                    </StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRequests.length > 0 ? (paginatedRequests.map((info, index) => {
                    const isSelected = selectedItem.includes(info.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    // Get the first rental agreement since it's an array
                    const rentalAgreement = info.tenant.rental_agreement[0];
                    const rentedUnit = rentalAgreement?.rented_unit;
                    return (
                      <StyledTableRow
                        key={info.id}
                        tabIndex={-1}
                        selected={isSelected}
                        aria-checked={isSelected}
                        onChange={(event) =>
                          handleCheckBoxChange(event, info.id)
                        }
                      >
                        {/* <TableCell>
                          <Checkbox
                            color="primary"
                            checked={isSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell> */}
                        <TableCell>{formatDate(info.date_reported)}</TableCell>
                        <TableCell>
                          {rentedUnit
                            ? `Bldg no. ${rentedUnit.building_no}. ${rentedUnit.street}. ${rentedUnit.barangay}, ${rentedUnit.municipality}`
                            : "N/A"}
                        </TableCell>

                        <TableCell>
                          {info.tenant.rental_agreement[0]?.rented_unit?.apartment_name || 
                          info.tenant.rental_agreement[0]?.rented_unit?.boarding_house_name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {info.tenant.firstname} {info.tenant.lastname}
                          <Divider sx={{ width: "98%" }} />
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "gray",
                              fontStyle: "italic",
                              mt: "0.3rem",
                            }}
                          >
                            Contact no: {info.tenant.contact}
                          </Typography>
                        </TableCell>             
                        <TableCell>
                          {info.reported_issue || info.other_issue}
                        </TableCell>
                        <TableCell>
                          {/* {info.urgency_level || 'none'} */}
                          <Chip
                            label={info.urgency_level}
                            variant="contained"
                            sx={{
                              backgroundColor: 
                                info.urgency_level === "Low"
                                  ? "#c8e6c9"
                                  : info.urgency_level === "Medium"
                                  ? "#ffe0b2"
                                  : "#ffcdd2",
                              color:
                                info.urgency_level === "Low"
                                ? "#2e7d32"
                                : info.urgency_level === "Medium"
                                ? "#ff8f00"
                                : "#c62828",
                              "& .MuiChip-label":{
                                color:
                                  info.urgency_level === "Low"
                                  ? "#2e7d32"
                                  : info.urgency_level === "Medium"
                                  ? "#ff8f00"
                                  : "#c62828",
                                fontWeight: 560,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: "200px", // adjust width as needed
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {info.issue_description}
                        </TableCell>
                        <TableCell align="center">
                          {info.status === "Pending" ? (
                            <>
                              <Button
                                onClick={() => handleClickOpen(info.id)}
                                variant="contained"
                                size="small"
                              >
                                View
                              </Button>
                            </>
                          ) : (
                            <GeneralTooltip
                            title={
                              info.remarks ? (
                                <div>
                                  <strong>Remark&apos;s:</strong><br />
                                  {info.remarks}
                                </div>
                              ) : ''
                            }
                            
                          >
                            <Chip
                              variant="contained"
                              label={info.status === "Cancelled" ? `${info.status} by Tenant` : info.status}
                              // color={info.status === 'Accepted' ? '#81c784' : info.status === 'Ongoing' ? 'primary' : 'secondary'}
                              sx={{
                                backgroundColor:
                                  info.status === "Accepted"
                                  ? "#c8e6c9"
                                  : info.status === "Rejected" 
                                  ? "#ffcdd2" 
                                  : '#fff3e0',
                              "& .MuiChip-label": {
                                  color:
                                  info.status === "Accepted"
                                    ? "#43a047"
                                    : info.status === "Rejected" 
                                    ? '#e53935'
                                    : '#f57c00',
                                  fontWeight: 560,
                                },
                              }}
                            />
                            </GeneralTooltip>
                          )}
                        </TableCell>
                      </StyledTableRow>
                   
                    );
                  })):(
                    <StyledTableRow>
                      <TableCell 
                        colSpan={12} 
                        sx={{ 
                        p: 0, // Remove padding
                        backgroundColor: "transparent", // Remove background
                        borderBottom: "none", // Optional: Remove table row bottom border
                        }}
                      >
                        <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          minHeight: "300px",
                          textAlign: "center",
                        }}
                        >
                          <NoResultUI/>
                        </Box>
                      </TableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 25]}
              component="div"
              count={filteredRequests.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* </Box> */}
          </Box>
        </Grid>
      </Grid>
      <MaintenanceRequestDialog
        open={open}
        handleClose={handleClose}
        loading={loading}
        setLoading={setLoading}
        viewRequest={viewRequest}
        onRefresh={onRefresh}
        refreshTrigger={refreshTrigger}
      />
    </Box>
  );
}
