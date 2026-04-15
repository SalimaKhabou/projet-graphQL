const { PubSub } = require('graphql-subscriptions');
const Place = require('../models/Place');
const User = require('../models/User');
const Rating = require('../models/Rating');
const Review = require('../models/Review');

const pubsub = new PubSub();

const resolvers = {
  Query: {
    places: async () => {
      return await Place.find({});
    },
    place: async (_, { place_id }) => {
      return await Place.findOne({ place_id });
    },
    placesByCountry: async (_, { country }) => {
      return await Place.find({ country: new RegExp(country, 'i') });
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

  Place: {
    reviews: async (place) => {
      return await Review.find({ place_id: place.place_id });
    },
    ratings: async (place) => {
      return await Rating.find({ place_id: place.place_id });
    },
  },
    //avec option 1
  /*Query: {
    places: async (_, { sortBy, sortOrder }) => {
        const sort = {};
        if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        return await Place.find({}).sort(sort);
    },

    place: async (_, { place_id }) => {
        return await Place.findOne({ place_id });
    },

    placesByCountry: async (_, { country, sortBy, sortOrder }) => {
        const sort = {};
        if (sortBy) sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
        return await Place.find({ country: new RegExp(country, 'i') }).sort(sort);
    },

    users: async () => await User.find({}),
    user: async (_, { user_id }) => await User.findOne({ user_id }),
    reviews: async (_, { place_id }) => await Review.find({ place_id }),
    ratings: async (_, { place_id }) => await Rating.find({ place_id }),
    },
*/
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
      return await Place.findOneAndUpdate({ place_id }, updates, { new: true });
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
    },
};

module.exports = resolvers;