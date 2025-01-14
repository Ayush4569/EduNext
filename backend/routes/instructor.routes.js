import express from "express";
import { body } from "express-validator";
import {
  registerInstructor,
  loginInstructor,
  instructorProfile,
  logoutInstructor,
} from "../controllers/instructor.controller.js";
import { authInstructor } from "../middlewares/auth.middleware.js";

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
  registerInstructor
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Enter a password"),
  ],
  loginInstructor
);

router.get("/profile", authInstructor, instructorProfile);
router.get("/logout", authInstructor, logoutInstructor);

export default router;
