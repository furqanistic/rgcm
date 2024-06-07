import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DataGrid, GridOverlay } from '@mui/x-data-grid'
import * as React from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
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

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'username', headerName: 'Booked By', width: 120 },
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

const CustomNoRowsOverlay = () => (
  <GridOverlay>
    <div style={{ marginTop: 20, color: '#888' }}>No rows</div>
  </GridOverlay>
)

export default function DataTable() {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const { data, status, error } = useQuery('stats-info', async () => {
    const res = await axiosInstance.get(`/booking/user/${currentUser._id}`)
    return res.data
  })

  if (status === 'loading') {
    return <Loader />
  }

  if (status === 'error') {
    return <p>{error?.response?.data?.message || 'An error occurred'}</p>
  }

  const rows =
    data && data.length > 0
      ? data.map((item, index) => ({
          id: index + 1,
          _id: item._id,
          username: item.BookedBy?.username,
          host: item.host,
          functionType: item.functionType,
          contact: item.contact,
          location: item.location,
          date: item.date,
          timings: item.timings,
          totalAmount: item.totalAmount,
          functionCat: item.functionCat,
          formType: item.formType,
        }))
      : []

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ height: 400, width: '100%' }}>
        <GreenBtn onClick={() => exportToCSV(rows)}>Export to CSV</GreenBtn>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          autoHeight
        />
      </div>
    </ThemeProvider>
  )
}
