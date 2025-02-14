import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Lock, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseSideBarRoutes = ({ chapter,course }) => {
  console.log(course);
  const [isActive, setIsActive] = useState(false);
  const isCompleted = chapter.isCompleted;
  const isEnrolled = course.isEnrolled;
  const navigate = useNavigate();
  function onClick(chapterId) {
    setIsActive(true);
    navigate(`/courses/${course._id}/chapters/${chapterId}`);
  }
  return (
    <button
      key={chapter._id}
      onClick={() => onClick(chapter._id)}
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && "text-emerald-700 hover:text-emerald-700",
        isCompleted && isActive && "bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        {
          isEnrolled ? (
            <PlayCircle
              className={cn(
                "h-5 w-5",
                isActive ? "text-emerald-700" : "text-slate-500"
              )}
            />
          ) : (
            <Lock
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-slate-700 ",
            isCompleted && "text-emerald-700"
          )}
        />
          )
        }
        {chapter.title}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  );
};

export default CourseSideBarRoutes;
