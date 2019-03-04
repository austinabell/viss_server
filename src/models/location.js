import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    lat: Number,
    lng: Number
  },
  { timestamps: true }
);

export default mongoose.model("Location", locationSchema);
