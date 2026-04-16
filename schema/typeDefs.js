const { gql } = require('apollo-server');

const typeDefs = gql`
  type Place {
    id: ID!
    place_id: String!
    name: String!
    country: String!
    region: String!
    tags: [String]
    latitude: Float
    longitude: Float
    average_cost: Float
    description: String
    popularity_score: Float
    reviews: [Review]
    ratings: [Rating]
  }

  type User {
    id: ID!
    user_id: String!
    age: Int
    gender: String
    country: String
    travel_style: [String]
    budget: String
    preferred_activities: [String]
  }

  type Rating {
    id: ID!
    user_id: String!
    place_id: String!
    rating: Float!
  }

  type Review {
    id: ID!
    user_id: String!
    place_id: String!
    review_text: String!
    timestamp: String
  }

  type Query {
    places: [Place]
    place(place_id: String!): Place
    placesByCountry(country: String!): [Place]
    users: [User]
    user(user_id: String!): User
    reviews(place_id: String!): [Review]
    ratings(place_id: String!): [Rating]
  }

  type Mutation {
    addPlace(
      name: String!
      country: String!
      region: String!
      description: String
      average_cost: Float
    ): Place

    updatePlace(place_id: String!, description: String, average_cost: Float): Place
    deletePlace(place_id: String!): String

    addReview(user_id: String!, place_id: String!, review_text: String!): Review
  }

  type Subscription {
    placeAdded: Place
    reviewAdded: Review
    placeDeleted: String
    placeUpdated: Place   # ← ajouter cette ligne

  }


 
`;

module.exports = typeDefs;