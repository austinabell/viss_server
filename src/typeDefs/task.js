import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    myTasks(timeZone: Int): [Task!]
    allTasks: [Task!]
    taskById(id: ID!): Task
    userTasks(id: ID!): [Task!]
  }

  extend type Mutation {
    createTask(
      name: String
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
      technicians: [ID!]
    ): Task
    updateTask(
      id: ID!
      name: String
      order: Int
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
    updateTaskOrder(ids: [ID!]!): Boolean
    deleteTask(id: ID!): Boolean
  }

  type Task {
    id: ID!
    name: String
    order: Int
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
