import express from "express";
import { param } from "express-validator";
import { authInstructor } from "../middlewares/auth.middleware.js";
import { isCourseExist as courseValidator } from "../middlewares/courseValidator.middleware.js";
import { upload } from "../services/multer.service.js";

const router = express.Router();

router.post(
  "/:courseId/chapters",
  authInstructor,
  courseValidator,
  createChapter
);

router.patch(
  "/:courseId/chapters/reorder",
  authInstructor,
  courseValidator,
  reorderChapters
);

router.get(
  "/:courseId/chapters/:chapterId",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
  ],
  authInstructor,
  courseValidator,
  getCourseChapter
);
router.patch(
  "/:courseId/chapters/:chapterId/editTitle",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
    body("title").isString().withMessage("Title is required"),
  ],
  authInstructor,
  courseValidator,
  editChapterTitle
);
router.patch(
  "/:courseId/chapters/:chapterId/editDescription",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
    body("content").isString().withMessage("Description is required"),
  ],
  authInstructor,
  courseValidator,
  editChapterDescription
);
router.patch(
  "/:courseId/chapters/:chapterId/editAccess",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
    body("isFree").isBoolean().withMessage("Specify the access settings"),
  ],
  authInstructor,
  courseValidator,
  editChapterAccess
);
router.patch(
  "/:courseId/chapters/:chapterId/uploadVideo",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
  ],
  upload.single("chapterVideo"),
  authInstructor,
  courseValidator,
  uploadChapterVideo
);

export default router;
