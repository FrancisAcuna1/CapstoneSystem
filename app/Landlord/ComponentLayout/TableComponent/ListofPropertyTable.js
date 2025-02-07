'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams  } from 'next/navigation';
import {useMediaQuery,Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, IconButton, Toolbar, Typography, Box, Tooltip, InputBase, Chip, Button, ButtonGroup, Divider,  MenuItem, Menu, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Backdrop, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha, useTheme, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import TuneIcon from '@mui/icons-material/Tune';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Checkbox from '@mui/material/Checkbox';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { 
  WarningAmber as WarningAmberIcon, 
  Close as CloseIcon, 
  DeleteForever as DeleteForeverIcon 
} from '@mui/icons-material'
import * as XLSX from 'xlsx';
import TenantListDialog from '../Labraries/TenantListDialog';
import { SnackbarProvider, useSnackbar } from 'notistack';
import AlertDialog from '../Labraries/RentalUnitAlertDialog';
import NoResultUI from '../Labraries/NoResults';
  

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
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
      fontSize: '15px'
    },
  }));

  const StyledTableCell = styled(TableCell)({
    fontWeight: 'bold',
    letterSpacing: '1px',
    fontSize: '14px',
    color: '#263238',
  
    
  });
  
  const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({
      backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.2) : 'inherit', // Apply background color if selected
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.1), // Lighter on hover
      },
      color: '#263238'
  }));
  
  const DeleteTooltip = styled(({ className, ...props }) => (
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

 
const API_URL = process.env.NEXT_PUBLIC_API_URL; // Store API URL in a variable

  
export default function UnitListTable({propertyId, error, setError, loading, setLoading, setSuccessful, handleEdit, refreshTrigger, onRefresh}){
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [Dialongopen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const propsid = propertyId;
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [selectedItem, setSelectedItem] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState({id: null, type: ''}) // for selected unit to view payor list
  const [selectedDeleteProperty, setSelectedDeleteProperty] = useState({ id: null, type: '' });
  const [deleting, setDeleting] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [propertyData, setPropertyData] = useState({address: [], apartments: [], boarding_houses: [] });
  const [selectedCategory, setSelectedCategory] = useState('All');

  console.log('ID:', propsid)
  console.log('Data:', propertyData);
  console.log('data:', selectedUnit);

  const categories = ['All', 'Apartment', 'Boardinghouse', 'Available', 'Occupied'];
  console.log("Category:", selectedCategory);

  useEffect(() => {
    const fetchedData = async () => {
      const userDataString = localStorage.getItem('userDetails');
      const userData = JSON.parse(userDataString); 
      const accessToken = userData.accessToken;
      if (accessToken){
          try{
              setLoading(true);
              const url = selectedCategory === "Apartment"
              ? `${API_URL}/property/${propsid}/all_apartment`
              : selectedCategory === "Boardinghouse"
              ? `${API_URL}/property/${propsid}/all_boardinghouse`
              : selectedCategory === "Available" || selectedCategory === "Occupied"
              ? `${API_URL}/property/${propsid}/${selectedCategory}`
              : `${API_URL}/all_property/${propsid}`;


              const response = await fetch(url,{
                  method: "GET",
                  headers: {
                      "Authorization": `Bearer ${accessToken}`,
                      'Content-Type': 'application/json',
                      "Accept": "application/json",
                  }
          
              })

              const data = await response.json();

              if(response.ok){
                console.log('Data:', data)
                if(selectedCategory === "All"){
                  setPropertyData({address: {
                    street: data['0']?.street || '',
                    barangay: data['0']?.barangay || '',
                    municipality: data['0']?.municipality || ''
                },
                  apartments: data['0']?.apartments || [], 
                  boarding_houses: data['1'] || []});
                  
                }else if (selectedCategory === "Available" || selectedCategory === "Occupied"){
                  setPropertyData({apartments: data?.status || [], boarding_houses: data?.[0] || []});
                }else if (selectedCategory === "Apartment"){
                  setPropertyData({apartments: data?.data || [],  boarding_houses: [],});
                }else{
                  setPropertyData({apartments: [], boarding_houses: data?.data || []});
                }
              
                // setBoardingHouse(data['1']);
                // setPropertyType(data);
              }
              else{
                console.log('Error:', response.status)
              }

          }catch (error) {
            console.error("Error fetching data:", error);
             

          }finally {
            setLoading(false); // Set loading to false regardless of success or failure
          }
      }

    }
    fetchedData();
  }, [selectedCategory, propsid, refreshTrigger, setLoading])

  // for Dialog alert for delete 
  const handleClickOpen = (id, property_type) => {
    setSelectedDeleteProperty({ id, property_type});
    setOpen(true);

  };
  const handleClose = () => {
    setOpen(false);
  };

  // for dialog for tenant list
  const handleOpenDialog = (id, property_type) => {
    setOpenDialog(true);
    setSelectedUnit({id, property_type})
  }
  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  console.log(selectedDeleteProperty)
  console.log(selectedItem)

  const handleDelete = async() => {
    // const {id, property_type} = selectedDeleteProperty;
    let data;
    const selectedData = selectedItem.map(item => {
      const [id, propertyType] = item.split('-');
      const formatedText = propertyType === 'boardinghouse'
      ? 'Boarding House'
      : propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
      return {id: parseInt(id), property_type: formatedText};
    })

    const userDataString = localStorage.getItem('userDetails'); // get the 
    const userData = JSON.parse(userDataString); // parse the datastring into 
    const accessToken = userData.accessToken;
    console.log('Token:', accessToken)
    

    if(accessToken){
      let success = true;
      for(const {id, property_type} of selectedData){
        const property = displayedData.find(
          (item) => item.id === id && item.property_type === property_type
        );

        if (!property) {
          console.log(`Property with ID ${id} and Type ${property_type} not found`);
          continue;
        }

        try{
          setDeleting(true);
          const endpoint = property_type === "Apartment"
          ? `${API_URL}/delete_apartment/${id}`
          : `${API_URL}/delete_boardinghouse/${id}`;
  
          const response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken},`
            }
          })
  
          data = await response.json();
          console.log("Response data:", data);
          console.log("Response status:", response.status);
         
          if(!response.ok){
            success = false;
            console.log('Error deleting property')
            enqueueSnackbar(data.message, {variant: 'error'})
            setDeleting(false);
            setLoading(false);
          }
  
        }catch(error){
          console.error('An error occurred:', error);
          // setError(error.message);
        }finally{
          setDeleting(false);
        }
      }
      if(success){
        enqueueSnackbar(data.message, {variant: 'success'})
        setOpen(false);
        setLoading(false);
        setDeleting(false);
        setSelectedItem([]);
        onRefresh();
      }
      
    }
  }

  
  // useEffect(() => {
  //   const successMessage = localStorage.getItem('successMessage');
  //   const errorMessage = localStorage.getItem('errorMessage')
  //   if (successMessage) {
  //     setSuccessful(successMessage);
  //     setTimeout(() => {
  //       localStorage.removeItem('successMessage');
  //     }, 3000);
  //   }

  //   if(errorMessage){
  //     setError(errorMessage);
  //     setTimeout(() => {
  //       localStorage.removeItem('errorMessage');
  //     }, 3000);
  //   }

  
  // }, [setSuccessful, setError]);

  


  // Function to get rooms for a specific property
  const getRoomsForProperty = (propertyId) => {
    return propertyData.boarding_houses.find(bh => bh.id === propertyId)?.rooms || [];
  };


  const handleClick = (status, occupiedboardinghouseId, boardinghouseId, detailsId, occupiedid, property_type) => {
    if (status === 'Available') {
      // Navigate to the available property details page
      if (property_type === 'Apartment') {
        setLoading(true); 
        router.push(`/Landlord/Property/${propsid}/details/${detailsId}`);
      }else if (property_type === 'Boarding House'){
        setLoading(true); 
        router.push(`/Landlord/Property/${propsid}/boardinghouse/${boardinghouseId}`)
      }
    } else if (status === 'Occupied') {
      // Navigate to the occupied tenant's page
      if (property_type === 'Apartment') {
        router.push(`/Landlord/Property/${propsid}/occupiedapartment/${occupiedid}`);
      }else if (property_type === 'Boarding House'){
        router.push(`/Landlord/Property/${propsid}/occupiedboardinghouse/${occupiedboardinghouseId}`)
      }
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filteredAndSortedData.map((n) => n.uniqueKey);
      setSelectedItem(newSelected);
    } else {
      setSelectedItem([]);
    }
  };

  const handleCheckBoxChange = (event, uniqueKey) => {
      const selectedIndex = selectedItem.indexOf(uniqueKey);
      let newSelected = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedItem, uniqueKey);
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

  const handleExportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet([...propertyData.apartments, ...propertyData.boarding_houses]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Units');
      XLSX.writeFile(wb, 'units_data.xlsx');
  };
    
  //Sorting function
  const handleSort = (columnKey) => {
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);  // Reset pagination on search
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 0));
    setPage(0);  // Reset pagination when rows per page change
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Memoized filtered, sorted, and paginated data
  const filteredAndSortedData = useMemo(() => {
    // Combine apartments and boarding houses 
    const allProperties = [
      ...propertyData.apartments.map((item) => ({ ...item, uniqueKey: `${item.id}-apartment`})),
      ...propertyData.boarding_houses.map((item) => ({ ...item, uniqueKey: `${item.id}-boardinghouse`,})),
    ];

    console.log(allProperties)

    // Filter data based on search term
    const filteredData = allProperties.filter((property) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (property.apartment_name || property.boarding_house_name || '').toLowerCase().includes(searchLower) ||
        property.number_of_rooms?.toString().includes(searchLower) ||
        property.number_of_beds?.toString().includes(searchLower) ||
        property.room_number?.toString().includes(searchLower) ||
        property.street.toLowerCase().includes(searchLower) ||
        property.barangay.toLowerCase().includes(searchLower) ||
        property.municipality.toLowerCase().includes(searchLower) ||
        property.status.toLowerCase().includes(searchLower) ||
        property.property_type.toLowerCase().includes(searchLower) || 
        property.capacity.toLowerCase().includes(searchLower)
      );
    });

    // Sort data
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
        const bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
    ;
  }, [propertyData, searchTerm, sortConfig]);

  
  // Paginate data
  const displayedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, page, rowsPerPage]);
  console.log(displayedData);

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
  console.log("Category:", selectedCategory);


  const handleClickAlertOpen = () => {
    setDialogOpen(true);
  }

  const handleCloseAlert = () => {
    setDialogOpen(false);
  }
  
  console.log(selectedItem)
  
  return (
    <Box sx={{ maxWidth: 1400,  margin: 'auto', overflowX: 'auto',}}>
      <Paper elevation={3} sx={{maxWidth: { xs: 312, sm: 767,  md: 1000, lg: 1490, borderRadius: '12px', borderTop: '4px solid', borderTopColor: '#7e57c2'}}}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: { xs: 2, sm: 0 },
          }}
        >
          {selectedItem.length > 0 ? (
          <>
          <Typography
            sx={{
              flex: '1 1 100%',
              mt: '1rem',
              mb: '0.4rem',
              fontSize: { xs: '22px', sm: '18px', md: '18px', lg: '22px' },
            }}
            variant="h6"
            id="tableTitle"
            component="div"
            letterSpacing={2}
          >
           Selected Item {selectedItem.length}
          </Typography>
            
          </>
          ):(
          <>
          <Typography
            sx={{
              flex: '1 1 100%',
              mt: '1rem',
              mb: '0.4rem',
              fontSize: { xs: '22px', sm: '18px', md: '18px', lg: '22px' },
            }}
            variant="h6"
            id="tableTitle"
            component="div"
            letterSpacing={2}
          >
            List of {selectedCategory} Rental Units
          </Typography>
          </>
          )}
         
          {selectedItem.length > 0 ? (
          <>
            {selectedItem.some((selectedId) => displayedData.some(item => item.uniqueKey === selectedId && item.status === 'Occupied')) ? (
              <DeleteTooltip title="Delete">
              <IconButton 
              sx={{'&:hover':{backgroundColor:'#e57373'}, 
                height:'35px',
                width:'35px',
                mt:2,
                mr:3.3
              }} 
              onClick={() => handleClickAlertOpen()}
              >
                <DeleteForeverOutlinedIcon color='warning' fontSize='medium' sx={{ '&:hover':{color:'#fafafa'}}}/>    
              </IconButton> 
              </DeleteTooltip>
            ):(
              <DeleteTooltip>
              <IconButton 
              sx={{'&:hover':{backgroundColor:'#e57373'}, 
                height:'35px',
                width:'35px',
                mt:2,
                mr:3.3
              }} 
              onClick={() => handleClickOpen()}
              >
                <DeleteForeverOutlinedIcon color='warning' fontSize='medium' sx={{ '&:hover':{color:'#fafafa'}}}/>    
              </IconButton> 
              </DeleteTooltip>
            )}
          </>
          ):(
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mt:{xs: -1, lg: 1},
              justifyContent:'space-between',
            }}
          >
            <Search
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: { xs: '95%', sm: 'auto',}, mt: 1, }}
            >
              <SearchIconWrapper>
                <SearchIcon fontSize="small" />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search>
            <GeneralTooltip title="Filter Table">
              <IconButton  onClick={handleMenuOpen} sx={{mt: 1, mr:2 }}>
                <TuneIcon fontSize="medium" />
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
            {/* <GeneralTooltip title="Download file">
              <IconButton sx={{mt: 1, mr:2}} onClick={handleExportToExcel}>
                <CloudDownloadOutlinedIcon fontSize="medium" />
              </IconButton>
            </GeneralTooltip> */}
          </Box>
          )}
        </Toolbar>
          
      {/* <Box sx={{maxWidth: { xs: 312, sm: 767,  md: 1000, lg: 1400}}}> */}
        <TableContainer sx={{overflowX: 'auto', width: '100%'}}>
          <Table size='small' sx={{mt:2,}}>
            <TableHead sx={{backgroundColor: 'whitesmoke', p:1}}>
                <TableRow>
                <StyledTableCell> 
                  <Checkbox
                      color="primary"
                      onChange={handleSelectAllClick}
                      indeterminate={selectedItem.length > 0 && selectedItem.length < propertyData.length}
                      inputProps={{
                          'aria-label': 'select all desserts',
                      }}
                  />
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('apartment_name')}  >
                  Property Name {sortConfig.key === 'apartment_name' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell  sx={{width: '22%'}}>
                  Location {sortConfig.key === 'barangay' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('property_type')}>
                  Property Type {sortConfig.key === 'property_type' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('number_of_rooms')}  sx={{width: '8%'}}>
                  # of Rooms {sortConfig.key === 'number_of_rooms' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell  sx={{width: '8%'}}>
                  Max # of Occupants per room{sortConfig.key === 'number_of_beds' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('capacity')} sx={{width: '8%'}}>
                  Total Max Occupants {sortConfig.key === 'capacity' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('status')} sx={{width: '5%'}}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                
                <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {displayedData.length > 0 ? 
                (displayedData.map((property, index) => {
                const isSelected = selectedItem.includes(property.uniqueKey)
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow 
                    key={property.uniqueKey}  
                    tabIndex={-1}
                    selected={isSelected} 
                    aria-checked={isSelected} 
                    onChange={(event) => handleCheckBoxChange(event, property.uniqueKey)}
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
                    {property.apartment_name || property.boarding_house_name}
                      <Divider  sx={{width: '98%'}}/>
                        <Typography onClick={() => {handleOpenDialog(property.id, property.property_type)}} sx={{cursor:'pointer', fontSize: '14px', color: '#2196f3', fontStyle: 'italic', mt: '0.3rem'}}>
                          View Payor
                        </Typography>
                    </TableCell>
                    {/* <TableCell>{property.inclusion}</TableCell> */}
                    <TableCell> {`Bldg.no ${property.building_no} ${property.street} st. ${property.barangay}, ${property.municipality}`}</TableCell>
                    <TableCell>{property.property_type}</TableCell>
                    <TableCell>{property.number_of_rooms}</TableCell>
                    <TableCell>
                    {property.property_type === 'Apartment' 
                      ? 'N/A'
                      
                      : (() => {
                        const rooms = property.rooms;
                        return rooms.length > 0 
                          ? rooms.map((room) => {
                            const occupiedBeds = room.beds.filter(bed => bed.status.toLowerCase() === 'occupied');
                            const availableBeds = room.beds.filter(bed => bed.status.toLowerCase() === 'available');
                            const availableBedsInfo = availableBeds.map(bed => `Bed ${bed.bed_number}`).join(', ');
                            const occupiedBedsInfo = occupiedBeds.map(bed => `Bed ${bed.bed_number}`).join(', ');
                            const tooltipTitle = availableBeds.length > 0 
                              ? `Available: ${availableBedsInfo}`
                              : `Occupied Beds: ${occupiedBedsInfo}`;
                    
                            return (
                              <GeneralTooltip key={room.id} title={tooltipTitle} >
                                <Typography sx={{ fontSize: '12px', cursor: 'pointer'}}>
                                  Room: {room.room_number} ({occupiedBeds.length}/{room.number_of_beds})
                                </Typography>
                              </GeneralTooltip>
                            );
                          })
                          : 'No rooms available';
                      })()
                    }
                    </TableCell>
                    <TableCell>{property.capacity}</TableCell>
                  
                    <TableCell>
                      
                      <Chip
                      // variant="outlined"
                      variant="contained"
                      label={property.status}
                      // backgroundColor={property.status === 'Available' ? '#ede7f6' : 'secondary'}
                      color={property.status === 'Available' ? 'primary' : 'secondary'}
                      icon={property.status === 'Available' ? <LockOpenIcon fontSize='small'/> : <SensorOccupiedIcon fontSize='small'/>}
                      sx={{
                        backgroundColor: property.status === 'Available' ? '#d1c4e9' :  '#ffcdd2',
                        color: property.status === 'Available' ? '#673ab7'  : '#f44336',
                        '& .MuiChip-label': {
                            color: property.status === 'Available' ? '#673ab7' : '#f44336',
                            fontWeight: 560,
                            
                        }
                      }}
                      />
                    </TableCell>
                    <TableCell align="center">
                    <ViewToolTip title="View Details">
                      <IconButton sx={{'&:hover':{ backgroundColor:'#039be5', }, height:'35px', width:'35px'}} onClick={() =>  handleClick(property.status, property.id, property.id, property.id, property.id, property.property_type)}>
                          <VisibilityOutlinedIcon fontSize='medium' color='info' sx={{ '&:hover':{color:'#fafafa'}}}/>
                      </IconButton>
                    </ViewToolTip>
                  
                    <AcceptToolTip title="Edit">
                      <IconButton sx={{'&:hover':{ backgroundColor:'#66bb6a', }, height:'35px', width:'35px'}} onClick={() => handleEdit(property.id, property.property_type)}>
                          <DriveFileRenameOutlineOutlinedIcon color='success'  fontSize='medium' sx={{ '&:hover':{color:'#fafafa'}}}/>
                      </IconButton>
                    </AcceptToolTip>
                  
                    {/* <DeleteTooltip title="Delete">
                    {property.status === 'Occupied' ? 
                    <>
                    <IconButton 
                    sx={{'&:hover':{backgroundColor:'#e57373'}, 
                      height:'35px',
                      width:'35px',
                    }} 
                    onClick={() => handleClickAlertOpen()}
                    >
                        <DeleteForeverOutlinedIcon color='warning' fontSize='medium' sx={{ '&:hover':{color:'#fafafa'}}}/>    
                    </IconButton> 
                    </>
                    :
                    <>
                    <IconButton 
                    sx={{'&:hover':{backgroundColor:'#e57373'}, 
                      height:'35px',
                      width:'35px',
                    }} 
                    onClick={() => handleClickOpen(property.id, property.property_type)}
                    >
                        <DeleteForeverOutlinedIcon color='warning' fontSize='medium' sx={{ '&:hover':{color:'#fafafa'}}}/>    
                    </IconButton> 
                    </>
                    }
                    </DeleteTooltip> */}
                   
                    
                              
                    </TableCell>
                  </StyledTableRow>
                )
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
        count={filteredAndSortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        
        /> 
      </Paper>

      <React.Fragment>
        <Dialog 
          open={open} 
          onClose={handleClose} 
          maxWidth="xs" 
          fullWidth
          PaperProps={{
              sx: {
              borderRadius: 2,
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
              }
          }}
        >
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            p: 2, 
            pb: 0 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            Are you sure you want to remove this units? 
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This action cannot be undone and will permanently delete the units information.
            </Typography>
            </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0, mt:2 }}>
            <Button 
            onClick={handleClose} 
            color="inherit"
            variant="text"
            >
            Cancel
            </Button>
            <Button 
            onClick={handleDelete} 
            color="error"
            variant="contained"
            startIcon={<DeleteForeverIcon />}
            sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
            }}
            >
            Delete Units
            </Button>
        </DialogActions>
        </Dialog>
      </React.Fragment>

      <AlertDialog
      handleClose={handleCloseAlert}
      open={Dialongopen}
      />

      <SnackbarProvider maxSnack={3}>
      <TenantListDialog
        handleCloseDialog={handleCloseDialog}
        handleOpenDialog={handleOpenDialog}
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
        setSelectedUnit={setSelectedUnit}
        selectedUnit={selectedUnit}
        setLoading={setLoading}
        loading={loading}
        setError={setError}
        setSuccessful={setSuccessful}
      />
      </SnackbarProvider>
    </Box>
    
  );
};

