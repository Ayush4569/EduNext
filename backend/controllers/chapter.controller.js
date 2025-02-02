import { validationResult } from "express-validator";
import { Course } from "../models/course.model.js";
import { Chapter } from "../models/chapters.model.js";

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
  const { chapterId } = req.params;
  const { title } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
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
  const {  chapterId } = req.params;
  const { content } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
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
  const {  chapterId } = req.params;
  const { isFree } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
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
export {
  createChapter,
  reorderChapters,
  getCourseChapter,
  editChapterTitle,
  editChapterDescription,
  editChapterAccess,
};
