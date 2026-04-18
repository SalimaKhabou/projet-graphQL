const DataLoader = require('dataloader');
const Review = require('../models/Review');
const Rating = require('../models/Rating');

// 🔹 Reviews loader (batch par place_id)
const reviewsLoader = new DataLoader(async (placeIds) => {
  const reviews = await Review.find({
    place_id: { $in: placeIds }
  });

  // regroupement par place_id
  return placeIds.map(id =>
    reviews.filter(r => r.place_id === id)
  );
});

// 🔹 Ratings loader (batch par place_id)
const ratingsLoader = new DataLoader(async (placeIds) => {
  const ratings = await Rating.find({
    place_id: { $in: placeIds }
  });

  return placeIds.map(id =>
    ratings.filter(r => r.place_id === id)
  );
});

module.exports = {
  reviewsLoader,
  ratingsLoader
};