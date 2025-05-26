const express = require('express');
const fetch = require("node-fetch");
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleSearch } = require('google-search-results-nodejs');
const FlightBooking = require('./models/FlightBooking');
const Flight = require('./models/Flight');
const Train = require('./models/Train');
const TrainBooking = require('./models/TrainBooking');
const PaymentSchema = require('./models/Payment');
const User = require('./models/User');
const { Feedback,Destination} = require('./models/models');
const Booking = require('./models/Booking');
require('dotenv').config();
const BookingSummary = require('./models/BookingSummary');


const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use("/chatbot", express.static(__dirname + "/public/chatbot"));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/travel-tourism", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
}).then(() => {
    console.log("MongoDB connected...");
}).catch(err => console.error("MongoDB connection error:", err));

//summary

app.post('/api/booking-summary', async (req, res) => {
  try {
    const {
      userEmail,
      userName,
      bookings,
      totalPrice,
      paymentStatus,
      paymentDetails
    } = req.body;

    if (!userEmail || !userName || !Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newSummary = new BookingSummary({
      userEmail,
      userName,
      bookings,
      totalPrice,
      paymentStatus: paymentStatus || 'pending',
      paymentDetails: paymentDetails || {}
    });

    await newSummary.save();

    res.status(201).json({ message: 'Booking summary saved successfully', bookingSummaryId: newSummary._id });
  } catch (error) {
    console.error('Booking summary save error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Signup
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: 'Signup successful' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

  res.status(200).json({ 
    message: 'Login successful', 
    user: { name: user.name, email: user.email } 
  });
});

// Save booking summary details
app.post('/api/booking-summary', async (req, res) => {
  try {
    const {
      userEmail,
      userName,
      bookings,     // [{ type: 'flight'|'train'|'package', bookingId }]
      totalPrice,
      paymentStatus,  // optional, default: 'pending'
      paymentDetails   // optional: { transactionId, paymentMethod, paidAt }
    } = req.body;

    if (!userEmail || !userName || !Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newSummary = new BookingSummary({
      userEmail,
      userName,
      bookings,
      totalPrice,
      paymentStatus: paymentStatus || 'pending',
      paymentDetails: paymentDetails || {}
    });

    await newSummary.save();

    res.status(201).json({ message: 'Booking summary saved successfully', bookingSummaryId: newSummary._id });
  } catch (error) {
    console.error('Booking summary save error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Offensive words filter for feedback
const offensiveWords = [
    "stupid", "idiot", "dumb", "nonsense", "useless", "hate", "sucks", "worst",
    "garbage", "crap", "moron", "jerk", "terrible", "nasty", "loser", "shut up",
    "fool", "shit", "damn", "bastard", "hell", "screw", "lame", "retard",
    "bloody", "freak", "disgusting", "suck", "trash", "clown"
];
const containsOffensiveWords = (text) => {
    const lowerText = text.toLowerCase();
    return offensiveWords.some(word => lowerText.includes(word));
};

// ==== Routes ====
// Bookings
app.get('/api/bookings', async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    try {
        const bookings = await Booking.find({ name });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Feedback
app.post('/api/feedback', async (req, res) => {
    const { name, rating, feedback } = req.body;
    if (!name || !rating || !feedback) {
        return res.status(400).json({ message: 'Name, rating, and feedback are required' });
    }
    if (containsOffensiveWords(feedback)) {
        return res.status(400).json({ message: 'Feedback contains offensive language' });
    }

    try {
        const newFeedback = new Feedback({ name, rating, feedback });
        await newFeedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving feedback', error });
    }
});

// Payment confirmation
app.post('/api/payments', async (req, res) => {
  try {
    const {
      mobileNumber,
      cardNumber,
      expiryDate,
      cvv,
      amount,
      unitPrice,
      txnId,
      bookingId
    } = req.body;

    const payment = new Payment({
      mobileNumber,
      cardNumber,
      expiryDate,
      cvv,
      amount,
      unitPrice,
      txnId,
      bookingId
    });

    await payment.save();
    res.json({ message: "Payment saved successfully", paymentId: payment._id });
  } catch (err) {
    console.error("Payment saving failed:", err);
    res.status(500).json({ error: "Payment saving failed" });
  }
});

// Destinations
app.get('/api/destinations', async (req, res) => {
  const { travellers = 1, date } = req.query;
  const destinations = await Destination.find();

  const priced = destinations.map(dest => {
    const base = dest.price || 1000;
    const seasonalMultiplier = date.includes('12-') ? 1.5 : 1;
    const totalPrice = Math.ceil(base * travellers * seasonalMultiplier);
    return { ...dest.toObject(), price: totalPrice };
  });

  res.json(priced);
});

app.get('/api/flights', async (req, res) => {
  const { from, to, date } = req.query;
  const query = {
    ...(from && { from }),
    ...(to && { to }),
    ...(date && { date }),
  };

  try {
    const flights = await Flight.find(query);
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

// Get a single flight by ID
app.get('/api/flights/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/flight-bookings', async (req, res) => {
  const { flightId, name, email, seats } = req.body;

  try {
    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ error: 'Flight not found' });

    if (flight.seatsAvailable < seats)
      return res.status(400).json({ error: 'Not enough seats available' });

    const booking = new FlightBooking({
      flightId,
      name,
      email,
      seats,
      bookingDate: new Date()
    });

    await booking.save();

    flight.seatsAvailable -= seats;
    await flight.save();

    res.json({ message: 'Flight booking successful', bookingId: booking._id });
  } catch (err) {
    console.error('Flight booking error:', err);
    res.status(500).json({ error: 'Flight booking failed' });
  }
});

app.get('/api/trains', async (req, res) => {
  const { from, to, date } = req.query;
  const trains = await Train.find({ from, to, date });
  res.json(trains);
});

app.get('/api/trains/:id', async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json(train);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/train-bookings', async (req, res) => {
  const { trainId, name, email, seats } = req.body;
  try {
    const train = await Train.findById(trainId);
    if (!train) return res.status(404).json({ error: 'Train not found' });

    if (train.seatsAvailable < seats)
      return res.status(400).json({ error: 'Not enough seats available' });

    const booking = new TrainBooking({
      trainId,
      name,
      email,
      seats,
      bookingDate: new Date()
    });

    await booking.save();

    // Update available seats
    train.seatsAvailable -= seats;
    await train.save();

    res.json({ message: 'Train booking successful', bookingId: booking._id });
  } catch (err) {
    console.error('Train booking error:', err);
    res.status(500).json({ error: 'Train booking failed' });
  }
});

// Bus Route
app.post('/api/book-bus', async (req, res) => {
  try {
    const booking = new BusBooking(req.body);
    await booking.save();
    res.status(200).json({ success: true, message: 'Bus booked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error booking bus' });
  }
});

// Payment confirmation for Flight bookings
app.post('/api/confirm-flight-payment', async (req, res) => {
  const { bookingId, paymentStatus, transactionId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Flight booking not found' });

    booking.paymentStatus = paymentStatus;       // e.g., 'paid', 'failed'
    booking.transactionId = transactionId || ''; // store transaction/payment id
    await booking.save();

    res.status(200).json({ success: true, message: 'Flight payment confirmed', bookingId: booking._id });
  } catch (err) {
    console.error('Flight payment confirmation error:', err);
    res.status(500).json({ success: false, message: 'Error confirming flight payment' });
  }
});

// Payment confirmation for Bus bookings
app.post('/api/confirm-bus-payment', async (req, res) => {
  const { bookingId, paymentStatus, transactionId } = req.body;

  try {
    const booking = await BusBooking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Bus booking not found' });

    booking.paymentStatus = paymentStatus;
    booking.transactionId = transactionId || '';
    await booking.save();

    res.status(200).json({ success: true, message: 'Bus payment confirmed', bookingId: booking._id });
  } catch (err) {
    console.error('Bus payment confirmation error:', err);
    res.status(500).json({ success: false, message: 'Error confirming bus payment' });
  }
});

// Chatbot route
const search = new GoogleSearch(process.env.SERPAPI_KEY);

app.post('/chat', (req, res) => {
  const query = req.body.message;
  if (!query) return res.status(400).json({ error: 'Message is required' });

  const params = {
    engine: "google",
    q: query,
    location: "India",  // or any location
    hl: "en"
  };

  search.json(params, (data) => {
    const result = data.organic_results?.[0]?.snippet || "No result found.";
    res.json({ response: result });
  });
});

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Endpoint to send OTP
app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  try {
    await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: `+91${phone}`, channel: 'sms' });
    res.json({ message: 'OTP Sent Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
});

// Endpoint to verify OTP
app.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const verification_check = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: `+91${phone}`, code: otp });

    if (verification_check.status === 'approved') {
      res.json({ success: true, message: 'OTP Verified Successfully' });
    } else {
      res.json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Verification Failed', error: error.message });
  }
});

app.get('/api/user-bookings', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const flights = await FlightBooking.find({ userEmail: email }).lean();
    const trains = await TrainBooking.find({ userEmail: email }).lean();
    const packages = await PackageBooking.find({ userEmail: email }).lean();

    res.json({ flights, trains, packages });
  } catch (error) {
    console.error("Booking Fetch Error:", error); // <== See this in terminal
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Route to cancel booking by type and id
app.delete('/api/cancel-booking/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const collections = {
    flight: FlightBooking,
    train: TrainBooking,
    package: PackageBooking,
  };

  const Model = collections[type];
  if (!Model) return res.status(400).json({ error: 'Invalid booking type' });

  try {
    await Model.findByIdAndDelete(id);
    res.json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} booking cancelled` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

});
