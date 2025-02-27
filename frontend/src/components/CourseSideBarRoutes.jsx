import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const CourseSideBarRoutes = ({ chapter, course }) => {
  const { pathname } = useLocation();
  const isActive = pathname.includes(chapter._id);
  const isCompleted = course.courseProgress?.completedChapter?.includes(chapter._id)
  const isEnrolled = course.isEnrolled;
  const isFree = chapter.isFree;
  const navigate = useNavigate();
  useEffect(() => {
    if(pathname.includes('/chapters/')) return ;
    navigate(`/courses/${course._id}/chapters/${course.chapters[0]._id}`);
  }, [course]);
  function onClick(chapterId) {
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
        {isEnrolled || isFree ? (
          isEnrolled && isCompleted ? (
           <CheckCircle className={cn(
            "h-5 w-5",
            isActive && "text-slate-500",
            isCompleted && "text-emerald-700"
          )}  />
          ) : (
            <PlayCircle
            className={cn(
              "h-5 w-5",
              isActive && "text-slate-500",
              isCompleted && "text-emerald-700"
            )}
          />
          )
          
        ) : (
          <Lock size={22} className="text-slate-500" />
        )}
        {chapter.title}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      />
    </button>
  );
};

export default CourseSideBarRoutes;
