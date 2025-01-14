import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./database/db.js";
import studentRoutes from "./routes/student.routes.js"
import instructorRoutes from "./routes/instructor.routes.js"
import courseRoutes from "./routes/course.routes.js"
import path from "path";
dotenv.config();

connectDB();
const app = express();
// middlewares
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials:true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.resolve("./public")));

// routes
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use('/students',studentRoutes)
app.use('/instructors',instructorRoutes)
app.use('/courses',courseRoutes)


// server
app.listen(4000, () => {
  console.log("server running on port 4000");
});
