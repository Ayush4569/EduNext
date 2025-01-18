import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
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
            }
          }    
},{timestamps:true})

export const Chapter = mongoose.model("Chapter", chapterSchema);