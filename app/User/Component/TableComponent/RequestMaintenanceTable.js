"use client";
import React, { useId } from "react";
import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Paper,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableHead,
  TableContainer,
  TableRow,
  Toolbar,
  TableCell,
  TablePagination,
  Tooltip,
  Typography,
  IconButton,
  Chip,
  InputBase,
  Button,
  Skeleton,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled, alpha } from "@mui/system";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import TuneIcon from "@mui/icons-material/Tune";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import SearchIcon from "@mui/icons-material/Search";
import { 
    WarningAmber as WarningAmberIcon, 
    Close as CloseIcon, 
    DeleteForever as DeleteForeverIcon 
} from '@mui/icons-material'
import * as XLSX from "xlsx";
import { format, parseISO } from "date-fns";
import useSWR from "swr";
import MaintenanceRequestDialog from "../Libraries/MaintenanceRequestDialog";
import { SnackbarProvider, useSnackbar } from "notistack";
import RemarksForm from "../FormComponent/RemarksForm";
import NoResultUI from "@/app/Landlord/ComponentLayout/Labraries/NoResults";

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

const GeneralTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  "& .MuiTooltip-tooltip": {
    backgroundColor: "#263238",
    color: "#ffffff",
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
        throw new Error(response.statusText);
    }
    return response.json();
}

export default function RequestMaintenanceTable({
  loading,
  setLoading,
  handleEdit
}) {
    const { enqueueSnackbar } = useSnackbar();
    const [searchTerm, setSearchTerm] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorEl1, setAnchorEl1] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isButtonMenuOpen = Boolean(anchorEl1);
    const [selectedItem, setSelectedItem] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });
    const [userId, setUserId] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [remarksOpen, setRemarksOpen] = useState(false);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [viewId, setViewId] = useState([]);
    const [cancelId, setCancelId] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [requestMaintenanceList, setRequestMaintenanceList] = useState([]);


    const categories = ["All", "Pending", "Rejected", "Accepted"];
    console.log(selectedCategory)
    console.log(requestMaintenanceList);
    
    useEffect(() => {
        const userDataString = localStorage.getItem('userDetails');
        if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserId(userData?.user?.id || null);
        setUserToken(userData?.accessToken || null);
        }
    }, []);

    const endPoint = selectedCategory === 'All'
        ? `http://127.0.0.1:8000/api/requested_maintenance_list/${userId}`
        : `http://127.0.0.1:8000/api/filter_maintenance/${selectedCategory}/${userId}`

    const {data: response, error, isLoading} = useSWR(
        userId && userToken && selectedCategory
        ? [endPoint, userToken]
        : null,
        fetcher, {
            refreshInterval: 1000,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
            errorRetryCount: 3,
            onLoadingSlow: () => setLoading(true),
        }
    )
    console.log(error);
    console.log(loading)
    console.log(isLoading)
    useEffect(() => {
        if(response){
            setRequestMaintenanceList(response.data || '')
            setLoading(false)
        }else if(isLoading){
            setLoading(true)
        }
    }, [response, isLoading, setLoading])

    console.log(cancelId)
    console.log(viewId)
    //view accepted maintenance
    const handleViewOpen = (id) => {
        setViewOpen(true);
        setViewId(id)
    }

    const handleViewClose = () => {
        setViewOpen(false);
    }

    // delete/cancel confirmation
    const handleRemarksOpen = () => {
        setAlertDialogOpen(false)
        setRemarksOpen(true)
    };

    const handleAlertOpen = (id) => {
        setAlertDialogOpen(true)
        setCancelId(id)
    };

    const handleAlertClose = () => {
        setAlertDialogOpen(false);
    };

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

    const [currentId, setCurrentId] = useState(null); // State to track the current ID for the menu
    console.log(currentId)
    console.log(page)
    const handleMenuButton = (event, id) => {
        setAnchorEl1(event.currentTarget);
        setCurrentId(id); // Set the current ID when the menu button is clicked
    };
    const handleMenuButtonClose = (event) => {
        setAnchorEl1(null);
    }

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
        return format(parseDate, "MMMM d, yyyy");
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
        if (!sortConfig.key) return requestMaintenanceList;

        return [...requestMaintenanceList].sort((a, b) => {
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
            case "date_reported":
            aValue = new Date(a.date_reported || 0);
            bValue = new Date(b.date_reported || 0);
            break;
            case "reported_issue":
            aValue = `${a.maintenanceRequest?.item_name || ""} ${
                a.maintenanceRequest?.item_name || ""
            }`.trim();
            bValue = `${b.maintenanceRequest?.item_name || ""} ${
                b.maintenanceRequest?.item_name || ""
            }`.trim();
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
    }, [requestMaintenanceList, sortConfig]);

    const filteredRequests = sortedRequests.filter((request) => {
        const searchStr = searchTerm.toLowerCase();
        const issue = request?.reported_issue?.toLowerCase();
        const otherissue = request?.other_issue?.toLowerCase();
        const status = request?.status.toLowerCase();
        const description = request.issue_description?.toLowerCase();
        const date = request?.date_reported;
        const formatedDate = formatDate(date);

        return (
        issue?.includes(searchStr) ||
        otherissue?.includes(searchStr) ||
        status?.includes(searchStr) ||
        formatedDate?.toLowerCase().includes(searchStr) ||
        description.includes(searchStr)
        );
    });

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
                    List of Maintenace Request
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
                    </Box>
                </Toolbar>
                <Table size="medium" sx={{ mt: 2 }}>
                    <TableHead sx={{ backgroundColor: "whitesmoke", p: 2 }}>
                    <TableRow>
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
                        onClick={() => handleSort("reported_issue")}
                        >
                        Reported Issue{" "}
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
                        <StyledTableCell
                        
                        onClick={() => handleSort("issue_description")}
                        >
                        Status{" "}
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
                    {paginatedRequests.length > 0 ? 
                        (paginatedRequests.map((info, index) => {
                        const isSelected = selectedItem.includes(info.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
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
                            <TableCell>{formatDate(info.date_reported)}</TableCell>
                            <TableCell>
                            {info.reported_issue || info.other_issue}
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
                            <TableCell>
                                <Chip
                                    variant="contained"
                                    label={info.status}
                                    // color={info.status === 'Accepted' ? '#81c784' : info.status === 'Ongoing' ? 'primary' : 'secondary'}
                                    sx={{
                                    backgroundColor:
                                        info.status === "Accepted"
                                        ? "#c8e6c9"
                                        : info.status === "Rejected" 
                                        ? "#ffcdd2" 
                                        : info.status === "Pending" 
                                        ? '#e3f2fd'
                                        : '#fff3e0',
                                    // color:
                                    //     info.status === "Accepted"
                                    //     ? "#43a047"
                                    //     : "#e53935",
                                    "& .MuiChip-label": {
                                        color:
                                        info.status === "Accepted"
                                            ? "#43a047"
                                            : info.status === "Rejected" 
                                            ? '#e53935'
                                            : info.status === "Pending"
                                            ? '#3f51b5'
                                            : '#f57c00',
                                        fontWeight: 560,
                                    },
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">
                            {info.status === 'Accepted' && (
                                <Button
                                    onClick={() => handleViewOpen(info.id)}
                                    variant="contained"
                                    size="small"
                                >
                                    View Details
                                </Button>
                            )}
                            {info.status === 'Pending' && (
                                <>
                                <Menu
                                anchorEl={anchorEl1}
                                // open={isButtonMenuOpen}
                                open={Boolean(anchorEl1) && currentId === info.id}
                                onClose={handleMenuButtonClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                >
                                
                                <MenuItem
                                    onClick={() => handleEdit(currentId)}
                                    sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize:'16px',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'action.focus',
                                        outline: 'none',
                                    },
                                    padding: '8px 16px',
                                    }}
                                >
                                    <SaveAsIcon sx={{ marginRight: '8px', fontSize:'22px'}} />
                                    Edit 
                                </MenuItem>
                                <MenuItem
                                     onClick={() => handleAlertOpen(info.id)}
                                    sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize:'16px',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'action.focus',
                                        outline: 'none',
                                    },
                                    padding: '8px 16px',
                                    }}
                                >
                                    <CancelScheduleSendIcon sx={{ marginRight: '8px', fontSize:'22px' }} />
                                    Cancel
                                </MenuItem>
                                </Menu>
                                <GeneralTooltip title="Show more">
                                <IconButton
                                 onClick={(event) => handleMenuButton(event, info.id)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#9575cd',
                                    },
                                }}
                                >
                                    <MoreHorizIcon
                                    sx={{
                                        fontSize:'24px',
                                        '&:hover': {
                                        color: 'white',
                                        },
                                    }}
                                    />
                                </IconButton>
                                </GeneralTooltip>
                                </>
                            )}
                               {/* <Button
                                    onClick={() => handleAlertOpen(info.id)}
                                    variant="contained"
                                    size="small"
                                    color="error"
                                >
                                   <MoreHorizIcon/> {info.id}
                            </Button>  */}
                            {info.status === 'Rejected' && (
                                <Button
                                    onClick={() => handleViewOpen(info.id)}
                                    variant="contained"
                                    size="small"
                                >
                                    View Details
                                </Button>
                            )}
                            {info.status === 'Cancelled' && (
                                <Button
                                    onClick={() => handleViewOpen(info.id)}
                                    variant="contained"
                                    size="small"
                                >
                                    View Details 
                                </Button>
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
            </Box>
            </Grid>
        </Grid>
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
                    Confirm Cancellation
                </Typography>
                </Box>
                <IconButton onClick={handleAlertClose} size="small">
                <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent>
                <DialogContentText>
                <span style={{ color: "#263238" }}>
                    Are you sure you want to cancel this Maintenance Request?{" "}
                </span>
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0, mt: 2 }}>
                <Button onClick={handleAlertClose} color="inherit" variant="text">
                close
                </Button>
                <Button
                onClick={handleRemarksOpen}
                color="error"
                variant="contained"
                startIcon={<DeleteForeverIcon />}
                sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                }}
                >
                Yes, Cancel Request
                </Button>
            </DialogActions>
            </Dialog>
        </React.Fragment>
        <MaintenanceRequestDialog
        open={viewOpen}
        handleOpen={handleViewOpen}
        handleClose={handleViewClose}
        viewId={viewId}
        setLoading={setLoading}
        loading={loading}
        />
        <SnackbarProvider maxSnack={3}>
        <RemarksForm
            cancelId={cancelId}
            open={remarksOpen}
            setRemarksOpen={setRemarksOpen}
            setLoading={setLoading}
        />
        </SnackbarProvider>
    </Box>
  );
}
