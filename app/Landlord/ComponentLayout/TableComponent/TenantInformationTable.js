'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, TextField, IconButton, InputAdornment, Avatar, Toolbar, Typography, Box, Tooltip, InputBase, inputProps, Breadcrumbs, Link, Grid, Chip, Fab, Button, Fade, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { styled, alpha, useTheme, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import TuneIcon from '@mui/icons-material/Tune';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import DoNotDisturbAltOutlinedIcon from '@mui/icons-material/DoNotDisturbAltOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
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

const unitsData = [
  { id: 1, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'Active', tenant: 'John Doe', contact: '09369223915' },
  { id: 2, name: 'Unit 102',  propertype:'Apartment', startoccupancy: '05-29-2024', location: 'Building A', status: 'Active', tenant: 'Mark Villiar', contact: '09769243995'  },
  { id: 3, name: 'Unit 103',  propertype:'Bedspacer', startoccupancy: '01-03-2023', location: 'Building B', status: 'Active', tenant: 'Jane Smith', contact: '09369223915' },
  { id: 4, name: 'Unit 104',  propertype:'Apartment', startoccupancy: '08-23-2023', location: 'Building B', status: 'In-Active', tenant: 'Mark Doe', contact: '09369223915' },
  { id: 5, name: 'Unit 105',  propertype:'Bedspacer', startoccupancy: '02-03-2024', location: 'Building B', status: 'Active', tenant: 'Izer Alindogan', contact: '09397865491'},
  { id: 6, name: 'Unit 106',  propertype:'Bedspacer', startoccupancy: '06-18-2023', location: 'Building B', status: 'Active', tenant: 'John Domasig', contact: '09369223915' },
  { id: 7, name: 'Unit 107',  propertype:'Apartment', startoccupancy: '04-16-2024', location: 'Building B', status: 'In-Active', tenant: 'Kim Denso', contact: '09097865491' },
  { id: 8, name: 'Unit 108',  propertype:'Apartment', startoccupancy: '01-23-2024', location: 'Building B', status: 'In-Active', tenant: 'Anne Jebulan', contact: '09887765149' },
  { id: 9, name: 'Unit 109',  propertype:'BedSpacer', startoccupancy: '01-23-2023', location: 'Building B', status: 'Active', tenant: 'Maria Jalmasco', contact: '09369223915'},
  { id: 10, name: 'Unit 110', propertype:'Apartment', startoccupancy: '03-06-2024', location: 'Building B', status: 'Active', tenant: 'Jake Pure', contact: '09234189123' },
  { id: 12, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'Active', tenant: 'John Mark Erlano', contact: '09369223915' },
  { id: 13, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'Active', tenant: 'Ericson Hugo', contact: '09369223915' },
  { id: 14, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building C', status: 'Active', tenant: 'MJ Tolintino', contact: '09369223915' },
  { id: 15, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building D', status: 'In-Active', tenant: 'Mark Tahimik', contact: '09369223915' },
  { id: 16, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building D', status: 'In-Active', tenant: 'Angeline Tatlonghari', contact: '09369223915' },
  { id: 17, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building D', status: 'Active', tenant: 'Ian Garcia', contact: '09369223915' },
  { id: 18, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building C', status: 'Active', tenant: 'John Balia', contact: '09369223915' },
  { id: 19, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'Active', tenant: 'Edwin Nicolas', contact: '09369223915' },
  { id: 20, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'In-Active', tenant: 'Maloi My Baby', contact: '09369223915' },
  { id: 21, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building B', status: 'Active', tenant: 'Mikha My Love', contact: '09369223915' },
  { id: 22, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'In-Active', tenant: 'Collet Acuna', contact: '09369223915' },
  { id: 23, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'Active', tenant: 'Carlos Yolo', contact: '09369223915' },
  { id: 24, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'Active', tenant: 'Jessica Soho', contact: '09369223915' },
  { id: 25, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'Active', tenant: 'Teddy Manapao', contact: '09369223915' },
  { id: 26, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'In-Active', tenant: 'Jade Mercado', contact: '09369223915' },
  { id: 27, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'In-Active', tenant: 'Mark Jade Boral', contact: '09369223915' },
  { id: 28, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'In-Active', tenant: 'Terresa Trapane', contact: '09369223915' },
  { id: 29, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'In-Active', tenant: 'Lordes Sta.Ana', contact: '09369223915' },
  { id: 30, name: 'Unit 101',  propertype:'Apartment', startoccupancy: '01-23-2023', location: 'Building A', status: 'Active', tenant: 'Hilda Francisco', contact: '09369223915' },
  // Add more units as needed
  // Add more units as needed
  // Add more units as needed
];

export default function TenantInformationTable (){
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [selectedItem, setSelectedItem] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });


    const handleSort = (columnKey) => {
        let direction = 'asc';
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
        direction = 'desc';
        }
        setSortConfig({ key: columnKey, direction });
    };

    // Function to sort data, mapping the units data
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
        unit.startoccupancy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (unit.status && unit.status.toLowerCase().includes(searchTerm.toLowerCase()))||
        (unit.tenant && unit.tenant.toLowerCase().includes(searchTerm.toLowerCase()))||
        (unit.contact && unit.contact.toString().includes(searchTerm))
    );

    const paginatedUnits = filteredUnits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                                    List of Tenant
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
                                    />
                                </StyledTableCell>
                                <StyledTableCell  onClick={() => handleSort('name')}>
                                    Tenant {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell  onClick={() => handleSort('contact')}>
                                    Contact No. {sortConfig.key === 'contact' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell  onClick={() => handleSort('unitname')}>
                                    Unit Name {sortConfig.key === 'unitname' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell  onClick={() => handleSort('location')}>
                                    Location {sortConfig.key === 'location' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell  onClick={() => handleSort('propertype')}>
                                    Property Type {sortConfig.key === 'propertype' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell  onClick={() => handleSort('startoccupancy')}>
                                    Start Occupancy {sortConfig.key === 'startoccupancy' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                                </StyledTableCell>
                                <StyledTableCell onClick={() => handleSort('status')}>
                                    status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
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
                                            <TableCell>{unit.tenant || 'N/A'}</TableCell>
                                            <TableCell>{unit.contact || 'N/A'}</TableCell>
                                            <TableCell>{unit.name}</TableCell>
                                            <TableCell>{unit.location}</TableCell>
                                            <TableCell>{unit.propertype}</TableCell>
                                            <TableCell>{unit.startoccupancy}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={unit.status}
                                                    variant="contained"
                                                // backgroundColor={unit.status === 'Available' ? '#ede7f6' : 'secondary'}
                                                    color={unit.status === 'Active' ? 'success' : 'secondary'}
                                                    icon={unit.status === 'Active' ? <VerifiedOutlinedIcon/> : <DoNotDisturbAltOutlinedIcon fontSize='small'/>}
                                                    sx={{
                                                        backgroundColor: unit.status === 'Active' ? '#e8f5e9'  : '#ffe0b2',
                                                        color: unit.status === 'Active' ? '#004d40'  : '#e65100',
                                                        '& .MuiChip-label': {
                                                            color: unit.status === 'Active' ? '#004d40' : '#e65100',
                                                            fontWeight: 560,
                                                            
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            
                                            <TableCell align="center">
                                            <IconButton onClick={() =>  router.push('/Landlord/Apartment/[id]/RegisterTenant')}>
                                                <EditOutlinedIcon color='success'/>
                                            </IconButton>
                                            <IconButton>
                                                <DeleteForeverOutlinedIcon color='warning'/>    
                                            </IconButton>                                     
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
                    {/* </Box> */}
                    
                </Box>
            </Grid>

        </Grid>
    </Box>

    );
};

