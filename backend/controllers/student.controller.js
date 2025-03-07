import { validationResult } from "express-validator";
import { Student } from "../models/student.model.js";

const registerStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, contact } = req.body;
  const isStudentExists = await Student.findOne({ email });
  if (isStudentExists) {
    return res.status(400).json({ message: "Student already exist" });
  }
  const hashedPassword = await Student.hashPassword(password);
  const student = await Student.create({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password: hashedPassword,
    contact,
  });
  return res.status(201).json(student);
};

const loginStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const student = await Student.findOne({ email }).select("+password");
  if (!student) {
    return res.status(401).json({ message: "No such Student exists" });
  }
  const isPasswordCorrect = await student.verifyPassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = student.generateAuthToken();
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });
  return res.status(200).json(student);
};
const studentProfile = async (req, res, next) => {
  return res.status(200).json(req.student);
};
const logoutStudent = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  return res.status(200).json({ message: "Logged out" });
};
export { registerStudent, loginStudent, studentProfile, logoutStudent };
