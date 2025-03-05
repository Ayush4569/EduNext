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
  deleteCourse,
  toggleCoursePublication,
  getAllCourses,
  getCourseByCategory,
} from "../controllers/course.controller.js";
import { authInstructor, authStudent, authUser } from "../middlewares/auth.middleware.js";
import { courseValidator } from "../middlewares/courseValidator.middleware.js";
import { upload } from "../services/multer.service.js";

const router = express.Router();
router.get("/", authUser, getAllCourses);
router.get("/instructorCourses", authInstructor, getAllCourses);
router.get("/category", authStudent, getCourseByCategory);
router.post(
  "/create",
  [body("title").isString().withMessage("Title is required")],
  authInstructor,
  createCourse
);
router.get(
  "/:courseId",
  [param("courseId").isMongoId().withMessage("Course Id is required")],
  authUser,
  courseValidator,
  getCourseById
);
router.patch(
  "/:courseId/editTitle",
  [body("title").isString().withMessage("Title is required")],
  authInstructor,
  courseValidator,
  updateCourseTitle
);
router.patch(
  "/:courseId/editDescription",
  [body("description").isString().withMessage("Title is required")],
  authInstructor,
  courseValidator,
  updateCourseDescription
);
router.patch(
  "/:courseId/editCategory",
  [body("category").isString().withMessage("Title is required")],
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
  "/:courseId/editPublication",
  authInstructor,
  courseValidator,
  toggleCoursePublication
);
router.patch(
  "/:courseId/editCoverImage",
  authInstructor,
  courseValidator,
  upload.single("coverImage"),
  updateCourseImage
);
router.delete("/:courseId", authInstructor, courseValidator, deleteCourse);
export default router;
