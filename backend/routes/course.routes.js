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
  addAttachments,
  removeAttachment,
  createChapter,
  reorderChapters,
  getCourseChapter,
  editChapterTitle,
  editChapterDescription,
  editChapterAccess,
  uploadChapterVideo
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

router.get(
  "/:courseId",
  [param("courseId").isMongoId().withMessage("Course Id is required")],
  authInstructor,
  getCourseById
);

router.patch(
  "/editTitle/:courseId",
  authInstructor,
  courseValidator,
  updateCourseTitle
);

router.patch(
  "/editDescription/:courseId",
  authInstructor,
  courseValidator,
  updateCourseDescription
);

router.patch(
  "/editCoverImage/:courseId",
  [param("courseId").isMongoId().withMessage("Course Id is required")],
  upload.single("coverImage"),
  authInstructor,
  courseValidator,
  updateCourseImage
);

router.patch(
  "/editCategory/:courseId",
  authInstructor,
  courseValidator,
  updateCourseCategory
);

router.patch(
  "/editPrice/:courseId",
  authInstructor,
  courseValidator,
  updateCoursePrice
);

router.post(
  "/:courseId/attachments",
  authInstructor,
  courseValidator,
  upload.array("attachments", 5),
  addAttachments
);

router.delete(
  "/:courseId/attachments/:attachmentId",
  authInstructor,
  courseValidator,
  removeAttachment
);

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
)
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
)
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
)
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
)
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
)

export default router;
