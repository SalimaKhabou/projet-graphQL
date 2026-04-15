const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  place_id: { type: String, unique: true },
  name: String,
  country: String,
  region: String,
  tags: [String],
  latitude: Number,
  longitude: Number,
  average_cost: Number,
  description: String,
  popularity_score: Number,
});

module.exports = mongoose.model('Place', PlaceSchema);