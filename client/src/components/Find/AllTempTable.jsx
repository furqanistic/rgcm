import { Box, Button, TextField, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { axiosInstance } from '../../config'
import Loader from '../../Loader'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4caf50',
    },
  },
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-')
}

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  {
    field: 'booked',
    headerName: 'Booking Date',
    width: 120,
    valueFormatter: (params) => formatDate(params.value),
  },
  { field: 'username', headerName: 'Booked By', width: 120 },
  { field: 'host', headerName: 'Host', width: 130 },
  { field: 'contact', headerName: 'Contact', width: 110 },
  { field: 'location', headerName: 'Location', width: 140 },
  {
    field: 'date',
    headerName: 'Date',
    width: 120,
    valueFormatter: (params) => formatDate(params.value),
  },
  { field: 'timings', headerName: 'Timings', width: 100 },
  { field: 'functionCat', headerName: 'Booking Type', width: 120 },
]

export default function AllTempTable() {
  const navigate = useNavigate()
  const [startDate, setStartDate] = useState('')

  const { data, status } = useQuery('stats-all-temp-bookings', async () => {
    const res = await axiosInstance.get(`/booking/temporary`)
    if (res.data === 'No temporary bookings found') {
      throw new Error(res.data)
    }
    return res.data
  })

  const exportToCSV = (rows) => {
    const ws = XLSX.utils.json_to_sheet(rows)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all_temp_bookings.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (status === 'loading') return <Loader />
  if (status === 'error')
    return <Typography color='error'>No temporary bookings found</Typography>

  const rows = data.map((item) => ({
    id: item.serialNo,
    _id: item._id,
    username: item.BookedBy?.username,
    host: item.host,
    contact: item.contact,
    location: item.location,
    date: new Date(item.date),
    timings: item.timings,
    functionCat: item.functionCat,
    formType: item.formType,
    booked: new Date(item.createdAt),
  }))

  const filteredRows = rows.filter((row) => {
    if (!startDate) return true
    const rowDate = new Date(row.booked).setHours(0, 0, 0, 0)
    const start = new Date(startDate).setHours(0, 0, 0, 0)
    return rowDate >= start
  })

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            alignItems: 'center',
          }}
        >
          <TextField
            label='Start Date'
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: 200 }}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={() => exportToCSV(filteredRows)}
          >
            Export to CSV
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            onRowClick={(param) => navigate(`/view/${param.row._id}`)}
            sx={{
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'background.paper',
                color: 'text.primary',
              },
              '& .MuiDataGrid-cell': {
                borderBottom: 'none',
                color: 'black',
              },
              '& .MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </Box>
      </Box>
    </ThemeProvider>
  )
}
