import express from 'express'
import {
  createBooking,
  deleteBooking,
  getBobBookings,
  getBookingById,
  getBookings,
  getBookingsByIsDeleted,
  getBookingsByMonth,
  getBookingsByUser,
  getBookingsForDate,
  getLastBookingSerial,
  getPendingBookings,
  getPendingStatus,
  getPermanentBookings,
  getTemporaryBookings,
  markBookingAsDeleted,
  updateBooking,
  updateBookingWithAudit,
} from '../controllers/booking.js'

const router = express.Router()

// Get all bookings route
router.get('/all-bookings', getBookings)

// Get all deleted bookings route
router.get('/all-deleted', getBookingsByIsDeleted)

// Get a booking by ID route
router.get('/get-booking/:id', getBookingById)

// Get last serial booking
router.get('/last/serial', getLastBookingSerial)

// Get all Bookings by month
router.get('/monthly-bookings', getBookingsByMonth)

// Add a route to get bookings by user ID
router.get('/user/:userId', getBookingsByUser)

// Get all temporary Bookings
router.get('/temporary', getTemporaryBookings)

// Get all temporary Bookings
router.get('/bob-booking', getBobBookings)

// Get all permanent Bookings
router.get('/permanent', getPermanentBookings)

// Get all permanent Bookings
router.get('/pend-bookings', getPendingBookings)

// Get all pending payments
router.get('/pending', getPendingStatus)

// Get all date Bookings
router.get('/:date', getBookingsForDate)

// Create a new booking route
router.post('/create-booking', createBooking)

// Update a booking route
router.put('/update-booking/:id', updateBookingWithAudit)

// Delete a booking route
router.delete('/delete-booking/:id', deleteBooking)

// Delete a booking isdelete
router.put('/invoice/:id/delete', markBookingAsDeleted)

export default router
