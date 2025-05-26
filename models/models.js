const mongoose = require('mongoose');

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    feedback: String,
    createdAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', FeedbackSchema);

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
    Feedback,
    Destination

};
