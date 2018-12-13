import { UserInputError } from "apollo-server-express";
import mongoose from "mongoose";
import Joi from "joi";

import * as Auth from "../services/auth";
import { User } from "../models";
import { signUp, login } from "../schemas";

export default {
  Query: {
    me: (root, args, { req }) => {
      // TODO: projection
      Auth.checkSignedIn(req);

      return User.findById(req.session.userId);
    },
    users: (root, args, { req }) => {
      const { userId } = req.session;

      if (userId) {
        return User.find({});
      } else return null; // Change else return statement
    },
    user: (root, { req }) => {
      Auth.checkSignedIn(req);

      if (!mongoose.Types.ObjectId.isValid(req.id)) {
        throw new UserInputError(`${req.id} is not a valid user ID.`);
      }

      return User.findById(req.id);
    }
  },
  Mutation: {
    signUp: async (root, args, { req }) => {
      Auth.checkSignedOut(req);

      await Joi.validate(args, signUp, { abortEarly: false });
      const user = await User.create(args);

      req.session.userId = user.id;

      return user;
    },
    login: async (root, args, { req }) => {
      const { userId } = req.session;

      if (userId) {
        return User.findById(userId);
      }

      await Joi.validate(args, login, { abortEarly: false });

      const user = await Auth.attemptSignIn(args.email, args.password);

      req.session.userId = user.id;

      return user;
    },
    logout: (root, args, { req, res }) => {
      Auth.checkSignedIn(req);

      return Auth.signOut(req, res);
    }
  }
};
