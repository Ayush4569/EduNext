import express from "express";
import { body, param } from "express-validator";
import {
  createChapter,
  reorderChapters,
  getCourseChapter,
  editChapterTitle,
  editChapterDescription,
  editChapterAccess,
  uploadChapterVideo,
} from "../controllers/course.controller.js";
import { authInstructor } from "../middlewares/auth.middleware.js";
import { isCourseExist as courseValidator } from "../middlewares/courseValidator.middleware.js";
import { upload } from "../services/multer.service.js";

const router = express.Router();

const validateCourseId = param("courseId")
  .isMongoId()
  .withMessage("Invalid Course Id");
const validateChapterId = param("chapterId")
  .isMongoId()
  .withMessage("Invalid Chapter Id");

// Nested routes under courseId
router.use("/:courseId", validateCourseId, authInstructor, courseValidator);

// Chapter CRUD routes
router.post("/:courseId/chapters", createChapter);
router.patch("/:courseId/chapters/reorder", reorderChapters);
router.get(
  "/:courseId/chapters/:chapterId",
  validateChapterId,
  getCourseChapter
);
router.patch(
  "/:courseId/chapters/:chapterId/editTitle",
  validateChapterId,
  body("title").isString().withMessage("Title is required"),
  editChapterTitle
);
router.patch(
  "/:courseId/chapters/:chapterId/editDescription",
  validateChapterId,
  body("content").isString().withMessage("Description is required"),
  editChapterDescription
);
router.patch(
  "/:courseId/chapters/:chapterId/editAccess",
  validateChapterId,
  body("isFree").isBoolean().withMessage("Specify the access settings"),
  editChapterAccess
);

router.patch(
  "/:courseId/chapters/:chapterId/uploadVideo",
  validateChapterId,
  upload.single("chapterVideo"),
  uploadChapterVideo
);

export default router;
