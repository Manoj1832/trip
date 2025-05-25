// models/FlightBooking.js
const mongoose = require('mongoose');

const flightBookingSchema = new mongoose.Schema({
  flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
  name: String,
  email: String,
  seats: Number,
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FlightBooking', flightBookingSchema);
