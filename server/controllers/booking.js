import AuditLog from '../models/AuditLog.js'
import Booking from '../models/Booking.js'
import User from '../models/User.js'

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ isDeleted: false }).populate(
      'BookedBy'
    )
    res.status(200).json(bookings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
export const getBookingsByIsDeleted = async (req, res) => {
  try {
    const bookings = await Booking.find({ isDeleted: true }).populate(
      'BookedBy'
    )
    res.status(200).json(bookings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (booking) {
      res.status(200).json(booking)
    } else {
      res.status(404).json({ message: 'Booking not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body)
    await booking.save()
    res.status(201).json(booking)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (booking) {
      req.updatedBooking = booking // Store the updated booking in the request object
      next() // Pass control to the next middleware
    } else {
      res.status(404).json({ message: 'Booking not found' })
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const updateBookingWithAudit = async (req, res) => {
  try {
    const currentBooking = await Booking.findById(req.params.id) // Find current booking based on the ID passed
    const updatedBooking = req.body // The new data coming from the client to update the booking

    const changedFields = []
    const oldValues = {}
    const newValues = {}

    // List of fields to compare (you can extend this list based on your model)
    const fields = [
      'perHead',
      'foodAmount',
      'stageAmount',
      'decorationLights',
      'soundSystem',
      'coldDrink',
      'mineralWater',
      'hallRentBalc',
      'extraDecor',
      'others',
      'discount',
      'totalAmount',
      'host',
      'functionType',
      'contact',
      'location',
      'date',
      'dishes',
      'functionCat',
      'formType',
      'timings',
    ]

    fields.forEach((field) => {
      if (String(currentBooking[field]) !== String(updatedBooking[field])) {
        changedFields.push(field)
        oldValues[field] = currentBooking[field]
        newValues[field] = updatedBooking[field]
      }
    })

    // If there are changes, then log them
    if (changedFields.length) {
      const auditLog = new AuditLog({
        bookingId: currentBooking._id,
        editedBy: req.body.useridd._id,
        changedFields,
        oldValues,
        newValues,
      })

      await auditLog.save() // Save the audit log entry
    }
    // Now update the actual booking
    currentBooking.set(updatedBooking)
    await currentBooking.save()

    res.status(200).json(currentBooking)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (booking) {
      res.status(200).json({ message: 'Booking deleted' })
    } else {
      res.status(404).json({ message: 'Booking not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId // Get the user ID from the route parameter
    const bookings = await Booking.find({ BookedBy: userId }).populate(
      'BookedBy'
    ) // Find all bookings with the specified user ID and populate the user details
    if (bookings.length > 0) {
      res.status(200).json(bookings)
    } else {
      res.status(404).json({ message: 'This user have 0 bookings' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getLastBookingSerial = async (req, res) => {
  try {
    const lastBooking = await Booking.findOne().sort({ createdAt: -1 }) // This will sort by date in descending order and get the latest booking
    if (lastBooking) {
      res.status(200).json({ serialNo: lastBooking.serialNo })
    } else {
      res.status(404).json({ serialNo: 1 })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get all bookings with temporary filter

export const getTemporaryBookings = async (req, res) => {
  try {
    // Query now checks for isDeleted not equal to true
    const bookings = await Booking.find({
      functionCat: 'Temporary',
      isDeleted: { $ne: true },
    }).populate('BookedBy')

    if (bookings.length > 0) {
      res.status(200).json(bookings)
    } else {
      res.status(404).json({ message: 'No temporary bookings found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get all bookings with permanent filter

export const getPermanentBookings = async (req, res) => {
  try {
    // Query checks for isDeleted not equal to true
    const bookings = await Booking.find({
      functionCat: 'Permanent',
      isDeleted: { $ne: true },
    }).populate('BookedBy')

    if (bookings.length > 0) {
      res.status(200).json(bookings)
    } else {
      res.status(404).json({ message: 'No permanent bookings found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get all bob booking with  filter

export const getBobBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ formType: 'BOB' }).populate(
      'BookedBy'
    )
    if (bookings.length > 0) {
      res.status(200).json(bookings)
    } else {
      res.status(404).json({ message: 'No temporary BOB bookings found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
// Get all pending booking with  filter

export const getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ paymentStatus: 'Pending' }).populate(
      'BookedBy'
    )
    if (bookings.length > 0) {
      res.status(200).json(bookings)
    } else {
      res.status(404).json({ message: 'No Pending bookings found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Get bookings for specified date

export const getBookingsForDate = async (req, res) => {
  const { date } = req.params

  try {
    // Using the find method to get all bookings for the given date
    const bookings = await Booking.find({ date: date })
    if (bookings.length === 0) {
      return res.json([])
    }
    res.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getBookingsByMonth = async (req, res) => {
  try {
    const { month, year } = req.query

    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' })
    }

    const regex = new RegExp(`-0?${month}-${year}$`)

    // Updated query to handle isDeleted field
    const bookings = await Booking.find({
      date: { $regex: regex },
      isDeleted: { $ne: true }, // Excludes bookings where isDeleted is true
    }).populate('BookedBy')

    return res.status(200).json(bookings)
  } catch (error) {
    return res.status(500).json({ error: 'Server error' })
  }
}

export const getPendingStatus = async (req, res) => {
  try {
    // Find all bookings with a 'Pending' payment status
    const bookings = await Booking.find({ paymentStatus: 'Pending' }) // Assuming the 'User' schema has a 'username' field

    // Extract usernames from the bookings
    const host = bookings.map((booking) => booking.host)

    res.json(host)
  } catch (error) {
    console.error('Error fetching bookings with pending payment:', error)
    res.status(500).send('Server error')
  }
}
export const updateSerialNumbers = async (db, collectionName) => {
  const documents = await db.collection(collectionName).find().toArray()

  for (let i = 0; i < documents.length; i++) {
    const documentId = documents[i]._id
    const updatedSerialNo = i + 1

    await db
      .collection(collectionName)
      .updateOne({ _id: documentId }, { $set: { serialNo: updatedSerialNo } })

    console.log(
      `Updated ${collectionName} document ${documentId} with serialNo ${updatedSerialNo}`
    )
  }
}

// Delete a fee slip by ID
export const markBookingAsDeleted = async (req, res) => {
  try {
    const bookId = req.params.id
    const deletedById = req.body.DeletedBy

    // First, check if the booking already has a DeletedBy field set
    const book = await Booking.findById(bookId)
    if (!book) {
      return res.status(404).send('Booking not found')
    }

    // Prepare the update object
    let update = { isDeleted: true }
    if (!book.DeletedBy) {
      // Check if DeletedBy is not already set
      update.DeletedBy = deletedById // Set DeletedBy only if it's not set
    }

    // Perform the update with the prepared changes
    const updatedBook = await Booking.findByIdAndUpdate(bookId, update, {
      new: true,
    })
    res.send(updatedBook)
  } catch (error) {
    res.status(500).send(error)
  }
}
