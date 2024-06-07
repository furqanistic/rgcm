import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import * as React from 'react'
import { useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import * as XLSX from 'xlsx'
import { axiosInstance } from '../../config'

import { Visibility } from '@mui/icons-material'
import { MenuItem, Select } from '@mui/material'
import Loader from '../../Loader'
// The rest of your imports remain unchanged

const GreenBtn = styled.button`
  background-color: #012d01;
  padding: 0.5rem 0.8rem;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 3rem;
`
const StyledGreenBtn = styled(GreenBtn)`
  /* padding: 10px 15px; */
  width: auto;
`
const StyledSelect = styled(Select)`
  min-width: 120px;
`
const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px; // Adds space between each child element
  padding: 10px; // Adds padding around the container for spacing from edges
  background-color: #f5f5f5; // Optional: adds a background color for visual distinction
  border-radius: 8px; // Optional: rounds the corners of the container
  margin-bottom: 20px; // Adds space between this container and the table below
`
const CapitalizeDataGridWrapper = styled.div`
  && .MuiDataGrid-columnHeaders,
  .MuiDataGrid-cell {
    text-transform: capitalize;
  }
`

const StyledDataGrid = styled(DataGrid)`
  .greenRow {
    background-color: #01ac01b7 !important;
  }
  .blueRow {
    background-color: #4b005ab1 !important;
    color: white; // Optional, for better text visibility
  }
`

const DeleteBtn = styled.button`
  background-color: #660101;
  color: #eaeaea;
  max-width: 100px;
  min-width: 60px;
  font-weight: 500;
  padding: 0.7rem 0.5rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`
const GenBtn = styled(GreenBtn)`
  background-color: #ffdd01;
  color: #000000;
  display: flex;
  align-items: center;
  text-transform: capitalize;
`

function exportToCSV(rows) {
  const ws = XLSX.utils.json_to_sheet(rows)
  const csv = XLSX.utils.sheet_to_csv(ws)
  const blob = new Blob([csv], { type: 'text/csv' })

  // Create a download link and click it
  const a = document.createElement('a')
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = 'all_bookings.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

export default function AllBookingsTable() {
  const { currentUser } = useSelector((state) => state.user)

  const navigate = useNavigate()

  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const queryClient = useQueryClient()

  const handleDeleteInvoice = async (event, personID) => {
    const data = {
      DeletedBy: currentUser._id,
    }
    event.stopPropagation() // This stops the event from propagating further.
    try {
      await axiosInstance.put(`/booking/invoice/${personID}/delete`, data)
      await queryClient.invalidateQueries('stats-all-bookings')
    } catch (err) {
      console.log(err)
    }
  }

  // Handle change for month and year dropdowns
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value)
  }

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value)
  }

  const darkTheme = createTheme({
    palette: {
      mode: 'light',
    },
  })

  const columns = [
    { field: 'id', headerName: 'ID', width: 20 },
    { field: 'username', headerName: 'Booked By', width: 80 },
    { field: 'host', headerName: 'Host', width: 160 },
    {
      field: 'createdAt',
      headerName: 'Submission Date',
      width: 100,
      align: 'center',
    },
    { field: 'contact', headerName: 'Contact', width: 120 },
    { field: 'location', headerName: 'Location', width: 120 },
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'timings', headerName: 'Timings', width: 80 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 80 },
    { field: 'functionCat', headerName: 'Booking Type', width: 120 },
    { field: 'paymentStatus', headerName: 'Status', width: 70 },
    {
      field: 'Remove',
      headerName: 'Delete',
      sortable: false,
      width: 80,
      renderCell: (params) => {
        return (
          <DeleteBtn
            variant='contained'
            color='primary'
            onClick={(event) => handleDeleteInvoice(event, params.row._id)}
          >
            Delete
          </DeleteBtn>
        )
      },
    },
  ]

  const { data, status } = useQuery('stats-all-bookings', async () => {
    const res = await axiosInstance.get(`/booking/all-bookings`)
    return res.data
  })

  if (status === 'loading') {
    return <Loader />
  }

  const rows = data.map((item) => {
    // Assuming item.createdAt is in ISO format or similar
    const date = new Date(item.createdAt)
    const formattedDate = date.toLocaleDateString('en-GB') // This will give you dd/mm/yyyy format
    return {
      id: item.serialNo,
      _id: item._id,
      username: item.BookedBy?.username,
      host: item.host,
      createdAt: formattedDate, // Use the formatted date here
      contact: item.contact,
      location: item.location,
      date: item.date,
      timings: item.timings,
      totalAmount: item.totalAmount,
      functionCat: item.functionCat,
      paymentStatus: item.paymentStatus,
    }
  })

  const filteredRows = data
    .filter((item) => {
      const bookingDate = new Date(item.date) // Assuming item.date is parseable by Date constructor
      const month = bookingDate.getMonth() + 1 // JavaScript months are 0-indexed
      const year = bookingDate.getFullYear()
      return (
        (!selectedMonth || month === parseInt(selectedMonth)) &&
        (!selectedYear || year === parseInt(selectedYear))
      )
    })
    .map((item) => {
      // Assuming item.createdAt is in ISO format or similar for displaying
      const createdAtDate = new Date(item.createdAt)
      const formattedCreatedAt = createdAtDate
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .replace(/\//g, '-') // Convert dd/mm/yyyy format to dd-mm-yyyy for display

      // You might want to format the booking date as well for consistency in display
      const formattedBookingDate = new Date(item.date)
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .replace(/\//g, '-')

      return {
        id: item.serialNo,
        _id: item._id,
        username: item.BookedBy?.username,
        host: item.host,
        createdAt: formattedCreatedAt, // Display purpose
        contact: item.contact,
        location: item.location,
        date: item.date,
        timings: item.timings,
        totalAmount: item.totalAmount,
        functionCat: item.functionCat,
        formType: item.formType,
        paymentStatus: item.paymentStatus,
      }
    })

  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ height: '100%', width: '100%' }}>
        <FiltersContainer>
          <StyledSelect
            value={selectedMonth}
            onChange={handleMonthChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Select Month' }}
          >
            <MenuItem value=''>
              <em>Month</em>
            </MenuItem>
            {/* Month options */}
            {[...Array(12).keys()].map((month) => (
              <MenuItem key={month} value={month + 1}>
                {new Date(0, month).toLocaleString('default', {
                  month: 'long',
                })}
              </MenuItem>
            ))}
          </StyledSelect>
          <StyledSelect
            value={selectedYear}
            onChange={handleYearChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Select Year' }}
          >
            <MenuItem value=''>
              <em>Year</em>
            </MenuItem>
            {/* Year options */}
            {[2023, 2024, 2025].map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </StyledSelect>
          <StyledGreenBtn onClick={() => exportToCSV(filteredRows)}>
            Export to CSV
          </StyledGreenBtn>
          <Link style={{ textDecoration: 'none' }} to='/find/deleted'>
            <GenBtn>
              <Visibility style={{ marginRight: '5px' }} />
              View Deleted
            </GenBtn>
          </Link>
        </FiltersContainer>
        <CapitalizeDataGridWrapper>
          <StyledDataGrid
            rows={filteredRows} // Use filteredRows instead of rows
            columns={columns}
            pageSize={5}
            onRowClick={(param) => navigate(`/view/${param.row._id}`)}
            getRowClassName={(params) =>
              params.row.paymentStatus === 'Paid'
                ? 'greenRow'
                : params.row.paymentStatus === 'Pending'
                ? 'blueRow'
                : ''
            }
            sortModel={[
              {
                field: 'id',
                sort: 'desc', // Set initial sort state to descending
              },
            ]}
          />
        </CapitalizeDataGridWrapper>
      </div>
    </ThemeProvider>
  )
}
