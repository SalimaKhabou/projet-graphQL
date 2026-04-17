const { PubSub } = require('graphql-subscriptions');
const Place = require('../models/Place');
const User = require('../models/User');
const Rating = require('../models/Rating');
const Review = require('../models/Review');

const pubsub = new PubSub();

const resolvers = {
  Query: {
    // [TRI] Ajout des arguments sortBy et order
    //places: async (_, { sortBy, order }) => {
    places: async (_, { sortBy, order, limit = 10, offset = 0 }) => {
      const sortOptions = {};
      if (sortBy) sortOptions[sortBy] = order === 'DESC' ? -1 : 1;
      return await Place.find({}).sort(sortOptions).skip(offset).limit(limit);
    },

    place: async (_, { place_id }) => {
      return await Place.findOne({ place_id });
    },

    // [TRI] Ajout des arguments sortBy et order
    //placesByCountry: async (_, { country, sortBy, order }) => {
    placesByCountry: async (_, { country, sortBy, order, limit = 10, offset = 0 }) => {
      const sortOptions = {};
      if (sortBy) sortOptions[sortBy] = order === 'DESC' ? -1 : 1;
      return await Place.find({ country: new RegExp(country, 'i') }).sort(sortOptions).skip(offset).limit(limit);
    },

    users: async () => {
      return await User.find({});
    },
    user: async (_, { user_id }) => {
      return await User.findOne({ user_id });
    },
    reviews: async (_, { place_id }) => {
      return await Review.find({ place_id });
    },
    ratings: async (_, { place_id }) => {
      return await Rating.find({ place_id });
    },
  },

  //Query.ratings → "Fetch ratings by ID manually"
  //Place.ratings → "Fetch ratings automatically when I fetch a place"

  /*Aspect            Query (root) 🧠             Place (nested) 🧩
  How it's used       Called directly             Called inside another query
  Input               Requires place_id           Uses parent place
  Context             Independent                 Depends on Place
  Flexibility         More flexible               More convenient*/

  //Use nested (Place.ratings) for frontend convenience
  //Use root query for filtering/searching

  Place: {
    reviews: async (place) => {
      return await Review.find({ place_id: place.place_id });
    },
    ratings: async (place) => {
      return await Rating.find({ place_id: place.place_id });
    },
  },

  Mutation: {
    addPlace: async (_, args) => {
      const allPlaces = await Place.find({}, { place_id: 1 });
      const maxNum = allPlaces.reduce((max, p) => {
        const num = parseInt(p.place_id.replace('p', ''));
        return num > max ? num : max;
      }, -1);

      const newPlace = new Place({
        ...args,
        place_id: `p${maxNum + 1}`,
        tags: [],
        popularity_score: 0,
      });

      await newPlace.save();
      pubsub.publish('PLACE_ADDED', { placeAdded: newPlace });
      return newPlace;
    },

    updatePlace: async (_, { place_id, ...updates }) => {
      const updated = await Place.findOneAndUpdate({ place_id }, updates, { new: true });
      pubsub.publish('PLACE_UPDATED', { placeUpdated: updated });
      return updated;
    },

    deletePlace: async (_, { place_id }) => {
      await Place.deleteOne({ place_id });
      pubsub.publish('PLACE_DELETED', { placeDeleted: place_id });
      return `Place ${place_id} supprimée`;
    },

    addReview: async (_, args) => {
      const review = new Review({ ...args, timestamp: new Date() });
      await review.save();
      pubsub.publish('REVIEW_ADDED', { reviewAdded: review });
      return review;
    },
  },

  Subscription: {
    placeAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['PLACE_ADDED']),
    },
    reviewAdded: {
      subscribe: () => pubsub.asyncIterableIterator(['REVIEW_ADDED']),
    },
    placeDeleted: {
      subscribe: () => pubsub.asyncIterableIterator(['PLACE_DELETED']),
    },
    placeUpdated: {
      subscribe: () => pubsub.asyncIterableIterator(['PLACE_UPDATED']),
    },
  },
};

module.exports = resolvers;