import express from "express";
import { authStudent } from "../middlewares/auth.middleware.js";
import { markChapterComplete,markChapterIncomplete } from "../controllers/course.progress.controller.js";
import { param } from "express-validator";
const router = express.Router();

router.use(authStudent);
router.patch(
  "/:courseId/:chapterId/markComplete",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
  ],
  markChapterComplete
);
router.patch(
  "/:courseId/:chapterId/markIncomplete",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
  ],
  markChapterIncomplete
);

export default router;
