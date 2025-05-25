const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: String,
  trainName: String,
  from: String,
  to: String,
  date: String,
  departureTime: String,
  arrivalTime: String,
  price: Number,
  seatsAvailable: Number
});

module.exports = mongoose.model('Train', trainSchema);
