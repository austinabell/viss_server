import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
  }

  extend type Mutation {
    signUp(email: String!, password: String!, username: String!): User
    login(email: String!, password: String!): User
    logout: Boolean
    deleteAccount: Boolean
  }

  type User {
    id: ID!
    email: String!
    username: String!
    name: String
    currentLocation: Location
    isStarted: Boolean
    tasks: [Task!]!
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    lng: Float
    lat: Float
    time: String
  }
`;
