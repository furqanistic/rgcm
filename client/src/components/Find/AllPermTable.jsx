import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import * as React from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import * as XLSX from 'xlsx'
import { axiosInstance } from '../../config'
import Loader from '../../Loader'

const GreenBtn = styled.button`
  background-color: green;
  padding: 0.5rem 0.8rem;
  color: white;
  border: none;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
`

function exportToCSV(rows) {
  const ws = XLSX.utils.json_to_sheet(rows)
  const csv = XLSX.utils.sheet_to_csv(ws)
  const blob = new Blob([csv], { type: 'text/csv' })

  // Create a download link and click it
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = 'all_permanent_bookings.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const columns = [
  { field: 'id', headerName: 'ID', width: 50 },
  { field: 'username', headerName: 'Booked By', width: 120 },
  { field: 'host', headerName: 'Host', width: 130 },
  { field: 'contact', headerName: 'Contact', width: 130 },
  { field: 'location', headerName: 'Location', width: 120 },
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'timings', headerName: 'Timings', width: 90 },
  { field: 'totalAmount', headerName: 'Total Amount', width: 120 },
  { field: 'functionCat', headerName: 'Booking Type', width: 120 },
  { field: 'formType', headerName: 'Form Type', width: 120 },
]

export default function AllPermTable() {
  const navigate = useNavigate()

  const { data, status } = useQuery('stats-all-perm-table', async () => {
    const res = await axiosInstance.get(`/booking/permanent/`)
    if (res.data === 'No temporary bookings found') {
      throw new Error(res.data)
    }
    return res.data
  })

  if (status === 'loading') {
    return <Loader />
  }

  const rows = data.map((item) => ({
    id: item.serialNo,
    _id: item._id,
    username: item.BookedBy?.username,
    host: item.host,
    contact: item.contact,
    location: item.location,
    date: item.date,
    timings: item.timings,
    totalAmount: item.totalAmount,
    functionCat: item.functionCat,
    formType: item.formType,
  }))
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ height: '100%', width: '100%' }}>
        <GreenBtn onClick={() => exportToCSV(rows)}>Export to CSV</GreenBtn>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          onRowClick={(param) => navigate(`/view/${param.row._id}`)}
        />
      </div>
    </ThemeProvider>
  )
}
