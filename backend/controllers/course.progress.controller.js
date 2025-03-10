import { CourseProgress } from "../models/course.progress.js";
import { Course } from "../models/course.model.js";

const calculateProgress = (completedChapters, totalChapters) => {
  return Math.floor((completedChapters / totalChapters) * 100);
};

export const markChapterComplete = async (req, res, next) => {
  try {
    const { courseId, chapterId } = req.params;
    const courseProgress = await CourseProgress.findOneAndUpdate(
      { userId: req.student._id, course: courseId },
      {
        $addToSet: {
          completedChapter: chapterId,
        },
      },
      { new: true }
    );
    if (!courseProgress)
      return res
        .status(404)
        .json({ message: "Course not found or not purchased" });
    const { chapters } = await Course.findOne({ _id: courseId }).populate(
      "chapters"
    );
    const publishedChapters = chapters.filter((chapter) => chapter.isPublished);
    if (!chapters || chapters.length === 0)
      return res.status(404).json({ message: "Chapters not found" });
    courseProgress.progressPercentage = calculateProgress(
      courseProgress.completedChapter.length,
      publishedChapters.length
    );
    await courseProgress.save();
    const currentChapterIndex = chapters.findIndex(
      (chapter) => chapter._id.toString() === chapterId
    );
    const nextChapter =
      currentChapterIndex !== -1 &&
      currentChapterIndex < publishedChapters.length - 1
        ? publishedChapters[currentChapterIndex + 1]
        : null;

    return res.status(200).json({
      message: "Chapter completed",
      courseProgress,
      nextChapter: nextChapter?._id,
    });
  } catch (error) {
    return next(error);
  }
};
export const markChapterIncomplete = async (req, res, next) => {
  const { courseId, chapterId } = req.params;
  try {
    const courseProgress = await CourseProgress.findOneAndUpdate(
      { userId: req.student._id, course: courseId },
      {
        $pull: {
          completedChapter: chapterId,
        },
      },
      { new: true }
    );
    if (!courseProgress)
      return res
        .status(404)
        .json({ message: "Course not found or not purchased" });
    const { chapters } = await Course.findOne({ _id: courseId }).populate(
      "chapters"
    );
    const publishedChapters = chapters.filter((chapter) => chapter.isPublished);
    if (!chapters || chapters.length === 0)
      return res.status(404).json({ message: "Chapters not found" });
    courseProgress.progressPercentage = calculateProgress(
      courseProgress.completedChapter.length,
      publishedChapters.length
    );
    await courseProgress.save();
    return res.status(200).json({
      message: "Chapter marked as incomplete",
      courseProgress,
    });
  } catch (error) {
    return next(error);
  }
};
