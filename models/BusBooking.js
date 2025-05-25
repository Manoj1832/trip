const mongoose = require('mongoose');

// Bus Booking Schema (BusBooking.js)
const busBookingSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  from: String,
  to: String,
  travelDate: Date,
  operator: String,
  seats: Number,
  price: Number,
  paymentStatus: { type: String, default: 'pending' },
  transactionId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BusBooking', busBookingSchema);