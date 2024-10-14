'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, IconButton, InputAdornment, Avatar, Toolbar, Typography, Box, Tooltip, InputBase, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Backdrop, CircularProgress} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha, useTheme, css } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import TuneIcon from '@mui/icons-material/Tune';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
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
  { id: 1, name: 'Aircondition', },
  { id: 2, name: 'Wifi', },
  { id: 3, name: 'Gas Stove', },
  { id: 4, name: 'Rice Cooker', },
  { id: 5, name: 'Sala Set', },
  { id: 6, name: 'Electric fan', },
  { id: 7, name: 'Kitchen', },
  { id: 8, name: 'Comfort Room', },
  { id: 9, name: 'Dinning table and chairs', },
  { id: 10, name: 'Shower', },
  { id: 12, name: 'Laundery Area', },
  { id: 13, name: 'Unit 101', },
  { id: 14, name: 'Unit 101', },
  { id: 15, name: 'Unit 101', }
];

export default function EquipmentTable ({handleEdit, setSuccessful, setError, error, setLoading, loading}){
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [page, setPage] = React.useState(0);
    const [selectedItem, setSelectedItem] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [inclusionList, setInclusionList] = useState([]);
    const [deleting, setDeleting] = useState(false); //for backdrop
    const [deleteEquipment, setDeleteEquipment] = useState({})
    console.log(inclusionList)

    useEffect(() => {
        const fetchedData =  async () => {
            const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;

           
            if(accessToken){
                console.log(accessToken)
                try{
                    setLoading(true);
                    const response = await fetch('http://127.0.0.1:8000/api/inclusion_list', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                            "Accept": "application/json",
    
                        }
                    })
    
                    const data = await response.json();
                    console.log('Data fetched:', data);

                    if(response.ok){
                        if(data && Array.isArray(data.data)){
                            setInclusionList(data.data);
                            setLoading(false)
                        }else{
                            throw new Error('Unexpected data format. Data is not an array.');S
                            setLoading(false)
                        }
                    }else{
                        console.log('Error:', response.status)
                        setLoading(false)
                    }
                }catch(error){
                    setError(error.message);
                    setLoading(false);
                }finally{
                    setLoading(false)
                }
            }
            

        }
        fetchedData()

    }, [])


     // for Dialog alert for delete 
    const handleClickOpen = (id) => {
        setDeleteEquipment({id});
        setOpen(true);

    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async() => {
        const {id} = deleteEquipment;
        const userDataString = localStorage.getItem('userDetails'); // get the 
        const userData = JSON.parse(userDataString); // parse the datastring into 
        const accessToken = userData.accessToken;

        if(accessToken){
            try{
                setDeleting(true);
                const response = await fetch(`http://127.0.0.1:8000/api/delete_inclusion/${id}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                })

                const data = await response.json();
                if(response.ok){
                    setOpen(false); 
                    localStorage.setItem('successMessage', data.message || 'Operation Sucess!');
                    window.location.reload();

                }else{
                    if(data.error){
                        console.log(data.error)
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                        setOpen(false); // Close dialog after delete
                      }else{
                        console.log(data.message);
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                       
                    }                
                }

            }catch(error){
                console.error('An error occurred:', error);
            }finally{
                console.log('Error Response')
                setDeleting(false);
            }
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

  
  }, []);

    const handleSort = (columnKey) => {
        let direction = 'asc';
        if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
          direction = 'desc';
        }
        setSortConfig({ key: columnKey, direction });
    };
    
      // Function to sort data
    // Handle sorting
    const sortedUnits = inclusionList && Array.isArray(inclusionList)
    ? [...inclusionList].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    })
    : [];
 

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelected = inclusionList.map((n) => n.id);
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
        const ws = XLSX.utils.json_to_sheet(inclusionList);
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
        (unit.name && unit.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const paginatedUnits = filteredUnits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
    <Box sx={{ maxWidth: 1400,  margin: 'auto',  overflowX: 'auto',}}>
        <Paper elevation={2} sx={{maxWidth: { xs: 312, sm: 767,  md: 1000, lg: 1490, borderRadius: '12px'}}}>
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
                    List of Equipment
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
                            // checked={isSelected}
                            // inputProps={{
                            // 'aria-labelledby': labelId,
                            // }}
                        />
                    </StyledTableCell>
                    <StyledTableCell onClick={() => handleSort('name')}>
                        Equipment Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <NorthIcon   fontSize='extrasmall' justifyContent="center" color="#bdbdbd"/> : <SouthIcon  fontSize='extrasmall'/>)}
                    </StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedUnits && paginatedUnits.map((item, index) => {
                        const isSelected = selectedItem.includes(item.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                        <StyledTableRow
                            key={item.id}  
                            tabIndex={-1}
                            selected={isSelected} 
                            aria-checked={isSelected} 
                            onChange={(event) => handleCheckBoxChange(event, item.id)}
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
                            <TableCell>{item.name}</TableCell>
                            <TableCell align="center">
                            <AcceptToolTip title="Edit">
                                <IconButton onClick={() => handleEdit(item.id)}>
                                    <DriveFileRenameOutlineOutlinedIcon color='success'/>
                                </IconButton>
                            </AcceptToolTip>
                            <CustomTooltip title="Delete">
                                <IconButton onClick={() => handleClickOpen(item.id)}>
                                    <DeleteForeverOutlinedIcon color='warning' />
                                </IconButton>
                            </CustomTooltip>
                                                                
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
            count={filteredUnits.length}
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
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            >
            <DialogTitle id="delete-dialog-title">
                Confirm Deletion
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete this item? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                Cancel
                </Button>
                <Button onClick={handleDelete} color="error" variant="contained">
                Delete
                </Button>
            </DialogActions>
            </Dialog>

            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={deleting}
            >
            <CircularProgress color="inherit" />
            </Backdrop>
        </React.Fragment>

        
    </Box>

    );
};

