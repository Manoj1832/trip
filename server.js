const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

// Bus Booking Schema
const busBookingSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  from: String,
  to: String,
  travelDate: String,
  operator: String,
  price: Number,
  seats: Number,
  bookingDate: { type: Date, default: Date.now }
});

const packageSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  rating: Number,
  reviews: Number,
  flightDetails: Object,
  hotelDetails: Object,
  carDetails: Object,
  price: Number,
  mode: String // "flight", "train", "bus", or "mixed"
});

const TravelPackage = mongoose.model('TravelPackage', packageSchema);


const FlightBooking = require('./models/FlightBooking');
const Flight = require('./models/Flight');
const Train = require('./models/Train');
const TrainBooking = require('./models/TrainBooking');

const { User,Feedback,Payment,Report,Destination} = require('./models/FlightBooking');
const Booking = require('./models/FlightBooking');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/travel-tourism", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
}).then(() => {
    console.log("MongoDB connected...");
}).catch(err => console.error("MongoDB connection error:", err));

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

// Register User
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login User
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

        res.json({
            message: 'Login successful',
            token: 'dummy_token', // Placeholder token
            user: { name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

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

// Packages
app.post('/api/packages', async (req, res) => {
    try {
        const { title, description, price, imageUrl } = req.body;
        const newPackage = new Package({ title, description, price, imageUrl });
        await newPackage.save();
        res.status(201).json({ message: 'Package added successfully', package: newPackage });
    } catch (error) {
        res.status(500).json({ message: 'Error adding package', error });
    }
});

app.get('/api/packages', async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packages', error });
    }
});

// Users (admin)
app.post('/api/users', async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const newUser = new User({ name, email, role });
        await newUser.save();
        res.status(201).json({ message: 'User added successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Reports
app.post('/api/reports', async (req, res) => {
    try {
        const { type, content } = req.body;
        const newReport = new Report({ type, content });
        await newReport.save();
        res.status(201).json({ message: 'Report generated successfully', report: newReport });
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error });
    }
});

app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reports', error });
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


// Suggestions for from/to input
app.get('/api/destinations/suggest', async (req, res) => {
  const { from, to } = req.query;
  try {
    const suggestions = await Destination.find({ name: { $nin: [from, to] } }).limit(5);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Suggestion failed' });
  }
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

app.get('/api/packages', async (req, res) => {
  try {
    const packages = await TravelPackage.find();
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

// Package Route
app.post('/api/book-package', async (req, res) => {
  try {
    const booking = new PackageBooking(req.body);
    await booking.save();
    res.status(200).json({ success: true, message: 'Package booked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error booking package' });
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

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
