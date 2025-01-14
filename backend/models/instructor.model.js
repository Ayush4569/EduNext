import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const instructorSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        minlength: [3, "First name must be atleast 3 characters long"],
        required: [true, "First name is required"],
      },
      lastname: {
        type: String,
      },
    },
    email: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
      reqired: [true, "Email id is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be atleast 3 characters long"],
      select: false,
    },
    createdCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    profileImage: {
      type: String,
      default: "/avatar.png",
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
    },
  },
  { timestamps: true }
);

instructorSchema.statics.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};
instructorSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};
instructorSchema.methods.verifyPassword = async function(password){
  return await bcrypt.compare(password,this.password)
};
export const Instructor = mongoose.model("Instructor", instructorSchema);
