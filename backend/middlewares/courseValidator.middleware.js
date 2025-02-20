import { Course } from "../models/course.model.js";

export const courseValidator = async (req, res, next) => {
  const { courseId } = req.params;
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  next();
};
