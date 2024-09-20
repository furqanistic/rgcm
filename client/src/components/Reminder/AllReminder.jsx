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
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = 'all_bob_bookings.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'username', headerName: 'Booked By', width: 100 },
  { field: 'host', headerName: 'Host', width: 130 },
  { field: 'contact', headerName: 'Contact', width: 130 },
  { field: 'location', headerName: 'Location', width: 140 },
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'timings', headerName: 'Timings', width: 90 },
  { field: 'totalAmount', headerName: 'Total ', width: 100 },
  { field: 'advancePayment', headerName: 'Advance', width: 100 },
  {
    field: 'remainingAmount',
    headerName: 'Remaining',
    width: 100,
    renderCell: (params) => {
      const isNegative = params.value < 0
      return (
        <span
          style={{
            color: 'red',
            backgroundColor: isNegative ? 'yellow' : 'transparent',
            padding: isNegative ? '2px 4px' : '0',
            borderRadius: isNegative ? '4px' : '0',
          }}
        >
          {params.value}
        </span>
      )
    },
  },
  { field: 'functionCat', headerName: 'Booking Type', width: 100 },
  { field: 'paymentStatus', headerName: 'Status', width: 120 },
]

export default function AllReminder() {
  const navigate = useNavigate()
  const { data, status } = useQuery('all-reminders', async () => {
    const res = await axiosInstance.get(`/booking/pend-bookings`)
    if (res.data === 'No temporary bookings found') {
      throw new Error(res.data)
    }
    return res.data
  })

  if (status === 'loading') return <Loader />
  if (status === 'error') return <p>No bookings found</p>

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
    advancePayment: item.advancePay,
    remainingAmount: item.totalAmount - item.advancePay,
    functionCat: item.functionCat,
    paymentStatus: item.paymentStatus,
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
