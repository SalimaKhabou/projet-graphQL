const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  user_id: String,
  place_id: String,
  rating: Number,
});

module.exports = mongoose.model('Rating', RatingSchema);