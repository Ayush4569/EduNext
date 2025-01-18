import mongoose from "mongoose";

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
     }
    ],

    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },

    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attachment",
       }
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: [true, "Course author is required"],
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
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

export const Course = mongoose.model("Course", courseSchema);
