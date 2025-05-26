const mongoose = require('mongoose');

const trainBookingSchema = new mongoose.Schema({
  trainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Train' },
  name: String,
  email: String,
  seats: Number,
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainBooking', trainBookingSchema);

