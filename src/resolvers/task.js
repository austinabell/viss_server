import Joi from "joi";

import * as Auth from "../services/auth";
import { User, Task } from "../models";
import { createTask } from "../schemas";
// import { transformSchema } from "graphql-tools";

export default {
  Query: {
    myTasks: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      const user = await User.findOne({ _id: req.session.userId }).populate(
        "tasks"
      );

      return user.tasks;
    }
  },
  Mutation: {
    createTask: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      await Joi.validate(args, createTask, { abortEarly: false });

      // Validate here
      // Created objects here
      // const task = new Task(args);
      const task = await Task.create(args);
      const user = await User.findById(req.session.userId);
      if (user && task) {
        // Push object references to each
        user.tasks.push(task);
        task.technicians.push(user);
        // Save objects to database
        await user.save();
        await task.save();
      } else {
        throw Error("Task could not be created");
      }

      return task;
    },
    updateTask: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      const task = await Task.findOne({ _id: args.id }).populate({
        path: "technicians"
        // select: "_id"
      });

      if (task) {
        Object.assign(task, args);
        task.save();

        // ? Add back authentication validation for updating tasks
        //   if (
        //     task.technicians.some((t) => t._id.toString() === req.session.userId)
        //   ) {
        //     //correct
        //   } else {
        //   }
      } else {
        throw Error("Task with that id does not exist");
      }

      return task;
    },
    deleteTask: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      const task = await Task.findOne({ _id: args.id }).populate({
        path: "technicians",
        select: "_id"
      });

      if (task) {
        if (
          task.technicians.some((t) => t._id.toString() === req.session.userId)
        ) {
          await Task.findOneAndDelete({ _id: args.id });
          return true;
        } else {
          throw Error("You do not have permission to delete this task");
        }
      } else {
        throw Error("Task with that id does not exist");
      }
    }
  }
};
