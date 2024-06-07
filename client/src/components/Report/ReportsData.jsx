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
  a.download = 'all_temp_bookings.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

function convertToPKT(dateTimeStr) {
  const date = new Date(dateTimeStr)
  const PKTOffset = 5 * 60 * 60 * 1000 // 5 hours in milliseconds
  const dateInPKT = new Date(date.getTime() + PKTOffset)

  const dateString = dateInPKT.toISOString().split('T')[0]
  const timeString = dateInPKT.toISOString().split('T')[1].substring(0, 8)

  return { date: dateString, time: timeString }
}

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'username', headerName: 'Booked By', width: 120 },
  { field: 'updatedBy', headerName: 'Updated By', width: 120 },
  { field: 'updatedAtDate', headerName: 'Update Date', width: 130 },
  { field: 'updatedAtTime', headerName: 'Update Time', width: 130 },
  { field: 'host', headerName: 'Host', width: 130 },
  { field: 'functionType', headerName: 'Function Type', width: 150 },
  { field: 'contact', headerName: 'Contact', width: 130 },
  { field: 'location', headerName: 'Location', width: 200 },
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'timings', headerName: 'Timings', width: 130 },
  { field: 'totalAmount', headerName: 'Total Amount', width: 120 },
  { field: 'functionCat', headerName: 'Booking Type', width: 120 },
  { field: 'formType', headerName: 'Form Type', width: 120 },
]

export default function ReportsData() {
  const navigate = useNavigate()

  const { data, status } = useQuery('stats-all-temp-bookings', async () => {
    const res = await axiosInstance.get(`/booking/temporary`)
    if (res.data === 'No temporary bookings found') {
      throw new Error(res.data)
    }
    return res.data
  })
  if (status === 'loading') {
    return <Loader />
  }
  if (status === 'error') {
    return <p>No temporary bookings found</p> // This will display "No temporary bookings found"
  }
  const rows = data.map((item) => {
    const { date, time } = convertToPKT(item.updatedAt)
    return {
      id: item.serialNo,
      _id: item._id,
      username: item.BookedBy?.username,
      updatedBy: item.updatedBy,
      updatedAtDate: date, // separate the date
      updatedAtTime: time, // separate the time
      host: item.host,
      functionType: item.functionType,
      contact: item.contact,
      location: item.location,
      date: item.date,
      timings: item.timings,
      totalAmount: item.totalAmount,
      functionCat: item.functionCat,
      formType: item.formType,
    }
  })

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ height: '100%', width: '100%' }}>
        <GreenBtn onClick={() => exportToCSV(rows)}>Export to CSV</GreenBtn>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          onRowClick={(param) => navigate(`/changes/${param.row._id}/`)}
        />
      </div>
    </ThemeProvider>
  )
}
