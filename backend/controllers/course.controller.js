import { validationResult } from "express-validator";
import { Course } from "../models/course.model.js";
import { uploadToCloudinary,deleteFromCloudinary } from "../services/cloudinary.services.js";
import mongoose from "mongoose";
import awsService from "../services/aws.services.js";

const getAllCourses = async (req, res) => {
  if (req?.instructor) {
    try {
      const courses = await Course.find({ author: req.instructor });
      if (!courses) {
        return res.status(404).json({ message: "No courses found" });
      }
      return res.status(200).json({ courses });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  if (req?.student) {
    const { category, title } = req.query;
    let filter = { isPublished: true };
    if (category) {
      filter.category = category;
    }
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }
    try {
      const courses = await Course.aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "chapters",
            localField: "chapters",
            foreignField: "_id",
            as: "chapters",
          },
        },
        {
          $addFields: {
            isEnrolled: {
              $in: [
                new mongoose.Types.ObjectId(req.student?._id),
                "$enrolledStudents",
              ],
            },
            enrolledStudents: {
              $size: "$enrolledStudents",
            },
          },
        },
        {
          $lookup: {
            from: "courseprogresses",
            let: { courseId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          "$userId",
                          new mongoose.Types.ObjectId(req.student._id),
                        ],
                      },
                      {
                        $eq: ["$course", "$$courseId"],
                      },
                    ],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  completedChapters: 1,
                  progressPercentage: 1,
                },
              },
            ],
            as: "courseProgress",
          },
        },
        {
          $project: {
            title: 1,
            category: 1,
            price: 1,
            coverImage: 1,
            isPublished: 1,
            createdAt: 1,
            isEnrolled: 1,
            enrolledStudents: 1,
            chapters: 1,
            courseProgress: {
              $cond: {
                if: "$isEnrolled",
                then: {
                  $ifNull: [{ $arrayElemAt: ["$courseProgress", 0] }, null],
                },
                else: "$$REMOVE",
              },
            },
          },
        },
      ]);
      if (!courses) {
        return res.status(404).json({ message: "No courses found" });
      }
      return res.status(200).json({ courses });
    } catch (error) {
      console.log("Error fetching courses", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
const createCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  const { title } = req.body;
  const newCourse = await Course.create({ title, author: req.instructor._id });
  await req.instructor.updateOne({
    $push: { courses: newCourse._id },
  });
  return res.status(200).json(newCourse);
};
const getCourseById = async (req, res) => {
  const { courseId } = req.params;
  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course id" });
  }
  // 1️⃣ If Instructor is requesting the course
  if (req.instructor) {
    const course = await Course.findOne({
      _id: courseId,
      author: req.instructor,
    })
      .populate("chapters")
      .populate("attachments");

    if (!course) {
      return res.status(404).json({ message: "No such course exists" });
    }

    return res.status(200).json({ course });
  }

  // 2️⃣ If Student is requesting the course
  if (req.student) {
    const course = await Course.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(courseId) },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "chapters",
          foreignField: "_id",
          as: "chapters",
        },
      },
      {
        $lookup: {
          from: "attachments",
          localField: "attachments",
          foreignField: "_id",
          as: "attachments",
        },
      },
      {
        $addFields: {
          isEnrolled: {
            $in: [
              new mongoose.Types.ObjectId(req.student._id),
              "$enrolledStudents",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "courseprogresses",
          let: { courseId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: [
                        "$userId",
                        new mongoose.Types.ObjectId(req.student._id),
                      ],
                    },
                    {
                      $eq: ["$course", "$$courseId"],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                completedChapter: 1,
                progressPercentage: 1,
              },
            },
          ],
          as: "courseProgress",
        },
      },
      {
        $project: {
          title: 1,
          category: 1,
          price: 1,
          coverImage: 1,
          isPublished: 1,
          createdAt: 1,
          chapters: 1,
          attachments: 1,
          isEnrolled: 1,
          courseProgress: {
            $cond: {
              if: "$isEnrolled",
              then: {
                $ifNull: [{ $arrayElemAt: ["$courseProgress", 0] }, null],
              },
              else: "$$REMOVE",
            },
          },
        },
      },
    ]);

    if (course.length === 0) {
      return res.status(404).json({ message: "No such course exists" });
    }

    return res.status(200).json({ course: course[0] });
  }

  return res.status(400).json({ message: "Invalid request" });
};

const getCourseByCategory = async (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }
  const matchedCourses = await Course.find({ category });
  if (matchedCourses.length === 0) {
    return res.status(404).json({ message: "No courses found" });
  }
  return res
    .status(200)
    .json({ courses: matchedCourses, message: "Courses fetched successfully" });
};
const updateCourseTitle = async (req, res) => {
  const { title } = req.body;
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      {
        title,
      },
      { new: true }
    );
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Course not found or not accessible" });
    }
    return res.status(200).json({ message: "course title updated", title });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({
      message: "Failed to update title ",
    });
  }
};
const updateCourseDescription = async (req, res) => {
  const { description } = req.body;
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { description }
    );
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Course not found or not accessible" });
    }
    return res
      .status(200)
      .json({ message: "course description updated", description });
  } catch (error) {
    console.log("updateCourseDescription Error:", error);
    res.status(500).json({
      message: "Failed to update description ",
    });
  }
};

const updateCourseImage = async (req, res) => {
  1;
  const { courseId } = req.params;
  const coverImage = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  if (!coverImage) {
    return res.status(400).json({ message: "upload an image" });
  }
  try {
    const course = await Course.findOne({_id:courseId,author:req.instructor._id});
    if(course.coverImage){
      await deleteFromCloudinary(course.coverImage.split("/").pop().split(".")[0]);
    }
    const uploadedPhotoUrl = await uploadToCloudinary(coverImage.path);
    if (!uploadedPhotoUrl) {
      return res.status(400).json({ message: "falied to upload image" });
    }
    course.coverImage = uploadedPhotoUrl;
    await course.save();
    return res
      .status(200)
      .json({ message: "course image uploaded", url: uploadedPhotoUrl });
  } catch (error) {
    console.log("updateCourseImage Error:", error);
    res.status(500).json({
      message: "Failed to updateCourseImage ",
    });
  }
};
const updateCourseCategory = async (req, res) => {
  const { category } = req.body;
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { category }
    );
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Course not found or not accessible" });
    }
    return res
      .status(200)
      .json({ message: "course category updated", category });
  } catch (error) {
    console.log("updateCoursecategory Error:", error);
    res.status(500).json({
      message: "Failed to update category ",
    });
  }
};
const updateCoursePrice = async (req, res) => {
  const { price } = req.body;
  const { courseId } = req.params;

  if (price === undefined || price < 0) {
    return res.status(400).json({ message: "Invalid price" });
  }
  try {
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { price }
    );
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Course not found or not accessible" });
    }
    return res.status(200).json({ message: "course price updated", price });
  } catch (error) {
    console.log("updateCourseprice Error:", error);
    res.status(500).json({
      message: "Failed to update price ",
    });
  }
};
const toggleCoursePublication = async (req, res) => {
  const { courseId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const updatedCourseState = await Course.findOneAndUpdate(
      { _id: courseId },
      [
        {
          $set: {
            isPublished: {
              $not: ["$isPublished"],
            },
          },
        },
      ],
      { new: true }
    );
    if (!updatedCourseState) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({
      message: updatedCourseState.isPublished
        ? "Course published"
        : "Course unpublished",
      isPublished: updatedCourseState.isPublished,
    });
  } catch (error) {
    console.error("Error updating course publication:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findOne({
      _id: courseId,
      author: req.instructor,
    }).populate("chapters");

    const deletedCourseVideos = await Promise.all(
      course.chapters.map(async (chapter) => {
        if (chapter.video?.fileName) {
          return  awsService.deleteFile(chapter.video.fileName);
        }
        return Promise.resolve();
      })
    ).catch((error) => {
      throw new Error("Failed to delete course videos");
    });

    const deleteCourseImage = await deleteFromCloudinary(course.coverImage?.split("/").pop().split(".")[0]);

    const deletedCourse = await Course.findOneAndDelete({
      _id: courseId,
      author: req.instructor,
    });
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    console.error("Error deleting course :", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export {
  getAllCourses,
  createCourse,
  getCourseById,
  getCourseByCategory,
  updateCourseTitle,
  updateCourseDescription,
  updateCourseImage,
  updateCourseCategory,
  updateCoursePrice,
  toggleCoursePublication,
  deleteCourse,
};
