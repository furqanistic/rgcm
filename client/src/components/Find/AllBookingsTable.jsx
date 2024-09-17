import { createTheme, ThemeProvider } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import { Eye, FileDown } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import * as XLSX from 'xlsx'
import { axiosInstance } from '../../config'
import Loader from '../../Loader'

// Styled components
const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
`

const StyledSelect = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 14px;
  min-width: 120px;
`

const StyledButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.9;
  }
`

const GreenButton = styled(StyledButton)`
  background-color: #012d01;
  color: white;
`

const YellowButton = styled(StyledButton)`
  background-color: #ffdd01;
  color: #000000;
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
    color: white;
  }
`

// Helper function
function exportToCSV(rows) {
  const ws = XLSX.utils.json_to_sheet(rows)
  const csv = XLSX.utils.sheet_to_csv(ws)
  const blob = new Blob([csv], { type: 'text/csv' })
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
  const [selectedBookingMonth, setSelectedBookingMonth] = useState('')
  const [selectedEventMonth, setSelectedEventMonth] = useState('')

  const handleDeleteInvoice = async (event, personID) => {
    event.stopPropagation()
    try {
      const response = await axiosInstance.put(
        `/booking/invoice/${personID}/delete`,
        {
          DeletedBy: currentUser._id,
        }
      )
      if (response.status === 200 || response.status === 201) {
        toast.success('Form Deleted Successfully', { duration: 4000 })
        refetch()
      } else {
        toast.error('Delete Failed. Please try again!', { duration: 4000 })
      }
    } catch (err) {
      console.log(err)
      toast.error('An error occurred while deleting', { duration: 4000 })
    }
  }

  const darkTheme = createTheme({
    palette: {
      mode: 'light',
    },
  })

  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'username', headerName: 'Booked By', width: 100 },
    { field: 'host', headerName: 'Host', width: 160 },
    {
      field: 'createdAt',
      headerName: 'Booking Date',
      width: 120,
      align: 'center',
    },
    { field: 'contact', headerName: 'Contact', width: 120 },
    { field: 'location', headerName: 'Location', width: 120 },
    { field: 'date', headerName: 'Event Date', width: 110 },
    { field: 'timings', headerName: 'Timings', width: 80 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 80 },
    { field: 'functionCat', headerName: 'Booking Type', width: 120 },
    { field: 'paymentStatus', headerName: 'Status', width: 80 },
    {
      field: 'Remove',
      headerName: 'Delete',
      sortable: false,
      width: 80,
      renderCell: (params) => (
        <DeleteBtn
          onClick={(event) => handleDeleteInvoice(event, params.row._id)}
        >
          Delete
        </DeleteBtn>
      ),
    },
  ]

  const { data, status, refetch } = useQuery('stats-all-bookings', async () => {
    const res = await axiosInstance.get(`/booking/all-bookings`)
    return res.data
  })

  if (status === 'loading') {
    return <Loader />
  }

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  const filteredRows = data
    .filter((item) => {
      const [eventDay, eventMonth, eventYear] = item.date.split('-')
      const bookingDate = new Date(item.createdAt)
      const bookingMonth = bookingDate.getMonth() + 1
      const bookingYear = bookingDate.getFullYear()

      return (
        (!selectedBookingMonth ||
          bookingMonth === parseInt(selectedBookingMonth)) &&
        (!selectedEventMonth ||
          parseInt(eventMonth) === parseInt(selectedEventMonth)) &&
        (!selectedYear ||
          parseInt(eventYear) === parseInt(selectedYear) ||
          bookingYear === parseInt(selectedYear))
      )
    })
    .map((item) => {
      const createdAtDate = new Date(item.createdAt)
      const formattedCreatedAt = createdAtDate
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .replace(/\//g, '/')

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
        createdAt: formattedCreatedAt,
        contact: item.contact,
        location: item.location,
        date: formatDate(item.date), // Format the Event Date
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
            value={selectedBookingMonth}
            onChange={(e) => setSelectedBookingMonth(e.target.value)}
          >
            <option value=''>Booking Month</option>
            {[...Array(12).keys()].map((month) => (
              <option key={month} value={month + 1}>
                {new Date(0, month).toLocaleString('default', {
                  month: 'long',
                })}
              </option>
            ))}
          </StyledSelect>
          <StyledSelect
            value={selectedEventMonth}
            onChange={(e) => setSelectedEventMonth(e.target.value)}
          >
            <option value=''>Event Month</option>
            {[...Array(12).keys()].map((month) => (
              <option key={month} value={month + 1}>
                {new Date(0, month).toLocaleString('default', {
                  month: 'long',
                })}
              </option>
            ))}
          </StyledSelect>
          <StyledSelect
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value=''>Year</option>
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </StyledSelect>
          <GreenButton onClick={() => exportToCSV(filteredRows)}>
            <FileDown size={16} />
            Export to CSV
          </GreenButton>
          <Link style={{ textDecoration: 'none' }} to='/find/deleted'>
            <YellowButton>
              <Eye size={16} />
              View Deleted
            </YellowButton>
          </Link>
        </FiltersContainer>
        <CapitalizeDataGridWrapper>
          <StyledDataGrid
            rows={filteredRows}
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
                sort: 'desc',
              },
            ]}
          />
        </CapitalizeDataGridWrapper>
      </div>
    </ThemeProvider>
  )
}
