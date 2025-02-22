import { Course } from "../models/course.model.js";

export const chapterValidator = async (req, res, next) => {
  const { courseId, chapterId } = req.params;
  try {
    let courseQuery = { _id: courseId, chapters: chapterId };
    if (req.instructor) {
      courseQuery.author = req.instructor._id;
    } else if (req.student) {
      courseQuery.enrolledStudents = req.student._id;
    } else {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    const isValidCourseChapter =
      await Course.findOne(courseQuery).populate("chapters");
    if (!isValidCourseChapter) {
      return res
        .status(400)
        .json({ message: "This chapter does not belong to this course" });
    }
    next();
  } catch (error) {
    console.log("Error validating chapter:", error);
  }
};
