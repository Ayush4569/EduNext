import { validationResult } from "express-validator";
import { Course } from "../models/course.model.js";
import { Chapter } from "../models/chapters.model.js";
import awsService from "../services/aws.services.js";

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
      [
        {
          $set: {
            chapters,
          },
        },
      ]
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
  const { chapterId } = req.params;
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
const uploadChapterVideo = async (req, res) => {
  if (req.body.oldVideo) {
    await awsService.deleteFile(req.body.oldVideo);
  }
  if (!req.file) {
    return res.status(400).json({ message: "Please upload a video" });
  }
  const { chapterId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const uploadedVideo = req.file;
    const uploadedLink = await awsService.uploadFile(
      uploadedVideo.originalname,
      uploadedVideo.path,
      uploadedVideo.mimetype
    );
    if (!uploadedLink) {
      return res.status(500).json({ message: "Error uploading video" });
    }
    const updatedChapterVideo = await Chapter.findOneAndUpdate(
      { _id: chapterId },
      {
        video: {
          fileName: uploadedVideo.originalname,
          fileUrl: uploadedLink.Location,
          format: uploadedVideo.mimetype,
        },
      },
      { new: true }
    );
    if (updatedChapterVideo) {
      return res.status(200).json({
        message: "Chapter video uploaded successfully",
        video: updatedChapterVideo.video,
      });
    }
  } catch (error) {
    console.error("Error uploading chapter video:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getSignedUrl = async (req, res) => {
  try {
    const signedUrl = await awsService.getSignedUrl(req.params.fileName);
    if (!signedUrl) {
      return res.status(500).json({ message: "Error generating signed URL" });
    }
    return res.status(200).json({ signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const toggleChapterAccess = async (req, res) => {
  const { chapterId } = req.params;
  try {
    const updatedChapterAccess = await Chapter.findOneAndUpdate(
      { _id: chapterId },
      [
        {
          $set: {
            isFree: {
              $not: ["$isFree"],
            },
          },
        },
      ],
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
const toggleChapterPublication = async (req, res) => {
  const { chapterId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const updatedChapterState = await Chapter.findOneAndUpdate(
      { _id: chapterId },
      [
        {
          $set: {
            isPublished: {
              $not: ["$isPublished"],
            },
          },
        },
      ],

      { new: true }
    );
    if (!updatedChapterState) {
      return res.status(404).json({
        message: "Error while updating the chapter publication state",
      });
    }
    return res.status(200).json({
      message: updatedChapterState.isPublished
        ? "Chapter published"
        : "Chapter unpublished",
      isPublished: updatedChapterState.isPublished,
    });
  } catch (error) {
    console.error("Error updating chapter publication:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteChapter = async (req, res) => {
  const { chapterId, courseId } = req.params;

  try {
    const deletedChapter = await Chapter.findByIdAndDelete(chapterId);

    if (!deletedChapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { chapters: chapterId } },
      { new: true }
    );
    if (!updatedCourse) {
      return res
        .status(400)
        .json({ message: "Error while deleting the chapter from course" });
    }
    return res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createChapter,
  reorderChapters,
  getCourseChapter,
  editChapterTitle,
  editChapterDescription,
  uploadChapterVideo,
  getSignedUrl,
  toggleChapterAccess,
  toggleChapterPublication,
  deleteChapter,
};
