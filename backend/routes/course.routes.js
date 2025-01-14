import express from 'express'
import { body ,param} from "express-validator";
import { createCourse, getCourseById,updateCourseTitle } from '../controllers/course.controller.js';
import { authInstructor } from '../middlewares/auth.middleware.js';
const router = express.Router()



router.post('/create',[
    body("title").isString().withMessage("Title is required")
],authInstructor,createCourse)

router.get('/getCourse/:courseId',[
    param("courseId").isMongoId().withMessage("Course Id is required")
],authInstructor,getCourseById)
router.patch('/editTitle/:courseId',[
    param("courseId").isMongoId().withMessage("Course Id is required")
],authInstructor,updateCourseTitle)

export default router