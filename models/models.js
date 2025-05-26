const mongoose = require('mongoose');

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    feedback: String,
    createdAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', FeedbackSchema);
// ✅ Export all models together
module.exports = {      
    Feedback,
};
