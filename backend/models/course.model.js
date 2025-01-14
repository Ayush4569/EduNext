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
        title: {
          type: String,
          required: [true, "Chapter title is required"],
        },
        content: {
          type: String,
          required: [true, "Chapter content is required"],
        },
        access: {
          type: Boolean,
          required: [true, "Chapter access type is required"],
          default: false,
        },
        video: {
          type: String,
          required: [true, "Chapter video URL is required"],
          validate: {
            validator: function (v) {
              return /^https?:\/\/.+\..+/.test(v); // Validates URL
            },
            message: (props) => `${props.value} is not a valid URL!`,
          },
        },
      },
      ,
    ],

    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },

    attachments: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+\..+/.test(v); // Validates URL
          },
          message: (props) => `${props.value} is not a valid URL!`,
        },
      },
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
