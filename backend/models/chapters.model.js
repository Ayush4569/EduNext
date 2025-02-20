import mongoose from "mongoose";

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
      fileName: {
        type: String,
      },
      fileUrl: {
        type: String,
      },
      format: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

export const Chapter = mongoose.model("Chapter", chapterSchema);
