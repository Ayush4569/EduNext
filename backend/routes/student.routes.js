import express from "express";
import { body } from "express-validator";
import {
  registerStudent,
  loginStudent,
  studentProfile,
  logoutStudent,
} from "../controllers/student.controller.js";
import { authStudent } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be atleast 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 3 characters long"),
  ],
  registerStudent
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Enter a password"),
  ],
  loginStudent
);

router.get("/profile", authStudent, studentProfile);
router.get("/logout", authStudent, logoutStudent);

export default router;
