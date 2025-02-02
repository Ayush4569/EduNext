import express from "express";
import { param,body } from "express-validator";
import { authInstructor } from "../middlewares/auth.middleware.js";
import { chapterValidator } from "../middlewares/chapterValidator.middleware.js";
import { isCourseExist as courseValidator } from "../middlewares/courseValidator.middleware.js";
import {
  createChapter,
  reorderChapters,
  getCourseChapter,
  editChapterAccess,
  editChapterDescription,
  editChapterTitle,
} from "../controllers/chapter.controller.js";
const router = express.Router();

router.use("/:courseId/:chapterId", authInstructor, courseValidator,chapterValidator);

router.post(
  "/:courseId",
  [body("title").isString().withMessage("Title is required")],
  authInstructor,
  courseValidator,
  createChapter
);

router.patch(
  "/:courseId/reorder",
  authInstructor,
  courseValidator,
  reorderChapters
);

router.get(
  "/:courseId/:chapterId",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
  ],
  getCourseChapter
);
router.patch(
  "/:courseId/:chapterId/editTitle",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
    body("title").isString().withMessage("Title is required"),
  ],
  editChapterTitle
);
router.patch(
  "/:courseId/:chapterId/editDescription",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
    body("content").isString().withMessage("Description is required"),
  ],
  editChapterDescription
);
router.patch(
  "/:courseId/:chapterId/editAccess",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
    body("isFree").isBoolean().withMessage("Specify the access settings"),
  ],
  editChapterAccess
);

export default router;
