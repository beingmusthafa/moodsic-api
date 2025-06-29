import mongoose from "mongoose";

// TypeScript interface
export interface Music {
  _id: string;
  title: string;
  audioUrl: string;
  imageUrl: string;
  artists: string[];
}

// Mongoose schema
const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  audioUrl: { type: String, required: true },
  imageUrl: { type: String, required: true },
  artists: [{ type: String, required: true }],
  mood: {
    type: String,
    enum: ["happy", "sad", "angry"],
    required: true,
  },
});

// Mongoose model type
export type MusicDocument = Music & mongoose.Document;

// Create and export the model
export const MusicsModel = mongoose.model<MusicDocument>("musics", musicSchema);
