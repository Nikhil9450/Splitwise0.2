import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState,useEffect } from 'react';



export default function DataTable({data}) {
    console.log("data--------->",data);
    const [headers,setHeaders]=useState([]);
    const [userDetails,setUserDetails]=useState([]);
    

    useEffect(() => {
    if (data && data.length > 0) {
      const updatedRows = data.map((item) => ({
        ...item,
        id: item.ID, // required by DataGrid
      }));
      setUserDetails(updatedRows);

      const headerSet = new Set();
      data.forEach((element) => {
        Object.keys(element).forEach((key) => headerSet.add(key));
      });

      const uniqueHeaders = Array.from(headerSet);
      const convertToColumns = uniqueHeaders.map((item) => ({
        field: item,
        headerName: item,
        width: 200,
      }));
      setHeaders(convertToColumns);
    }
  }, [data]); 
    // const columns = [
    //     { field: 'id', headerName: 'ID', width: 70 },
    //     { field: 'firstName', headerName: 'First name', width: 130 },
    //     { field: 'lastName', headerName: 'Last name', width: 130 },
    //     {
    //         field: 'age',
    //         headerName: 'Age',
    //         type: 'number',
    //         width: 90,
    //     },
    //     {
    //         field: 'fullName',
    //         headerName: 'Full name',
    //         description: 'This column has a value getter and is not sortable.',
    //         sortable: false,
    //         width: 160,
    //         valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    //     },
    // ];
 
    // const rows = [
    //     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    //     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    //     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    //     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    //     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    //     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    //     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    //     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    //     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    // ];

const paginationModel = { page: 0, pageSize: 5 };
  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={userDetails}
        columns={headers}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
