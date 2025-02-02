import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Chapter title is required"],
    },
    slug:{
      type: String,
      unique: true,
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
      muxAssetId: {
        type: String,
      },
      muxPlaybackId: {
        type: String,
      },
      
    },
    progress: {
      type: String,
    },
  },
  { timestamps: true }
);

chapterSchema.pre('save', function(next){
  if(this.isModified('title')){
    console.log('inside pre save');
    this.slug = this.title.toLowerCase().split(' ').join('-');
  }
  next();
})


export const Chapter = mongoose.model("Chapter", chapterSchema);
