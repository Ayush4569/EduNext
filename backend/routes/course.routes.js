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
  getCourseByCategory
} from "../controllers/course.controller.js";
import { authInstructor, authStudent } from "../middlewares/auth.middleware.js";
import { isCourseExist as courseValidator } from "../middlewares/courseValidator.middleware.js";
import { upload } from "../services/multer.service.js";

const router = express.Router();

// router.use("/", authInstructor);
router.get("/",authInstructor ,getAllCourses);
router.get("/category",authStudent,getCourseByCategory)
router.post(
  "/create",
  [body("title").isString().withMessage("Title is required")],
  createCourse
);
router.get(
  "/:courseId",
  [param("courseId").isMongoId().withMessage("Course Id is required")],
  courseValidator,
  getCourseById
);
router.patch(
  "/:courseId/editTitle",
  [body("title").isString().withMessage("Title is required")],
  courseValidator,
  updateCourseTitle
);
router.patch(
  "/:courseId/editDescription",
  [body("description").isString().withMessage("Title is required")],
  courseValidator,
  updateCourseDescription
);
router.patch(
  "/:courseId/editCategory",
  [body("category").isString().withMessage("Title is required")],
  courseValidator,
  updateCourseCategory
);
router.patch(
  "/:courseId/editPrice",
  [body("price").isString().withMessage("Title is required")],
  courseValidator,
  updateCoursePrice
);
router.patch(
  "/:courseId/editPublication",
  courseValidator,
  toggleCoursePublication
);
router.patch(
  "/:courseId/editCoverImage",
  courseValidator,
  upload.single("coverImage"),
  updateCourseImage
);
router.delete("/:courseId",courseValidator,deleteCourse)
export default router;
