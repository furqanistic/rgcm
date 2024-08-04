import mongoose from 'mongoose'
const bookingSchema = new mongoose.Schema(
  {
    serialNo: {
      type: Number,
    },
    BookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // This refers to the User model
    },
    updatedBy: {
      type: String,
      ref: 'User', // This refers to the User model
    },
    functionCat: {
      type: String,
    },
    formType: {
      type: String,
    },
    host: {
      type: String,
    },
    functionType: {
      type: String,
    },
    contact: {
      type: String,
    },
    location: {
      type: String,
    },
    dishes: [
      {
        type: String,
      },
    ],
    date: {
      type: String,
    },
    timings: {
      type: String,
    },
    numberOfGuests: {
      type: Number,
    },
    perHead: {
      type: Number,
    },
    foodAmount: {
      type: Number,
    },
    stageAmount: {
      type: Number,
    },
    decorationLights: {
      type: Number,
    },
    soundSystem: {
      type: Number,
    },
    coldDrink: {
      type: Number,
    },
    advancePay: {
      type: Number,
    },
    hallRentBalc: {
      type: Number,
    },
    extraDecor: {
      type: Number,
    },
    others: {
      type: Number,
    },
    paymentStatus: {
      type: String,
    },
    discount: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    fromDate: {
      type: Date,
      default: null, // Default to null since not all bookings will be temporary
    },
    toDate: {
      type: Date,
      default: null,
    },
    expirationDate: {
      type: Date,
      expires: 0, // This will set a TTL index on this field
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    DeletedBy: {
      type: String,
    },
    notes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Booking', bookingSchema)
