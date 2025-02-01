import { validationResult } from "express-validator";
import { Course } from "../models/course.model.js";
import { Chapter } from "../models/chapters.model.js";
import { Attachment } from "../models/attachments.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../services/cloudinary.services.js";
import { generateMuxUploadUrl } from "../services/mux.services.js";

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

    let attachmentNames = req.files.map((file) => file.originalname);

    if (uploadedUrls.length == 0) {
      throw new Error("Failed to upload");
    }
    const attachments = uploadedUrls.map((url, idx) => ({
      attachment: url,
      attachmentName: attachmentNames[idx],
    }));
    const insertedDocs = await Attachment.insertMany(attachments);
    const attachmentIds = insertedDocs.map((att) => att._id);
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      {
        $push: { attachments: { $each: attachmentIds } },
      },
      { new: true }
    );
    if (!updatedCourse) {
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
    return res.status(200).json({
      attachments: updatedCourse.attachments,
      message: "Attachment removed",
    });
  } catch (error) {
    console.error("Error removing attachment:", error);
    return res.status(500).json({ message: error.message });
  }
};
const createChapter = async (req, res) => {
  const { courseId } = req.params;
  const { title } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const createdChapter = await Chapter.create({ title });

    const courseWithChapter = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      {
        $addToSet: { chapters: createdChapter._id },
      },
      { new: true }
    ).populate("chapters");
    if (courseWithChapter) {
      return res.status(200).json({
        message: "chapter created",
        chapter: courseWithChapter.chapters,
      });
    }
  } catch (error) {
    console.error("Error creating chapters:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const reorderChapters = async (req, res) => {
  console.log(req.body);
  const { courseId } = req.params;
  const { chapters } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const course = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { chapters }
    ).populate("chapters");
    return res.status(200).json({
      message: "chapter reordered",
      reorderedChapters: course.chapters,
    });
  } catch (error) {
    console.error("Error reordering chapters:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getCourseChapter = async (req, res) => {
  const { courseId, chapterId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const isValidCourseChapter = await Course.findOne({
    _id: courseId,
    author: req.instructor,
    chapters: chapterId,
  }).populate("chapters");
  if (!isValidCourseChapter) {
    return res
      .status(400)
      .json({ message: "This chapter does not belong to this course" });
  }

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    return res.status(404).json({ message: "Chapter not found" });
  }
  return res.status(200).json({ chapter });
};
const editChapterTitle = async (req, res) => {
  const { courseId, chapterId } = req.params;
  const { title } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const isValidCourseChapter = await Course.findOne({
    _id: courseId,
    author: req.instructor,
    chapters: chapterId,
  });
  if (!isValidCourseChapter) {
    return res
      .status(400)
      .json({ message: "This chapter does not belong to this course" });
  }
  try {
    const updatedChapterTitle = await Chapter.findOneAndUpdate(
      { _id: chapterId },
      { title },
      { new: true }
    );
    if (updatedChapterTitle) {
      return res.status(200).json({
        message: "Chapter title updated successfully",
        title: updatedChapterTitle.title,
      });
    }
  } catch (error) {
    console.error("Error updating chapter title:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const editChapterDescription = async (req, res) => {
  const { courseId, chapterId } = req.params;
  const { content } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const isValidCourseChapter = await Course.findOne({
    _id: courseId,
    author: req.instructor,
    chapters: chapterId,
  });
  if (!isValidCourseChapter) {
    return res
      .status(400)
      .json({ message: "This chapter does not belong to this course" });
  }
  try {
    const updatedChapterDescription = await Chapter.findOneAndUpdate(
      { _id: chapterId },
      { content },
      { new: true }
    );
    if (updatedChapterDescription) {
      return res.status(200).json({
        message: "Chapter content updated successfully",
        content: updatedChapterDescription.content,
      });
    }
  } catch (error) {
    console.error("Error updating chapter content:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const editChapterAccess = async (req, res) => {
  const { courseId, chapterId } = req.params;
  const { isFree } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const isValidCourseChapter = await Course.findOne({
    _id: courseId,
    author: req.instructor,
    chapters: chapterId,
  });
  if (!isValidCourseChapter) {
    return res
      .status(400)
      .json({ message: "This chapter does not belong to this course" });
  }
  try {
    const updatedChapterAccess = await Chapter.findOneAndUpdate(
      { _id: chapterId },
      { isFree },
      { new: true }
    );
    if (updatedChapterAccess) {
      return res.status(200).json({
        message: "Access setting updated successfully",
        isFree: updatedChapterAccess.isFree,
      });
    }
  } catch (error) {
    console.error("Error updating chapter access:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const uploadChapterVideo = async (req, res) => {
  const { courseId, chapterId } = req.params;
  const chapterVideo = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  if (!chapterVideo) {
    return res.status(400).json({ message: "Upload a video" });
  }
  const isValidCourseChapter = await Course.findOne({
    _id: courseId,
    author: req.instructor,
    chapters: chapterId,
  });
  if (!isValidCourseChapter) {
    return res
      .status(400)
      .json({ message: "This chapter does not belong to this course" });
  }

  // try {
  //   const response = await uploadToMux();
  //   if (!response) {
  //     return res.status(400).json({ message: "Failed to upload video" });
  //   }

  //   await Chapter.findOneAndUpdate(
  //     {
  //       _id: chapterId,
  //     },
  //     {
  //       video:{
  //         muxAssetId: response.data.id,
  //         muxPlaybackId:  response.playback_ids[0].url,
  //       }
  //     }
  //   );
  //   return res
  //     .status(200)
  //     .json({
  //       message: "Video uploaded successfully",
  //       videoUrl: response.playback_ids[0].url,
  //     });
  // } catch (error) {
  //   console.error("Error uploading video:", error);
  //   return res.status(500).json({ message: "Internal Server Error" });
  // }
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
  reorderChapters,
  createChapter,
  getCourseChapter,
  editChapterTitle,
  editChapterDescription,
  editChapterAccess,
  uploadChapterVideo
};
