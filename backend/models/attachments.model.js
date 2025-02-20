import mongoose from "mongoose";
const attachmentSchema = new mongoose.Schema(
  {
    attachmentName: {
      type: String,
    },
    attachment: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\..+/.test(v); // Validates URL
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
  },
  { timestamps: true }
);

export const Attachment = mongoose.model("Attachment", attachmentSchema);
