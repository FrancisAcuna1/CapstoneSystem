'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams  } from 'next/navigation';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, IconButton, InputAdornment, Avatar, Toolbar, Typography, Box, Tooltip, InputBase, inputProps, Breadcrumbs, Link, Grid, Chip, Fab, Button, Fade, FormControl, InputLabel, Select, MenuItem, Divider} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { styled, alpha, useTheme, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import TuneIcon from '@mui/icons-material/Tune';
import SensorOccupiedIcon from '@mui/icons-material/SensorOccupied';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Checkbox from '@mui/material/Checkbox';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import * as XLSX from 'xlsx';

  

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
  

const unitsData = [
  { id: 1, name: 'Apartment no.1', location: 'Peralta st., Brgy. Burabod, Sor City',  propertype:'Apartment', status: 'Occupied', inclusion: 'Aircon, Kitchen, Stove, Comfort Room, Sala set', noofroom: '3', bed: '3', payor: 'John Domasig', capacity: '8' },
  { id: 2, name: 'Apartment no.2', location: 'Peralta st., Brgy. Burabod, Sor City', propertype:'Apartment', status: 'Available', inclusion: 'kitchen, Stove, Comfort Room', noofroom: '2', bed: '3', payor: 'none', capacity: '8' },
  { id: 3, name: 'Boarding House no.1', location: 'Peralta st., Brgy. Burabod, Sor City',  propertype:'Boarding House', status: 'Occupied', inclusion: 'kitchen, Stove, Sala set, Comfort Room', noofroom: '2', bed: '6', payor: 'N/A', capacity: '6'},
  { id: 4, name: 'Apartment ni Kenneth', location: 'Peralta st., Brgy. Burabod, Sor City',  propertype:'Apartment', status: 'Occupied', inclusion: 'Aircon, kitchen, Comfort Room', noofroom: '3', bed: '4', payor: 'John Doe', capacity: '10'},
  { id: 5, name: 'Boarding House ni Kuya', location: 'Peralta st., Brgy. Burabod, Sor City', propertype:'Boarding House', status: 'Available', inclusion: 'kitchen, Stove, Sala set, Comfort Room', noofroom: '1', bed: '4', payor: 'N/A', capacity: '4'},
  { id: 6, name: 'Boarding House no.4', location: 'Peralta st., Brgy. Burabod, Sor City',  propertype:'Boarding House', status: 'Occupied', inclusion: 'kitchen, Stove, Sala set, Comfort Room', noofroom: '3', bed: '9', payor: 'N/A', capacity: '9' },
  { id: 7, name: 'Apartment no.3', location: 'Peralta st., Brgy. Burabod, Sor City', propertype:'Apartment', status: 'Available', inclusion: 'Aircon, kitchen, Comfort Room', noofroom: '3', bed: '3', payor: 'none', capacity: '6' },
  { id: 8, name: 'Apartment no.4', location: 'Peralta st., Brgy. Burabod, Sor City', propertype:'Apartment', status: 'Available', inclusion: 'Aircon, kitchen, Comfort Room', noofroom: '2', bed: '3' ,payor: 'N/A', capacity: '6' },
  { id: 9, name: 'Apartment no.5', location: 'Peralta st., Brgy. Burabod, Sor City',  propertype:'Apartment', status: 'Occupied', inclusion: 'Aircon, kitchen, Comfort Room', noofroom: '3', bed: '12', payor: 'Victor Magtanggol', capacity: '12' },
  { id: 10, name: 'Boarding House', location: 'Peralta st., Brgy. Burabod, Sor City', propertype:'Boarding House', status: 'Occupied', inclusion: 'Aircon, kitchen, Comfort Room', noofroom: '2', bed: '8', payor: 'N/A', capacity: '8' },
];

export default function UnitListTable({params}){
  const router = useRouter();
  const searchParams = useSearchParams();
  // const propsId = params.id;
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });


    const apartmentId = searchParams.get('id');
    

  const handleClick = (status, id, propertype) => {
    if (status === 'Available') {
      // Navigate to the available property details page
      if (propertype === 'Apartment') {
        router.push(`/Landlord/Property/[propsid]/details/${id}`);
      }else if (propertype === 'Boarding House'){
        router.push(`/Landlord/Property/[propsid]/boardinghouse/${id}`)
      }
    } else if (status === 'Occupied') {
      // Navigate to the occupied tenant's page
      if (propertype === 'Apartment') {
        router.push(`/Landlord/Property/[propsid]/occupiedapartment/${id}`);
      }else if (propertype === 'Boarding House'){
        router.push(`/Landlord/Property/[propsid]/boardinghouse/${id}`)
      }
    }
  };

  const handleSort = (columnKey) => {
      let direction = 'asc';
      if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key: columnKey, direction });
  };
  
    // Function to sort data
  const sortedUnits = [...unitsData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
  });

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

  const handleExportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(unitsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Units');
      XLSX.writeFile(wb, 'units_data.xlsx');
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


  const filteredUnits = sortedUnits.filter((unit) =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.propertype.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (unit.tenant && unit.tenant.toLowerCase().includes(searchTerm.toLowerCase()))||
    (unit.contact && unit.contact.toString().includes(searchTerm))
  );

  const paginatedUnits = filteredUnits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ maxWidth: 1400,  margin: 'auto', overflowX: 'auto',}}>
        
      <Paper elevation={3} sx={{maxWidth: { xs: 312, sm: 767,  md: 1000, lg: 1490, borderRadius: '12px'  }}}>
      {/* <Box sx={{maxWidth: { xs: 312, sm: 767,  md: 1000, lg: 1400}}}> */}
        <TableContainer sx={{overflowX: 'auto', width: '100%'}}>
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
                
            <Typography
                sx={{ flex: '1 1 100%', mt:'0.4rem',  mb: '0.4rem', fontSize: {xs: '18px', sm: '18px', md:'18px', lg:'22px'} }}
                variant="h6"
                id="tableTitle"
                component="div"
                letterSpacing={2}
            >
                List of Properties
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
                  <IconButton sx={{ml: '-0.5rem', mr: '0.6rem'}}>
                      <TuneIcon fontSize='medium'/>
                  </IconButton>   
                </GeneralTooltip>
                <GeneralTooltip title="Download file">
                  <IconButton sx={{ml: '-0.5rem', mr: '0.6rem'}} onClick={handleExportToExcel}>
                      <CloudDownloadOutlinedIcon fontSize='medium'/>
                  </IconButton>
                </GeneralTooltip>
                
            </Box>
          </Toolbar>
          <Table size='small' sx={{mt:2,}}>
            <TableHead sx={{backgroundColor: 'whitesmoke', p:1}}>
                <TableRow>
                <StyledTableCell> 
                  <Checkbox
                      color="primary"
                      onChange={handleSelectAllClick}
                      indeterminate={selectedItem.length > 0 && selectedItem.length < unitsData.length}
                      inputProps={{
                          'aria-label': 'select all desserts',
                      }}
                  />
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('name')}  >
                  Property Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                {/* <StyledTableCell onClick={() => handleSort('location')} >
                  Inclusion {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell> */}
                <StyledTableCell onClick={() => handleSort('location')} >
                  Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('propertype')} sx={{width: '12%'}}>
                  Property Type {sortConfig.key === 'propertype' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('propertype')} sx={{width: '8%'}}>
                  # of Rooms {sortConfig.key === 'propertype' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('propertype')} sx={{width: '8%'}}>
                  Max # of Occupants per room{sortConfig.key === 'propertype' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('propertype')} sx={{width: '8%'}}>
                  Total Max Occupants {sortConfig.key === 'propertype' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('status')} sx={{width: '5%'}}>
                  Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                </StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUnits.map((unit, index) => {
                const isSelected = selectedItem.includes(unit.id)
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <StyledTableRow 
                    key={unit.id}  
                    tabIndex={-1}
                    selected={isSelected} 
                    aria-checked={isSelected} 
                    onChange={(event) => handleCheckBoxChange(event, unit.id)}
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
                      {unit.name} 
                      <Divider  sx={{width: '98%'}}/>
                        <Typography sx={{fontSize: '12px', color: 'gray', fontStyle: 'italic', mt: '0.3rem'}}>
                        Payor Name: {unit.payor} 
                        </Typography>
                    </TableCell>
                    {/* <TableCell>{unit.inclusion}</TableCell> */}
                    <TableCell>{unit.location}</TableCell>
                    <TableCell>{unit.propertype}</TableCell>
                    <TableCell>{unit.noofroom}</TableCell>
                    <TableCell>{unit.bed}</TableCell>
                    <TableCell>{unit.capacity}</TableCell>
                   
                    <TableCell>
                      
                      <Chip
                      // variant="outlined"
                      variant="contained"
                      label={unit.status}
                      // backgroundColor={unit.status === 'Available' ? '#ede7f6' : 'secondary'}
                      color={unit.status === 'Available' ? 'primary' : 'secondary'}
                      icon={unit.status === 'Available' ? <LockOpenIcon fontSize='small'/> : <SensorOccupiedIcon fontSize='small'/>}
                      sx={{
                        backgroundColor: unit.status === 'Available' ? '#d1c4e9' :  '#ffcdd2',
                        color: unit.status === 'Available' ? '#673ab7'  : '#f44336',
                        '& .MuiChip-label': {
                            color: unit.status === 'Available' ? '#673ab7' : '#f44336',
                            fontWeight: 560,
                            
                        }
                      }}
                      />
                    </TableCell>
                    <TableCell align="center">
                    <ViewToolTip title="View Details">
                      {/* <IconButton onClick={() =>  router.push('/Landlord/Apartment/[id]/OccupiedUnits')}>
                          <VisibilityOutlinedIcon color='info'/>
                      </IconButton> */}
                       <IconButton onClick={() =>  handleClick(unit.status, unit.id, unit.propertype)}>
                          <VisibilityOutlinedIcon fontSize='medium' color='info'/>
                      </IconButton>
                     
                    </ViewToolTip>
                   
                    <AcceptToolTip title="Edit">
                      <IconButton onClick={() =>  router.push('/Landlord/Property/[propsid]/details/[id]')}>
                          <DriveFileRenameOutlineOutlinedIcon color='success'/>
                      </IconButton>
                      {/* <IconButton onClick={() => handleClick(unit.status, unit.id, unit.propertype)}>
                          <DriveFileRenameOutlineOutlinedIcon color='success'/>
                      </IconButton> */}
                    </AcceptToolTip>

                    <DeleteTooltip title="Delete">
                      <IconButton>
                          <DeleteForeverOutlinedIcon color='warning'/>    
                      </IconButton> 
                    </DeleteTooltip>
                              
                    </TableCell>
                  </StyledTableRow>
                )
              
              
              })}
          </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[10, 15, 25]}
        component="div"
        count={filteredUnits.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        /> 
      </Paper>
    </Box>
    
  );
};

