"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  Toolbar,
  Typography,
  Box,
  Tooltip,
  InputBase,
  inputProps,
  Breadcrumbs,
  Link,
  Grid,
  Chip,
  Fab,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Menu
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { styled, alpha, useTheme, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import TuneIcon from "@mui/icons-material/Tune";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import DoNotDisturbAltOutlinedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Checkbox from "@mui/material/Checkbox";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import {
  WarningAmber as WarningAmberIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import * as XLSX from "xlsx";
import useSWR from "swr";
import WarningActiveTenant from "../Labraries/WarningAlertTenant";
import { useSnackbar } from "notistack";
import { parseISO, format, addMonths, setDate, getDate } from "date-fns";
import NoResultUI from "../Labraries/NoResults";



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

const DeleteTooltip = styled(({ className, ...props }) => (
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
    return response.json();
}

export default function TenantInformationTable({
  setLoading,
  loading,
  handleEdit,
}) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false); // for warning dialog
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({key: "firstname",direction: "asc"});
  const [tenantInformation, setTenantInformation] = useState([]);
  const category = ['All', 'Active', 'Former'];

  const getUserToken = () => {
    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;
    return accessToken;
  }
  const token = getUserToken();
  const endpoint = selectedCategory === 'All'
    ?  "http://127.0.0.1:8000/api/tenant_list"
    : `http://127.0.0.1:8000/api/filter_tenant_list/${selectedCategory}`
  
  const {data: response, error, isLoading, mutate} = useSWR(
    token && selectedCategory ? [endpoint, token] : null,
    fetcher, {
        refreshInterval: 1000,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        errorRetryCount: 3,
    }
  )
  console.log(error);
  console.log(response);
  console.log(tenantInformation)
  useEffect(() => {
    if (response) {
        setTenantInformation(response?.data || '');
        setLoading(false);
    }else if(isLoading){
        setLoading(true);
    }
  }, [response, isLoading, setLoading]);

  console.log(selectedItem)

  const handleDelete = async() => {
    const userDataString = localStorage.getItem("userDetails"); // get the user data from local storage
    const userData = JSON.parse(userDataString); // parse the datastring into json
    const accessToken = userData.accessToken;

    if(accessToken) {
      let success = true;
      for(const tenantId of selectedItem){
        setLoading(true);
        try{
          const response = await fetch(`http://127.0.0.1:8000/api/delete_tenant_information/${tenantId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          })
          const data = await response.json();
          console.log(data.data)
          if(!response.ok){
            console.log(data.error);
            enqueueSnackbar(data.message, { variant: "error" });
            setSelectedItem([]);
            setLoading(false)
            success = false
          }
        }catch(error){
          console.log(error);
        }
      }
      if(success){
        enqueueSnackbar('Tenant deleted successfully', { variant: 'success' });
        setSelectedItem([]);
        setLoading(false);
        setConfirmationOpen(false);
        mutate();
      }
    }
  }

  const handleClickOpen = () => {
    let activeTenant = false;
    // Check if any selected tenant has an "Active" status
    for (const isActiveTenant of selectedItem) {
      const selectedTenant = tenantInformation.find((item) => item.id === isActiveTenant);
      if (selectedTenant?.status === "Active") {
        activeTenant = true;
        break; // Exit early if an active tenant is found
      }
    }

    if (activeTenant) {
      setOpen(true);
      return; // Prevent the deletion process from continuing
    }
    setConfirmationOpen(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) {
      return null;
    }

    try {
      const parseDate = parseISO(dateString);
      return format(parseDate, "MMMM d, yyyy");
    } catch (error) {
      console.log("Error formating Date:", error);
      return dateString;
    }
  };

  const handleClose = () => {
    setConfirmationOpen(false);
  }
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setAnchorEl(null);
  };

   // filter
   const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
    setAnchorEl(null);
   };
  // console.log()
  const handleClick = (id) => {
    router.push(`/Landlord/TenantInformation/${id}`);
  };

  const handleSort = (columnKey) => {
    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: columnKey, direction });
  };

  // const sortedUnits = [...tenantInformation].sort((a, b) => {
  //   if (a[sortConfig.key] < b[sortConfig.key]) {
  //     return sortConfig.direction === "asc" ? -1 : 1;
  //   }
  //   if (a[sortConfig.key] > b[sortConfig.key]) {
  //     return sortConfig.direction === "asc" ? 1 : -1;
  //   }
  //   return 0;
  // });

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = tenantInformation.map((n) => n.id);
      setSelectedItem(newSelected);
      return;
    }
    setSelectedItem([]);
  };

  const handleCheckBoxChange = (event, id) => {
    const selectedIndex = selectedItem.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedItem, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedItem.slice(1));
    } else if (selectedIndex === selectedItem.length - 1) {
      newSelected = newSelected.concat(selectedItem.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedItem.slice(0, selectedIndex),
        selectedItem.slice(selectedIndex + 1)
      );
    }
    setSelectedItem(newSelected);
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tenantInformation);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "tenantInformation");
    XLSX.writeFile(wb, "tenantInformation.xlsx");
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const SortAndFilter = useMemo(() => {
    if (!Array.isArray(tenantInformation)) {
      console.error("tenant information is not an array:", tenantInformation);
      return []; // Return an empty array if paymentTransaction is not an array
    }
    const filterTenant = tenantInformation.filter((tenant) => {
      const searchLower = searchTerm.toLowerCase();
      const name = `${tenant?.firstname || ""} ${tenant?.lastname || ""}`?.toLowerCase()
      const location = `${tenant?.street || ""} ${tenant?.barangay || ""}  ${tenant?.municipality || ""}`?.toLowerCase()
      const unit = `${tenant?.rental_agreement[0]?.rented_unit?.apartment_name || tenant?.rental_agreement[0]?.rented_unit?.boarding_house_name}`?.toLowerCase()
      const contact = tenant?.contact?.toString()?.toLowerCase()
      const date = tenant.rental_agreement[0].lease_start_date?.toLowerCase()
      const date2 =  tenant.rental_agreement[0].lease_end_date?.toLowerCase()
      const formatedDate = formatDate(date);
      const formatedDate2 = formatDate(date2);
      const status = tenant?.status?.toLowerCase()
      const unitType = tenant.rental_agreement[0]?.rented_unit_type?.toLowerCase() || '';

      return (
        name.includes(searchLower) ||
        location.includes(searchLower) ||
        unit.includes(searchLower) ||
        contact.includes(searchLower) ||
        formatedDate?.toLowerCase().includes(searchLower) ||
        formatedDate2?.toLowerCase().includes(searchLower) ||
        status.includes(searchLower) ||
        unitType.includes(searchLower)
      )
    })

    if (sortConfig.key) {
      filterTenant.sort((a, b) => {
        let aValue = "", bValue = "";
  
        switch (sortConfig.key) {
          case "tenantName":
            aValue = `${a.firstname || ""} ${a.lastname || ""}`.toLowerCase();
            bValue = `${b.firstname || ""} ${b.lastname || ""}`.toLowerCase();
            break;
          case "contact":
            aValue = a.contact?.toString().toLowerCase() || "";
            bValue = b.contact?.toString().toLowerCase() || "";
            break;
          case "location":
            aValue = `${a.street || ""} ${a.barangay || ""} ${a.municipality || ""}`.toLowerCase();
            bValue = `${b.street || ""} ${b.barangay || ""} ${b.municipality || ""}`.toLowerCase();
            break;
          case "unit":
            aValue = `${a.rental_agreement[0]?.rented_unit?.apartment_name || a.rental_agreement[0]?.rented_unit?.boarding_house_name || ""}`.toLowerCase();
            bValue = `${b.rental_agreement[0]?.rented_unit?.apartment_name || b.rental_agreement[0]?.rented_unit?.boarding_house_name || ""}`.toLowerCase();
            break;
          case "lease_start_date":
            aValue = new Date(a.rental_agreement[0]?.lease_start_date) || new Date(0); // Default to earliest date
            bValue = new Date(b.rental_agreement[0]?.lease_start_date) || new Date(0);
            break;
          case "lease_end_date":
            aValue = new Date(a.rental_agreement[0]?.lease_end_date) || new Date(0);
            bValue = new Date(b.rental_agreement[0]?.lease_end_date) || new Date(0);
            break;
          case "status":
            aValue = a.status?.toLowerCase() || "";
            bValue = b.status?.toLowerCase() || "";
            break;
          case "unitType":
            aValue = a.rental_agreement[0]?.rented_unit_type?.toLowerCase() || "";
            bValue = b.rental_agreement[0]?.rented_unit_type?.toLowerCase() || "";
            break;
          default:
            console.warn(`Unknown sort key: ${sortConfig.key}`);
            break;
        }
  
        // Compare values based on sort direction
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
  
    return filterTenant;
  }, [tenantInformation, searchTerm, sortConfig])



  const paginatedUnits = SortAndFilter.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  console.log(paginatedUnits)

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
                    {selectedItem.length > 0 ? (
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
                        color={'error'}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                        letterSpacing={2}
                        >
                        {selectedItem.length} Selected row(s)
                        </Typography>
                    ):(
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
                        List of Tenant
                        </Typography>
                    )}
                   
                    {selectedItem.length > 0 ? (
                      <DeleteTooltip title="Delete">
                        <IconButton
                        onClick={handleClickOpen}
                        sx={{
                            mt: 2,
                            "&:hover": { backgroundColor: "#e57373" },
                            height: "35px",
                            width: "35px",
                            mr: 2
                        }}
                        >
                        <DeleteForeverOutlinedIcon
                            sx={{ color: "#e57373", "&:hover": { color: "#fafafa" }, fontSize: '28px' }}
                        />
                        </IconButton>
                      </DeleteTooltip>
                    ):(
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
                            <IconButton  onClick={handleMenuOpen} sx={{ ml: "-0.5rem", mr: "0.6rem" }}>
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
                            {category.map((category) => (
                                <MenuItem
                                key={category}
                                selected={category === selectedCategory}
                                onClick={() => handleCategoryChange(category)}
                                >
                                {category}
                                </MenuItem>
                            ))}
                        </Menu>
                        </Box>
                    )}
                    
                </Toolbar>
                <Table size="small" sx={{ mt: 2 }}>
                    <TableHead sx={{ backgroundColor: "whitesmoke", p: 2 }}>
                    <TableRow>
                        <StyledTableCell>
                        <Checkbox
                            color="primary"
                            onChange={handleSelectAllClick}
                            indeterminate={
                            selectedItem.length > 0 &&
                            selectedItem.length < tenantInformation.length
                            }
                            inputProps={{
                            "aria-label": "select all desserts",
                            }}
                        />
                        </StyledTableCell>
                        <StyledTableCell onClick={() => handleSort("tenantName")}>
                        Tenant{" "}
                        {sortConfig.key === "tenantName" &&
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
                        <StyledTableCell onClick={() => handleSort("contact")}>
                        Contact No.{" "}
                        {sortConfig.key === "contact" &&
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
                        <StyledTableCell onClick={() => handleSort("location")}>
                        Location{" "}
                        {sortConfig.key === "location" &&
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
                        onClick={() => handleSort("unit")}
                        >
                        Unit Name{" "}
                        {sortConfig.key === "unit" &&
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
                        onClick={() => handleSort("unitType")}
                        >
                        Property Type{" "}
                        {sortConfig.key === "unitType" &&
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
                        onClick={() => handleSort("lease_start_date")}
                        >
                        Start Occupancy{" "}
                        {sortConfig.key === "lease_start_date" &&
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
                        onClick={() => handleSort("status")}
                        >
                        Status{" "}
                        {sortConfig.key === "status" &&
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
                        {/* <StyledTableCell onClick={() => handleSort('status')}>
                                        status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                    </StyledTableCell> */}
                        <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {paginatedUnits.length > 0 ?
                      (paginatedUnits.map((unit, index) => {
                        const isSelected = selectedItem.includes(unit.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                        <StyledTableRow
                            key={unit.id}
                            tabIndex={-1}
                            selected={isSelected}
                            aria-checked={isSelected}
                            onChange={(event) =>
                            handleCheckBoxChange(event, unit.id)
                            }
                        >
                            <TableCell>
                            <Checkbox
                                color="primary"
                                checked={isSelected}
                                inputProps={{
                                "aria-labelledby": labelId,
                                }}
                            />
                            </TableCell>
                            <TableCell>{`${unit.firstname || ""} ${
                            unit.middlename || ""
                            } ${unit.lastname || ""}`}</TableCell>
                            <TableCell>{unit.contact || ""}</TableCell>
                            <TableCell>{`${unit.street}, ${unit.barangay}, ${unit.municipality}`}</TableCell>
                            <TableCell>
                            {unit?.rental_agreement[0]?.rented_unit
                                ?.apartment_name ||
                                unit?.rental_agreement[0]?.rented_unit
                                ?.boarding_house_name ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                            {unit?.rental_agreement[0]?.rented_unit
                                ?.property_type || "N/A"}
                            </TableCell>
                            <TableCell>
                            {formatDate(unit?.rental_agreement[0]?.lease_start_date) || "N/A"}
                            </TableCell>

                            <TableCell>
                            <Chip
                                label={unit.status}
                                variant="contained"
                                // backgroundColor={unit.status === 'Available' ? '#ede7f6' : 'secondary'}
                                color={
                                unit.status === "Active" ? "success" : "secondary"
                                }
                                icon={
                                unit.status === "Active" ? (
                                    <VerifiedOutlinedIcon />
                                ) : (
                                    <DoNotDisturbAltOutlinedIcon fontSize="small" />
                                )
                                }
                                sx={{
                                backgroundColor:
                                    unit.status === "Active"
                                    ? "#e8f5e9"
                                    : "#ffe0b2",
                                color:
                                    unit.status === "Active"
                                    ? "#004d40"
                                    : "#e65100",
                                "& .MuiChip-label": {
                                    color:
                                    unit.status === "Active"
                                        ? "#004d40"
                                        : "#e65100",
                                    fontWeight: 560,
                                },
                                }}
                            />
                            </TableCell>

                            <TableCell align="center">
                            <AcceptToolTip title="Edit">
                                <IconButton  sx={{'&:hover':{ backgroundColor:'#66bb6a', }, height:'35px', width:'35px'}}  onClick={() => handleEdit(unit.id)}>
                                <DriveFileRenameOutlineOutlinedIcon color='success' fontSize='medium' sx={{ '&:hover':{color:'#fafafa'}}}/>
                                </IconButton>
                            </AcceptToolTip>
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
                rowsPerPageOptions={[10, 15, 25]}
                component="div"
                count={SortAndFilter.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {/* </Box> */}
            </Box>
            </Grid>
        </Grid>
        <React.Fragment>
          <Dialog
            open={confirmationOpen}
            onClose={handleClose}
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
              <IconButton onClick={handleClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <DialogContent>
              <DialogContentText>
                <span style={{color:'#263238', fontWeight: '550px', fontSize:'17px'}}>
                Are you sure you want to remove this Item?
                </span>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle:'italic' }}>
                  This action cannot be undone. Removing this equipment may affect unit data if it is part of any unit&apos;s inclusions. Please verify that the item is not currently included in any units before proceeding.
                </Typography>
              </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0, mt: 2 }}>
              <Button onClick={handleClose} color="inherit" variant="text">
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                color="error"
                variant="contained"
                startIcon={<DeleteForeverIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Delete Equipment
              </Button>
            </DialogActions>
          </Dialog>
          <WarningActiveTenant
            open={open}
            setOpen={setOpen}
          />
        </React.Fragment>
        </Box>
    );
}
