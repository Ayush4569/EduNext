import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    index: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
    index: true,
  },
  completedChapter: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    },
  ],
  progressPercentage: {
    type: Number,
    default: 0,
  },
});

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
