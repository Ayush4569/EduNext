import express from "express";
import { authInstructor } from "../middlewares/auth.middleware.js";
import { getMuxUploadUrl, webhookHandler } from "../controllers/mux.controllers.js";

const router = express.Router();
router.get('/:chapterId/generate-mux-url',authInstructor,getMuxUploadUrl)

router.post('/webhook',webhookHandler)
export default router;