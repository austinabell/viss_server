import Joi from "joi";

import * as Auth from "../services/auth";
import { User, Task } from "../models";
import { createTask } from "../schemas";
import moment from "moment";

export default {
  Query: {
    myTasks: async (root, { timeZone }, { req }) => {
      Auth.checkSignedIn(req);

      const today = moment().utc();

      if (timeZone) {
        // Get current date based on timezone
        today.add(timeZone, "hours");
      }

      today.startOf("day");

      const endOfDay = moment(today)
        .utc()
        .endOf("day");

      if (timeZone) {
        // Adjust for time zone in request
        today.subtract(timeZone, "hours");
        endOfDay.subtract(timeZone, "hours");
      }

      // Find user and join with tasks
      const user = await User.findOne({ _id: req.session.userId })
        .populate({
          path: "tasks",
          match: {
            windowStart: {
              $lte: endOfDay.toDate()
            },
            windowEnd: { $gte: today.toDate() }
          }
        })
        .exec();

      return user.tasks;
    }
  },
  Mutation: {
    createTask: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      // Default to current time and all day if window time isn't passed
      if (args.windowStart == null || args.windowEnd == null) {
        args.windowStart = moment().toISOString();
        args.windowEnd = moment().toISOString();
        args.isAllDay = true;
      }

      // Validate input
      await Joi.validate(args, createTask, { abortEarly: false });

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

      // Find task and join to get all technicians assigned
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
    updateTaskOrder: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      return "Not implemented";

    },
    deleteTask: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      // Find task and join with technicians to ensure they can update it
      const task = await Task.findOne({ _id: args.id }).populate({
        path: "technicians",
        select: "_id"
      });

      if (task) {
        if (
          task.technicians.some((t) => t._id.toString() === req.session.userId)
        ) {
          await Task.findOneAndDelete({ _id: args.id });
          // ? Remove task from user list when deleting
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
