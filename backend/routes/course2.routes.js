import express from "express";
import { body, param } from "express-validator";
import {
  createCourse,
  getCourseById,
  updateCourseTitle,
  updateCourseImage,
  updateCourseDescription,
  updateCourseCategory,
  updateCoursePrice,
} from "../controllers/course.controller.js";
import { authInstructor } from "../middlewares/auth.middleware.js";
import { isCourseExist as courseValidator } from "../middlewares/courseValidator.middleware.js";
import { upload } from "../services/multer.service.js";

const router = express.Router();

router.post(
  "/create",
  [body("title").isString().withMessage("Title is required")],
  authInstructor,
  createCourse
);

router.get("/:courseId", authInstructor, getCourseById);

router.patch(
  "/:courseId/editTitle",
  authInstructor,
  courseValidator,
  updateCourseTitle
);
router.patch(
  "/:courseId/editDescription",
  authInstructor,
  courseValidator,
  updateCourseDescription
);
router.patch(
  "/:courseId/editCategory",
  authInstructor,
  courseValidator,
  updateCourseCategory
);
router.patch(
  "/:courseId/editPrice",
  authInstructor,
  courseValidator,
  updateCoursePrice
);

router.patch(
  "/:courseId/editCoverImage",
  upload.single("coverImage"),
  authInstructor,
  courseValidator,
  updateCourseImage
);

export default router;
