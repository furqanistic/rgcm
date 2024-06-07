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

const columns = [
  { field: 'fname', headerName: 'Name', width: 250 },
  { field: 'lname', headerName: 'Father Name', width: 250 },
  { field: 'username', headerName: 'Username', width: 250 },
]

export default function AllUsers() {
  const navigate = useNavigate()

  const { data, status } = useQuery('stats-all-users-reg', async () => {
    const res = await axiosInstance.get(`/auth/all-users`)
    if (res.data === 'No users found') {
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

  const rows = data.map((item) => ({
    id: item._id,
    username: item.username,
    fname: item.fname,
    lname: item.lname,
  }))
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ height: '100%', width: '100%' }}>
        <GreenBtn onClick={() => exportToCSV(rows)}>Export to CSV</GreenBtn>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          onRowClick={(param) =>
            navigate(`/register/user-update/${param.row.id}`)
          }
        />
      </div>
    </ThemeProvider>
  )
}
