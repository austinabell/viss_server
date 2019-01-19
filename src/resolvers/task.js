// import Joi from "joi"; // TODO: Add validation to data being stored

import * as Auth from "../services/auth";
import { User, Task } from "../models";

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
        return "Task couldnt be created";
      }

      return task;
    },
    updateTask: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      return;
    },
    deleteTask: async (root, args, { req }) => {
      Auth.checkSignedIn(req);

      return;
    }
  }
};
