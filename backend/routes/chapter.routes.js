import express from "express";
import { param, body } from "express-validator";
import { authInstructor, authUser } from "../middlewares/auth.middleware.js";
import { chapterValidator } from "../middlewares/chapterValidator.middleware.js";
import { courseValidator } from "../middlewares/courseValidator.middleware.js";
import {
  createChapter,
  reorderChapters,
  getCourseChapter,
  editChapterDescription,
  editChapterTitle,
  toggleChapterAccess,
  toggleChapterPublication,
  deleteChapter,
  uploadChapterVideo,
  getSignedUrl,
} from "../controllers/chapter.controller.js";
import { upload } from "../services/multer.service.js";
const router = express.Router();

router.use(authUser);
router.post(
  "/:courseId",
  [body("title").isString().withMessage("Title is required")],
  createChapter
);
router.patch("/:courseId/reorder", chapterValidator, reorderChapters);
router.get(
  "/:courseId/:chapterId",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
  ],
  chapterValidator,
  getCourseChapter
);
router.patch(
  "/:courseId/:chapterId/editTitle",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
    body("title").isString().withMessage("Title is required"),
  ],
  chapterValidator,
  editChapterTitle
);
router.patch(
  "/:courseId/:chapterId/editDescription",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
    body("content").isString().withMessage("Description is required"),
  ],
  chapterValidator,
  editChapterDescription
);
router.patch(
  "/:courseId/:chapterId/uploadVideo",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
  ],
  upload.single("video"),
  chapterValidator,
  uploadChapterVideo
);
router.get("/:courseId/:chapterId/signedUrl/:fileName", authUser,getSignedUrl);
router.patch(
  "/:courseId/:chapterId/editAccess",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
    body("isFree").isBoolean().withMessage("Specify the access settings"),
  ],
  chapterValidator,
  toggleChapterAccess
);
router.patch(
  "/:courseId/:chapterId/editPublication",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
  ],
  chapterValidator,
  toggleChapterPublication
);
router.delete(
  "/:courseId/:chapterId",
  [
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("chapterId").isMongoId().withMessage("Chapter Id is required"),
  ],
  chapterValidator,
  deleteChapter
);
export default router;
