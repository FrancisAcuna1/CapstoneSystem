'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Divider, Paper, TextField, IconButton, InputAdornment, Avatar, Toolbar, Typography, Box, Tooltip, InputBase, inputProps, Breadcrumbs, Link, Grid, Chip, Fab, Button, Fade, FormControl, InputLabel, Select, Menu, MenuItem, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton} from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { styled, alpha, useTheme, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import TuneIcon from '@mui/icons-material/Tune';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PlagiarismOutlinedIcon from '@mui/icons-material/PlagiarismOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import Checkbox from '@mui/material/Checkbox';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import dynamic from 'next/dynamic';
const MaintenanceRequestDialog = dynamic(() => import('../Labraries/ViewMaintenanceRequestDialog'), {
  ssr: false
}) 

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


const ViewToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    '& .MuiTooltip-tooltip': {
      backgroundColor: '#2196f3', // Background color of the tooltip
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



export default function MaintenanceRequestTable ({loading, setLoading, setError, setSuccessful}){
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [scroll, setScroll] = useState('paper');
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [selectedItem, setSelectedItem] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [maintenanceRequest, setMaintenanceRequest] = useState([]);
    const [viewRequest, setViewRequest] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    const categories = ['All', 'Pending', 'Rejected', 'Accepted'];

    console.log('data:', maintenanceRequest);
    console.log(selectedCategory)
    
    useEffect(() => {
        const fetchMaintenanceRequest = async () => {
            setLoading(true)
            const userDataString = localStorage.getItem('userDetails');
            const userData = JSON.parse(userDataString); // Parse JSON
            const accessToken = userData.accessToken; // Access token
            // const userId = userData.user.id; // User ID 

            if(accessToken){
                try{
                    const url = selectedCategory === 'All' 
                    ? `http://127.0.0.1:8000/api/maintenance_request_list`
                    : `http://127.0.0.1:8000/api/filter_maintenance/${selectedCategory}`;

                    const response = await fetch(url, {
                        method: 'GET',
                        headers:{
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    })

                    const data = await response.json();
                   
                    if(response.ok){
                        console.log(data)
                        
                        setLoading(false);
                        setMaintenanceRequest(data.data);
                    }else{
                        console.log("Error", response.status, data)
                    }
                }catch(error){
                    console.error('Error fetching user data:', error);
                }
            }else{
                console.log('No user Found')
                setLoading(false)
            }
        } 
        fetchMaintenanceRequest();
    }, [selectedCategory, setLoading])
    
    const fetchedViewRequest = async (id) => {
        const userDataString = localStorage.getItem('userDetails');
        const userData = JSON.parse(userDataString);
        const accessToken = userData.accessToken;
        setLoading(true)

        if(accessToken){
            try{    
                const response = await fetch(`http://127.0.0.1:8000/api/view_request/${id}`,{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    }
                })

                const data = await response.json();
                if(response.ok){
                    console.log('data:', data.data)
                    setViewRequest(data.data)
                    setLoading(false)
                }else{
                    console.log('Error fetching user data:', data.error)
                    setLoading(false)
                }
            }catch(error){
                console.error('Error fetching user data:', error);
                setLoading(false)
            }
        }else{
            console.log('No user Found')
            setLoading(false)
        }
    }
   

    useEffect(() => {
        const successMessage = localStorage.getItem('successMessage');
        const errorMessage = localStorage.getItem('errorMessage')
        if (successMessage) {
          setSuccessful(successMessage);
          setTimeout(() => {
            localStorage.removeItem('successMessage');
          }, 3000);
        }
    
        if(errorMessage){
          setError(errorMessage);
          setTimeout(() => {
            localStorage.removeItem('errorMessage');
          }, 3000);
        }
    
      
    }, [setSuccessful, setError]);

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
    const handleClickOpen = async(id) => {
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
    

    const handleSort = (columnKey) => {
        let direction = 'asc';
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: columnKey, direction });
    };

    const sortedRequests = React.useMemo(() => {
        if (!sortConfig.key) return maintenanceRequest;
    
        return [...maintenanceRequest].sort((a, b) => {
            // Helper function to get nested property value safely
            const getNestedValue = (obj, key) => {
                const keys = key.split('.');
                return keys.reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : undefined, obj);
            };
    
            let aValue, bValue;
    
            switch (sortConfig.key) {
                case 'tenant_name':
                    aValue = `${a.tenant?.firstname || ''} ${a.tenant?.lastname || ''}`.trim();
                    bValue = `${b.tenant?.firstname || ''} ${b.tenant?.lastname || ''}`.trim();
                    break;
                case 'location':
                    aValue = a.tenant?.rental_agreement?.[0]?.rented_unit 
                        ? `${a.tenant.rental_agreement[0].rented_unit.building_no} ${a.tenant.rental_agreement[0].rented_unit.street}`
                        : '';
                    bValue = b.tenant?.rental_agreement?.[0]?.rented_unit 
                        ? `${b.tenant.rental_agreement[0].rented_unit.building_no} ${b.tenant.rental_agreement[0].rented_unit.street}`
                        : '';
                    break;
                case 'date_reported':
                    aValue = new Date(a.date_reported || 0);
                    bValue = new Date(b.date_reported || 0);
                    break;
                case 'property_type':
                    aValue = `${a.maintenanceRequest?.unit_type || ''} ${a.maintenanceRequest?.unit_type || ''}`.trim();
                    bValue = `${b.maintenanceRequest?.unit_type || ''} ${b.maintenanceRequest?.unit_type || ''}`.trim();
                    break;
                case 'reported_issue':
                    aValue = `${a.maintenanceRequest?.item_name || ''} ${a.maintenanceRequest?.item_name || ''}`.trim();
                    bValue = `${b.maintenanceRequest?.item_name || ''} ${b.maintenanceRequest?.item_name || ''}`.trim();
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
    }, [maintenanceRequest, sortConfig]);

    console.log('data:', maintenanceRequest);
    const filteredRequests = sortedRequests.filter((request) => {
        const searchStr = searchTerm.toLowerCase();
        const tenantName = `${request.tenant?.firstname} ${request.tenant?.lastname}`.toLowerCase();
    
        // Get unit info from rental agreement
        const unitInfo = request.tenant?.rental_agreement?.[0]?.rented_unit;
        
        const issue = request?.reported_issue?.toLowerCase();
        const otherissue = request?.other_issue?.toLowerCase();
        const property_Type = request?.unit_type.toLowerCase();
        const description = request.issue_description?.toLowerCase();
        const date = request?.date_reported;
        const formatedDate = formatDate(date);
    
        return (
            issue?.includes(searchStr) ||
            otherissue?.includes(searchStr) ||
            formatedDate?.toLowerCase().includes(searchStr) ||
            property_Type?.includes(searchStr) ||
            description.includes(searchStr) ||
            tenantName.includes(searchStr) ||
            request.tenant?.contact?.includes(searchStr) ||

            // Rented Unit details
            unitInfo?.boarding_house_name?.toLowerCase().includes(searchStr) ||
            unitInfo?.apartment_name?.toLowerCase().includes(searchStr) ||
            unitInfo?.building_no?.toLowerCase().includes(searchStr) ||
            unitInfo?.street?.toLowerCase().includes(searchStr) ||
            unitInfo?.barangay?.toLowerCase().includes(searchStr) ||
            unitInfo?.municipality?.toLowerCase().includes(searchStr)
        );
    });

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelectedItem(maintenanceRequest.map(n => n.id));
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
            newSelected = selectedItem.filter(item => item !== id);
        }
        setSelectedItem(newSelected);
    };

    const handleExportToExcel = () => {
    const exportData = maintenanceRequest.map(request => ({
        'Item Name': request.item_name,
        'Unit Name': request.tenant?.rental_agreement[0]?.rented_unit?.apartment_name,
        'Issue Description': request.issue_description,
        'Date Reported': request.date_reported,
        'Tenant Name': `${request.tenant?.firstname} ${request.tenant?.lastname}`,
        'Contact': request.tenant?.contact,
        'Status': request.status
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Maintenance Requests');
    XLSX.writeFile(wb, 'maintenance_requests.xlsx');
    };

    const paginatedRequests = filteredRequests.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
    );
    
    
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
                                    List of Maintenace Request
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
                            <Table size='small' sx={{mt:2}}>
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
                                <StyledTableCell onClick={() => handleSort('tenant_name')}>
                                    Tenant Name {sortConfig.key === 'tenant_name' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell sx={{width:'220px'}} onClick={() => handleSort('location')}>
                                    Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? <NorthIcon fontSize='extrasmall' justifyContent="center"/> : <SouthIcon fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('property_type')}>
                                    Property Name {sortConfig.key === 'property_type' && (sortConfig.direction === 'asc' ? <NorthIcon fontSize='extrasmall' justifyContent="center"/> : <SouthIcon fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('date_reported')}>
                                    Date Reported  {sortConfig.key === 'date_reported' && (sortConfig.direction === 'asc' ? <NorthIcon fontSize='extrasmall' justifyContent="center"/> : <SouthIcon fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('reported_issue')}>
                                    Issues Type  {sortConfig.key === 'reported_issue' && (sortConfig.direction === 'asc' ? <NorthIcon fontSize='extrasmall' justifyContent="center"/> : <SouthIcon fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell sx={{width:'200px'}} onClick={() => handleSort('issue_description')}>
                                    Description  {sortConfig.key === 'issue_description' && (sortConfig.direction === 'asc' ? <NorthIcon fontSize='extrasmall' justifyContent="center"/> : <SouthIcon fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell align="center">Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedRequests.map((info, index) => {
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
                                        <TableCell>
                                            {info.tenant.firstname} {info.tenant.lastname}
                                            <Divider  sx={{width: '98%'}}/>
                                            <Typography sx={{fontSize: '12px', color: 'gray', fontStyle: 'italic', mt: '0.3rem'}}>
                                            Contact no: {info.tenant.contact} 
                                        
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                           {rentedUnit ? 
                                            `Bldg no. ${rentedUnit.building_no}. ${rentedUnit.street}. ${rentedUnit.barangay}, ${rentedUnit.municipality}`
                                            : ''
                                           }
                                        </TableCell>

                                        <TableCell>{info.unit_type}</TableCell>
                                        <TableCell>{formatDate(info.date_reported)}</TableCell>
                                        <TableCell>{info.reported_issue || info.other_issue}</TableCell>
                                        <TableCell
                                        sx={{
                                            maxWidth: '200px',  // adjust width as needed
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}
                                        >
                                            {info.issue_description}
                                        </TableCell>
                                        <TableCell align="center">
                                        {info.status === 'pending' ?(
                                         <>
                                            <Button onClick={() => handleClickOpen(info.id)} variant="contained" size='small'>
                                                View
                                            </Button>
                                            {/* <ViewToolTip title="View">
                                                <IconButton sx={{'&:hover':{ backgroundColor:'#039be5', }, height:'35px', width:'35px'}} onClick={() => handleClickOpen(info.id)}>
                                                    <PlagiarismOutlinedIcon color='info'  sx={{ '&:hover':{color:'#fafafa'}}}/>
                                                </IconButton>
                                            </ViewToolTip> */}
                                            {/* <AcceptToolTip title="Accept">
                                                <IconButton sx={{'&:hover':{ backgroundColor:'#66bb6a', }, height:'35px', width:'35px'}} onClick={() => handleAcceptMaitenance(info.id)}>
                                                    <CheckCircleOutlineSharpIcon color='success'  sx={{ '&:hover':{color:'#fafafa'}}}/>
                                                </IconButton>
                                            </AcceptToolTip>
                                            <CustomTooltip title="Reject">                        
                                                <IconButton  sx={{'&:hover':{backgroundColor:'#e57373'}, height:'35px',width:'35px',}}>
                                                    <DeleteForeverOutlinedIcon color='warning' sx={{ '&:hover':{color:'#fafafa'}}}/>
                                                </IconButton>
                                            </CustomTooltip> */}
                                         </> 
                                        ):(
                                            <Chip
                                            variant="contained"
                                            label={info.status}
                                            // color={info.status === 'Accepted' ? '#81c784' : info.status === 'Ongoing' ? 'primary' : 'secondary'}
                                            sx={{
                                                backgroundColor: info.status === 'Accepted' ? '#c8e6c9' : '#ffcdd2',
                                                color: info.status === 'Accepted' ? '#43a047' : '#e53935',
                                                '& .MuiChip-label': {
                                                    color: info.status === 'Accepted' ? '#43a047' :  '#e53935' ,
                                                    fontWeight: 560,
                                                    
                                                }
                                            }}
                                            />
                                        ) 
                                     
                                     }
                                                                           
                                        </TableCell>
                                    </StyledTableRow>
                                    )
                                })}
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
            setSuccessful={setSuccessful}
            setError={setError}
            viewRequest={viewRequest}
        />
    </Box>

    );
};

