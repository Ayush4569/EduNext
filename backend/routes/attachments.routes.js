import express from "express";
import { param } from "express-validator";
import {
  addAttachments,
  removeAttachment,
} from "../controllers/attachment.controller.js";
import { authInstructor } from "../middlewares/auth.middleware.js";
import {  courseValidator } from "../middlewares/courseValidator.middleware.js";
import { upload } from "../services/multer.service.js";

const router = express.Router();

router.use( authInstructor);

router.post(
  "/:courseId",
  upload.array("attachments", 5),
  addAttachments
);
router.delete(
  "/:courseId/:attachmentId",
  [param("attachmentId").isMongoId().withMessage("Invalid Attachment Id")],
  removeAttachment
);

export default router;
