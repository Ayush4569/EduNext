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
  try {
    const courseChapterIds = await this.model
      .findById(courseId)
      .select("chapters");
    if (!courseChapterIds) {
      return next(new Error("Course chapters not found"));
    }
    await Chapter.deleteMany({ _id: { $in: courseChapterIds } });
    next();
  } catch (error) {
    next(error);
  }
});
courseSchema.pre("findOneAndDelete", async function (next) {
  const courseId = this.getQuery()._id;
  try {
    const courseAttachmentIds = await this.model
      .findById(courseId)
      .select("attachments");
    if (!courseAttachmentIds) {
      return next(new Error("Course attachments not found"));
    }
    await Attachment.deleteMany({ _id: { $in: courseAttachmentIds } });
    next();
  } catch (error) {
    next(error);
  }
});
export const Course = mongoose.model("Course", courseSchema);
