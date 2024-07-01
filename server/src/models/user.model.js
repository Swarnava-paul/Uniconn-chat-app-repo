import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      default: "",
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    Education: {
      type: String,
      required: true,
    },
    CourseofStream: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    Department: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    coins: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
