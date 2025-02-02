import { Course } from "../models/course.model.js";

export const chapterValidator = async(req,res,next) => {
    const { courseId,chapterId } = req.params;
    const isValidCourseChapter = await Course.findOne({
        _id: courseId,
        author: req.instructor,
        chapters: chapterId,
      }).populate("chapters");
      if (!isValidCourseChapter) {
        return res
          .status(400)
          .json({ message: "This chapter does not belong to this course" });
      }
    next();    
}