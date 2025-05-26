const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  mobileNumber: String,
  cardNumber: String,
  expiryDate: String,
  cvv: String,
  amount: Number,        
  unitPrice: Number,  
  txnId: String,
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainBooking' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', PaymentSchema);
