import Booking from '../models/Booking.js'
import AuditLog from '../models/AuditLog.js'

export const updateBooking = async (req, res) => {
  try {
    const currentBooking = await Booking.findById(req.params.bookingId)
    const updatedBooking = req.body

    const changedFields = []
    const oldValues = {}
    const newValues = {}

    // Example comparison logic for 'host'
    if (currentBooking.host !== updatedBooking.host) {
      changedFields.push('host')
      oldValues.host = currentBooking.host
      newValues.host = updatedBooking.host
    }

    // ... Compare other fields similarly ...

    if (changedFields.length) {
      const auditLog = new AuditLog({
        bookingId: currentBooking._id,
        editedBy: req.user._id,
        changedFields,
        oldValues,
        newValues,
      })
      await auditLog.save()
    }

    // Update the actual booking
    currentBooking.set(updatedBooking)
    await currentBooking.save()

    res.status(200).json(currentBooking)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAuditLogsForBooking = async (req, res) => {
  try {
    const logs = await AuditLog.find({
      bookingId: req.params.bookingId,
    }).populate('editedBy', 'username')
    res.status(200).json(logs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
