"use client"
import React from "react";
import { DataGrid  } from '@mui/x-data-grid';
import { Button, Chip  } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { fontWeight } from "@mui/system";

export default function TenantList (){
    const rows = [
        { id: 1, col1: 'Mark Jebula', col2: '09098877165', col3: 'Borabod Sorsogon City', col4: 'August 09, 2023', col5: 'markjebula@gmail.com'},
        { id: 2, col1: 'Maria Terresa Trapane', col2: '09098877165', col3: 'Bibingcahan Sorsogon City', col4: 'August 09, 2023', col5: 'mariaterresatrapane@gmail.com'},
        { id: 3, col1: 'Ronald Pura', col2: '09098877165', col3: 'Borabod Sorsogon City', col4: 'Vector August 09, 2023', col5: 'ronaldpura@gmail.com'},
        { id: 4, col1: 'Cythian Trapane', col2: '09098877165', col3: 'Bibingcahan Sorsogon City', col4: 'August 09, 2023', col5: 'cythiantrapane@gmail.com'},
        { id: 5, col1: 'Gina Ercilla', col2: '09098877165', col3: 'Salog Sorsogon City', col4: 'August 09, 2023', col5: 'ginaercilla@gmail.com'},
        { id: 6, col1: 'Edwin Embile', col2: '09098877165', col3: 'Borabod Sorsogon City', col4: 'August 09, 2023 ', col5: 'ediwinembile@gmail.com'},
        { id: 7, col1: 'Harold Lagamayo', col2: '09098877165', col3: 'Salog Sorsogon City', col4: 'August 09, 2023', col5: 'haroldlingayo@gmail.com'},
        { id: 8, col1: 'Hilda Jamisola', col2: '09098877165', col3: 'Salog Sorsogon City', col4: 'August 09, 2023', col5: 'hildajamisola@gmail.com'},
        { id: 9, col1: 'Troy Boral', col2: '09098877165', col3: 'Salog Sorsogon City', col4: 'August 09, 2023', col5: 'troyboral@gmail.com'},
        { id: 10, col1: 'Villma Sanchez', col2: '09098877165', col3: 'Salog Sorsogon City', col4: 'August 09, 2023', col5: 'villamasanchez@gmail.com'},
    ]
    
    const column = [
        { field: 'col1', headerName: 'Name.', width: 150, p: 10, },
        { field: 'col2', headerName: 'Contact Number', width: 150, p: 10 },
        { field: 'col3', headerName: 'Location', width: 160, p: 12, },
        { field: 'col4', headerName: 'Start Date of Occupied', width: 200, p: 10},
        { field: 'col5', headerName: 'Email.', width: 170, p: 10 },
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