import { UserInputError } from "apollo-server-express";
import mongoose from "mongoose";
import Joi from "joi";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models";
import { signUp } from "../schemas";
import { SECRET } from "../config";

export default {
  Query: {
    users: (root, args, context, info) => {
      return User.find({});
    },
    user: (root, { id }, context, info) => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError(`${id} is not a valid user ID.`);
      }

      return User.findById(id);
    },
    me: (root, args, { id }) => {
      if (id) {
        return User.findById(id);
      }
      // Not logged in
      return null;
    }
  },
  Mutation: {
    signUp: async (root, args, context, info) => {
      // TODO: Authentication

      await Joi.validate(args, signUp, { abortEarly: false });
      const user = await User.create(args);

      return user;
    },
    login: async (root, { email, password }, context, info) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("No user with that email");
      }

      const valid = await compare(password, user.password);
      if (!valid) {
        throw new Error("Incorrect password");
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username
        },
        SECRET,
        {
          expiresIn: "1y"
        }
      );
      return token;
    }
  }
};
