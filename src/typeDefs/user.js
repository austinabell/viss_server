import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    users: [User!]!
    user(id: ID!): User
  }

  extend type Mutation {
    signUp(
      email: String!
      username: String!
      name: String!
      password: String!
    ): User
    login(
      email: String!,
      password: String!
    ): String!
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
`
