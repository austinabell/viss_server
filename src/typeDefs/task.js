import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    myTasks(timeZone: Int): [Task!]
  }

  extend type Mutation {
    createTask(
      address: String!
      city: String!
      province: String!
      lat: Float
      lng: Float
      status: String
      isAllDay: Boolean
      windowStart: String
      windowEnd: String
      duration: Int!
      notes: String
    ): Task
    updateTask(
      id: ID!
      address: String
      city: String
      province: String
      lat: Float
      lng: Float
      status: String
      isAllDay: Boolean
      windowStart: String
      windowEnd: String
      duration: Int
      notes: String
    ): Task
    deleteTask(id: ID!): Boolean
  }

  type Task {
    id: ID!
    address: String!
    city: String!
    province: String!
    lat: Float
    lng: Float
    status: String
    isAllDay: Boolean!
    windowStart: String!
    windowEnd: String!
    duration: Int!
    notes: String
    technicians: [User!]!
    createdAt: String!
    updatedAt: String!
  }
`;
