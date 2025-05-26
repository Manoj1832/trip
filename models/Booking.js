const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['flight', 'train', 'package'],
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },

  // Flight specific
  flightId: String,
  seats: Number,

  // Train specific
  trainId: String,

  // Package specific
  name: String,
  description: String,
  image: String,
  date: Date // For package date
});

module.exports = mongoose.model("Booking", bookingSchema);
