"use client"
import React from "react";
import { DataGrid  } from '@mui/x-data-grid';
import { Button, Chip  } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DriveFileRenameOutlineOutlinedIcon from '@mui/icons-material/DriveFileRenameOutlineOutlined';
import { fontWeight } from "@mui/system";

export default function PaymentHistoryTable (){


    const rows = [
        { id: 1, col1: 'John Doe', col2: '01-25-2024', col3: '2,500',},
        { id: 2, col1: 'Maria Terresa Trapane', col2: '09098877165', col3: '2,500', },
        { id: 3, col1: 'Ronald Pura', col2: '09098877165', col3: '2,500', },
        { id: 4, col1: 'John Doe', col2: '02-25-2024', col3: '2,500', },
        { id: 5, col1: 'John Doe', col2: '03-25-2024', col3: '2,500',},
        { id: 6, col1: 'Edwin Embile', col2: '09098877165', col3: '2,500', },
        { id: 7, col1: 'Harold Lagamayo', col2: '09098877165', col3: '2,500', },
        { id: 8, col1: 'John Doe', col2: '07-25-2024', col3: '2,500',},
        { id: 9, col1: 'John Doe', col2: '04-25-2024', col3: '2,500',},
        { id: 10, col1: 'Villma Sanchez', col2: '09098877165', col3: '2,500',},
        { id: 11, col1: 'John Doe', col2: '05-25-2024', col3: '2,500',},
        { id: 12, col1: 'John Doe', col2: '06-25-2024', col3: '2,500',},
        { id: 13, col1: 'John Doe', col2: '07-25-2024', col3: '2,500',},
        { id: 14, col1: 'Maria Terresa Trapane', col2: '09098877165', col3: '2,500',},
        { id: 15, col1: 'Maria Terresa Trapane', col2: '09098877165', col3: '2,500',},
        { id: 16, col1: 'Maria Terresa Trapane', col2: '09098877165', col3: '2,500',},
        { id: 17, col1: 'Harold Lagamayo', col2: '09098877165', col3: '2,500',},
        { id: 18, col1: 'Harold Lagamayo', col2: '09098877165', col3: '2,500',},
        { id: 19, col1: 'Harold Lagamayo', col2: '09098877165', col3: '2,500',},
        { id: 20, col1: 'Harold Lagamayo', col2: '09098877165', col3: '2,500',},
        { id: 21, col1: 'John Doe', col2: '8-25-2024', col3: '2,500',},
    ]
    
    const column = [
        { field: 'col1', headerName: 'Tenant Name.', flex: 1, minWidth: 100, p: 10,  align: 'center', headerAlign: 'center'},
        { field: 'col2', headerName: 'Date', flex: 1, minWidth: 100, p: 10,  align: 'center', headerAlign: 'center'},
        { field: 'col3', headerName: 'Amount', flex: 1, minWidth: 100, p: 12,  align: 'center', headerAlign: 'center'},
    ]

    const johnDoePayments = rows.filter(row => row.col1 === 'John Doe');



    return (
        <>
            <DataGrid
                sx={{height: '100%'}}
                checkboxSelection
                rows={johnDoePayments}
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