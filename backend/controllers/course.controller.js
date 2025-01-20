import { validationResult } from "express-validator";
import { Course } from "../models/course.model.js";
import { Attachment } from "../models/attachments.model.js";
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
  }).populate("attachments");
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
  if (!courseId) {
    return res.status(200).json({ message: "No such course exists" });
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
  console.log(req.body);
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  if (!courseId) {
    return res.status(200).json({ message: "No such course exists" });
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
  const courseImage = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  if (!courseImage) {
    return res.status(400).json({ message: "upload an image" });
  }
  try {
    const uploadedPhotoUrl = await uploadToCloudinary(req.file.path);
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
  if (!courseId) {
    return res.status(200).json({ message: "No such course exists" });
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
  if (!courseId) {
    return res.status(200).json({ message: "No such course exists" });
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
const addAttachments = async (req, res) => {
  const { courseId } = req.params;

  if (!req.files && !Array.isArray(req.files) && req.files.length == 0) {
    return res.status(400).json({ message: "Files are required" });
  }
  try {
    let uploadedUrls = await Promise.all(
      req.files.map(async (file) => {
        const url = await uploadToCloudinary(file.path);
        return url;
      })
    );
    
    let attachmentNames = req.files.map((file)=> file.originalname)

    if (uploadedUrls.length == 0) {
      throw new Error("Failed to upload");
    }
    const attachments = uploadedUrls.map((url,idx)=>(
      {
        attachment:url,
        attachmentName:attachmentNames[idx]
      }
    ));
    console.log('attachments',attachments);
    const insertedDocs  = await Attachment.insertMany(attachments)
    console.log('insertedDocs',insertedDocs);
    const attachmentIds = insertedDocs.map((att) => att._id);
    const course = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      {
        $push: { attachments: { $each: attachmentIds } },
      },
      { new: true }
    );
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not authorized" });
    }

    // Respond with success
    const allAttachments = await Course.findById(courseId).populate(
      "attachments"
    );
    return res.status(200).json({
      message: "Attachments added successfully",
      attachments: allAttachments.attachments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const removeAttachment = async (req, res) => {
  const { courseId, attachmentId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const attachment = await Attachment.findById(attachmentId);
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { $pull: { attachments: attachmentId } },
      { new: true }
    ).populate("attachments");
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Course not found or not authorized" });
    }
    await Attachment.findByIdAndDelete(attachmentId);
    const publicId = attachment.attachment.split("/").pop().split(".")[0];
    const deletedFile = await deleteFromCloudinary(publicId);
    return res
      .status(200)
      .json({
        attachments: updatedCourse.attachments,
        message: "Attachment removed",
      });
  } catch (error) {
    console.error("Error removing attachment:", error);
    return res.status(500).json({ message: error.message });
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
  addAttachments,
  removeAttachment,
};
