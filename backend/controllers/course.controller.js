import { validationResult } from "express-validator";
import { Course } from "../models/course.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../services/cloudinary.services.js";

const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const { title } = req.body;
  const newCourse = new Course({ title, author: req.instructor._id });
  await newCourse.save();
  return res.status(200).json(newCourse);
};
const getCourseById = async (req, res) => {
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }

  const course = await Course.findOne({
    _id: courseId,
    author: req.instructor,
  })
    .populate("attachments")
    .populate("chapters");
  if (!course) {
    return res.status(400).json({ message: "No such course exists" });
  }
  return res.status(200).json(course);
};
const updateCourseTitle = async (req, res) => {
  const { title } = req.body;
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { title }
    );
    return res.status(200).json({ message: "course title updated", title });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({
      message: "Failed to update title ",
    });
  }
};
const updateCourseDescription = async (req, res) => {
  const { description } = req.body;
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { description }
    );
    return res
      .status(200)
      .json({ message: "course description updated", description });
  } catch (error) {
    console.log("updateCourseDescription Error:", error);
    res.status(500).json({
      message: "Failed to update description ",
    });
  }
};

const updateCourseImage = async (req, res) => {
  const { courseId } = req.params;
  const coverImage = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  if (!coverImage) {
    return res.status(400).json({ message: "upload an image" });
  }
  try {
    const uploadedPhotoUrl = await uploadToCloudinary(coverImage.path);
    if (!uploadedPhotoUrl) {
      return res.status(400).json({ message: "falied to upload image" });
    }
    await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { coverImage: uploadedPhotoUrl }
    );
    return res
      .status(200)
      .json({ message: "course image uploaded", url: uploadedPhotoUrl });
  } catch (error) {
    console.log("updateCourseImage Error:", error);
    res.status(500).json({
      message: "Failed to updateCourseImage ",
    });
  }
};
const updateCourseCategory = async (req, res) => {
  const { category } = req.body;
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { category }
    );
    return res
      .status(200)
      .json({ message: "course category updated", category });
  } catch (error) {
    console.log("updateCoursecategory Error:", error);
    res.status(500).json({
      message: "Failed to update category ",
    });
  }
};
const updateCoursePrice = async (req, res) => {
  const { price } = req.body;
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { price }
    );
    return res.status(200).json({ message: "course price updated", price });
  } catch (error) {
    console.log("updateCourseprice Error:", error);
    res.status(500).json({
      message: "Failed to update price ",
    });
  }
};
export {
  createCourse,
  getCourseById,
  updateCourseTitle,
  updateCourseDescription,
  updateCourseImage,
  updateCourseCategory,
  updateCoursePrice,
};
