'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, IconButton, InputAdornment, Avatar, Toolbar, Typography, Box, Tooltip, InputBase, inputProps, Breadcrumbs, Link, Grid, Chip, Fab, Button, Fade, FormControl, InputLabel, Select, MenuItem, Menu} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { styled, alpha, useTheme, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import TuneIcon from '@mui/icons-material/Tune';
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import Checkbox from '@mui/material/Checkbox';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    
    // backgroundColor: alpha(theme.palette.common.black, 0.1), // Semi-transparent background
    // '&:hover': {
    //   backgroundColor: alpha(theme.palette.common.black, 0.15),
    // },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
      width: '100%',
    },
    border: `1px solid ${alpha(theme.palette.common.black, 0.5)}`, // Border color
}));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: alpha(theme.palette.common.black, 0.5),  // Icon color
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(0.7, 1, 0.7, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '25ch',
      },
      color: theme.palette.common.black, // Text color
      fontSize: '14px'
    },
}));

const StyledTableCell = styled(TableCell)({
    fontWeight: 'bold',
    letterSpacing: '2px',
    fontSize: '15px',
    color: '#263238'
});

const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({
        backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.2) : 'inherit', // Apply background color if selected
        '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1), // Lighter on hover
        },
        color: '#263238'
}));

const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    '& .MuiTooltip-tooltip': {
    backgroundColor: '#e57373', // Background color of the tooltip
    color: '#ffffff', // Text color
    borderRadius: '4px',
    },
});

const AcceptToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    '& .MuiTooltip-tooltip': {
    backgroundColor: '#4caf50', // Background color of the tooltip
    color: '#ffffff', // Text color
    borderRadius: '4px',
    },
});

const GeneralTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    '& .MuiTooltip-tooltip': {
    backgroundColor: '#263238', // Background color of the tooltip
    color: '#ffffff', // Text color
    borderRadius: '4px',
    },
});

  

export default function TenantInformationTable ({setLoading, loading}){
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [selectedItem, setSelectedItem] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [statusData, setStatuData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'To do', 'Completed', 'In Progress'];
    
    console.log('data:', statusData)
    console.log('category:', selectedCategory)

    useEffect(() => {
        const fetchData = async () => {
            const userDataString = localStorage.getItem('userDetails');
            const userData = JSON.parse(userDataString);
            const accessToken = userData?.accessToken;
            setLoading(true);

            if(accessToken){
                try{
                    const url = selectedCategory === 'All'
                    ? `http://127.0.0.1:8000/api/get_status`
                    : `http://127.0.0.1:8000/api/filter_status/${selectedCategory}`;
                    
                    const response = await fetch(url, {
                        method: 'GET',
                        headers:{
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    })

                    const data = await response.json();
                    if(response.ok){
                        setStatuData(data.data);
                        setLoading(false);
                    }else{
                        console.log('Error', data.error)
                        setLoading(false);
                    }
                }catch(error){
                    console.log('Error', error)
                }
            }else{
                console.log('No access token found!')
            }
        
        }
        fetchData();
    }, [selectedCategory, setLoading])


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

    const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
    };

    // Function to sort data
    // const sortedUnits = [...unitsData].sort((a, b) => {
    //     if (a[sortConfig.key] < b[sortConfig.key]) {
    //     return sortConfig.direction === 'asc' ? -1 : 1;
    //     }
    //     if (a[sortConfig.key] > b[sortConfig.key]) {
    //     return sortConfig.direction === 'asc' ? 1 : -1;
    //     }
    //     return 0;
    // });

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
        const newSelected = unitsData.map((n) => n.id);
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
            selectedItem.slice(selectedIndex + 1),
        );
        }
        setSelectedItem(newSelected);
    };

    // const handleExportToExcel = () => {
    //     const ws = XLSX.utils.json_to_sheet(unitsData);
    //     const wb = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Units');
    //     XLSX.writeFile(wb, 'units_data.xlsx');
    // };

    const handleExportToExcel = () => {
        const exportData = statusData.map(request => ({
            'Unit Name': request.tenant?.rental_agreement[0]?.rented_unit?.apartment_name || request.tenant?.rental_agreement[0]?.rented_unit?.boarding_house_name,
            'Location': `${request?.maintenance_request?.tenant?.rental_agreement[0]?.rented_unit?.building_no|| ''}. ${request?.maintenance_request?.tenant?.rental_agreement[0]?.rented_unit?.street|| ''} st. ${request?.maintenance_request?.tenant?.rental_agreement[0]?.rented_unit?.barangay|| ''}, ${request?.maintenance_request?.tenant?.rental_agreement[0]?.rented_unit?.municipality|| ''}  `, 
            'Property Type': request.maintenance_request?.unit_type,
            'Reported Issue': request?.maintenance_request?.reported_issue,
            'Issue Description': request?.maintenance_request?.issue_description,
            'Start Date': formatDate(request?.start_date),
            'End Date': formatDate(request?.end_date),
            'Status': request.status
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Maintenances Status');
        XLSX.writeFile(wb, 'maintenance_status.xlsx');
    }


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

    const formatDate = (dateString) => {
        if(!dateString){
            return null;
        }
    
        try{
            const parseDate = parseISO(dateString);
            return format(parseDate, 'MMM d, yyyy');
        }catch(error){
            console.log('Error formating Date:', error);
            return dateString;
        }
    }


    const sortedStatus = React.useMemo(() => {
        if (!sortConfig.key) return statusData;
    
        return [...statusData].sort((a, b) => {
            // Helper function to get nested property value safely
            const getNestedValue = (obj, key) => {
                const keys = key.split('.');
                return keys.reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : undefined, obj);
            };
    
            let aValue, bValue;
    
            switch (sortConfig.key) {
                case 'unit_name':
                    aValue = `${a.maintenance_request?.tenant?.rental_agreement?.rented_unit?.boarding_house_name || a.maintenance_request?.tenant?.rental_agreement?.rented_unit?.apartment_name}`.trim();
                    bValue = `${b.maintenance_request?.tenant?.rental_agreement?.rented_unit?.boarding_house_name || b.maintenance_request?.tenant?.rental_agreement?.rented_unit?.apartment_name}`.trim();
                    break;
                case 'location':
                    aValue = a.maintenance_request?.tenant?.rental_agreement?.[0]?.rented_unit 
                        ? `${a.maintenance_request.tenant.rental_agreement[0].rented_unit.building_no || ''} ${a.maintenance_request.tenant.rental_agreement[0].rented_unit.street || ''}`.trim()
                        : '';
                    bValue = b.maintenance_request?.tenant?.rental_agreement?.[0]?.rented_unit 
                        ? `${b.maintenance_request.tenant.rental_agreement[0].rented_unit.building_no || ''} ${b.maintenance_request.tenant.rental_agreement[0].rented_unit.street || ''}`.trim()
                        : '';
                    break;
                case 'startDate':
                    aValue = new Date(a.start_date || 0);
                    bValue = new Date(b.start_date || 0);
                    break;
                case 'endDate':
                    aValue = new Date(a.end_date || 0);
                    bValue = new Date(b.end_date || 0);
                    break;
                case 'property_type':
                    aValue = `${a.maintenance_request?.tenant.rental_agreement[0].rented_unit_type || ''} ${a.maintenance_request?.tenant.rental_agreement[0].rented_unit_type || ''}`.trim();
                    bValue = `${b.maintenance_request?.tenant.rental_agreement[0].rented_unit_type || ''} ${b.maintenance_request?.tenant.rental_agreement[0].rented_unit_type || ''}`.trim();
                    break;
                case 'reported_issue':
                    aValue = `${a.maintenance_request?.reported_issue || ''} ${a.maintenance_request?.reported_issue || ''}`.trim();
                    bValue = `${b.maintenance_request?.reported_issue || ''} ${b.maintenance_request?.reported_issue || ''}`.trim();
                    break;
                case 'status':
                    const statusOrder = {
                        'To do': 1,
                        'In Progress': 2,
                        'Completed': 3
                    };
                    
                    aValue = statusOrder[a.status] || 0;
                    bValue = statusOrder[b.status] || 0;
                    break;
                default:
                    aValue = getNestedValue(a, sortConfig.key) || '';
                    bValue = getNestedValue(b, sortConfig.key) || '';
            }
    
            // Handle string comparisons
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
    
            // Handle numeric and date comparisons
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [statusData, sortConfig]);
    
    console.log('data:', sortedStatus);
    const filteredStatus = sortedStatus.filter((status) => {
        const searchStr = searchTerm.toLowerCase();
        const tenantName = `${status.maintenance_request?.tenant?.firstname} ${status.maintenance_request?.tenant?.lastname}`.toLowerCase();
    
        // Get unit info from rental agreement
        const unitInfo = status.maintenance_request.tenant?.rental_agreement?.[0]?.rented_unit;
        
        const otherissue = status?.maintenance_request?.other_issue?.toLowerCase();
        const description = status?.maintenance_request?.issue_description?.toLowerCase();
        const reportedIssue = status?.maintenance_request?.reported_issue?.toLowerCase();
        const currentStatus = status?.status?.toLowerCase();;
        const startDate = status?.start_date;
        const endDate = status?.end_date;
        const formatedstartDate = formatDate(startDate);
        const formatedendDate = formatDate(endDate);
        const property_Type =  status?.maintenance_request?.tenant?.rental_agreement[0]?.rented_unit_type.toLowerCase();
    
        return (
            currentStatus?.includes(searchStr) ||
            otherissue?.includes(searchStr) ||
            formatedstartDate?.toLowerCase().includes(searchStr) ||
            formatedendDate?.toLowerCase().includes(searchStr) ||
            property_Type?.includes(searchStr) ||
            description.includes(searchStr) ||
            tenantName.includes(searchStr) ||
            reportedIssue.includes(searchStr) ||
            status.tenant?.contact?.includes(searchStr) ||

            // Rented Unit details
            unitInfo?.boarding_house_name?.toLowerCase().includes(searchStr) ||
            unitInfo?.apartment_name?.toLowerCase().includes(searchStr) ||
            unitInfo?.building_no?.toLowerCase().includes(searchStr) ||
            unitInfo?.street?.toLowerCase().includes(searchStr) ||
            unitInfo?.barangay?.toLowerCase().includes(searchStr) ||
            unitInfo?.municipality?.toLowerCase().includes(searchStr)
        );
    });
    const paginatedUnits = filteredStatus.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
    <Box sx={{ maxWidth: 1400,  margin: 'auto', }}>
        <Grid  container spacing={1} sx={{ mt: '-0.9rem', display:'flex', justifyContent:' center',  }}>
            <Grid item xs={12}>
                <Box elevation={3} sx={{maxWidth: { xs: 312, sm: 767,  md: 1000, lg: 1400, borderRadius: '12px'  }}}>
                    {/* <Box sx={{maxWidth: { xs: 312, sm: 767,  md: 1000, lg: 1400}}}> */}
                        <TableContainer >
                            <Toolbar
                            sx={[
                                {
                                pl: { sm: 2 },
                                pr: { xs: 1, sm: 1 },
                                },
                                // numSelected > 0 && {
                                //   bgcolor: (theme) =>
                                //     alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                                // },
                            ]}
                            >  
                                {/* {numSelected > 0 ? (
                                    <Typography
                                        sx={{ flex: '1 1 100%' }}
                                        color="inherit"
                                        variant="subtitle1"
                                        component="div"
                                    >
                                        {numSelected} selected
                                    </Typography>
                                    ) :(
                                        <Typography
                                            sx={{ flex: '1 1 100%', mt:'0.4rem',  mb: '0.4rem' }}
                                            variant="h6"
                                            id="tableTitle"
                                            component="div"
                                            letterSpacing={2}
                                        >
                                        List of Units
                                        </Typography>
                                    )}

                                

                                {numSelected > 0 ? (
                                    <Tooltip title="Delete" sx={{mt:'0.5rem', mb: '0.5rem'}}>
                                    <IconButton>
                                        <DeleteIcon color='warning' fontSize='medium'/>
                                    </IconButton>
                                    </Tooltip>
                                ) : (
                                
                                    <Box sx={{ display: 'flex',   alignItems: 'center',justifyContent: 'flex-end', mt:'1rem',  mb: '0.5rem'}}>
                                        <Search>
                                            <SearchIconWrapper>
                                            <SearchIcon fontSize='small' />
                                            </SearchIconWrapper>
                                            <StyledInputBase
                                            placeholder="Search…"
                                            inputProps={{ 'aria-label': 'search' }}
                                            />
                                        </Search>
                                        <Tooltip title="Filter Table" >
                                            <IconButton sx={{ml: '-0.5rem', mr: '0.6rem'}}>
                                                <TuneIcon fontSize='medium' color='primary'/>
                                            </IconButton>   
                                        </Tooltip>
                                        
                                    </Box>
                                
                                )} */}
                                <Typography
                                    sx={{ flex: '1 1 100%', mt:'0.4rem',  mb: '0.4rem', fontSize: {xs: '18px', sm: '18px', md:'18px', lg:'22px'} }}
                                    variant="h6"
                                    id="tableTitle"
                                    component="div"
                                    letterSpacing={2}
                                >
                                    Status of Maintenace
                                </Typography>
                                <Box sx={{ display: 'flex',   alignItems: 'center', justifyContent: 'end', mt:'1rem',  mb: '0.5rem'}}>
                                    <Search
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    >
                                        
                                        <SearchIconWrapper>
                                        <SearchIcon fontSize='small' />
                                        </SearchIconWrapper>
                                        <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        />
                                    </Search>
                                    <GeneralTooltip title="Filter Table" >
                                        <IconButton onClick={handleMenuOpen} sx={{ml: '-0.5rem', mr: '0.6rem'}}>
                                            <TuneIcon fontSize='medium'/>
                                        </IconButton>   
                                    </GeneralTooltip>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={isMenuOpen}
                                        onClose={handleMenuClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
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
                                    <GeneralTooltip title="Download file">
                                        <IconButton sx={{ml: '-0.5rem', mr: '0.6rem'}} onClick={handleExportToExcel}>
                                            <CloudDownloadOutlinedIcon fontSize='medium'/>
                                        </IconButton>
                                    </GeneralTooltip>
                                    
                                </Box>
                        
                        

                            </Toolbar>
                            <Table size='small' sx={{mt:2, fontFamily: 'Monoscope, sans-serif'}}>
                            <TableHead sx={{backgroundColor: 'whitesmoke', p:2}}>
                                <TableRow>
                                <StyledTableCell> 
                                    <Checkbox
                                        color="primary"
                                        onChange={handleSelectAllClick}
                                        indeterminate={selectedItem.length > 0 && selectedItem.length < unitsData.length}
                                        inputProps={{
                                            'aria-label': 'select all desserts',
                                        }}
                                        // checked={isSelected}
                                        // inputProps={{
                                        // 'aria-labelledby': labelId,
                                        // }}
                                    />
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('unit_name')}>
                                    Unit Name {sortConfig.key === 'unit_name' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('location')}>
                                    Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('property_type')}>
                                    Property Type {sortConfig.key === 'property_type' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('startDate')}>
                                    Date Started {sortConfig.key === 'startDate' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('endDate')}>
                                    End Date {sortConfig.key === 'endDate' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('status')}>
                                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('issuestype')}>
                                    Issues Type {sortConfig.key === 'issuestype' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                {/* <StyledTableCell onClick={() => handleSort('tenant')}>
                                    Tenant {sortConfig.key === 'tenant' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell> */}
                            
                                
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedUnits.map((info, index) => {
                                     const isSelected = selectedItem.includes(info.id);
                                     const labelId = `enhanced-table-checkbox-${index}`;
                                    return (
                                    <StyledTableRow 
                                        key={info.id}  
                                        tabIndex={-1}
                                        selected={isSelected} 
                                        aria-checked={isSelected} 
                                        onChange={(event) => handleCheckBoxChange(event, info.id)}
                                    
                                    >
                                        <TableCell>
                                            <Checkbox
                                                color="primary"
                                                checked={isSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                  }}
                                            />
                                        </TableCell>
                                        <TableCell>{info.maintenance_request.tenant.rental_agreement[0].rented_unit?.boarding_house_name || info.maintenance_request.tenant.rental_agreement[0].rented_unit?.apartment_name}</TableCell>
                                        <TableCell>
                                        {info.maintenance_request.tenant.rental_agreement[0].rented_unit?.building_no} {info.maintenance_request.tenant.rental_agreement[0].rented_unit?.street} st, {info.maintenance_request.tenant.rental_agreement[0].rented_unit?.barangay}, {info.maintenance_request.tenant.rental_agreement[0].rented_unit?.municipality}
                                        </TableCell>
                                        <TableCell>{info.maintenance_request.tenant.rental_agreement[0].rented_unit_type}</TableCell>
                                        <TableCell>{formatDate(info.start_date)}</TableCell>
                                        <TableCell>{formatDate(info.end_date)}</TableCell>
                                        <TableCell>{info.maintenance_request.reported_issue}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={info.status}
                                                variant="contained"
                                            // backgroundColor={info.status === 'Available' ? '#ede7f6' : 'secondary'}
                                                color={info.status === 'Completed' ? 'success' : info.status === 'In Progress' ? 'primary' : 'secondary'}
                                                icon={info.status === 'Completed' ? <CheckCircleOutlineSharpIcon/> : info.status === 'In Progress' ? <AutorenewOutlinedIcon fontSize='small'/> : <PushPinOutlinedIcon fontSize='small'/>}
                                                sx={{
                                                    backgroundColor: info.status === 'Completed' ? '#e8f5e9' : info.status === 'In Progress' ? '#ede7f6' : '#ffe0b2',
                                                    color: info.status === 'Completed' ? '#004d40' : info.status === 'In Progress' ? '#512da8' : '#e65100',
                                                    '& .MuiChip-label': {
                                                        color: info.status === 'Completed' ? '#004d40' : info.status === 'In Progress' ? '#512da8' : '#e65100',
                                                        fontWeight: 560,
                                                        
                                                    }
                                                }}
                                            >
                                                
                                            </Chip>
                                        </TableCell>
                                        
                                        
                                        {/* <TableCell>{info.maintenance_request.tenant.firstname || 'N/A'}</TableCell> */}
                                        
                                    </StyledTableRow>
                                    )
                                })}
                            </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 25]}
                        component="div"
                        count={filteredStatus.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    {/* </Box> */}
                    
                </Box>
            </Grid>

        </Grid>
    </Box>

    );
};

