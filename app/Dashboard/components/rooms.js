"use client"
import React from "react";
import { DataGrid  } from '@mui/x-data-grid';
import { Button, Chip  } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { fontWeight } from "@mui/system";

export default function RoomTable (){
    const rows = [
        { id: 1, col1: 'No.1', col2: '₱3,000', col3: 'Occupied', col4: 'Edmar  Manalo', col5: '09990291325'},
        { id: 2, col1: 'No.2', col2: '₱3,000', col3: 'Available', col4: 'None', col5: 'None'},
        { id: 3, col1: 'No.3', col2: '₱3,000', col3: 'Occupied', col4: 'Vector Magtangol', col5: '09530291323'},
        { id: 4, col1: 'No.4', col2: '₱3,000', col3: 'Available', col4: 'None', col5: 'None'},
        { id: 5, col1: 'No.5', col2: '₱3,000', col3: 'Available', col4: 'None', col5: 'None'},
        { id: 6, col1: 'No.6', col2: '₱3,000', col3: 'Occupied', col4: 'KaIzer Magsaysay', col5: '09690291365'},
        { id: 7, col1: 'No.7', col2: '₱3,000', col3: 'Available', col4: 'None', col5: 'None'},
        { id: 8, col1: 'No.8', col2: '₱3,000', col3: 'Available', col4: 'None', col5: 'None'},
        { id: 9, col1: 'No.9', col2: '₱3,000', col3: 'Available', col4: 'None', col5: 'None'},
        { id: 10, col1: 'No.10', col2: '₱3,000', col3: 'Available', col4: 'None', col5: 'None'},
    ]
    
    const column = [
        { field: 'col1', headerName: 'Room No.', width: 150, p: 10, },
        { field: 'col2', headerName: 'Monthly Rate', width: 150, p: 10 },
        { field: 'col3', headerName: 'Status', width: 160, p: 12,  renderCell: (params) => (
          <Chip 
              label={params.value} 
              color={params.value === 'Available' ? 'primary' : 'secondary'} 
          />
          ),
       },
        { field: 'col4', headerName: 'Tenant Name', width: 200, p: 10},
        { field: 'col5', headerName: 'Tenant Contact No.', width: 170, p: 10 },
    ]





    return (
        <>
            <DataGrid 
                rows={rows} 
                columns={column}   
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 8 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{ 
                    // width: 500, 
                    height: '100%', 
                    overflowX: 'auto', 
                    justifyContent: 'center', 
                    textAlign: 'center' 
                }} 
            />
        </>
    )
}