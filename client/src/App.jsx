import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EditBooking from './pages/Booking/EditBooking'
import NewBooking from './pages/Booking/NewBooking'
import ViewBooking from './pages/Booking/ViewBooking'
import ViewChanges from './pages/Booking/ViewChanges'
import Find from './pages/Find/Find'
import ShowAllBobBookings from './pages/Find/ShowAllBobBookings'
import ShowAllBookings from './pages/Find/ShowAllBookings'
import ShowAllDeleted from './pages/Find/ShowAllDeleted'
import ShowAllPerm from './pages/Find/ShowAllPerm'
import ShowAllTemp from './pages/Find/ShowAllTemp'
import ShowMonthlyBookings from './pages/Find/ShowMonthlyBookings'
import Login from './pages/Login/Login'
import Register from './pages/Register'
import Reminder from './pages/Reminder/Reminder'
import AllReports from './pages/Report/AllReports'
import Setting from './pages/Setting'
import Statistics from './pages/Stats/Statistics'
import UpdateUser from './pages/UpdateUser'

const App = () => {
  const { currentUser } = useSelector((state) => state.user)

  return (
    <>
      <BrowserRouter>
        {!currentUser ? (
          <Routes>
            <Route path='/'>
              <Route index element={<Login />} />
              <Route path='*' element={<Login />} />
            </Route>
          </Routes>
        ) : (
          <Routes>
            <Route path='/'>
              <Route index element={<NewBooking />} />
              <Route path='new'>
                <Route index element={<NewBooking />} />
              </Route>
              <Route path='view/:id' element={<ViewBooking />} />
              <Route path='changes/:id' element={<ViewChanges />} />
              <Route path='edit/:id' element={<EditBooking />} />
              <Route path='reports' element={<AllReports />} />
              <Route path='reminder' element={<Reminder />} />
              <Route path='find'>
                <Route index element={<Find />} />
                <Route path='all' element={<ShowAllBookings />} />
                <Route path='all-bob' element={<ShowAllBobBookings />} />
                <Route path='all-temp' element={<ShowAllTemp />} />
                <Route path='all-perm' element={<ShowAllPerm />} />
                <Route path='by-month' element={<ShowMonthlyBookings />} />
                <Route path='deleted' element={<ShowAllDeleted />} />
              </Route>
              <Route path='register'>
                <Route index element={<Register />} />
                <Route path='user-update/:id' element={<UpdateUser />} />
              </Route>
              <Route path='stats' element={<Statistics />} />
              <Route path='*' element={<ShowAllBookings />} />
            </Route>
          </Routes>
        )}
      </BrowserRouter>
    </>
  )
}

export default App
