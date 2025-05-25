const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model('User', UserSchema);

const Booking = mongoose.model('Booking', BookingSchema);

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    feedback: String,
    createdAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', FeedbackSchema);

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

// Package Schema
const PackageSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now },
});
const Package = mongoose.model('Package', PackageSchema);

// Report Schema
const ReportSchema = new mongoose.Schema({
    type: String,
    content: String,
    generatedAt: { type: Date, default: Date.now },
});
const Report = mongoose.model('Report', ReportSchema);

// Destination Schema
const DestinationSchema = new mongoose.Schema({
    name: String,
    image: String,
    region: String,
    budget: String,
    activity: String,
    description: String,
    rating: Number,
    reviews: Number,
    lat: Number,
    lng: Number,
});
const Destination = mongoose.model('Destination', DestinationSchema);


// ✅ Export all models together
module.exports = {
    User,         
    Feedback,
    Payment,
    Package,
    Report,
    Destination,

};
