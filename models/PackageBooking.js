const mongoose = require('mongoose');

const packageBookingSchema = new mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  name: String,
  email: String,
  people: Number,
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PackageBooking', packageBookingSchema);
