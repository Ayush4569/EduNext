import mongoose from "mongoose";
import { Chapter } from "./chapters.model.js";
import { Attachment } from "./attachments.model.js";
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\..+/.test(v); // Validates URL
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },

    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],

    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },

    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: [true, "Course author is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  { timestamps: true }
);

courseSchema.pre("findOneAndDelete", async function (next) {
  const courseId = this.getQuery()._id;
  console.log("courseId", courseId);
  try {
    const course = await this.model.findById(courseId).select("chapters");
    console.log("course", course);
    if (!course) {
      return next(new Error("Course chapters not found"));
    }
    const deletedChapters = await Chapter.deleteMany({
      _id: { $in: course.chapters },
    });
    next();
  } catch (error) {
    next(error);
  }
});
courseSchema.pre("findOneAndDelete", async function (next) {
  const courseId = this.getQuery()._id;
  try {
    const course = await this.model.findById(courseId).select("attachments");
    if (!course) {
      return next(new Error("Course attachments not found"));
    }
    const deletedAttachments = await Attachment.deleteMany({
      _id: { $in: course.attachments },
    });
    next();
  } catch (error) {
    next(error);
  }
});
export const Course = mongoose.model("Course", courseSchema);
