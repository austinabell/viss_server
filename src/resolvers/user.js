import { User } from '../models'
import { UserInputError } from 'apollo-server-express'
import mongoose from 'mongoose'

export default {
  Query: {
    users: (root, args, context, info) => {
      return User.find({})
    },
    user: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user ID.`)
      }

      return User.findById(id)
    }
  },
  Mutation: {
    signUp: (root, args, context, info) => {
      // TODO: Authentication

      return User.create(args)
    }
  }
}
