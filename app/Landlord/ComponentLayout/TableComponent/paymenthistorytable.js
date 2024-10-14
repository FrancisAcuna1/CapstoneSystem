"use client"
import React, { useEffect, useState } from "react";
import { DataGrid  } from '@mui/x-data-grid';
import { Button, Chip  } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { fontWeight } from "@mui/system";

export default function PaymentHistoryTable ({tenantId, setLoading, loading}){
    const [paymentDetails, setPaymentDetails] = useState([]);

    console.log('id', tenantId)
    console.log('details:', paymentDetails);
    
    useEffect(() => {
        const fetchedData =  async () => {
            setLoading(true);
            const userDataString = localStorage.getItem('userDetails'); 
            const userData = JSON.parse(userDataString); // parse the datastring into json 
            const accessToken = userData.accessToken;
            if(accessToken){
                try{
                    const response = await fetch(`http://127.0.0.1:8000/api/show_payment/${tenantId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    })
    
                    const data = await response.json();
                    console.log(data);
                    
                    if(response.ok){
                        setLoading(false);
                        setPaymentDetails(data.data);
                    }else{
                        console.log('Error:',response.status)
                        setLoading(false);
                    }
                }catch(error){
                    console.log(error)
                }finally{
                    console.log("Error")
                }
            }
            
        }
        fetchedData();
    }, [tenantId])

    
    const rows = Array.isArray(paymentDetails) ? paymentDetails.map((payment, index) => ({
        id: index + 1,
        col1: payment?.tenant?.firstname,
        col2: payment?.lease_start_date,
        col3: payment?.deposit,
    })) : paymentDetails ? [{
        id: 1,
        col1: paymentDetails?.tenant?.firstname,
        col2: paymentDetails?.lease_start_date,
        col3: paymentDetails?.deposit,
    }] : [];

    const column = [
        { field: 'col1', headerName: 'Tenant Name.', flex: 1, minWidth: 100, p: 10, align: 'center', headerAlign: 'center' },
        { field: 'col2', headerName: 'Date', flex: 1, minWidth: 100, p: 10, align: 'center', headerAlign: 'center' },
        { field: 'col3', headerName: 'Amount', flex: 1, minWidth: 100, p: 12, align: 'center', headerAlign: 'center' },
    ]
    


    // const johnDoePayments = rows.filter(row => row.col1 === 'John Doe');



    return (
        <>
            <DataGrid
                sx={{height: '100%'}}
                checkboxSelection
                rows={rows}
                columns={column}
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                initialState={{
                    pagination: { paginationModel: { pageSize: 20 } },
                }}s
                pageSizeOptions={[10, 20, 50]}
                disableColumnResize
                density="compact"
                height={'auto'}
                // slotProps={{
                //     filterPanel: {
                //     filterFormProps: {
                //         logicOperatorInputProps: {
                //         variant: 'outlined',
                //         size: 'small',
                //         },
                //         columnInputProps: {
                //         variant: 'outlined',
                //         size: 'small',
                //         sx: { mt: 'auto' },
                //         },
                //         operatorInputProps: {
                //         variant: 'outlined',
                //         size: 'small',
                //         sx: { mt: 'auto' },
                //         },
                //         valueInputProps: {
                //         InputComponentProps: {
                //             variant: 'outlined',
                //             size: 'small',
                //         },
                //         },
                //     },
                //     },
                // }}
            />
        </>
    )
}