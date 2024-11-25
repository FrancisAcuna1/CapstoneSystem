'use client'

import * as React from 'react';
import { useEffect, useState, useMemo} from 'react';
import {Box, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, IconButton, Paper, Typography, TableContainer, TablePagination, Table, Stack, TableHead, TableRow, InputBase, TableBody, Checkbox, TableCell, Chip,
Toolbar, Tooltip, } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Slide from '@mui/material/Slide';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import { format, addMonths, isSameMonth, subMonths, differenceInMonths, parseISO} from 'date-fns';
import Swal from 'sweetalert2'; 
import Image from 'next/image';
import EditRecurringModal from '../ModalComponent/EditRecurringModal';
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
import { SnackbarProvider, useSnackbar} from 'notistack';



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
      fontSize: '15px'
    },
  }));



const StyledTableCell = styled(TableCell)({
    fontWeight: 'bold', 
    letterSpacing: '1px', 
    fontSize: '14px', 
    color: '#263238' 
});
const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({
     backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.2) : 'inherit', color: '#263238' 
}));

const StyledTablebody = styled(TableCell)({
    fontSize: '15px',
    color: '#212121',
    letterSpacing: '0.5px',
  });


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


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

export default function RecurringDialog({Open, setOpen, openRecurringModal, setOpenRecurringModal, handleCloseModal, openDialog, handleClose, selectedRecurringItem, setLoading, setSuccessful, setError, refreshData,  setIsEditing, isEditing, editItemId, setEditItemId}) {
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const { enqueueSnackbar } = useSnackbar();
    const [page, setPage] = React.useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [dialogAlertOpen, setDialogAlertOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState([]);
    // const [editItemId, setEditItemId] = useState([]);


    console.log(selectedRecurringItem)
    console.log(selectedItem)
    console.log(editItemId)

    const handleSave = async(e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;
        
        if(accessToken){
            let success = true;
            for(const recurringId  of selectedItem){
                console.log(`Marking ID ${recurringId} as paid`);
                setLoading(true);
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/markaspaid/${recurringId }`,{
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
                    console.log(response)
                    const data = await response.json();
                    if(!response.ok){
                        console.log(data.error);
                        localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        window.location.reload();
                        setSelectedItem([]);
                        handleClose();
                        setLoading(false);
                    }
                }catch(error){
                    console.log('Error', error)
                }
            }
            if(success){
                Swal.fire({
                    icon: 'success',
                    title: 'Payments Processed',
                    text: 'All selected tenant payments have been recorded successfully.',
                    confirmButtonText: 'OK',
                });
                handleClose();
                setSelectedItem([]);
                refreshData()
            }
        }else{
            console.log('No token Found!')
        }
    }

    const handleDialogOpen = () => {
        setDialogAlertOpen(true)
    }

    const handleDialogClose = () => {
        setDialogAlertOpen(false)
    }

    const handleDelete = async(e) => {
        e.preventDefault();
        const userDataString = localStorage.getItem('userDetails'); // get the user data from local storage
        const userData = JSON.parse(userDataString); // parse the datastring into json 
        const accessToken = userData.accessToken;

        if(accessToken){
            setLoading(true);
            let success = true;
            let data 
            for(const deleteId of selectedItem){
                try{               
                    const response = await fetch(`http://127.0.0.1:8000/api/delete/${deleteId}`,{
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })

                    data = await response.json();
                    if(!response.ok){
                        console.log(data.error);
                        // localStorage.setItem('errorMessage', data.message || 'Operation Error!');
                        enqueueSnackbar(data.message, {variant: 'error'})
                        refreshData()
                        setSelectedItem([]);
                        handleClose();
                        handleDialogClose();
                        setLoading(false);
                        success = false
                    }
                }catch(error){
                    console.log('Error', error)
                }
            }
            if(success){
                // localStorage.setItem('successMessage', data.message || 'Operation Error!');
                enqueueSnackbar(data.message, {variant: 'success'})
                refreshData()
                setSelectedItem([]);
                handleClose();
                setLoading(false);
                handleDialogClose()
               
            }
        }
    }

    const handleEdit = (id) => {
        setEditItemId(id)
        setOpenRecurringModal(true);
    }
    console.log(editItemId)

    useEffect(() => {
        const successMessage = localStorage.getItem('successMessage');
        const errorMessage = localStorage.getItem('errorMessage');
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
    })


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

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelected = paginatedRecurringExpenses.map((n) => n.id);
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
    

    const sortedUnits = selectedRecurringItem && Array.isArray(selectedRecurringItem)
    ? [...selectedRecurringItem].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    })
    : [];
      // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        if (!Array.isArray(selectedRecurringItem?.otherExpenses)) {
            return [];
        }
    
        const filterRecurring = selectedRecurringItem?.otherExpenses.filter((payment) => {
            const searchLower = searchTerm.toLowerCase();
            const tenantName = `${payment.tenant?.firstname || ''} ${payment.tenant?.lastname || ''}`.toLowerCase();
            const contact = payment.tenant?.contact?.toLowerCase() || '';
            const rentedUnit = payment.rented_unit_type === 'Apartment' 
                ? payment.rented_unit?.apartment_name?.toLowerCase() || ''
                : payment.rented_unit?.boarding_house_name?.toLowerCase() || '';
            const amount = payment.deposit?.toString() || '';
            const date = payment.lease_start_date;
            const formatedDate = formatDate(date)
    
            return (
                tenantName.includes(searchLower) ||
                rentedUnit.includes(searchLower) ||
                contact.includes(searchLower) ||
                amount.includes(searchLower) ||
                formatedDate.toLowerCase().includes(searchLower)
            );
        });
    
        if (sortConfig.key) {
            filterRecurring.sort((a, b) => {
                 // Handle nested sorting for different columns
                 let aValue, bValue;
      
                switch(sortConfig.key) {
                    case 'name':
                        aValue = `${a.tenant?.firstname || ''} ${a.tenant?.lastname || ''}`.toLowerCase();
                        bValue = `${b.tenant?.firstname || ''} ${b.tenant?.lastname || ''}`.toLowerCase();
                        break;
                    case 'unit':
                        aValue = a.rented_unit?.apartment_name?.toLowerCase() || '';
                        bValue = b.rented_unit?.apartment_name?.toLowerCase() || '';
                        break;
                    case 'amount':
                        aValue = a.rental_fee;
                        bValue = b.rental_fee;
                        break;
                    case 'date':
                        aValue = new Date(a.lease_start_date);
                        bValue = new Date(b.lease_start_date);
                        break;
                    default:
                        aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
                        bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
                }
                if(aValue < bValue){
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if(aValue > bValue){
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
      
        return filterRecurring;
    }, [selectedRecurringItem, searchTerm, sortConfig]);
    const paginatedRecurringExpenses = filteredAndSortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    console.log(filteredAndSortedData)

    return (
        <React.Fragment>
        {/* <Button variant="outlined" onClick={handleClickOpen}>
            Open full-screen dialog
        </Button> */}
        <Dialog
            // fullScreen
            fullWidth={true}
            maxWidth={'xl'}
            open={openDialog}
            onClose={handleClose}
            TransitionComponent={Transition}
            sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Semi-transparent background
                backdropFilter: 'blur(2px)', // Apply blur effect
            }}
        >
            <DialogTitle 
                sx={{ 
                m: 0, 
                p: 2,
                backgroundColor: '#8785d0',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                }}
            >
                Recurring Expenses
            </DialogTitle>
            <IconButton onClick={handleClose}  sx={{'&:hover':{backgroundColor:'#fefefe'}, position: 'absolute', right: 8, top: 8, height:'35px',width:'35px',}}>
                <CloseIcon sx={{color: '#fefefe', transition: 'transform 0.3s ease-in-out','&:hover': {transform: 'rotate(90deg)', color:'#263238'}, }} />
            </IconButton>
            <DialogContent dividers
            sx={{
                backgroundColor:'#f5f5f5',
            }}
            >
                
               <Paper>
               <Toolbar 
                sx={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 2,
                    // backgroundColor: 'white',
                    // borderRadius: '8px',
                    // boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    mt:3,
                }}
                >
                {selectedItem.length > 0 ? (
                    <Typography
                    sx={{color:'#263238', flex: '1 1 100%', mt:'1rem',  mb: '0.4rem', fontSize: {xs: '18px', sm: '18px', md:'18px', lg:'18px'} }}
                    variant="h4"
                    id="tableTitle"
                    component="div"
                    letterSpacing={0.2}
                    >
                        {selectedItem.length} Selected Item
                    </Typography>
                ): (
                    <Typography
                    sx={{color:'#263238', flex: '1 1 100%', mt:'1rem',  mb: '0.4rem', fontSize: {xs: '18px', sm: '18px', md:'18px', lg:'22px'} }}
                    variant="h4"
                    id="tableTitle"
                    component="div"
                    letterSpacing={2}
                    >
                        List of Recurring Expenses
                    </Typography>
                )}
              
                {selectedItem.length > 0 ? (
                    <CustomTooltip title="Delete" >
                        <IconButton onClick={handleDialogOpen} sx={{mt:2, '&:hover':{backgroundColor:'#e57373'}, height:'35px', width:'35px', }}>
                            <DeleteForeverIcon fontSize='medium' sx={{color:'#e57373', '&:hover':{color:'#fafafa'}}}/>
                        </IconButton>
                    </CustomTooltip>
                ):(
                <Box sx={{ display: 'flex', alignItems: 'center', mt:2 }}>
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
                </Box>
                )}
                </Toolbar>
               <TableContainer sx={{ overflowy: 'auto', width: '100%', mb:3, mt:2  }}>
                    <Table size='medium'>
                        <TableHead sx={{ backgroundColor: '#e0e0e0', p: 2 }}>
                            <TableRow>
                                <StyledTableCell> 
                                    <Checkbox
                                        color="primary"
                                        onChange={handleSelectAllClick}
                                        indeterminate={selectedItem.length > 0 && selectedItem.length < selectedRecurringItem.length}
                                        inputProps={{
                                            'aria-label': 'select all desserts',
                                        }}
                                        // checked={isSelected}
                                        // inputProps={{
                                        // 'aria-labelledby': labelId,
                                        // }}
                                    />
                                </StyledTableCell>
                                <StyledTableCell align='center'>Date</StyledTableCell>
                                <StyledTableCell  align='center'>Description</StyledTableCell>
                                <StyledTableCell  align='center'>Unit Name</StyledTableCell>
                                <StyledTableCell align='center'>Category</StyledTableCell>
                                <StyledTableCell  align='center'>Type of Bills</StyledTableCell>
                                <StyledTableCell  align='center'>Amount</StyledTableCell>
                                <StyledTableCell  align='center'>Frequency</StyledTableCell>
                                <StyledTableCell  align='center'>Paid</StyledTableCell>
                                <StyledTableCell  align='center'>Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{backgroundColor:'white'}}>
                            {paginatedRecurringExpenses.length > 0 ? (
                                paginatedRecurringExpenses.map((recurring, index) => {
                                    const isSelected = selectedItem.includes(recurring.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    return(
                                        <StyledTableRow
                                            key={recurring.id}
                                            tabIndex={-1}
                                            selected={isSelected} 
                                            aria-checked={isSelected} 
                                            onChange={(event) => handleCheckBoxChange(event, recurring.id)}
                                        >
                                        <StyledTablebody>
                                            <Checkbox
                                                color="primary"
                                                checked={isSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                    }}
                                            />
                                        </StyledTablebody>
                                        <StyledTablebody align='center'>
                                            {formatDate(recurring.expense_date)} 
                                        </StyledTablebody>
                                        <StyledTablebody align='center'>
                                            {recurring.description} 
                                        </StyledTablebody>
                                        <StyledTablebody align='center'>
                                           {recurring.unit_type === 'Apartment' 
                                           ? recurring.unit.apartment_name
                                           : recurring.unit.boarding_house_name
                                           }
                                        </StyledTablebody>
                                        <StyledTablebody align='center'>
                                            {recurring.category}   
                                            {/* <Divider  sx={{width: '98%'}}/>
                                            <Typography sx={{fontSize: '13px', color: 'gray', fontStyle: 'italic', mt: '0.3rem'}}>
                                            {recurring.type_of_bills || '---'} 
                                            </Typography>                                  */}
                                        </StyledTablebody>
        
                                        <StyledTablebody align='center'>
                                            {recurring.type_of_bills || '---'} 
                                        </StyledTablebody>
                                        <StyledTablebody align='center'>
                                            {recurring.amount} 
                                        </StyledTablebody>
                                        <StyledTablebody align='center'>
                                        <Chip
                                            label={recurring.frequency} // You might want to add a status field in your payload
                                            variant="contained"
                                            sx={{
                                                backgroundColor: recurring.frequency === 'monthly' ? '#fff3e0' : recurring.frequency === 'daily' ? '#fbe9e7' : recurring.frequency === 'weekly' ? '#e3f2fd' : recurring.frequency === 'quarterly' ? '#fff8e1' : recurring.frequency === 'yearly' ? '#e8eaf6' : '',
                                                color: recurring.frequency === 'monthly' ? '#e65100' : recurring.frequency === 'daily' ? '#ff7043' : recurring.frequency === 'weekly' ? '#1e88e5' : recurring.frequency === 'quarterly' ? '#ffca28' : recurring.frequency === 'yearly' ? '#3f51b5' : '',
                                                fontWeight: 550
                                            }}
                                        />
                                        </StyledTablebody>
                                        <StyledTablebody align='center'>
                                            {recurring.status}
                                        </StyledTablebody>
                                        <StyledTablebody align='center'>
                                        <AcceptToolTip title="Edit">
                                            <IconButton onClick={() => handleEdit(recurring.id)} sx={{'&:hover':{backgroundColor:'#66bb6a'}, height:'35px', width:'35px'}}>
                                                <DriveFileRenameOutlineOutlinedIcon  sx={{color:'#4caf50', '&:hover':{color:'#fafafa'}}}/>
                                            </IconButton>
                                        </AcceptToolTip>
                                       {/* {selectedItem.length > 0 ? (
                                        <>
                                        </>
                                       ):(
                                        <CustomTooltip title="Delete">
                                        <IconButton onClick={() => handleClickOpen(item.id)} sx={{'&:hover':{backgroundColor:'#e57373'}, height:'35px', width:'35px'}}>
                                            <DeleteForeverOutlinedIcon  sx={{color:'#e57373', '&:hover':{color:'#fafafa'}}}/>
                                        </IconButton>
                                         </CustomTooltip>
                                       )} */}
                                        </StyledTablebody>
                                    </StyledTableRow>
                                    )
                                })
                            ):(
                               <StyledTableRow>
                                 <TableCell colSpan={12}>
                                 <Stack
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    spacing={2}
                                    sx={{ py: 4 }}
                                >
                                    <Box
                                        sx={{
                                        width: 200, // Explicit width
                                        height: 200, // Explicit height
                                        position: 'relative', // Required for Image with fill
                                        }}
                                    >
                                        <Image
                                        src="/Not found.png"
                                        alt="No data found"
                                        fill
                                        priority
                                        sizes="(max-width: 708px) 100vw, (max-width: 1000px) 50vw, 33vw"
                                        style={{
                                            objectFit: 'contain',
                                            borderRadius: '10px',
                                        }}
                                        />
                                    </Box>
                                    <Typography variant="h6" color="text.secondary">
                                        No recurring expenses found
                                    </Typography>
                                    </Stack>
                                </TableCell>
                               </StyledTableRow>
                            )}
                           
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                rowsPerPageOptions={[5, 10, 15, 25]}
                component="div"
                count={filteredAndSortedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                />
               </Paper>
            </DialogContent>
            <DialogActions sx={{backgroundColor:'#f5f5f5',}}>
                <Button 
                variant='contained'
                size='medium'
                sx={{mr:2, mt:0.5, mb:0.5}}
                onClick={handleSave}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
        <Dialog
            open={dialogAlertOpen}  
            onClose={handleDialogClose}
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
                <Button onClick={handleDialogClose} color="primary">
                Cancel
                </Button>
                <Button onClick={handleDelete} color="error" variant="contained">
                Delete
                </Button>
            </DialogActions>
        </Dialog>
        <SnackbarProvider maxSnack={3}>
            <Box sx={{display: 'none'}}>
                <EditRecurringModal
                    setLoading={setLoading}  
                    setSuccessful={setSuccessful}
                    setError={setError}
                    editItemId={editItemId}
                    // setEditItemId={setEditItemId}
                    setIsEditing={setIsEditing}
                    isEditing={isEditing}
                    openRecurringModal={openRecurringModal}
                    setOpenRecurringModal={setOpenRecurringModal}
                    handleCloseModal={handleCloseModal}
                    // setOpenSnackbar={setOpenSnackbar}
                />                    
            </Box>     
        </SnackbarProvider>



        </React.Fragment>
    );
}
