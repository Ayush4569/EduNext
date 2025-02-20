import { Attachment } from "../models/attachments.model.js";
import { Course } from "../models/course.model.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../services/cloudinary.services.js";
import { validationResult } from "express-validator";

const addAttachments = async (req, res) => {
  const { courseId } = req.params;
  if (!req.files && !Array.isArray(req.files) && req.files.length == 0) {
    return res.status(400).json({ message: "Files are required" });
  }
  try {
    let uploadedUrls = await Promise.all(
      req.files.map(async (file) => {
        const url = await uploadToCloudinary(file.path);
        return url;
      })
    );

    let attachmentNames = req.files.map((file) => file.originalname);

    if (uploadedUrls.length == 0) {
      throw new Error("Failed to upload");
    }
    const attachments = uploadedUrls.map((url, idx) => ({
      attachment: url,
      attachmentName: attachmentNames[idx],
    }));
    const insertedDocs = await Attachment.insertMany(attachments);
    const attachmentIds = insertedDocs.map((att) => att._id);
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      {
        $push: { attachments: { $each: attachmentIds } },
      },
      { new: true }
    );
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Course not found or not authorized" });
    }

    // Respond with success
    const allAttachments =
      await Course.findById(courseId).populate("attachments");
    return res.status(200).json({
      message: "Attachments added successfully",
      attachments: allAttachments.attachments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const removeAttachment = async (req, res) => {
  const { courseId, attachmentId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  try {
    const attachment = await Attachment.findById(attachmentId);
    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, author: req.instructor },
      { $pull: { attachments: attachmentId } },
      { new: true }
    ).populate("attachments");
    if (!updatedCourse) {
      return res
        .status(404)
        .json({ message: "Course not found or not authorized" });
    }
    await Attachment.findByIdAndDelete(attachmentId);
    const publicId = attachment.attachment.split("/").pop().split(".")[0];
    const deletedFile = await deleteFromCloudinary(publicId);
    return res.status(200).json({
      attachments: updatedCourse.attachments,
      message: "Attachment removed",
    });
  } catch (error) {
    console.error("Error removing attachment:", error);
    return res.status(500).json({ message: error.message });
  }
};

export { addAttachments, removeAttachment };
