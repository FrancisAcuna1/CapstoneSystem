'use client'
import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, Table, TableBody, TableHead, TableContainer, TableRow, Toolbar,TableCell, TablePagination, Tooltip, Typography, IconButton, Skeleton, Divider} from "@mui/material";
import { styled, alpha } from '@mui/system';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';


const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  letterSpacing: '2px',
  fontSize: '15px',
  color: '#263238'
});

const StyledTableRow = styled(TableRow)(({ theme, isSelected }) => ({
  backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.2) : 'inherit',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  color: '#263238'
}));

const GeneralTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  '& .MuiTooltip-tooltip': {
    backgroundColor: '#263238',
    color: '#ffffff',
    borderRadius: '4px',
  },
});

export default function AssesmentFeeTable({ tenantId, setLoading, loading }) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  console.log('data:', paymentDetails);
  

  useEffect(() => {
    const fetchedData = async () => {
      setLoading(true); // Start loading
      const userDataString = localStorage.getItem('userDetails');

      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString); // Parse JSON
          const accessToken = userData.accessToken; // Access token
          const userId = userData.user.id; // User ID
          
          if (accessToken) {
            console.log('User ID:', userId); // Debugging line
            const response = await fetch(`http://127.0.0.1:8000/api/show_payment/${userId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });

            const result = await response.json();

            console.log('API Response:', result); // Debugging line

            if (response.ok) {
              if (result.data) {
                if (Array.isArray(result.data)) {
                  setPaymentDetails(result.data); // Array of objects
                } else {
                  setPaymentDetails([result.data.data]); // Single object
                }
              } else {
                console.error('No data in response:', result);
              }
            } else {
              console.error('Error:', response.status, result);
            }
          }
        } catch (error) {
          console.error('Error fetching payment details:', error); // Error logging
        }
      } else {
        console.error('No user data found in local storage.'); // Handling missing user data
      }
      setLoading(false); // Stop loading
    };
    
    fetchedData();
  }, [tenantId, setLoading]);

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

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(paymentDetails);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, 'payment_history.xlsx');
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

  const sortedPayments = paymentDetails.length
    ? [...paymentDetails].sort((a, b) => {
        const key = sortConfig.key;
        if (a[key] < b[key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      })
    : [];

  const filteredPayments = sortedPayments.filter((payment) =>
    (payment.tenant?.firstname && payment.tenant.firstname.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (payment.lease_start_date && payment.lease_start_date.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (payment.deposit && payment.deposit.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedPayments = filteredPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ maxWidth: 1400, margin: 'auto', overflowX: 'auto' }}>
      {/* <Paper elevation={2} sx={{ maxWidth: { xs: 312, sm: 767, md: 1000, lg: 1490 }, borderRadius: '12px' }}> */}
        <TableContainer>
          <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, bgcolor: '#f5f5f5'}}>
            <Typography
              sx={{ flex: '1 1 100%', ml:'-0.7rem', fontSize: { xs: '18px', sm: '18px', md: '18px', lg: '18px' } }}
              variant="h6"
              id="tableTitle"
              component="div"
              letterSpacing={2}
            >
              Payment History
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', }}>
              <GeneralTooltip title="Download file">
                <IconButton sx={{ ml: '-0.5rem', mr: '0.6rem' }} onClick={handleExportToExcel}>
                  <CloudDownloadOutlinedIcon fontSize='medium' />
                </IconButton>
              </GeneralTooltip>
            </Box>
          </Toolbar>
          <Divider/>
          <Table size='small'>
            <TableHead sx={{ p: 2, bgcolor:'#e0e0e0'}}>
              <TableRow>
                <StyledTableCell onClick={() => handleSort('tenant.firstname')}>
                  Tenant Name {sortConfig.key === 'tenant.firstname' && (sortConfig.direction === 'asc' ? <NorthIcon fontSize='extrasmall' /> : <SouthIcon fontSize='extrasmall' />)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('lease_start_date')}>
                  Date {sortConfig.key === 'lease_start_date' && (sortConfig.direction === 'asc' ? <NorthIcon fontSize='extrasmall' /> : <SouthIcon fontSize='extrasmall' />)}
                </StyledTableCell>
                <StyledTableCell onClick={() => handleSort('deposit')}>
                  Amount {sortConfig.key === 'deposit' && (sortConfig.direction === 'asc' ? <NorthIcon fontSize='extrasmall' /> : <SouthIcon fontSize='extrasmall' />)}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            {loading ? (
              <>
              <Grid container>
                <Grid item xs={12}>
                  <Skeleton width="215%" height={30}/>
                  <Skeleton width="215%" height={30}/>
                  <Skeleton width="215%" height={30}/>
                </Grid>
              </Grid> 
              </>
            ):(
              <TableBody>
              {paginatedPayments.map((item) => (
                <StyledTableRow key={item.id}>
                  <TableCell>{item.tenant?.firstname || 'N/A'}</TableCell>
                  <TableCell>{formatDate(item.date) || 'N/A'}</TableCell>
                  <TableCell>{item.amount || 'N/A'}</TableCell>
                </StyledTableRow>
              ))}
              </TableBody>
            )}
            
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 25]}
          component="div"
          count={filteredPayments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      {/* </Paper> */}
    </Box>
  );
}