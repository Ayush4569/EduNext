import mongoose from "mongoose";
import { Course } from "./course.model.js";

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Chapter title is required"],
    },
    content: {
      type: String,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    video: {
      muxAssetId: {
        type: String,
      },
      muxPlaybackId: {
        type: String,
      },
      
    },
    progress: {
      type: String,
    },
  },
  { timestamps: true }
);


export const Chapter = mongoose.model("Chapter", chapterSchema);
