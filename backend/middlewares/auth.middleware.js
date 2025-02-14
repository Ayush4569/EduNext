import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import { Instructor } from "../models/instructor.model.js";

export const authStudent = async (req, res,next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "Please login" });
  }
  const userPayload = jwt.verify(token, process.env.JWT_SECRET);
  if (!userPayload) {
    return res.status(400).json({ message: "Invalid token,proceed to login" });
  }
  const student = await Student.findById(userPayload);
  if (!student) {
    return res.status(400).json({ message: "No such user exist" });
  }
  req.student = student;
  return next();
};

export const authInstructor = async (req, res,next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "Please login" });
  }
  const instructorPayload = jwt.verify(token, process.env.JWT_SECRET);
  if (!instructorPayload) {
    return res.status(400).json({ message: "Invalid token,proceed to login" });
  }
  const instructor = await Instructor.findById(instructorPayload);
  if (!instructor) {
    return res.status(400).json({ message: "No such instructor exist" });
  }
  req.instructor = instructor;
  return next();
};

