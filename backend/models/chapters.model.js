import mongoose from "mongoose";
import { Course } from "./course.model";

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

chapterSchema.post("findOneAndUpdate",async function(next){
  const chapterId = this.getQuery()._id;
  try {
    await Course.findOneAndUpdate({chapters:chapterId},{})
  } catch (error) {
    
  }
})

export const Chapter = mongoose.model("Chapter", chapterSchema);