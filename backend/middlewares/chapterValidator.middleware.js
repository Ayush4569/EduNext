import { Course } from "../models/course.model.js";

export const chapterValidator = async (req, res, next) => {
  const { courseId, chapterId } = req.params;
  try {
    let courseQuery = { _id: courseId };
    if (req.instructor) {
      courseQuery.author = req.instructor._id;
    }

    const course = await Course.findOne(courseQuery);
    if (!course) {
      return res.status(400).json({ message: "Course not found or unauthorized" });
    }

    const chapterExists = course.chapters.some(ch => ch.equals(chapterId));
    
    if (!chapterExists) {
      return res.status(400).json({ message: "This chapter does not belong to this course" });
    }
    
    next();
    
  } catch (error) {
    console.log("Error validating chapter:", error);
  }
};
