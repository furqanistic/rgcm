import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import * as React from 'react'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
import * as XLSX from 'xlsx'
import { axiosInstance } from '../../config'
import Loader from '../../Loader'

const GlobalStyles = createGlobalStyle`
  .blue-background {
    background-color: #ff0318; 
 
  }
  .grey-background {
    background-color: #2d8c02;
  }
`

const GreenBtn = styled.button`
  background-color: green;
  padding: 0.5rem 0.8rem;
  color: white;
  border: none;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
`
const ChooseBtn = styled.select`
  padding: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  background-color: white;
  color: green;
  border: 1px solid green;
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

function generateColumns() {
  return [
    { field: 'date', headerName: 'Date', width: 130 },
    // { field: 'id', headerName: 'ID', width: 70 },

    { field: 'username', headerName: 'Booked By', width: 120 },
    { field: 'host', headerName: 'Host', width: 130 },
    { field: 'functionType', headerName: 'Function Type', width: 150 },
    { field: 'contact', headerName: 'Contact', width: 130 },
    { field: 'location', headerName: 'Location', width: 200 },
    { field: 'timings', headerName: 'Timings', width: 130 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 120 },
    {
      field: 'functionCat',
      headerName: 'Booking Type',
      width: 120,
      getCellStyle: (params) => {
        return params.value === 'Temporary'
          ? { backgroundColor: 'blue', color: 'white' }
          : {}
      },
    },
    { field: 'formType', headerName: 'Form Type', width: 120 },
  ]
}

export default function MonthlyDataTable() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const navigate = useNavigate()

  function getRowClassName(params) {
    if (params.row.functionCat === 'Temporary') {
      return 'blue-background' // This is your existing condition.
    }
    if (params.row.timings === 'Evening') {
      return 'grey-background' // New condition for the "Evening" value in timings.
    }
    return ''
  }

  function formatDateToDDMMYYYY(dateObj) {
    const dd = String(dateObj.getDate()).padStart(2, '0')
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = dateObj.getFullYear()

    return dd + '-' + mm + '-' + yyyy
  }

  function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate()
  }

  function generateRowsForMonth(data) {
    const rows = []

    // Generate placeholder rows first
    const daysInMonth = getDaysInMonth(selectedMonth - 1, currentYear)
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(currentYear, selectedMonth - 1, i)
      rows.push({
        id: `XXXXXX-${i}`, // A unique ID for days without bookings
        day: i,
        date: formatDateToDDMMYYYY(dateObj),
      })
    }

    // Add all booking rows, and if a placeholder exists for the booking date, remove it
    data.forEach((item) => {
      const [day, month, year] = item.date
        .split('-')
        .map((part) => parseInt(part, 10))
      const dateObj = new Date(year, month - 1, day)

      // Remove the placeholder row for this booking date if it exists
      const placeholderIndex = rows.findIndex(
        (row) =>
          typeof row.id === 'string' &&
          row.date === item.date &&
          row.id.startsWith('XXXXXX-')
      )

      if (placeholderIndex !== -1) {
        rows.splice(placeholderIndex, 1)
      }

      // Push the booking row
      rows.push({
        id: item.serialNo,
        _id: item._id,
        day: day,
        date: formatDateToDDMMYYYY(dateObj),
        username: item.BookedBy?.username,
        host: item.host,
        functionType: item.functionType,
        contact: item.contact,
        location: item.location,
        timings: item.timings,
        totalAmount: item.totalAmount,
        functionCat: item.functionCat,
        formType: item.formType,
      })
    })

    // Sort the rows by date for proper display
    rows.sort(
      (a, b) =>
        new Date(a.date.split('-').reverse().join('-')) -
        new Date(b.date.split('-').reverse().join('-'))
    )

    return rows
  }

  const { data, status } = useQuery(
    ['stats-all-monthly-bookings', selectedMonth, currentYear],
    async () => {
      const res = await axiosInstance.get(
        `/booking/monthly-bookings?month=${selectedMonth}&year=${currentYear}`
      )
      if (res.data === 'No temporary bookings found') {
        throw new Error(res.data)
      }
      return res.data
    }
  )

  if (status === 'loading') {
    return <Loader />
  }

  if (status === 'error') {
    return <p>{data}</p>
  }

  const daysInMonthValue = getDaysInMonth(selectedMonth - 1, currentYear)
  const rows = generateRowsForMonth(data, daysInMonthValue)

  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
      <ChooseBtn
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value='1'>January</option>
        <option value='2'>February</option>
        <option value='3'>March</option>
        <option value='4'>April</option>
        <option value='5'>May</option>
        <option value='6'>June</option>
        <option value='7'>July</option>
        <option value='8'>August</option>
        <option value='9'>September</option>
        <option value='10'>October</option>
        <option value='11'>November</option>
        <option value='12'>December</option>
      </ChooseBtn>
      <ChooseBtn
        value={currentYear}
        onChange={(e) => setCurrentYear(e.target.value)}
      >
        <option value='2023'>2023</option>
        <option value='2024'>2024</option>
        <option value='2025'>2025</option>
      </ChooseBtn>
      <div style={{ height: '100%', width: '100%' }}>
        <GreenBtn onClick={() => exportToCSV(rows)}>Export to CSV</GreenBtn>
        <DataGrid
          rows={rows}
          columns={generateColumns()}
          pageSize={5}
          onRowClick={(param) => navigate(`/view/${param.row._id}`)}
          getRowClassName={getRowClassName} // <-- Add this line
        />
      </div>
    </ThemeProvider>
  )
}
