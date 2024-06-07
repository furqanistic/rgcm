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
  .calendar {
    display: flex;
    flex-direction: column;
  }
  .week-row {
    display: flex;
    
  }
  .calendar {
    display: flex;
    flex-direction: column;
  }
  .week-row {
    display: flex;
  }
    .day-cell {
    flex: 1;
    border: 1px solid #ccc;
    padding: 10px;
    margin: 2px;
    position: relative;
    height: 450px; // Adjust height as needed
    display: flex;
    flex-direction: column;
  }

   .booking-section {
    flex: 1;
    padding-left: 10px;

    border-top: 1px solid #e0e0e0;
    padding-top: 5px;
    overflow-y: auto; // Make the section vertically scrollable
    max-height: 50%; // Limit the height to half of the day cell
  }

  .booking-section:last-child {
    background-color: #c6c6c6; // Grey background for the second box
  }

  .temporary-booking {
    color: red;
  }

  .date-header {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: rgba(255, 255, 255, 0.7);
    padding: 2px 5px;
    border-radius: 3px;
    z-index: 1;
  }
  .header-row {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  .day-header {
    flex: 1;
    padding: 10px;
    text-align: center;
    border: 1px solid #ccc;
    margin: 2px;
  } .booking-info {
    margin-top: 10px;
    border-top: 1px solid #e0e0e0;
    padding-top: 5px;
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
const TableStrong = styled.span`
  font-size: 0.8rem;
`
const TableStrongText = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
`

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

function WeekRow({ week }) {
  return (
    <div className='week-row'>
      {week.map((day, index) => (
        <DayCell key={index} day={day} />
      ))}
    </div>
  )
}

function DayCell({ day }) {
  return (
    <div className='day-cell'>
      <div className='date-header'>{day.date}</div>
      <div className='booking-section'>
        {day.bookings
          .filter((booking) => booking.timings !== 'Night')
          .map((booking, index) => (
            <div
              key={index}
              className={`booking-info ${
                booking.functionCat === 'Temporary' ? 'temporary-booking' : ''
              }`}
            >
              <div>
                <TableStrongText>Host: </TableStrongText>
                <TableStrong>{booking.host}</TableStrong>
              </div>
              <div>
                <TableStrongText>Contact: </TableStrongText>
                <TableStrong>{booking.contact}</TableStrong>
              </div>
              <div>
                <TableStrongText>Location: </TableStrongText>
                <TableStrong>{booking.location}</TableStrong>
              </div>
              <div>
                <TableStrongText>Advance: </TableStrongText>
                <TableStrong>{booking.advancePay}</TableStrong>
              </div>
              <div>
                <TableStrongText>Total: </TableStrongText>
                <TableStrong>{booking.totalAmount}</TableStrong>
              </div>
            </div>
          ))}
      </div>
      <div className='booking-section'>
        {day.bookings
          .filter((booking) => booking.timings === 'Night')
          .map((booking, index) => (
            <div
              key={index}
              className={`booking-info ${
                booking.functionCat === 'Temporary' ? 'temporary-booking' : ''
              }`}
            >
              <div>
                <TableStrongText>Host: </TableStrongText>
                <TableStrong>{booking.host}</TableStrong>
              </div>
              <div>
                <TableStrongText>Contact: </TableStrongText>
                <TableStrong>{booking.contact}</TableStrong>
              </div>
              <div>
                <TableStrongText>Location: </TableStrongText>
                <TableStrong>{booking.location}</TableStrong>
              </div>
              <div>
                <TableStrongText>Advance: </TableStrongText>
                <TableStrong>{booking.advancePay}</TableStrong>
              </div>
              <div>
                <TableStrongText>Total: </TableStrongText>
                <TableStrong>{booking.totalAmount}</TableStrong>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

function transformDataToCalendarStructure(data, month, year) {
  const weeks = []
  let currentWeek = []

  // Get the day of the week for the first day of the month
  const firstDay = new Date(year, month - 1, 1).getDay()
  const offset = firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday from 0 to 7

  // Fill the first week with empty days until the first day of the month
  for (let i = 0; i < offset; i++) {
    currentWeek.push({ date: '', bookings: [] })
  }

  data.forEach((day) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(day)
  })

  // If the month doesn't end on a Sunday, fill the last week with empty days
  while (currentWeek.length < 7) {
    currentWeek.push({ date: '', bookings: [] })
  }

  if (currentWeek.length) {
    weeks.push(currentWeek)
  }

  return weeks
}

function CalendarHeader() {
  return (
    <div className='week-row header-row'>
      {[
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ].map((day) => (
        <div key={day} className='day-header'>
          {day}
        </div>
      ))}
    </div>
  )
}

export default function MonthlyDataTable() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate()
  }

  function generateRowsForMonth(data) {
    const rows = []

    // Generate placeholder rows first
    // Inside generateRowsForMonth function
    // Inside generateRowsForMonth function
    // Inside generateRowsForMonth function
    const daysInMonth = getDaysInMonth(selectedMonth, currentYear)
    for (let i = 1; i <= daysInMonth; i++) {
      rows.push({
        id: `XXXXXX-${i}`,
        day: i,
        date: i.toString(), // Just the day number
        bookings: [],
      })
    }

    // Add all booking rows, and if a placeholder exists for the booking date, remove it
    // Inside generateRowsForMonth function
    data.forEach((item) => {
      const [day, month, year] = item.date
        .split('-')
        .map((part) => parseInt(part, 10))

      // Find the placeholder row for this booking date
      const placeholderIndex = rows.findIndex((row) => row.day === day)

      if (placeholderIndex !== -1) {
        rows[placeholderIndex].bookings.push({
          username: item.BookedBy?.username,
          host: item.host,
          functionType: item.functionType,
          contact: item.contact,
          location: item.location,
          timings: item.timings,
          totalAmount: item.totalAmount,
          functionCat: item.functionCat,
          formType: item.formType,
          advancePay: item.advancePay,
        })
      }
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
        <div className='calendar'>
          <CalendarHeader />
          {transformDataToCalendarStructure(
            rows,
            selectedMonth,
            currentYear
          ).map((week, index) => (
            <WeekRow key={index} week={week} />
          ))}
        </div>
      </div>
    </ThemeProvider>
  )
}
