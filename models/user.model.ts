import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 254,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    maxlength: 128,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export const UserModel = mongoose.model("user", userSchema);
