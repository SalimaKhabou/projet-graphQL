const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_id: { type: String, unique: true },
  age: Number,
  gender: String,
  country: String,
  travel_style: [String],
  budget: String,
  preferred_activities: [String],
});

module.exports = mongoose.model('User', UserSchema);