import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import * as React from 'react'
import { useQuery } from 'react-query'
import { axiosInstance } from '../../config'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Loader from '../../Loader'

const AlertMessage = styled.p`
  color: white;
`
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'host', headerName: 'Host', width: 150 },
  { field: 'location', headerName: 'Location', width: 200 },
  { field: 'date', headerName: 'Date', width: 130 },
  { field: 'timings', headerName: 'Timings', width: 130 },
  { field: 'functionCat', headerName: 'Booking Type', width: 120 },
]

export default function BookingDataCard({ bookingDate }) {
  const navigate = useNavigate()

  const { data, status, error } = useQuery('stats-all-perm-table', async () => {
    const res = await axiosInstance.get(`/booking/${bookingDate}`)
    return res.data || [] // Return an empty array if res.data is falsy
  })

  if (status === 'loading') {
    return <Loader />
  }

  const rows = data.map((item) => ({
    id: item.serialNo,
    _id: item._id,
    host: item.host,
    location: item.location,
    date: item.date,
    timings: item.timings,
    functionCat: item.functionCat,
  }))

  if (data.length === 0) {
    return <AlertMessage>No bookings on this date.</AlertMessage>
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ height: '100%', width: '100%' }}>
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
