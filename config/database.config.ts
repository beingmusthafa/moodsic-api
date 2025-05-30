import mongoose from "mongoose";
import ENV from "./env.config";

export function connectMongoDB() {
  mongoose
    .connect(ENV.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB", err);
    });
}
