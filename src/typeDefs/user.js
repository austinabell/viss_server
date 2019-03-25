import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    me: User
    user(id: ID!): User
    users: [User!]!
  }

  extend type Mutation {
    signUp(name: String, email: String!, password: String!): User
    login(email: String!, password: String!): User
    logout: Boolean
    deleteAccount: Boolean
    updateUser(
      email: String
      username: String
      name: String
      lat: Float
      lng: Float
      isStarted: Boolean
    ): User
  }

  type User {
    id: ID!
    email: String!
    username: String
    name: String
    currentLocation: Location
    isStarted: Boolean
    tasks: [Task!]!
    createdAt: String!
    updatedAt: String!
  }

  type Location {
    userId: ID!
    lng: Float
    lat: Float
    time: String
  }
`;
