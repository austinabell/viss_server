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
          },
          options: { sort: { order: -1, isAllDay: 1, windowEnd: 1 } }
        })
        .exec();

      if (user) {
        return user.tasks;
      } else {
        return null;
      }
    },
    allTasks: async () => {
      // ? Remember to remove this
      return Task.find({})
        .populate({ path: "technicians" })
        .exec();
    },
    userTasks: async (root, { id }) => {
      const user = await User.findOne({ _id: id })
        .populate({
          path: "tasks",
          options: { sort: { windowEnd: 1 } },
          populate: {
            path: "technicians"
          }
        })
        .exec();

      return user.tasks;
    }
  },
  Mutation: {
    createTask: async (root, args, { req }) => {
      // Auth.checkSignedIn(req); // ? add this back later

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
      if (task) {
        const user = await User.findById(req.session.userId);
        if (!args.technicians && user) {
          // Push object references to each
          user.tasks.push(task);
          task.technicians.push(user);
          // Save objects to database
          await user.save();
        } else {
          for (let i = 0; i < args.technicians.length; i++) {
            const technician = await User.findById(args.technicians[i]);
            technician.tasks.push(task);
            await technician.save();
          }
        }

        await task.save();
      } else {
        throw Error("Task could not be created");
      }

      return Task.findOne({ _id: task.id }).populate({
        path: "technicians"
        // select: "_id"
      });
    },
    updateTask: async (root, args) => {
      // Auth.checkSignedIn(req); //? Add this back

      // Find task and join to get all technicians assigned
      const task = await Task.findOne({ _id: args.id }).populate({
        path: "technicians"
        // select: "_id"
      });

      if (task) {
        // Map technician object array to string to match input
        const taskTechnicianIds = task.technicians.map((tech) => tech.id);

        if (args.technicians !== undefined) {
          // Remove user references to unassigned tasks
          for (let i = 0; i < taskTechnicianIds.length; i++) {
            if (args.technicians.indexOf(taskTechnicianIds[i]) === -1) {
              const technician = await User.findById(taskTechnicianIds[i]);

              technician.tasks = technician.tasks.filter(
                (taskId) => taskId.toString() !== task.id.toString()
              );
              await technician.save();
            }
          }

          // Add all references to task in User collection
          for (let i = 0; i < args.technicians.length; i++) {
            if (taskTechnicianIds.indexOf(args.technicians[i]) === -1) {
              // Task technicians does not include args technician
              const technician = await User.findById(args.technicians[i]);
              // Remove from list
              technician.tasks.push(task);
              await technician.save();
            }
          }
        }
        // Assign args to task
        Object.assign(task, args);

        // Add new user references to technicians
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

      return Task.findOne({ _id: task.id }).populate({
        path: "technicians"
        // select: "_id"
      });
    },
    updateTaskOrder: async (root, { ids }, { req }) => {
      Auth.checkSignedIn(req);

      for (let i = 0; i < ids.length; i++) {
        const task = await Task.findOne({ _id: ids[i] });

        if (task) {
          Object.assign(task, { order: ids.length - i });
          task.save();
        }
      }

      return true;
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
