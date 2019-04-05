import mongoose, { Schema } from "mongoose";
import { hash, compare } from "bcryptjs";

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true
      // validate: {
      //   validator: (email) => User.doesntExist({ email }),
      //   message: () => "Email has already been taken"
      // }
    },
    username: {
      type: String
      // unique: true
      // validate: {
      //   validator: (username) => User.doesntExist({ username }),
      //   message: () => "Username has already been taken"
      // }
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task"
      }
    ],
    name: String,
    password: String,
    isStarted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

// Function so hash password on save
userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
});

userSchema.statics.doesntExist = async function(options) {
  return (await this.where(options).countDocuments()) === 0;
};

userSchema.methods.matchesPassword = function(password) {
  return compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
