import { cn } from "@/lib/utils";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VideoPlayer = ({
  videoUrl,
  isLocked,
  chapterId,
  courseId,
  setCourse,
  isChapterCompleted,
  isConfettiShown,
  setAnimateConfetti,
  setIsConfettiShown,
  isEnrolled,
}) => {
  const navigate = useNavigate();
  const [isReady, setIsReady] = useState(false);
  const completeChapter = async () => {
    try {
      const response = await axios.patch(
        `${
          import.meta.env.VITE_BASEURL
        }/api/v1/course-progress/${courseId}/${chapterId}/markComplete`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(response.data?.message || "Chapter completed");

        setCourse((prev) => ({
          ...prev,
          courseProgress: {
            completedChapter: response.data.courseProgress.completedChapter,
            progressPercentage: response.data.courseProgress.progressPercentage,
          },
        }));

        if (
          response.data.courseProgress.progressPercentage === 100 &&
          !isConfettiShown
        ) {
          setAnimateConfetti(true);
          setIsConfettiShown(true);
          localStorage.setItem("isConfettiShown", JSON.stringify(true));
        } else {
          localStorage.setItem("isConfettiShown", JSON.stringify(false));
        }

        if (response.data.nextChapter) {
          navigate(
            `/courses/${courseId}/chapters/${response.data.nextChapter}`,
            {
              replace: true,
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error completing chapter");
    }
  };
  return (
    <div className="relative aspect-video">
      {!isLocked && !isReady && (
        <div className="flex items-center justify-center inset-0 absolute bg-slate-800">
          <Loader2 className="animate-spin text-secondary h-8 w-8" />
        </div>
      )}
      {isLocked && (
        <div className="flex flex-col text-secondary gap-y-2 items-center justify-center inset-0 absolute bg-slate-800">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <video
          src={videoUrl}
          className={cn(!isReady && "hidden")}
          controls
          onEnded={!isChapterCompleted && isEnrolled ? completeChapter : null}
          onCanPlay={() => setIsReady(true)}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
