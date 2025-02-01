import express from "express";
import { param } from "express-validator";
import { addAttachments, removeAttachment } from "../controllers/course.controller.js";
import { authInstructor } from "../middlewares/auth.middleware.js";
import { isCourseExist as courseValidator } from "../middlewares/courseValidator.middleware.js";
import { upload } from "../services/multer.service.js";

const router = express.Router();

const validateCourseId = param("courseId").isMongoId().withMessage("Invalid Course Id");
const validateAttachmentId = param("attachmentId").isMongoId().withMessage("Invalid Attachment Id");

router.use("/:courseId", validateCourseId, authInstructor, courseValidator);

router.post("/:courseId/attachments", upload.array("attachments", 5), addAttachments);
router.delete("/:courseId/attachments/:attachmentId", validateAttachmentId, removeAttachment);

export default router;
