import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
        {
          title: {
            type: String,
            unique:true,
            required: [true, "Chapter title is required"],
          },
          content: {
            type: String,
          },
          isFree: {
            type: Boolean,
            default: false,
          },
          isPublished:{
            type: Boolean,
            default: false,
          },
          video: {
            type: String,
            validate: {
              validator: function (v) {
                return /^https?:\/\/.+\..+/.test(v); // Validates URL
              },
              message: (props) => `${props.value} is not a valid URL!`,
            }
          },
          progress:{
            type:String
          }    
},{timestamps:true})

export const Chapter = mongoose.model("Chapter", chapterSchema);