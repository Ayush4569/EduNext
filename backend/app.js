import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/db.js";
import studentRoutes from "./routes/student.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import courseRoutes from "./routes/course.routes.js";
import chapterRoutes from "./routes/chapter.routes.js";
import attachmentsRoutes from "./routes/attachments.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import courseProgressRoutes from "./routes/course.progress.routes.js";
import path from "path";
dotenv.config();

connectDB();
const app = express();
const port = process.env.PORT || 8000;
// middlewares
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://edunext-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(path.resolve("./public")));

// routes
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/instructors", instructorRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/chapters", chapterRoutes);
app.use("/api/v1/attachments", attachmentsRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/course-progress", courseProgressRoutes);

// server
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
