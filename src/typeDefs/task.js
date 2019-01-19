import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    myTasks: [Task!]
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
      duration: Int
      notes: String
    ): Task
    updateTask(
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
    deleteTask: Boolean
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
