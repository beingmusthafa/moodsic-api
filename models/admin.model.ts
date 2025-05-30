import mongoose from "mongoose";
import { TAdmin } from "../types";

const adminSchema = new mongoose.Schema<TAdmin>({
  fullName: {
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
  phone: {
    required: true,
    type: String,
    maxlength: 10,
  },
  image: {
    type: String,
    required: false,
    default: "",
    trim: true,
    maxlength: 1000,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    maxlength: 128,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["manager", "super"],
    default: "manager",
  },
});

export const AdminModel = mongoose.model("admin", adminSchema);
