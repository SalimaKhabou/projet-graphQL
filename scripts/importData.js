require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');

const Place = require('../models/Place');
const User = require('../models/User');
const Rating = require('../models/Rating');
const Review = require('../models/Review');

const parseArray = (str) => {
  try {
    return JSON.parse(str.replace(/'/g, '"'));
  } catch {
    return [];
  }
};

async function importCSV(filePath, Model, transform) {
  const rows = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => rows.push(transform(row)))
      .on('end', async () => {
        await Model.deleteMany({});
        await Model.insertMany(rows);
        console.log(`✓ ${rows.length} documents importés dans ${Model.modelName}`);
        resolve();
      })
      .on('error', reject);
  });
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  await importCSV('./data/places.csv', Place, (row) => ({
    place_id: row.place_id,
    name: row.name,
    country: row.country,
    region: row.region,
    tags: parseArray(row.tags),
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    average_cost: parseFloat(row.average_cost),
    description: row.description,
    popularity_score: parseFloat(row.popularity_score),
  }));

  await importCSV('./data/users.csv', User, (row) => ({
    user_id: row.user_id,
    age: parseInt(row.age),
    gender: row.gender,
    country: row.country,
    travel_style: parseArray(row.travel_style),
    budget: row.budget,
    preferred_activities: parseArray(row.preferred_activities),
  }));

  await importCSV('./data/ratings.csv', Rating, (row) => ({
    user_id: row.user_id,
    place_id: row.place_id,
    rating: parseFloat(row.rating),
  }));

  await importCSV('./data/reviews.csv', Review, (row) => ({
    user_id: row.user_id,
    place_id: row.place_id,
    review_text: row.review_text,
    timestamp: new Date(row.timestamp),
  }));

  await mongoose.disconnect();
  console.log('Import terminé !');
}

main().catch(console.error);