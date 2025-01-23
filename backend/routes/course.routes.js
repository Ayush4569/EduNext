import express from 'express'
import { body ,param} from "express-validator";
import { createCourse, getCourseById,updateCourseTitle,updateCourseImage,updateCourseDescription,updateCourseCategory,updateCoursePrice,addAttachments, removeAttachment,createChapter } from '../controllers/course.controller.js';
import { authInstructor } from '../middlewares/auth.middleware.js';
import { upload } from '../services/multer.service.js';
const router = express.Router()



router.post('/create',[
    body("title").isString().withMessage("Title is required")
],authInstructor,createCourse)

router.get('/:courseId',[
    param("courseId").isMongoId().withMessage("Course Id is required")
],authInstructor,getCourseById)

router.patch('/editTitle/:courseId',[
    param("courseId").isMongoId().withMessage("Course Id is required"),
    body("title").isString().withMessage("Title is required")
],authInstructor,updateCourseTitle)

router.patch('/editDescription/:courseId',[
    param("courseId").isMongoId().withMessage("Course Id is required"),
    body("description").isString().withMessage("description is required")
],authInstructor,updateCourseDescription)

router.patch('/editCoverImage/:courseId',[
    param("courseId").isMongoId().withMessage("Course Id is required"),
],upload.single('coverImage'),authInstructor,updateCourseImage)

router.patch('/editCategory/:courseId',[
    param("courseId").isMongoId().withMessage("Course Id is required"),
    body("category").isString().withMessage("category is required")
],authInstructor,updateCourseCategory)

router.patch('/editPrice/:courseId',[
    param("courseId").isMongoId().withMessage("Course Id is required"),
    body("price").isString().withMessage("price is required")
],authInstructor,updateCoursePrice)

router.post('/:courseId/attachments',[
    param("courseId").isMongoId().withMessage("Course Id is required")
],authInstructor,upload.array('attachments',5),addAttachments)

router.delete('/:courseId/attachments/:attachmentId',[
    param("courseId").isMongoId().withMessage("Course Id is required"),
    param("attachmentId").isMongoId().withMessage("Attachment Id is required"),
],authInstructor,removeAttachment)

router.post('/:courseId/chapters',[
    param("courseId").isMongoId().withMessage("Course Id is required"),
    body("title").isString().withMessage("Title is required")
],authInstructor,createChapter)
router.patch('/:courseId/chapters',[
    param("courseId").isMongoId().withMessage("Course Id is required"),
    body("title").isString().withMessage("Title is required")
],authInstructor,createChapter)
export default router