import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
  }

  extend type Mutation {
    signUp(
      email: String!
      username: String!
      name: String!
      password: String!
    ): User
    login(email: String!, password: String!): User,
    logout: Boolean
  }

  type User {
    id: ID!
    email: String!
    username: String!
    name: String!
    currentLocation: Location
    isStarted: Boolean!
    createdAt: String!
  }

  type Location {
    lng: Float
    lat: Float
    time: String
  }
`;
