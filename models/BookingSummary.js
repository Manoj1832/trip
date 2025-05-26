const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['flight', 'train', 'bus']
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // can store any object depending on type
    required: true
  }
});

const PaymentDetailsSchema = new mongoose.Schema({
  method: { type: String }, // e.g., 'credit card', 'UPI'
  transactionId: { type: String },
  paymentDate: { type: Date },
  amountPaid: { type: Number }
}, { _id: false });

const BookingSummarySchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  bookings: {
    type: [BookingSchema],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentDetails: {
    type: PaymentDetailsSchema,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BookingSummary', BookingSummarySchema);
