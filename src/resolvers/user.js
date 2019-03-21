import { UserInputError } from "apollo-server-express";
import mongoose from "mongoose";
import Joi from "joi";

import * as Auth from "../services/auth";
import { User, Location } from "../models";
import { signUp, login } from "../schemas";

// Cannot request tasks from any user query or mutation unless changed
export default {
  Query: {
    me: (root, args, { req }) => {
      Auth.checkSignedIn(req);

      return User.findById(req.session.userId);
    },
    users: async () => {
      // ? Remember to remove this
      return User.find({});
    },
    user: (root, { id }, { req }) => {
      Auth.checkSignedIn(req);

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError("User id is not a valid user ID.");
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
    deleteAccount: async (root, args, { req, res }) => {
      Auth.checkSignedIn(req);

      const user = await User.findOneAndDelete({ _id: req.session.userId });
      if (user) {
        Auth.signOut(req, res);
        return true;
      } else {
        return false;
      }
    },
    updateUser: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      const { lat, lng } = args;

      const user = await User.findOne({ _id: req.session.userId });

      // Handle location setting
      if (lat && lng) {
        const location = await Location.create({
          userId: req.session.userId,
          lat,
          lng
        });
        if (location) {
          user.currentLocation = location;
        }
      }

      Object.assign(user, args);
      user.save();

      return user;
    }
  }
};
