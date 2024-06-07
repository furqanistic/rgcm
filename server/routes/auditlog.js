// routes/booking.js

import express from 'express'
import {
  updateBooking,
  getAuditLogsForBooking,
} from '../controllers/auditLog.js'

const router = express.Router()

router.put('/update/:bookingId', updateBooking)
router.get('/:bookingId/auditlogs', getAuditLogsForBooking)

export default router
