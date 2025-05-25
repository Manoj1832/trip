// models/Flight.js
const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  flightNumber: String,
  airline: String,
  from: String,
  to: String,
  departureTime: String,
  arrivalTime: String,
  duration: String,
  price: Number,
  date: String,
  seatsAvailable: Number,
  travelMode: { type: String, default: "flight" },
});

module.exports = mongoose.model('Flight', flightSchema);
