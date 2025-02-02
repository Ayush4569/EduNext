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

router.use("/:courseId", authInstructor, courseValidator);

router.post(
  "/create",
  [body("title").isString().withMessage("Title is required")],
  authInstructor,
  createCourse
);

router.get(
  "/:courseId",
  [param("courseId").isMongoId().withMessage("Course Id is required")],
  authInstructor,
  getCourseById
);

router.patch(
  "/:courseId/editTitle",
  [body("title").isString().withMessage("Title is required")],
  updateCourseTitle
);
router.patch(
  "/:courseId/editDescription",
  [body("description").isString().withMessage("Title is required")],
  updateCourseDescription
);
router.patch(
  "/:courseId/editCategory",
  [body("category").isString().withMessage("Title is required")],
  updateCourseCategory
);
router.patch(
  "/:courseId/editPrice",
  [body("price").isString().withMessage("Title is required")],
  updateCoursePrice
);

router.patch(
  "/:courseId/editCoverImage",
  upload.single("coverImage"),
  updateCourseImage
);

export default router;
