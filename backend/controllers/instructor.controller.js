import { validationResult } from "express-validator";
import { Instructor } from "../models/instructor.model.js";

const registerInstructor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { fullname, email, password, contact } = req.body;
  const isInstructorExists = await Instructor.findOne({ email });
  if (isInstructorExists) {
    return res.status(400).json({ message: "Instructor already exist" });
  }
  const hashedPassword = await Instructor.hashPassword(password);
  const instructor = await Instructor.create({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password: hashedPassword,
    contact,
  });
  return res.status(201).json(instructor);
};

const loginInstructor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const instructor = await Instructor.findOne({ email }).select("+password");
  if (!instructor) {
    return res.status(401).json({ message: "No such instructor exists" });
  }
  const isPasswordCorrect = await instructor.verifyPassword(password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = instructor.generateAuthToken();
  res.cookie("token", token,{
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.status(200).json(instructor);
};
const instructorProfile = async (req, res, next) => {
  return res.status(200).json(req.instructor);
};
const logoutInstructor = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  res.clearCookie("token", {
    httpOnly: true,
    secure: true, 
    sameSite: "None", 
});

  return res.status(200).json({ message: "Logged out" });
};
export {
  registerInstructor,
  loginInstructor,
  instructorProfile,
  logoutInstructor,
};
