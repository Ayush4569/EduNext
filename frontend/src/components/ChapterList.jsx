import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Badge } from './ui/badge';
import { Grip ,Pencil} from "lucide-react";

const ChapterList = ({ items }) => {
  const [chapters, setChapters] = useState(items);
  return (
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="chapters"> 
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, idx) => (
              <Draggable
                key={chapter._id}
                draggableId={chapter._id}
                index={idx}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      chapter.isFree && "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                  >
                    <div
                      className={cn(
                        "px-3 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        chapter.isFree && "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
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
                      <Pencil className="w-h4 h-4 cursor-pointer hover:opacity-75 transition" />
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
