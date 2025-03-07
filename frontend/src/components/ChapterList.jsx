import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Grip, Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ChapterList = ({
  initialChapters,
  setCourse,
  courseId,
  setIsUpdating,
}) => {
  const [chapters, setChapters] = useState(initialChapters);
  const navigate = useNavigate();
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    setIsUpdating(true);
    const chapterOrder = Array.from(chapters);
    const [displacedChapter] = chapterOrder.splice(result.source.index, 1);
    chapterOrder.splice(result.destination.index, 0, displacedChapter);
    setChapters(chapterOrder);
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASEURL}/api/v1/chapters/${courseId}/reorder`,
        {
          chapters: chapterOrder,
        },
        {
          withCredentials: true,
        }
      );

      if ( response.status === 200) {
        setCourse((prev) => ({
          ...prev,
          chapters: response.data.reorderedChapters,
        }));
        toast.success(response?.data?.message || "Chapter reordered");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  const onEdit = (chapterId) => {
     navigate(
      `/teacher/courses/${courseId}/${chapterId}/editChapter`
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {chapters?.map((chapter, index) => (
              <Draggable
                key={chapter._id}
                draggableId={chapter._id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-3 text-sm",
                      chapter.isFree &&
                        "bg-sky-100 border-gray-500 text-sky-700"
                    )}
                  >
                    <div
                      className={cn(
                        "px-3 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        chapter.isFree && "border-r-sky-200 hover:bg-sky-200"
                      )}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    <p>{chapter.title}</p>
                    <div className="ml-auto flex items-center gap-x-2 pr-2">
                      {chapter.isFree && <Badge>Free</Badge>}
                      <Badge
                        className={cn(
                          "bg-slate-500 ",
                          chapter.isPublished && "bg-sky-700"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(chapter._id)}
                        className="w-5 h-5  hover:opacity-75 transition"
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ChapterList;
