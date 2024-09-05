'use client'

import React from "react"
import { Button } from "@mui/material";
import { DataGrid  } from "@mui/x-data-grid";


const rows = [
    { id: 1, col1: 'Victor Magtangol', col2: '09998273123', col3: 'Barado ang Gripo', col4: 'April 1, 2024', col5: 'Apartment no.1', col6: 'Room no.1'},
    { id: 2, col1: 'Kuya Cardo', col2: '09987231251', col3: 'Wara Ilaw', col4: 'January 5, 2024', col5: 'Apartment no.3', col6: 'Room no.2'},
    { id: 3, col1: 'Tom Escobal', col2: '09369223915', col3: 'Raot ang switch', col4: 'April 5, 2024', col5: 'Apartment no.2', col6: 'Room no.3'},
    { id: 4, col1: 'kim Denso', col2: '09887717923', col3: 'basta mayroot', col4: 'January 23, 2024', col5: 'Apartment no.7', col6: 'Room no.1'},
    { id: 5, col1: 'Jokim Alindogan', col2: '09092391901', col3: 'Raot ang pinto', col4: 'March 5, 2024', col5: 'Apartment no.1', col6: 'Room no.4'},
    { id: 6, col1: 'Ian Astor', col2: '09292391501', col3: 'Wa  ra Wifi', col4: 'April 5, 2024', col5: 'Apartment no.1', col6: 'Room no.2'},
    { id: 7, col1: 'Maria Clare Bueno', col2: '09892391701', col3: 'May Ipis sa CR', col4: 'February 20, 2024', col5: 'Apartment no.4', col6: 'Room no.3'},
]

const column = [
    { field: 'col1', headerName: 'Tenant Name', width: 180, p: 10, },
    { field: 'col2', headerName: 'Phone Number', width: 180, p: 10 },
    { field: 'col3', headerName: 'Request', width: 200, p: 12 },
    { field: 'col4', headerName: 'Date Requested', width: 200, p: 12 },
    { field: 'col5', headerName: 'Apartment Name', width: 200, p: 10},
    { field: 'col6', headerName: 'Room Name', width: 170, p: 10 },
    { field: 'col7', headerName: 'Action', width: 200, justifyContent: 'center', marginLeft:100,
    renderCell: (params) => (
        <div>
                <Button variant="contained" color="success" sx={{marginRight: 2, borderRadius: 10}} >
                    Accept
                    {/* <DriveFileRenameOutlineOutlinedIcon/> */}
                </Button>
                {/* <Button variant="outlined" color="primary"  onClick={handleButtonClick}>
                    Action 1
                </Button> */}
                <Button variant="contained" color="error" sx={{borderRadius: 10}}>
                    Decline
                    {/* <DeleteOutlineIcon/> */}
                </Button>
        </div>
                                                          
                                                          
    ),
    }, 
]

export default function RequestMaintenanceTable(){
    return (
        <DataGrid 
            rows={rows} 
            columns={column}   
            initialState={{
                pagination: {
                paginationModel: { page: 0, pageSize: 10 },
                },
            }}
            disableColumnResize
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ 
                height: '100%',
                marginTop: '20px', 
                justifyContent: 'center',
                textAlign: 'center', 
                borderRadius: 0,
                overflowX: 'auto', 
                
            }} 
            // getRowClassName={getRowClassName}

        />
    )
}