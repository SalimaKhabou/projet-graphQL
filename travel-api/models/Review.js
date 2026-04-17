const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user_id: String,
  place_id: String,
  review_text: String,
  timestamp: Date,
});

module.exports = mongoose.model('Review', ReviewSchema);