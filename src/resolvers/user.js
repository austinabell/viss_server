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
    user: (root, { id }, { req }) => {
      Auth.checkSignedIn(req);

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user ID.`);
      }

      return User.findById(id);
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
    },
    deleteAccount: async (root, args, { req }) => {
      Auth.checkSignedIn(req);
      try {
        let user;
        await User.findOneAndDelete({ _id: req.session.userId }, function(
          err,
          offer
        ) {
          if (err) {
            console.log("error in deleting user from database: " + err);
          } else {
            user = offer;
          }
        });
        if (user) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  }
};
