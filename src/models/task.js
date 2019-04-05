import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    name: String,
    order: Number,
    address: String,
    city: String,
    province: String,
    lat: Number,
    lng: Number,
    status: { type: String, default: "a" },
    isAllDay: Boolean,
    windowStart: Date,
    windowEnd: Date,
    duration: { type: Number, min: 0 },
    phone: String,
    email: String,
    notes: String,
    startedAt: Date,
    finishedAt: Date,
    technicians: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
